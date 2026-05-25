-- 修复 recruitments 表缺失问题
-- 执行此脚本前请确保数据库连接配置正确

-- 创建 recruitments 表（如果不存在）
CREATE TABLE IF NOT EXISTS `recruitments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '招募ID',
  `band_id` INT NOT NULL COMMENT '乐队ID',
  `title` VARCHAR(200) NOT NULL COMMENT '招募标题',
  `description` TEXT NULL COMMENT '招募描述',
  `instrument` VARCHAR(50) NOT NULL COMMENT '所需乐器/角色',
  `requirement` TEXT NULL COMMENT '招募要求',
  `contact` VARCHAR(200) NULL COMMENT '联系方式',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0关闭 1进行中',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_band_id` (`band_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_instrument` (`instrument`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='乐队招募表';

-- 插入测试招募数据
INSERT INTO `recruitments` (`band_id`, `title`, `description`, `instrument`, `requirement`, `contact`, `status`) VALUES
(1, '招募吉他手', '寻找热爱摇滚的吉他手加入我们', 'guitar', '有演出经验，熟练掌握摇滚风格', '微信: test_band', 1),
(1, '招募鼓手', '寻找节奏感强的鼓手', 'drum', '有2年以上打鼓经验', '邮箱: test@email.com', 1),
(2, '招募键盘手', 'Jazz乐队招募键盘手', 'keyboard', '熟练演奏Jazz风格，伴奏能力强的优先', '电话: 13800138000', 1);

SELECT '✅ recruitments 表创建成功！' AS result;

-- 验证表是否创建成功
DESCRIBE recruitments;

-- 查看已插入的测试数据
SELECT * FROM recruitments;
