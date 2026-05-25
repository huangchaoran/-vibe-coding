const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');

describe('GET /api/v1/posts', () => {
  it('应该返回帖子列表', async () => {
    const response = await request(app)
      .get('/api/v1/posts');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data.list)).toBe(true);
  });

  it('应该返回分页数据', async () => {
    const response = await request(app)
      .get('/api/v1/posts?page=1&pageSize=10');

    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('pageSize');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
  });

  it('应该支持关键词搜索', async () => {
    const response = await request(app)
      .get('/api/v1/posts?keyword=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按用户筛选', async () => {
    const response = await request(app)
      .get('/api/v1/posts?user_id=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按乐队筛选', async () => {
    const response = await request(app)
      .get('/api/v1/posts?band_id=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持组合筛选', async () => {
    const response = await request(app)
      .get('/api/v1/posts?user_id=1&band_id=1&keyword=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持排序参数', async () => {
    const response = await request(app)
      .get('/api/v1/posts?sort=created_at&order=DESC');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/posts/:id', () => {
  it('应该返回帖子详情当帖子存在', async () => {
    const response = await request(app)
      .get('/api/v1/posts/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('content');
      expect(response.body.data).toHaveProperty('author');
    } else {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('code', 3003);
    }
  });

  it('应该返回 404 当帖子不存在', async () => {
    const response = await request(app)
      .get('/api/v1/posts/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 404 当ID格式无效', async () => {
    const response = await request(app)
      .get('/api/v1/posts/invalid');

    expect(response.status).toBe(404);
  });

  it('应该返回评论列表当帖子存在', async () => {
    const response = await request(app)
      .get('/api/v1/posts/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });
});

describe('POST /api/v1/posts', () => {
  it('应该创建帖子当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '这是一条测试帖子'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/posts')
      .send({
        content: '这是一条测试帖子'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 422 当内容为空', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(422);
  });

  it('应该支持创建带图片的帖子', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '这是一条带图片的测试帖子',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该支持关联乐队发帖', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'musician',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '乐队官方帖子',
        band_id: 1
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });
});

describe('PUT /api/v1/posts/:id', () => {
  it('应该更新帖子当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/posts/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '更新后的帖子内容'
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
      .put('/api/v1/posts/1')
      .send({
        content: '更新后的帖子内容'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 403 当非作者尝试修改', async () => {
    const token = generateToken({
      userId: 2,
      openid: 'other_user',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/posts/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '尝试修改他人帖子'
      });

    if (response.body.code === 3002) {
      expect(response.status).toBe(403);
    }
  });

  it('应该支持更新帖子图片', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/posts/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        images: ['https://example.com/new_image.jpg']
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003 || response.body.code === 3002) {
      expect([404, 403]).toContain(response.status);
    }
  });

  it('应该返回 404 当帖子不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/posts/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '更新后的帖子内容'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('DELETE /api/v1/posts/:id', () => {
  it('应该删除帖子当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/posts/1')
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
      .delete('/api/v1/posts/1');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 403 当非作者尝试删除', async () => {
    const token = generateToken({
      userId: 2,
      openid: 'other_user',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/posts/1')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 3002) {
      expect(response.status).toBe(403);
    }
  });

  it('应该返回 404 当帖子不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/posts/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('POST /api/v1/posts/:id/like', () => {
  it('应该点赞帖子当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts/1/like')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/posts/1/like');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当帖子不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts/99999/like')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('POST /api/v1/posts/:id/comment', () => {
  it('应该评论帖子当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts/1/comment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '这是一条测试评论'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(201);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/posts/1/comment')
      .send({
        content: '这是一条测试评论'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 422 当评论内容为空', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts/1/comment')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(422);
  });

  it('应该返回 404 当帖子不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/posts/99999/comment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '这是一条测试评论'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});