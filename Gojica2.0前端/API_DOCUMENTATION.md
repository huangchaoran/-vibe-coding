# Gojica 2.0 API 文档

> **版本**: 2.0
> **更新时间**: 2026-05-08
> **基础 URL**: `http://localhost:3000/api/v1`

---

## 📋 目录

1. [认证模块 (Auth)](#1-认证模块-auth)
2. [首页模块 (Home)](#2-首页模块-home)
3. [用户模块 (Users)](#3-用户模块-users)
4. [乐队模块 (Bands)](#4-乐队模块-bands)
5. [活动模块 (Activities)](#5-活动模块-activities)
6. [动态模块 (Posts)](#6-动态模块-posts)
7. [搜索模块 (Search)](#7-搜索模块-search)
8. [产品模块 (Products)](#8-产品模块-products)
9. [招募模块 (Recruitments)](#9-招募模块-recruitments)
10. [房间模块 (Rooms)](#10-房间模块-rooms)
11. [上传模块 (Upload)](#11-上传模块-upload)

---

## 认证说明

### 全局请求头

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'
}
```

### 响应格式

```javascript
// 成功
{
  "code": 1000,        // 或 1001 (创建成功)
  "message": "操作成功",
  "data": { ... }
}

// 错误
{
  "code": 4000,        // 业务错误
  "message": "错误信息",
  "errors": [ ... ]
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 1000 | 操作成功 |
| 1001 | 创建成功 |
| 2000 | 参数错误 |
| 3001 | 未找到资源 |
| 3003 | 路由不存在 |
| 3004 | 验证失败 |
| 4000 | 服务器内部错误 |
| 4001 | 未授权 (401) |

---

## 1. 认证模块 (Auth)

### 1.1 开发环境登录

```
POST /auth/dev-login
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| identity | string | 否 | 用户身份: `fan`, `musician`, `venue`, `admin` |

**请求示例**:
```javascript
// 前端调用
import { authApi } from '@/common/utils/api.uts'

// fan 身份登录
authApi.devLogin('fan')

// musician 身份登录
authApi.devLogin('musician')
```

**响应示例**:
```javascript
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "nickname": "用户昵称",
      "avatar": "https://...",
      "identity": "fan"
    }
  }
}
```

### 1.2 微信登录

```
POST /auth/login
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | string | 是 | 微信授权码 |
| identity | string | 否 | 用户身份 |

### 1.3 发送验证码

```
POST /auth/send-code
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号 |

### 1.4 刷新 Token

```
POST /auth/refresh
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

### 1.5 退出登录

```
POST /auth/logout
```

---

## 2. 首页模块 (Home)

### 2.1 获取首页数据

```
GET /home
```

**响应示例**:
```javascript
{
  "code": 1000,
  "data": {
    "stats": {
      "userCount": 56,
      "bandCount": 38,
      "activityCount": 11,
      "postCount": 15
    },
    "hotBands": [...],
    "activities": [...],
    "banners": [...]
  }
}
```

### 2.2 获取统计数据

```
GET /home/stats
```

### 2.3 获取热门乐队

```
GET /home/bands
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

### 2.4 获取近期活动

```
GET /home/activities
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

### 2.5 获取首页横幅

```
GET /home/banners
```

---

## 3. 用户模块 (Users)

### 3.1 获取个人资料

```
GET /users/me
GET /users/profile
```

**需要认证**: ✅

### 3.2 更新个人资料

```
PUT /users/profile
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatar | string | 否 | 头像 URL |
| bio | string | 否 | 个人简介 |
| instrument | string | 否 | 乐器 |
| music_style | string | 否 | 音乐风格 |
| location | string | 否 | 位置 |

### 3.3 绑定身份

```
POST /users/bind-identity
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| identity | string | 是 | 身份类型 |

### 3.4 获取身份列表

```
GET /users/identities
```

**需要认证**: ✅

### 3.5 添加身份

```
POST /users/identities/add
```

**需要认证**: ✅

### 3.6 移除身份

```
POST /users/identities/remove
```

**需要认证**: ✅

### 3.7 获取用户统计

```
GET /users/stats
```

**需要认证**: ✅

### 3.8 获取收藏列表

```
GET /users/favorites
```

**需要认证**: ✅

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| type | string | 否 | 收藏类型: `band`, `activity`, `product`, `post` |

### 3.9 切换收藏

```
POST /users/favorites/toggle
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| target_id | number | 是 | 目标 ID |
| target_type | string | 是 | 目标类型: `band`, `activity`, `product`, `post` |

**响应示例**:
```javascript
{
  "code": 1000,
  "data": {
    "favorited": true  // true = 已收藏, false = 已取消
  }
}
```

### 3.10 获取我的活动

```
GET /users/activities
```

**需要认证**: ✅

### 3.11 获取关注列表

```
GET /users/follows
```

**需要认证**: ✅

### 3.12 获取预约列表

```
GET /users/bookings
```

**需要认证**: ✅

### 3.13 创建预约

```
POST /users/bookings
```

**需要认证**: ✅

### 3.14 获取订单列表

```
GET /users/orders
```

**需要认证**: ✅

### 3.15 创建订单

```
POST /users/orders
```

**需要认证**: ✅

---

## 4. 乐队模块 (Bands)

### 4.1 获取乐队列表

```
GET /bands
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| style | string | 否 | 音乐风格 |
| keyword | string | 否 | 关键词 |

### 4.2 获取乐队详情

```
GET /bands/:id
```

### 4.3 创建乐队

```
POST /bands
```

**需要认证**: ✅
**需要身份**: `musician` 或 `band`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 乐队名称 |
| style | string | 是 | 音乐风格 |
| intro | string | 否 | 乐队简介 |
| avatar | string | 否 | 头像 |
| cover | string | 否 | 封面图 |

### 4.4 更新乐队

```
PUT /bands/:id
```

**需要认证**: ✅

### 4.5 删除乐队

```
DELETE /bands/:id
```

**需要认证**: ✅

### 4.6 关注/取消关注乐队

```
POST /bands/:id/follow
```

**需要认证**: ✅

**响应示例**:
```javascript
{
  "code": 1000,
  "data": {
    "followed": true  // true = 已关注, false = 已取消
  }
}
```

### 4.7 获取乐队成员列表

```
GET /bands/:id/members
```

### 4.8 添加乐队成员

```
POST /bands/:id/members
```

**需要认证**: ✅

### 4.9 移除乐队成员

```
DELETE /bands/:id/members/:memberId
```

**需要认证**: ✅

### 4.10 获取乐队活动

```
GET /bands/:id/activities
```

---

## 5. 活动模块 (Activities)

### 5.1 获取活动列表

```
GET /activities
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| type | string | 否 | 活动类型 |
| status | string | 否 | 活动状态 |
| keyword | string | 否 | 关键词 |
| band_id | number | 否 | 乐队 ID |

### 5.2 获取活动详情

```
GET /activities/:id
```

### 5.3 创建活动

```
POST /activities
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 活动标题 |
| description | string | 否 | 活动描述 |
| type | string | 否 | 活动类型 |
| start_time | string | 否 | 开始时间 |
| end_time | string | 否 | 结束时间 |
| location | string | 否 | 活动地点 |

### 5.4 更新活动

```
PUT /activities/:id
```

**需要认证**: ✅

### 5.5 删除活动

```
DELETE /activities/:id
```

**需要认证**: ✅

### 5.6 报名活动

```
POST /activities/:id/signup
POST /activities/:id/participate
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| message | string | 否 | 报名留言 |

### 5.7 取消报名

```
POST /activities/:id/cancel
DELETE /activities/:id/cancel
```

**需要认证**: ✅

### 5.8 签到

```
POST /activities/:id/checkin
```

**需要认证**: ✅

### 5.9 获取报名列表

```
GET /activities/:id/signups
```

**需要认证**: ✅

### 5.10 获取用户的活动列表

```
GET /activities/user/activities
```

**需要认证**: ✅

---

## 6. 动态模块 (Posts)

### 6.1 获取动态列表

```
GET /posts
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| type | string | 否 | 动态类型 |

### 6.2 获取动态详情

```
GET /posts/:id
```

### 6.3 发布动态

```
POST /posts
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 动态内容 |
| images | array | 否 | 图片列表 |

### 6.4 更新动态

```
PUT /posts/:id
```

**需要认证**: ✅

### 6.5 删除动态

```
DELETE /posts/:id
```

**需要认证**: ✅

### 6.6 点赞

```
POST /posts/:id/like
```

**需要认证**: ✅

### 6.7 取消点赞

```
DELETE /posts/:id/like
```

**需要认证**: ✅

### 6.8 评论

```
POST /posts/:id/comment
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 评论内容 |

### 6.9 获取评论列表

```
GET /posts/:id/comments
```

---

## 7. 搜索模块 (Search)

### 7.1 搜索

```
GET /search
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| q | string | 是 | 搜索关键词 |
| type | string | 否 | 搜索类型: `all`, `band`, `activity`, `post`, `product` |

**请求示例**:
```javascript
// 前端调用
import { searchApi } from '@/common/utils/api.uts'

searchApi.search('摇滚', 'band')
searchApi.search('测试')
```

---

## 8. 产品模块 (Products)

### 8.1 获取产品列表

```
GET /products
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| keyword | string | 否 | 关键词 |

### 8.2 获取产品详情

```
GET /products/:id
```

### 8.3 创建产品

```
POST /products
```

**需要认证**: ✅

### 8.4 更新产品

```
PUT /products/:id
```

**需要认证**: ✅

### 8.5 删除产品

```
DELETE /products/:id
```

**需要认证**: ✅

---

## 9. 招募模块 (Recruitments)

### 9.1 获取招募列表

```
GET /recruitments
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| keyword | string | 否 | 关键词 |
| instrument | string | 否 | 乐器 |
| band_id | number | 否 | 乐队 ID |
| status | number | 否 | 状态 |

### 9.2 获取招募详情

```
GET /recruitments/:id
```

### 9.3 创建招募

```
POST /recruitments
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 招募标题 |
| instrument | string | 是 | 乐器 |
| description | string | 否 | 招募描述 |
| requirement | string | 否 | 要求 |
| contact | string | 否 | 联系方式 |
| band_id | number | 否 | 乐队 ID |

### 9.4 更新招募

```
PUT /recruitments/:id
```

**需要认证**: ✅

### 9.5 删除招募

```
DELETE /recruitments/:id
```

**需要认证**: ✅

### 9.6 申请加入

```
POST /recruitments/:id/apply
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| message | string | 否 | 申请留言 |

---

## 10. 房间模块 (Rooms)

### 10.1 获取房间列表

```
GET /rooms
```

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |
| keyword | string | 否 | 关键词 |

### 10.2 获取房间详情

```
GET /rooms/:id
```

### 10.3 预约房间

```
POST /rooms/:id/book
```

**需要认证**: ✅

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| book_date | string | 是 | 预约日期 |
| time_slot | string | 是 | 时间段 |
| contact_phone | string | 否 | 联系电话 |
| note | string | 否 | 备注 |

---

## 11. 上传模块 (Upload)

### 11.1 上传图片

```
POST /upload/image
```

**需要认证**: ✅

**请求格式**: `multipart/form-data`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 图片文件 |

**响应示例**:
```javascript
{
  "code": 1001,
  "message": "创建成功",
  "data": {
    "url": "https://...",
    "filename": "xxx.jpg"
  }
}
```

---

## 前端调用示例

### 完整的用户流程示例

```javascript
import { authApi, homeApi, userApi, bandApi, activityApi, postApi } from '@/common/utils/api.uts'

// 1. 登录
async function login() {
  try {
    const res = await authApi.devLogin('fan')
    uni.setStorageSync('token', res.data.token)
    uni.setStorageSync('userInfo', res.data.userInfo)
  } catch (e) {
    console.error('登录失败', e)
  }
}

// 2. 获取首页数据
async function getHomeData() {
  try {
    const res = await homeApi.getHomeData()
    console.log('首页数据', res.data)
  } catch (e) {
    console.error('获取首页数据失败', e)
  }
}

// 3. 获取用户资料
async function getUserProfile() {
  try {
    const res = await userApi.getProfile()
    console.log('用户资料', res.data)
  } catch (e) {
    console.error('获取用户资料失败', e)
  }
}

// 4. 关注乐队
async function followBand(bandId) {
  try {
    const res = await bandApi.follow(bandId)
    console.log('关注结果', res.data)
  } catch (e) {
    console.error('关注失败', e)
  }
}

// 5. 活动报名
async function signupActivity(activityId) {
  try {
    const res = await activityApi.signup(activityId, { message: '我想参加' })
    console.log('报名结果', res.data)
  } catch (e) {
    console.error('报名失败', e)
  }
}

// 6. 发布动态
async function createPost() {
  try {
    const res = await postApi.create({ content: '测试动态' })
    console.log('发布结果', res.data)
  } catch (e) {
    console.error('发布失败', e)
  }
}
```

---

**文档版本**: 2.0.0
**最后更新**: 2026-05-08