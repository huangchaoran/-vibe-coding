# Gojica 2.0 E2E 测试计划

> **创建日期**: 2026-05-08
> **目标**: 建立完整的端到端测试套件
> **现状**: 仅有基础登录流程测试 (4 个测试用例)

---

## 📋 目录

1. [当前状态分析](#1-当前状态分析)
2. [测试目标](#2-测试目标)
3. [测试用例设计](#3-测试用例设计)
4. [路由测试矩阵](#4-路由测试矩阵)
5. [业务流程测试](#5-业务流程测试)
6. [数据流验证](#6-数据流验证)
7. [错误处理测试](#7-错误处理测试)
8. [测试实现计划](#8-测试实现计划)
9. [时间估算](#9-时间估算)

---

## 1. 当前状态分析

### 1.1 现有 E2E 测试

**文件**: `tests/e2e/user-flow.test.js`

**当前覆盖**:
- ✅ 用户登录流程
- ✅ 用户资料获取
- ✅ 退出登录
- ✅ 未授权访问

**测试数量**: 4 个
**通过率**: 100%

### 1.2 测试金字塔对比

```
                    ┌──────────────────┐
                    │   E2E Tests (当前) │  ← 4 tests
                    │  (user-flow.test) │
                   ├──────────────────┤
                   │ Integration Tests │  ← 308 tests ✅
                   │    (已完成)       │
                  ├──────────────────┤
                  │   Unit Tests      │  ← 67 tests ✅
                  │    (已完成)       │
                 └──────────────────┘
```

### 1.3 待扩展领域

| 模块 | 现有测试 | 计划测试 | 差距 |
|------|---------|----------|------|
| **认证流程** | 1 个流程 | 5 个流程 | +4 |
| **乐队管理** | 0 | 4 个流程 | +4 |
| **活动管理** | 0 | 4 个流程 | +4 |
| **动态发布** | 0 | 3 个流程 | +3 |
| **用户交互** | 0 | 4 个流程 | +4 |
| **搜索功能** | 0 | 2 个流程 | +2 |
| **数据验证** | 0 | 3 个流程 | +3 |
| **错误处理** | 0 | 3 个流程 | +3 |
| **总计** | **4** | **32** | **+28** |

---

## 2. 测试目标

### 2.1 覆盖率目标

- [ ] **路由覆盖率**: 100% API 路由端点测试
- [ ] **业务流程覆盖率**: 所有关键用户流程 100% 覆盖
- [ ] **认证流程覆盖率**: 所有认证场景 100% 覆盖
- [ ] **数据流覆盖率**: 关键数据创建、读取、更新、删除 100% 覆盖
- [ ] **错误处理覆盖率**: 所有错误场景 100% 覆盖

### 2.2 质量目标

- [ ] **测试用例总数**: 达到 50+ E2E 测试用例
- [ ] **测试执行时间**: 完整 E2E 套件 < 60 秒
- [ ] **测试稳定性**: 100% 稳定，无 flaky 测试
- [ ] **代码覆盖率**: E2E 测试覆盖所有核心 Controller

### 2.3 测试文件结构

```
tests/e2e/
├── user-flow.test.js              # ✅ 现有 - 基础登录流程
├── auth-flows.test.js            # 📝 待创建 - 完整认证流程
├── band-management.test.js        # 📝 待创建 - 乐队管理流程
├── activity-management.test.js     # 📝 待创建 - 活动管理流程
├── post-management.test.js        # 📝 待创建 - 动态发布流程
├── user-interactions.test.js      # 📝 待创建 - 用户交互流程
├── search-flows.test.js          # 📝 待创建 - 搜索功能流程
├── data-validation.test.js        # 📝 待创建 - 数据验证流程
└── error-handling.test.js        # 📝 待创建 - 错误处理流程
```

---

## 3. 测试用例设计

### 3.1 认证流程测试 (`auth-flows.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **开发模式登录** | POST /auth/dev-login | 返回 token | P0 |
| 2 | **微信授权登录** | POST /auth/login | 返回 token | P0 |
| 3 | **Token 刷新** | POST /auth/refresh | 返回新 token | P1 |
| 4 | **Token 过期处理** | 使用过期 token | 返回 401 | P1 |
| 5 | **多身份登录** | fan/musician/band/venue | 不同 token | P2 |

#### 测试实现

```javascript
describe('认证流程 E2E', () => {
  describe('开发模式登录', () => {
    it('应该成功登录并返回 token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/dev-login')
        .send({ phone: '13800138000', identity: 'fan' });
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('userInfo');
    });
    
    it('应该支持不同身份登录', async () => {
      const identities = ['fan', 'musician', 'band', 'venue'];
      for (const identity of identities) {
        const response = await request(app)
          .post('/api/v1/auth/dev-login')
          .send({ identity });
        expect(response.status).toBe(200);
      }
    });
  });
  
  describe('Token 生命周期', () => {
    it('应该能够刷新 Token', async () => {
      // 1. 登录获取 token
      const loginRes = await request(app)
        .post('/api/v1/auth/dev-login')
        .send({ identity: 'fan' });
      
      const refreshToken = loginRes.body.data.refreshToken;
      
      // 2. 使用 refresh token 获取新 token
      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });
      
      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.data).toHaveProperty('token');
    });
    
    it('过期 Token 应该被拒绝', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' + 'expired';
      
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(response.status).toBe(401);
    });
  });
});
```

---

### 3.2 乐队管理测试 (`band-management.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **创建乐队** | musician 登录 → 创建乐队 | 返回乐队信息 | P0 |
| 2 | **乐队详情** | 获取乐队列表 → 获取详情 | 返回详细信息 | P0 |
| 3 | **关注乐队** | fan 登录 → 关注乐队 | 返回成功 | P1 |
| 4 | **添加成员** | 乐队所有者 → 添加成员 | 成员列表更新 | P1 |
| 5 | **编辑乐队** | 所有者 → 更新信息 | 信息更新 | P2 |
| 6 | **删除乐队** | 所有者 → 删除乐队 | 返回 204 | P2 |
| 7 | **取消关注** | fan → 取消关注 | 返回成功 | P2 |

#### 测试实现

```javascript
describe('乐队管理流程 E2E', () => {
  let musicianToken;
  let fanToken;
  let createdBandId;
  
  beforeAll(async () => {
    // 准备测试数据
    const musicianRes = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'musician' });
    musicianToken = musicianRes.body.data.token;
    
    const fanRes = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'fan' });
    fanToken = fanRes.body.data.token;
  });
  
  describe('乐队创建流程', () => {
    it('音乐人应该能够创建乐队', async () => {
      const response = await request(app)
        .post('/api/v1/bands')
        .set('Authorization', `Bearer ${musicianToken}`)
        .send({
          name: '测试乐队 E2E',
          style: 'Rock',
          intro: '端到端测试创建的乐队'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      createdBandId = response.body.data.id;
    });
    
    it('普通用户不能创建乐队', async () => {
      const response = await request(app)
        .post('/api/v1/bands')
        .set('Authorization', `Bearer ${fanToken}`)
        .send({
          name: '非法乐队',
          style: 'Pop'
        });
      
      expect(response.status).toBe(403);
    });
  });
  
  describe('乐队关注流程', () => {
    it('用户应该能够关注乐队', async () => {
      const response = await request(app)
        .post(`/api/v1/bands/${createdBandId}/follow`)
        .set('Authorization', `Bearer ${fanToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('followed', true);
    });
    
    it('用户应该能够取消关注', async () => {
      const response = await request(app)
        .post(`/api/v1/bands/${createdBandId}/follow`)
        .set('Authorization', `Bearer ${fanToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('followed', false);
    });
  });
});
```

---

### 3.3 活动管理测试 (`activity-management.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **创建活动** | 登录 → 创建活动 | 返回活动信息 | P0 |
| 2 | **活动报名** | 用户 → 报名活动 | 返回成功 | P0 |
| 3 | **取消报名** | 用户 → 取消报名 | 返回成功 | P1 |
| 4 | **查看报名列表** | 活动所有者 → 查看 | 返回列表 | P1 |
| 5 | **查看活动详情** | 获取列表 → 查看详情 | 返回详细信息 | P2 |

#### 测试实现

```javascript
describe('活动管理流程 E2E', () => {
  let userToken;
  let organizerToken;
  let createdActivityId;
  
  beforeAll(async () => {
    const userRes = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'fan' });
    userToken = userRes.body.data.token;
    
    const organizerRes = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'musician' });
    organizerToken = organizerRes.body.data.token;
  });
  
  describe('活动报名流程', () => {
    it('应该能够创建活动', async () => {
      const response = await request(app)
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'E2E 测试活动',
          description: '端到端测试创建的活动',
          start_time: '2026-06-01 10:00:00',
          end_time: '2026-06-01 18:00:00',
          location: '测试地点',
          max_participants: 100
        });
      
      expect(response.status).toBe(201);
      createdActivityId = response.body.data.id;
    });
    
    it('用户应该能够报名活动', async () => {
      const response = await request(app)
        .post(`/api/v1/activities/${createdActivityId}/signup`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ message: '我想参加这个活动' });
      
      expect(response.status).toBe(201);
    });
    
    it('用户应该能够取消报名', async () => {
      const response = await request(app)
        .delete(`/api/v1/activities/${createdActivityId}/signup`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
    });
  });
});
```

---

### 3.4 动态发布测试 (`post-management.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **发布动态** | 登录 → 发布动态 | 返回动态信息 | P0 |
| 2 | **获取动态列表** | 公开访问 | 返回列表 | P0 |
| 3 | **点赞动态** | 用户 → 点赞 | 返回成功 | P1 |
| 4 | **评论动态** | 用户 → 评论 | 返回评论 | P1 |
| 5 | **删除动态** | 作者 → 删除 | 返回 204 | P2 |

#### 测试实现

```javascript
describe('动态发布流程 E2E', () => {
  let userToken;
  let anotherUserToken;
  let createdPostId;
  
  beforeAll(async () => {
    const userRes = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'fan' });
    userToken = userRes.body.data.token;
    
    const anotherRes = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'musician' });
    anotherUserToken = anotherRes.body.data.token;
  });
  
  describe('动态完整生命周期', () => {
    it('应该能够发布动态', async () => {
      const response = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'E2E 测试动态内容 🎵',
          images: []
        });
      
      expect(response.status).toBe(201);
      createdPostId = response.body.data.id;
    });
    
    it('应该能够点赞动态', async () => {
      const response = await request(app)
        .post(`/api/v1/posts/${createdPostId}/like`)
        .set('Authorization', `Bearer ${anotherUserToken}`);
      
      expect(response.status).toBe(200);
    });
    
    it('应该能够评论动态', async () => {
      const response = await request(app)
        .post(`/api/v1/posts/${createdPostId}/comment`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send({ content: '这是 E2E 测试评论' });
      
      expect(response.status).toBe(201);
    });
    
    it('应该能够删除自己的动态', async () => {
      // 先发布自己的动态
      const postRes = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content: '待删除的动态' });
      
      const myPostId = postRes.body.data.id;
      
      const deleteRes = await request(app)
        .delete(`/api/v1/posts/${myPostId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(deleteRes.status).toBe(204);
    });
  });
});
```

---

### 3.5 用户交互测试 (`user-interactions.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **关注用户** | 用户A → 关注用户B | 返回成功 | P1 |
| 2 | **收藏商品** | 用户 → 收藏商品 | 返回成功 | P1 |
| 3 | **更新资料** | 用户 → 更新昵称/头像 | 资料更新 | P1 |
| 4 | **获取收藏列表** | 用户 → 获取收藏 | 返回列表 | P2 |
| 5 | **获取关注列表** | 用户 → 获取关注 | 返回列表 | P2 |

#### 测试实现

```javascript
describe('用户交互流程 E2E', () => {
  let user1Token;
  let user2Token;
  
  beforeAll(async () => {
    const res1 = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'fan' });
    user1Token = res1.data.token;
    
    const res2 = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'musician' });
    user2Token = res2.data.token;
  });
  
  describe('用户资料管理', () => {
    it('应该能够更新个人资料', async () => {
      const response = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          nickname: 'E2E 测试昵称',
          bio: '这是 E2E 测试简介'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data.nickname).toBe('E2E 测试昵称');
    });
    
    it('应该能够获取收藏列表', async () => {
      const response = await request(app)
        .get('/api/v1/users/favorites')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('list');
      expect(response.body.data).toHaveProperty('pagination');
    });
  });
});
```

---

### 3.6 搜索功能测试 (`search-flows.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **全局搜索** | 关键词 → 搜索 | 返回所有结果 | P0 |
| 2 | **分类搜索** | 关键词 + type → 搜索 | 返回分类结果 | P0 |
| 3 | **空关键词搜索** | 空 → 搜索 | 返回 400 | P1 |

#### 测试实现

```javascript
describe('搜索功能流程 E2E', () => {
  describe('全局搜索', () => {
    it('应该能够搜索乐队', async () => {
      const response = await request(app)
        .get('/api/v1/search')
        .query({ q: 'rock', type: 'band' });
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('bands');
      expect(Array.isArray(response.body.data.bands)).toBe(true);
    });
    
    it('应该能够搜索活动', async () => {
      const response = await request(app)
        .get('/api/v1/search')
        .query({ q: '音乐', type: 'activity' });
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('activities');
    });
    
    it('空关键词应该返回错误', async () => {
      const response = await request(app)
        .get('/api/v1/search')
        .query({ q: '' });
      
      expect(response.status).toBe(400);
    });
  });
});
```

---

### 3.7 数据验证测试 (`data-validation.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **必填字段验证** | 留空必填字段 → 提交 | 返回 422 | P0 |
| 2 | **字段长度验证** | 超长输入 → 提交 | 返回 422 | P1 |
| 3 | **格式验证** | 错误格式 → 提交 | 返回 422 | P1 |

#### 测试实现

```javascript
describe('数据验证流程 E2E', () => {
  let token;
  
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity: 'musician' });
    token = res.data.token;
  });
  
  describe('乐队创建验证', () => {
    it('乐队名称为空应该返回错误', async () => {
      const response = await request(app)
        .post('/api/v1/bands')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' });
      
      expect(response.status).toBe(422);
    });
    
    it('乐队名称过长应该返回错误', async () => {
      const longName = 'A'.repeat(150); // 超过 100 字符限制
      
      const response = await request(app)
        .post('/api/v1/bands')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: longName });
      
      expect(response.status).toBe(422);
    });
  });
  
  describe('动态发布验证', () => {
    it('动态内容为空应该返回错误', async () => {
      const response = await request(app)
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });
      
      expect(response.status).toBe(422);
    });
  });
});
```

---

### 3.8 错误处理测试 (`error-handling.test.js`)

#### 测试场景

| # | 测试用例 | 测试步骤 | 预期结果 | 优先级 |
|---|---------|---------|---------|--------|
| 1 | **资源不存在** | 访问不存在ID | 返回 404 | P0 |
| 2 | **未授权访问** | 无 token 访问受保护资源 | 返回 401 | P0 |
| 3 | **权限不足** | 普通用户访问管理员接口 | 返回 403 | P1 |
| 4 | **服务器错误** | 触发服务器错误 | 返回 500 | P1 |

#### 测试实现

```javascript
describe('错误处理流程 E2E', () => {
  describe('资源不存在', () => {
    it('乐队不存在应该返回 404', async () => {
      const response = await request(app)
        .get('/api/v1/bands/99999');
      
      expect(response.status).toBe(404);
      expect(response.body.code).toBe(3003);
    });
    
    it('活动不存在应该返回 404', async () => {
      const response = await request(app)
        .get('/api/v1/activities/99999');
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('权限验证', () => {
    it('未登录访问受保护资源应该返回 401', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile');
      
      expect(response.status).toBe(401);
    });
    
    it('无效 token 应该返回 401', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', 'Bearer invalid_token');
      
      expect(response.status).toBe(401);
    });
  });
});
```

---

## 4. 路由测试矩阵

### 4.1 完整路由覆盖表

| 模块 | 路由 | 方法 | E2E 测试 | 状态 |
|------|------|------|---------|------|
| **Auth** | /auth/dev-login | POST | ✅ | 待实现 |
| | /auth/login | POST | ✅ | 待实现 |
| | /auth/refresh | POST | ✅ | 待实现 |
| | /auth/logout | POST | ✅ | 待实现 |
| **Bands** | /bands | GET | ✅ | 待实现 |
| | /bands | POST | ✅ | 待实现 |
| | /bands/:id | GET | ✅ | 待实现 |
| | /bands/:id | PUT | ✅ | 待实现 |
| | /bands/:id | DELETE | ✅ | 待实现 |
| | /bands/:id/follow | POST | ✅ | 待实现 |
| **Activities** | /activities | GET | ✅ | 待实现 |
| | /activities | POST | ✅ | 待实现 |
| | /activities/:id | GET | ✅ | 待实现 |
| | /activities/:id/signup | POST | ✅ | 待实现 |
| | /activities/:id/signup | DELETE | ✅ | 待实现 |
| **Posts** | /posts | GET | ✅ | 待实现 |
| | /posts | POST | ✅ | 待实现 |
| | /posts/:id | GET | ✅ | 待实现 |
| | /posts/:id/like | POST | ✅ | 待实现 |
| | /posts/:id/comment | POST | ✅ | 待实现 |
| **Users** | /users/profile | GET | ✅ | 待实现 |
| | /users/profile | PUT | ✅ | 待实现 |
| | /users/favorites | GET | ✅ | 待实现 |
| | /users/follows | GET | ✅ | 待实现 |
| **Search** | /search | GET | ✅ | 待实现 |
| **Home** | /home | GET | ✅ | 待实现 |
| | /home/banners | GET | ✅ | 待实现 |
| | /home/stats | GET | ✅ | 待实现 |

### 4.2 测试用例数量估算

- **Auth 模块**: 5 个测试用例
- **Bands 模块**: 7 个测试用例
- **Activities 模块**: 5 个测试用例
- **Posts 模块**: 6 个测试用例
- **Users 模块**: 5 个测试用例
- **Search 模块**: 3 个测试用例
- **Home 模块**: 3 个测试用例
- **Error Handling**: 8 个测试用例
- **Data Validation**: 6 个测试用例

**总计**: 48 个测试用例

---

## 5. 数据流验证

### 5.1 关键数据流

#### 数据流 1: 用户注册 → 登录 → 创建内容

```
1. 用户注册/登录
   ↓
2. 获取 token
   ↓
3. 使用 token 创建乐队
   ↓
4. 使用 token 创建活动
   ↓
5. 使用 token 发布动态
   ↓
6. 验证数据存在于数据库
```

#### 数据流 2: 关注流程

```
1. 用户A 登录
   ↓
2. 用户A 关注乐队
   ↓
3. 验证 follows 表记录
   ↓
4. 用户A 获取关注列表
   ↓
5. 验证列表包含该乐队
```

### 5.2 数据验证策略

```javascript
describe('数据流验证', () => {
  it('完整用户旅程数据一致性', async () => {
    // 1. 创建乐队
    const bandRes = await request(app)
      .post('/api/v1/bands')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '数据验证乐队', style: 'Rock' });
    
    const bandId = bandRes.body.data.id;
    
    // 2. 创建活动并关联乐队
    const activityRes = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '关联活动',
        band_id: bandId
      });
    
    const activityId = activityRes.body.data.id;
    
    // 3. 发布动态并关联乐队
    const postRes = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: '乐队动态',
        band_id: bandId
      });
    
    const postId = postRes.body.data.id;
    
    // 4. 验证数据关联
    const bandDetail = await request(app)
      .get(`/api/v1/bands/${bandId}`);
    
    expect(bandDetail.body.data).toHaveProperty('activities');
    expect(bandDetail.body.data).toHaveProperty('posts');
  });
});
```

---

## 6. 测试实现计划

### 6.1 分阶段实现

#### Phase 1: 认证流程 (1-2 天)

**目标**: 完成所有认证相关 E2E 测试

**任务**:
1. [ ] 扩展 `auth-flows.test.js`
2. [ ] 添加 Token 刷新测试
3. [ ] 添加 Token 过期测试
4. [ ] 添加多身份测试
5. [ ] 运行测试验证

**预计测试用例**: 5 个
**预计时间**: 2 小时

---

#### Phase 2: 核心业务流 (3-5 天)

**目标**: 完成乐队、活动、动态管理 E2E 测试

**任务**:
1. [ ] 创建 `band-management.test.js`
2. [ ] 创建 `activity-management.test.js`
3. [ ] 创建 `post-management.test.js`
4. [ ] 创建 `user-interactions.test.js`
5. [ ] 验证数据流一致性
6. [ ] 运行完整测试套件

**预计测试用例**: 23 个
**预计时间**: 8 小时

---

#### Phase 3: 高级功能 (2-3 天)

**目标**: 完成搜索、验证、错误处理 E2E 测试

**任务**:
1. [ ] 创建 `search-flows.test.js`
2. [ ] 创建 `data-validation.test.js`
3. [ ] 创建 `error-handling.test.js`
4. [ ] 添加边缘情况测试
5. [ ] 性能测试

**预计测试用例**: 17 个
**预计时间**: 6 小时

---

#### Phase 4: 优化与文档 (1-2 天)

**目标**: 测试优化和文档完善

**任务**:
1. [ ] 重构重复代码，使用 helper 函数
2. [ ] 添加测试数据清理逻辑
3. [ ] 创建测试文档
4. [ ] 设置 CI/CD 集成
5. [ ] 最终验证

**预计时间**: 4 小时

---

### 6.2 Helper 函数设计

```javascript
// tests/e2e/helpers/auth.helper.js
const request = require('supertest');
const app = require('../../src/app');

class AuthHelper {
  static async loginAs(identity = 'fan') {
    const response = await request(app)
      .post('/api/v1/auth/dev-login')
      .send({ identity });
    
    return response.body.data.token;
  }
  
  static async getAuthenticatedUser(identity = 'fan') {
    const token = await this.loginAs(identity);
    return { token };
  }
}

// tests/e2e/helpers/data.helper.js
class DataHelper {
  static async createBand(token, data = {}) {
    const response = await request(app)
      .post('/api/v1/bands')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: data.name || '测试乐队',
        style: data.style || 'Rock',
        intro: data.intro || '测试简介',
        ...data
      });
    
    return response.body.data;
  }
  
  static async createActivity(token, data = {}) {
    const response = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: data.title || '测试活动',
        description: data.description || '测试描述',
        start_time: data.start_time || '2026-06-01 10:00:00',
        end_time: data.end_time || '2026-06-01 18:00:00',
        location: data.location || '测试地点',
        max_participants: data.max_participants || 100,
        ...data
      });
    
    return response.body.data;
  }
  
  static async cleanup() {
    // 清理测试数据
    // TODO: 实现数据清理逻辑
  }
}

module.exports = { AuthHelper, DataHelper };
```

---

## 7. 测试数据管理

### 7.1 测试数据策略

#### 方案 A: Fixture 方案 (推荐)

```javascript
// tests/fixtures/e2e/users.fixture.js
module.exports = {
  musician: {
    identity: 'musician',
    token: null // 动态获取
  },
  fan: {
    identity: 'fan',
    token: null
  },
  band: {
    identity: 'band',
    token: null
  },
  venue: {
    identity: 'venue',
    token: null
  }
};

// tests/e2e/setup.js
const { AuthHelper } = require('./helpers/auth.helper');
const usersFixture = require('../fixtures/e2e/users.fixture');

async function setupE2ETestData() {
  for (const [key, user] of Object.entries(usersFixture)) {
    user.token = await AuthHelper.loginAs(user.identity);
  }
}

module.exports = { setupE2ETestData };
```

#### 方案 B: Mock 方案

使用 Jest mocks 模拟数据库操作，适合单元测试。

### 7.2 测试隔离

```javascript
describe('隔离的测试套件', () => {
  beforeAll(async () => {
    // 每个测试套件前清理数据库
    await DataHelper.cleanup();
  });
  
  afterAll(async () => {
    // 测试完成后清理
    await DataHelper.cleanup();
  });
  
  it('测试用例', async () => {
    // 测试逻辑
  });
});
```

---

## 8. CI/CD 集成

### 8.1 GitHub Actions 配置

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test_password
          MYSQL_DATABASE: gojica_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd server
          npm ci
          
      - name: Run E2E tests
        run: |
          cd server
          npm run test:e2e
        env:
          NODE_ENV: test
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_NAME: gojica_test
          DB_USER: root
          DB_PASSWORD: test_password
          
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-test-results
          path: server/test-results/
```

### 8.2 npm 脚本

```json
{
  "scripts": {
    "test:e2e": "jest --testPathPattern=e2e --forceExit",
    "test:e2e:watch": "jest --testPathPattern=e2e --watch",
    "test:e2e:coverage": "jest --testPathPattern=e2e --coverage --coverageReporters=text"
  }
}
```

---

## 9. 时间估算

### 9.1 总时间估算

| Phase | 任务 | 测试用例数 | 预计时间 |
|-------|------|----------|---------|
| **Phase 1** | 认证流程 | 5 | 2 小时 |
| **Phase 2** | 核心业务流 | 23 | 8 小时 |
| **Phase 3** | 高级功能 | 17 | 6 小时 |
| **Phase 4** | 优化与文档 | - | 4 小时 |
| **总计** | - | **48** | **20 小时** |

### 9.2 里程碑

| 里程碑 | 日期 | 完成标准 |
|--------|------|---------|
| **M1: 认证流程** | 第 1-2 天 | 5 个测试通过 |
| **M2: 核心业务** | 第 3-7 天 | 28 个测试通过 |
| **M3: 高级功能** | 第 8-10 天 | 45 个测试通过 |
| **M4: 完成优化** | 第 11-12 天 | 48 个测试通过，文档完善 |

---

## 10. 成功标准

### 10.1 量化指标

- [ ] **E2E 测试用例数**: ≥ 48 个
- [ ] **测试通过率**: 100%
- [ ] **测试执行时间**: < 60 秒
- [ ] **路由覆盖率**: 100%
- [ ] **业务流程覆盖率**: 100%

### 10.2 质量指标

- [ ] **无 Flaky 测试**: 所有测试稳定通过
- [ ] **清晰的测试结构**: 每个测试文件对应一个功能模块
- [ ] **完整的文档**: 每个测试有清晰的描述和注释
- [ ] **可维护性**: 使用 helper 函数减少重复代码

### 10.3 CI/CD 集成

- [ ] **GitHub Actions 配置完成**
- [ ] **自动化测试执行**
- [ ] **测试报告生成**
- [ ] **失败通知机制**

---

## 11. 风险与缓解

### 11.1 识别风险

| 风险 | 影响 | 可能性 | 缓解措施 |
|------|------|--------|---------|
| **测试数据依赖** | 测试不稳定 | 高 | 使用 beforeAll 预置数据 |
| **数据库状态污染** | 测试间相互影响 | 高 | 每个测试后清理数据 |
| **外部服务依赖** | 测试失败 | 中 | Mock 外部服务 |
| **性能问题** | 测试超时 | 低 | 优化数据库查询 |

### 11.2 缓解策略

1. **测试数据隔离**: 每个测试套件使用独立的测试数据
2. **数据清理**: afterAll 中清理所有测试数据
3. **错误重试**: CI 中配置测试失败重试机制
4. **性能监控**: 监控测试执行时间

---

## 12. 附录

### 12.1 相关文档

- [全面测试计划](./全面测试计划.md)
- [测试失败修复计划](./测试失败修复计划.md)
- [API 文档](../API_DOCUMENTATION.md)

### 12.2 参考资源

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [Supertest 官方文档](https://github.com/visionmedia/supertest)
- [测试金字塔最佳实践](https://martinfowler.com/articles/practical-test-pyramid.html)

---

**文档版本**: 1.0.0
**创建时间**: 2026-05-08
**下次审查**: 2026-05-15
**负责人**: AI Assistant (Trae IDE)
