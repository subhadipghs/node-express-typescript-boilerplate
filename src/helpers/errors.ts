/**
 * When argument is missing
 */
export class MissingArgument extends Error {
  constructor(message: string, stack = "") {
    super(message);
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
