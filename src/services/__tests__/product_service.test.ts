import { ProductService } from 'src/services/product_service';
import Product from 'src/models/product';
import { AppError } from 'src/dto/app_error';
import { CreateProductDTO, UpdateProductDTO } from 'src/dto/product_dto';
import { faker } from '@faker-js/faker';

jest.mock('src/models/product');

describe('ProductService', () => {
  let service: ProductService;

  const productId = faker.string.uuid();
  const product = {
    id: productId,
    name: faker.vehicle.model(),
    code: 'P001',
    color: faker.vehicle.color(),
    brandName: faker.vehicle.manufacturer(),
  }

  beforeEach(() => {
    service = new ProductService();
  });

  describe('getList', () => {
    const product_2 = {
      id: faker.string.uuid(),
      name: faker.vehicle.model(),
      code: 'P001',
      color: faker.vehicle.color(),
      brandName: faker.vehicle.manufacturer(),
    }

    it('should return a paginated list of products', async () => {
      
      (Product.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [product, product_2],
        count: 2,
      });

      const result = await service.getList(1, 10);
      expect(result.items).toHaveLength(2);
      expect(result.pagination.totalItems).toBe(2);
    });
  });

  describe('getDetails', () => {
    it('should return product details when product exists', async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(product);

      const result = await service.getDetails(productId);
      expect(result.name).toBe(product.name);
    });

    it('should throw an AppError when product does not exist', async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.getDetails('999')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new product and return its details', async () => {
      const { id, ...createdProductDTO } = product;

      (Product.create as jest.Mock).mockResolvedValue({
        id: '1',
        ...createdProductDTO,
      });

      const result = await service.create(createdProductDTO);
      expect(result.code).toBe(createdProductDTO.code);
    });
  });

  describe('update', () => {
    const updateDTO = {
      name: faker.vehicle.model(),
      color: faker.vehicle.color(),
      brandName: faker.vehicle.manufacturer()
    };

    it('should update an existing product', async () => {
      const productMock = {
        ...product,
        save: jest.fn().mockImplementation(function (this: typeof productMock) {
          return Promise.resolve(this);
        }),
      };

      (Product.findByPk as jest.Mock).mockResolvedValue(productMock);
      const result = await service.update('1', updateDTO);

      expect(productMock.save).toHaveBeenCalled();
      expect(result.name).toBe(updateDTO.name);
    });

    it('should throw an AppError if product does not exist', async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.update('999', updateDTO)).rejects.toThrow(AppError);
    });
  });

  describe('remove', () => {
    it('should remove a product if it exists', async () => {
      const productMock = {
        id: productId,
        destroy: jest.fn().mockResolvedValue(true),
      };

      (Product.findByPk as jest.Mock).mockResolvedValue(productMock);

      await service.remove(productId);
      expect(productMock.destroy).toHaveBeenCalled();
    });

    it('should throw an AppError if product does not exist', async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(AppError);
    });
  });
});
