import { Response } from 'express';
import { StatusCodes } from 'http-status-codes'

const responseHelper = (res: Response, data: any, statusCode: number = StatusCodes.OK) => {
  res.status(statusCode).json({ success: true, data }).end();
}

export default responseHelper;