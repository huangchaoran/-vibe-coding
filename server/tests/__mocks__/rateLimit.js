const createRateLimiter = () => (req, res, next) => next();

const apiLimiter = (req, res, next) => next();

const uploadLimiter = (req, res, next) => next();

const createLoginLimiter = () => (req, res, next) => next();

module.exports = {
  createRateLimiter,
  apiLimiter,
  uploadLimiter,
  createLoginLimiter,
};
