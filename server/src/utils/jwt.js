const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

const generateToken = (payload) => {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.expiresIn,
    issuer: config.issuer,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.refreshExpiresIn,
    issuer: config.issuer,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.secret, {
    issuer: config.issuer,
  });
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
};
