import { NextFunction, Request, Response } from 'express';
import { RequestError } from '../errors/request.error';

export function errorHandlerMiddleware(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (err instanceof RequestError) {
    return res.status(err.statusCode).json({
      errors: err.serialize(),
    });
  }

  // Unhandled error
  res.status(500).json({
    errors: [{ message: 'Server Error' }],
  });

  next();
}
