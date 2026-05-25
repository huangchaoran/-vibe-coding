const request = require('supertest');
const app = require('../../../src/app');

describe('GET /api/v1/home/banners', () => {
  it('应该返回轮播图列表', async () => {
    const response = await request(app)
      .get('/api/v1/home/banners');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('message', '操作成功');
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe('GET /api/v1/home/stats', () => {
  it('应该返回统计数据', async () => {
    const response = await request(app)
      .get('/api/v1/home/stats');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('userCount');
    expect(response.body.data).toHaveProperty('bandCount');
    expect(response.body.data).toHaveProperty('activityCount');
    expect(response.body.data).toHaveProperty('productCount');
  });

  it('统计数据应该是数字', async () => {
    const response = await request(app)
      .get('/api/v1/home/stats');

    expect(typeof response.body.data.userCount).toBe('number');
    expect(typeof response.body.data.bandCount).toBe('number');
  });
});
