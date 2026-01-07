# Cypress 学习进度表

开始日期：2026-01-07

## 学习计划概览

- **总时长**：17-23 天（每天 1-2 小时）
- **目标**：掌握 Cypress E2E 测试框架，能够独立编写测试用例

---

## 第一阶段：基础入门（2-3天）

**目标**：理解 Cypress 是什么，完成基本环境搭建

### Day 1
- [ ] 了解 Cypress 的特点和优势
  - [ ] 阅读官方文档介绍部分
  - [ ] 了解 Cypress 与 Selenium、Playwright 的区别
  - [ ] 理解 Cypress 的适用场景和限制
- [ ] 安装 Cypress
  - [ ] 创建测试项目文件夹
  - [ ] 使用 `npm init -y` 初始化项目
  - [ ] 运行 `npm install cypress --save-dev`

**学习笔记**：


---

### Day 2
- [ ] 配置 Cypress
  - [ ] 运行 `npx cypress open` 查看 Cypress Test Runner
  - [ ] 了解项目结构（cypress/、cypress.config.js）
  - [ ] 运行官方示例测试
- [ ] 编写第一个测试
  - [ ] 创建 `cypress/e2e/first-test.cy.js`
  - [ ] 使用 `describe` 和 `it` 组织测试
  - [ ] 测试访问一个网站（如 https://example.cypress.io）

**学习笔记**：


---

### Day 3
- [ ] 基本命令练习
  - [ ] `cy.visit()` - 访问不同页面
  - [ ] `cy.get()` - 获取元素
  - [ ] `.click()` - 点击操作
  - [ ] `.should()` - 简单断言
- [ ] 复习和总结第一阶段

**学习笔记**：


---

## 第二阶段：核心功能（4-5天）

**目标**：掌握常用命令和测试编写技巧

### Day 4
- [ ] 选择器和查询
  - [ ] `cy.get()` - CSS 选择器
  - [ ] `cy.contains()` - 文本查询
  - [ ] `cy.find()` - 子元素查找
  - [ ] 使用 data-cy、data-test 属性

**学习笔记**：


---

### Day 5
- [ ] 过滤和遍历
  - [ ] `.first()`, `.last()`, `.eq()` - 索引选择
  - [ ] `.filter()` - 条件过滤
  - [ ] `.parent()`, `.children()` - DOM 遍历
  - [ ] `.next()`, `.prev()` - 兄弟元素

**学习笔记**：


---

### Day 6
- [ ] 常用交互命令
  - [ ] `.type()` - 输入文本
  - [ ] `.clear()` - 清除输入
  - [ ] `.select()` - 下拉选择
  - [ ] `.check()`, `.uncheck()` - 复选框/单选框

**学习笔记**：


---

### Day 7
- [ ] 断言（Assertions）
  - [ ] `should('be.visible')` - 可见性断言
  - [ ] `should('have.text', '...')` - 文本断言
  - [ ] `should('have.value', '...')` - 值断言
  - [ ] `should('exist')` / `should('not.exist')` - 存在性断言
  - [ ] 链式断言

**学习笔记**：


---

### Day 8
- [ ] Hooks 和测试组织
  - [ ] `before()` - 所有测试前执行
  - [ ] `beforeEach()` - 每个测试前执行
  - [ ] `after()` / `afterEach()`
  - [ ] 使用 `.only()` 和 `.skip()`
- [ ] 复习和总结第二阶段

**学习笔记**：


---

## 第三阶段：进阶技能（5-7天）

**目标**：处理复杂场景和异步操作

### Day 9
- [ ] 网络请求基础
  - [ ] `cy.request()` - 发送 HTTP 请求
  - [ ] 测试 API 端点
  - [ ] 验证响应状态码和数据

**学习笔记**：


---

### Day 10
- [ ] 网络拦截
  - [ ] `cy.intercept()` - 拦截网络请求
  - [ ] 模拟 API 响应
  - [ ] 等待特定请求完成

**学习笔记**：


---

### Day 11
- [ ] 等待和重试机制
  - [ ] 理解 Cypress 的自动等待
  - [ ] `cy.wait()` 的正确使用场景
  - [ ] 设置自定义超时 `{ timeout: 10000 }`
  - [ ] 处理加载和动画

**学习笔记**：


---

### Day 12
- [ ] Fixtures 和测试数据
  - [ ] 创建 `cypress/fixtures` 中的 JSON 文件
  - [ ] `cy.fixture()` 加载数据
  - [ ] 在测试中使用 fixture 数据
  - [ ] 数据驱动测试

**学习笔记**：


---

### Day 13
- [ ] 自定义命令（Custom Commands）
  - [ ] 在 `cypress/support/commands.js` 中创建命令
  - [ ] 创建 `cy.login()` 自定义命令
  - [ ] 创建常用操作的封装
  - [ ] 使用 TypeScript 类型定义（可选）

**学习笔记**：


---

### Day 14-15
- [ ] 综合练习项目
  - [ ] 选择一个练习网站（如 Todo MVC）
  - [ ] 编写完整的测试套件
  - [ ] 应用所学的所有技能
- [ ] 复习和总结第三阶段

**学习笔记**：


---

## 第四阶段：高级特性（3-4天）

**目标**：掌握高级功能和最佳实践

### Day 16
- [ ] 插件系统
  - [ ] 了解 Cypress 插件生态
  - [ ] 安装常用插件（如 cypress-file-upload）
  - [ ] 在 `cypress.config.js` 中配置插件
  - [ ] 环境变量管理

**学习笔记**：


---

### Day 17
- [ ] 视觉测试和调试
  - [ ] `cy.screenshot()` - 截图功能
  - [ ] 视频录制配置
  - [ ] `.debug()` 和 `.pause()` 命令
  - [ ] 使用 Chrome DevTools
  - [ ] Time Travel 调试

**学习笔记**：


---

### Day 18
- [ ] Page Object Model (POM)
  - [ ] 理解 POM 设计模式
  - [ ] 创建页面对象类
  - [ ] 重构现有测试使用 POM
  - [ ] 代码组织最佳实践

**学习笔记**：


---

### Day 19
- [ ] 高级配置
  - [ ] 多环境配置（dev、staging、prod）
  - [ ] viewport 设置
  - [ ] baseUrl 配置
  - [ ] 重试策略配置
- [ ] 复习和总结第四阶段

**学习笔记**：


---

## 第五阶段：实战和 CI/CD（3-4天）

**目标**：实际项目应用和持续集成

### Day 20
- [ ] 测试最佳实践
  - [ ] 选择器优先级（data-cy > data-test > id > class）
  - [ ] 测试独立性原则
  - [ ] 避免使用 `cy.wait(固定时间)`
  - [ ] 测试用例命名规范

**学习笔记**：


---

### Day 21
- [ ] CI/CD 集成准备
  - [ ] 了解无头模式运行：`npx cypress run`
  - [ ] 配置 `package.json` scripts
  - [ ] 生成测试报告
  - [ ] 并行测试执行

**学习笔记**：


---

### Day 22
- [ ] GitHub Actions 集成
  - [ ] 创建 `.github/workflows/cypress.yml`
  - [ ] 配置 CI 环境
  - [ ] 查看测试结果和 artifacts
  - [ ] Docker 容器中运行（可选）

**学习笔记**：


---

### Day 23
- [ ] 最终项目
  - [ ] 为真实项目编写完整测试套件
  - [ ] 应用所有学到的技能
  - [ ] 设置 CI/CD 流程
  - [ ] 文档编写

**学习笔记**：


---

## 学习资源

### 官方资源
- [Cypress 官方文档](https://docs.cypress.io)
- [Cypress 示例网站](https://example.cypress.io)
- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app)

### 练习网站
- [TodoMVC](https://todomvc.com/)
- [Sauce Demo](https://www.saucedemo.com/)
- [The Internet - Herokuapp](https://the-internet.herokuapp.com/)

### 社区资源
- [Cypress GitHub](https://github.com/cypress-io/cypress)
- [Cypress 示例仓库](https://github.com/cypress-io/cypress-example-recipes)

---

## 学习总结

### 完成后的技能清单
- [ ] 能够搭建 Cypress 测试环境
- [ ] 能够编写基本的 E2E 测试
- [ ] 掌握常用的 Cypress 命令和断言
- [ ] 能够处理网络请求和异步操作
- [ ] 能够使用 POM 组织测试代码
- [ ] 能够集成 CI/CD 流程
- [ ] 能够为实际项目编写测试

### 下一步学习方向
- [ ] 深入学习 TypeScript 在 Cypress 中的应用
- [ ] 探索视觉回归测试
- [ ] 学习性能测试
- [ ] 研究组件测试（Cypress Component Testing）

---

## 每日打卡记录

使用 ✅ 标记完成的日期：

- Day 1: ⬜
- Day 2: ⬜
- Day 3: ⬜
- Day 4: ⬜
- Day 5: ⬜
- Day 6: ⬜
- Day 7: ⬜
- Day 8: ⬜
- Day 9: ⬜
- Day 10: ⬜
- Day 11: ⬜
- Day 12: ⬜
- Day 13: ⬜
- Day 14-15: ⬜
- Day 16: ⬜
- Day 17: ⬜
- Day 18: ⬜
- Day 19: ⬜
- Day 20: ⬜
- Day 21: ⬜
- Day 22: ⬜
- Day 23: ⬜

---

**加油！每天坚持学习，你一定能掌握 Cypress！**
