const mysql = require('mysql2/promise');

async function verifyTestDatabase() {
  console.log('开始验证测试数据库...\n');

  // 创建数据库连接
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '66366888',
    database: 'gojica_test'
  });

  try {
    // 1. 检查数据库连接
    console.log('1. 检查数据库连接...');
    await connection.query('SELECT 1');
    console.log('   ✓ 数据库连接成功\n');

    // 2. 检查表是否存在
    console.log('2. 检查表结构...');
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log(`   发现 ${tableNames.length} 个表:`);
    tableNames.forEach(t => console.log(`   - ${t}`));
    console.log();

    // 3. 检查各表数据量
    console.log('3. 检查数据量:');
    for (const table of tableNames) {
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = countResult[0].count;
      console.log(`   - ${table}: ${count} 条记录`);
    }
    console.log();

    // 4. 检查users表的具体数据
    console.log('4. 检查users表数据:');
    const [users] = await connection.query('SELECT id, nickname, identity, status FROM users LIMIT 5');
    console.log('   前5个用户:');
    users.forEach(u => console.log(`   - ID: ${u.id}, ${u.nickname} (${u.identity}), status: ${u.status}`));
    console.log();

    // 5. 检查bands表数据
    console.log('5. 检查bands表数据:');
    const [bands] = await connection.query('SELECT id, name, style, status FROM bands');
    console.log('   所有乐队:');
    bands.forEach(b => console.log(`   - ID: ${b.id}, ${b.name} (${b.style}), status: ${b.status}`));
    console.log();

    // 6. 检查banners表数据
    console.log('6. 检查banners表数据:');
    const [banners] = await connection.query('SELECT id, title, status FROM banners');
    console.log('   所有Banners:');
    banners.forEach(b => console.log(`   - ID: ${b.id}, ${b.title}, status: ${b.status}`));
    console.log();

    // 7. 检查数据库配置
    console.log('7. 数据库配置:');
    console.log('   - Host: localhost');
    console.log('   - Port: 3306');
    console.log('   - Database: gojica_test');
    console.log('   - User: root');
    console.log('   - Dialect: mysql');
    console.log();

    console.log('✓ 所有检查通过！测试数据库配置正确。\n');

  } catch (error) {
    console.error('✗ 验证失败:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

verifyTestDatabase();
