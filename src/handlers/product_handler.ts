import { Request } from 'express';
import { ProductService } from '../services/product_service';
import { CreateProductDTO, UpdateProductDTO } from '../dto/product_dto';
import { validate as validateUUID } from 'uuid';
import { validate } from 'class-validator';
import { AppError } from '../dto/app_error';
import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../dto/error_code';
import { plainToInstance } from 'class-transformer';

const productService = new ProductService();

async function getList(req: Request) {
  const { page = '1', pageSize = '10', name } = req.query;
  const limit = parseInt(pageSize as string, 10);
  const pageNumber = parseInt(page as string, 10);

  return productService.getList(pageNumber, limit, name as string)
}

async function getDetails(req: Request) {
  const productId = req.params.id;
  if (!validateUUID(productId)) {
    throw new AppError('Invalid uuid', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_UUID);
  }

  return productService.getDetails(req.params.id)
}

async function create(req: Request) {
  const createProductDTO = plainToInstance(CreateProductDTO, req.body);
  const errors = await validate(createProductDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map((err) => Object.values(err.constraints || {}).join(', ')).toString();
    throw new AppError(errorMessages, StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_PAYLOAD);
  }

  return productService.create(createProductDTO);
}

async function update(req: Request) {
  const productId = req.params.id;
  if (!validateUUID(productId)) {
    throw new AppError('Invalid uuid', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_UUID);
  }

  const updateProductDTO = plainToInstance(UpdateProductDTO, req.body);
  const errors = await validate(updateProductDTO);

  if (errors.length > 0) {
    const errorMessages = errors.map((err) => Object.values(err.constraints || {}).join(', ')).toString();
    throw new AppError(errorMessages, StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_PAYLOAD);
  }

  return productService.update(productId, updateProductDTO);
}

async function remove(req: Request) {
  const productId = req.params.id;
  if (!validateUUID(productId)) {
    throw new AppError('Invalid uuid', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_UUID);
  }

  return productService.remove(productId);
}

export {
  getList,
  getDetails,
  create,
  update,
  remove,
};
