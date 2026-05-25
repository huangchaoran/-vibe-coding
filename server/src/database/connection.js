const { Sequelize } = require('sequelize');
const config = require('../config/database');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: config.pool,
    logging: config.logging,
    define: config.define,
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    logger.info('Database synchronized successfully.');
  } catch (error) {
    logger.error('Unable to synchronize the database:', error);
  }
};

const snakeToCamel = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const convertKeysToCamelCase = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }
  if (typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = snakeToCamel(key);
        result[camelKey] = convertKeysToCamelCase(obj[key]);
      }
    }
    return result;
  }
  return obj;
};

const toCamelCase = (data) => {
  if (!data) return data;
  
  if (data.dataValues) {
    const result = { ...data.dataValues };
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const camelKey = snakeToCamel(key);
        if (camelKey !== key) {
          result[camelKey] = convertKeysToCamelCase(result[key]);
          delete result[key];
        } else {
          result[key] = convertKeysToCamelCase(result[key]);
        }
      }
    }
    if (data._previousDataValues) {
      result.id = data.id;
    }
    return result;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => toCamelCase(item));
  }
  
  return convertKeysToCamelCase(data);
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  toCamelCase,
  snakeToCamel,
  convertKeysToCamelCase,
};
