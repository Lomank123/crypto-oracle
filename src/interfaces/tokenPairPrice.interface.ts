import { IDocument } from './document.interface';
import { DataSources } from '../../common/enums';

export interface ITokenPairPrice extends IDocument {
  tokenPairId: string;
  dataSource: DataSources;
  price: number;
}
