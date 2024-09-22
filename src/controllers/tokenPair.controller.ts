import { Request, Response } from 'express';
import { TokenPair } from '../models/tokenPair.model';
import { ITokenPair } from '../interfaces/tokenPair.interface';
import { TokenPairPrice } from '../models/tokenPairPrice.model';
import { NotFoundError } from '../errors/not-found.error';
import { MongoServerError } from 'mongodb';
import { ITokenPairPrice } from '../interfaces/tokenPairPrice.interface';
import { LAST_CHECKED_DELTA_IN_MINS } from '../settings';
import { medianPrice } from '../utils/utils';
import { redisClient } from '../index';

export async function viewTokenPairs(req: Request, res: Response) {
  const tokenPairs = await TokenPair.aggregate([
    {
      $lookup: {
        from: 'tokenpairprices',
        localField: '_id',
        foreignField: 'tokenPairId',
        as: 'prices',
      },
    },
  ]);
  res.status(200).json(tokenPairs);
}

export async function viewTokenPairPrice(req: Request, res: Response) {
  const pair = req.params.tokenPair.replace('-', '/');
  const tokenPair: ITokenPair | null = await TokenPair.findOne({ pair }).exec();

  if (!tokenPair) {
    throw new NotFoundError('Pair not found.');
  }

  const cachedData = await redisClient.get(tokenPair.id);

  if (cachedData) {
    console.log('CACHE HIT!!!');
    res.status(200).json(JSON.parse(cachedData));
    return;
  }

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
    res.status(200).json({ pair: tokenPair.pair, price: -1 });
    return;
  }

  // TODO: Move logic to services/utils
  const median = medianPrice(tokenPairPrices);
  const responseData = { pair: tokenPair.pair, price: median };

  await redisClient.set(tokenPair.id, JSON.stringify(responseData), { EX: 60 });
  res.status(200).json(responseData);
}

export async function addTokenPair(req: Request, res: Response) {
  // TODO: Move logic to services
  try {
    const tokenPair: ITokenPair = await TokenPair.create({
      pair: req.body.pair,
      dataSources: req.body.dataSources,
    });
    res.status(201).json(tokenPair);
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      res.status(400).json({ message: 'Token pair already exists' });
      return;
    }
    throw err;
  }
}

export async function deleteTokenPair(req: Request, res: Response) {
  // I have no idea why does mongoose
  // not returning model object without .exec().
  // In my previous project it worked without it.
  const tokenPair: ITokenPair | null = await TokenPair.findById(
    req.params.tokenPairId,
  ).exec();

  if (!tokenPair) {
    throw new NotFoundError('Pair not found.');
  }

  // TODO: Single transaction
  await TokenPairPrice.deleteMany({ tokenPairId: tokenPair.id });
  await tokenPair.deleteOne();

  res.status(204).json();
}

export async function updateTokenPair(req: Request, res: Response) {
  const tokenPair: ITokenPair | null = await TokenPair.findById(
    req.params.tokenPairId,
  ).exec();

  if (!tokenPair) {
    throw new NotFoundError('Pair not found.');
  }

  const dataSourcesToDelete = tokenPair.dataSources.filter(
    (dataSource) => !req.body.dataSources.includes(dataSource),
  );

  // TODO: Single transaction
  // If we allow to change the pair field,
  // then all previous prices must be deleted
  tokenPair.dataSources = req.body.dataSources;
  await tokenPair.save();

  if (dataSourcesToDelete.length) {
    // Deleting replaced data source prices
    await TokenPairPrice.deleteMany({
      dataSource: { $in: dataSourcesToDelete },
    });
  }

  res.status(200).json(tokenPair);
}
