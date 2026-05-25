const rateLimit = require('express-rate-limit');

const requireAuth = () => (req, res, next) => {
  const token = req.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ code: 3001, message: '未授权访问', errors: null });
  }

  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      req.user = payload;
      next();
    } else {
      return res.status(401).json({ code: 3001, message: 'Token无效', errors: null });
    }
  } catch (e) {
    return res.status(401).json({ code: 3001, message: 'Token无效', errors: null });
  }
};

const requireIdentity = (...args) => (req, res, next) => {
  if (res && req.user && !args.includes(req.user.identity)) {
    return res.status(403).json({ code: 3002, message: '禁止访问', errors: null });
  }
  next();
};

const requireRole = (...args) => (req, res, next) => {
  if (res && req.user && !args.includes(req.user.role)) {
    return res.status(403).json({ code: 3002, message: '禁止访问', errors: null });
  }
  next();
};

const requireAdmin = () => (req, res, next) => {
  if (res && req.user && !['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ code: 3002, message: '禁止访问', errors: null });
  }
  next();
};

const requireOwnerOrAdmin = () => (req, res, next) => next();

const createLoginLimiter = () => (req, res, next) => next();

module.exports = {
  requireAuth,
  requireIdentity,
  requireRole,
  requireAdmin,
  requireOwnerOrAdmin,
  createLoginLimiter,
};