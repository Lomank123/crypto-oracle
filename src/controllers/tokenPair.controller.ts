import { Request, Response } from 'express';

export async function viewTokenPairs(req: Request, res: Response) {
  res.status(200).json({ tokenPairs: [] });
}

export async function addTokenPair(req: Request, res: Response) {
  // TODO: Validate input format: BTC/ETH. Use regex
  res.status(201).json({ message: 'Token pair created!' });
}

export async function deleteTokenPair(req: Request, res: Response) {
  res.status(204).json();
}

export async function updateTokenPair(req: Request, res: Response) {
  res.status(200).json({ message: 'Token pair updated!' });
}
