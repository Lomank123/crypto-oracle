import mongoose, { Model, Schema } from 'mongoose';
import { ITokenPair } from '../interfaces/tokenPair.interface';
import { DataSources } from '../enums';

const TokenPairSchema = new Schema<ITokenPair>(
  {
    pair: { type: String, required: true, unique: true },
    dataSources: { type: [String], required: true, enum: DataSources },
  },
  { timestamps: true },
);

export const TokenPair: Model<ITokenPair> = mongoose.model(
  'TokenPair',
  TokenPairSchema,
);
