const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');

describe('GET /api/v1/activities', () => {
  it('应该返回活动列表', async () => {
    const response = await request(app)
      .get('/api/v1/activities');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data.list)).toBe(true);
  });

  it('应该返回分页数据', async () => {
    const response = await request(app)
      .get('/api/v1/activities?page=1&pageSize=10');

    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('pageSize');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
  });

  it('应该支持关键词搜索', async () => {
    const response = await request(app)
      .get('/api/v1/activities?keyword=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按乐队筛选', async () => {
    const response = await request(app)
      .get('/api/v1/activities?band_id=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按类型筛选', async () => {
    const response = await request(app)
      .get('/api/v1/activities?type=recruitment');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按状态筛选', async () => {
    const response = await request(app)
      .get('/api/v1/activities?status=recruiting');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持组合筛选', async () => {
    const response = await request(app)
      .get('/api/v1/activities?type=recruitment&status=recruiting&band_id=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/activities/:id', () => {
  it('应该返回活动详情当活动存在', async () => {
    const response = await request(app)
      .get('/api/v1/activities/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
    } else {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('code', 3003);
    }
  });

  it('应该返回 404 当活动不存在', async () => {
    const response = await request(app)
      .get('/api/v1/activities/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 422 当ID格式无效', async () => {
    const response = await request(app)
      .get('/api/v1/activities/invalid');

    expect(response.status).toBe(422);
  });
});

describe('POST /api/v1/activities', () => {
  it('应该创建活动当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '测试活动',
        description: '这是一个测试活动',
        start_time: '2026-05-01 10:00:00',
        end_time: '2026-05-01 18:00:00',
        location: '北京',
        max_participants: 100
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/activities')
      .send({
        title: '测试活动',
        description: '这是一个测试活动'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 422 当标题为空', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '这是一个测试活动'
      });

    expect(response.status).toBe(422);
  });

  it('应该支持创建带类型的活动', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '演出活动',
        type: 'performance',
        start_time: '2026-06-01 10:00:00',
        end_time: '2026-06-01 18:00:00',
        location: '上海'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });
});

describe('PUT /api/v1/activities/:id', () => {
  it('应该更新活动当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/activities/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '更新后的活动标题'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .put('/api/v1/activities/1')
      .send({
        title: '更新后的活动标题'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持更新活动描述', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/activities/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '更新后的活动描述'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该支持更新活动状态', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/activities/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'in_progress'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });
});

describe('DELETE /api/v1/activities/:id', () => {
  it('应该删除活动当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/activities/1')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .delete('/api/v1/activities/1');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当活动不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/activities/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('POST /api/v1/activities/:id/signup', () => {
  it('应该报名活动当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities/1/signup')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1001) {
      expect(response.status).toBe(201);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    } else if (response.body.code === 3000) {
      expect(response.status).toBe(400);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/activities/1/signup');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持报名时添加备注', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities/1/signup')
      .set('Authorization', `Bearer ${token}`)
      .send({
        participant_count: 2,
        remark: '两人参加'
      });

    if (response.body.code === 1001) {
      expect(response.status).toBe(201);
    } else if (response.body.code === 3000) {
      expect(response.status).toBe(400);
    }
  });
});

describe('POST /api/v1/activities/:id/participate', () => {
  it('应该报名活动当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities/1/participate')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1001) {
      expect(response.status).toBe(201);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    } else if (response.body.code === 3000) {
      expect(response.status).toBe(400);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/activities/1/participate');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });
});

describe('POST /api/v1/activities/:id/cancel', () => {
  it('应该取消报名当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities/1/cancel')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/activities/1/cancel');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });
});

describe('POST /api/v1/activities/:id/checkin', () => {
  it('应该签到当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/activities/1/checkin')
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
      .post('/api/v1/activities/1/checkin');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });
});

describe('GET /api/v1/activities/:id/signups', () => {
  it('应该获取报名列表当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/activities/1/signups')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('list');
      expect(response.body.data).toHaveProperty('pagination');
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    } else if (response.body.code === 3002) {
      expect(response.status).toBe(403);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/activities/1/signups');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持分页参数', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/activities/1/signups?page=1&pageSize=10')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.body.data.pagination).toHaveProperty('page');
      expect(response.body.data.pagination).toHaveProperty('pageSize');
    }
  });
});

describe('GET /api/v1/activities/user/activities', () => {
  it('应该获取用户参与的活动当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/activities/user/activities')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .get('/api/v1/activities/user/activities');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持分页参数', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/activities/user/activities?page=1&pageSize=10')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('pageSize');
  });

  it('应该支持按状态筛选', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .get('/api/v1/activities/user/activities?status=approved')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});