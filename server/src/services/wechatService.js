const wechatService = {
  async code2Session(code) {
    const appid = process.env.WX_APPID;
    const secret = process.env.WX_SECRET;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.errcode) {
      throw new Error(data.errmsg || '微信登录失败');
    }

    return {
      openid: data.openid,
      unionid: data.unionid,
    };
  },
};

module.exports = wechatService;