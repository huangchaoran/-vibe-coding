const request = require('supertest');
const { generateToken } = require('../../../src/utils/jwt');

describe('用户资料接口 - 完整应用测试', () => {
  let app;
  
  beforeAll(async () => {
    console.log('=== 加载完整应用 ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    const startTime = Date.now();
    
    // 先加载中间件检查
    const rateLimit = require('../../../src/middlewares/rateLimit');
    console.log('rateLimit 模块加载成功');
    console.log('apiLimiter:', typeof rateLimit.apiLimiter);
    
    const auth = require('../../../src/middlewares/auth');
    console.log('auth 模块加载成功');
    console.log('requireAuth:', typeof auth.requireAuth);
    
    // 然后加载应用
    app = require('../../../src/app');
    
    const endTime = Date.now();
    console.log(`应用加载耗时: ${endTime - startTime}ms`);
  });

  it('应该通过完整应用返回用户资料', async () => {
    console.log('\n=== 测试完整应用 ===');
    
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });
    
    console.log('Token生成完成');
    
    const start = Date.now();
    
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .timeout(15000);
    
    const end = Date.now();
    
    console.log(`请求耗时: ${end - start}ms`);
    console.log('响应状态:', response.status);
    console.log('响应体:', response.body);
    
    expect(response.status).toBe(200);
    expect(response.body.code).toBe(1000);
  }, 20000);
});
