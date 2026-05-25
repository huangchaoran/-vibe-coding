require('dotenv').config();
const { sequelize } = require('./src/database/connection');
const { Favorite, Booking, Order } = require('./src/models');

const createTables = async () => {
  try {
    console.log('开始创建数据库表...\n');

    // 创建 favorites 表
    console.log('创建 favorites 表...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`favorites\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL COMMENT '用户ID',
        \`target_type\` ENUM('band', 'activity', 'product', 'post', 'room') NOT NULL COMMENT '收藏类型',
        \`target_id\` INT NOT NULL COMMENT '被收藏目标ID',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
        INDEX \`idx_user_id\` (\`user_id\`),
        INDEX \`idx_target\` (\`target_type\`, \`target_id\`),
        UNIQUE INDEX \`idx_user_target\` (\`user_id\`, \`target_type\`, \`target_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';
    `);
    console.log('✅ favorites 表创建成功\n');

    // 创建 bookings 表
    console.log('创建 bookings 表...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`bookings\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL COMMENT '预约用户ID',
        \`room_id\` INT NOT NULL COMMENT '排练室ID',
        \`book_date\` DATE NOT NULL COMMENT '预约日期',
        \`time_slot\` VARCHAR(50) NOT NULL COMMENT '时间段，如 09:00-12:00',
        \`status\` ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending' COMMENT '预约状态',
        \`contact_phone\` VARCHAR(20) COMMENT '联系电话',
        \`note\` TEXT COMMENT '备注',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX \`idx_user_id\` (\`user_id\`),
        INDEX \`idx_room_id\` (\`room_id\`),
        INDEX \`idx_book_date\` (\`book_date\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约表';
    `);
    console.log('✅ bookings 表创建成功\n');

    // 创建 orders 表
    console.log('创建 orders 表...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`order_no\` VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
        \`user_id\` INT NOT NULL COMMENT '购买用户ID',
        \`type\` ENUM('product', 'booking', 'activity', 'membership') NOT NULL COMMENT '订单类型',
        \`target_id\` INT COMMENT '关联目标ID（商品ID、预约ID等）',
        \`total_amount\` DECIMAL(10, 2) DEFAULT 0 COMMENT '总金额',
        \`status\` ENUM('pending', 'paid', 'cancelled', 'refunded', 'completed') DEFAULT 'pending' COMMENT '订单状态',
        \`payment_method\` VARCHAR(20) COMMENT '支付方式：wechat, alipay, card',
        \`paid_at\` DATETIME COMMENT '支付时间',
        \`note\` TEXT COMMENT '订单备注',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        INDEX \`idx_user_id\` (\`user_id\`),
        INDEX \`idx_order_no\` (\`order_no\`),
        INDEX \`idx_status\` (\`status\`),
        INDEX \`idx_type\` (\`type\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
    `);
    console.log('✅ orders 表创建成功\n');

    console.log('='.repeat(80));
    console.log('🎉 所有表创建成功！');
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 创建表失败:', error.message);
    process.exit(1);
  }
};

createTables();
