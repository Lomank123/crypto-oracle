import { Router } from 'express';
import {
  addTokenPair,
  deleteTokenPair,
  updateTokenPair,
  viewTokenPairs,
} from '../controllers/tokenPair.controller';
import { requestValidatorMiddleware } from '../middlewares/request-validator.middleware';
import { asyncErrorHandler } from '../utils/async-error-handler';

export const oracleRouter = Router();
const tokenPairRouter = Router();

oracleRouter.use('/token-pair', tokenPairRouter);

tokenPairRouter
  .route('/')
  .get(asyncErrorHandler(viewTokenPairs))
  .post(requestValidatorMiddleware, asyncErrorHandler(addTokenPair));

tokenPairRouter
  .route('/:id')
  .patch(requestValidatorMiddleware, asyncErrorHandler(updateTokenPair))
  .delete(requestValidatorMiddleware, asyncErrorHandler(deleteTokenPair));

// urlRouter.post(
//   '/',
//   body('url').isString().isURL(),
//   requestValidatorMiddleware,
//   asyncErrorHandler(generateShortUrlController),
// );
// urlRouter.get('/:shortHash', asyncErrorHandler(redirectFromShortUrlController));
