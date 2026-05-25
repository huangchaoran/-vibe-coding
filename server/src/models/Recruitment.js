const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Recruitment = sequelize.define(
  'Recruitment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    band_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bands',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instrument: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    requirement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING(200),
      allowNull: true,
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
    tableName: 'recruitments',
    timestamps: false,
  }
);

module.exports = Recruitment;