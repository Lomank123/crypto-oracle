import { Router } from 'express';
import {
  addTokenPair,
  deleteTokenPair,
  updateTokenPair,
  viewTokenPairPrice,
  viewTokenPairs,
} from '../controllers/tokenPair.controller';
import { requestValidatorMiddleware } from '../middlewares/request-validator.middleware';
import { asyncErrorHandler } from '../utils/async-error-handler';
import {
  addDataSource,
  deleteDataSource,
  refreshPrices,
  viewDataSources,
} from '../controllers/dataSource.controller';
import { body } from 'express-validator';
import { TOKEN_PAIR_REGEX } from '../consts';
import { DataSources } from '../enums';

export const oracleRouter = Router();
const tokenPairRouter = Router();
const dataSourceRouter = Router({ mergeParams: true });

oracleRouter.use('/token-pair', tokenPairRouter);
tokenPairRouter.use('/:tokenPairId/data-source', dataSourceRouter);

oracleRouter.get('/available-data-sources', asyncErrorHandler(viewDataSources));
oracleRouter.post('/refresh-prices', asyncErrorHandler(refreshPrices));

// TODO: Move to 3 separate files?

tokenPairRouter
  .route('/')
  .get(asyncErrorHandler(viewTokenPairs))
  .post(
    body('pair').isString().notEmpty().matches(TOKEN_PAIR_REGEX),
    body('dataSources').isArray().isIn(Object.values(DataSources)),
    requestValidatorMiddleware,
    asyncErrorHandler(addTokenPair),
  );

tokenPairRouter
  .route('/price/:tokenPair')
  .get(asyncErrorHandler(viewTokenPairPrice));

tokenPairRouter
  .route('/:tokenPairId')
  .patch(
    body('dataSources').isArray().isIn(Object.values(DataSources)),
    requestValidatorMiddleware,
    asyncErrorHandler(updateTokenPair),
  )
  .delete(requestValidatorMiddleware, asyncErrorHandler(deleteTokenPair));

dataSourceRouter
  .route('/')
  .post(
    body('dataSourceId').isString().isIn(Object.values(DataSources)),
    requestValidatorMiddleware,
    asyncErrorHandler(addDataSource),
  );

dataSourceRouter
  .route('/:dataSourceId')
  .delete(asyncErrorHandler(deleteDataSource));
