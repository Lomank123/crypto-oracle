import { IDocument } from './document.interface';
import { DataSources } from '../enums';

export interface ITokenPair extends IDocument {
  pair: string;
  dataSources: DataSources[];
}
