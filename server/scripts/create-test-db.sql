-- 创建测试数据库
CREATE DATABASE IF NOT EXISTS gojica_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gojica_test;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(64) NOT NULL UNIQUE COMMENT '微信openid',
  unionid VARCHAR(64) NULL COMMENT '微信unionid',
  nickname VARCHAR(50) NOT NULL DEFAULT '新用户' COMMENT '昵称',
  avatar VARCHAR(255) NULL DEFAULT '/static/images/default-avatar.png' COMMENT '头像',
  phone VARCHAR(20) NULL COMMENT '手机号',
  identity ENUM('fan', 'musician', 'band', 'venue') NOT NULL DEFAULT 'fan' COMMENT '用户身份',
  instrument VARCHAR(50) NULL COMMENT '擅长乐器',
  music_style VARCHAR(100) NULL COMMENT '音乐风格',
  location VARCHAR(100) NULL COMMENT '位置',
  bio TEXT NULL COMMENT '简介',
  video_url VARCHAR(255) NULL COMMENT '视频链接',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0禁用 1正常',
  last_login_at DATETIME NULL COMMENT '最后登录时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_openid (openid),
  INDEX idx_identity (identity),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 乐队表
CREATE TABLE IF NOT EXISTS bands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '乐队名称',
  style VARCHAR(100) NULL COMMENT '音乐风格',
  intro TEXT NULL COMMENT '乐队介绍',
  avatar VARCHAR(255) NULL COMMENT '乐队头像',
  cover VARCHAR(255) NULL COMMENT '乐队封面',
  owner_id INT NOT NULL COMMENT '创建者ID',
  status TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0待审核 1通过 2拒绝',
  reject_reason VARCHAR(255) NULL COMMENT '拒绝原因',
  member_count INT NOT NULL DEFAULT 0 COMMENT '成员数量',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_owner_id (owner_id),
  INDEX idx_status (status),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 乐队成员表
CREATE TABLE IF NOT EXISTS band_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  band_id INT NOT NULL COMMENT '乐队ID',
  user_id INT NOT NULL COMMENT '用户ID',
  role ENUM('leader', 'member') NOT NULL DEFAULT 'member' COMMENT '角色: leader队长 member成员',
  instrument VARCHAR(50) NULL COMMENT '演奏乐器',
  joined_at DATETIME NULL COMMENT '加入时间',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0待审核 1已加入',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_band_id (band_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 关注表
CREATE TABLE IF NOT EXISTS follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL COMMENT '关注者ID',
  following_id INT NOT NULL COMMENT '被关注者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uk_follower_following (follower_id, following_id),
  INDEX idx_follower_id (follower_id),
  INDEX idx_following_id (following_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL COMMENT '标题',
  image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
  link_type ENUM('activity', 'band', 'product', 'url', 'none') NOT NULL DEFAULT 'none' COMMENT '链接类型',
  link_value VARCHAR(255) NULL COMMENT '链接值',
  sort INT NOT NULL DEFAULT 0 COMMENT '排序',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0禁用 1启用',
  start_time DATETIME NULL COMMENT '开始时间',
  end_time DATETIME NULL COMMENT '结束时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_status (status),
  INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入测试数据
INSERT INTO users (openid, unionid, nickname, avatar, phone, identity, instrument, music_style, location, bio, status) VALUES
('test_openid_001', 'test_unionid_001', 'Test User', '/uploads/avatar/test.jpg', '13800138000', 'fan', 'Guitar', 'Rock', 'Beijing', 'A passionate musician', 1),
('test_openid_002', 'test_unionid_002', 'Musician User', '/uploads/avatar/musician.jpg', '13800138001', 'musician', 'Drums', 'Jazz', 'Shanghai', 'Professional drummer', 1),
('test_openid_003', 'test_unionid_003', 'Band User', '/uploads/avatar/band.jpg', '13800138002', 'band', NULL, 'Metal', 'Guangzhou', 'Band leader', 1),
('test_openid_004', 'test_unionid_004', 'Venue User', '/uploads/avatar/venue.jpg', '13800138003', 'venue', NULL, NULL, 'Shenzhen', 'Rehearsal room owner', 1),
('test_openid_005', 'test_unionid_005', 'Admin User', '/uploads/avatar/admin.jpg', '13800138004', 'fan', NULL, NULL, 'Beijing', 'System administrator', 1),
('test_openid_006', 'test_unionid_006', 'Disabled User', '/uploads/avatar/disabled.jpg', '13800138005', 'fan', NULL, NULL, NULL, NULL, 0);

INSERT INTO bands (name, style, intro, avatar, cover, owner_id, status, member_count) VALUES
('Test Rock Band', 'Rock', 'A test rock band from Beijing', '/uploads/band/test-band.jpg', '/uploads/band/test-band-cover.jpg', 3, 1, 4),
('Pending Jazz Band', 'Jazz', 'A test jazz band pending approval', '/uploads/band/pending-band.jpg', '/uploads/band/pending-band-cover.jpg', 2, 0, 3),
('Rejected Band', 'Pop', 'A rejected band', '/uploads/band/rejected-band.jpg', '/uploads/band/rejected-band-cover.jpg', 2, 2, 2);

INSERT INTO band_members (band_id, user_id, role, instrument, joined_at, status) VALUES
(1, 3, 'leader', 'Guitar', '2026-01-01', 1),
(1, 2, 'member', 'Drums', '2026-01-15', 1);

INSERT INTO banners (title, image_url, link_type, link_value, sort, status) VALUES
('Welcome Banner', '/uploads/banner/welcome.jpg', 'none', NULL, 1, 1),
('Activity Banner', '/uploads/banner/activity.jpg', 'activity', '1', 2, 1),
('Disabled Banner', '/uploads/banner/disabled.jpg', 'none', NULL, 3, 0);
