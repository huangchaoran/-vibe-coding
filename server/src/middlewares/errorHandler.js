const logger = require('../utils/logger');
const ApiResponse = require('../utils/response');

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.code = err.code || 4000;

  logger.error(`${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
  });

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error.statusCode = 422;
    error.code = 3004;
    error.message = '验证失败';
    return ApiResponse.validationError(res, error.message, errors);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error.statusCode = 409;
    error.code = 3005;
    error.message = '资源冲突';
    return ApiResponse.conflict(res, error.message);
  }

  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.code = 3001;
    error.message = 'Token无效';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.code = 3001;
    error.message = 'Token已过期';
  }

  // 处理"不存在"错误
  if (err.message && err.message.includes('不存在')) {
    error.statusCode = 404;
    error.code = 3003;
    error.message = err.message;
  }

  // 处理"已报名"错误
  if (err.message && err.message.includes('已报名')) {
    error.statusCode = 409;
    error.code = 3005;
    error.message = err.message;
  }

  // 处理"已满员"错误
  if (err.message && err.message.includes('已满员')) {
    error.statusCode = 409;
    error.code = 3005;
    error.message = err.message;
  }

  // 处理"已结束"错误
  if (err.message && err.message.includes('已结束')) {
    error.statusCode = 409;
    error.code = 3005;
    error.message = err.message;
  }

  ApiResponse.error(res, error.statusCode, error.code, error.message);
};

const notFoundHandler = (req, res, next) => {
  const error = new AppError(`路由 ${req.originalUrl} 不存在`, 404, 3003);
  next(error);
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
