import { Request, Response } from 'express';
import { DataSources } from '../../common/enums';
import { TokenPair } from '../models/tokenPair.model';
import { NotFoundError } from '../errors/not-found.error';
import { TokenPairPrice } from '../models/tokenPairPrice.model';
import { FetchPriceService } from '../services/fetchPrice.service';

export async function refreshPrices(req: Request, res: Response) {
  const service = new FetchPriceService();
  await service.fetchPrices();
  res.status(200).json({ message: 'Prices have been refreshed successfully!' });
}

export async function viewDataSources(req: Request, res: Response) {
  // TODO: Add reliability flag to each data source based on prices
  res.status(200).json({ dataSources: DataSources });
}

export async function addDataSource(req: Request, res: Response) {
  const tokenPair = await TokenPair.findById(req.params.tokenPairId).exec();

  if (!tokenPair) {
    throw new NotFoundError('Pair not found.');
  }

  const dataSourceId = req.body.dataSourceId;

  if (tokenPair.dataSources.includes(dataSourceId)) {
    res.status(400).json({ message: 'Data source already exists' });
    return;
  }

  tokenPair.dataSources.push(dataSourceId);
  await tokenPair.save();

  res.status(200).json(tokenPair);
}

export async function deleteDataSource(req: Request, res: Response) {
  const tokenPair = await TokenPair.findById(req.params.tokenPairId).exec();

  if (!tokenPair) {
    throw new NotFoundError('Pair not found.');
  }

  const dataSourceId = req.params.dataSourceId as DataSources;

  if (tokenPair.dataSources.includes(dataSourceId)) {
    tokenPair.dataSources = tokenPair.dataSources.filter(
      (dataSource) => dataSource !== dataSourceId,
    );
    await TokenPairPrice.deleteMany({
      tokenPairId: tokenPair.id,
      dataSource: dataSourceId,
    });
    await tokenPair.save();
  }

  res.status(204).send();
}
