# Superpowers 自动化工作流设计

## 目标

24/7 不间断开发，基于 Superpowers Skills 驱动的 AI Agent 并行工作，持续维护 Gojica 2.0 项目。

## 架构

3 个独立 Agent 并行运行，通过共享文件协调：

```
┌─────────────────────────────────────────────────────────────┐
│                    共享文件系统                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Agent-1    │  │  Agent-2    │  │  Agent-3    │   │
│  │  Bug修复    │  │  功能实现    │  │  测试验证    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 核心文件

| 文件 | 作用 |
|------|------|
| `feature_list.json` | 功能清单，passes 标记各功能状态 |
| `todo.txt` | 待实现功能列表 |
| `bugfix_log.txt` | 发现的 Bug 记录（自动追加） |
| `progress.txt` | 各 Agent 进度状态 |
| `test_log/` | 测试日志目录 |

## Agent 职责

| Agent | 任务 | 读取 | 写入 |
|-------|------|------|------|
| **Agent-1** | 修 Bug | bugfix_log, feature_list | bugfix_log, feature_list |
| **Agent-2** | 实现功能 | todo, feature_list | todo, feature_list |
| **Agent-3** | 测试验证 | feature_list, test_log | test_log, feature_list |

## 工作流程

### Agent-1 (Bug修复)

1. 读取 `bugfix_log.txt`
2. 选择优先级最高的 Bug
3. 修复代码
4. 运行相关测试
5. 更新 `feature_list.json` (passes: true)
6. 追加到 `bugfix_log.txt` (状态: fixed)
7. git commit

### Agent-2 (功能实现)

1. 读取 `todo.txt` 和 `feature_list.json`
2. 选择最高优先级的未完成功能
3. 实现代码
4. 更新 `todo.txt`
5. 通知 Agent-3 测试

### Agent-3 (测试验证)

1. 读取 `feature_list.json`
2. 运行 Playwright E2E 测试
3. 运行后端集成测试
4. 记录测试结果到 `test_log/`
5. 更新 `feature_list.json` 状态

## 新 Bug 处理

Agent 发现新 Bug（非 feature_list 中）：
1. 追加到 `bugfix_log.txt`，格式：`[NEW] timestamp | description | file:line`
2. 继续当前任务
3. 不阻塞其他 Agent

## 启动方式

```bash
# 启动 Agent-1 (Bug修复)
claude --agent bug-fixer --project Gojica2.0

# 启动 Agent-2 (功能实现)
claude --agent feature-dev --project Gojica2.0

# 启动 Agent-3 (测试验证)
claude --agent tester --project Gojica2.0
```

## 技术栈

| 组件 | 技术 |
|------|------|
| Agent 框架 | Claude Code + Superpowers |
| 测试 | Playwright + Jest |
| 协调 | 共享文件系统 |
| 持续运行 | 循环启动 + 自动重试 |

## 项目结构

```
Gojica2.0/
├── harness/                    # 工作流配置
│   ├── agents/
│   │   ├── bug-fixer.md       # Bug修复 Agent prompt
│   │   ├── feature-dev.md     # 功能实现 Agent prompt
│   │   └── tester.md          # 测试验证 Agent prompt
│   ├── shared/
│   │   ├── feature_list.json
│   │   ├── todo.txt
│   │   ├── bugfix_log.txt
│   │   └── progress.txt
│   └── scripts/
│       └── loop.sh             # 循环启动脚本
├── docs/superpowers/specs/     # 设计文档
└── [项目代码]
```
