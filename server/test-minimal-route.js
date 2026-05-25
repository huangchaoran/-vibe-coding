require('dotenv').config({ path: '.env.test' });
process.env.NODE_ENV = 'test';

const express = require('express');
const { asyncHandler } = require('./src/middlewares/errorHandler');
const userController = require('./src/controllers/userController');
const { requireAuth } = require('./src/middlewares/auth');

async function testMinimalRoute() {
  console.log('=== 最小化测试 users 路由 ===');

  const app = express();
  app.use(express.json());

  app.get('/api/v1/users/profile', requireAuth(), asyncHandler(userController.getProfile));

  console.log('\n创建测试请求...');
  const request = require('supertest');

  console.log('\n发送 GET /api/v1/users/profile (无token)...');
  const response = await request(app).get('/api/v1/users/profile').timeout(5000);
  console.log('响应:', response.status, response.body);

  console.log('\n✅ 测试完成！');
  process.exit(0);
}

testMinimalRoute().catch(err => {
  console.error('❌ 测试失败:', err.message);
  console.error('错误堆栈:', err.stack);
  process.exit(1);
});