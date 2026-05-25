const request = require('supertest');
const app = require('../../../src/app');

describe('GET /api/v1/search', () => {
  it('应该返回搜索结果当关键词有效', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
  });

  it('应该返回 400 当关键词为空', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 3000);
  });

  it('应该返回 400 当无搜索参数', async () => {
    const response = await request(app)
      .get('/api/v1/search');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('code', 3000);
  });

  it('应该支持分类搜索-乐队', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&type=band');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('bands');
    expect(response.body.data.bands).toHaveProperty('list');
    expect(response.body.data.bands).toHaveProperty('total');
  });

  it('应该支持分类搜索-活动', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&type=activity');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('activities');
    expect(response.body.data.activities).toHaveProperty('list');
    expect(response.body.data.activities).toHaveProperty('total');
  });

  it('应该支持分类搜索-商品', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&type=product');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('products');
    expect(response.body.data.products).toHaveProperty('list');
    expect(response.body.data.products).toHaveProperty('total');
  });

  it('应该支持全类型搜索', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&type=all');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('bands');
    expect(response.body.data).toHaveProperty('activities');
    expect(response.body.data).toHaveProperty('products');
  });

  it('应该支持分页参数', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&page=1&pageSize=10');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该支持自定义分页大小', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&pageSize=20');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
  });

  it('应该返回正确的搜索结果结构-乐队', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&type=band');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.bands.list)).toBe(true);
    expect(typeof response.body.data.bands.total).toBe('number');
  });

  it('应该返回正确的搜索结果结构-活动', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&type=activity');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.activities.list)).toBe(true);
    expect(typeof response.body.data.activities.total).toBe('number');
  });

  it('应该返回正确的搜索结果结构-商品', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=test&type=product');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.products.list)).toBe(true);
    expect(typeof response.body.data.products.total).toBe('number');
  });

  it('应该处理搜索结果为空的情况', async () => {
    const response = await request(app)
      .get('/api/v1/search?q=nonexistent123456');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body.data.bands.total).toBe(0);
  });
});