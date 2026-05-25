const wechatService = {
  async code2Session(code) {
    if (code === 'valid_wechat_code') {
      return {
        openid: 'test_openid',
        unionid: 'test_unionid',
      };
    }
    throw new Error('无效的code');
  },
};

module.exports = wechatService;