import { Request } from 'express';
import * as productHandler from '../../handlers/product_handler';
import { ProductService } from '../../services/product_service';
import { CreateProductDTO, UpdateProductDTO } from '../../dto/product_dto';
import { AppError } from '../../dto/app_error';
import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../../dto/error_code';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { faker } from '@faker-js/faker';


jest.mock('class-validator');

describe('Product Handler Tests', () => {

  const productId = faker.string.uuid();
  const mockProduct = { 
    id: productId, 
    name: faker.vehicle.model(), 
    code: faker.vehicle.type(),
    color: faker.vehicle.color(),
    brandName: faker.company.name(), 
  };

  const mockGetListResponse = {
    items: [mockProduct],
    pagination: { page: 1, pageSize: 10, totalItems: 1, totalPage: 1 },
  };

  let productServiceMock = Object.getPrototypeOf(new ProductService());

  beforeEach(() => {
    // Stub the methods for this test
    productServiceMock.getList = jest.fn().mockResolvedValue(mockGetListResponse);
    productServiceMock.getDetails = jest.fn().mockResolvedValue(mockProduct);
    productServiceMock.update = jest.fn().mockResolvedValue(mockProduct);
    productServiceMock.create = jest.fn().mockResolvedValue(mockProduct);
    productServiceMock.remove = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clears the mocks between tests
  });

  describe('getList', () => {
    it('should return product list', async () => {
      const mockReq = {
        query: {
          page: '1',
          pageSize: '10',
          name: mockProduct.name,
        },
      } as unknown as Request;

      const result = await productHandler.getList(mockReq);

      expect(result).toEqual(mockGetListResponse);
      expect(productServiceMock.getList).toHaveBeenCalledWith(1, 10, mockProduct.name);
    });
  });

  describe('getDetails', () => {
    it('should return product details if valid UUID', async () => {
      const mockReq = {
        params: { id: productId },
      } as unknown as Request;

      const result = await productHandler.getDetails(mockReq);

      expect(result).toEqual(mockProduct);
      expect(productServiceMock.getDetails).toHaveBeenCalledWith(productId);
    });

    it('should throw error for invalid UUID', async () => {
      const mockReq = {
        params: { id: 'invalid-uuid' },
      } as unknown as Request;

      await expect(productHandler.getDetails(mockReq)).rejects.toThrowError(new AppError('Invalid uuid', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_UUID));
    });
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const mockReq = {
        body: { name: 'Product1', code: 'P001', color: 'Blue', brandName: 'Brand1' },
      } as unknown as Request;

      const createDTO = plainToInstance(CreateProductDTO, mockReq.body);

      (validate as jest.Mock).mockResolvedValue([]);

      const result = await productHandler.create(mockReq);

      expect(result).toEqual(mockProduct);
      expect(productServiceMock.create).toHaveBeenCalledWith(createDTO);
    });

    it('should throw error if validation fails', async () => {
      const mockReq = {
        body: { name: '', code: '', color: '', brandName: '' }, // Invalid product
      } as unknown as Request;

      const errors = [{ constraints: { isNotEmpty: 'name should not be empty' } }];
      (validate as jest.Mock).mockResolvedValue(errors);

      await expect(productHandler.create(mockReq)).rejects.toThrowError(new AppError('name should not be empty', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_PAYLOAD));
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const mockReq = {
        params: { id: productId },
        body: { name: 'Updated Product' },
      } as unknown as Request;

      const updateDTO = plainToInstance(UpdateProductDTO, mockReq.body);

      (validate as jest.Mock).mockResolvedValue([]);

      const result = await productHandler.update(mockReq);

      expect(result).toEqual(mockProduct);
      expect(productServiceMock.update).toHaveBeenCalledWith(productId, updateDTO);
    });

    it('should throw error if UUID is invalid', async () => {
      const mockReq = {
        params: { id: 'invalid-uuid' },
        body: { name: 'Updated Product' },
      } as unknown as Request;

      await expect(productHandler.update(mockReq)).rejects.toThrow(new AppError('Invalid uuid', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_UUID));
    });

    it('should throw error if validation fails', async () => {
      const mockReq = {
        params: { id: productId },
        body: { name: '' }, // Invalid name
      } as unknown as Request;

      const errors = [{ constraints: { isNotEmpty: 'name should not be empty' } }];
      (validate as jest.Mock).mockResolvedValue(errors);

      await expect(productHandler.update(mockReq)).rejects.toThrow(new AppError('name should not be empty', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_PAYLOAD));
    });
  });

  describe('remove', () => {
    it('should remove product successfully', async () => {
      const mockReq = {
        params: { id: productId },
      } as unknown as Request;

      await productHandler.remove(mockReq);

      expect(productServiceMock.remove).toHaveBeenCalledWith(productId);
    });

    it('should throw error if UUID is invalid', async () => {
      const mockReq = {
        params: { id: 'invalid-uuid' },
      } as unknown as Request;

      await expect(productHandler.remove(mockReq)).rejects.toThrow(new AppError('Invalid uuid', StatusCodes.BAD_REQUEST, ErrorCodes.INVALID_UUID));
    });
  });
});
