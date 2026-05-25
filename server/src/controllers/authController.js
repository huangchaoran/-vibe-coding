const authService = require('../services/authService');
const ApiResponse = require('../utils/response');

const login = async (req, res) => {
  const { code, identity } = req.body;

  let result;
  if (process.env.NODE_ENV === 'development') {
    result = await authService.devLogin(identity, req);
  } else {
    result = await authService.wxLogin(code, identity);
  }

  ApiResponse.success(res, {
    token: result.token,
    refreshToken: result.refreshToken,
    expiresIn: 86400,
    userInfo: result.userInfo,
  }, '登录成功');
};

const register = async (req, res) => {
  const { openid, nickname } = req.body;

  const result = await authService.registerUser({ openid, nickname });

  ApiResponse.created(res, result, '注册成功');
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return ApiResponse.badRequest(res, 'Refresh Token不能为空');
  }

  try {
    const result = await authService.refreshTokens(refreshToken);
    ApiResponse.success(res, result, 'Token已刷新');
  } catch (error) {
    return ApiResponse.unauthorized(res, error.message);
  }
};

const logout = async (req, res) => {
  ApiResponse.success(res, null, '退出成功');
};

const devLogin = async (req, res) => {
  const { phone, code, identity } = req.body;

  const result = await authService.devLogin(identity || 'fan', req);

  ApiResponse.success(res, {
    token: result.token,
    refreshToken: result.refreshToken,
    expiresIn: 86400,
    userInfo: result.userInfo,
  }, '登录成功');
};

module.exports = {
  login,
  register,
  refresh,
  logout,
  devLogin,
};
