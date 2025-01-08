import { StatusCodes } from 'http-status-codes';
import { AppError } from '../dto/app_error';
import Product from '../models/product';
import { Op } from 'sequelize';
import { ErrorCodes } from '../dto/error_code';
import { CreateProductDTO, GetProductListDTO, ProductDetailsDTO, UpdateProductDTO } from '../dto/product_dto';

export class ProductService {
  public async getList(page: number, pageSize: number, name?: string): Promise<GetProductListDTO> {
    const offset = (page - 1) * pageSize;

    const filter: any = {};
    if (name) {
      filter.name = { [Op.iLike]: `%${name}%` };  // Filter by name (case-insensitive)
    }

    const products = await Product.findAndCountAll({ 
      where: filter, 
      limit: pageSize, 
      offset 
    });

    const response = new GetProductListDTO();
    response.items = products.rows.map((item) => {
      return {
        id: item.id,
        name: item.name,
        code: item.code
      }
    });

    response.pagination = {
      page,
      pageSize,
      totalItems: products.count,
      totalPage: Math.ceil(products.count / pageSize),
    }

    return response;
  }

  public async getDetails(id: string): Promise<ProductDetailsDTO> {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND, ErrorCodes.PRODUCT_NOT_FOUND);
    }

    return this.convertEntityToDTO(product);
  }

  public async create(productDTO: CreateProductDTO): Promise<ProductDetailsDTO> {
    const createdProduct = await Product.create({ 
      name: productDTO.name, 
      code: productDTO.code,
      color: productDTO.color,
      brandName: productDTO.brandName
    });

    return this.convertEntityToDTO(createdProduct);
  }

  public async update(id: string, productDTO: UpdateProductDTO) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND, ErrorCodes.PRODUCT_NOT_FOUND);
    }

    if (productDTO.brandName) {
      product.name = productDTO.name;
    }

    if (productDTO.color) {
      product.color = productDTO.color;
    }
    
    if (productDTO.brandName) {
      product.brandName = productDTO.brandName;
    }

    const updatedProduct = await product.save();
    return this.convertEntityToDTO(updatedProduct);
  }

  public async remove(id: string): Promise<void> {
    const product = await Product.findByPk(id);

    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND, ErrorCodes.PRODUCT_NOT_FOUND);
    }

    await product.destroy();
  }

  private convertEntityToDTO(product: Product): ProductDetailsDTO {
    const dto = new ProductDetailsDTO();
    dto.id = product.id;
    dto.name = product.name;
    dto.code = product.code;
    dto.color = product.color;
    dto.brandName = product.brandName;

    return dto;
  }
}