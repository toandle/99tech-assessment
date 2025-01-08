import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../dto/app_error';
import { ErrorCodes } from '../dto/error_code';

const errorHandler: ErrorRequestHandler  = (err: AppError | Error, req: Request, res: Response, next: NextFunction): void => {
  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    }).end();
  }
  // Handle general errors
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong',
    errorCode: ErrorCodes.SOMETHING_WENT_WRONG
  }).end();
};

export default errorHandler;