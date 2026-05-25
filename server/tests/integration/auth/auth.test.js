const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');
const usersFixtures = require('../../fixtures/users');

describe('POST /api/v1/auth/login', () => {
  it('应该返回 Token 当微信授权成功', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ code: 'valid_wechat_code' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('refreshToken');
    expect(response.body.data).toHaveProperty('userInfo');
  });

  it('应该返回 422 当 code 为空', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({});

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('code', 3004);
    expect(response.body).toHaveProperty('message', '验证失败');
  });
});

describe('POST /api/v1/auth/register', () => {
  it('应该返回 Token 当注册成功', async () => {
    const uniqueOpenid = `new_test_openid_${Date.now()}`;
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ openid: uniqueOpenid });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('refreshToken');
    expect(response.body.data).toHaveProperty('userInfo');
  });

  it('应该返回 422 当 openid 为空', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({});

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('code', 3004);
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('应该返回 200 当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/auth/logout');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });
});