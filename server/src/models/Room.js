const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Room = sequelize.define(
  'Room',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('chat', 'voice', 'video'),
      defaultValue: 'chat',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    band_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bands',
        key: 'id',
      },
    },
    max_users: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
    },
    current_users: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'rooms',
    timestamps: false,
  }
);

module.exports = Room;