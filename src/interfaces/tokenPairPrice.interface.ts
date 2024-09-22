import { IDocument } from './document.interface';
import { DataSources } from '../../common/enums';
import mongoose from 'mongoose';

export interface ITokenPairPrice extends IDocument {
  tokenPairId: mongoose.Schema.Types.ObjectId;
  dataSource: DataSources;
  price: number;

  // For validity check
  lastCheckedAt: Date;
  isOutOfBounds: boolean;
}
