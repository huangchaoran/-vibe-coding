module.exports = {
  USER: 'user',
  BAND_MANAGER: 'band_manager',
  VENUE_OWNER: 'venue_owner',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

module.exports.ROLES = Object.values(module.exports);

module.exports.ADMIN_ROLES = [
  module.exports.ADMIN,
  module.exports.SUPER_ADMIN,
];
