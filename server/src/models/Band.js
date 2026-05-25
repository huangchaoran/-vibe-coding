const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Band = sequelize.define(
  'Band',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '乐队名称',
    },
    style: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '音乐风格',
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '乐队介绍',
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '乐队头像',
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '乐队封面',
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '创建者ID',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '状态: 0待审核 1通过 2拒绝',
    },
    reject_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '拒绝原因',
    },
    member_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '成员数量',
    },
  },
  {
    tableName: 'bands',
    timestamps: true,
    indexes: [
      {
        fields: ['owner_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

module.exports = Band;
