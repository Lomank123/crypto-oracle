import { RequestError } from './request.error';

export class NotFoundError extends RequestError {
  statusCode = 404;

  constructor(message: string = 'Not found') {
    super(message);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
