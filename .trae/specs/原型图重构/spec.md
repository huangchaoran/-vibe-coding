# 基于原型图重构所有前端页面

## Why
当前前端页面与原型图（gojica-prototype.html）存在视觉差异，需要按照原型图规范重构所有页面，确保UI与设计稿保持一致。

## What Changes
- 按照原型图的样式规范（颜色、间距、圆角、字体大小等）重构所有页面
- 统一使用原型图定义的配色方案和样式变量
- 确保所有组件样式与原型图完全一致

## Impact
- Affected pages: 所有页面文件
- Reference: gojica-prototype.html

## 核心样式规范（来自原型图）

### 颜色变量
| 变量 | 值 | 用途 |
|------|-----|------|
| 背景色 | #0d0d1f | 页面背景 |
| 卡片背景 | #16213e | 卡片、容器背景 |
| 主题色 | #e94560 | 主按钮、重点元素 |
| 主文字 | #fff | 主要文字 |
| 辅助文字 | #a0a0c0 | 次要文字 |
| 灰文字 | #5a5a8a | 占位符、禁用态 |
| 边框色 | #1a1a4e | 分割线、边框 |
| 底部栏背景 | #0f0f23 | 固定底部栏 |

### 字体大小规范
| 类型 | 大小 |
|------|------|
| 页面标题 | 20px / 700 |
| 标签文字 | 11px |
| 辅助文字 | 12-13px |
| 正文 | 13-14px |

### 间距规范
| 类型 | 值 |
|------|-----|
| 页面左右边距 | 14px |
| 卡片内边距 | 12-14px |
| 元素间距 | 8-12px |

### 圆角规范
| 元素 | 圆角值 |
|------|--------|
| 卡片 | 14px |
| 按钮 | 14-20px |
| 标签 | 10px |
| 输入框 | 12px |

## 重构页面清单

### GROUP 1: 登录 & 首页
- [ ] pages/user/login.uvue - 登录页
- [ ] pages/index/index.uvue - 首页

### GROUP 2: 乐队模块
- [ ] pages/band/list.uvue - 乐队列表
- [ ] pages/band/detail.uvue - 乐队详情

### GROUP 3: 活动模块
- [ ] pages/activity/list.uvue - 活动列表
- [ ] pages/activity/detail.uvue - 活动详情

### GROUP 4: 招募 & 商品
- [ ] pages/recruitment/list.uvue - 招募列表
- [ ] pages/product/list.uvue - 商品列表

### GROUP 5: 动态广场
- [ ] pages/post/detail.uvue - 动态详情

### GROUP 6: 个人中心
- [ ] pages/user/index.uvue - 个人中心
- [ ] pages/user/profile.uvue - 编辑资料

## 底部操作栏样式规范

### 按钮样式
```css
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
}
```

## 列表项样式规范
```css
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #1a1a3e;
}

.list-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
}
```
