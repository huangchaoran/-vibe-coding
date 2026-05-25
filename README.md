# Gojica 2.0 - 音乐社交平台

基于 AI 全自动工作流持续开发的音乐社交平台。

## 项目概述

Gojica 是一个面向音乐爱好者的社交平台，支持：
- 多身份系统（粉丝/音乐人/商家/乐队）
- 活动发布与报名
- 乐队关注与互动
- 招募信息发布
- 商品交易
- 帖子与动态

## 技术栈

| 组件 | 技术 |
|------|------|
| 前端 | UniApp (Vue 3) |
| 后端 | Node.js + Express + Sequelize |
| 数据库 | MySQL 8.0 |
| 测试 | Playwright (E2E) + Jest |
| AI 工作流 | Claude Agent SDK + MiniMax |

## 项目结构

```
-vibe-coding/
├── Gojica2.0前端/          # UniApp 前端
│   ├── pages/              # 页面
│   ├── common/             # 公共组件
│   ├── tests/              # Playwright 测试
│   └── playwright.config.js
├── server/                 # Node.js 后端
│   ├── src/
│   │   ├── routes/        # API 路由
│   │   ├── models/        # Sequelize 模型
│   │   ├── services/      # 业务逻辑
│   │   └── middleware/    # 中间件
│   └── tests/             # 后端测试
├── harness/               # AI 全自动工作流
│   ├── autonomous_agent_demo.py  # 主入口
│   ├── agent.py           # Agent 会话逻辑
│   ├── client.py          # Claude SDK 客户端
│   ├── progress.py        # 进度管理
│   ├── prompts/           # AI 提示词
│   │   ├── app_spec.txt
│   │   ├── initializer_prompt.md
│   │   └── coding_prompt.md
│   └── security.py        # 安全策略
├── feature_list.json      # 功能清单（103项）
├── init.sh                # 环境启动脚本
├── claude-progress.txt    # 开发进度日志
└── README.md
```

## AI 全自动工作流

本项目采用 **24/7 AI 自动开发模式**，基于 [Anthropic 官方 autonomous-coding 框架](https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding)。

### 工作原理

```
┌─────────────────────────────────────────┐
│         Initializer Agent               │
│    (只运行一次，创建功能清单)            │
├─────────────────────────────────────────┤
│  • 分析现有代码和测试                   │
│  • 生成 feature_list.json (103项)       │
│  • 创建 init.sh 环境脚本                │
│  • 初始化 git 仓库                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Coding Agent                  │
│    (循环运行，持续开发)                  │
├─────────────────────────────────────────┤
│  • 读取进度和功能清单                   │
│  • 启动服务运行测试                     │
│  • 实现一个功能并验证                   │
│  • 更新 feature_list.json               │
│  • git commit 提交                     │
└─────────────────────────────────────────┘
                    ↓ (循环)
```

### 启动 AI Agent

```bash
cd harness

# 安装依赖
pip install -r requirements.txt

# 设置 API Key (MiniMax)
export ANTHROPIC_API_KEY='your-api-key'

# 运行 (自动进入Initializer模式)
python autonomous_agent_demo.py --project-dir ../
```

### 工作流程

1. **Session 1**: Initializer Agent 分析代码，创建 feature_list.json
2. **Session 2+**: Coding Agent 循环实现功能：
   - 读取 feature_list.json
   - 选择第一个 `passes: false` 的功能
   - 运行 `./init.sh` 启动服务
   - 实现功能 + Playwright 测试
   - 标记 `passes: true`
   - git commit

### feature_list.json 格式

```json
{
  "id": "F001",
  "category": "auth",
  "description": "开发模式登录-用户可以使用fan身份进行登录",
  "steps": [
    "Step 1: Navigate to login page",
    "Step 2: Enter test credentials",
    "Step 3: Click login button",
    "Step 4: Verify redirect to home"
  ],
  "test_file": "Gojica2.0前端/test-follow-fixed.js",
  "test_id": "dev-login",
  "passes": false
}
```

## 功能清单 (103项)

| 分类 | 数量 | 说明 |
|------|------|------|
| Auth | 6 | 登录、登出、Token刷新 |
| Home | 5 | 主页数据、banner |
| User | 12 | 用户资料、身份管理 |
| Band | 10 | 乐队 CRUD、关注 |
| Activity | 6 | 活动管理、报名 |
| Post | 8 | 帖子、点赞、评论 |
| Product | 5 | 商品管理 |
| Recruitment | 6 | 招募信息 |
| Room | 4 | 场地管理 |
| Search | 1 | 搜索功能 |
| Upload | 3 | 文件上传 |
| Frontend | 18 | 前端 UI 测试 |
| BugFix | 4 | 已知 Bug 修复 |

## 已知待修复问题

- **B001**: 关注功能状态不同步（主页显示已关注，详情页不显示）
- **B002**: 乐队详情页不显示已关注状态
- **B003**: 取消关注逻辑异常
- **B004**: 活动报名状态不同步

## 启动开发环境

```bash
# 方式1: 使用 init.sh (推荐)
./init.sh

# 方式2: 手动启动
# 终端1: 后端
cd server && npm run dev

# 终端2: 前端
cd Gojica2.0前端 && npm run dev
```

服务地址：
- 后端: http://localhost:3000
- 前端: http://localhost:5173

## 运行测试

```bash
# 后端测试
cd server
node comprehensive-test.js

# 前端 E2E 测试 (Playwright)
cd Gojica2.0前端
npx playwright test
```

## API 接口

主要接口前缀: `/api/v1/`

| 模块 | 接口数 |
|------|--------|
| Auth | 4 |
| User | 12 |
| Band | 10 |
| Activity | 6 |
| Post | 8 |
| Product | 5 |
| Recruitment | 6 |

详见 `server/API_DOCUMENTATION.md`

## License

Private - All Rights Reserved
