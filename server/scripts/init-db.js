const { testConnection, syncDatabase } = require('../src/database/connection');
const logger = require('../src/utils/logger');

async function initializeDatabase() {
  try {
    logger.info('Starting database initialization...');

    await testConnection();
    logger.info('Database connection test passed.');

    await syncDatabase({ force: false, alter: true });
    logger.info('Database synchronization completed.');

    logger.info('Database initialization successful!');
    process.exit(0);
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
