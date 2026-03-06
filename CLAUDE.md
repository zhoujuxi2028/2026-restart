# CLAUDE.md

Claude Code guidance for this repository.

## Repository Overview

**类型**: 个人学习仓库（测试自动化、Python、安全、网络）
**语言**: 中文（简体）用于所有文档
**训练周期**: 2026-02-13 至 2026-04-10（8周）
**当前进度**: Week 3-4（Claude Code 高级功能 + 开发工作流）

## Directory Structure

```
2026-restart/
├── interview/          # Python 面试题, 测试面试题
│   └── python/         # 01-基础语法 至 13-正则表达式
├── testing/            # 测试自动化
│   ├── Cypress/        # E2E 测试框架
│   ├── playwright/     # Playwright 测试
│   └── Postman/        # API 测试
├── python/             # Python 项目
│   └── fastapi/        # FastAPI 学习（Week 1-4）
├── claude/             # Claude 使用能力提升（8周计划）
│   ├── prompt-templates/   # 5个 Prompt 模板
│   ├── best-practices/     # 最佳实践文档
│   └── workflows/          # TDD/Debug/Review 工作流
├── plans/              # 学习计划
│   ├── 2026-Q1.md      # 季度计划
│   └── 2026-03-06.md   # 每日计划
├── security/           # CISSP 安全学习
├── networking/         # NFV-SDN, Kubernetes
└── jobs/               # 求职材料
```

## Current Focus (2026-03)

- [ ] Python 08-文件IO 至 13-正则表达式
- [ ] Claude Code Week 3-4（Plan Mode, TDD 工作流）
- [ ] FastAPI Week 2-4

## Common Commands

```bash
# Python 面试学习
cd interview/python

# Cypress 测试
cd testing/Cypress && npx cypress open

# Playwright 测试
cd testing/playwright && npx playwright test

# FastAPI 开发
cd python/fastapi/01-学习资料/week-1/day1 && python main.py

# 查看今日计划
cat plans/2026-03-06.md
```

## Key Files

| 文件 | 用途 |
|------|------|
| `plans/2026-Q1.md` | 季度学习目标 |
| `plans/YYYY-MM-DD.md` | 每日学习计划 |
| `claude/进度跟踪.md` | Claude 训练进度 |
| `interview/python/README.md` | Python 面试进度 |

## Conventions

- 使用中文撰写学习材料和文档
- 完成里程碑后更新进度文件
- 遵循各项目现有的命名规范
- 每日学习后提交代码并更新进度

## Context for Claude

当在此仓库工作时：

1. **语言**: 所有回复和文档使用中文
2. **进度跟踪**: 完成任务后提醒更新 `plans/` 或 `进度跟踪.md`
3. **实践导向**: 建议动手练习，而非纯理论
4. **迭代对话**: 将大任务分解为 5+ 轮对话
5. **具体 Prompt**: 提供明确的目标、约束、上下文、预期输出

## Git Workflow

```bash
# 提交格式
git commit -m "docs(plans): add daily learning plan"
git commit -m "feat(python): complete 08-文件IO exercises"
git commit -m "fix(cypress): resolve login test flaky issue"

# 类型: docs, feat, fix, refactor, test, chore
```
