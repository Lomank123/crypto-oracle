import { RequestError } from './request.error';

export class BadRequestError extends RequestError {
  statusCode = 400;

  constructor(message: string = 'Bad request') {
    super(message);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
