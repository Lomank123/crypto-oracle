import { Request, Response } from 'express';
import { FetchPriceService } from '../services/fetchPrice.service';

export async function refreshPrices(req: Request, res: Response) {
  const service = new FetchPriceService();
  await service.fetchPrices();
  res.status(200).json({ message: 'Prices have been refreshed successfully!' });
}
