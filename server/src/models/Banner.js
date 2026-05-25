const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Banner = sequelize.define(
  'Banner',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '标题',
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '图片URL',
    },
    link_type: {
      type: DataTypes.ENUM('activity', 'band', 'product', 'url', 'none'),
      allowNull: false,
      defaultValue: 'none',
      comment: '链接类型',
    },
    link_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '链接值',
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '排序',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态: 0禁用 1启用',
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '开始时间',
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '结束时间',
    },
  },
  {
    tableName: 'banners',
    timestamps: true,
    indexes: [
      {
        fields: ['status'],
      },
      {
        fields: ['sort'],
      },
    ],
  }
);

module.exports = Banner;
