# 用户模块API修复 - 实施计划

## [x] Task 1: 检查数据库表结构
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 检查gojica_db数据库中users、activities、orders、follows、posts表的结构
  - 确定SQL查询失败的具体原因
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3]
- **Test Requirements**:
  - `programmatic`: 验证数据库表结构与代码中的SQL查询匹配
  - `human-judgment`: 检查数据库表是否存在所需字段
- **Notes**: 需要检查的表包括：users, activities, orders, follows, posts, activity_participants

## [x] Task 2: 修复 /users/stats API
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修复getUserStats方法中的SQL查询
  - 确保返回正确的统计数据（followCount、fansCount、dynamicsCount、activityCount）
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic`: GET /users/stats 返回200状态码和正确的统计数据
  - `programmatic`: 响应包含followCount、fansCount、dynamicsCount、activityCount字段
- **Notes**: 可能需要修复follows表和posts表的关联查询

## [x] Task 3: 修复 /users/activities API
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修复getMyActivities方法中的SQL查询
  - 确保正确关联用户参加的活动数据
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `programmatic`: GET /users/activities 返回200状态码
  - `programmatic`: 响应包含活动列表和分页信息
- **Notes**: 可能需要检查activity_participants表或activities表的结构

## [x] Task 4: 修复 /users/orders API
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修复getMyOrders方法中的SQL查询
  - 确保正确查询用户订单数据
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic`: GET /users/orders 返回200状态码
  - `programmatic`: 响应包含订单列表和分页信息
- **Notes**: 需要检查orders表的结构

## [x] Task 5: 测试验证所有修复
- **Priority**: P0
- **Depends On**: Task 2, Task 3, Task 4
- **Description**: 
  - 运行测试脚本验证所有修复的API
  - 确保所有用户模块API都返回200状态码
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3]
- **Test Requirements**:
  - `programmatic`: 所有9个用户模块API都返回200状态码
  - `programmatic`: 响应数据格式正确
- **Notes**: 使用现有的test-all.js测试脚本