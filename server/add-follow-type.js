const mysql = require('mysql2/promise');

async function addColumn() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '66366888',
    database: 'gojica_db'
  });
  
  try {
    await conn.query("ALTER TABLE follows ADD COLUMN target_type ENUM('band', 'user') DEFAULT 'band' COMMENT '关注类型'");
    console.log('✅ Column added successfully!');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️ Column already exists');
    } else {
      console.error('❌ Error:', e.message);
    }
  } finally {
    await conn.end();
  }
}

addColumn();
