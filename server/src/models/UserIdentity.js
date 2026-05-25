const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const UserIdentity = sequelize.define(
  'UserIdentity',
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
    identity: {
      type: DataTypes.ENUM('fan', 'musician', 'band', 'venue'),
      allowNull: false,
      comment: '用户身份',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '绑定时间',
    },
  },
  {
    tableName: 'user_identities',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['identity'] },
      { fields: ['user_id', 'identity'], unique: true },
    ],
  }
);

module.exports = UserIdentity;
