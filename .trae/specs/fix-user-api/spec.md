# 用户模块API修复 - 产品需求文档

## Overview
- **Summary**: 修复用户模块中三个失败的API接口：/users/stats、/users/activities、/users/orders
- **Purpose**: 确保用户模块所有API都能正常工作，提供完整的用户中心功能
- **Target Users**: 平台用户，包括粉丝、音乐人、乐队成员和场地商家

## Goals
- 修复 `/users/stats` API，返回用户统计数据
- 修复 `/users/activities` API，返回用户参加的活动列表
- 修复 `/users/orders` API，返回用户订单列表
- 确保所有用户模块API都能正常返回200状态码

## Non-Goals (Out of Scope)
- 不添加新功能，仅修复现有API
- 不修改前端代码，仅修复后端逻辑
- 不涉及数据库表结构的大规模变更

## Background & Context
根据之前的测试结果，用户模块的6个API正常工作，但有3个API返回500错误：
- `/users/stats` - 500错误
- `/users/activities` - 500错误
- `/users/orders` - 500错误

这些错误可能是由于数据库表结构不匹配或SQL查询错误导致的。

## Functional Requirements
- **FR-1**: `/users/stats` API 应返回用户的关注数、粉丝数、动态数、活动数
- **FR-2**: `/users/activities` API 应返回用户参加的活动列表，支持分页
- **FR-3**: `/users/orders` API 应返回用户订单列表，支持分页和筛选

## Non-Functional Requirements
- **NFR-1**: API响应时间应小于200ms
- **NFR-2**: 所有API应返回统一的响应格式
- **NFR-3**: 错误处理应返回清晰的错误信息

## Constraints
- **Technical**: 使用Node.js + Express + Sequelize + MySQL
- **Dependencies**: 依赖现有的数据库表结构

## Assumptions
- 数据库表结构已存在，只需修复SQL查询
- 用户已登录并提供有效的JWT token

## Acceptance Criteria

### AC-1: /users/stats 返回用户统计数据
- **Given**: 用户已登录，发送GET请求到/users/stats
- **When**: 请求成功处理
- **Then**: 返回200状态码，包含followCount、fansCount、dynamicsCount、activityCount字段
- **Verification**: `programmatic`

### AC-2: /users/activities 返回活动列表
- **Given**: 用户已登录，发送GET请求到/users/activities
- **When**: 请求成功处理
- **Then**: 返回200状态码，包含活动列表和分页信息
- **Verification**: `programmatic`

### AC-3: /users/orders 返回订单列表
- **Given**: 用户已登录，发送GET请求到/users/orders
- **When**: 请求成功处理
- **Then**: 返回200状态码，包含订单列表和分页信息
- **Verification**: `programmatic`

## Open Questions
- [ ] 需要检查gojica_db数据库中相关表的结构
- [ ] 需要确定SQL查询失败的具体原因