const { sequelize } = require('../src/database/connection');

async function createFollowsTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id INT PRIMARY KEY AUTO_INCREMENT,
        follower_id INT NOT NULL,
        following_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_follower (follower_id),
        INDEX idx_following (following_id),
        UNIQUE KEY uk_follow (follower_id, following_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ follows table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating follows table:', error.message);
    process.exit(1);
  }
}

createFollowsTable();