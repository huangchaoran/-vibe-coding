const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));
    return ApiResponse.validationError(res, '验证失败', formattedErrors);
  }
  next();
};

module.exports = validate;