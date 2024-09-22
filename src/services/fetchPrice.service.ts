import { TokenPair } from '../models/tokenPair.model';
import { DataSources } from '../../common/enums';
import { IDataSourceService } from '../interfaces/dataSourceService.interface';
import { CryptoCompareDataSourceService } from './dataSource/cryptoCompareDataSource.service';
import { CoinbaseDataSourceService } from './dataSource/coinbaseDataSource.service';
import { TokenPairPrice } from '../models/tokenPairPrice.model';
import { ITokenPair } from '../interfaces/tokenPair.interface';

export class FetchPriceService {
  async fetchPrices() {
    const tokenPairs = await TokenPair.find().exec();

    for (const tokenPair of tokenPairs) {
      for (const dataSource of tokenPair.dataSources) {
        const DataSourceService = this.dataSourceFactory(dataSource);

        // TODO: Use Promise.all() to fetch. Then try bulk upsert (if possible)
        try {
          const price = await DataSourceService.fetchPrice(tokenPair.pair);
          await TokenPairPrice.findOneAndUpdate(
            {
              tokenPairId: tokenPair.id,
              dataSource: dataSource,
            },
            {
              price: price,
              lastCheckedAt: new Date(),
            },
            { upsert: true },
          );
        } catch (err) {
          console.error('Error occurred during price fetching');
        }
      }

      // Check which prices fall out of bounds
      await this.updatePricesValidity(tokenPair);
    }
  }

  dataSourceFactory(dataSourceId: DataSources): IDataSourceService {
    switch (dataSourceId) {
      case DataSources.cryptoCompare:
        return new CryptoCompareDataSourceService();
      case DataSources.coinbase:
        return new CoinbaseDataSourceService();
    }

    throw new Error('Data source not found!');
  }

  async updatePricesValidity(tokenPair: ITokenPair) {
    const tokenPairPrices = await TokenPairPrice.find({
      tokenPairId: tokenPair.id,
    })
      .sort('price')
      .exec();
    const length = tokenPairPrices.length;

    if (length < 2) {
      return;
    }

    // IQR calculation
    const q1 = tokenPairPrices[Math.floor(length / 4)]; // 25%
    const q3 = tokenPairPrices[Math.floor((length * 3) / 4)]; // 75%
    const iqr = q3.price - q1.price;

    // Tukey’s fences
    const k = 1.5;
    // Can be negative in certain scenarios
    const lowerBound = q1.price - k * iqr;
    const upperBound = q3.price + k * iqr;

    // TODO: Can be optimized (updateMany with right condition)
    for (const tokenPairPrice of tokenPairPrices) {
      const price = tokenPairPrice.price;
      tokenPairPrice.isOutOfBounds = price < lowerBound || price > upperBound;
      await tokenPairPrice.save();
    }
  }
}
