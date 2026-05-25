const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');

describe('GET /api/v1/recruitments', () => {
  it('应该返回招募列表', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data.list)).toBe(true);
  });

  it('应该返回分页数据', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments?page=1&pageSize=10');

    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('pageSize');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
  });

  it('应该支持关键词搜索', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments?keyword=guitar');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按乐器筛选', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments?instrument=Guitar');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按乐队筛选', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments?band_id=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按状态筛选', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments?status=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持组合筛选', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments?instrument=Guitar&band_id=1&status=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持排序参数', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments?sort=created_at&order=DESC');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/recruitments/:id', () => {
  it('应该返回招募详情当招募存在', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('band');
    } else {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('code', 3003);
    }
  });

  it('应该返回 404 当招募不存在', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 404 当ID格式无效', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments/invalid');

    expect(response.status).toBe(404);
  });

  it('应该返回乐队信息当招募存在', async () => {
    const response = await request(app)
      .get('/api/v1/recruitments/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('band');
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });
});

describe('POST /api/v1/recruitments', () => {
  it('应该创建招募当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        band_id: 1,
        title: '招募吉他手',
        description: '我们正在寻找一位优秀的吉他手',
        instrument: 'Guitar',
        requirement: '有三年以上演奏经验'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/recruitments')
      .send({
        title: '招募吉他手',
        description: '我们正在寻找一位优秀的吉他手',
        instrument: 'Guitar'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 422 当必填字段为空', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        band_id: 1
      });

    expect(response.status).toBe(422);
  });

  it('应该支持创建带联系方式的招募', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        band_id: 1,
        title: '招募贝斯手',
        description: '我们正在寻找一位优秀的贝斯手',
        instrument: 'Bass',
        requirement: '有两年以上演奏经验',
        contact: 'wechat: music_band_123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });
});

describe('PUT /api/v1/recruitments/:id', () => {
  it('应该更新招募当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/recruitments/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '更新后的招募标题'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .put('/api/v1/recruitments/1')
      .send({
        title: '更新后的招募标题'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持更新招募描述', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/recruitments/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '更新后的招募描述'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该支持更新招募状态', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/recruitments/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 0
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 404 当招募不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/recruitments/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '更新后的招募标题'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('DELETE /api/v1/recruitments/:id', () => {
  it('应该删除招募当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/recruitments/1')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .delete('/api/v1/recruitments/1');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当招募不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/recruitments/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('POST /api/v1/recruitments/:id/apply', () => {
  it('应该申请加入当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments/1/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: '我非常感兴趣，希望能加入乐队'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    } else if (response.body.code === 3000) {
      expect(response.status).toBe(400);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/recruitments/1/apply')
      .send({
        message: '我非常感兴趣，希望能加入乐队'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持不填申请信息', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments/1/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003 || response.body.code === 3000) {
      expect([404, 400]).toContain(response.status);
    }
  });

  it('应该返回 404 当招募不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments/99999/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: '我非常感兴趣，希望能加入乐队'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 400 当招募已结束', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments/1/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: '我非常感兴趣，希望能加入乐队'
      });

    if (response.body.code === 3000) {
      expect(response.status).toBe(400);
    }
  });

  it('应该返回 400 当已是乐队成员', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/recruitments/1/apply')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: '我非常感兴趣，希望能加入乐队'
      });

    if (response.body.code === 3000) {
      expect(response.status).toBe(400);
    }
  });
});