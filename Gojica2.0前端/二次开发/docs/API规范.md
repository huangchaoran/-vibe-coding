# Gojica 接口规范文档

## 📋 文档信息
- **版本**：v2.0.4
- **更新时间**：2026-04-30
- **技术栈**：Node.js + Express + Sequelize + MySQL 8.0
- **协议**：RESTful API
- **测试覆盖**：308个测试用例全部通过

---

## 🌐 基础信息

### 服务器配置
```
开发环境：http://localhost:3000
生产环境：https://api.gojica.com
```

### 基础路径
```
API Base URL: {baseUrl}/api/v1
```

### 请求头规范
```http
Content-Type: application/json
Authorization: Bearer {token}  // 需要认证的接口
X-Requested-With: XMLHttpRequest
Accept: application/json
```

### 字符编码
```
UTF-8
```

---

## 📦 响应格式

### 成功响应
```json
{
  "code": 1000,
  "message": "操作成功",
  "data": {}
}
```

### 分页响应
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
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 错误响应
```json
{
  "code": 3000,
  "message": "错误信息",
  "errors": [
    { "field": "fieldName", "message": "错误描述" }
  ]
}
```

---

## 🔢 HTTP 状态码

### 2xx 成功
| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功（无返回内容） |

### 4xx 客户端错误
| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未登录或Token过期/无效 |
| 403 | Forbidden | 无权限访问 |
| 404 | Not Found | 资源不存在 |
| 405 | Method Not Allowed | 请求方法不允许 |
| 422 | Unprocessable Entity | 验证错误（参数格式正确但业务校验失败） |
| 429 | Too Many Requests | 请求过于频繁 |

### 5xx 服务器错误
| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 500 | Internal Server Error | 服务器内部错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |

---

## 🎯 业务状态码

### 通用成功（1000-1999）
| 状态码 | 说明 |
|--------|------|
| 1000 | 操作成功 |
| 1001 | 创建成功 |
| 1002 | 更新成功 |
| 1003 | 删除成功 |

### 认证相关（2000-2999）
| 状态码 | 说明 |
|--------|------|
| 2000 | 认证成功 |
| 2001 | 退出成功 |
| 2002 | Token已刷新 |

### 客户端错误（3000-3999）
| 状态码 | 说明 |
|--------|------|
| 3000 | 错误请求 |
| 3001 | 未授权访问 |
| 3002 | 禁止访问 |
| 3003 | 资源不存在 |
| 3004 | 验证失败 |
| 3005 | 资源冲突 |
| 3006 | 请求过于频繁 |

### 服务器错误（4000-4999）
| 状态码 | 说明 |
|--------|------|
| 4000 | 服务器内部错误 |
| 4001 | 数据库操作失败 |
| 4002 | 服务暂时不可用 |
| 4003 | 网关超时 |

---

## 📝 接口列表

### 认证模块 `/api/v1/auth`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | /login | 用户登录 | 公开 |
| POST | /register | 用户注册 | 公开 |
| POST | /refresh | 刷新Token | 公开 |
| POST | /logout | 退出登录 | 需要登录 |

**POST /login**
```json
// 请求
{
  "code": "微信code",
  "identity": "fan|musician|venue|band"
}

// 响应
{
  "code": 2000,
  "message": "登录成功",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
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

**POST /register**
```json
// 请求
{
  "code": "微信code",
  "nickname": "用户昵称",
  "identity": "fan|musician|venue|band"
}

// 响应
{
  "code": 2000,
  "message": "注册成功",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {}
  }
}
```

---

### 首页模块 `/api/v1/home`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /banners | 获取轮播图列表 | 公开 |
| GET | /stats | 获取首页统计数据 | 公开 |

**GET /home/stats**
```json
// 响应
{
  "code": 1000,
  "data": {
    "total_users": 1000,
    "total_bands": 50,
    "total_activities": 200,
    "total_products": 300,
    "today_signups": 10,
    "today_orders": 5
  }
}
```

---

### 用户模块 `/api/v1/users`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | /profile | 获取个人资料 | 需要登录 |
| PUT | /profile | 更新个人资料 | 需要登录 |
| POST | /bind-identity | 绑定/切换身份 | 需要登录 |
| GET | /identities | 获取用户身份列表 | 需要登录 |
| POST | /identities/add | 添加用户身份 | 需要登录 |
| POST | /identities/remove | 移除用户身份 | 需要登录 |
| GET | /favorites | 获取收藏列表 | 需要登录 |
| GET | /activities | 获取参与的活动 | 需要登录 |
| GET | /bookings | 获取预约记录 | 需要登录 |
| GET | /orders | 获取订单记录 | 需要登录 |
| GET | /follows | 获取关注列表 | 需要登录 |

**GET /profile**
```json
// 响应
{
  "code": 1000,
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

**GET /identities**
```json
// 响应
{
  "code": 1000,
  "message": "操作成功",
  "data": ["fan", "musician"]
}
```

**POST /identities/add**
```json
// 请求
{
  "identity": "venue"
}

// 响应
{
  "code": 1002,
  "message": "身份添加成功",
  "data": ["fan", "musician", "venue"]
}
```

**POST /identities/remove**
```json
// 请求
{
  "identity": "venue"
}

// 响应
{
  "code": 1002,
  "message": "身份移除成功",
  "data": ["fan", "musician"]
}
```

---

### 乐队模块 `/api/v1/bands`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | / | 获取乐队列表 | 公开 |
| GET | /:id | 获取乐队详情 | 公开 |
| POST | / | 创建乐队 | 需要登录 + musician/band 身份 |
| PUT | /:id | 更新乐队信息 | 需要登录 + 乐队创建者/管理员 |
| DELETE | /:id | 删除乐队 | 需要登录 + 乐队创建者/管理员 |
| POST | /:id/follow | 关注/取消关注乐队 | 需要登录 |

**GET /bands**
```json
// 查询参数
{
  "page": 1,
  "pageSize": 20,
  "keyword": "摇滚",
  "style": "rock|pop|jazz|folk|electronic",
  "sort": "created_at",
  "order": "DESC"
}

// 响应
{
  "code": 1000,
  "data": {
    "list": [
      {
        "id": 100,
        "name": "测试摇滚乐队",
        "style": "rock",
        "intro": "一支热爱摇滚的乐队成立于2020年",
        "avatar": "https://picsum.photos/200",
        "cover": "https://picsum.photos/800/400",
        "owner_id": 1,
        "status": 1,
        "member_count": 4,
        "owner": {
          "id": 1,
          "nickname": "新昵称",
          "avatar": "https://example.com/new_avatar.jpg"
        }
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

**GET /bands/:id**
```json
// 响应（乐队详情）
{
  "code": 1000,
  "data": {
    "id": 100,
    "name": "测试摇滚乐队",
    "style": "rock",
    "intro": "一支热爱摇滚的乐队成立于2020年",
    "avatar": "https://picsum.photos/200",
    "cover": "https://picsum.photos/800/400",
    "owner_id": 1,
    "status": 1,
    "member_count": 4,
    "created_at": "2026-04-29T13:33:21.000Z",
    "updated_at": "2026-04-29T13:33:21.000Z",
    "owner": {
      "id": 1,
      "nickname": "新昵称",
      "avatar": "https://example.com/new_avatar.jpg",
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
          "nickname": "新昵称",
          "avatar": "https://example.com/new_avatar.jpg",
          "instrument": "Guitar"
        }
      }
    ]
  }
}
```

---

### 活动模块 `/api/v1/activities`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | / | 获取活动列表 | 公开 |
| GET | /:id | 获取活动详情 | 公开 |
| POST | / | 创建活动 | 需要登录 |
| PUT | /:id | 更新活动 | 需要登录 + 创建者/管理员 |
| DELETE | /:id | 删除活动 | 需要登录 + 创建者/管理员 |
| POST | /:id/signup | 报名活动 | 需要登录 |
| POST | /:id/participate | 参与活动（别名） | 需要登录 |
| POST | /:id/cancel | 取消报名 | 需要登录 |
| POST | /:id/checkin | 签到 | 需要登录 |
| GET | /:id/signups | 获取报名列表 | 需要登录 + 创建者/管理员 |
| GET | /user/activities | 获取我参与的活动 | 需要登录 |

**GET /activities**
```json
// 查询参数
{
  "page": 1,
  "pageSize": 20,
  "type": "recruitment|performance|competition|other",
  "status": "recruiting|in_progress|ended",
  "keyword": "关键词",
  "band_id": 1,
  "sort": "created_at",
  "order": "DESC"
}

// 响应
{
  "code": 1000,
  "data": {
    "list": [
      {
        "id": 100,
        "title": "周末音乐节",
        "description": "一场精彩的音乐节活动",
        "cover": "https://picsum.photos/800/400",
        "type": "performance",
        "status": "recruiting",
        "start_time": "2026-05-01T10:00:00Z",
        "end_time": "2026-05-01T18:00:00Z",
        "location": "北京",
        "max_participants": 100,
        "current_participants": 50,
        "organizer": {
          "id": 1,
          "nickname": "组织者",
          "avatar": "/uploads/avatar/xxx.jpg"
        },
        "band": {
          "id": 1,
          "name": "乐队名称",
          "avatar": "/uploads/band/xxx.jpg"
        }
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

**POST /activities/:id/signup**
```json
// 请求
{
  "participant_count": 1,
  "remark": "备注信息"
}

// 响应
{
  "code": 1001,
  "message": "报名成功",
  "data": {
    "id": 1,
    "activity_id": 1,
    "user_id": 1,
    "status": "approved",
    "participant_count": 1,
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 帖子/动态模块 `/api/v1/posts`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | / | 获取动态列表 | 公开 |
| GET | /:id | 获取动态详情 | 公开 |
| POST | / | 发布动态 | 需要登录 |
| PUT | /:id | 更新动态 | 需要登录 + 作者 |
| DELETE | /:id | 删除动态 | 需要登录 + 作者 |
| POST | /:id/like | 点赞/取消点赞 | 需要登录 |
| POST | /:id/comment | 评论 | 需要登录 |

**GET /posts/:id**
```json
// 响应
{
  "code": 1000,
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "新歌发布",
    "content": "我们发布了新专辑！",
    "images": ["https://example.com/img1.jpg"],
    "audio_url": null,
    "video_url": null,
    "like_count": 10,
    "comment_count": 5,
    "is_liked": false,
    "author": {
      "id": 1,
      "nickname": "用户昵称",
      "avatar": "/uploads/avatar/xxx.jpg"
    },
    "band": {
      "id": 1,
      "name": "乐队名称",
      "avatar": "/uploads/band/xxx.jpg"
    },
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

**POST /posts/:id/like**
```json
// 响应
{
  "code": 1000,
  "data": {
    "liked": true,
    "like_count": 11
  }
}
```

---

### 商品模块 `/api/v1/products`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | / | 获取商品列表 | 公开 |
| GET | /:id | 获取商品详情 | 公开 |
| POST | / | 发布商品 | 需要登录 |
| PUT | /:id | 更新商品 | 需要登录 + 卖家 |
| DELETE | /:id | 删除商品 | 需要登录 + 卖家 |
| POST | /:id/collect | 收藏/取消收藏 | 需要登录 |

**GET /products**
```json
// 查询参数
{
  "page": 1,
  "pageSize": 20,
  "category": "equipment|instrument|merchandise|other",
  "minPrice": 100,
  "maxPrice": 5000,
  "keyword": "关键词",
  "band_id": 1
}

// 响应
{
  "code": 1000,
  "data": {
    "list": [
      {
        "id": 100,
        "title": "二手电吉他",
        "description": "九成新的Fender电吉他",
        "cover": "https://picsum.photos/400/400",
        "price": "2500.00",
        "type": "equipment",
        "status": 1,
        "stock": 1,
        "seller_id": 1,
        "band_id": null,
        "band": null,
        "created_at": "2026-04-29T21:33:45.000Z"
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

**GET /products/:id**
```json
// 响应
{
  "code": 1000,
  "data": {
    "id": 100,
    "title": "二手电吉他",
    "description": "九成新的Fender电吉他",
    "price": "2500.00",
    "original_price": "3000.00",
    "stock": 1,
    "category": "equipment",
    "condition": "九成新",
    "images": ["https://picsum.photos/400/400"],
    "seller": {
      "id": 1,
      "nickname": "卖家昵称",
      "avatar": "/uploads/avatar/xxx.jpg",
      "identity": "musician"
    },
    "band": null,
    "is_collected": false
  }
}
```

---

### 排练房模块 `/api/v1/rooms`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | / | 获取排练房列表 | 公开 |
| GET | /:id | 获取排练房详情 | 公开 |
| POST | / | 创建排练房 | 需要登录 |
| PUT | /:id | 更新排练房 | 需要登录 + 创建者 |
| DELETE | /:id | 删除排练房 | 需要登录 + 创建者 |
| POST | /:id/join | 加入房间 | 需要登录 |
| POST | /:id/leave | 离开房间 | 需要登录 |

---

### 招募模块 `/api/v1/recruitments`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | / | 获取招募列表 | 公开 |
| GET | /:id | 获取招募详情 | 公开 |
| POST | / | 发布招募 | 需要登录 + musician/band 身份 |
| PUT | /:id | 更新招募信息 | 需要登录 + 发布者 |
| DELETE | /:id | 删除招募 | 需要登录 + 发布者 |
| POST | /:id/apply | 申请加入 | 需要登录 |
| GET | /:id/applications | 获取申请列表 | 需要登录 + 发布者 |

**GET /recruitments**
```json
// 查询参数
{
  "page": 1,
  "pageSize": 20,
  "instrument": "guitar|bass|drum|vocal|keyboard|吉他|贝斯|鼓|键盘",
  "status": "open|closed|1|0",
  "keyword": "关键词"
}

// 响应
{
  "code": 1000,
  "data": {
    "list": [
      {
        "id": 100,
        "band_id": 100,
        "title": "招募吉他手",
        "description": "我们需要一位热爱摇滚的吉他手加入我们的乐队",
        "instrument": "吉他",
        "requirement": "有演出经验",
        "contact": null,
        "status": 1,
        "created_at": "2026-04-29T21:33:47.000Z",
        "band": {
          "id": 100,
          "name": "测试摇滚乐队",
          "style": "rock",
          "intro": "一支热爱摇滚的乐队成立于2020年",
          "avatar": "https://picsum.photos/200",
          "cover": "https://picsum.photos/800/400",
          "owner_id": 1,
          "status": 1,
          "member_count": 4,
          "owner": {
            "id": 1,
            "nickname": "新昵称",
            "avatar": "https://example.com/new_avatar.jpg"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 15,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

**GET /recruitments/:id**
```json
// 响应
{
  "code": 1000,
  "data": {
    "id": 100,
    "band_id": 100,
    "title": "招募吉他手",
    "description": "我们需要一位热爱摇滚的吉他手加入我们的乐队",
    "instrument": "吉他",
    "requirements": ["有演出经验", "热爱摇滚"],
    "status": 1,
    "created_at": "2026-04-29T21:33:47.000Z",
    "band": {
      "id": 100,
      "name": "测试摇滚乐队",
      "style": "rock",
      "intro": "一支热爱摇滚的乐队成立于2020年",
      "avatar": "https://picsum.photos/200"
    },
    "publisher": {
      "id": 1,
      "nickname": "发布者昵称",
      "avatar": "/uploads/avatar/xxx.jpg",
      "identity": "musician"
    },
    "applications": [],
    "is_applied": false
  }
}
```

**POST /recruitments/:id/apply**
```json
// 请求
{
  "message": "我非常感兴趣，希望能加入乐队"
}

// 响应
{
  "code": 1000,
  "data": {
    "id": 1,
    "recruitment_id": 100,
    "user_id": 1,
    "message": "我非常感兴趣，希望能加入乐队",
    "status": "pending",
    "created_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### 搜索模块 `/api/v1/search`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | / | 全局搜索 | 公开 |

**GET /search**
```json
// 查询参数
{
  "q": "关键词",
  "type": "all|band|activity|product|recruitment|post",
  "page": 1,
  "pageSize": 20
}

// 响应
{
  "code": 1000,
  "data": {
    "bands": {
      "list": [],
      "total": 0
    },
    "activities": {
      "list": [],
      "total": 0
    },
    "products": {
      "list": [],
      "total": 0
    },
    "recruitments": {
      "list": [],
      "total": 0
    },
    "posts": {
      "list": [],
      "total": 0
    }
  }
}
```

---

### 上传模块 `/api/v1/upload`

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | /image | 上传图片 | 需要登录 |
| POST | /audio | 上传音频 | 需要登录 |
| POST | /video | 上传视频 | 需要登录 |

**POST /upload/image**
```json
// 请求：multipart/form-data
// field: file (图片文件)

// 响应
{
  "code": 1001,
  "message": "上传成功",
  "data": {
    "filename": "avatar_1_1714214400000_abc123.jpg",
    "url": "/uploads/avatar/avatar_1_1714214400000_abc123.jpg",
    "size": 102400,
    "width": 800,
    "height": 600
  }
}
```

---

## 📁 文件上传与存储

### 上传配置
```javascript
// server/src/config/upload.js
module.exports = {
  maxFileSize: 5 * 1024 * 1024,  // 5MB
  allowedImageTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  allowedAudioTypes: ['.mp3', '.wav', '.ogg', '.m4a'],
  allowedVideoTypes: ['.mp4', '.avi', '.mov', '.webm'],
  uploadPath: '/uploads',
  imageCompress: {
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080
  }
};
```

### 目录结构
```
/uploads
  /avatar        # 用户头像
  /band          # 乐队图片
  /activity      # 活动图片
  /room          # 排练房图片
  /product       # 商品图片
  /post          # 动态图片
  /audio         # 音频文件
  /video         # 视频文件
  /qcode         # 二维码
```

### 图片命名规则
```
{type}_{userId}_{timestamp}_{random}.{ext}

示例：
- avatar_1_1714214400000_abc123.jpg
- product_2_1714214400001_def456.png
```

---

## 🔐 接口权限

### 身份类型
| 身份 | 说明 |
|------|------|
| fan | 普通粉丝 |
| musician | 音乐人 |
| venue | 场地商家 |
| band | 乐队 |
| admin | 管理员 |
| super_admin | 超级管理员 |

**多身份支持**：用户可以同时拥有多个身份（如同时是音乐人和场地商家），通过 `/users/identities` 相关接口管理。系统会自动保留用户的第一个身份作为主身份（`identity` 字段），同时返回所有身份列表（`identities` 字段）。

### 权限说明
| 权限级别 | 说明 |
|----------|------|
| 公开 | 无需登录 |
| 需要登录 | 需要有效Token |
| 需要特定身份 | 需要对应身份标识 |
| 需要是创建者 | 需要是资源创建者或管理员 |

---

## 🔄 接口版本控制

### URL 版本控制
```
v1: /api/v1/*
v2: /api/v2/*  // 未来版本
```

### 兼容性策略
- 主版本号变化：不兼容
- 次版本号变化：向后兼容
- 修订版本号变化：完全兼容

---

## 🛡️ 安全规范

### 输入验证
- 所有用户输入必须验证
- SQL 注入防护（使用 Sequelize 参数化查询）
- XSS 防护（输出转义）
- CSRF 防护

### 敏感信息
- 密码加密存储（bcrypt，10轮）
- Token 仅在 Header 中传递
- 不在日志中记录敏感信息
- 关键操作记录审计日志

### 限流策略
```javascript
// 普通接口：60次/分钟
// 登录接口：5次/分钟
// 上传接口：10次/分钟
// 使用 express-rate-limit 中间件
```

---

## 🧪 测试规范

### 测试覆盖统计
| 模块 | 测试文件 | 测试用例数 | 状态 |
|------|---------|-----------|------|
| 活动 | activities.test.js | 45+ | ✅ 通过 |
| 用户 | users.test.js | 30+ | ✅ 通过 |
| 乐队 | bands.test.js | 30+ | ✅ 通过 |
| 帖子 | posts.test.js | 35+ | ✅ 通过 |
| 招募 | recruitments.test.js | 35+ | ✅ 通过 |
| 商品 | products.test.js | 25+ | ✅ 通过 |
| 房间 | rooms.test.js | 35+ | ✅ 通过 |
| 搜索 | search.test.js | 15+ | ✅ 通过 |
| 单元测试 | 多个文件 | 30+ | ✅ 通过 |
| **总计** | **23个文件** | **308个** | **✅ 全部通过** |

---

## 📚 相关文档

- [数据库设计文档](./数据库设计文档.md)
- [数据库ER图](./数据库ER图.md)
- [数据库ER图可视化](./数据库ER图可视化.md)
- [后端开发计划](./后端开发计划.md)
- [后端实现进度](./后端实现进度.md)
- [后端测试计划](./后端测试计划.md)
- [认证设计](./认证设计.md)
- [前端开发计划与API规范](./前端开发计划与API规范.md)

---

## 📝 更新日志

### v2.0.5 (2026-05-06)
- 修复用户模块API表名和列名不匹配问题
- 修复表名：`activities_signups` → `activity_signups`
- 修复表名：`room_bookings` → `bookings`
- 修复表名：`trade_orders` → `orders`
- 修复列名：`f.type` → `f.target_type`
- 修复列名：`o.buyer_id` → `o.user_id`
- 修复列名：`signup_time` → `created_at`
- 添加 `follows` 表的 `target_type` 字段
- 添加根路径 `/` 服务状态接口
- 用户模块12个接口全部测试通过

### v2.0.4 (2026-04-30)
- 修复用户模块API表名不匹配问题
- 修复 `GET /users/stats` - 修正表名 `activity_signups` → `activities_signups`
- 修复 `GET /users/activities` - 修正表名 `activity_signups` → `activities_signups`
- 修复 `GET /users/orders` - 修正表名 `orders` → `trade_orders`
- 更新字段映射：`user_id` → `buyer_id`, `created_at` → `create_time`
- 所有用户模块API测试通过（8个接口全部返回200）

### v2.0.3 (2026-04-30)
- 新增用户多身份功能支持
- 新增 `/users/identities` 接口 - 获取身份列表
- 新增 `/users/identities/add` 接口 - 添加身份
- 新增 `/users/identities/remove` 接口 - 移除身份
- 更新 `GET /users/profile` 响应，增加 `identities` 字段
- 更新身份类型说明，添加多身份支持说明

### v2.0.2 (2026-04-29)
- 更新商品API响应字段（cover代替images）
- 更新招募API响应结构（status使用数字1/0）
- 更新分页响应结构（增加hasNext/hasPrev）
- 更新前端页面与API规范对齐

### v2.0.1 (2026-04-29)
- 完善所有模块API文档
- 增加测试用例覆盖说明

### v2.0.0 (2026-04-28)
- 初始版本
- 60+ RESTful API接口
- 完整的TypeScript类型定义