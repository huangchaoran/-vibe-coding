# 测试数据库配置说明

## 数据库信息
- **主机**: localhost
- **端口**: 3306
- **数据库名**: gojica_test
- **用户名**: root
- **密码**: 66366888
- **方言**: mysql

## 已配置的表结构

测试数据库包含以下核心表：

1. **users** - 用户表
2. **bands** - 乐队表
3. **band_members** - 乐队成员表
4. **banners** - Banner表
5. **follows** - 关注关系表

## 测试数据Fixtures

已预加载以下测试数据：

### 用户 (6个)
- validUser (ID: 1) - 普通粉丝用户
- musicianUser (ID: 2) - 音乐人用户
- bandUser (ID: 3) - 乐队用户
- venueUser (ID: 4) - 场地用户
- adminUser (ID: 5) - 管理员用户
- disabledUser (ID: 6) - 已禁用的用户

### 乐队 (3个)
- Test Rock Band (ID: 1) - 已审核通过
- Pending Jazz Band (ID: 2) - 待审核
- Rejected Band (ID: 3) - 已拒绝

### 乐队成员 (2个)
- 乐队1的队长和成员

### Banner (3个)
- Welcome Banner - 启用状态
- Activity Banner - 启用状态
- Disabled Banner - 禁用状态

## 使用方法

### 1. 运行所有测试
```bash
cd server
npm test
```

### 2. 运行特定测试文件
```bash
npm test -- tests/integration/auth/auth.test.js
```

### 3. 运行带覆盖率报告的测试
```bash
npm run test:coverage
```

### 4. 手动初始化测试数据库
```bash
npm run init-test-db
```

### 5. 查看数据库状态
```bash
node scripts/setup-test-db.js --status
```

## 配置文件

### 环境配置文件
- `.env.test` - 测试环境变量配置

### Jest配置
- `jest.config.js` - Jest测试框架配置
- `tests/setup.js` - 测试环境初始化脚本

### 数据库脚本
- `scripts/setup-test-db.js` - 测试数据库设置工具
- `scripts/create-test-db.sql` - SQL建表脚本（仅供参考）

## 注意事项

1. 测试数据库会在每个测试套件运行前自动初始化
2. 测试数据会在每个测试套件运行后自动清理
3. 配置文件中的环境变量会覆盖.env文件中的设置
4. 所有集成测试使用真实的MySQL数据库连接

## 故障排查

### 数据库连接失败
1. 确认MySQL服务正在运行
2. 检查用户名和密码是否正确
3. 确认测试数据库已创建

### 测试数据未加载
1. 检查数据库连接是否正常
2. 确认表结构已正确创建
3. 查看测试日志中的错误信息

### 测试失败
1. 检查环境变量是否正确设置
2. 确认数据库表结构与模型定义一致
3. 查看Jest输出中的详细错误信息
