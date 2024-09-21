import { TokenPair } from '../models/tokenPair.model';
import { DataSources } from '../../common/enums';
import { IDataSourceService } from '../interfaces/dataSourceService.interface';
import { CryptoCompareDataSourceService } from './dataSource/cryptoCompareDataSource.service';
import { CoinbaseDataSourceService } from './dataSource/coinbaseDataSource.service';
import { TokenPairPrice } from '../models/tokenPairPrice.model';

export class FetchPriceService {
  dataSourceFactory(dataSourceId: DataSources): IDataSourceService {
    switch (dataSourceId) {
      case DataSources.cryptoCompare:
        return new CryptoCompareDataSourceService();
      case DataSources.coinbase:
        return new CoinbaseDataSourceService();
    }

    throw new Error('Data source not found!');
  }

  async fetchPrices() {
    const tokenPairs = await TokenPair.find().exec();

    for (const tokenPair of tokenPairs) {
      for (const dataSource of tokenPair.dataSources) {
        const DataSourceService = this.dataSourceFactory(dataSource);

        try {
          const price = await DataSourceService.fetchPrice(tokenPair.pair);
          await TokenPairPrice.findOneAndUpdate(
            {
              tokenPairId: tokenPair.id,
              dataSource: dataSource,
            },
            { price: price },
            { upsert: true },
          );
        } catch (err) {
          console.error('Error occurred during price fetching');
        }
      }
    }
  }
}
