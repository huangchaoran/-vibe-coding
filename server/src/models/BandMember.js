const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const BandMember = sequelize.define(
  'BandMember',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    band_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '乐队ID',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID',
    },
    role: {
      type: DataTypes.ENUM('leader', 'member'),
      allowNull: false,
      defaultValue: 'member',
      comment: '角色: leader队长 member成员',
    },
    instrument: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '演奏乐器',
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '加入时间',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态: 0待审核 1已加入',
    },
  },
  {
    tableName: 'band_members',
    timestamps: false,
    indexes: [
      {
        fields: ['band_id'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);

module.exports = BandMember;
