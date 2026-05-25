# Tasks: 前端详情页开发

## 任务概述
根据后端API规范，开发5个详情页面：乐队详情、活动详情、商品详情、帖子详情、招募详情

---

## 任务清单

- [x] Task 1: 更新前端API类型定义
  - 更新 api/band.uts 添加 BandDetail 类型和接口
  - 更新 api/activity.uts 添加 ActivityDetail 类型和接口
  - 更新 api/product.uts 添加 ProductDetail 类型和接口
  - 更新 api/post.uts 添加 PostDetail 类型和接口
  - 更新 api/recruitment.uts 添加 RecruitmentDetail 类型和接口
  - 更新 api/index.ts 统一导出

- [x] Task 2: 开发乐队详情页
  - 创建 pages/band/detail.uvue
  - 实现乐队基本信息展示
  - 实现成员列表展示
  - 实现关注/取消关注功能
  - 实现近期活动列表
  - 添加到 pages.json 路由配置

- [x] Task 3: 开发活动详情页
  - 创建 pages/activity/detail.uvue
  - 实现活动基本信息展示
  - 实现报名人数显示
  - 实现报名/取消报名功能
  - 实现发布者信息展示
  - 添加到 pages.json 路由配置

- [x] Task 4: 开发商品详情页
  - 创建 pages/product/detail.uvue
  - 实现商品图片轮播
  - 实现价格信息展示
  - 实现卖家信息展示
  - 实现收藏功能
  - 添加到 pages.json 路由配置

- [x] Task 5: 开发帖子详情页
  - 创建 pages/post/detail.uvue
  - 实现帖子内容展示
  - 实现作者信息展示
  - 实现点赞/取消点赞功能
  - 实现评论列表展示
  - 实现评论输入功能
  - 添加到 pages.json 路由配置

- [x] Task 6: 开发招募详情页
  - 创建 pages/recruitment/detail.uvue
  - 实现招募信息展示
  - 实现发布方信息展示
  - 实现申请功能
  - 添加到 pages.json 路由配置

- [x] Task 7: 更新pages.json路由配置
  - 添加所有详情页路由
  - 配置页面标题和样式

## 任务依赖
- Task 1 应在所有详情页开发前完成
- Task 2-6 可并行开发
- Task 7 在所有页面完成后统一更新

## 验证方式
- 运行项目检查页面是否正常加载
- 点击列表项跳转详情页验证数据展示
- 测试交互功能（关注、报名、点赞等）

## 完成状态
✅ 所有任务已完成
✅ API类型定义已更新
✅ 详情页已创建并配置路由