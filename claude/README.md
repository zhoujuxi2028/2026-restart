# Claude 使用能力提升资源库

这个文件夹包含所有与Claude Code使用相关的学习资源、模板和实践项目。

---

## 📚 目录结构

```
claude/
├── README.md                           # 本文件：资源索引
├── Claude-使用能力提升计划.md           # 8周主训练计划
├── 进度跟踪.md                         # 每日学习进度记录
│
├── prompt-templates/                   # Prompt模板库
│   ├── README.md                       # 模板使用说明
│   ├── code-review-template.md         # 代码审查模板
│   ├── debug-template.md               # Debug协作模板
│   ├── feature-development-template.md # 功能开发模板
│   └── learning-template.md            # 学习新技术模板
│
├── best-practices/                     # 最佳实践文档
│   ├── README.md                       # 最佳实践索引
│   ├── tools-usage.md                  # Claude Code工具使用
│   ├── prompt-engineering.md           # Prompt工程技巧
│   └── workflow-optimization.md        # 工作流优化
│
├── workflows/                          # 开发工作流
│   ├── README.md                       # 工作流说明
│   ├── tdd-workflow.md                 # TDD工作流
│   ├── debug-sop.md                    # Debug标准流程
│   └── code-review-workflow.md         # Code Review流程
│
└── projects/                           # 训练项目
    ├── README.md                       # 项目索引
    ├── week1-iteration-practice/       # Week 1练习项目
    ├── week2-prompt-practice/          # Week 2练习项目
    └── ...                             # 其他周的项目
```

---

## 🎯 快速开始

### 1️⃣ 开始训练
```bash
# 阅读主训练计划
cat claude/Claude-使用能力提升计划.md

# 或在编辑器中打开
code claude/Claude-使用能力提升计划.md
```

### 2️⃣ 记录进度
每天完成训练后，更新进度：
```bash
# 编辑进度跟踪文件
code claude/进度跟踪.md
```

### 3️⃣ 使用模板
开发时需要Prompt模板：
```bash
# 查看可用模板
ls claude/prompt-templates/

# 使用模板
cat claude/prompt-templates/code-review-template.md
```

---

## 📊 学习路线图

### Week 1-2: 基础强化
- **目标**: 改变对话模式，掌握Prompt技巧
- **产出**:
  - ✅ 完成5+迭代式对话练习
  - ✅ Prompt模板库（5个模板）
- **文件**: `prompt-templates/`

### Week 3-4: 功能解锁
- **目标**: 掌握Claude Code高级功能和开发工作流
- **产出**:
  - ✅ 工具使用最佳实践文档
  - ✅ TDD/Debug/Code Review工作流
- **文件**: `best-practices/`, `workflows/`

### Week 5-6: 实战项目
- **目标**: 完成2个企业级项目
- **产出**:
  - ✅ 完整的Cypress/FastAPI项目
  - ✅ Memory知识库
- **文件**: `projects/week5-6/`

### Week 7-8: 高级应用
- **目标**: 成为Power User，知识输出
- **产出**:
  - ✅ 技术分享材料
  - ✅ 使用经验总结
- **文件**: `projects/final-summary/`

---

## 📈 进度追踪

### 当前状态
- **开始日期**: 2026-02-13
- **当前周次**: Week 1
- **完成度**: 0% → 目标100%

### 快速链接
- [8周训练计划](./Claude-使用能力提升计划.md)
- [每日进度跟踪](./进度跟踪.md)
- [Prompt模板库](./prompt-templates/)
- [最佳实践](./best-practices/)
- [工作流文档](./workflows/)

---

## 🎓 核心资源

### 内部资源
- **主计划**: 8周详细训练计划，每天都有具体任务
- **模板库**: 可复用的Prompt模板，提升提问效率
- **最佳实践**: 总结的使用技巧和经验
- **工作流**: 标准化的开发流程（TDD/Debug/Review）

### 外部资源
- [Anthropic官方文档](https://docs.anthropic.com/)
- [Claude Code文档](https://docs.claude.ai/code) - 使用`/help`命令查看
- [Anthropic Discord社区](https://discord.gg/anthropic)
- [Reddit r/ClaudeAI](https://reddit.com/r/ClaudeAI)

---

## 💡 使用建议

### 日常工作流
1. **每天开始**: 查看当天训练任务
2. **实践练习**: 完成至少1个练习
3. **记录进度**: 更新进度跟踪文件
4. **总结反思**: 记录收获和改进点

### 遇到问题时
1. 先查看 `best-practices/` 相关文档
2. 参考 `prompt-templates/` 使用模板
3. 查看 `workflows/` 标准流程
4. 与Claude讨论并记录解决方案

### 知识沉淀
- 每个练习后，提取可复用的模板
- 每周总结，更新最佳实践文档
- 遇到好的解决方案，记录到Memory
- 完成项目后，写项目复盘

---

## 🏆 里程碑

### Week 2里程碑
- [ ] Prompt模板库完成（5+模板）
- [ ] 能进行10轮以上迭代对话
- [ ] Prompt首次命中率提升到60%

### Week 4里程碑
- [ ] 掌握所有Claude Code工具
- [ ] 建立3套标准工作流
- [ ] 能独立完成TDD开发

### Week 6里程碑
- [ ] 完成2个企业级项目
- [ ] Memory库有30+条记录
- [ ] 开发效率提升3倍

### Week 8里程碑
- [ ] 成为Claude Power User
- [ ] 能指导他人使用Claude
- [ ] 完成技术分享

---

## 📝 贡献指南

本文件夹是您个人的学习资源库，建议：

1. **及时更新**: 每天完成训练后更新相关文档
2. **真实记录**: 不美化数据，真实反映学习状态
3. **持续优化**: 发现更好的方法，及时更新文档
4. **知识沉淀**: 把临时笔记整理为可复用的模板

---

## 🚀 开始训练

**准备好了吗？从Day 1开始！**

```bash
# 打开主训练计划，开始Day 1任务
code claude/Claude-使用能力提升计划.md
```

**记住**: 不要只是读计划，要实际执行！

---

**版本**: v1.0
**创建日期**: 2026-02-13
**状态**: 训练进行中 🔥
