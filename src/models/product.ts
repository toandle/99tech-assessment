import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db_config';
import { v4 as uuidv4 } from 'uuid';

class Product extends Model {
  public id: string;
  public code: string;
  public name: string;
  public color: string;
  public brandName: string;
  public createdAt: Date;
  public updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'brand_name'
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
  }
);

export default Product;
