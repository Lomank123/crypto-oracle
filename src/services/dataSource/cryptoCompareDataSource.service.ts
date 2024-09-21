import { IDataSourceService } from '../../interfaces/dataSourceService.interface';
import axios from 'axios';

export class CryptoCompareDataSourceService implements IDataSourceService {
  url = 'https://min-api.cryptocompare.com/data/price';

  async fetchPrice(pair: string): Promise<number> {
    const symbols = pair.split('/');
    const newUrl = new URL(this.url);
    newUrl.searchParams.append('fsym', symbols[0]);
    newUrl.searchParams.append('tsyms', symbols[1]);
    const response = await axios.get(newUrl.toString());
    const price = response.data[symbols[1]];

    if (!price) {
      throw new Error(
        'Error occurred during CryptoCompare data source request',
      );
    }

    return price;
  }
}
