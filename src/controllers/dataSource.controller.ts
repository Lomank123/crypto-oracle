import { Request, Response } from 'express';
import { DataSources } from '../enums';
import { TokenPairService } from '../services/tokenPairService';

export async function viewDataSources(req: Request, res: Response) {
  // TODO: Add reliability flag to each data source based on prices
  res.status(200).json({ dataSources: DataSources });
}

export async function addDataSource(req: Request, res: Response) {
  const service = new TokenPairService();
  const tokenPair = await service.addDataSource(
    req.params.tokenPairId,
    req.body.dataSourceId,
  );
  res.status(200).json(tokenPair);
}

export async function deleteDataSource(req: Request, res: Response) {
  const service = new TokenPairService();
  await service.deleteDataSource(
    req.params.tokenPairId,
    req.params.dataSourceId as DataSources,
  );
  res.status(204).send();
}
