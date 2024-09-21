import mongoose, { Model, Schema } from 'mongoose';
import { DataSources } from '../../common/enums';
import { ITokenPairPrice } from '../interfaces/tokenPairPrice.interface';

const TokenPairPriceSchema = new Schema<ITokenPairPrice>(
  {
    pair: { type: String, required: true, unique: true },
    dataSource: { type: String, required: true, enum: DataSources },
  },
  { timestamps: true },
);

export const TokenPairPrice: Model<ITokenPairPrice> = mongoose.model(
  'TokenPair',
  TokenPairPriceSchema,
);
