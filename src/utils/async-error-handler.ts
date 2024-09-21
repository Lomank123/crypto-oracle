import { NextFunction, RequestHandler, Response, Request } from 'express';

export const asyncErrorHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
