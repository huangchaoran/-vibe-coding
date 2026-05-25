const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Favorite = sequelize.define(
  'Favorite',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID',
    },
    target_type: {
      type: DataTypes.ENUM('band', 'activity', 'product', 'post', 'room'),
      allowNull: false,
      comment: '收藏类型',
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '被收藏目标ID',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '收藏时间',
    },
  },
  {
    tableName: 'favorites',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['target_type', 'target_id'] },
      { fields: ['user_id', 'target_type', 'target_id'], unique: true },
    ],
  }
);

module.exports = Favorite;