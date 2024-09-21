import { Request, Response } from 'express';
import { TokenPair } from '../models/tokenPair.model';
import { ITokenPair } from '../interfaces/tokenPair.interface';

export async function viewTokenPairs(req: Request, res: Response) {
  res.status(200).json({ tokenPairs: [] });
}

export async function addTokenPair(req: Request, res: Response) {
  const tokenPair: ITokenPair = await TokenPair.create({
    pair: req.body.pair,
    dataSources: req.body.dataSources,
  });

  // TODO: Handle duplicate error
  // TODO: Remove extra fields from response (MongoDB related ones)

  res.status(201).json(tokenPair.toJSON());
}

export async function deleteTokenPair(req: Request, res: Response) {
  res.status(204).json();
}

export async function updateTokenPair(req: Request, res: Response) {
  res.status(200).json({ message: 'Token pair updated!' });
}
