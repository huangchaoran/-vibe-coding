const request = require('supertest');
const app = require('../../src/app');

describe('用户注册登录流程 E2E', () => {
  let authToken;

  it('完整的用户登录流程', async () => {
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ code: 'valid_wechat_code' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('code', 1000);
    expect(loginResponse.body.data).toHaveProperty('token');
    expect(loginResponse.body.data).toHaveProperty('userInfo');

    authToken = loginResponse.body.data.token;
  });

  it('获取用户资料', async () => {
    const profileResponse = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('code', 1000);
  });

  it('退出登录', async () => {
    const logoutResponse = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${authToken}`);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body).toHaveProperty('code', 1000);
  });

  it('未登录时获取用户资料应该返回401', async () => {
    const profileResponse = await request(app)
      .get('/api/v1/users/profile');

    expect(profileResponse.status).toBe(401);
  });
});