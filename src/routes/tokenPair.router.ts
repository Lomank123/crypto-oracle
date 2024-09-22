import { asyncErrorHandler } from '../utils/asyncErrorHandler.util';
import {
  addTokenPair,
  deleteTokenPair,
  updateTokenPair,
  viewTokenPairPrice,
  viewTokenPairs,
} from '../controllers/tokenPair.controller';
import { body } from 'express-validator';
import { TOKEN_PAIR_REGEX } from '../consts';
import { DataSources } from '../enums';
import { requestValidatorMiddleware } from '../middlewares/request-validator.middleware';
import { Router } from 'express';
import { dataSourceRouter } from './dataSource.router';

export const tokenPairRouter = Router();

tokenPairRouter.use('/:tokenPairId/data-source', dataSourceRouter);

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
