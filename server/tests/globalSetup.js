/**
 * 全局测试设置
 * 在所有测试运行前执行：初始化数据库连接和加载测试数据
 */
require('dotenv').config({ path: '.env.test' });

const { sequelize, testConnection } = require('../src/database/connection');
const { createTestUsers, createTestBands } = require('./fixtures/loadFixtures');

module.exports = async () => {
  console.log('🔧 开始初始化测试环境...');

  try {
    console.log('🔌 正在连接测试数据库...');
    await testConnection();
    
    console.log('✅ 数据库连接成功');
    
    console.log('📥 正在加载测试数据...');
    await createTestUsers();
    await createTestBands();
    
    console.log('✅ 测试环境初始化完成\n');

    global.__SEQUELIZE__ = sequelize;

  } catch (error) {
    console.error('❌ 测试环境初始化失败:', error.message);
    throw error;
  }
};