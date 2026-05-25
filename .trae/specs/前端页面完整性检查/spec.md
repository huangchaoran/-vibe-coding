# Gojica前端页面完整性检查规格文档

## 概述
- **目的**: 确保所有前端页面文件符合编码规范，无语法错误，能够正常编译运行
- **问题背景**: 之前生成的前端页面存在中文乱码、HTML标签未闭合、导入路径错误等问题
- **目标用户**: 开发团队、测试团队

## 为什么需要此规格
前端页面在生成过程中出现了以下问题：
- 中文编码乱码（显示为"�"）
- HTML标签未正确闭合（`<text>`缺少`</text>`）
- 导入路径错误（`common/utis/` 应为 `common/utils/`）
- 编译失败，影响开发进度

## 检查范围

### 需要检查的页面文件（共17个）

**核心页面（高优先级）：**
1. ✅ `pages/home/index.uvue` - 首页
2. ✅ `pages/login/index.uvue` - 登录页
3. ✅ `pages/band/list.uvue` - 乐队列表页
4. ✅ `pages/band/detail.uvue` - 乐队详情页
5. ✅ `pages/band/create.uvue` - 创建乐队页
6. ✅ `pages/activity/list.uvue` - 活动列表页
7. ✅ `pages/activity/detail.uvue` - 活动详情页
8. ✅ `pages/user/index.uvue` - 个人中心页
9. ✅ `pages/user/profile.uvue` - 编辑资料页

**扩展页面（中优先级）：**
10. ✅ `pages/square/index.uvue` - 动态广场页
11. ✅ `pages/square/post.uvue` - 发布动态页
12. ✅ `pages/market/list.uvue` - 商品市场页
13. ✅ `pages/market/detail.uvue` - 商品详情页
14. ✅ `pages/recruit/list.uvue` - 招募列表页
15. ✅ `pages/search/index.uvue` - 搜索页
16. ✅ `pages/room/list.uvue` - 排练室列表页

**配置文件：**
17. ✅ `pages.json` - 页面路由配置

## 检查标准

### 必须通过的检查项

#### 1. 中文编码检查
- **AC-1.1**: 所有中文字符正确显示，无乱码
  - 验证方法: grep搜索"�"字符，应返回0个结果
  - 验证类型: `programmatic`

#### 2. HTML标签完整性
- **AC-2.1**: 所有`<text>`标签正确闭合
  - 验证方法: 正则匹配`<text>`和`</text>`数量相等
  - 验证类型: `programmatic`
- **AC-2.2**: 所有`<view>`标签正确闭合
  - 验证方法: 正则匹配`<view>`和`</view>`数量相等
  - 验证类型: `programmatic`
- **AC-2.3**: 所有`<template>`标签正确闭合
  - 验证方法: 检查`<template>`和`</template>`配对
  - 验证类型: `programmatic`
- **AC-2.4**: 所有`<script>`标签正确闭合
  - 验证方法: 检查`<script>`和`</script>`配对
  - 验证类型: `programmatic`
- **AC-2.5**: 所有`<style>`标签正确闭合
  - 验证方法: 检查`<style>`和`</style>`配对
  - 验证类型: `programmatic`

#### 3. 导入路径正确性
- **AC-3.1**: 所有导入路径使用正确的`utils`目录
  - 验证方法: grep搜索`utis`，应返回0个结果
  - 验证类型: `programmatic`
- **AC-3.2**: 所有导入路径指向`common/utils/`
  - 验证方法: 检查`import.*from.*common/utils/`
  - 验证类型: `programmatic`

#### 4. 文件结构完整性
- **AC-4.1**: 每个`.uvue`文件包含`<template>`、`<script>`、`<style>`三个部分
  - 验证方法: 检查文件包含所有必要的标签
  - 验证类型: `programmatic`

#### 5. 编译成功性
- **AC-5.1**: UniApp项目能够成功编译，无错误
  - 验证方法: 运行HBuilderX编译，观察错误输出
  - 验证类型: `programmatic`

### 已知问题记录

#### 已修复的问题
- ❌ `pages/login/index.uvue` - 7处中文乱码 → 已修复
- ❌ `pages/activity/detail.uvue` - 14处中文乱码 → 已修复
- ❌ `pages/home/index.uvue` - 16处中文乱码 → 已修复
- ❌ `pages/band/create.uvue` - 多处中文乱码和标签问题 → 已修复
- ❌ 目录命名错误 `utis` → `utils` → 已修复

## 验证要求

### 每个页面必须验证
1. **手动检查点**:
   - 文件可以正常打开
   - 中文注释和文本正确显示
   - HTML结构清晰
   - JavaScript代码无语法错误

2. **自动化检查**:
   - 使用grep检查乱码字符
   - 使用正则检查标签配对
   - 使用IDE编译验证

## 影响范围

### 受影响的文件
- 所有`pages/**/*.uvue`文件
- `common/utils/api.ts`
- `common/utils/theme.ts`
- `pages.json`配置
- `uni.scss`主题配置

### 不受影响的文件
- 后端代码（server目录）
- 文档文件（docs目录）
- 静态资源（static目录）

## 验收标准

### 所有页面必须满足
- ✅ **AC-1**: 无中文乱码字符"�"
- ✅ **AC-2**: 所有HTML标签正确闭合
- ✅ **AC-3**: 导入路径正确（`common/utils/`）
- ✅ **AC-4**: 文件结构完整
- ✅ **AC-5**: 项目可以成功编译

## 风险和注意事项
- 部分页面可能仍存在隐藏的乱码问题
- 编译过程可能受到IDE缓存影响
- 需要重启IDE才能完全清除编译缓存

## 后续行动
1. 执行全面的页面检查
2. 修复发现的问题
3. 重新编译项目验证
4. 生成测试报告
