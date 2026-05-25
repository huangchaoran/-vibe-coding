require('dotenv').config({ path: '.env.test' });
process.env.NODE_ENV = 'test';

console.log('环境变量:', {
  NODE_ENV: process.env.NODE_ENV,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET
});

const request = require('supertest');
const app = require('./src/app');
const { generateToken } = require('./src/utils/jwt');

async function testWithDebug() {
  console.log('\n=== 测试调试 ===');
  
  const token = generateToken({
    userId: 1,
    openid: 'test_openid',
    identity: 'fan',
    role: 'user'
  });
  
  console.log('生成的Token:', token);
  
  try {
    console.log('\n1. 测试健康检查接口...');
    const healthRes = await request(app).get('/health').timeout(5000);
    console.log('健康检查:', healthRes.status, healthRes.body);
    
    console.log('\n2. 测试用户资料接口（使用mock auth中间件）...');
    
    const start = Date.now();
    const profileRes = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .timeout(10000);
    const end = Date.now();
    
    console.log(`用户资料接口耗时: ${end - start}ms`);
    console.log('用户资料:', profileRes.status, profileRes.body);
    
    console.log('\n✅ 所有测试完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
    process.exit(1);
  }
}

testWithDebug();
