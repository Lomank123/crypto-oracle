import { Router } from 'express';
import {
  addTokenPair,
  deleteTokenPair,
  updateTokenPair,
  viewTokenPairs,
} from '../controllers/tokenPair.controller';
import { requestValidatorMiddleware } from '../middlewares/request-validator.middleware';
import { asyncErrorHandler } from '../utils/async-error-handler';
import {
  addDataSource,
  deleteDataSource,
} from '../controllers/dataSource.controller';

export const oracleRouter = Router();
const tokenPairRouter = Router();
const dataSourceRouter = Router({ mergeParams: true });

oracleRouter.use('/token-pair', tokenPairRouter);
tokenPairRouter.use('/:tokenPairId/data-source', dataSourceRouter);

tokenPairRouter
  .route('/')
  .get(asyncErrorHandler(viewTokenPairs))
  .post(requestValidatorMiddleware, asyncErrorHandler(addTokenPair));

tokenPairRouter
  .route('/:tokenPairId')
  .patch(requestValidatorMiddleware, asyncErrorHandler(updateTokenPair))
  .delete(requestValidatorMiddleware, asyncErrorHandler(deleteTokenPair));

dataSourceRouter
  .route('/')
  .post(requestValidatorMiddleware, asyncErrorHandler(addDataSource));

dataSourceRouter
  .route('/:dataSourceId')
  .delete(requestValidatorMiddleware, asyncErrorHandler(deleteDataSource));

// urlRouter.post(
//   '/',
//   body('url').isString().isURL(),
//   requestValidatorMiddleware,
//   asyncErrorHandler(generateShortUrlController),
// );
// urlRouter.get('/:shortHash', asyncErrorHandler(redirectFromShortUrlController));
