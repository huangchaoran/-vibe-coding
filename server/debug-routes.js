require('dotenv').config({ path: '.env.test' });

console.log('开始加载路由...');

try {
  console.time('routes');
  const routes = require('./src/routes');
  console.timeEnd('routes');
  console.log('✅ 路由加载成功');
  process.exit(0);
} catch (error) {
  console.error('❌ 路由加载失败:', error.message);
  console.error('错误详情:', error);
  process.exit(1);
}
