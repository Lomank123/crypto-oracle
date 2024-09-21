import { Request, Response } from 'express';
import { DataSources } from '../../common/enums';

export async function viewDataSources(req: Request, res: Response) {
  res.status(200).json({ dataSources: DataSources });
}

export async function addDataSource(req: Request, res: Response) {
  res
    .status(201)
    .json({ message: `Data source added for ${req.params.tokenPairId}!` });
}

export async function deleteDataSource(req: Request, res: Response) {
  console.log(
    `Data source ${req.params.dataSourceId} deleted for ${req.params.tokenPairId}!`,
  );
  res.status(204).json();
}
