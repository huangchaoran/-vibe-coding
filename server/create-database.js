const mysql = require('mysql2/promise');

async function createDatabase() {
  let connection;
  try {
    console.log('正在连接到MySQL服务器...');
    
    // 连接到MySQL服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '66366888'
    });

    console.log('✅ 成功连接到MySQL服务器\n');

    // 创建数据库
    console.log('正在创建数据库 gojica_db...');
    await connection.execute(`
      CREATE DATABASE IF NOT EXISTS gojica_db 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci
    `);
    console.log('✅ 数据库 gojica_db 创建成功\n');

    // 选择数据库
    await connection.execute('USE gojica_db');
    console.log('✅ 已选择数据库 gojica_db\n');

    console.log('🎉 数据库创建完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();
