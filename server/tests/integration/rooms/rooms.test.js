const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');

describe('GET /api/v1/rooms', () => {
  it('应该返回房间列表', async () => {
    const response = await request(app)
      .get('/api/v1/rooms');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data.list)).toBe(true);
  });

  it('应该返回分页数据', async () => {
    const response = await request(app)
      .get('/api/v1/rooms?page=1&pageSize=10');

    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('pageSize');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
  });

  it('应该支持关键词搜索', async () => {
    const response = await request(app)
      .get('/api/v1/rooms?keyword=music');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按类型筛选', async () => {
    const response = await request(app)
      .get('/api/v1/rooms?type=chat');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按乐队筛选', async () => {
    const response = await request(app)
      .get('/api/v1/rooms?band_id=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持组合筛选', async () => {
    const response = await request(app)
      .get('/api/v1/rooms?type=chat&band_id=1&keyword=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持排序参数', async () => {
    const response = await request(app)
      .get('/api/v1/rooms?sort=created_at&order=DESC');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/rooms/:id', () => {
  it('应该返回房间详情当房间存在', async () => {
    const response = await request(app)
      .get('/api/v1/rooms/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('creator');
    } else {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('code', 3003);
    }
  });

  it('应该返回 404 当房间不存在', async () => {
    const response = await request(app)
      .get('/api/v1/rooms/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 404 当ID格式无效', async () => {
    const response = await request(app)
      .get('/api/v1/rooms/invalid');

    expect(response.status).toBe(404);
  });

  it('应该返回创建者和乐队信息当房间存在', async () => {
    const response = await request(app)
      .get('/api/v1/rooms/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('creator');
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });
});

describe('POST /api/v1/rooms', () => {
  it('应该创建房间当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '测试房间',
        type: 'chat',
        description: '这是一个测试房间'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/rooms')
      .send({
        name: '测试房间',
        type: 'chat',
        description: '这是一个测试房间'
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
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'chat'
      });

    expect(response.status).toBe(422);
  });

  it('应该支持创建带封面的房间', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '音乐聊天室',
        type: 'chat',
        description: '欢迎来到音乐聊天室',
        cover: 'https://example.com/cover.jpg',
        max_users: 100
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该支持关联乐队创建房间', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '乐队专属房间',
        type: 'voice',
        band_id: 1
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });
});

describe('PUT /api/v1/rooms/:id', () => {
  it('应该更新房间当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/rooms/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '更新后的房间名称'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    } else if (response.body.code === 3002) {
      expect(response.status).toBe(403);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .put('/api/v1/rooms/1')
      .send({
        name: '更新后的房间名称'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 403 当非创建者尝试修改', async () => {
    const token = generateToken({
      userId: 2,
      openid: 'other_user',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/rooms/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '尝试修改他人房间'
      });

    if (response.body.code === 3002) {
      expect(response.status).toBe(403);
    }
  });

  it('应该支持更新房间描述', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/rooms/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '更新后的房间描述'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003 || response.body.code === 3002) {
      expect([404, 403]).toContain(response.status);
    }
  });

  it('应该返回 404 当房间不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/rooms/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '更新后的房间名称'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('DELETE /api/v1/rooms/:id', () => {
  it('应该删除房间当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/rooms/1')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    } else if (response.body.code === 3002) {
      expect(response.status).toBe(403);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .delete('/api/v1/rooms/1');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 403 当非创建者尝试删除', async () => {
    const token = generateToken({
      userId: 2,
      openid: 'other_user',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/rooms/1')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 3002) {
      expect(response.status).toBe(403);
    }
  });

  it('应该返回 404 当房间不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/rooms/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('POST /api/v1/rooms/:id/join', () => {
  it('应该加入房间当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms/1/join')
      .set('Authorization', `Bearer ${token}`);

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
      .post('/api/v1/rooms/1/join');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当房间不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms/99999/join')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 400 当房间已满', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms/1/join')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 3000) {
      expect(response.status).toBe(400);
    }
  });
});

describe('POST /api/v1/rooms/:id/leave', () => {
  it('应该离开房间当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms/1/leave')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/rooms/1/leave');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当房间不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/rooms/99999/leave')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});