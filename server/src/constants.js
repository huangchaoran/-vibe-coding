const userIdentity = {
  FAN: 'fan',
  MUSICIAN: 'musician',
  BAND: 'band',
  VENUE: 'venue',
};

const identityLabels = {
  [userIdentity.FAN]: '粉丝',
  [userIdentity.MUSICIAN]: '音乐人',
  [userIdentity.BAND]: '乐队',
  [userIdentity.VENUE]: '场馆商家',
};

module.exports = {
  userIdentity,
  identityLabels,
};
