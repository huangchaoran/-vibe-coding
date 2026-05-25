const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');
const usersFixtures = require('../../fixtures/users');

describe('GET /api/v1/users/profile', () => {
  it('应该返回用户资料当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('message', '操作成功');
    expect(response.body).toHaveProperty('data');
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
    expect(response.body).toHaveProperty('message', '未授权访问');
  });

  it('应该返回 401 当Token无效', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 401 当Authorization头格式错误', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', 'InvalidFormat token');

    expect(response.status).toBe(401);
  });
});

describe('PUT /api/v1/users/profile', () => {
  it('应该更新资料当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: 'New Nickname' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1002);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .put('/api/v1/users/profile')
      .send({ nickname: 'New Nickname' });

    expect(response.status).toBe(401);
  });

  it('应该支持更新头像', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ avatar: 'https://example.com/avatar.jpg' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1002);
  });

  it('应该支持更新简介', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: '这是一个新简介' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1002);
  });

  it('应该支持同时更新多个字段', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nickname: '新昵称',
        bio: '新的简介',
        avatar: 'https://example.com/new_avatar.jpg'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1002);
  });
});

describe('POST /api/v1/users/bind-identity', () => {
  it('应该绑定身份当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/users/bind-identity')
      .set('Authorization', `Bearer ${token}`)
      .send({ identity: 'musician' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1002);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/users/bind-identity')
      .send({ identity: 'musician' });

    expect(response.status).toBe(401);
  });

  it('应该支持绑定乐手身份', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/users/bind-identity')
      .set('Authorization', `Bearer ${token}`)
      .send({ identity: 'musician' });

    expect(response.status).toBe(200);
  });

  it('应该支持绑定主理人身份', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/users/bind-identity')
      .set('Authorization', `Bearer ${token}`)
      .send({ identity: 'musician' });

    expect(response.status).toBe(200);
  });

  it('应该支持绑定观众身份', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/users/bind-identity')
      .set('Authorization', `Bearer ${token}`)
      .send({ identity: 'fan' });

    expect(response.status).toBe(200);
  });
});

describe('GET /api/v1/users/favorites', () => {
  it('应该获取收藏列表当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    // 修复：API 返回分页格式 {list: [], pagination: {...}}
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data.list)).toBe(true);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/users/favorites');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });
});

describe('GET /api/v1/users/activities', () => {
  it('应该获取用户活动列表当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/activities')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/users/activities');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持分页参数', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/activities?page=1&pageSize=10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/users/bookings', () => {
  it('应该获取预约列表当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/users/bookings');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });
});

describe('GET /api/v1/users/orders', () => {
  it('应该获取订单列表当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/users/orders');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持状态筛选', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/orders?status=paid')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/users/follows', () => {
  it('应该获取关注列表当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test_openid',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/users/follows')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/users/follows');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });
});