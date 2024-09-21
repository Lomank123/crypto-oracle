import { IDataSourceService } from '../../interfaces/dataSourceService.interface';
import axios from 'axios';

export class CoinbaseDataSourceService implements IDataSourceService {
  url = 'https://api.coinbase.com/v2/prices';

  async fetchPrice(pair: string): Promise<number> {
    const symbols = pair.replace('/', '-');
    const response = await axios.get(`${this.url}/${symbols}/spot`);
    const price = response.data['data']['amount'];

    if (!price) {
      throw new Error('Error occurred during Coinbase data source request');
    }

    return parseFloat(price);
  }
}
