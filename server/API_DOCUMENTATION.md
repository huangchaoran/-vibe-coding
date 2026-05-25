# Gojica 音乐社区平台 - 后端 API 完整文档

> **项目版本**: v2.0.0  
> **后端技术栈**: Node.js + Express + Sequelize + MySQL 8.0  
> **更新日期**: 2026-05-07  
> **接口总数**: 76+ RESTful API

---

## 📋 目录

1. [基础信息](#一基础信息)
2. [认证说明](#二认证说明)
3. [响应格式](#三响应格式)
4. [业务状态码](#四业务状态码)
5. [认证模块 /api/v1/auth](#五认证模块-apiauth)
6. [首页模块 /api/v1/home](#六首页模块-apihome)
7. [用户模块 /api/v1/users](#七用户模块-apiusers)
8. [乐队模块 /api/v1/bands](#八乐队模块-apibands)
9. [活动模块 /api/v1/activities](#九活动模块-apiactivities)
10. [排练室模块 /api/v1/rooms](#十排练室模块-apirooms)
11. [商品模块 /api/v1/products](#十一商品模块-apiproducts)
12. [招聘模块 /api/v1/recruitments](#十二招聘模块-apirecruitments)
13. [动态模块 /api/v1/posts](#十三动态模块-apiposts)
14. [上传模块 /api/v1/upload](#十四上传模块-apiupload)
15. [搜索模块 /api/v1/search](#十五搜索模块-apisearch)
16. [数据类型定义](#十六数据类型定义)

---

## 一、基础信息

### 1.1 服务器配置

```
开发环境: http://localhost:3000
API Base URL: {baseUrl}/api/v1
```

### 1.2 请求头规范

```http
Content-Type: application/json
Authorization: Bearer {accessToken}  // 需要认证的接口
X-Requested-With: XMLHttpRequest
Accept: application/json
```

### 1.3 URL 编码

所有参数使用 UTF-8 编码传输。

---

## 二、认证说明

### 2.1 认证方式

采用 JWT (JSON Web Token) 进行身份认证。

- **Access Token**: 访问令牌，用于接口调用，有效期 2 小时
- **Refresh Token**: 刷新令牌，用于刷新 Access Token，有效期 7 天

### 2.2 Token 获取流程

1. 用户通过微信授权获取 `code`
2. 调用 `/auth/login` 接口，传入 `code` 和 `identity`
3. 服务器返回 `accessToken` 和 `refreshToken`
4. 前端将 Token 存储在本地storage中
5. 后续请求在 Header 中携带 `Authorization: Bearer {accessToken}`

### 2.3 Token 刷新机制

当 Access Token 过期时，调用 `/auth/refresh` 接口：

```json
POST /api/v1/auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

### 2.4 开发模式

在开发环境下，可以使用开发模式登录，跳过微信授权：

```json
POST /api/v1/auth/dev-login
{
  "identity": "fan"  // 可选，默认 fan
}
```

---

## 三、响应格式

### 3.1 成功响应

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {}
}
```

### 3.2 分页响应

```json
{
  "code": 1000,
  "message": "查询成功",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 3.3 错误响应

```json
{
  "code": 3000,
  "message": "错误信息",
  "errors": [
    { "field": "fieldName", "message": "错误描述" }
  ]
}
```

### 3.4 HTTP 状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功（无返回内容） |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未登录或Token过期/无效 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 422 | Unprocessable Entity | 验证错误 |
| 429 | Too Many Requests | 请求过于频繁 |
| 500 | Internal Server Error | 服务器内部错误 |

---

## 四、业务状态码

### 4.1 通用成功码（1000-1999）

| 状态码 | 说明 |
|--------|------|
| 1000 | 操作成功 |
| 1001 | 创建成功 |
| 1002 | 更新成功 |
| 1003 | 删除成功 |

### 4.2 认证成功码（2000-2999）

| 状态码 | 说明 |
|--------|------|
| 2000 | 认证成功 |
| 2001 | 退出成功 |
| 2002 | Token已刷新 |

### 4.3 客户端错误码（3000-3999）

| 状态码 | 说明 |
|--------|------|
| 3000 | 错误请求 |
| 3001 | 未授权访问 |
| 3002 | 禁止访问 |
| 3003 | 资源不存在 |
| 3004 | 验证失败 |
| 3005 | 资源冲突 |
| 3006 | 请求过于频繁 |

### 4.4 服务器错误码（4000-4999）

| 状态码 | 说明 |
|--------|------|
| 4000 | 服务器内部错误 |
| 4001 | 数据库操作失败 |
| 4002 | 服务暂时不可用 |
| 4003 | 网关超时 |

---

## 五、认证模块 /api/v1/auth

### 5.1 POST /login 用户登录

**功能描述**: 微信授权登录

**权限**: 公开

**请求参数**:

```json
{
  "code": "微信授权code",
  "identity": "fan|musician|venue|band"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 微信授权后获取的code |
| identity | string | 是 | 用户身份：fan(乐迷), musician(音乐人), venue(场地), band(乐队) |

**响应示例**:

```json
{
  "code": 2000,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "nickname": "用户昵称",
      "avatar": "/uploads/avatar/xxx.jpg",
      "identity": "fan"
    }
  }
}
```

---

### 5.2 POST /register 用户注册

**功能描述**: 用户注册

**权限**: 公开

**请求参数**:

```json
{
  "openid": "微信openid",
  "nickname": "用户昵称",
  "identity": "fan|musician|venue|band"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| openid | string | 是 | 微信openid |
| nickname | string | 是 | 用户昵称 |
| identity | string | 是 | 用户身份 |

**响应示例**:

```json
{
  "code": 2000,
  "message": "注册成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nickname": "用户昵称",
      "avatar": null,
      "identity": "fan"
    }
  }
}
```

---

### 5.3 POST /refresh 刷新Token

**功能描述**: 使用Refresh Token获取新的Access Token

**权限**: 公开

**请求参数**:

```json
{
  "refreshToken": "your_refresh_token"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

**响应示例**:

```json
{
  "code": 2002,
  "message": "Token已刷新",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200
  }
}
```

---

### 5.4 POST /logout 退出登录

**功能描述**: 用户退出登录

**权限**: 需要登录

**请求参数**: 无

**响应示例**:

```json
{
  "code": 2001,
  "message": "退出成功",
  "data": null
}
```

---

### 5.5 POST /dev-login 开发模式登录

**功能描述**: 开发环境下跳过微信授权直接登录

**权限**: 公开

**请求参数**:

```json
{
  "phone": "13800138000",
  "code": "123456",
  "identity": "fan"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 否 | 手机号（开发环境可不填） |
| code | string | 否 | 验证码（开发环境可不填） |
| identity | string | 否 | 用户身份，默认 fan |

**响应示例**:

```json
{
  "code": 2000,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "nickname": "开发用户",
      "avatar": null,
      "identity": "fan"
    }
  }
}
```

---

## 六、首页模块 /api/v1/home

### 6.1 GET /banners 获取轮播图列表

**功能描述**: 获取首页轮播图

**权限**: 公开

**请求参数**: 无

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "title": "周末Live House 音乐节",
      "subtitle": "5月10日 · 北京",
      "image": "/uploads/banners/banner1.jpg",
      "link": "/pages/activity/detail?id=1",
      "sort": 1,
      "status": 1
    }
  ]
}
```

---

### 6.2 GET /stats 获取首页统计数据

**功能描述**: 获取首页统计数字

**权限**: 公开

**请求参数**: 无

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "userCount": 1000,
    "bandCount": 50,
    "activityCount": 200,
    "productCount": 300
  }
}
```

---

### 6.3 GET /bands 获取热门乐队

**功能描述**: 获取首页热门乐队推荐

**权限**: 公开

**请求参数**: 无

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": [
    {
      "id": 100,
      "name": "暗夜摇滚团",
      "style": "rock",
      "intro": "一支热爱摇滚的乐队成立于2020年",
      "avatar": "/uploads/bands/avatar1.jpg",
      "member_count": 4,
      "owner": {
        "id": 1,
        "nickname": "小明",
        "avatar": "/uploads/avatar/1.jpg"
      },
      "is_followed": false
    }
  ]
}
```

---

### 6.4 GET /activities 获取近期活动

**功能描述**: 获取首页近期活动推荐

**权限**: 公开

**请求参数**: 无

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "title": "五月Live House",
      "type": "performance",
      "status": "recruiting",
      "cover": "/uploads/activities/cover1.jpg",
      "start_time": "2026-05-10T18:00:00Z",
      "location": "北京三里屯",
      "price": 0,
      "spots": 100,
      "signup_count": 50,
      "is_signed_up": false
    }
  ]
}
```

---

## 七、用户模块 /api/v1/users

### 7.1 GET /profile 获取个人资料

**功能描述**: 获取当前登录用户的详细资料

**权限**: 需要登录

**请求参数**: 无

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "id": 1,
    "nickname": "用户昵称",
    "avatar": "/uploads/avatar/xxx.jpg",
    "phone": "138****8888",
    "identity": "fan",
    "identities": ["fan", "musician"],
    "instrument": "Guitar",
    "music_style": "Rock",
    "location": "Beijing",
    "bio": "个人简介",
    "video_url": null,
    "status": 1,
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 7.2 PUT /profile 更新个人资料

**功能描述**: 更新当前用户的个人资料

**权限**: 需要登录

**请求参数**:

```json
{
  "nickname": "新昵称",
  "avatar": "/uploads/avatar/new.jpg",
  "instrument": "Guitar",
  "music_style": "Rock",
  "location": "Beijing",
  "bio": "新的个人简介",
  "video_url": "https://example.com/video.mp4"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatar | string | 否 | 头像URL |
| instrument | string | 否 | 乐器 |
| music_style | string | 否 | 音乐风格 |
| location | string | 否 | 所在地 |
| bio | string | 否 | 个人简介 |
| video_url | string | 否 | 个人视频URL |

**响应示例**:

```json
{
  "code": 1002,
  "message": "更新成功",
  "data": {
    "id": 1,
    "nickname": "新昵称",
    "avatar": "/uploads/avatar/new.jpg",
    "instrument": "Guitar",
    "music_style": "Rock",
    "location": "Beijing",
    "bio": "新的个人简介"
  }
}
```

---

### 7.3 POST /bind-identity 绑定/切换身份

**功能描述**: 绑定新的用户身份或切换当前身份

**权限**: 需要登录

**请求参数**:

```json
{
  "identity": "musician"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| identity | string | 是 | 身份类型：fan(乐迷), musician(音乐人), venue(场地), band(乐队) |

**响应示例**:

```json
{
  "code": 1002,
  "message": "身份绑定成功",
  "data": {
    "id": 1,
    "identity": "musician",
    "identities": ["fan", "musician"]
  }
}
```

---

### 7.4 GET /identities 获取身份列表

**功能描述**: 获取用户已绑定的所有身份

**权限**: 需要登录

**请求参数**: 无

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": ["fan", "musician"]
}
```

---

### 7.5 POST /identities/add 添加身份

**功能描述**: 添加新的用户身份

**权限**: 需要登录

**请求参数**:

```json
{
  "identity": "venue"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| identity | string | 是 | 要添加的身份类型 |

**响应示例**:

```json
{
  "code": 1002,
  "message": "身份添加成功",
  "data": ["fan", "musician", "venue"]
}
```

---

### 7.6 POST /identities/remove 移除身份

**功能描述**: 移除用户身份（至少保留一个身份）

**权限**: 需要登录

**请求参数**:

```json
{
  "identity": "venue"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| identity | string | 是 | 要移除的身份类型 |

**响应示例**:

```json
{
  "code": 1002,
  "message": "身份移除成功",
  "data": ["fan", "musician"]
}
```

---

### 7.7 GET /stats 获取用户统计

**功能描述**: 获取当前用户的统计数据

**权限**: 需要登录

**请求参数**: 无

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "followers": 100,
    "following": 50,
    "activities": 10,
    "bookings": 5,
    "orders": 20,
    "favorites": 15
  }
}
```

---

### 7.8 GET /favorites 获取收藏列表

**功能描述**: 获取用户收藏的内容列表

**权限**: 需要登录

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| type | string | 否 | 收藏类型：activity, band, product |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "target_type": "activity",
        "target_id": 1,
        "created_at": "2026-04-29T12:00:00Z",
        "activity": {
          "id": 1,
          "title": "五月Live House",
          "cover": "/uploads/activities/cover1.jpg"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 10,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 7.9 POST /favorites/toggle 切换收藏状态

**功能描述**: 收藏或取消收藏某个内容

**权限**: 需要登录

**请求参数**:

```json
{
  "target_type": "activity",
  "target_id": 1
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| target_type | string | 是 | 目标类型：activity, band, product |
| target_id | number | 是 | 目标ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "收藏成功",
  "data": {
    "favorited": true
  }
}
```

---

### 7.10 GET /activities 获取参与的活动

**功能描述**: 获取用户参与的所有活动

**权限**: 需要登录

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "activity": {
          "id": 1,
          "title": "五月Live House",
          "cover": "/uploads/activities/cover1.jpg",
          "start_time": "2026-05-10T18:00:00Z"
        },
        "status": "signed_up",
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 5,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 7.11 GET /bookings 获取预约记录

**功能描述**: 获取用户的排练室预约记录

**权限**: 需要登录

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "room_id": 1,
        "room": {
          "id": 1,
          "name": "录音棚A",
          "cover": "/uploads/rooms/cover1.jpg"
        },
        "booking_date": "2026-05-01",
        "start_time": "10:00",
        "end_time": "12:00",
        "status": "confirmed",
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 3,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 7.12 POST /bookings 创建预约

**功能描述**: 创建排练室预约

**权限**: 需要登录

**请求参数**:

```json
{
  "room_id": 1,
  "booking_date": "2026-05-01",
  "start_time": "10:00",
  "end_time": "12:00",
  "notes": "需要吉他音箱"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| room_id | number | 是 | 排练室ID |
| booking_date | string | 是 | 预约日期，格式：YYYY-MM-DD |
| start_time | string | 是 | 开始时间，格式：HH:mm |
| end_time | string | 是 | 结束时间，格式：HH:mm |
| notes | string | 否 | 备注信息 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "预约创建成功",
  "data": {
    "id": 1,
    "room_id": 1,
    "booking_date": "2026-05-01",
    "start_time": "10:00",
    "end_time": "12:00",
    "status": "pending",
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 7.13 GET /orders 获取订单记录

**功能描述**: 获取用户的商品订单列表

**权限**: 需要登录

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| status | string | 否 | 订单状态：pending, paid, shipped, completed, cancelled |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "order_no": "ORD202604291200001",
        "product": {
          "id": 1,
          "name": "吉他弦套装",
          "cover": "/uploads/products/cover1.jpg",
          "price": 199
        },
        "quantity": 1,
        "total_amount": 199,
        "status": "paid",
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 8,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 7.14 POST /orders 创建订单

**功能描述**: 创建商品订单

**权限**: 需要登录

**请求参数**:

```json
{
  "product_id": 1,
  "quantity": 1,
  "address": {
    "name": "张三",
    "phone": "13800138000",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "address": "三里屯某街10号"
  }
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| product_id | number | 是 | 商品ID |
| quantity | number | 是 | 购买数量 |
| address | object | 是 | 收货地址 |
| address.name | string | 是 | 收货人姓名 |
| address.phone | string | 是 | 收货人电话 |
| address.province | string | 是 | 省份 |
| address.city | string | 是 | 城市 |
| address.district | string | 否 | 区县 |
| address.address | string | 是 | 详细地址 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "订单创建成功",
  "data": {
    "id": 1,
    "order_no": "ORD202604291200001",
    "total_amount": 199,
    "status": "pending",
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 7.15 GET /follows 获取关注列表

**功能描述**: 获取用户关注的乐队列表

**权限**: 需要登录

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "band": {
          "id": 100,
          "name": "暗夜摇滚团",
          "style": "rock",
          "avatar": "/uploads/bands/avatar1.jpg",
          "member_count": 4
        },
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 5,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## 八、乐队模块 /api/v1/bands

### 8.1 GET / 获取乐队列表

**功能描述**: 获取乐队列表，支持筛选和搜索

**权限**: 公开

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| keyword | string | 否 | 搜索关键词（搜索乐队名称） |
| style | string | 否 | 音乐风格：rock, pop, jazz, folk, electronic |
| sort | string | 否 | 排序字段，默认 created_at |
| order | string | 否 | 排序方向：ASC, DESC，默认 DESC |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 100,
        "name": "暗夜摇滚团",
        "style": "rock",
        "intro": "一支热爱摇滚的乐队成立于2020年",
        "avatar": "/uploads/bands/avatar1.jpg",
        "cover": "/uploads/bands/cover1.jpg",
        "owner_id": 1,
        "status": 1,
        "member_count": 4,
        "owner": {
          "id": 1,
          "nickname": "小明",
          "avatar": "/uploads/avatar/1.jpg"
        },
        "is_followed": false
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 8.2 GET /:id 获取乐队详情

**功能描述**: 获取单个乐队的详细信息

**权限**: 公开

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 乐队ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "id": 100,
    "name": "暗夜摇滚团",
    "style": "rock",
    "intro": "一支热爱摇滚的乐队成立于2020年",
    "avatar": "/uploads/bands/avatar1.jpg",
    "cover": "/uploads/bands/cover1.jpg",
    "owner_id": 1,
    "status": 1,
    "member_count": 4,
    "created_at": "2026-04-29T13:33:21.000Z",
    "updated_at": "2026-04-29T13:33:21.000Z",
    "owner": {
      "id": 1,
      "nickname": "小明",
      "avatar": "/uploads/avatar/1.jpg",
      "instrument": "Guitar"
    },
    "members": [
      {
        "id": 100,
        "band_id": 100,
        "user_id": 1,
        "role": "leader",
        "instrument": "主唱",
        "joined_at": "2026-04-29T21:33:21.000Z",
        "status": 1,
        "user": {
          "id": 1,
          "nickname": "小明",
          "avatar": "/uploads/avatar/1.jpg",
          "instrument": "Guitar"
        }
      }
    ],
    "is_followed": false
  }
}
```

---

### 8.3 POST / 创建乐队

**功能描述**: 创建新乐队

**权限**: 需要登录 + musician/band 身份

**请求参数**:

```json
{
  "name": "暗夜摇滚团",
  "style": "rock",
  "intro": "一支热爱摇滚的乐队成立于2020年",
  "avatar": "/uploads/bands/avatar1.jpg",
  "cover": "/uploads/bands/cover1.jpg"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 乐队名称 |
| style | string | 是 | 音乐风格：rock, pop, jazz, folk, electronic |
| intro | string | 否 | 乐队简介 |
| avatar | string | 否 | 乐队头像 |
| cover | string | 否 | 乐队封面 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "创建成功",
  "data": {
    "id": 100,
    "name": "暗夜摇滚团",
    "style": "rock",
    "intro": "一支热爱摇滚的乐队成立于2020年",
    "avatar": "/uploads/bands/avatar1.jpg",
    "cover": "/uploads/bands/cover1.jpg",
    "owner_id": 1,
    "status": 1,
    "member_count": 1,
    "created_at": "2026-04-29T13:33:21.000Z"
  }
}
```

---

### 8.4 PUT /:id 更新乐队信息

**功能描述**: 更新乐队信息

**权限**: 需要登录 + 乐队创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 乐队ID |

**请求参数**:

```json
{
  "name": "暗夜摇滚乐团",
  "style": "rock",
  "intro": "更新后的乐队简介",
  "avatar": "/uploads/bands/avatar_new.jpg",
  "cover": "/uploads/bands/cover_new.jpg"
}
```

**响应示例**:

```json
{
  "code": 1002,
  "message": "更新成功",
  "data": {
    "id": 100,
    "name": "暗夜摇滚乐团",
    "style": "rock",
    "intro": "更新后的乐队简介",
    "updated_at": "2026-04-29T14:00:00.000Z"
  }
}
```

---

### 8.5 DELETE /:id 删除乐队

**功能描述**: 删除乐队

**权限**: 需要登录 + 乐队创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 乐队ID |

**响应示例**:

```json
{
  "code": 1003,
  "message": "删除成功",
  "data": null
}
```

---

### 8.6 POST /:id/follow 关注/取消关注乐队

**功能描述**: 关注或取消关注某个乐队

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 乐队ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "关注成功",
  "data": {
    "followed": true
  }
}
```

---

### 8.7 GET /:id/members 获取成员列表

**功能描述**: 获取乐队的成员列表

**权限**: 公开

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 乐队ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": [
    {
      "id": 100,
      "band_id": 100,
      "user_id": 1,
      "role": "leader",
      "instrument": "主唱",
      "joined_at": "2026-04-29T21:33:21.000Z",
      "status": 1,
      "user": {
        "id": 1,
        "nickname": "小明",
        "avatar": "/uploads/avatar/1.jpg",
        "instrument": "Guitar"
      }
    }
  ]
}
```

---

### 8.8 POST /:id/members 添加成员

**功能描述**: 添加乐队成员

**权限**: 需要登录 + 乐队创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 乐队ID |

**请求参数**:

```json
{
  "user_id": 2,
  "role": "member",
  "instrument": "吉他"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | number | 是 | 用户ID |
| role | string | 是 | 成员角色：leader, member |
| instrument | string | 是 | 乐器 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "成员添加成功",
  "data": {
    "id": 101,
    "band_id": 100,
    "user_id": 2,
    "role": "member",
    "instrument": "吉他",
    "status": 1
  }
}
```

---

## 九、活动模块 /api/v1/activities

### 9.1 GET / 获取活动列表

**功能描述**: 获取活动列表，支持筛选和搜索

**权限**: 公开

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| type | string | 否 | 活动类型：recruitment, performance, competition, other |
| status | string | 否 | 活动状态：recruiting, in_progress, ended |
| keyword | string | 否 | 搜索关键词 |
| band_id | number | 否 | 按乐队ID筛选 |
| sort | string | 否 | 排序字段，默认 created_at |
| order | string | 否 | 排序方向：ASC, DESC，默认 DESC |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "五月Live House",
        "type": "performance",
        "status": "recruiting",
        "cover": "/uploads/activities/cover1.jpg",
        "start_time": "2026-05-10T18:00:00Z",
        "end_time": "2026-05-10T22:00:00Z",
        "location": "北京三里屯",
        "price": 0,
        "spots": 100,
        "signup_count": 50,
        "is_signed_up": false
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 30,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 9.2 GET /:id 获取活动详情

**功能描述**: 获取单个活动的详细信息

**权限**: 公开

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "id": 1,
    "title": "五月Live House",
    "type": "performance",
    "status": "recruiting",
    "cover": "/uploads/activities/cover1.jpg",
    "description": "活动详细描述...",
    "start_time": "2026-05-10T18:00:00Z",
    "end_time": "2026-05-10T22:00:00Z",
    "location": "北京三里屯",
    "price": 0,
    "spots": 100,
    "signup_count": 50,
    "organizer_id": 1,
    "organizer": {
      "id": 1,
      "nickname": "主办方",
      "avatar": "/uploads/avatar/1.jpg"
    },
    "band_id": 100,
    "band": {
      "id": 100,
      "name": "暗夜摇滚团",
      "avatar": "/uploads/bands/avatar1.jpg"
    },
    "created_at": "2026-04-29T13:33:21.000Z",
    "is_signed_up": false,
    "is_favorited": false
  }
}
```

---

### 9.3 POST / 创建活动

**功能描述**: 创建新活动

**权限**: 需要登录

**请求参数**:

```json
{
  "title": "五月Live House",
  "type": "performance",
  "cover": "/uploads/activities/cover1.jpg",
  "description": "活动详细描述...",
  "start_time": "2026-05-10T18:00:00Z",
  "end_time": "2026-05-10T22:00:00Z",
  "location": "北京三里屯",
  "price": 0,
  "spots": 100,
  "band_id": 100
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 活动标题 |
| type | string | 是 | 活动类型：recruitment, performance, competition, other |
| cover | string | 否 | 活动封面 |
| description | string | 否 | 活动描述 |
| start_time | string | 是 | 开始时间，ISO格式 |
| end_time | string | 是 | 结束时间，ISO格式 |
| location | string | 是 | 活动地点 |
| price | number | 是 | 门票价格，0表示免费 |
| spots | number | 是 | 名额数量 |
| band_id | number | 否 | 关联乐队ID |

**响应示例**:

```json
{
  "code": 1001,
  "message": "创建成功",
  "data": {
    "id": 1,
    "title": "五月Live House",
    "type": "performance",
    "status": "recruiting",
    "created_at": "2026-04-29T13:33:21.000Z"
  }
}
```

---

### 9.4 PUT /:id 更新活动

**功能描述**: 更新活动信息

**权限**: 需要登录 + 活动创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

**请求参数**: 同创建活动

**响应示例**:

```json
{
  "code": 1002,
  "message": "更新成功",
  "data": {
    "id": 1,
    "title": "五月Live House（改）",
    "updated_at": "2026-04-29T14:00:00.000Z"
  }
}
```

---

### 9.5 DELETE /:id 删除活动

**功能描述**: 删除活动

**权限**: 需要登录 + 活动创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

**响应示例**:

```json
{
  "code": 1003,
  "message": "删除成功",
  "data": null
}
```

---

### 9.6 POST /:id/signup 报名活动

**功能描述**: 报名参加活动

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

**响应示例**:

```json
{
  "code": 1001,
  "message": "报名成功",
  "data": {
    "id": 1,
    "activity_id": 1,
    "user_id": 1,
    "status": "signed_up",
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 9.7 POST /:id/cancel 取消报名

**功能描述**: 取消活动报名

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "取消报名成功",
  "data": null
}
```

---

### 9.8 POST /:id/checkin 签到

**功能描述**: 活动现场签到

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "签到成功",
  "data": {
    "id": 1,
    "status": "checked_in",
    "checked_in_at": "2026-05-10T18:30:00Z"
  }
}
```

---

### 9.9 GET /:id/signups 获取报名列表

**功能描述**: 获取活动的报名用户列表

**权限**: 需要登录 + 活动创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 活动ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "status": "signed_up",
      "checked_in_at": null,
      "user": {
        "id": 1,
        "nickname": "用户A",
        "avatar": "/uploads/avatar/1.jpg"
      }
    }
  ]
}
```

---

### 9.10 GET /user/activities 获取我参与的活动

**功能描述**: 获取当前用户参与的所有活动

**权限**: 需要登录

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "activity": {
          "id": 1,
          "title": "五月Live House",
          "cover": "/uploads/activities/cover1.jpg",
          "start_time": "2026-05-10T18:00:00Z"
        },
        "status": "signed_up",
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 5,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## 十、排练室模块 /api/v1/rooms

### 10.1 GET / 获取排练室列表

**功能描述**: 获取排练室列表

**权限**: 公开

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| keyword | string | 否 | 搜索关键词 |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "录音棚A",
        "type": "recording",
        "cover": "/uploads/rooms/cover1.jpg",
        "price": 200,
        "capacity": 5,
        "equipment": "调音台、麦克风、耳机",
        "status": "available"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 10,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 10.2 GET /:id 获取排练室详情

**功能描述**: 获取单个排练室的详细信息

**权限**: 公开

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 排练室ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "录音棚A",
    "type": "recording",
    "cover": "/uploads/rooms/cover1.jpg",
    "description": "专业录音棚...",
    "price": 200,
    "capacity": 5,
    "equipment": "调音台、麦克风、耳机",
    "images": [
      "/uploads/rooms/image1.jpg",
      "/uploads/rooms/image2.jpg"
    ],
    "status": "available"
  }
}
```

---

### 10.3 POST / 创建排练室

**功能描述**: 创建新排练室

**权限**: 需要登录

**请求参数**:

```json
{
  "name": "录音棚A",
  "type": "recording",
  "cover": "/uploads/rooms/cover1.jpg",
  "description": "专业录音棚...",
  "price": 200,
  "capacity": 5,
  "equipment": "调音台、麦克风、耳机"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 排练室名称 |
| type | string | 是 | 类型：rehearsal, recording |
| cover | string | 否 | 封面图 |
| description | string | 否 | 详细描述 |
| price | number | 是 | 价格/小时 |
| capacity | number | 是 | 容纳人数 |
| equipment | string | 否 | 设备列表 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "录音棚A",
    "type": "recording",
    "created_at": "2026-04-29T13:33:21.000Z"
  }
}
```

---

### 10.4 PUT /:id 更新排练室

**功能描述**: 更新排练室信息

**权限**: 需要登录 + 排练室创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 排练室ID |

**响应示例**:

```json
{
  "code": 1002,
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "录音棚A（装修）",
    "updated_at": "2026-04-29T14:00:00.000Z"
  }
}
```

---

### 10.5 DELETE /:id 删除排练室

**功能描述**: 删除排练室

**权限**: 需要登录 + 排练室创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 排练室ID |

**响应示例**:

```json
{
  "code": 1003,
  "message": "删除成功",
  "data": null
}
```

---

### 10.6 POST /:id/join 加入排练室

**功能描述**: 加入排练室（成为成员）

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 排练室ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "加入成功",
  "data": {
    "room_id": 1,
    "user_id": 1,
    "joined_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 10.7 POST /:id/leave 离开排练室

**功能描述**: 离开排练室

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 排练室ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "离开成功",
  "data": null
}
```

---

## 十一、商品模块 /api/v1/products

### 11.1 GET / 获取商品列表

**功能描述**: 获取商品列表

**权限**: 公开

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| keyword | string | 否 | 搜索关键词 |
| category | string | 否 | 商品分类 |
| sort | string | 否 | 排序字段，默认 created_at |
| order | string | 否 | 排序方向：ASC, DESC，默认 DESC |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "吉他弦套装",
        "category": "accessories",
        "cover": "/uploads/products/cover1.jpg",
        "price": 199,
        "stock": 50,
        "sales": 100,
        "status": 1,
        "is_collected": false
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 30,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 11.2 GET /:id 获取商品详情

**功能描述**: 获取单个商品的详细信息

**权限**: 公开

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 商品ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "吉他弦套装",
    "category": "accessories",
    "cover": "/uploads/products/cover1.jpg",
    "images": [
      "/uploads/products/image1.jpg",
      "/uploads/products/image2.jpg"
    ],
    "description": "专业级吉他弦套装...",
    "price": 199,
    "stock": 50,
    "sales": 100,
    "status": 1,
    "seller": {
      "id": 1,
      "nickname": "卖家昵称",
      "avatar": "/uploads/avatar/1.jpg"
    },
    "created_at": "2026-04-29T13:33:21.000Z",
    "is_collected": false
  }
}
```

---

### 11.3 POST / 创建商品

**功能描述**: 发布新商品

**权限**: 需要登录

**请求参数**:

```json
{
  "name": "吉他弦套装",
  "category": "accessories",
  "cover": "/uploads/products/cover1.jpg",
  "images": ["/uploads/products/image1.jpg"],
  "description": "专业级吉他弦套装...",
  "price": 199,
  "stock": 50
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 商品名称 |
| category | string | 是 | 商品分类 |
| cover | string | 否 | 封面图 |
| images | array | 否 | 商品图片列表 |
| description | string | 否 | 商品描述 |
| price | number | 是 | 商品价格 |
| stock | number | 是 | 库存数量 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "吉他弦套装",
    "created_at": "2026-04-29T13:33:21.000Z"
  }
}
```

---

### 11.4 PUT /:id 更新商品

**功能描述**: 更新商品信息

**权限**: 需要登录 + 商品创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 商品ID |

**响应示例**:

```json
{
  "code": 1002,
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "吉他弦套装（新版）",
    "updated_at": "2026-04-29T14:00:00.000Z"
  }
}
```

---

### 11.5 DELETE /:id 删除商品

**功能描述**: 删除商品

**权限**: 需要登录 + 商品创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 商品ID |

**响应示例**:

```json
{
  "code": 1003,
  "message": "删除成功",
  "data": null
}
```

---

### 11.6 POST /:id/collect 收藏/取消收藏商品

**功能描述**: 收藏或取消收藏商品

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 商品ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "收藏成功",
  "data": {
    "collected": true
  }
}
```

---

## 十二、招聘模块 /api/v1/recruitments

### 12.1 GET / 获取招聘列表

**功能描述**: 获取音乐人招聘信息列表

**权限**: 公开

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| keyword | string | 否 | 搜索关键词 |
| instrument | string | 否 | 乐器类型 |
| style | string | 否 | 音乐风格 |
| sort | string | 否 | 排序字段，默认 created_at |
| order | string | 否 | 排序方向：ASC, DESC，默认 DESC |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "招聘吉他手",
        "type": "recruitment",
        "style": "rock",
        "instrument": "guitar",
        "cover": "/uploads/recruitments/cover1.jpg",
        "description": "我们正在寻找...",
        "budget": "面议",
        "location": "北京",
        "band_id": 100,
        "band": {
          "id": 100,
          "name": "暗夜摇滚团",
          "avatar": "/uploads/bands/avatar1.jpg"
        },
        "status": "recruiting",
        "created_at": "2026-04-29T13:33:21.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 20,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 12.2 GET /:id 获取招聘详情

**功能描述**: 获取单个招聘信息的详细信息

**权限**: 公开

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 招聘ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "id": 1,
    "title": "招聘吉他手",
    "type": "recruitment",
    "style": "rock",
    "instrument": "guitar",
    "cover": "/uploads/recruitments/cover1.jpg",
    "description": "我们正在寻找志同道合的吉他手加入我们的乐队...",
    "requirements": "1. 有2年以上演出经验\n2. 熟悉摇滚风格\n3. 周六日有时间排练",
    "budget": "面议",
    "location": "北京",
    "band_id": 100,
    "band": {
      "id": 100,
      "name": "暗夜摇滚团",
      "avatar": "/uploads/bands/avatar1.jpg"
    },
    "status": "recruiting",
    "created_at": "2026-04-29T13:33:21.000Z",
    "is_applied": false
  }
}
```

---

### 12.3 POST / 创建招聘

**功能描述**: 发布招聘信息

**权限**: 需要登录

**请求参数**:

```json
{
  "title": "招聘吉他手",
  "style": "rock",
  "instrument": "guitar",
  "cover": "/uploads/recruitments/cover1.jpg",
  "description": "我们正在寻找志同道合的吉他手加入我们的乐队...",
  "requirements": "1. 有2年以上演出经验\n2. 熟悉摇滚风格",
  "budget": "面议",
  "location": "北京",
  "band_id": 100
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 招聘标题 |
| style | string | 是 | 音乐风格 |
| instrument | string | 是 | 乐器类型 |
| cover | string | 否 | 封面图 |
| description | string | 否 | 招聘描述 |
| requirements | string | 否 | 职位要求 |
| budget | string | 否 | 薪资预算 |
| location | string | 否 | 工作地点 |
| band_id | number | 否 | 关联乐队ID |

**响应示例**:

```json
{
  "code": 1001,
  "message": "创建成功",
  "data": {
    "id": 1,
    "title": "招聘吉他手",
    "status": "recruiting",
    "created_at": "2026-04-29T13:33:21.000Z"
  }
}
```

---

### 12.4 PUT /:id 更新招聘

**功能描述**: 更新招聘信息

**权限**: 需要登录 + 招聘创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 招聘ID |

**响应示例**:

```json
{
  "code": 1002,
  "message": "更新成功",
  "data": {
    "id": 1,
    "title": "招聘吉他手（急招）",
    "updated_at": "2026-04-29T14:00:00.000Z"
  }
}
```

---

### 12.5 DELETE /:id 删除招聘

**功能描述**: 删除招聘信息

**权限**: 需要登录 + 招聘创建者或管理员

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 招聘ID |

**响应示例**:

```json
{
  "code": 1003,
  "message": "删除成功",
  "data": null
}
```

---

### 12.6 POST /:id/apply 申请职位

**功能描述**: 申请某个招聘职位

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 招聘ID |

**请求参数**:

```json
{
  "message": "您好，我对吉他手职位很感兴趣..."
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | string | 否 | 申请留言 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "申请成功",
  "data": {
    "id": 1,
    "recruitment_id": 1,
    "user_id": 1,
    "message": "您好，我对吉他手职位很感兴趣...",
    "status": "pending",
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

---

## 十三、动态模块 /api/v1/posts

### 13.1 GET / 获取动态列表

**功能描述**: 获取动态广场列表

**权限**: 公开

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |
| keyword | string | 否 | 搜索关键词 |
| type | string | 否 | 动态类型：text, image, video, audio |
| user_id | number | 否 | 按用户ID筛选 |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": 1,
        "content": "今晚排练很顺利！",
        "type": "image",
        "images": ["/uploads/posts/image1.jpg"],
        "audio_url": null,
        "video_url": null,
        "user": {
          "id": 1,
          "nickname": "小明",
          "avatar": "/uploads/avatar/1.jpg",
          "identity": "musician"
        },
        "like_count": 100,
        "comment_count": 20,
        "is_liked": false,
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 13.2 GET /:id 获取动态详情

**功能描述**: 获取单个动态的详细信息

**权限**: 公开

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 动态ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "id": 1,
    "content": "今晚排练很顺利！",
    "type": "image",
    "images": ["/uploads/posts/image1.jpg"],
    "audio_url": null,
    "video_url": null,
    "user": {
      "id": 1,
      "nickname": "小明",
      "avatar": "/uploads/avatar/1.jpg",
      "identity": "musician"
    },
    "like_count": 100,
    "comment_count": 20,
    "is_liked": false,
    "created_at": "2026-04-29T12:00:00Z",
    "comments": [
      {
        "id": 1,
        "content": "太棒了！",
        "user": {
          "id": 2,
          "nickname": "小红",
          "avatar": "/uploads/avatar/2.jpg"
        },
        "created_at": "2026-04-29T12:30:00Z"
      }
    ]
  }
}
```

---

### 13.3 POST / 发布动态

**功能描述**: 发布新动态

**权限**: 需要登录

**请求参数**:

```json
{
  "content": "今晚排练很顺利！",
  "type": "image",
  "images": ["/uploads/posts/image1.jpg"],
  "audio_url": null,
  "video_url": null
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 动态内容 |
| type | string | 是 | 动态类型：text, image, video, audio |
| images | array | 否 | 图片列表（最多9张） |
| audio_url | string | 否 | 音频URL |
| video_url | string | 否 | 视频URL |

**响应示例**:

```json
{
  "code": 1001,
  "message": "发布成功",
  "data": {
    "id": 1,
    "content": "今晚排练很顺利！",
    "type": "image",
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 13.4 PUT /:id 更新动态

**功能描述**: 更新动态内容

**权限**: 需要登录 + 动态创建者

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 动态ID |

**响应示例**:

```json
{
  "code": 1002,
  "message": "更新成功",
  "data": {
    "id": 1,
    "content": "更新后的动态内容",
    "updated_at": "2026-04-29T14:00:00.000Z"
  }
}
```

---

### 13.5 DELETE /:id 删除动态

**功能描述**: 删除动态

**权限**: 需要登录 + 动态创建者

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 动态ID |

**响应示例**:

```json
{
  "code": 1003,
  "message": "删除成功",
  "data": null
}
```

---

### 13.6 POST /:id/like 点赞动态

**功能描述**: 点赞或取消点赞动态

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 动态ID |

**响应示例**:

```json
{
  "code": 1000,
  "message": "点赞成功",
  "data": {
    "liked": true,
    "like_count": 101
  }
}
```

---

### 13.7 POST /:id/comment 评论动态

**功能描述**: 评论某个动态

**权限**: 需要登录

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 动态ID |

**请求参数**:

```json
{
  "content": "写得真好！"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 评论内容 |

**响应示例**:

```json
{
  "code": 1001,
  "message": "评论成功",
  "data": {
    "id": 1,
    "post_id": 1,
    "user_id": 1,
    "content": "写得真好！",
    "created_at": "2026-04-29T12:30:00Z"
  }
}
```

---

## 十四、上传模块 /api/v1/upload

### 14.1 POST /image 上传图片

**功能描述**: 上传图片文件

**权限**: 需要登录

**请求格式**: multipart/form-data

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 图片文件 |

**支持格式**: jpg, jpeg, png, gif, webp

**最大大小**: 5MB

**响应示例**:

```json
{
  "code": 1001,
  "message": "上传成功",
  "data": {
    "url": "/uploads/images/2026/04/29/abc123.jpg",
    "filename": "abc123.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

---

### 14.2 POST /audio 上传音频

**功能描述**: 上传音频文件

**权限**: 需要登录

**请求格式**: multipart/form-data

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 音频文件 |

**支持格式**: mp3, wav, flac, aac, m4a

**最大大小**: 50MB

**响应示例**:

```json
{
  "code": 1001,
  "message": "上传成功",
  "data": {
    "url": "/uploads/audios/2026/04/29/abc123.mp3",
    "filename": "abc123.mp3",
    "size": 5242880,
    "mimeType": "audio/mpeg",
    "duration": 180
  }
}
```

---

### 14.3 POST /video 上传视频

**功能描述**: 上传视频文件

**权限**: 需要登录

**请求格式**: multipart/form-data

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 视频文件 |

**支持格式**: mp4, mov, avi, webm

**最大大小**: 100MB

**响应示例**:

```json
{
  "code": 1001,
  "message": "上传成功",
  "data": {
    "url": "/uploads/videos/2026/04/29/abc123.mp4",
    "filename": "abc123.mp4",
    "size": 52428800,
    "mimeType": "video/mp4",
    "duration": 600
  }
}
```

---

## 十五、搜索模块 /api/v1/search

### 15.1 GET / 全局搜索

**功能描述**: 全局搜索，支持搜索乐队、活动、商品、用户、招聘

**权限**: 公开

**请求参数** (Query):

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| type | string | 否 | 搜索类型：all, bands, activities, products, users, recruitments |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 20 |

**响应示例**:

```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "type": "band",
        "id": 100,
        "name": "暗夜摇滚团",
        "avatar": "/uploads/bands/avatar1.jpg",
        "style": "rock",
        "intro": "一支热爱摇滚的乐队"
      },
      {
        "type": "activity",
        "id": 1,
        "title": "五月Live House",
        "cover": "/uploads/activities/cover1.jpg",
        "start_time": "2026-05-10T18:00:00Z"
      },
      {
        "type": "product",
        "id": 1,
        "name": "吉他弦套装",
        "cover": "/uploads/products/cover1.jpg",
        "price": 199
      },
      {
        "type": "recruitment",
        "id": 1,
        "title": "招聘吉他手",
        "cover": "/uploads/recruitments/cover1.jpg",
        "instrument": "guitar"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 十六、数据类型定义

### 16.1 用户身份 (Identity)

```typescript
enum Identity {
  FAN = 'fan',           // 乐迷
  MUSICIAN = 'musician', // 音乐人
  VENUE = 'venue',       // 场地
  BAND = 'band'          // 乐队
}
```

### 16.2 乐队风格 (BandStyle)

```typescript
enum BandStyle {
  ROCK = 'rock',         // 摇滚
  POP = 'pop',           // 流行
  JAZZ = 'jazz',         // 爵士
  FOLK = 'folk',         // 民谣
  ELECTRONIC = 'electronic' // 电子
}
```

### 16.3 活动类型 (ActivityType)

```typescript
enum ActivityType {
  RECRUITMENT = 'recruitment', // 招募
  PERFORMANCE = 'performance', // 演出
  COMPETITION = 'competition', // 比赛
  OTHER = 'other'              // 其他
}
```

### 16.4 活动状态 (ActivityStatus)

```typescript
enum ActivityStatus {
  RECRUITING = 'recruiting',   // 招募中
  IN_PROGRESS = 'in_progress', // 进行中
  ENDED = 'ended'              // 已结束
}
```

### 16.5 排练室类型 (RoomType)

```typescript
enum RoomType {
  REHEARSAL = 'rehearsal',     // 排练室
  RECORDING = 'recording'      // 录音棚
}
```

### 16.6 订单状态 (OrderStatus)

```typescript
enum OrderStatus {
  PENDING = 'pending',         // 待支付
  PAID = 'paid',              // 已支付
  SHIPPED = 'shipped',        // 已发货
  COMPLETED = 'completed',    // 已完成
  CANCELLED = 'cancelled'     // 已取消
}
```

### 16.7 预约状态 (BookingStatus)

```typescript
enum BookingStatus {
  PENDING = 'pending',         // 待确认
  CONFIRMED = 'confirmed',     // 已确认
  CANCELLED = 'cancelled',     // 已取消
  COMPLETED = 'completed'      // 已完成
}
```

### 16.8 动态类型 (PostType)

```typescript
enum PostType {
  TEXT = 'text',               // 文字
  IMAGE = 'image',             // 图片
  VIDEO = 'video',             // 视频
  AUDIO = 'audio'              // 音频
}
```

### 16.9 通用分页参数

```typescript
interface PaginationParams {
  page?: number;      // 页码，默认 1
  pageSize?: number;  // 每页数量，默认 20
}

interface PaginationResult {
  page: number;           // 当前页码
  pageSize: number;       // 每页数量
  total: number;          // 总记录数
  totalPages: number;     // 总页数
  hasNext: boolean;       // 是否有下一页
  hasPrev: boolean;       // 是否有上一页
}
```

### 16.10 用户对象

```typescript
interface User {
  id: number;
  nickname: string;
  avatar: string | null;
  identity: Identity;
  instrument?: string;       // 乐器
  music_style?: BandStyle;    // 音乐风格
  location?: string;         // 所在地
  bio?: string;              // 个人简介
}
```

### 16.11 乐队对象

```typescript
interface Band {
  id: number;
  name: string;
  style: BandStyle;
  intro: string;
  avatar: string | null;
  cover: string | null;
  owner_id: number;
  member_count: number;
  status: number;
  owner?: User;
  members?: BandMember[];
  is_followed?: boolean;
  created_at: string;
  updated_at: string;
}
```

### 16.12 活动对象

```typescript
interface Activity {
  id: number;
  title: string;
  type: ActivityType;
  status: ActivityStatus;
  cover: string | null;
  description?: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number;
  spots: number;
  signup_count: number;
  organizer_id: number;
  organizer?: User;
  band_id?: number;
  band?: Band;
  is_signed_up?: boolean;
  is_favorited?: boolean;
  created_at: string;
}
```

---

## 附录

### A. 错误码速查表

| 状态码 | 说明 | 建议处理 |
|--------|------|----------|
| 1000 | 操作成功 | - |
| 1001 | 创建成功 | 提示用户并更新列表 |
| 1002 | 更新成功 | 提示用户并更新数据 |
| 1003 | 删除成功 | 提示用户并移除数据 |
| 2000 | 认证成功 | 存储Token跳转首页 |
| 2001 | 退出成功 | 清除存储跳转登录页 |
| 2002 | Token刷新成功 | 更新本地Token |
| 3001 | 未授权 | 清除Token跳转登录页 |
| 3002 | 禁止访问 | 提示权限不足 |
| 3003 | 资源不存在 | 提示内容不存在 |
| 3004 | 验证失败 | 显示字段级错误 |
| 3005 | 资源冲突 | 提示冲突原因 |
| 3006 | 请求频繁 | 提示稍后再试 |
| 4000 | 服务器错误 | 提示稍后再试或联系客服 |

### B. 身份权限说明

| 身份 | 可创建内容 | 特殊权限 |
|------|-----------|----------|
| fan | 动态、收藏、订单 | 基础功能 |
| musician | + 乐队、招聘、活动 | 可创建乐队和活动 |
| venue | + 排练室、商品 | 可创建排练室和商品 |
| band | 同 musician | 同 musician |

### C. 联系方式

如有问题，请联系开发团队。

---

**文档版本**: v2.0.0  
**最后更新**: 2026-05-07  
**API总数**: 76+