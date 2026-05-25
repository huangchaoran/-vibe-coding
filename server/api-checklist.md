# Gojica API 检查清单

## 📍 端口配置对照

| 服务 | 端口 | 地址 | 状态 |
|------|------|------|------|
| 后端 API | 3000 | http://localhost:3000 | ✅ 运行中 |
| MySQL 数据库 | 3306 | localhost:3306 | ✅ 运行中 |
| 前端请求地址 | - | http://localhost:3000/api/v1 | ✅ 已配置 |

## 🔗 前后端接口对照

**后端配置文件**: `server/.env`
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gojica_db
```

**前端配置文件**: `Gojica前端/src/utils/request.uts`
```typescript
const BASE_URL = 'http://localhost:3000/api/v1';
```

## 认证 (auth)
- ✅ POST /api/v1/auth/login - 登录（支持微信登录和开发模式登录）
- ✅ POST /api/v1/auth/register - 注册
- ✅ POST /api/v1/auth/refresh - 刷新token
- ✅ POST /api/v1/auth/logout - 退出

## 首页 (home)
- ✅ GET /api/v1/home/stats - 首页统计数据
- ✅ GET /api/v1/home/activities - 首页活动
- ✅ GET /api/v1/home/bands - 首页乐队

## 用户 (users)
- ✅ GET /api/v1/users/profile - 获取用户信息（含多身份）
- ✅ PUT /api/v1/users/profile - 更新用户信息
- ✅ POST /api/v1/users/bind-identity - 绑定身份
- ✅ GET /api/v1/users/identities - 获取用户身份列表
- ✅ POST /api/v1/users/identities/add - 添加身份
- ✅ POST /api/v1/users/identities/remove - 移除身份
- ✅ GET /api/v1/users/stats - 获取用户统计数据（已修复）
- ✅ GET /api/v1/users/favorites - 获取收藏列表（已修复）
- ✅ GET /api/v1/users/activities - 获取我的活动列表（已修复）
- ✅ GET /api/v1/users/bookings - 获取预约列表（已修复）
- ✅ GET /api/v1/users/orders - 获取订单列表（已修复）
- ✅ GET /api/v1/users/follows - 获取关注列表

## 乐队 (bands)
- ✅ GET /api/v1/bands - 获取乐队列表（含关注状态）
- ✅ GET /api/v1/bands/:id - 获取乐队详情
- ⏳ POST /api/v1/bands - 创建乐队（待完善）
- ⏳ PUT /api/v1/bands/:id - 更新乐队（待完善）
- ⏳ DELETE /api/v1/bands/:id - 删除乐队（待完善）
- ✅ POST /api/v1/bands/:id/follow - 关注/取消关注乐队
- ✅ GET /api/v1/bands/:id/members - 获取乐队成员列表
- ✅ POST /api/v1/bands/:id/members - 添加乐队成员
- ✅ DELETE /api/v1/bands/:id/members/:memberId - 移除乐队成员
- ✅ GET /api/v1/bands/:id/activities - 获取乐队活动列表

## 活动 (activities)
- ✅ GET /api/v1/activities - 获取活动列表
- ✅ GET /api/v1/activities/:id - 获取活动详情
- ⏳ POST /api/v1/activities - 创建活动（待完善）
- ✅ POST /api/v1/activities/:id/signup - 活动报名
- ⏳ POST /api/v1/activities/:id/cancel - 取消报名（待完善）
- ⏳ POST /api/v1/activities/:id/checkin - 活动签到（待完善）

## 其他模块 (部分完成)
- rooms - 排练室（部分完成）
- products - 商品（部分完成）
- recruitments - 招募（部分完成）
- posts - 帖子（部分完成）
- search - 搜索（部分完成）
- upload - 上传（部分完成）

## 📊 测试状态汇总 (2026-05-06 更新)

| 模块 | 接口数 | 通过 | 待完善 | 未实现 |
|------|--------|------|--------|--------|
| 认证 | 4 | 4 | 0 | 0 |
| 首页 | 3 | 3 | 0 | 0 |
| 用户 | 12 | 12 | 0 | 0 |
| 乐队 | 11 | 9 | 2 | 0 |
| 活动 | 6 | 3 | 3 | 0 |
| **总计** | **36** | **31** | **5** | **0** |

## ✅ 已修复的表名/列名问题

| 问题类型 | 错误名称 | 正确名称 |
|---------|---------|---------|
| 表名 | `activities_signups` | `activity_signups` |
| 表名 | `room_bookings` | `bookings` |
| 表名 | `trade_orders` | `orders` |
| 列名 | `f.type` | `f.target_type` |
| 列名 | `o.buyer_id` | `o.user_id` |
| 列名 | `signup_time` | `created_at` |

## ✅ 测试状态图例
- ✅ 已测试并通过
- ⏳ 基础功能完成，需完善
- ❌ 未实现

## 🌐 服务状态
| 项目 | 状态 |
|------|------|
| 数据库连接 | ✅ 正常 |
| 服务端口 | ✅ 3000 |
| API基础路径 | ✅ /api/v1 |
| 根路径 | ✅ / (已添加) |
