import { Request, Response } from 'express';
import { TokenPair } from '../models/tokenPair.model';
import { ITokenPair } from '../interfaces/tokenPair.interface';
import { TokenPairPrice } from '../models/tokenPairPrice.model';
import { NotFoundError } from '../errors/not-found.error';
import { MongoServerError } from 'mongodb';

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
