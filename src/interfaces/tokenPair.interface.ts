import { IDocument } from './document.interface';
import { DataSources } from '../../common/enums';

export interface ITokenPair extends IDocument {
  pair: string;
  dataSources: DataSources[];
}
