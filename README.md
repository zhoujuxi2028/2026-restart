# 2026 技术学习仓库

个人技术学习与职业发展仓库。

**年度目标**: 拿下 1 个高级证书 (优先级: CCIE > 网络架构师 > 系统分析师)

## 每日学习安排

| 时段 | 内容 | 时长 |
|------|------|------|
| 🔧 Claude 技巧 | Claude 使用能力提升 | 30 min |
| 📚 基本功 | Python / Java / 设计模式 | 60 min |
| 🌱 扩展知识 | 新技术探索 | 30 min |

---

## 2026 年度 WBS

### Q1 (1-3月) - 基础巩固

| 项目 | 模块 | 目标 | 状态 |
|------|------|------|------|
| Python Interview | 基础 (01-04) | 100题 | ✅ |
| Python Interview | 进阶 (05-09) | 100题 | 🔄 60% |
| Python Interview | 专家 (10-13) | 70题 | ⏳ |
| Cypress | 全部 | 完成 | ✅ |
| FastAPI | Week 1-4 | 基础 | 🔄 40% |

### Q2 (4-6月) - 进阶提升

| 项目 | 模块 | 目标 | 状态 |
|------|------|------|------|
| Python Interview | 实战 (14-16) | 30题 | ⏳ |
| Playwright | 全部 | 掌握 | ⏳ |
| CISSP | Domain 1-4 | 备考 | ⏳ |

---

## 目录结构

```
interview/   # 面试题（Python 300题、测试面试题）
testing/     # Cypress, Playwright, Postman
python/      # FastAPI
security/    # CISSP
networking/  # NFV-SDN, Kubernetes
jobs/        # 求职资料
docs/        # 参考文档
claude/      # Claude 使用能力提升
plans/       # 学习计划（季度计划、每日计划归档）
```

## 学习进度

| 项目 | 状态 | 进度 | 详情 |
|------|------|------|------|
| Python Interview | 进行中 | 60% | [查看](./interview/python/LEARNING_PROGRESS.md) |
| Testing Interview | 未开始 | 0% | [查看](./interview/testing/README.md) |
| Cypress | 已完成 | 100% | [查看](./testing/Cypress/LEARNING_PROGRESS.md) |
| FastAPI | 进行中 | 40% | [查看](./python/fastapi/LEARNING_PROGRESS.md) |
| Playwright | 未开始 | 0% | [查看](./testing/playwright/LEARNING_PROGRESS.md) |
| Postman | 未开始 | 0% | [查看](./testing/postman/LEARNING_PROGRESS.md) |
| CISSP | 未开始 | 0% | [查看](./security/CISSP/LEARNING_PROGRESS.md) |
| NFV-SDN | 未开始 | 0% | [查看](./networking/NFV-SDN/LEARNING_PROGRESS.md) |
| Kubernetes | 未开始 | 0% | [查看](./networking/kubernetes/README.md) |
| Claude 能力提升 | 进行中 | - | [查看](./claude/README.md) |

## 快速开始

```bash
# 面试题
cd interview/python    # Python 面试题
cd interview/testing   # 测试面试题

# 测试工具
cd testing/Cypress && npx cypress open
cd testing/playwright && npx playwright test

# Python
cd python/fastapi      # FastAPI 学习

# 其他
cd security/CISSP      # CISSP 认证
cd networking/NFV-SDN  # SDN/NFV 学习
cd networking/kubernetes  # Kubernetes 学习
```

## 说明

- 每个项目有 `LEARNING_PROGRESS.md` 跟踪进度
- 每个项目有 `README.md` 说明详情
- 文档语言：中文
