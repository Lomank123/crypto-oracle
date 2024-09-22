import { Request, Response } from 'express';
import { TokenPairService } from '../services/tokenPairService';

export async function viewTokenPairs(req: Request, res: Response) {
  const service = new TokenPairService();
  const tokenPairs = await service.getAllTokenPairs();
  res.status(200).json(tokenPairs);
}

export async function viewTokenPairPrice(req: Request, res: Response) {
  const service = new TokenPairService();
  const tokenPairPrice = await service.getTokenPairPrice(req.params.tokenPair);
  res.status(200).json(tokenPairPrice);
}

export async function addTokenPair(req: Request, res: Response) {
  const service = new TokenPairService();
  const tokenPair = await service.createTokenPair(
    req.body.pair,
    req.body.dataSources,
  );
  res.status(201).json(tokenPair);
}

export async function deleteTokenPair(req: Request, res: Response) {
  const service = new TokenPairService();
  await service.deleteTokenPair(req.params.tokenPairId);
  res.status(204).send();
}

export async function updateTokenPair(req: Request, res: Response) {
  const service = new TokenPairService();
  const tokenPair = await service.updateTokenPair(
    req.params.tokenPairId,
    req.body.dataSources,
  );
  res.status(200).json(tokenPair);
}
