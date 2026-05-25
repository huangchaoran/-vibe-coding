/**
 * 修复 recruitments 表脚本
 * 自动连接数据库并创建缺失的表
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixRecruitmentsTable() {
  console.log('🔧 开始修复 recruitments 表...\n');

  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'gojica_db',
  };

  let connection;

  try {
    console.log('📡 连接到数据库...');
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ 数据库连接成功！\n');

    // 检查 recruitments 表是否存在
    console.log('🔍 检查 recruitments 表...');
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'recruitments'
    `, [connectionConfig.database]);

    if (tables.length > 0) {
      console.log('✅ recruitments 表已存在！\n');
      
      // 检查表结构
      console.log('📋 检查表结构...');
      const [columns] = await connection.query(`DESCRIBE recruitments`);
      console.log(columns);
      console.log('\n✅ recruitments 表结构完整！');
    } else {
      console.log('❌ recruitments 表不存在，开始创建...\n');

      // 创建 recruitments 表
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS recruitments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          band_id INT NOT NULL COMMENT '乐队ID',
          title VARCHAR(200) NOT NULL COMMENT '招募标题',
          description TEXT COMMENT '招募描述',
          instrument VARCHAR(50) NOT NULL COMMENT '所需乐器/角色',
          requirement TEXT COMMENT '招募要求',
          contact VARCHAR(200) COMMENT '联系方式',
          status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0关闭 1进行中',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          INDEX idx_band_id (band_id),
          INDEX idx_status (status),
          INDEX idx_instrument (instrument)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='乐队招募表'
      `;

      await connection.query(createTableSQL);
      console.log('✅ recruitments 表创建成功！\n');

      // 插入测试数据
      console.log('📝 插入测试数据...');
      
      // 首先检查是否有乐队数据
      const [bands] = await connection.query('SELECT id FROM bands LIMIT 1');
      
      if (bands.length > 0) {
        const bandId = bands[0].id;
        
        const insertSQL = `
          INSERT INTO recruitments (band_id, title, description, instrument, requirement, contact, status) VALUES
          (?, '招募吉他手', '寻找热爱摇滚的吉他手加入我们', 'guitar', '有演出经验，熟练掌握摇滚风格', '微信: test_band', 1),
          (?, '招募鼓手', '寻找节奏感强的鼓手', 'drum', '有2年以上打鼓经验', '邮箱: test@email.com', 1)
        `;
        
        await connection.query(insertSQL, [bandId, bandId]);
        console.log('✅ 测试数据插入成功！\n');
      } else {
        console.log('⚠️ 没有找到乐队数据，跳过插入测试数据');
        console.log('   请先创建乐队，然后手动添加招募信息\n');
      }
    }

    // 验证表
    console.log('🔬 验证表结构...');
    const [finalCheck] = await connection.query(`DESCRIBE recruitments`);
    console.log('\n表结构：');
    finalCheck.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(可空)' : '(必填)'}`);
    });

    // 查询数据
    console.log('\n📊 查询已存在的数据...');
    const [data] = await connection.query('SELECT * FROM recruitments');
    console.log(`找到 ${data.length} 条招募信息\n`);

    if (data.length > 0) {
      data.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title} - ${item.instrument}`);
      });
    }

    console.log('='.repeat(60));
    console.log('🎉 recruitments 表修复完成！');
    console.log('='.repeat(60));
    console.log('\n📌 后续步骤：');
    console.log('1. 重启后端服务');
    console.log('2. 刷新前端页面');
    console.log('3. 招募列表应该能正常显示了\n');

  } catch (error) {
    console.error('\n❌ 修复失败：', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   检查数据库用户名和密码是否正确');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   检查数据库名称是否正确');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   检查 MySQL 服务是否启动');
    }
    
    console.log('\n请根据错误信息调整后重试！');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 数据库连接已关闭');
    }
  }
}

fixRecruitmentsTable();
