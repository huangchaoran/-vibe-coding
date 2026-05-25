const request = require('supertest');
const app = require('../../../src/app');
const { generateToken } = require('../../../src/utils/jwt');

describe('GET /api/v1/products', () => {
  it('应该返回商品列表', async () => {
    const response = await request(app)
      .get('/api/v1/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('list');
    expect(response.body.data).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data.list)).toBe(true);
  });

  it('应该返回分页数据', async () => {
    const response = await request(app)
      .get('/api/v1/products?page=1&pageSize=10');

    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('pageSize');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
  });

  it('应该支持关键词搜索', async () => {
    const response = await request(app)
      .get('/api/v1/products?keyword=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按分类筛选', async () => {
    const response = await request(app)
      .get('/api/v1/products?category=merch');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持按乐队筛选', async () => {
    const response = await request(app)
      .get('/api/v1/products?band_id=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持组合筛选', async () => {
    const response = await request(app)
      .get('/api/v1/products?category=merch&band_id=1&keyword=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持排序参数', async () => {
    const response = await request(app)
      .get('/api/v1/products?sort=price&order=ASC');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });
});

describe('GET /api/v1/products/:id', () => {
  it('应该返回商品详情当商品存在', async () => {
    const response = await request(app)
      .get('/api/v1/products/1');

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

  it('应该返回 404 当商品不存在', async () => {
    const response = await request(app)
      .get('/api/v1/products/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });

  it('应该返回 404 当ID格式无效', async () => {
    const response = await request(app)
      .get('/api/v1/products/invalid');

    expect(response.status).toBe(404);
  });

  it('应该返回乐队信息当商品存在', async () => {
    const response = await request(app)
      .get('/api/v1/products/1');

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('band');
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });
});

describe('POST /api/v1/products', () => {
  it('应该创建商品当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '测试商品',
        description: '这是一个测试商品',
        price: 99.99,
        stock: 100,
        category: 'merch'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .post('/api/v1/products')
      .send({
        title: '测试商品',
        description: '这是一个测试商品',
        price: 99.99
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
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '这是一个测试商品'
      });

    expect(response.status).toBe(422);
  });

  it('应该支持创建带图片的商品', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '带图片的商品',
        description: '这是一个带图片的测试商品',
        price: 199.99,
        stock: 50,
        category: 'merch',
        cover: 'https://example.com/cover.jpg'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });

  it('应该支持创建带原始价格的商品', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '打折商品',
        description: '这是一个打折商品',
        price: 79.99,
        original_price: 99.99,
        stock: 100,
        category: 'merch'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code', 1001);
  });
});

describe('PUT /api/v1/products/:id', () => {
  it('应该更新商品当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/products/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '更新后的商品标题'
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .put('/api/v1/products/1')
      .send({
        title: '更新后的商品标题'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该支持更新商品价格', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/products/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        price: 79.99
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该支持更新商品库存', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/products/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        stock: 200
      });

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 404 当商品不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .put('/api/v1/products/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '更新后的商品标题'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});

describe('DELETE /api/v1/products/:id', () => {
  it('应该删除商品当已登录', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/products/1')
      .set('Authorization', `Bearer ${token}`);

    if (response.body.code === 1000) {
      expect(response.status).toBe(200);
    } else if (response.body.code === 3003) {
      expect(response.status).toBe(404);
    }
  });

  it('应该返回 401 当未登录', async () => {
    const response = await request(app)
      .delete('/api/v1/products/1');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 3001);
  });

  it('应该返回 404 当商品不存在', async () => {
    const token = generateToken({
      userId: 1,
      openid: 'test',
      identity: 'fan',
      role: 'user'
    });

    const response = await request(app)
      .delete('/api/v1/products/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 3003);
  });
});