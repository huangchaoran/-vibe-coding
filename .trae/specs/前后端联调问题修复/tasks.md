# Tasks - 前后端联调问题修复

## 任务列表

- [ ] Task 1: 修复前端 Token 字段名不匹配问题
  - [ ] Task 1.1: 修改 login/index.uvue 中的 token 字段名
  - [ ] Task 1.2: 修改 login/index.uvue 中的 userInfo 字段名
  - [ ] Task 1.3: 验证登录流程

- [ ] Task 2: 修复 Sequelize 内部字段暴露问题
  - [ ] Task 2.1: 更新 response.js 中的 deepConvert 函数
  - [ ] Task 2.2: 添加 Sequelize 内部字段排除列表
  - [ ] Task 2.3: 测试列表接口返回数据

- [ ] Task 3: 修复搜索 URL 编码问题
  - [ ] Task 3.1: 检查前端 searchApi 实现
  - [ ] Task 3.2: 添加 URL 参数编码处理
  - [ ] Task 3.3: 测试中文关键词搜索

- [ ] Task 4: 修复首页数据返回失败问题
  - [ ] Task 4.1: 检查 Home Controller 实现
  - [ ] Task 4.2: 修复返回数据格式
  - [ ] Task 4.3: 测试首页数据加载

- [ ] Task 5: 修复 Token 验证返回 404 问题
  - [ ] Task 5.1: 检查路由配置
  - [ ] Task 5.2: 检查认证中间件
  - [ ] Task 5.3: 测试 Token 验证

- [ ] Task 6: 运行完整测试验证
  - [ ] Task 6.1: 运行后端测试
  - [ ] Task 6.2: 运行联调测试脚本
  - [ ] Task 6.3: 生成测试报告

## 任务依赖关系

```
Task 1 ──┬──> Task 6 (全部完成后)
Task 2 ──┤
Task 3 ──┤
Task 4 ──┤
Task 5 ──┘
```

## 详细说明

### Task 1: 修复前端 Token 字段名

**文件**: `Gojica2.0前端/pages/login/index.uvue`

**当前代码**:
```typescript
api.default.setToken(res.data?.accessToken)
uni.setStorageSync('userInfo', res.data?.user || {})
```

**修改为**:
```typescript
api.default.setToken(res.data?.token)
uni.setStorageSync('userInfo', res.data?.userInfo || {})
```

### Task 2: 修复 Sequelize 字段暴露

**文件**: `server/src/utils/response.js`

**修改**: 更新 `deepConvert` 函数，排除 Sequelize 内部字段

### Task 3: 修复搜索 URL 编码

**文件**: `Gojica2.0前端/common/utils/api.uts`

**修改**: 在搜索请求中添加 URL 编码处理

### Task 4: 修复首页数据

**文件**: `server/src/controllers/homeController.js`

**修改**: 检查并修复返回数据格式

### Task 5: 修复 Token 验证

**文件**: `server/src/routes/*.js`, `server/src/middlewares/auth.js`

**修改**: 确保认证中间件正确返回 401 状态码
