const path = require('path');
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  db: require('./database'),
  jwt: require('./jwt'),
  cors: require('./cors'),
  upload: require('./upload'),
};
