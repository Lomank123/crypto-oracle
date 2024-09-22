import { Request, Response } from 'express';
import { DataSources } from '../enums';
import { TokenPairService } from '../services/tokenPairService';
import { DataSourceService } from '../services/dataSource.service';

export async function viewDataSources(req: Request, res: Response) {
  const service = new DataSourceService();
  const dataSources = await service.getDataSources();
  res.status(200).json(dataSources);
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
