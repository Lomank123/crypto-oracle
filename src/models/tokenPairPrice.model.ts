import mongoose, { Model, Schema } from 'mongoose';
import { DataSources } from '../enums';
import { ITokenPairPrice } from '../interfaces/tokenPairPrice.interface';

const TokenPairPriceSchema = new Schema<ITokenPairPrice>(
  {
    tokenPairId: { type: Schema.Types.ObjectId, required: true },
    dataSource: { type: String, required: true, enum: DataSources },
    price: { type: Number, required: true },
    lastCheckedAt: { type: Date, required: true },
    isOutOfBounds: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TokenPairPrice: Model<ITokenPairPrice> = mongoose.model(
  'TokenPairPrice',
  TokenPairPriceSchema,
);
