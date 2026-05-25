const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '预约用户ID',
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '排练室ID',
    },
    book_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: '预约日期',
    },
    time_slot: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '时间段，如 09:00-12:00',
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending',
      comment: '预约状态',
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      comment: '联系电话',
    },
    note: {
      type: DataTypes.TEXT,
      comment: '备注',
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
    tableName: 'bookings',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['room_id'] },
      { fields: ['book_date'] },
    ],
  }
);

module.exports = Booking;