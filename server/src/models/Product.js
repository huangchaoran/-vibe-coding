const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '产品名称',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '产品描述',
  },
  cover: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '产品封面',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '价格',
  },
  type: {
    type: DataTypes.ENUM('equipment', 'album', 'ticket', 'merchandise', 'other'),
    allowNull: false,
    defaultValue: 'equipment',
    comment: '产品类型',
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '状态: 0下架 1上架',
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: '库存',
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '卖家ID',
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  indexes: [
    { fields: ['status'] },
    { fields: ['type'] },
    { fields: ['seller_id'] },
  ],
});

module.exports = Product;
