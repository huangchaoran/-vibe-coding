# Gojica 前端UI与原型图统一规范

## Why
当前前端页面与原型图（gojica-prototype.html）和页面描述文档存在大量UI不一致问题，需要全面重构统一。

## What Changes
- 根据原型图HTML精确还原每个页面的布局、样式、间距
- 创建缺失的页面（动态广场、发布动态、创建乐队、搜索页、排练室）
- 统一所有页面的配色、字体、间距、圆角等设计规范

## Impact
- Affected pages: 所有页面文件
- Reference: 
  - gojica-prototype.html
  - Gojica-页面描述文档.md

---

## 核心设计规范（来自原型图）

### 配色方案
| 用途 | 色值 | class名 |
|------|-----|---------|
| 主背景 | #0d0d1f | bg-primary |
| 卡片背景 | #16213e | bg-card |
| 导航栏背景 | #0f0f23 | bg-nav |
| 主色调 | #e94560 | color-primary |
| 主色调深 | #8b1a34 | color-primary-dark |
| 文字主色 | #ffffff | color-white |
| 文字次要 | #a0a0c0 | color-gray |
| 文字辅助 | #5a5a8a | color-muted |
| 边框 | #1a1a4e | border-color |

### 字体大小规范
| 类型 | 大小 | 使用场景 |
|------|------|----------|
| 页面标题 | 20px / 700 | detail-title |
| 列表标题 | 14px / 600 | list-name, activity-title |
| 正文 | 13px | detail-desc, post-content |
| 标签文字 | 12px | filter-tag, stat-label |
| 小标签 | 11px | detail-tag, recruit-tag |
| 底部导航 | 10px | nav-text |

### 间距规范
| 类型 | 值 | 使用场景 |
|------|-----|---------|
| 页面左右边距 | 14px | 所有内容容器 |
| 元素间距 | 10-12px | list-item, form-item |
| 卡片内边距 | 12-14px | card body |
| 标题间距 | 12px | section-header |

### 圆角规范
| 元素 | 圆角值 | class名 |
|------|--------|---------|
| 卡片 | 14px | border-radius-card |
| 按钮 | 20px / 14px | border-radius-btn |
| 标签 | 14px / 10px | border-radius-tag |
| 输入框 | 12px | border-radius-input |
| 头像 | 50% 或 10px | border-radius-avatar |

---

## 页面清单（共15个）

### GROUP 1: 登录 & 首页
- [x] pages/user/login.uvue - 登录页（需重构）
- [x] pages/index/index.uvue - 首页（需重构）

### GROUP 2: 乐队模块
- [x] pages/band/list.uvue - 乐队列表（需重构）
- [x] pages/band/detail.uvue - 乐队详情（需重构）
- [ ] pages/band/create.uvue - 创建乐队（新增）

### GROUP 3: 活动模块
- [x] pages/activity/list.uvue - 活动列表（需重构）
- [x] pages/activity/detail.uvue - 活动详情（需重构）

### GROUP 4: 招募 & 商品
- [x] pages/recruitment/list.uvue - 招募列表（需重构）
- [x] pages/product/list.uvue - 商品市场（需重构）
- [x] pages/recruitment/detail.uvue - 招募详情（需重构）
- [x] pages/product/detail.uvue - 商品详情（需重构）

### GROUP 5: 动态广场
- [ ] pages/square/index.uvue - 动态广场（新增）
- [ ] pages/square/post.uvue - 发布动态（新增）

### GROUP 6: 个人中心
- [x] pages/user/index.uvue - 个人中心（需重构）
- [x] pages/user/profile.uvue - 编辑资料（需重构）
- [x] pages/user/activities.uvue - 我的活动（需重构）
- [x] pages/user/bookings.uvue - 我的预约（需重构）
- [x] pages/user/orders.uvue - 我的订单（需重构）
- [x] pages/user/favorites.uvue - 我的收藏（需重构）

### GROUP 7: 搜索 & 排练室
- [ ] pages/search/index.uvue - 全局搜索（新增）
- [ ] pages/room/list.uvue - 排练室列表（新增）

### GROUP 8: 详情页
- [x] pages/post/detail.uvue - 动态详情（需重构）

---

## 通用组件样式

### 顶部导航栏 top-nav
```css
.top-nav {
  padding: 12px 16px;
  background: #0d0d1f;
  border-bottom: 1px solid #1a1a3e;
}
.top-nav-title { color: #fff; font-size: 16px; font-weight: 700; }
.top-nav-icon { color: #a0a0c0; font-size: 18px; }
```

### 搜索栏 search-bar
```css
.search-bar {
  margin: 10px 14px;
  background: #1a1a3e;
  border-radius: 20px;
  padding: 8px 14px;
  color: #5a5a8a;
  font-size: 13px;
}
```

### 轮播图 banner
```css
.banner {
  margin: 10px 14px;
  height: 150px;
  border-radius: 14px;
  background: linear-gradient(135deg, #e94560 0%, #8b1a34 50%, #16213e 100%);
}
.banner-title { font-size: 18px; font-weight: 700; }
.banner-sub { font-size: 12px; color: rgba(255,255,255,0.7); }
.banner-badge { font-size: 11px; padding: 3px 8px; border-radius: 10px; }
```

### 统计卡片 stat-card
```css
.stat-card {
  background: #16213e;
  border-radius: 12px;
  padding: 12px 8px;
  border: 1px solid #1a1a4e;
}
.stat-num { color: #e94560; font-size: 20px; font-weight: 700; }
.stat-label { color: #a0a0c0; font-size: 11px; }
```

### 标签筛选 filter-tag
```css
.filter-tag {
  background: #16213e;
  color: #a0a0c0;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 14px;
  border: 1px solid #1a1a4e;
}
.filter-tag.active { background: #e94560; color: #fff; border-color: #e94560; }
```

### 底部导航 bottom-nav
```css
.bottom-nav {
  position: absolute;
  bottom: 0;
  height: 60px;
  background: #0f0f23;
  border-top: 1px solid #1a1a3e;
}
.nav-icon { font-size: 20px; color: #5a5a8a; }
.nav-text { font-size: 10px; color: #5a5a8a; }
.nav-item.active .nav-icon, .nav-item.active .nav-text { color: #e94560; }
```

### 底部操作栏 bottom-action
```css
.bottom-action {
  padding: 12px 14px;
  background: #0f0f23;
  border-top: 1px solid #1a1a3e;
}
.btn-secondary {
  flex: 1;
  background: #16213e;
  color: #e94560;
  border: 1px solid #e94560;
  border-radius: 20px;
  padding: 10px;
  font-size: 13px;
}
.btn-primary {
  flex: 2;
  background: #e94560;
  color: #fff;
  border-radius: 20px;
  padding: 10px;
  font-size: 14px;
  font-weight: 700;
}
```
