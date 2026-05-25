require('dotenv').config();
const { sequelize } = require('./src/database/connection');
const logger = require('./src/utils/logger');
const models = require('./src/models');

async function syncAllTables() {
  try {
    console.log('🚀 开始同步数据库表...\n');

    // 测试连接
    console.log('📡 测试数据库连接...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 同步所有表
    console.log('📋 同步所有模型表...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ 所有模型表同步成功\n');

    // 列出所有表
    console.log('📊 当前数据库中的表：');
    const [results] = await sequelize.query('SHOW TABLES');
    results.forEach((row, index) => {
      const tableName = Object.values(row)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log('\n🎉 数据库表同步完成！');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 同步失败:', error.message);
    logger.error('Database sync failed:', error);
    process.exit(1);
  }
}

syncAllTables();
