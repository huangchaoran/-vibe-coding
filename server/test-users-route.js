require('dotenv').config({ path: '.env.test' });
process.env.NODE_ENV = 'test';

const express = require('express');

async function testUsersRoute() {
  console.log('=== 测试 users 路由 ===');

  const app = express();
  app.use(express.json());

  console.log('\n1. 加载 users 路由...');
  const usersRouter = require('./src/routes/users');
  app.use('/api/v1/users', usersRouter);

  console.log('\n2. 创建测试请求...');
  const request = require('supertest');

  console.log('\n3. 发送 GET /api/v1/users/profile...');
  const response = await request(app).get('/api/v1/users/profile').timeout(5000);
  console.log('响应:', response.status, response.body);

  console.log('\n✅ 测试完成！');
  process.exit(0);
}

testUsersRoute().catch(err => {
  console.error('❌ 测试失败:', err.message);
  console.error('错误堆栈:', err.stack);
  process.exit(1);
});