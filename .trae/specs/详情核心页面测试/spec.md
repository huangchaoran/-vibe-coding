# 前端详情页测试规范

## Why
已开发完成5个详情页面（乐队、活动、商品、帖子、招募），需要使用 gojica_test 测试数据库验证页面功能是否正常工作，确保用户能够正常浏览详情并进行交互操作。

## 测试数据库
- **数据库**: gojica_test
- **后端API**: http://localhost:3000/api/v1

## What Changes
- 在 gojica_test 数据库中准备测试数据
- 编写正面测试用例（正常流程）
- 编写反面测试用例（异常情况）
- 验证API对接和数据展示
- 验证用户交互功能
- 验证页面导航和状态管理

## 测试数据要求

### 乐队测试数据 (id=100)
```sql
INSERT INTO bands (id, name, avatar, cover, style, intro, owner_id, member_count, status)
VALUES (100, '测试摇滚乐队', 'https://picsum.photos/200', 'https://picsum.photos/800/400', 'rock', '一支热爱摇滚的乐队成立于2020年', 1, 4, 1);

INSERT INTO band_members (id, band_id, user_id, role, instrument)
VALUES (100, 100, 1, 'leader', '主唱'), (101, 100, 2, 'member', '吉他'),
       (102, 100, 3, 'member', '贝斯'), (103, 100, 4, 'member', '鼓');
```

### 活动测试数据 (id=100)
```sql
INSERT INTO activities (id, title, type, description, location, start_time, end_time, fee, max_participants, current_participants, organizer_id, status, cover_image)
VALUES (100, '周末音乐节', 'performance', '一场精彩绝伦的音乐节活动', '北京音乐厅', '2026-05-15 14:00:00', '2026-05-15 20:00:00', 100.00, 200, 45, 1, 'recruiting', 'https://picsum.photos/800/400');
```

### 商品测试数据 (id=100)
```sql
INSERT INTO products (id, title, category, price, condition_level, description, images, seller_id, status)
VALUES (100, '二手电吉他', 'guitar', 2500.00, 'like_new', '九成新的Fender电吉他', '["https://picsum.photos/400/400"]', 1, 1);
```

### 帖子测试数据 (id=100)
```sql
INSERT INTO posts (id, user_id, content, images, like_count, comment_count, status)
VALUES (100, 1, '我们的新歌终于发布了！希望大家喜欢这首摇滚风格的歌曲。', '["https://picsum.photos/300/300"]', 128, 25, 1);
```

### 招募测试数据 (id=100)
```sql
INSERT INTO recruitments (id, band_id, instrument, description, level_requirement, status)
VALUES (100, 100, '吉他', '我们需要一位热爱摇滚的吉他手加入我们的乐队', '有演出经验', 'open');
```

---

## ADDED Requirements

### Requirement: 乐队详情页测试
测试乐队详情页的完整功能流程

#### Scenario: 正常加载乐队详情
- **WHEN** GET /api/v1/bands/100
- **THEN** 返回200，data包含乐队基本信息、成员列表

#### Scenario: 无效乐队ID
- **WHEN** GET /api/v1/bands/99999
- **THEN** 返回404，message为"乐队不存在"

---

### Requirement: 活动详情页测试
测试活动详情页的完整功能流程

#### Scenario: 正常加载活动详情
- **WHEN** GET /api/v1/activities/100
- **THEN** 返回200，data包含活动信息、时间地点、报名进度

#### Scenario: 活动已结束状态
- **WHEN** 活动status为ended
- **THEN** 前端禁用报名按钮，提示"活动已结束"

---

### Requirement: 商品详情页测试
测试商品详情页的完整功能流程

#### Scenario: 正常加载商品详情
- **WHEN** GET /api/v1/products/100
- **THEN** 返回200，data包含商品图片、价格、描述

---

### Requirement: 帖子详情页测试
测试帖子详情页的完整功能流程

#### Scenario: 正常加载帖子详情
- **WHEN** GET /api/v1/posts/100
- **THEN** 返回200，data包含帖子内容、作者信息、点赞评论数

---

### Requirement: 招募详情页测试
测试招募详情页的完整功能流程

#### Scenario: 正常加载招募详情
- **WHEN** GET /api/v1/recruitments/100
- **THEN** 返回200，data包含招募信息、要求、发布者

---

## 测试覆盖范围

### 正面测试（必须）
- [ ] GET /api/v1/bands/100 - 乐队详情正常加载
- [ ] GET /api/v1/activities/100 - 活动详情正常加载
- [ ] GET /api/v1/products/100 - 商品详情正常加载
- [ ] GET /api/v1/posts/100 - 帖子详情正常加载
- [ ] GET /api/v1/recruitments/100 - 招募详情正常加载

### 反面测试（必须）
- [ ] GET /api/v1/bands/99999 - 无效ID显示404
- [ ] GET /api/v1/activities/99999 - 无效ID显示404
- [ ] GET /api/v1/products/99999 - 无效ID显示404
- [ ] GET /api/v1/posts/99999 - 无效ID显示404
- [ ] GET /api/v1/recruitments/99999 - 无效ID显示404

### 边界测试（建议）
- [ ] GET /api/v1/bands/invalid - 参数类型错误返回422
- [ ] 大量图片加载性能测试
- [ ] 长文本内容展示测试