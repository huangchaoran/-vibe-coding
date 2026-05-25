const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  it('应该返回服务健康状态', async () => {
    const response = await request(app)
      .get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 1000);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('status', 'running');
  });
});
