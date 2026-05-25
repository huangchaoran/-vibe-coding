const mysql = require('mysql2/promise');

async function insertTestData() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '66366888',
    database: 'gojica_db'
  });
  
  try {
    console.log('Inserting test band data...');
    
    // 插入测试乐队
    const [result] = await conn.query(
      "INSERT INTO bands (name, style, intro, avatar, cover, owner_id, status, member_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      ['测试乐队', 'Rock', '这是一个测试乐队', 'avatar.jpg', 'cover.jpg', 1, 1, 3]
    );
    
    const bandId = result.insertId;
    console.log(`✅ 插入乐队成功，ID: ${bandId}`);
    
    // 插入乐队成员
    await conn.query(
      "INSERT INTO band_members (band_id, user_id, role, instrument, joined_at, status) VALUES (?, ?, 'leader', 'Guitar', NOW(), 1)",
      [bandId, 1]
    );
    await conn.query(
      "INSERT INTO band_members (band_id, user_id, role, instrument, joined_at, status) VALUES (?, ?, 'member', 'Bass', NOW(), 1)",
      [bandId, 2]
    );
    console.log('✅ 插入乐队成员成功');
    
    // 插入测试活动
    await conn.query(
      "INSERT INTO activities (title, description, cover_image, start_time, end_time, location, max_participants, status, band_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      ['测试活动', '这是一个测试活动', 'cover.jpg', '2026-06-01 19:00:00', '2026-06-01 22:00:00', '测试地点', 100, 1, bandId]
    );
    console.log('✅ 插入测试活动成功');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await conn.end();
  }
}

insertTestData();
