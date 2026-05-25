# Gojica 2.0 全自动工作流设计

## 1. 概述

在 Gojica 2.0 项目上搭建 24/7 全自动 AI 编码工作流。核心思路：基于 Anthropic 的 [autonomous-coding](https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding) 框架，迁移现有测试到 feature_list.json，持续实现新功能 + 修复 Bug。

## 2. 目标

- 24/7 不间断运行，session 之间自动衔接
- 所有功能/Bug 修复通过 feature_list.json 追踪
- 每次 session 自动运行 Playwright 测试验证
- 代码持续提交到 git，不丢失进度

## 3. 架构

### 3.1 双 Agent 模式

| Agent | 运行时机 | 职责 |
|-------|----------|------|
| Initializer Agent | 只运行一次 | 分析现有代码和测试，生成 feature_list.json |
| Coding Agent | 循环运行 | 顺序实现 feature，修复 bug，运行测试 |

### 3.2 核心文件

```
harness/
├── autonomous_agent_demo.py   # 主入口，session 循环控制
├── agent.py                   # Agent 会话逻辑
├── client.py                  # Claude SDK 客户端
├── security.py                # 安全验证（开放模式）
├── progress.py                # feature_list 管理
├── prompts.py                 # 提示词加载
├── prompts/
│   ├── app_spec.txt           # 应用规格（Gojica 2.0）
│   ├── initializer_prompt.md  # 初始化 prompt
│   └── coding_prompt.md       # 编码 prompt
└── requirements.txt           # Python 依赖
```

### 3.3 生成文件（项目根目录）

```
Gojica2.0/
├── feature_list.json         # 功能清单（source of truth）
├── claude-progress.txt       # 进度日志
├── init.sh                   # 环境启动脚本
└── [app files]              # 现有代码不变
```

## 4. feature_list.json 格式

```json
[
  {
    "id": "F001",
    "category": "feature",
    "description": "关注功能 - 主页已关注乐队再次点击应显示取消关注",
    "steps": [
      "打开主页",
      "点击已关注的乐队",
      "验证显示取消关注按钮",
      "返回主页验证状态一致"
    ],
    "test_file": "frontend/tests/test-follow-fixed.js",
    "passes": false
  },
  {
    "id": "B001",
    "category": "bugfix",
    "description": "Bug: 乐队详情页不显示已关注状态",
    "steps": [
      "进入乐队详情页",
      "验证已关注乐队显示已关注标识",
      "验证取消关注后正确更新"
    ],
    "test_file": "frontend/tests/test-follow-fixed.js",
    "passes": false
  }
]
```

## 5. Session 流程

```
1. 读取 feature_list.json
2. 选择第一个 passes=false 的项
3. 运行 init.sh 启动服务
4. Agent 实现功能/修复 bug
5. 运行 Playwright 测试验证
6. 测试通过 → passes=true，git commit
7. 测试失败 → 记录错误，继续下一个
8. 等待 3 秒，开始下一个 session
```

## 6. 迁移现有测试

从以下文件提取测试用例到 feature_list.json：

- `server/comprehensive-test.js`
- `server/test-all-apis.js`
- `Gojica2.0前端/integration-test.js`
- `Gojica2.0前端/test-*.js`

每个测试对应一个 feature item，标记 category 为 `feature` 或 `bugfix`。

## 7. 技术栈

| 组件 | 技术 |
|------|------|
| Agent SDK | claude-code-sdk (Python) |
| 测试框架 | Playwright (现有) |
| 后端 | Node.js + Express (现有) |
| 前端 | uni-app (现有) |
| 数据库 | MySQL (现有) |
| 运行环境 | Windows 11 + Bash |

## 8. 安全模型

开放模式，不做命令限制。理由：本地开发环境，风险可控。

如需开启白名单，修改 `security.py` 中的 `ALLOWED_COMMANDS`。

## 9. 启动方式

```bash
cd Gojica2.0/harness
pip install -r requirements.txt
export ANTHROPIC_API_KEY='your-key-here'
python autonomous_agent_demo.py --project-dir ../ --max-iterations 100
```

## 10. 预期效果

- Agent 7x24 运行，每次 session 实现/修复 1 个功能
- 所有进度写入 feature_list.json 和 git
- 随时可暂停（Ctrl+C），随时可恢复（重新运行命令）
- 200+ 功能分批完成，预计数周完成
