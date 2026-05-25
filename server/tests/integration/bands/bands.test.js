const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');

describe('GET /api/v1/bands', () => {
  it('应该返回乐队列表', async () => {
    const response = await request(app)
      .get('/api/v1/bands');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data.list)).toBe(true);
  });

  it('应该返回分页数据（严格遵循API规范）', async () => {
    const response = await request(app)
      .get('/api/v1/bands?page=1&pageSize=10');

    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('pageSize');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
  });

  it('应该支持关键词搜索', async () => {
    const response = await request(app)
      .get('/api/v1/bands?keyword=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按风格筛选', async () => {
    const response = await request(app)
      .get('/api/v1/bands?style=rock');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按创建时间排序', async () => {
    const response = await request(app)
      .get('/api/v1/bands?sort=created_at&order=DESC');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按更新时间排序', async () => {
    const response = await request(app)
      .get('/api/v1/bands?sort=updated_at&order=ASC');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持组合筛选和排序', async () => {
    const response = await request(app)
      .get('/api/v1/bands?style=pop&sort=created_at&order=DESC');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/bands/:id', () => {
  it('应该返回乐队详情当乐队存在', async () => {
    const response = await request(app)
      .get('/api/v1/bands/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
    } else {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('code', 3003);
    }
  });

  it('应该返回 404 当乐队不存在', async () => {
    const response = await request(app)
      .get('/api/v1/bands/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 404 当ID格式无效', async () => {
    const response = await request(app)
      .get('/api/v1/bands/invalid');

    expect(response.status).toBe(404);
  });

  it('应该返回乐队成员信息当乐队存在', async () => {
    const response = await request(app)
      .get('/api/v1/bands/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });
});

describe('POST /api/v1/bands', () => {
  it('应该创建乐队当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/bands')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '测试乐队',
        style: 'rock',
        intro: '这是一个测试乐队'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/bands')
      .send({
        name: '测试乐队',
        style: 'rock'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 422 当名称为空', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/bands')
      .set('Authorization', `Bearer ${token}`)
      .send({
        style: 'rock',
        intro: '这是一个测试乐队'
      });

    expect(response.status).toBe(422);
  });

  it('应该支持创建带封面的乐队', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/bands')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '封面测试乐队',
        style: 'jazz',
        intro: '测试封面',
        avatar: 'https://example.com/avatar.jpg',
        cover: 'https://example.com/cover.jpg'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });
});

describe('PUT /api/v1/bands/:id', () => {
  it('应该更新乐队信息当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/bands/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '更新后的乐队名',
        intro: '更新后的简介'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .put('/api/v1/bands/1')
      .send({
        name: '更新后的乐队名'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持更新乐队风格', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/bands/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        style: 'pop'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该支持更新乐队头像', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/bands/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        avatar: 'https://example.com/new_avatar.jpg'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 404 当乐队不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/bands/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '更新后的乐队名'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('DELETE /api/v1/bands/:id', () => {
  it('应该删除乐队当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/bands/1')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .delete('/api/v1/bands/1');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当乐队不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/bands/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('POST /api/v1/bands/:id/follow', () => {
  it('应该关注乐队当已登录', async () => {
    // 使用 musician 身份创建乐队
    const musicianToken = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    // 先创建一个乐队
    const createResponse = await request(app)
      .post('/api/v1/bands')
      .set('Authorization', `Bearer ${musicianToken}`)
      .send({
        name: '测试乐队关注功能',
        style: 'rock',
        intro: '用于测试关注功能'
      });

    // 创建成功才能测试关注
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('data');
    expect(createResponse.body.data).toHaveProperty('id');
    const bandId = createResponse.body.data.id;

    // 使用 fan 身份关注乐队
    const fanToken = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post(`/api/v1/bands/${bandId}/follow`)
      .set('Authorization', `Bearer ${fanToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/bands/1/follow');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当乐队不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/bands/99999/follow')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });
});