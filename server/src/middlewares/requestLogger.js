const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  const logRequest = () => {
    try {
      const duration = Date.now() - start;
      const log = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ip: req.ip,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        userId: req.user?.userId || null,
      };

      if (res.statusCode >= 400) {
        logger.warn(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, log);
      } else {
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, log);
      }
    } catch (e) {
    }
  };

  res.on('finish', logRequest);
  res.on('error', logRequest);

  next();
};

module.exports = requestLogger;