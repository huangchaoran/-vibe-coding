# 前端详情页开发规范

## Why
后端API已完善，前端需要开发详情页面来完成用户浏览核心内容的需求。目前已有列表页，需要补充详情页实现完整浏览体验。

## What Changes
- 新增4个详情页面：乐队详情、活动详情、商品详情、帖子详情、招募详情
- 每个详情页包含基本信息展示、关联数据、操作按钮
- 更新前端API规范补充详情接口类型定义

## Impact
- Affected specs: 前端API规范
- Affected code: Gojica前端/pages/ 目录

---

## ADDED Requirements

### Requirement: 乐队详情页
页面应展示乐队的完整信息，包括：
- 乐队基本信息（名称、风格、简介、封面图）
- 乐队成员列表
- 乐队近期活动
- 关注/取消关注功能

#### Scenario: 查看乐队详情
- **WHEN** 用户点击乐队卡片进入详情页
- **THEN** 展示乐队完整信息和操作按钮

#### Scenario: 关注乐队
- **WHEN** 用户点击关注按钮
- **THEN** 调用关注API并更新按钮状态

---

### Requirement: 活动详情页
页面应展示活动的完整信息，包括：
- 活动基本信息（标题、描述、时间、地点、费用）
- 活动封面图
- 报名人数/限制人数
- 报名按钮或已报名状态
- 发布者信息

#### Scenario: 查看活动详情
- **WHEN** 用户点击活动卡片进入详情页
- **THEN** 展示活动完整信息和报名入口

#### Scenario: 报名活动
- **WHEN** 用户点击报名按钮
- **THEN** 调用报名API并更新报名状态

---

### Requirement: 商品详情页
页面应展示商品的完整信息，包括：
- 商品图片轮播
- 价格/原价信息
- 商品描述
- 卖家信息
- 收藏按钮

#### Scenario: 查看商品详情
- **WHEN** 用户点击商品卡片进入详情页
- **THEN** 展示商品完整信息和卖家联系方式

---

### Requirement: 帖子详情页
页面应展示帖子的完整信息，包括：
- 帖子内容（文字/图片/音频/视频）
- 作者信息
- 点赞/评论数
- 点赞按钮和评论列表

#### Scenario: 查看帖子详情
- **WHEN** 用户点击帖子进入详情页
- **THEN** 展示帖子完整内容和互动功能

#### Scenario: 点赞帖子
- **WHEN** 用户点击点赞按钮
- **THEN** 调用点赞API并更新点赞状态和数量

---

### Requirement: 招募详情页
页面应展示招募的完整信息，包括：
- 招募标题和描述
- 乐器要求和人数
- 发布时间和截止时间
- 发布方信息
- 申请按钮

#### Scenario: 查看招募详情
- **WHEN** 用户点击招募卡片进入详情页
- **THEN** 展示招募完整信息和申请入口

---

## API TypeScript类型定义补充

### 乐队详情类型
```typescript
interface BandDetail extends Band {
  members: BandMember[];
  recent_activities: Activity[];
  is_followed: boolean;
}
```

### 活动详情类型
```typescript
interface ActivityDetail extends Activity {
  signups: Signup[];
  is_signed_up: boolean;
}
```

### 商品详情类型
```typescript
interface ProductDetail extends Product {
  seller: UserInfo;
}
```

### 帖子详情类型
```typescript
interface PostDetail extends Post {
  comments: Comment[];
}
```

### 招募详情类型
```typescript
interface RecruitmentDetail extends Recruitment {
  publisher: UserInfo;
  applications: Application[];
}
```

---

## MODIFIED Requirements

### Requirement: 前端API封装
- 更新各API模块添加详情接口
- 补充完整的TypeScript类型定义