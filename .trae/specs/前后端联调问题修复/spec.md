# 前后端联调问题修复 Spec

## Why
根据前后端联调测试结果，发现了5个关键问题需要修复，以确保前端能够正常调用后端API并正确处理返回数据。

## What Changes

### 需要修复的问题清单

1. **前端 Token 字段名不匹配** - 修改 `pages/login/index.uvue` 中的字段访问
2. **Sequelize 内部字段暴露** - 完善 `src/utils/response.js` 中的 `deepConvert` 函数
3. **搜索 URL 编码问题** - 添加 `encodeURIComponent` 处理中文关键词
4. **首页数据返回失败** - 检查并修复 Home Controller
5. **Token 验证返回 404** - 检查路由配置和认证中间件

## Impact

### 受影响的规格
- 用户登录流程
- 首页数据加载
- 乐队/活动列表展示
- 搜索功能

### 受影响的代码

**后端 (3 个文件)**:
- `server/src/utils/response.js` - deepConvert 函数
- `server/src/controllers/homeController.js` - 首页逻辑
- `server/src/routes/*.js` - 路由配置

**前端 (1 个文件)**:
- `Gojica2.0前端/pages/login/index.uvue` - Token 字段名

## ADDED Requirements

### Requirement: Sequelize 序列化安全
系统必须排除 Sequelize 内部字段，防止敏感信息暴露给前端。

#### Scenario: 列表数据序列化
- **WHEN** 后端返回包含 Sequelize 实例的数据
- **THEN** deepConvert 函数应排除 `PreviousDataValues`, `uniqno`, `Changed`, `Options`, `isNewRecord` 等内部字段
- **AND** 只返回标准 JSON 数据字段

### Requirement: URL 参数编码
系统必须正确处理 URL 中的中文字符。

#### Scenario: 搜索关键词包含中文
- **WHEN** 用户搜索包含中文的关键词
- **THEN** 前端应使用 `encodeURIComponent` 编码
- **AND** 后端应正确解码并返回结果

### Requirement: 前端 Token 处理
前端必须使用正确的字段名访问 API 返回的数据。

#### Scenario: 登录成功后存储 Token
- **WHEN** 用户登录成功
- **THEN** 前端应使用 `res.data?.token` 而非 `res.data?.accessToken`
- **AND** 应使用 `res.data?.userInfo` 而非 `res.data?.user`

## MODIFIED Requirements

### Requirement: 用户认证中间件
修改后端中间件，确保未授权访问返回正确的 401 状态码。

#### Scenario: 无 Token 访问受保护资源
- **WHEN** 用户访问 `/api/v1/users/me` 且无 Token
- **THEN** 应返回 401 Unauthorized 状态码
- **AND** 返回格式: `{ code: 3001, message: "Token已过期" }`

## REMOVED Requirements

无

## 验收标准

1. ✅ 所有测试用例通过率 ≥ 95%
2. ✅ 登录流程正常工作
3. ✅ 首页数据正常加载
4. ✅ 搜索功能支持中文
5. ✅ Sequelize 内部字段不暴露
6. ✅ Token 验证返回正确的状态码
