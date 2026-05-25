const { verifyToken } = require('../utils/jwt');
const ApiResponse = require('../utils/response');
const { ADMIN_ROLES } = require('../constants/userRole');

const requireAuth = () => (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return ApiResponse.unauthorized(res, '请先登录');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, '登录已过期，请重新登录');
    }
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Token无效');
    }
    return ApiResponse.unauthorized(res, '认证失败');
  }
};

const requireIdentity = (...identities) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, '请先登录');
    }

    if (!identities.includes(req.user.identity)) {
      return ApiResponse.forbidden(res, '您的身份不允许访问此功能');
    }

    next();
  };
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, '请先登录');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, '权限不足');
    }

    next();
  };
};

const requireAdmin = () => (req, res, next) => {
  return requireRole(...ADMIN_ROLES)(req, res, next);
};

const requireOwnerOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return ApiResponse.unauthorized(res, '请先登录');
      }

      const resourceUserId = await getResourceUserId(req);

      if (
        req.user.userId === resourceUserId ||
        ADMIN_ROLES.includes(req.user.role)
      ) {
        return next();
      }

      return ApiResponse.forbidden(res, '权限不足，只能操作自己的资源');
    } catch (error) {
      return ApiResponse.internalError(res, '服务器错误');
    }
  };
};

module.exports = {
  requireAuth,
  requireIdentity,
  requireRole,
  requireAdmin,
  requireOwnerOrAdmin,
};
