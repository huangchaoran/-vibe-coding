# Gojica 数据库 ER 图

## 📊 模块一：用户与认证模块

```mermaid
erDiagram
    USERS ||--o{ BAND_MEMBERS : "加入"
    USERS ||--o{ BAND_OWNERS : "创建"
    USERS ||--o{ ACTIVITIES_SIGNUPS : "报名"
    USERS ||--o{ ROOM_BOOKINGS : "预约"
    USERS ||--o{ TRADE_ORDERS_BUYER : "购买"
    USERS ||--o{ TRADE_ORDERS_SELLER : "出售"
    USERS ||--o{ POSTS : "发布"
    USERS ||--o{ POST_COMMENTS : "评论"
    USERS ||--o{ FAVORITES : "收藏"
    USERS ||--o{ FOLLOWS : "关注"
    USERS ||--o{ NOTIFICATIONS : "接收"
    USERS ||--o{ PRODUCT_MESSAGES_SEND : "发送消息"
    USERS ||--o{ PRODUCT_MESSAGES_RECEIVE : "接收消息"
    USERS ||--o{ ADMIN_USERS : "关联管理员"

    USERS {
        int id PK
        string openid UK
        string unionid
        string nickname
        string avatar
        string phone
        enum identity
        string instrument
        string music_style
        string location
        text bio
        string video_url
        tinyint status
        datetime last_login_at
        timestamp created_at
        timestamp updated_at
    }

    ADMIN_USERS {
        int id PK
        string username UK
        string password
        string nickname
        enum role
        tinyint status
        datetime last_login_at
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        int id PK
        string openid UK
        string unionid
        string nickname
        string avatar
        string phone
        enum identity "fan/musician/band/venue"
        string instrument
        string music_style
        string location
        text bio
        string video_url
        tinyint status
        datetime last_login_at
        timestamp created_at
        timestamp updated_at
    }
```

---

## 📊 模块二：乐队管理模块

```mermaid
erDiagram
    USERS ||--o{ BANDS : "创建"
    BANDS ||--|{ BAND_MEMBERS : "拥有"
    BANDS ||--o{ ACTIVITIES : "组织"
    BANDS ||--o{ RECRUITMENTS : "发布"
    BAND_MEMBERS }o--|| USERS : "成员"

    BANDS {
        int id PK
        string name
        string style
        text intro
        string avatar
        string cover
        int owner_id FK
        tinyint status "0待审核,1通过,2拒绝"
        string reject_reason
        int member_count
        timestamp created_at
        timestamp updated_at
    }

    BAND_MEMBERS {
        int id PK
        int band_id FK
        int user_id FK
        enum role "leader/member"
        string instrument
        datetime joined_at
        tinyint status
        timestamp created_at
    }

    USERS {
        int id PK
        string openid UK
        string nickname
        string avatar
        string instrument
        string music_style
        enum identity
    }
```

---

## 📊 模块三：活动管理模块

```mermaid
erDiagram
    USERS ||--o{ ACTIVITIES : "组织"
    ACTIVITIES ||--|{ ACTIVITIES_SIGNUPS : "包含"
    USERS }o--|| ACTIVITIES_SIGNUPS : "参加"

    ACTIVITIES {
        int id PK
        string title
        enum type "performance/rehearsal/jam/other"
        text description
        string location
        decimal longitude
        decimal latitude
        datetime start_time
        datetime end_time
        decimal fee
        int max_participants
        int current_participants
        enum status "recruiting/full/ended/cancelled"
        int organizer_id FK
        string cover_image
        timestamp created_at
        timestamp updated_at
    }

    ACTIVITIES_SIGNUPS {
        int id PK
        int activity_id FK
        int user_id FK
        enum status "pending/confirmed/cancelled/checked_in"
        datetime signup_time
        datetime check_in_time
        string check_in_code
        timestamp created_at
    }
```

---

## 📊 模块四：排练房预约模块

```mermaid
erDiagram
    USERS ||--o{ REHEARSAL_ROOMS : "拥有"
    USERS ||--o{ ROOM_BOOKINGS : "预约"
    REHEARSAL_ROOMS ||--|{ ROOM_TIME_SLOTS : "设置"
    REHEARSAL_ROOMS ||--o{ ROOM_BOOKINGS : "被预约"

    REHEARSAL_ROOMS {
        int id PK
        string name
        int venue_id FK
        string address
        string district
        decimal price_per_hour
        json equipment
        string images
        text description
        string opening_hours
        tinyint status
        timestamp created_at
        timestamp updated_at
    }

    ROOM_TIME_SLOTS {
        int id PK
        int room_id FK
        date slot_date
        tinyint start_hour
        tinyint end_hour
        decimal price
        tinyint is_available
        timestamp created_at
    }

    ROOM_BOOKINGS {
        int id PK
        string order_no UK
        int room_id FK
        int user_id FK
        date booking_date
        tinyint start_hour
        tinyint end_hour
        int hours
        decimal total_price
        enum status "pending/paid/cancelled/completed/refunded"
        datetime pay_time
        datetime cancel_time
        timestamp create_time
        timestamp updated_at
    }
```

---

## 📊 模块五：二手设备交易模块

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : "出售"
    PRODUCTS ||--o{ TRADE_ORDERS : "被购买"
    USERS ||--o{ TRADE_ORDERS_BUYER : "购买"
    USERS ||--o{ TRADE_ORDERS_SELLER : "出售"
    PRODUCTS ||--o{ PRODUCT_MESSAGES : "产生"
    USERS ||--o{ PRODUCT_MESSAGES_SEND : "发送"
    USERS ||--o{ PRODUCT_MESSAGES_RECEIVE : "接收"

    PRODUCTS {
        int id PK
        string title
        enum category "guitar/bass/drum/keyboard/effect/amp/other"
        string brand
        string model
        decimal price
        enum condition_level "new/like_new/good/fair/damaged"
        text description
        string images
        int seller_id FK
        tinyint status
        int view_count
        timestamp created_at
        timestamp updated_at
    }

    TRADE_ORDERS {
        int id PK
        string order_no UK
        int product_id FK
        int buyer_id FK
        int seller_id FK
        decimal price
        enum status "pending/paid/shipped/confirmed/completed/cancelled/refunded"
        string shipping_address
        string shipping_no
        datetime pay_time
        datetime ship_time
        datetime confirm_time
        datetime cancel_time
        timestamp create_time
        timestamp updated_at
    }

    PRODUCT_MESSAGES {
        int id PK
        int product_id FK
        int sender_id FK
        int receiver_id FK
        text content
        tinyint is_read
        timestamp created_at
    }
```

---

## 📊 模块六：乐手招募模块

```mermaid
erDiagram
    BANDS ||--o{ RECRUITMENTS : "发布"
    USERS ||--o{ RECRUITMENT_APPLICATIONS : "投递"
    RECRUITMENTS ||--o{ RECRUITMENT_APPLICATIONS : "收到"

    RECRUITMENTS {
        int id PK
        int band_id FK
        string instrument
        string level_requirement
        string style_requirement
        text description
        enum status "open/closed"
        timestamp created_at
        timestamp updated_at
    }

    RECRUITMENT_APPLICATIONS {
        int id PK
        int recruitment_id FK
        int user_id FK
        text message
        enum status "pending/viewed/accepted/rejected"
        datetime apply_time
        datetime reply_time
        timestamp created_at
    }

    BANDS {
        int id PK
        string name
        string style
        text intro
        string avatar
        int owner_id FK
        tinyint status
    }

    USERS {
        int id PK
        string nickname
        string avatar
        string instrument
        string music_style
        enum identity
        text bio
        string video_url
    }
```

---

## 📊 模块七：社区动态模块

```mermaid
erDiagram
    USERS ||--o{ POSTS : "发布"
    POSTS ||--o{ POST_COMMENTS : "收到"
    USERS ||--o{ POST_COMMENTS : "发表"
    USERS ||--o{ FAVORITES : "收藏"

    POSTS {
        int id PK
        int user_id FK
        text content
        string images
        tinyint status "0待审核,1已发布,2已拒绝"
        string reject_reason
        int like_count
        int comment_count
        timestamp created_at
        timestamp updated_at
    }

    POST_COMMENTS {
        int id PK
        int post_id FK
        int user_id FK
        text content
        int parent_id
        int like_count
        timestamp created_at
    }

    FAVORITES {
        int id PK
        int user_id FK
        enum type "activity/product/band/post"
        int target_id
        timestamp created_at
    }

    USERS {
        int id PK
        string nickname
        string avatar
        enum identity
    }
```

---

## 📊 模块八：社交与通知模块

```mermaid
erDiagram
    USERS ||--o{ FOLLOWS : "关注"
    USERS ||--o{ FOLLOWS : "被关注"
    USERS ||--o{ NOTIFICATIONS : "接收"
    USERS ||--o{ FAVORITES : "收藏"

    FOLLOWS {
        int id PK
        int follower_id FK
        int following_id FK
        timestamp created_at
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        enum type "activity/recruitment/trade/system/follow/like/comment"
        string title
        text content
        json data
        tinyint is_read
        timestamp created_at
    }

    FAVORITES {
        int id PK
        int user_id FK
        enum type "activity/product/band/post"
        int target_id
        timestamp created_at
    }

    USERS {
        int id PK
        string nickname
        string avatar
    }
```

---

## 📊 模块九：首页配置模块

```mermaid
erDiagram
    BANNERS {
        int id PK
        string title
        string image_url
        enum link_type "activity/band/product/url/none"
        string link_value
        int sort
        tinyint status
        datetime start_time
        datetime end_time
        timestamp created_at
        timestamp updated_at
    }
```

---

## 🔗 完整的 ER 关系总览

```mermaid
erDiagram
    USERS ||--o{ BANDS : "创建/拥有"
    USERS ||--o{ BAND_MEMBERS : "加入"
    USERS ||--o{ ACTIVITIES : "组织"
    USERS ||--o{ ACTIVITIES_SIGNUPS : "报名"
    USERS ||--o{ REHEARSAL_ROOMS : "拥有"
    USERS ||--o{ ROOM_BOOKINGS : "预约"
    USERS ||--o{ PRODUCTS : "发布"
    USERS ||--o{ TRADE_ORDERS : "交易"
    USERS ||--o{ RECRUITMENTS : "发布招募"
    USERS ||--o{ RECRUITMENT_APPLICATIONS : "申请"
    USERS ||--o{ POSTS : "发布"
    USERS ||--o{ POST_COMMENTS : "评论"
    USERS ||--o{ FAVORITES : "收藏"
    USERS ||--o{ FOLLOWS : "关注"
    USERS ||--o{ NOTIFICATIONS : "接收通知"
    USERS ||--o{ PRODUCT_MESSAGES : "咨询"
    USERS ||--o{ ADMIN_USERS : "管理员"

    BANDS ||--o{ BAND_MEMBERS : "包含"
    BANDS ||--o{ ACTIVITIES : "组织"
    BANDS ||--o{ RECRUITMENTS : "发布"

    ACTIVITIES ||--o{ ACTIVITIES_SIGNUPS : "包含"

    REHEARSAL_ROOMS ||--o{ ROOM_TIME_SLOTS : "设置"
    REHEARSAL_ROOMS ||--o{ ROOM_BOOKINGS : "被预约"

    PRODUCTS ||--o{ TRADE_ORDERS : "被购买"
    PRODUCTS ||--o{ PRODUCT_MESSAGES : "产生"

    RECRUITMENTS ||--o{ RECRUITMENT_APPLICATIONS : "收到"

    POSTS ||--o{ POST_COMMENTS : "包含"
```

---

## 📋 表关系说明

### 核心关系

| 关系 | 说明 | 关系类型 |
|------|------|---------|
| users → bands | 用户创建乐队 | 1:N |
| users → band_members | 用户加入乐队 | N:M |
| users → activities | 用户组织活动 | 1:N |
| users → activities_signups | 用户报名活动 | N:M |
| users → rehearsal_rooms | 场地商家拥有排练房 | 1:N |
| users → room_bookings | 用户预约排练房 | 1:N |
| users → products | 用户发布商品 | 1:N |
| users → trade_orders | 用户参与交易 | N:M |
| users → posts | 用户发布动态 | 1:N |
| users → follows | 用户互相关注 | N:M |
| users → notifications | 用户接收通知 | 1:N |
| bands → recruitments | 乐队发布招募 | 1:N |
| users → recruitment_applications | 用户投递申请 | N:M |

### 特殊关系

| 关系 | 说明 |
|------|------|
| products → trade_orders (buyer) | 商品被购买 |
| products → trade_orders (seller) | 商品被出售 |
| products → product_messages (sender) | 用户发送咨询 |
| products → product_messages (receiver) | 用户接收咨询 |
| activities → activities_signups | 活动包含报名 |
| posts → post_comments | 动态包含评论 |
