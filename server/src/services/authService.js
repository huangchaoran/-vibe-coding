const { User } = require('../models');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { userIdentity } = require('../constants');
const wechatService = require('./wechatService');

const devLogin = async (identity = 'fan', req = null) => {
  // 安全检查：检查是否允许 DevLogin
  const devLoginEnabled = process.env.DEV_LOGIN_ENABLED === 'true';
  const allowedIps = (process.env.DEV_LOGIN_ALLOWED_IPS || '127.0.0.1,localhost,::1').split(',').map(ip => ip.trim());

  // 获取请求来源IP
  let clientIp = '';
  if (req) {
    clientIp = req.ip || req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || '';
  }

  const isLocalIp = allowedIps.includes('127.0.0.1') || allowedIps.includes('localhost') || allowedIps.includes('::1');
  const isAllowedIp = isLocalIp || allowedIps.some(ip => clientIp.includes(ip));

  if (!devLoginEnabled) {
    throw new Error('开发登录已禁用，请使用生产认证方式');
  }

  if (!isAllowedIp) {
    throw new Error('IP地址不在允许列表中');
  }

  const validIdentities = ['fan', 'musician', 'band', 'venue'];
  const userIdentity = validIdentities.includes(identity) ? identity : 'fan';
  const devOpenid = 'dev_openid_' + Date.now();
  
  let user = await User.findOne({ where: { openid: devOpenid } });

  let isNewUser = false;
  if (!user) {
    isNewUser = true;
    user = await User.create({
      openid: devOpenid,
      unionid: null,
      nickname: '开发测试用户',
      avatar: 'https://picsum.photos/200',
      identity: userIdentity,
    });
  }

  await User.update({ last_login_at: new Date() }, { where: { id: user.id } });

  const token = generateToken({
    userId: user.id,
    openid: user.openid,
    identity: user.identity,
    role: user.role || 'user',
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  return {
    token,
    refreshToken,
    userInfo: {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      identity: user.identity,
      instrument: user.instrument,
      music_style: user.music_style,
      isNewUser,
    },
  };
};

const wxLogin = async (code, identity = 'fan') => {
  const wxResult = await wechatService.code2Session(code);
  const { openid, unionid } = wxResult;

  let user = await User.findOne({ where: { openid } });

  let isNewUser = false;
  if (!user) {
    isNewUser = true;
    user = await User.create({
      openid,
      unionid,
      nickname: '新用户',
      avatar: '/static/images/default-avatar.png',
      identity: identity,
    });
  }

  await User.update({ last_login_at: new Date() }, { where: { id: user.id } });

  const token = generateToken({
    userId: user.id,
    openid: user.openid,
    identity: user.identity,
    role: user.role || 'user',
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  return {
    token,
    refreshToken,
    userInfo: {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      identity: user.identity,
      instrument: user.instrument,
      music_style: user.music_style,
      isNewUser,
    },
  };
};

const registerUser = async (userData) => {
  const { openid, nickname } = userData;

  let user = await User.findOne({ where: { openid } });

  if (user) {
    throw new Error('用户已存在');
  }

  user = await User.create({
    openid,
    nickname: nickname || '新用户',
    avatar: '/static/images/default-avatar.png',
    identity: userIdentity.FAN,
  });

  const token = generateToken({
    userId: user.id,
    openid: user.openid,
    identity: user.identity,
    role: user.role || 'user',
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  return {
    token,
    refreshToken,
    userInfo: {
      id: user.id,
      openid: user.openid,
      nickname: user.nickname,
      avatar: user.avatar,
      identity: user.identity,
      isNewUser: true,
    },
  };
};

const refreshTokens = async (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new Error('用户不存在');
    }

    const newToken = generateToken({
      userId: user.id,
      openid: user.openid,
      identity: user.identity,
      role: user.role || 'user',
    });

    return {
      token: newToken,
      expiresIn: 86400,
    };
  } catch (error) {
    throw new Error('Refresh Token无效或已过期');
  }
};

module.exports = {
  devLogin,
  wxLogin,
  registerUser,
  refreshTokens,
};