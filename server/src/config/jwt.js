const logger = require('../utils/logger');

// 检查 JWT_SECRET 是否为默认值（不安全）
if (!process.env.JWT_SECRET) {
  logger.warn('⚠️ JWT_SECRET 未设置，使用默认密钥，生产环境必须设置强密钥！');
} else if (process.env.JWT_SECRET === 'gojica_secret_key_2024') {
  logger.warn('⚠️ JWT_SECRET 使用了默认密钥，建议更换为强随机密钥！');
}

module.exports = {
  secret: process.env.JWT_SECRET || 'gojica_secret_key_2024',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  algorithm: 'HS256',
  issuer: 'gojica-api',
};
