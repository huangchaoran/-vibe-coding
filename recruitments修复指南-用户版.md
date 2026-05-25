# 🎯 recruitments 表修复 - 最终指南

## ⚠️ 重要说明

我已经创建了自动修复脚本，但由于数据库权限限制，脚本无法自动执行。

**你需要在数据库中手动执行以下 SQL：**

---

## 📝 方案 1：复制执行（最快）

打开 MySQL 客户端（如 Navicat、MySQL Workbench、命令行等），连接到你的数据库，然后执行：

```sql
-- 创建 recruitments 表
CREATE TABLE IF NOT EXISTS `recruitments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `band_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `instrument` VARCHAR(50) NOT NULL,
  `requirement` TEXT,
  `contact` VARCHAR(200),
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_band_id` (`band_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_instrument` (`instrument`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='乐队招募表';

-- 插入测试数据（根据你的实际乐队ID调整）
INSERT INTO `recruitments` (`band_id`, `title`, `description`, `instrument`, `requirement`, `contact`, `status`) 
SELECT id, '招募吉他手', '寻找热爱音乐的吉他手', 'guitar', '有演出经验优先', '微信: test', 1 
FROM `bands` LIMIT 1;
```

---

## 📁 方案 2：导入 SQL 文件

1. 打开 MySQL 管理工具
2. 打开文件：`server/scripts/fix-recruitments-table.sql`
3. 执行整个脚本

---

## 🔧 方案 3：使用脚本（如果可行）

在服务器终端执行：

```bash
cd server
node scripts/fix-recruitments-table.js
```

---

## ✅ 验证修复成功

执行以下命令检查：

```sql
-- 检查表是否存在
SHOW TABLES LIKE 'recruitments';

-- 查看表结构
DESCRIBE recruitments;

-- 查看数据
SELECT * FROM recruitments;
```

如果都能正常返回结果，说明修复成功！

---

## 📋 数据库连接信息

从 `.env` 文件读取的配置：

- **Host**: localhost
- **Port**: 3306
- **Database**: gojica_db
- **User**: root
- **Password**: 66366888

---

## 🎉 修复完成后的测试

1. **重启后端服务**
   ```bash
   cd server
   npm start
   ```

2. **刷新前端页面**
   - 访问 http://localhost:5173
   - 进入招募列表页面

3. **应该能看到招募数据了！**

---

## 📞 如果还有问题

如果执行 SQL 时遇到错误，请告诉我：
1. 错误信息
2. 你使用的数据库管理工具
3. 数据库是否正在运行

我会帮你进一步排查问题！

---

**总结**：只需要复制上面的 SQL 到你的数据库工具中执行，recruitments 表就会自动创建并插入测试数据！
