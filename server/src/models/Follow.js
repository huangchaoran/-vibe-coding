const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Follow = sequelize.define(
  'Follow',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '关注者ID',
    },
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '被关注者ID',
    },
    target_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'user',
      comment: '关注类型: user/band/activity',
    },
  },
  {
    tableName: 'follows',
    timestamps: true,
  }
);

module.exports = Follow;
