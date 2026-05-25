# Checklist - 前后端联调问题修复

## 修复检查清单

### Task 1: 前端 Token 字段名修复

- [ ] login/index.uvue 中使用 `res.data?.token` 替代 `res.data?.accessToken`
- [ ] login/index.uvue 中使用 `res.data?.userInfo` 替代 `res.data?.user`
- [ ] 登录功能测试通过

### Task 2: Sequelize 字段暴露修复

- [ ] deepConvert 函数排除 `PreviousDataValues` 字段
- [ ] deepConvert 函数排除 `uniqno` 字段
- [ ] deepConvert 函数排除 `Changed` 字段
- [ ] deepConvert 函数排除 `Options` 字段
- [ ] deepConvert 函数排除 `isNewRecord` 字段
- [ ] 列表接口返回数据不包含 Sequelize 内部字段

### Task 3: 搜索 URL 编码修复

- [ ] searchApi 中添加 URL 编码处理
- [ ] 中文关键词搜索功能正常工作
- [ ] 特殊字符搜索正常工作

### Task 4: 首页数据修复

- [ ] Home Controller 返回正确的 JSON 格式
- [ ] 首页数据包含 banners, stats, hotBands, activities
- [ ] 首页数据加载时间 < 500ms

### Task 5: Token 验证修复

- [ ] /api/v1/users/me 无 Token 返回 401
- [ ] 认证中间件正确处理 Token 过期
- [ ] 错误码与文档一致 (code: 3001)

### Task 6: 完整测试验证

- [ ] 后端单元测试全部通过
- [ ] 后端集成测试通过率 ≥ 95%
- [ ] API 联调测试通过率 ≥ 80%
- [ ] 所有关键业务流程测试通过

## 功能验证清单

### 登录流程
- [ ] 开发模式登录成功
- [ ] Token 正确存储
- [ ] 用户信息正确显示
- [ ] 登录失败错误提示

### 首页流程
- [ ] 轮播图加载
- [ ] 统计数据加载
- [ ] 热门乐队加载
- [ ] 近期活动加载

### 列表流程
- [ ] 乐队列表加载
- [ ] 活动列表加载
- [ ] 动态列表加载
- [ ] 无 Sequelize 内部字段

### 搜索流程
- [ ] 中文关键词搜索
- [ ] 分类搜索
- [ ] 结果正确显示

### 认证流程
- [ ] 无 Token 访问返回 401
- [ ] 错误信息正确
- [ ] 跳转到登录页
