const mysql = require('mysql2/promise');

async function recreateDatabase() {
  let connection;
  try {
    console.log('正在连接到MySQL服务器...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '66366888'
    });

    console.log('✅ 成功连接到MySQL服务器\n');

    // 删除旧数据库
    console.log('正在删除旧数据库...');
    await connection.query('DROP DATABASE IF EXISTS gojica_db');
    console.log('✅ 旧数据库已删除\n');

    // 创建新数据库
    console.log('正在创建新数据库 gojica_db...');
    await connection.query(`
      CREATE DATABASE gojica_db 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci
    `);
    console.log('✅ 新数据库创建成功\n');

    console.log('🎉 数据库重建完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

recreateDatabase();
