import { Router } from 'express';
import { body } from 'express-validator';
import { DataSources } from '../enums';
import { requestValidatorMiddleware } from '../middlewares/request-validator.middleware';
import { asyncErrorHandler } from '../utils/asyncErrorHandler.util';
import {
  addDataSource,
  deleteDataSource,
} from '../controllers/dataSource.controller';

export const dataSourceRouter = Router({ mergeParams: true });

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
