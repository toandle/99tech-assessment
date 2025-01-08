export class AppError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string = 'INTERAL_SERVER_ERROR') {
    super(message);

    // Set the prototype explicitly to maintain the instance of AppError
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.errorCode = errorCode;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
