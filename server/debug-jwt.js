require('dotenv').config({ path: '.env.test' });
process.env.NODE_ENV = 'test';

const { generateToken, verifyToken } = require('./src/utils/jwt');

const token = generateToken({
  userId: 1,
  openid: 'test_openid',
  identity: 'fan',
  role: 'user'
});

console.log('生成的Token:', token);

try {
  const decoded = verifyToken(token);
  console.log('解码结果:', decoded);
  console.log('✅ JWT验证成功');
} catch (error) {
  console.error('❌ JWT验证失败:', error.message);
}
