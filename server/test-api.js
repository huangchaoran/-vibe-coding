require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('./src/app');
const { generateToken } = require('./src/utils/jwt');

async function testApi() {
  console.log('开始测试 API...');
  
  const token = generateToken({
    userId: 1,
    openid: 'test_openid',
    identity: 'fan',
    role: 'user'
  });
  
  console.log('生成的 Token:', token);
  
  try {
    console.log('\n1. 测试健康检查接口...');
    const healthRes = await request(app).get('/health').timeout(5000);
    console.log('健康检查:', healthRes.status, healthRes.body);
    
    console.log('\n2. 测试用户资料接口（已登录）...');
    const profileRes = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .timeout(10000);
    console.log('用户资料:', profileRes.status, profileRes.body);
    
    console.log('\n✅ 所有测试完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

testApi();
