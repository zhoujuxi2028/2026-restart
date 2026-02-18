# 测试指南 / Testing Guide

本指南介绍如何测试修复后的 CI/CD 项目，包括 Cypress E2E 测试和 Newman API 测试。

---

## 目录 / Table of Contents

1. [快速验证 / Quick Verification](#快速验证--quick-verification)
2. [Newman API 测试 / Newman API Tests](#newman-api-测试--newman-api-tests)
3. [Cypress 测试 / Cypress Tests](#cypress-测试--cypress-tests)
4. [查看测试报告 / View Test Reports](#查看测试报告--view-test-reports)
5. [CI/CD 模拟 / CI/CD Simulation](#cicd-模拟--cicd-simulation)
6. [修复测试代码问题 / Fix Test Code Issues](#修复测试代码问题--fix-test-code-issues)
7. [故障排查 / Troubleshooting](#故障排查--troubleshooting)

---

## 快速验证 / Quick Verification

### 1. 确认环境配置 / Confirm Environment Setup

```bash
# 切换到项目目录
cd /home/michael/repos/2026-restart/jobs/BASF/interview-prep/day-04-cicd-devops/test-project

# 确认使用 Node.js 20 LTS
source ~/.bashrc && nvm use 20

# 检查版本
node --version    # 应显示: v20.20.0
npm --version     # 应显示: v10.8.2

# 确认依赖已安装
npm ls --depth=0
```

**预期输出：**
```
basf-cicd-test-project@1.0.0
├── cypress@13.17.0
├── eslint-plugin-cypress@2.15.2
├── eslint@8.57.1
├── newman-reporter-htmlextra@1.23.1
└── newman@6.2.2
```

### 2. 验证 Cypress 安装 / Verify Cypress Installation

```bash
npm run ci:verify
```

**预期输出：**
```
✔ Verified Cypress! /home/michael/.cache/Cypress/13.17.0/Cypress
```

### 3. 验证关键依赖 / Verify Key Dependencies

```bash
# 检查 string-width 是否正确安装
npm ls string-width

# 检查目录内容
ls -la node_modules/string-width/
```

**预期：** string-width 目录包含 package.json、index.js 等文件（不是空目录）。

---

## Newman API 测试 / Newman API Tests

Newman 是 Postman 的命令行运行器，用于自动化 API 测试。

### 运行所有 API 测试 / Run All API Tests

```bash
source ~/.bashrc && nvm use 20 && npm run test:newman
```

**测试内容：**
- ✅ 用户管理端点（Get All Users, Get User By ID）
- ✅ 帖子管理端点（CRUD 操作）
- ✅ 错误处理（404 测试）

**预期输出：**
```
newman

BASF CI/CD API Tests

❏ User Management
↳ Get All Users
  ✓  Status code is 200
  ✓  Response time is less than 2000ms
  ✓  Content-Type is application/json
  ✓  Response is an array with at least 1 user
  ✓  First user has required properties

❏ Post Management
↳ Create New Post
  ✓  Status code is 201 Created
  ✓  Response contains created post data

❏ Error Handling
↳ Test 404 Not Found
  ✓  Status code is 404

┌─────────────────────────┬────────────────────┬────────────────────┐
│                         │           executed │             failed │
├─────────────────────────┼────────────────────┼────────────────────┤
│              iterations │                  1 │                  0 │
│                requests │                  7 │                  0 │
│            test-scripts │                  7 │                  0 │
│              assertions │                 18 │                  0 │
└─────────────────────────┴────────────────────┴────────────────────┘
```

### 理解 Newman 测试结果 / Understanding Newman Results

| 指标 | 说明 |
|------|------|
| **iterations** | 测试集合运行次数 |
| **requests** | 发送的 HTTP 请求数量 |
| **test-scripts** | 执行的测试脚本数量 |
| **assertions** | 断言总数（18 个全部通过） |
| **total run duration** | 总运行时间 |
| **average response time** | 平均响应时间 |

### 查看 Newman HTML 报告 / View Newman HTML Report

```bash
# 报告位置
ls -lh newman/report.html

# 在浏览器中打开（需要图形界面）
firefox newman/report.html &
# 或
xdg-open newman/report.html
```

**报告内容：**
- 📊 详细的请求/响应信息
- 📈 性能指标图表
- ✅ 断言结果详情
- 🔍 失败请求的调试信息

---

## Cypress 测试 / Cypress Tests

### ⚠️ 当前状态 / Current Status

**重要提示：** 测试文件存在代码问题（`cy.log()` 在测试外部被调用），需要先修复才能正常运行。参见 [修复测试代码问题](#修复测试代码问题--fix-test-code-issues)。

### 查看测试文件 / View Test Files

```bash
# 查看 API 测试
cat cypress/e2e/01-api-tests.cy.js

# 查看 UI 测试
cat cypress/e2e/02-ui-tests.cy.js
```

### 运行 Cypress（交互式）/ Run Cypress (Interactive Mode)

```bash
source ~/.bashrc && nvm use 20 && npm run test:cypress:headed
```

**作用：**
- 打开 Cypress Test Runner 图形界面
- 可以选择运行单个或所有测试
- 实时查看测试执行过程
- 方便调试和开发

### 运行 Cypress（无头模式）/ Run Cypress (Headless Mode)

```bash
source ~/.bashrc && nvm use 20 && npm run test:cypress
```

**作用：**
- 在后台运行测试（无 GUI）
- 适合 CI/CD 管道
- 生成视频和截图
- 重试失败的测试（配置为 2 次重试）

### 查看 Cypress 生成的文件 / View Cypress Generated Files

```bash
# 查看视频
ls -lh cypress/videos/

# 查看截图
ls -lh cypress/screenshots/

# 播放视频（需要视频播放器）
vlc cypress/videos/01-api-tests.cy.js.mp4 &
```

---

## 查看测试报告 / View Test Reports

### Newman 报告 / Newman Reports

```bash
# HTML 报告（可视化，推荐）
ls -lh newman/report.html

# JUnit XML 报告（CI/CD 集成）
ls -lh newman/junit.xml
```

**JUnit XML 用途：**
- Jenkins/GitLab CI/GitHub Actions 可以解析
- 生成测试趋势图表
- 集成到 CI/CD 仪表板

### Cypress 报告 / Cypress Reports

```bash
# 视频记录（所有测试的执行过程）
ls cypress/videos/

# 失败截图（仅失败的测试）
ls cypress/screenshots/

# 控制台输出（终端显示）
npm run test:cypress 2>&1 | tee cypress-test-results.txt
```

---

## CI/CD 模拟 / CI/CD Simulation

模拟 CI/CD 管道中的测试流程。

### 完整 CI/CD 测试流程 / Full CI/CD Test Flow

```bash
#!/bin/bash
# 保存为 run-ci-tests.sh

set -e  # 遇到错误立即退出

echo "🚀 Starting CI/CD Test Pipeline..."

# 1. 环境准备
echo "📦 Step 1: Environment Setup"
source ~/.bashrc
nvm use 20
node --version
npm --version

# 2. 清理和安装
echo "🧹 Step 2: Clean Install"
rm -rf node_modules
npm ci  # 使用 lock file 精确安装

# 3. 验证工具
echo "✅ Step 3: Verify Tools"
npm run ci:verify

# 4. 运行 Newman 测试
echo "🧪 Step 4: Run Newman API Tests"
npm run test:newman

# 5. 运行 Cypress 测试（修复代码后）
# echo "🧪 Step 5: Run Cypress E2E Tests"
# npm run test:cypress

echo "✅ CI/CD Pipeline Completed Successfully!"
```

**执行：**
```bash
chmod +x run-ci-tests.sh
./run-ci-tests.sh
```

### GitHub Actions 示例 / GitHub Actions Example

查看项目 README 中的 GitHub Actions 配置：

```bash
cat README.md | grep -A 30 "GitHub Actions"
```

### 模拟不同环境 / Simulate Different Environments

```bash
# 开发环境（使用当前 node_modules）
npm run test:newman

# CI 环境（使用 npm ci 精确安装）
rm -rf node_modules && npm ci && npm run test:newman

# 生产环境模拟（Docker 容器中）
# 参见 README.md 中的 Docker 部分
```

---

## 修复测试代码问题 / Fix Test Code Issues

### 问题诊断 / Problem Diagnosis

当前 Cypress 测试失败的原因：
```
Error: Cannot call `cy.log()` outside a running test.
```

**原因：** 测试文件在 `it()` 或 `describe()` 块外部调用了 Cypress 命令。

### 检查测试文件 / Check Test Files

```bash
# 查找问题代码
grep -n "cy\." cypress/e2e/*.js | head -20
```

### 修复步骤 / Fix Steps

1. **打开测试文件：**
```bash
# 使用你喜欢的编辑器
vim cypress/e2e/01-api-tests.cy.js
# 或
code cypress/e2e/01-api-tests.cy.js
```

2. **检查结构：**
确保所有 Cypress 命令（`cy.*`）都在 `it()` 测试块内部：

**❌ 错误示例：**
```javascript
describe('API Tests', () => {
  cy.log('Starting tests')  // ❌ 在 describe 外部

  it('should work', () => {
    cy.visit('/')
  })
})
```

**✅ 正确示例：**
```javascript
describe('API Tests', () => {
  it('should work', () => {
    cy.log('Starting tests')  // ✅ 在 it 内部
    cy.visit('/')
  })
})
```

3. **验证修复：**
```bash
source ~/.bashrc && nvm use 20 && npm run test:cypress
```

### 需要创建新的测试文件？/ Need New Test Files?

如果原测试文件问题较多，可以参考 Day 1 的测试示例：

```bash
# 查看 Day 1 的示例
ls ../../day-01-cypress/

# 复制示例测试（如果存在）
cp ../../day-01-cypress/03-test-examples.cy.js cypress/e2e/03-examples.cy.js
```

---

## 故障排查 / Troubleshooting

### 问题 1: npm 命令找不到 / npm command not found

```bash
# 解决方案：确保 Node.js 已安装并在 PATH 中
source ~/.bashrc
nvm use 20
```

### 问题 2: Cypress 二进制文件未找到 / Cypress binary not found

```bash
# 重新安装 Cypress 二进制文件
npx cypress install
npm run ci:verify
```

### 问题 3: Newman 测试超时 / Newman tests timeout

```bash
# 检查网络连接（使用公共 API）
curl -I https://jsonplaceholder.typicode.com/users

# 增加超时时间
newman run postman/api-collection.json -e postman/environment.json --timeout-request 30000
```

### 问题 4: 权限错误 / Permission errors

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 问题 5: 端口已被占用 / Port already in use

```bash
# 查找占用端口的进程
lsof -i :3000  # 或其他端口

# 杀死进程
kill -9 <PID>
```

---

## 测试检查清单 / Testing Checklist

完成以下检查以确保所有测试功能正常：

### 环境验证 / Environment Verification
- [ ] Node.js 版本正确（v20.20.0）
- [ ] npm 版本正确（v10.8.2）
- [ ] 依赖已安装（374 packages）
- [ ] package-lock.json 存在

### Newman 测试 / Newman Tests
- [ ] Newman 命令可执行
- [ ] 所有 API 测试通过（18 assertions）
- [ ] HTML 报告生成成功
- [ ] JUnit XML 报告生成成功

### Cypress 测试 / Cypress Tests
- [ ] Cypress 验证成功
- [ ] 可以打开交互式模式
- [ ] 测试文件代码已修复
- [ ] 测试可以成功运行
- [ ] 视频和截图正确生成

### CI/CD 集成 / CI/CD Integration
- [ ] `npm ci` 工作正常
- [ ] 所有 npm 脚本可执行
- [ ] 无 MODULE_NOT_FOUND 错误
- [ ] 测试报告格式适合 CI/CD

---

## 面试演示建议 / Interview Demonstration Tips

### 演示流程 / Demonstration Flow

1. **环境展示（1 分钟）**
   ```bash
   node --version
   npm --version
   npm ls --depth=0
   ```

2. **Newman 测试演示（2 分钟）**
   ```bash
   npm run test:newman
   # 讲解 API 测试策略、断言、报告
   ```

3. **Cypress 演示（3 分钟）**
   ```bash
   npm run test:cypress:headed
   # 展示交互式模式、调试能力、重试机制
   ```

4. **CI/CD 集成说明（2 分钟）**
   - 展示 GitHub Actions 配置
   - 解释 `npm ci` vs `npm install`
   - 讨论测试报告集成

5. **问题处理讲解（2 分钟）**
   - 展示 TROUBLESHOOTING.md
   - 使用 STAR 格式讲述修复依赖问题的经历

### 关键讨论点 / Key Discussion Points

**技术深度：**
- 为什么选择 JSONPlaceholder 作为测试 API
- Cypress 的重试机制如何提高 CI/CD 稳定性
- Newman 的并发测试能力
- 测试报告如何集成到 CI/CD 仪表板

**最佳实践：**
- 测试隔离和数据管理
- 环境变量和配置管理
- 测试金字塔策略（API 测试 vs UI 测试比例）
- 失败重试策略（避免误报）

**CI/CD 视角：**
- 确定性构建（package-lock.json 的作用）
- 测试并行化提高速度
- 测试报告标准化（JUnit XML）
- Docker 容器化测试环境

---

## 下一步 / Next Steps

1. **修复 Cypress 测试代码**
   - 将 cy.log() 移到 it() 块内
   - 确保所有测试可以运行

2. **添加更多测试用例**
   - API 测试：添加认证、分页、错误边界
   - UI 测试：添加表单验证、导航、响应式

3. **配置 ESLint**
   - 创建 .eslintrc.js
   - 集成 Cypress 和 Newman 的 linting 规则

4. **Docker 集成**
   - 参考 README 中的 Docker 配置
   - 创建 Dockerfile 和 docker-compose.yml

5. **CI/CD 管道实践**
   - 设置 GitHub Actions
   - 配置测试报告发布
   - 添加测试覆盖率报告

---

## 相关文档 / Related Documentation

- [README.md](./README.md) - 项目概览和快速开始
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 依赖问题排查和面试讨论点
- [RUNNABLE-SETUP-GUIDE.md](./RUNNABLE-SETUP-GUIDE.md) - 详细设置指南
- [Cypress 官方文档](https://docs.cypress.io/)
- [Newman 官方文档](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)

---

## 获取帮助 / Getting Help

遇到问题时：

1. **检查 TROUBLESHOOTING.md** - 常见问题解决方案
2. **查看 npm 日志** - `~/.npm/_logs/`
3. **重新安装** - `rm -rf node_modules && npm ci`
4. **查阅官方文档** - Cypress/Newman 文档
5. **调试模式** - 使用 `DEBUG=* npm run test:newman`

---

**祝测试顺利！Good luck with testing! 🚀**
