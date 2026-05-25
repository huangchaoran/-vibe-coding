const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');

describe('GET /api/v1/users/profile (简化测试)', () => {
  it('应该返回用户资料当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    console.log('测试Token:', token);
    
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`);

    console.log('响应:', response.status, response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  }, 15000);

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile');

    console.log('未登录响应:', response.status, response.body);
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  }, 5000);
});
