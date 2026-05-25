# Gojica Backend API

Gojica 音乐人社区与服务平台后端 API

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express 4.x
- **数据库**: MySQL 8.0
- **ORM**: Sequelize 6.x
- **认证**: JWT
- **测试**: Jest + Supertest

## 项目结构

```
server/
├── src/
│   ├── config/          # 配置文件
│   ├── constants/       # 常量定义
│   ├── models/          # 数据模型
│   ├── controllers/     # 控制器
│   ├── services/        # 业务逻辑层
│   ├── routes/          # 路由定义
│   ├── middlewares/     # 中间件
│   ├── utils/           # 工具函数
│   ├── validators/      # 验证规则
│   ├── database/        # 数据库连接
│   ├── app.js           # 应用入口
│   └── server.js        # 服务器入口
├── tests/               # 测试文件
├── scripts/             # 脚本
├── logs/                # 日志目录
├── uploads/             # 上传目录
└── README.md
```

## 快速开始

### 环境要求

- Node.js 18+
- MySQL 8.0+

### 安装

```bash
cd server
npm install
```

### 配置

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接和 JWT 密钥。

### 启动

开发环境：

```bash
npm run dev
```

生产环境：

```bash
npm start
```

### 初始化数据库

```bash
npm run init-db
```

## API 文档

基础路径：`http://localhost:3000/api/v1`

### 认证接口

- `POST /api/v1/auth/login` - 微信登录
- `POST /api/v1/auth/register` - 注册
- `POST /api/v1/auth/refresh` - 刷新Token
- `POST /api/v1/auth/logout` - 退出登录

### 首页接口

- `GET /api/v1/home/banners` - 轮播图
- `GET /api/v1/home/stats` - 统计数据

### 用户接口

- `GET /api/v1/users/profile` - 获取个人资料
- `PUT /api/v1/users/profile` - 更新个人资料
- `POST /api/v1/users/bind-identity` - 绑定身份

### 乐队接口

- `GET /api/v1/bands` - 乐队列表
- `GET /api/v1/bands/:id` - 乐队详情
- `POST /api/v1/bands` - 创建乐队
- `PUT /api/v1/bands/:id` - 更新乐队
- `DELETE /api/v1/bands/:id` - 删除乐队
- `POST /api/v1/bands/:id/follow` - 关注乐队

## 测试

```bash
# 运行所有测试
npm test

# 运行测试并监听变化
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## 代码规范

```bash
# 检查代码规范
npm run lint

# 自动修复代码规范问题
npm run lint:fix

# 格式化代码
npm run format
```

## 部署

### PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start ecosystem.config.js

# 查看日志
pm2 logs

# 重启服务
pm2 restart all
```

### Nginx

配置反向代理到 `http://localhost:3000`

## 文档

- [接口规范](../二次开发/docs/api_specification.md)
- [权限设计](../二次开发/docs/auth_design.md)
- [数据库设计](../二次开发/docs/database_er_diagrams.md)

## License

MIT
