import { ITokenPair } from '../interfaces/tokenPair.interface';
import { TokenPair } from '../models/tokenPair.model';
import { NotFoundError } from '../errors/notFound.error';
import { TokenPairPrice } from '../models/tokenPairPrice.model';
import { DataSources } from '../enums';
import { MongoServerError } from 'mongodb';
import { BadRequestError } from '../errors/badRequest.error';
import { redisClient } from '../index';
import { ITokenPairPrice } from '../interfaces/tokenPairPrice.interface';
import {
  LAST_CHECKED_DELTA_IN_MINS,
  REDIS_CACHE_EXPIRATION_IN_SECS,
} from '../settings';
import { calculateMedianPrice } from '../utils/calculateMedianPrice.util';

export class TokenPairService {
  async getAllTokenPairs() {
    return TokenPair.aggregate([
      {
        $lookup: {
          from: 'tokenpairprices',
          localField: '_id',
          foreignField: 'tokenPairId',
          as: 'prices',
        },
      },
    ]);
  }

  async createTokenPair(
    pair: string,
    dataSources: DataSources[],
  ): Promise<ITokenPair> {
    try {
      return await TokenPair.create({
        pair,
        dataSources,
      });
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new BadRequestError('Token pair already exists');
      }
      throw err;
    }
  }

  // NOTE: Use single transaction
  async deleteTokenPair(tokenPairId: string) {
    const tokenPair: ITokenPair | null =
      await TokenPair.findById(tokenPairId).exec();

    if (!tokenPair) {
      return;
    }

    await TokenPairPrice.deleteMany({ tokenPairId: tokenPair.id });
    await tokenPair.deleteOne();
  }

  // NOTE: Use single transaction
  async updateTokenPair(
    tokenPairId: string,
    dataSources: DataSources[],
  ): Promise<ITokenPair> {
    const tokenPair: ITokenPair | null =
      await TokenPair.findById(tokenPairId).exec();

    if (!tokenPair) {
      throw new NotFoundError('Pair not found.');
    }

    const dataSourcesToDelete = tokenPair.dataSources.filter(
      (dataSource) => !dataSources.includes(dataSource),
    );

    // If we allow to change the pair field,
    // then all previous prices must be deleted
    tokenPair.dataSources = dataSources;
    await tokenPair.save();

    // Deleting replaced data source prices
    if (dataSourcesToDelete.length) {
      await TokenPairPrice.deleteMany({
        dataSource: { $in: dataSourcesToDelete },
      });
    }

    return tokenPair;
  }

  async getTokenPairPrice(tokenPairString: string): Promise<Object> {
    const pair = tokenPairString.replace('-', '/');
    const tokenPair: ITokenPair | null = await TokenPair.findOne({
      pair,
    }).exec();

    if (!tokenPair) {
      throw new NotFoundError('Pair not found');
    }

    try {
      const cachedData = await redisClient.get(tokenPair.id);

      if (cachedData) {
        // TODO: Remove
        console.log('CACHE HIT!!!');
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.error(err);
      console.error('Error occurred when accessing cache');
    }

    // TODO: Try to query only price field
    const tokenPairPrices: ITokenPairPrice[] = await TokenPairPrice.find({
      tokenPairId: tokenPair.id,
      isOutOfBounds: false,
      lastCheckedAt: {
        $gt: new Date(Date.now() - LAST_CHECKED_DELTA_IN_MINS * 60 * 1000),
      },
    })
      .sort('price')
      .exec();

    if (!tokenPairPrices.length) {
      return { pair: tokenPair.pair, price: -1 };
    }

    const sortedPrices: number[] = [];

    for (const tokenPairPrice of tokenPairPrices) {
      sortedPrices.push(tokenPairPrice.price);
    }

    const median = calculateMedianPrice(sortedPrices);
    const result = { pair: tokenPair.pair, price: median };

    try {
      await redisClient.set(tokenPair.id, JSON.stringify(result), {
        EX: REDIS_CACHE_EXPIRATION_IN_SECS,
      });
    } catch (err) {
      console.error(err);
      console.error('Error occurred when writing to cache');
    }

    return result;
  }

  async addDataSource(
    tokenPairId: string,
    dataSource: DataSources,
  ): Promise<ITokenPair> {
    const tokenPair = await TokenPair.findById(tokenPairId).exec();

    if (!tokenPair) {
      throw new NotFoundError('Pair not found.');
    }
    if (tokenPair.dataSources.includes(dataSource)) {
      throw new BadRequestError('Data source already exists');
    }

    tokenPair.dataSources.push(dataSource);
    await tokenPair.save();

    return tokenPair;
  }

  async deleteDataSource(tokenPairId: string, dataSource: DataSources) {
    const tokenPair = await TokenPair.findById(tokenPairId).exec();

    if (!tokenPair) {
      return;
    }

    if (tokenPair.dataSources.includes(dataSource)) {
      tokenPair.dataSources = tokenPair.dataSources.filter(
        (tokenPairDataSource) => tokenPairDataSource !== dataSource,
      );
      await TokenPairPrice.deleteMany({
        tokenPairId: tokenPair.id,
        dataSource: dataSource,
      });
      await tokenPair.save();
    }
  }
}
