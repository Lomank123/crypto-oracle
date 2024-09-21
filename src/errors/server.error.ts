import { RequestError } from './request.error';

export class ServerError extends RequestError {
  statusCode = 500;

  constructor(message: string = 'Server Error') {
    super(message);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
