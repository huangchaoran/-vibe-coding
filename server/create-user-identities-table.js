require('dotenv').config();
const { sequelize } = require('./src/database/connection');

const createUserIdentitiesTable = async () => {
  try {
    console.log('开始创建 user_identities 表...\n');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_identities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL COMMENT '用户ID',
        identity ENUM('fan', 'musician', 'band', 'venue') NOT NULL COMMENT '用户身份',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '绑定时间',
        INDEX idx_user_id (user_id),
        INDEX idx_identity (identity),
        UNIQUE INDEX idx_user_identity (user_id, identity)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户身份关联表';
    `);

    console.log('✅ user_identities 表创建成功！\n');

    console.log('开始为现有用户创建默认身份...\n');

    await sequelize.query(`
      INSERT IGNORE INTO user_identities (user_id, identity)
      SELECT id, COALESCE(identity, 'fan')
      FROM users;
    `);

    console.log('✅ 现有用户的默认身份创建完成！\n');

    console.log('='.repeat(60));
    console.log('🎉 所有操作成功完成！');
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    console.error(error);
    process.exit(1);
  }
};

createUserIdentitiesTable();
