const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_no: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      comment: '订单号',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '购买用户ID',
    },
    type: {
      type: DataTypes.ENUM('product', 'booking', 'activity', 'membership'),
      allowNull: false,
      comment: '订单类型',
    },
    target_id: {
      type: DataTypes.INTEGER,
      comment: '关联目标ID（商品ID、预约ID等）',
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: '总金额',
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'refunded', 'completed'),
      defaultValue: 'pending',
      comment: '订单状态',
    },
    payment_method: {
      type: DataTypes.STRING(20),
      comment: '支付方式：wechat, alipay, card',
    },
    paid_at: {
      type: DataTypes.DATE,
      comment: '支付时间',
    },
    note: {
      type: DataTypes.TEXT,
      comment: '订单备注',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '创建时间',
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '更新时间',
    },
  },
  {
    tableName: 'orders',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['order_no'] },
      { fields: ['status'] },
      { fields: ['type'] },
    ],
  }
);

module.exports = Order;