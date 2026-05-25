require('dotenv').config({ path: '.env.test' });

const { User } = require('./src/models');

async function testDbQuery() {
  console.log('测试数据库查询...');
  
  try {
    console.log('\n1. 查询用户ID=1...');
    const startTime = Date.now();
    const user = await User.findByPk(1, {
      attributes: { exclude: ['openid', 'unionid'] },
    });
    const endTime = Date.now();
    
    console.log(`查询耗时: ${endTime - startTime}ms`);
    console.log('用户数据:', user ? user.toJSON() : null);
    
    console.log('\n✅ 数据库查询测试完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

testDbQuery();
