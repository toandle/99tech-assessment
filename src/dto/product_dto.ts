import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Pagination } from './pagination_dto';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  brandName: string;
}

export class UpdateProductDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  brandName: string;
}

export class GetProductListItemDTO {
  id: string;
  name: string;
  code: string;
}

export class GetProductListDTO {
  pagination: Pagination;
  items: GetProductListItemDTO[];
}

export class ProductDetailsDTO {
  id: string;
  name: string;
  code: string;
  color: string;
  brandName: string;
}