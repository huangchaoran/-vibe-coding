const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/response');

const createRateLimiter = (options) => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    return (req, res, next) => next();
  }
  
  return rateLimit({
    windowMs: options.windowMs || 60 * 1000,
    max: options.max || 60,
    message: options.message || '请求过于频繁，请稍后再试',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      ApiResponse.tooManyRequests(res, options.message || '请求过于频繁，请稍后再试');
    },
  });
};

const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: '请求过于频繁，请稍后再试'
});

const uploadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: '上传过于频繁，请稍后再试'
});

const createLoginLimiter = () => createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: '登录尝试过于频繁，请15分钟后再试'
});

const loginLimiter = createLoginLimiter();

module.exports = {
  apiLimiter,
  uploadLimiter,
  createLoginLimiter,
  loginLimiter
};
