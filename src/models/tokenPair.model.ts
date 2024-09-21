import mongoose, { Model, Schema } from 'mongoose';
import { ITokenPair } from '../interfaces/tokenPair.interface';
import { DataSources } from '../../common/enums';

const TokenPairSchema = new Schema<ITokenPair>(
  {
    pair: { type: String, required: true, unique: true },
    dataSources: { array: { type: String, required: true, enum: DataSources } },
  },
  { timestamps: true },
);

export const TokenPairModel: Model<ITokenPair> = mongoose.model(
  'TokenPair',
  TokenPairSchema,
);
