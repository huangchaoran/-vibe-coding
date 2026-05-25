/**
 * 全局测试清理
 * 在所有测试运行后执行：清理数据库连接
 */
const { sequelize } = require('../src/database/connection');

module.exports = async () => {
  console.log('开始清理测试环境...');

  try {
    // 关闭Sequelize连接池
    await sequelize.close();
    console.log('数据库连接已关闭');
    console.log('测试环境清理完成');
  } catch (error) {
    console.error('测试环境清理失败:', error.message);
    // 不抛出错误，确保清理操作完成
  }
};
