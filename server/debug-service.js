require('dotenv').config({ path: '.env.test' });
process.env.NODE_ENV = 'test';

const userService = require('./src/services/userService');

async function testService() {
  console.log('测试用户服务...');
  
  try {
    console.time('getUserProfile');
    const user = await userService.getUserProfile(1);
    console.timeEnd('getUserProfile');
    
    console.log('用户数据:', user ? user.toJSON() : null);
    console.log('✅ 服务层测试成功');
    process.exit(0);
  } catch (error) {
    console.error('❌ 服务层测试失败:', error.message);
    console.error('错误堆栈:', error.stack);
    process.exit(1);
  }
}

testService();
