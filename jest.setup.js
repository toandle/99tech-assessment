const SequelizeMock = require('sequelize-mock');

const DBConnectionMock = new SequelizeMock();

const ProductMock = DBConnectionMock.define('Product', {
  id: '1',
  code: 'P001',
  name: 'Product1',
  color: 'Blue',
  brandName: 'Brand1',
});

module.exports = {
  ProductMock,
};
