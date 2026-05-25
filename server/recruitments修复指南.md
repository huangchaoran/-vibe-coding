# 🔧 recruitments 表修复指南

## 问题描述

```
Unknown column 'target_type' in 'where clause'
```

实际上问题是 **`recruitments` 表不存在**，而不是 `target_type` 字段缺失。

## 解决方案

### 方案 1：执行 SQL 脚本（推荐）

#### 1. 打开 MySQL 客户端

```bash
# 使用命令行
mysql -u your_username -p your_database < scripts/fix-recruitments-table.sql

# 或者直接执行
mysql -u your_username -p your_database
```

#### 2. 选择数据库并执行 SQL

```sql
USE gojica_test;
SOURCE scripts/fix-recruitments-table.sql;
```

#### 3. 或者复制以下 SQL 直接执行

```sql
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
```

### 方案 2：使用 Node.js 脚本（自动创建）

后端应该已经在启动时自动创建表，你可以检查：

```bash
cd server
npm start
```

### 方案 3：检查数据库配置

确保 `.env` 文件配置正确：

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gojica_test
DB_USER=your_username
DB_PASSWORD=your_password
```

## 验证修复

执行以下命令验证表是否创建成功：

```sql
DESCRIBE recruitments;
```

应该显示：

```
+------------+-------------+------+-----+---------+----------------+
| Field      | Type        | Null | Key | Default | Comment        |
+------------+-------------+------+-----+---------+----------------+
| id         | int(11)     | NO   | PRI | NULL    | 招募ID         |
| band_id    | int(11)     | NO   | MUL | NULL    | 乐队ID         |
| title      | varchar(200)| NO   |     | NULL    | 招募标题       |
| description| text        | YES  |     | NULL    | 招募描述       |
| instrument | varchar(50) | NO   | MUL | NULL    | 所需乐器/角色  |
| requirement| text        | YES  |     | NULL    | 招募要求       |
| contact    | varchar(200)| YES  |     | NULL    | 联系方式       |
| status     | tinyint(4)  | NO   | MUL | 1       | 状态           |
| created_at | datetime    | YES  |     | NULL    | 创建时间       |
| updated_at | datetime    | YES  |     | NULL    | 更新时间       |
+------------+-------------+------+-----+---------+----------------+
```

## 测试修复

重新运行前端测试：

```bash
node test-deep-features.js
```

招募列表应该能正常加载数据了！

## 相关文件

- SQL 脚本：`scripts/fix-recruitments-table.sql`
- 模型定义：`src/models/Recruitment.js`
- 控制器：`src/controllers/recruitmentController.js`

## 注意事项

1. ⚠️ 执行 SQL 前请备份数据库
2. ⚠️ 确保数据库连接配置正确
3. ⚠️ 如果表已存在，会跳过创建（IF NOT EXISTS）
4. ✅ 脚本会自动插入测试数据

## 后续步骤

1. 执行上述 SQL 脚本
2. 重启后端服务
3. 重新测试前端招募列表功能
4. 如果还有问题，检查后端日志
