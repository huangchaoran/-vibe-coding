const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '66366888',
  multipleStatements: true
};

const testDbConfig = {
  host: 'localhost',
  user: 'root',
  password: '66366888',
  database: 'gojica_db',
  multipleStatements: true
};

async function setupTestDatabase() {
  let connection;
  let testConnection;
  
  try {
    console.log('连接MySQL服务器...');
    connection = await mysql.createConnection(dbConfig);
    console.log('MySQL服务器连接成功');
    
    console.log('创建测试数据库...');
    await connection.query('CREATE DATABASE IF NOT EXISTS gojica_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('测试数据库创建成功');
    
    console.log('创建表和插入测试数据...');
    testConnection = await mysql.createConnection(testDbConfig);
    
    const sqlFile = fs.readFileSync(
      path.join(__dirname, 'create-test-db.sql'),
      'utf8'
    );
    await testConnection.query(sqlFile);
    console.log('表创建和测试数据插入成功');
    
    const [users] = await testConnection.query('SELECT COUNT(*) as count FROM users');
    const [bands] = await testConnection.query('SELECT COUNT(*) as count FROM bands');
    
    console.log(`\n数据库设置完成！`);
    console.log(`用户表: ${users[0].count} 条记录`);
    console.log(`乐队表: ${bands[0].count} 条记录`);
    
    await connection.end();
    await testConnection.end();
    console.log('\n连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('设置测试数据库失败:', error.message);
    if (connection) await connection.end();
    if (testConnection) await testConnection.end();
    process.exit(1);
  }
}

setupTestDatabase();
