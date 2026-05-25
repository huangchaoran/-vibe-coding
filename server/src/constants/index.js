const statusCode = require('./statusCode');
const userIdentity = require('./userIdentity');
const userRole = require('./userRole');

module.exports = {
  ...statusCode,
  userIdentity,
  userRole,
};
