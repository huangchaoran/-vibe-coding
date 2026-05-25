const winston = require('winston');
const path = require('path');
const config = require('../config');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}\n`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}\n`;
  })
);

const logger = winston.createLogger({
  level: config.isDev ? 'debug' : 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error/error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/all/all.log'),
    }),
  ],
});

if (config.isDev) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    })
  );
}

module.exports = logger;
