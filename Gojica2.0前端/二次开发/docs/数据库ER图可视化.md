# Gojica 数据库 ER 图（可视化版）

## 📊 模块一：用户与认证模块

```
┌─────────────────┐
│     USERS       │  用户表
├─────────────────┤
│ PK  id          │
│ UK  openid      │
│    unionid      │
│    nickname     │
│    avatar       │
│    phone        │
│    identity     │  ← fan/musician/band/venue
│    instrument   │
│    music_style  │
│    location     │
│    bio          │
│    video_url    │
│    status       │
│    last_login_at│
└───────┬─────────┘
        │
        │ 1:N
        ├─────────────────────────────────────────────┐
        │                                             │
        ▼                                             ▼
┌───────────────┐              ┌─────────────────────────┐
│ BAND_MEMBERS  │              │     ADMIN_USERS         │
├───────────────┤              ├─────────────────────────┤
│ PK id         │              │ PK id                   │
│ FK band_id    │              │ UK username             │
│ FK user_id    │              │    password             │
│    role       │              │    nickname            │
│    instrument │              │    role (super/admin)   │
│    joined_at  │              │    status               │
│    status     │              │    last_login_at        │
└───────────────┘              └─────────────────────────┘
```

---

## 📊 模块二：乐队管理模块

```
┌─────────────┐              ┌─────────────────┐
│    USERS    │              │     BANDS       │
├─────────────┤              ├─────────────────┤
│ PK id       │              │ PK id           │
│    openid   │◄────────────│ FK owner_id     │
│    nickname │   创建       │    name         │
│    avatar   │              │    style        │
└─────────────┘              │    intro        │
        │                    │    avatar       │
        │ 1:N                │    cover        │
        │                    │    status       │
        ├──────────────────► │    member_count │
        │                    └────────┬────────┘
        │                             │
        │ 1:N                         │ 1:N
        ▼                             ▼
┌───────────────┐              ┌─────────────────────┐
│ BAND_MEMBERS  │              │    RECRUITMENTS     │
├───────────────┤              ├─────────────────────┤
│ PK id         │              │ PK id               │
│ FK band_id    │              │ FK band_id          │
│ FK user_id    │              │    instrument       │
│    role       │              │    level_requirement│
│    instrument │              │    style_requirement│
│    joined_at  │              │    description      │
│    status     │              │    status           │
└───────────────┘              └─────────────────────┘
```

---

## 📊 模块三：活动管理模块

```
┌─────────────┐              ┌─────────────────────┐
│    USERS    │              │     ACTIVITIES      │
├─────────────┤              ├─────────────────────┤
│ PK id       │◄────────────│ FK organizer_id     │
│    nickname │   组织       │ PK id               │
└─────────────┘              │    title            │
        │                    │    type             │
        │ 1:N                │    description     │
        │                    │    location        │
        ├──────────────────► │    longitude       │
        │                    │    latitude        │
        │                    │    start_time      │
        │                    │    end_time        │
        │                    │    fee             │
        │                    │    max_participants│
        │                    │    current_         │
        │                    │    participants    │
        │                    │    status          │
        │                    │    cover_image     │
        │                    └─────────┬───────────┘
        │                              │
        │ 1:N                          │ 1:N
        ▼                              ▼
┌─────────────────────────┐  ┌──────────────────────┐
│  ACTIVITIES_SIGNUPS     │  │      USERS           │
├─────────────────────────┤  ├──────────────────────┤
│ PK id                   │  │ PK id                │
│ FK activity_id          │◄─┼── 报名              │
│ FK user_id              │  │    nickname         │
│    status               │  │    avatar           │
│    signup_time          │  └──────────────────────┘
│    check_in_time        │
│    check_in_code        │
└─────────────────────────┘
```

---

## 📊 模块四：排练房预约模块

```
┌─────────────┐              ┌────────────────────────┐
│    USERS    │              │    REHEARSAL_ROOMS     │
├─────────────┤              ├────────────────────────┤
│ PK id       │◄────────────│ FK venue_id            │
│    nickname │   拥有      │ PK id                  │
│    identity  │              │    name               │
└─────────────┘              │    address            │
        │                    │    district           │
        │ 1:N                │    price_per_hour     │
        │                    │    equipment (JSON)   │
        ├──────────────────► │    images             │
        │                    │    description        │
        │                    │    opening_hours      │
        │                    │    status             │
        │                    └───────────┬────────────┘
        │                                │
        │ 1:N                            │ 1:N
        ▼                                ▼
┌─────────────────────┐    ┌──────────────────────┐
│   ROOM_TIME_SLOTS   │    │    ROOM_BOOKINGS     │
├─────────────────────┤    ├──────────────────────┤
│ PK id               │    │ PK id                │
│ FK room_id          │◄───┼── 1:N              │
│    slot_date        │    │ FK room_id          │
│    start_hour       │    │ FK user_id          │
│    end_hour         │    │    order_no (UK)     │
│    price            │    │    booking_date      │
│    is_available     │    │    start_hour        │
└─────────────────────┘    │    end_hour          │
                           │    hours             │
                           │    total_price       │
                           │    status            │
                           │    pay_time          │
                           │    cancel_time       │
                           └──────────────────────┘
                                   ▲
                                   │ N:1
                           ┌───────┴────────┐
                           │    USERS       │
                           ├────────────────┤
                           │ PK id          │
                           │    nickname    │
                           └────────────────┘
```

---

## 📊 模块五：二手设备交易模块

```
┌─────────────┐              ┌────────────────────┐
│    USERS    │              │     PRODUCTS       │
├─────────────┤              ├────────────────────┤
│ PK id       │◄────────────│ FK seller_id       │
│    nickname │   出售       │ PK id              │
│    avatar   │              │    title           │
└─────────────┘              │    category        │
        │                    │    brand           │
        │ 1:N                │    model           │
        │                    │    price           │
        ├──────────────────► │    condition_level │
        │                    │    description     │
        │                    │    images          │
        │                    │    status          │
        │                    │    view_count      │
        │                    └─────────┬──────────┘
        │                              │
        │ 1:N                          │ 1:N
        ▼                              ▼
┌─────────────────────┐    ┌──────────────────────┐
│    TRADE_ORDERS     │    │  PRODUCT_MESSAGES   │
├─────────────────────┤    ├──────────────────────┤
│ PK id               │    │ PK id                │
│ FK product_id      │◄───┼── 1:N              │
│ FK buyer_id         │    │ FK product_id       │
│ FK seller_id        │    │ FK sender_id        │
│    order_no (UK)    │    │ FK receiver_id      │
│    price            │    │    content          │
│    status           │    │    is_read         │
│    shipping_address │    └──────────────────────┘
│    shipping_no      │
│    pay_time         │
│    ship_time        │
│    confirm_time     │
│    cancel_time      │
└─────────────────────┘

交易角色说明：
• buyer_id: 买家
• seller_id: 卖家
```

---

## 📊 模块六：乐手招募模块

```
┌─────────────────┐
│     BANDS       │
├─────────────────┤
│ PK id           │
│    name         │
│    style        │
│    avatar       │
│ FK owner_id     │
│    status       │
└───────┬─────────┘
        │
        │ 1:N
        ▼
┌─────────────────────┐              ┌────────────────────┐
│   RECRUITMENTS      │              │      USERS         │
├─────────────────────┤              ├────────────────────┤
│ PK id               │              │ PK id              │
│ FK band_id          │◄────────────│    nickname        │
│    instrument       │   发布       │    avatar         │
│    level_requirement│              │    instrument      │
│    style_requirement              │    music_style    │
│    description      │              │    identity        │
│    status           │              │    bio            │
└───────┬─────────────┘              │    video_url      │
        │                            └────────────────────┘
        │                                    ▲
        │ 1:N                                │ N:M
        ▼                                    │
┌─────────────────────────────┐              │
│ RECRUITMENT_APPLICATIONS   │              │
├─────────────────────────────┤              │
│ PK id                      │              │
│ FK recruitment_id          │◄────────────┘
│ FK user_id                 │  投递申请
│    message                 │
│    status (pending/viewed/ │
│           accepted/rejected)              │
│    apply_time              │
│    reply_time              │
└─────────────────────────────┘
```

---

## 📊 模块七：社区动态模块

```
┌─────────────┐              ┌────────────────────┐
│    USERS    │              │       POSTS        │
├─────────────┤              ├────────────────────┤
│ PK id       │◄────────────│ FK user_id         │
│    nickname │   发布       │ PK id               │
│    avatar   │              │    content         │
│    identity │              │    images          │
└─────────────┘              │    status (审核)   │
        │                    │    reject_reason   │
        │ 1:N                │    like_count      │
        │                    │    comment_count   │
        ├──────────────────► │                    │
        │                    └─────────┬──────────┘
        │                              │
        │ 1:N                          │ 1:N
        ▼                              ▼
┌─────────────────────┐    ┌──────────────────────┐
│  POST_COMMENTS      │    │     FAVORITES       │
├─────────────────────┤    ├──────────────────────┤
│ PK id               │    │ PK id               │
│ FK post_id          │◄───┼── 1:N             │
│ FK user_id          │    │ FK user_id         │
│    content          │    │    type            │
│    parent_id (自关联)│    │    target_id      │
│    like_count        │    └──────────────────────┘
└─────────────────────┘

评论关系说明：
• parent_id = 0: 顶级评论
• parent_id > 0: 回复其他评论
```

---

## 📊 模块八：社交与通知模块

```
┌─────────────┐              ┌────────────────────┐
│    USERS    │              │      FOLLOWS       │
├─────────────┤              ├────────────────────┤
│ PK id       │◄────────────│ FK follower_id    │
│    nickname │   关注       │ FK following_id   │
│    avatar   │              │    created_at     │
└─────────────┘              └────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────┐    ┌──────────────────────┐
│   NOTIFICATIONS     │    │     FAVORITES       │
├─────────────────────┤    ├──────────────────────┤
│ PK id               │    │ PK id               │
│ FK user_id          │◄───┼── 1:N             │
│    type             │    │ FK user_id         │
│    title            │    │    type            │
│    content          │    │    target_id      │
│    data (JSON)      │    └──────────────────────┘
│    is_read          │
└─────────────────────┘

通知类型说明：
• activity: 活动通知
• recruitment: 招募通知
• trade: 交易通知
• system: 系统通知
• follow: 关注通知
• like: 点赞通知
• comment: 评论通知
```

---

## 📊 模块九：首页配置模块

```
┌─────────────────────┐
│      BANNERS        │
├─────────────────────┤
│ PK id               │
│    title            │
│    image_url        │
│    link_type        │
│    link_value       │
│    sort             │
│    status           │
│    start_time       │
│    end_time         │
└─────────────────────┘

轮播图链接类型：
• activity: 活动详情
• band: 乐队主页
• product: 商品详情
• url: 自定义链接
• none: 无链接
```

---

## 🔗 完整 ER 关系总览

```
                          ┌──────────────────┐
                          │    USERS         │
                          ├──────────────────┤
                          │ PK id            │
                          │    openid (UK)   │
                          │    nickname      │
                          │    avatar        │
                          │    identity      │
                          └────────┬─────────┘
                                   │
          ┌────────────┬───────────┼───────────┬────────────┬────────────┐
          │            │           │           │            │            │
          ▼            ▼           ▼           ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
    │BANDS     │ │ACTIVITIES│ │PRODUCTS│ │POSTS   │ │FOLLOWS │ │NOTIFICA- │
    ├──────────┤ ├──────────┤ ├────────┤ ├────────┤ ├────────┤ │TIONS     │
    │FKowner_id│ │FKorg_id  │ │FKsell_ │ │FKuser_ │ │FKfol_  │ │FKuser_id│
    │PK id     │ │PK id     │ │id      │ │id      │ │id      │ │PK id    │
    │          │ │          │ │PK id   │ │PK id   │ │FKfoll_ │ │         │
    │          │ │          │ │        │ │        │ │id      │ │         │
    └────┬─────┘ └────┬─────┘ └───┬────┘ └────┬─────┘ └────────┘ └──────────┘
         │            │           │           │
         │ 1:N        │ 1:N       │ 1:N       │ 1:N
         ▼            ▼           ▼           ▼
    ┌──────────┐ ┌─────────────┐ ┌────────┐ ┌──────────┐
    │BAND_     │ │ACTIVITIES_  │ │TRADE_  │ │POST_     │
    │MEMBERS   │ │SIGNUPS      │ │ORDERS  │ │COMMENTS  │
    ├──────────┤ ├─────────────┤ ├────────┤ ├──────────┤
    │FKband_id │ │FKactivity_id│ │FKprod_ │ │FKpost_id │
    │FKuser_id │ │FKuser_id   │ │id      │ │FKuser_id │
    │          │ │            │ │FKbuy_  │ │          │
    │          │ │            │ │id      │ │          │
    │          │ │            │ │FKsell_ │ │          │
    │          │ │            │ │id      │ │          │
    └──────────┘ └─────────────┘ └────────┘ └──────────┘
         │
         │ 1:N
         ▼
    ┌──────────┐
    │RECRUIT-  │
    │MENTS     │
    ├──────────┤
    │FKband_id │
    │PK id     │
    │          │
    └────┬─────┘
         │ 1:N
         ▼
    ┌──────────────────┐
    │RECRUITMENT_      │
    │APPLICATIONS      │
    ├──────────────────┤
    │FKrecruitment_id │
    │FKuser_id        │
    │                 │
    └─────────────────┘

    ┌─────────────────┐
    │ REHEARSAL_ROOMS │
    ├─────────────────┤
    │ FK venue_id     │
    │ PK id           │
    │                │
    │                │
    └───────┬────────┘
            │ 1:N
            ▼
    ┌─────────────────┐  ┌──────────────┐
    │ROOM_BOOKINGS    │  │ROOM_TIME_    │
    ├─────────────────┤  │SLOTS         │
    │FK room_id      │  ├──────────────┤
    │FK user_id      │  │FK room_id   │
    │                │  │              │
    └─────────────────┘  └──────────────┘
```

---

## 📋 关键设计说明

### 1. 用户身份体系
```
USERS.identity 字段支持4种身份：
• fan: 普通爱好者
• musician: 乐手
• band: 乐队（通常指乐队管理者）
• venue: 场地商家
```

### 2. 审核流程
```
状态字段说明：
• bands.status: 0=待审核, 1=通过, 2=拒绝
• posts.status: 0=待审核, 1=已发布, 2=已拒绝
```

### 3. 订单状态机
```
ROOM_BOOKINGS.status:
pending → paid → completed
           ↓
        cancelled/refunded

TRADE_ORDERS.status:
paid → shipped → confirmed → completed
                         ↓
                      cancelled/refunded
```

### 4. 关联表设计
```
• band_members: N:M (用户-乐队)
• activities_signups: N:M (用户-活动)
• follows: N:M (用户-用户)
• favorites: N:M (用户-资源)，通过type区分目标类型
```

---

**文档版本**: v1.0.0
**最后更新**: 2026-04-28
