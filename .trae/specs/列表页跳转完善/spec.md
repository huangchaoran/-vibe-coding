# 列表页到详情页跳转完善 Spec

## Why
当前前端存在以下问题：
1. 首页导航到商品和招募的页面路径不存在
2. 缺少商品列表页和招募列表页
3. 需要完善从列表页到详情页的完整跳转链路

## What Changes
- 创建商品列表页 `pages/product/list.uvue`
- 创建招募列表页 `pages/recruitment/list.uvue`
- 修复首页导航路径
- 完善列表项点击跳转逻辑

## Impact
- Affected specs: 前端详情页开发
- Affected code: 
  - Gojica前端/pages/product/list.uvue (新增)
  - Gojica前端/pages/recruitment/list.uvue (新增)
  - Gojica前端/pages/index/index.uvue (修改)
  - Gojica前端/pages.json (修改)

## ADDED Requirements

### Requirement: 商品列表页
系统应提供商品列表展示页面，包含搜索和筛选功能。

#### Scenario: 商品列表加载
- **WHEN** 用户访问商品列表页
- **THEN** 展示商品卡片列表，支持下拉刷新和上拉加载

#### Scenario: 商品卡片点击
- **WHEN** 用户点击商品卡片
- **THEN** 跳转到商品详情页 `/pages/product/detail?id={id}`

### Requirement: 招募列表页
系统应提供招募信息列表展示页面。

#### Scenario: 招募列表加载
- **WHEN** 用户访问招募列表页
- **THEN** 展示招募信息列表

#### Scenario: 招募卡片点击
- **WHEN** 用户点击招募卡片
- **THEN** 跳转到招募详情页 `/pages/recruitment/detail?id={id}`

### Requirement: 首页导航修复
首页快速导航区域应正确跳转到对应列表页。

#### Scenario: 导航点击
- **WHEN** 用户点击首页导航项
- **THEN** 使用 uni.switchTab 跳转到底栏页面，或使用 uni.navigateTo 跳转普通页面

## MODIFIED Requirements

### Requirement: 首页快速导航
- 乐队导航: 保持 `uni.navigateTo` 跳转到 `/pages/band/list`
- 活动导航: 保持 `uni.navigateTo` 跳转到 `/pages/activity/list`
- 商品导航: 修改为跳转 `/pages/product/list`（新建页面）
- 招募导航: 修改为跳转 `/pages/recruitment/list`（新建页面）