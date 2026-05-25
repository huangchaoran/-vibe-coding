const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');
const path = require('path');

describe('POST /api/v1/upload/image', () => {
  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/upload/image');

    expect(response.status).toBe(401);
  });

  it('应该返回 400 当无文件', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/upload/image')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe('POST /api/v1/upload/audio', () => {
  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/upload/audio');

    expect(response.status).toBe(401);
  });
});

describe('POST /api/v1/upload/video', () => {
  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/upload/video');

    expect(response.status).toBe(401);
  });
});
