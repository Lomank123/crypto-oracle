import { DataSources } from '../enums';
import { TokenPairPrice } from '../models/tokenPairPrice.model';
import {
  LAST_CHECKED_DELTA_IN_MINS,
  UNRELIABLE_PRICES_PERCENTAGE_LIMIT,
} from '../settings';

export class DataSourceService {
  async getDataSources(): Promise<Object[]> {
    const result: Object[] = [];

    // Calculate reliability
    for (const [key, dataSourceId] of Object.entries(DataSources)) {
      const allPrices = await TokenPairPrice.find({
        dataSource: dataSourceId,
      }).countDocuments();

      const unreliablePrices = await TokenPairPrice.find({
        dataSource: dataSourceId,
        $or: [
          { isOutOfBounds: true },
          {
            lastCheckedAt: {
              $lte: new Date(
                Date.now() - LAST_CHECKED_DELTA_IN_MINS * 60 * 1000,
              ),
            },
          },
        ],
      }).countDocuments();

      const unreliablePricesPercentage = (unreliablePrices * 100) / allPrices;
      const dataSourceItem = {
        dataSource: dataSourceId,
        isReliable: true,
      };

      if (unreliablePricesPercentage >= UNRELIABLE_PRICES_PERCENTAGE_LIMIT) {
        dataSourceItem['isReliable'] = false;
      }

      result.push(dataSourceItem);
    }

    return result;
  }
}
