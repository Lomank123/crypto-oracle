import { Router } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.util';
import { viewDataSources } from '../controllers/dataSource.controller';
import { tokenPairRouter } from './tokenPair.router';
import { refreshPrices } from '../controllers/oracle.controller';

export const oracleRouter = Router();

oracleRouter.use('/token-pair', tokenPairRouter);

oracleRouter.get('/available-data-sources', asyncErrorHandler(viewDataSources));
oracleRouter.post('/refresh-prices', asyncErrorHandler(refreshPrices));
