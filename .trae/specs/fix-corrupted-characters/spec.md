# 修复前端页面损坏字符规范

## Why
前端页面中存在大量 Unicode 替换字符（�），总计约 81 处，影响 14 个 `.uvue` 文件。这些损坏字符会导致页面显示异常，影响用户体验。

## What Changes
- 修复 `pages/user/index.uvue` 中的损坏字符（10处）
- 修复 `pages/user/profile.uvue` 中的损坏字符（10处）
- 修复 `pages/square/post.uvue` 中的损坏字符（4处）
- 修复 `pages/square/index.uvue` 中的损坏字符（4处）
- 修复 `pages/search/index.uvue` 中的损坏字符（4处）
- 修复 `pages/room/list.uvue` 中的损坏字符（4处）
- 修复 `pages/recruit/list.uvue` 中的损坏字符（3处）
- 修复 `pages/market/detail.uvue` 中的损坏字符（3处）
- 修复 `pages/market/list.uvue` 中的损坏字符（3处）
- 修复 `pages/band/detail.uvue` 中的损坏字符（5处）
- 修复 `pages/band/list.uvue` 中的损坏字符（3处）
- 修复 `pages/band/create.uvue` 中的损坏字符（7处）
- 修复 `pages/activity/list.uvue` 中的损坏字符（9处）
- 修复 `pages/activity/detail.uvue` 中的损坏字符（12处）

## Impact
- Affected specs: 无
- Affected code: 14 个前端页面文件

## ADDED Requirements
无

## MODIFIED Requirements
### Requirement: 前端页面文本显示完整性
前端页面中的所有中文文本、占位符、按钮文字、状态提示等均应正确显示，不得出现 Unicode 替换字符（�）。

#### Scenario: 修复损坏字符
- **WHEN** 检查任意前端页面文件
- **THEN** 文件中不应包含 Unicode 替换字符（U+FFFD）

## REMOVED Requirements
无
