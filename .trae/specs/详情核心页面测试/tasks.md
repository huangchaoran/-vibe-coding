# Tasks: 前端详情页API测试

## 任务概述
使用 gojica_test 测试数据库，验证前端详情页对应的后端API接口是否正常工作

## 数据库信息
- **测试数据库**: gojica_test
- **API基础URL**: http://localhost:3000/api/v1

---

## 任务清单

### Task 1: 准备测试数据
在 gojica_test 数据库中创建测试数据

- [ ] 创建乐队测试数据 (id=100)
  - INSERT INTO bands (id, name, avatar, cover, style, intro, owner_id, member_count, status)
  - INSERT INTO band_members (4条成员记录)

- [ ] 创建活动测试数据 (id=100)
  - INSERT INTO activities

- [ ] 创建商品测试数据 (id=100)
  - INSERT INTO products

- [ ] 创建帖子测试数据 (id=100)
  - INSERT INTO posts

- [ ] 创建招募测试数据 (id=100)
  - INSERT INTO recruitments

### Task 2: 测试乐队详情API
验证 GET /api/v1/bands/:id 接口

- [ ] 测试正面：用有效ID(100)访问，返回200和数据
- [ ] 测试正面：验证返回数据包含name、style、intro、members
- [ ] 测试反面：用无效ID(99999)访问，返回404

### Task 3: 测试活动详情API
验证 GET /api/v1/activities/:id 接口

- [ ] 测试正面：用有效ID(100)访问，返回200和数据
- [ ] 测试正面：验证返回数据包含title、location、fee、start_time
- [ ] 测试反面：用无效ID(99999)访问，返回404

### Task 4: 测试商品详情API
验证 GET /api/v1/products/:id 接口

- [ ] 测试正面：用有效ID(100)访问，返回200和数据
- [ ] 测试正面：验证返回数据包含title、price、images
- [ ] 测试反面：用无效ID(99999)访问，返回404

### Task 5: 测试帖子详情API
验证 GET /api/v1/posts/:id 接口

- [ ] 测试正面：用有效ID(100)访问，返回200和数据
- [ ] 测试正面：验证返回数据包含content、author、like_count
- [ ] 测试反面：用无效ID(99999)访问，返回404

### Task 6: 测试招募详情API
验证 GET /api/v1/recruitments/:id 接口

- [ ] 测试正面：用有效ID(100)访问，返回200和数据
- [ ] 测试正面：验证返回数据包含title、instrument、description
- [ ] 测试反面：用无效ID(99999)访问，返回404

---

## 任务依赖
- Task 1 应在其他任务前完成
- Task 2-6 可并行执行

## 验证方式
- API返回正确的HTTP状态码
- 响应数据结构与前端类型定义匹配
- 无服务器错误或数据库错误

## 预期结果
所有测试用例应通过，API正常返回数据