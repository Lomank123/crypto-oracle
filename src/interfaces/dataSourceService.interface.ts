export interface IDataSourceService {
  url: string;

  fetchPrice(pair: string): Promise<number>;
}
