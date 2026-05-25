
const mysql = require('mysql2/promise');

async function createSimpleDB() {
  let connection;
  try {
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '66366888',
      multipleStatements: true
    });

    console.log('Connected! Creating database...');
    
    await connection.query('CREATE DATABASE IF NOT EXISTS gojica_simple CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('Database created!');
    
    await connection.end();
    
    console.log('\n✅ Done! Now update .env to use DB_NAME=gojica_simple');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createSimpleDB();
