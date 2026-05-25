module.exports = {
  SUCCESS: {
    code: 1000,
    msg: '操作成功',
  },
  CREATED: {
    code: 1001,
    msg: '创建成功',
  },
  UPDATED: {
    code: 1002,
    msg: '更新成功',
  },
  DELETED: {
    code: 1003,
    msg: '删除成功',
  },

  AUTH_SUCCESS: {
    code: 2000,
    msg: '认证成功',
  },
  LOGOUT_SUCCESS: {
    code: 2001,
    msg: '退出成功',
  },
  TOKEN_REFRESHED: {
    code: 2002,
    msg: 'Token已刷新',
  },

  BAD_REQUEST: {
    code: 3000,
    msg: '错误请求',
  },
  UNAUTHORIZED: {
    code: 3001,
    msg: '未授权访问',
  },
  FORBIDDEN: {
    code: 3002,
    msg: '禁止访问',
  },
  NOT_FOUND: {
    code: 3003,
    msg: '资源不存在',
  },
  VALIDATION_ERROR: {
    code: 3004,
    msg: '验证失败',
  },
  CONFLICT: {
    code: 3005,
    msg: '资源冲突',
  },
  TOO_MANY_REQUESTS: {
    code: 3006,
    msg: '请求过于频繁',
  },

  INTERNAL_ERROR: {
    code: 4000,
    msg: '服务器内部错误',
  },
  DB_ERROR: {
    code: 4001,
    msg: '数据库操作失败',
  },
  SERVICE_UNAVAILABLE: {
    code: 4002,
    msg: '服务暂时不可用',
  },
  GATEWAY_TIMEOUT: {
    code: 4003,
    msg: '网关超时',
  },
};
