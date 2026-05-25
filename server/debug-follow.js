require('dotenv').config({ path: '.env.test' });
const { sequelize } = require('./src/database/connection');
const { Band, User } = require('./src/models');

async function testFollow() {
  try {
    console.log('开始测试关注功能...\n');

    // 创建测试用户
    const testUser = await User.findByPk(1);
    console.log('测试用户:', testUser ? testUser.nickname : '不存在');

    // 创建测试乐队
    const testBand = await Band.create({
      name: '调试测试乐队',
      style: 'Rock',
      intro: '用于调试',
      owner_id: 1,
      status: 1
    });
    console.log('创建乐队成功:', testBand.id);

    // 尝试关注
    const result = await sequelize.query(
      'INSERT INTO follows (follower_id, following_id, target_type, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      { replacements: [1, testBand.id, 'band'], type: sequelize.QueryTypes.INSERT }
    );
    console.log('关注成功:', result);

    // 清理
    await sequelize.query('DELETE FROM follows WHERE following_id = ?', {
      replacements: [testBand.id],
      type: sequelize.QueryTypes.DELETE
    });
    await testBand.destroy();
    console.log('清理完成');

    console.log('\n测试成功！');
    process.exit(0);
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

testFollow();
