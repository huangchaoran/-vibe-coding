require('dotenv').config();
const { sequelize } = require('./src/database/connection');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功!');
    
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('\n📊 当前数据库中的表:');
    tables.forEach((row, index) => {
      const tableName = Object.values(row)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log('\n🎉 数据库验证完成!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
    process.exit(1);
  }
}

testConnection();
