const { SUCCESS, CREATED, UPDATED, DELETED } = require('../constants/statusCode');

const snakeToCamel = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const isPrimitive = (value) => {
  return value === null || value === undefined || 
         typeof value === 'string' || 
         typeof value === 'number' || 
         typeof value === 'boolean' ||
         value instanceof Date;
};

const deepConvert = (obj, seen = new WeakSet()) => {
  if (isPrimitive(obj)) return obj;
  
  if (seen.has(obj)) return '[Circular]';
  
  if (Array.isArray(obj)) {
    seen.add(obj);
    return obj.map(item => deepConvert(item, seen));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    // 检查是否是 Sequelize 实例 (通过 toJSON 方法判断)
    if (typeof obj.toJSON === 'function') {
      return deepConvert(obj.toJSON(), seen);
    }
    
    // 排除 Sequelize 内部字段
    const excludeKeys = [
      'PreviousDataValues', 'uniqno', 'Changed', 'Options',
      'isNewRecord', 'dataValues', 'parent', 'include',
      '_previousDataValues', '_hasWarnings', '_created',
      '_updated', '_modelOptions', '_options', '_values',
      '_changed', '_previous', '_model', '_scope'
    ];
    
    seen.add(obj);
    const result = {};
    const keys = Object.keys(obj);
    
    for (const key of keys) {
      if (excludeKeys.includes(key)) continue;
      const camelKey = snakeToCamel(key);
      result[camelKey] = deepConvert(obj[key], seen);
    }
    return result;
  }
  
  return obj;
};

const toCamelCase = (data) => {
  if (!data) return data;
  return deepConvert(data);
};

class ApiResponse {
  static success(res, data = null, message = null) {
    const converted = toCamelCase(data);
    return res.json({
      code: SUCCESS.code,
      message: message || SUCCESS.msg,
      data: converted,
    });
  }

  static created(res, data = null, message = null) {
    const converted = toCamelCase(data);
    return res.status(201).json({
      code: CREATED.code,
      message: message || CREATED.msg,
      data: converted,
    });
  }

  static updated(res, data = null, message = null) {
    const converted = toCamelCase(data);
    return res.json({
      code: UPDATED.code,
      message: message || UPDATED.msg,
      data: converted,
    });
  }

  static deleted(res, message = null) {
    return res.status(204).json({
      code: DELETED.code,
      message: message || DELETED.msg,
    });
  }

  static paginated(res, list, pagination, message = null) {
    return res.json({
      code: SUCCESS.code,
      message: message || SUCCESS.msg,
      data: {
        list: toCamelCase(list),
        pagination: toCamelCase(pagination),
      },
    });
  }

  static error(res, statusCode, code, message, errors = null) {
    return res.status(statusCode).json({
      code,
      message,
      errors,
    });
  }

  static badRequest(res, message = '请求参数错误', errors = null) {
    return this.error(res, 400, 3000, message, errors);
  }

  static unauthorized(res, message = '未授权访问') {
    return this.error(res, 401, 3001, message);
  }

  static forbidden(res, message = '禁止访问') {
    return this.error(res, 403, 3002, message);
  }

  static notFound(res, message = '资源不存在') {
    return this.error(res, 404, 3003, message);
  }

  static validationError(res, message = '验证失败', errors = null) {
    return this.error(res, 422, 3004, message, errors);
  }

  static conflict(res, message = '资源冲突') {
    return this.error(res, 409, 3005, message);
  }

  static tooManyRequests(res, message = '请求过于频繁') {
    return this.error(res, 429, 3006, message);
  }

  static internalError(res, message = '服务器内部错误') {
    return this.error(res, 500, 4000, message);
  }

  static serviceUnavailable(res, message = '服务暂时不可用') {
    return this.error(res, 503, 4002, message);
  }
}

module.exports = ApiResponse;
