const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { testConnection, syncDatabase } = require('./database/connection');

const startServer = async () => {
  try {
    await testConnection();

    if (config.isDev) {
      try {
        await syncDatabase({ force: false, alter: true });
      } catch (syncError) {
        logger.warn('Database sync skipped (may have schema differences):', syncError.message);
      }
    }

    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`API Base URL: http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

startServer();
