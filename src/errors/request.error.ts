export abstract class RequestError extends Error {
  abstract statusCode: number;

  protected constructor(message: string) {
    super(message);
  }

  abstract serialize(): { message: string; field?: string }[];
}
