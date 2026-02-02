# 🚀 第三阶段：高级功能 (Day 9-14)

## 📖 学习目标

- 掌握网络拦截和 API 测试
- 学习处理异步操作和动态内容
- 精通文件操作和上传下载
- 学习数据驱动测试和自定义命令
- 掌握 fixtures 和数据管理
- 学习跨浏览器测试和 CI/CD 集成

## 📝 测试文件

### Day 9: 网络拦截和 API 测试
**文件**: `day9-network-intercept.cy.js`

**学习内容**:
- 🌐 `cy.intercept()` - 网络拦截
- 📡 API 响应模拟和修改
- 🔗 请求和响应验证
- 🎯 路由匹配策略
- 📊 网络流量监控

**关键概念**:
- Stubbing vs Spying
- 动态响应生成
- 请求头和状态码验证
- 网络延迟模拟

---

### Day 10: 异步操作处理
**文件**: `day10-async-operations.cy.js`

**学习内容**:
- ⏳ `cy.wait()` - 等待策略
- 🔄 动态内容加载处理
- 📈 Progress bars 和 Loading states
- 🎪 复杂动画等待
- ⚡ 性能测试基础

**高级技巧**:
- 条件性等待
- 自定义等待条件
- 超时配置
- 错误重试机制

---

### Day 11: 文件操作
**文件**: `day11-file-operations.cy.js`

**学习内容**:
- 📁 `cy.readFile()` - 读取文件
- ✍️ `cy.writeFile()` - 写入文件
- 📤 文件上传测试
- 📥 文件下载验证
- 🖼️ 图片和多媒体处理

**文件类型**:
- JSON 数据文件
- CSV/Excel 文件
- 图片文件
- PDF 文档
- 压缩包

---

### Day 12: 自定义命令和插件
**文件**: `day12-custom-commands.cy.js`

**学习内容**:
- 🛠️ `Cypress.Commands.add()` - 自定义命令
- 🔧 命令参数和选项
- 📚 命令组合和复用
- 🎨 Page Object 模式
- 🔌 第三方插件集成

**实用命令示例**:
- 登录命令封装
- 表单填写命令
- 断言组合命令
- 数据库操作命令

---

### Day 13: 数据驱动测试
**文件**: `day13-data-driven.cy.js`

**学习内容**:
- 📋 Fixtures 数据管理
- 🔄 参数化测试
- 📊 测试数据生成
- 🎲 随机数据使用
- 📈 批量测试执行

**数据源**:
- JSON fixtures
- CSV 数据导入
- API 数据获取
- 环境变量使用

---

### Day 14: 性能和监控
**文件**: `day14-performance-monitoring.cy.js`

**学习内容**:
- 📊 性能指标收集
- ⚡ 页面加载时间
- 🎯 Core Web Vitals
- 🔍 资源加载监控
- 📈 性能回归检测

**监控指标**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

---

## 🎯 本阶段重点

### 1. 网络拦截示例
```javascript
// 拦截 API 请求
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers')
cy.visit('/users')
cy.wait('@getUsers')

// 修改响应
cy.intercept('POST', '/api/login', (req) => {
  req.reply({ statusCode: 200, body: { token: 'fake-token' } })
}).as('login')
```

### 2. 异步等待策略
```javascript
// 等待元素出现
cy.get('.loading').should('not.exist')
cy.get('.content').should('be.visible')

// 等待网络请求
cy.intercept('GET', '/api/data').as('getData')
cy.get('[data-cy="refresh"]').click()
cy.wait('@getData')

// 自定义等待条件
cy.get('.progress-bar').should(($el) => {
  expect($el.attr('data-progress')).to.equal('100')
})
```

### 3. 文件操作
```javascript
// 读取 JSON 文件
cy.readFile('cypress/fixtures/users.json').then((users) => {
  cy.get('[data-cy="user-count"]').should('contain', users.length)
})

// 文件上传
cy.get('input[type="file"]').selectFile('cypress/fixtures/image.png')

// 验证下载
cy.get('[data-cy="download"]').click()
cy.readFile('cypress/downloads/report.pdf').should('exist')
```

### 4. 自定义命令
```javascript
// 在 cypress/support/commands.js 中定义
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('[data-cy="username"]').type(username)
    cy.get('[data-cy="password"]').type(password)
    cy.get('[data-cy="submit"]').click()
    cy.url().should('contain', '/dashboard')
  })
})

// 在测试中使用
cy.login('admin', 'password123')
```

### 5. 数据驱动测试
```javascript
// 使用 fixtures
const testData = require('../../fixtures/test-scenarios.json')

testData.forEach((scenario) => {
  it(`测试场景: ${scenario.name}`, () => {
    cy.visit(scenario.url)
    cy.get(scenario.selector).should(scenario.assertion, scenario.expected)
  })
})
```

---

## 🛠️ 高级配置

### cypress.config.js 优化
```javascript
module.exports = {
  e2e: {
    // 网络拦截配置
    experimentalInterceptChainingEnabled: true,

    // 性能监控
    experimentalMemoryManagement: true,

    // 文件监听
    watchForFileChanges: true,

    // 视频和截图
    video: true,
    screenshotOnRunFailure: true,

    // 超时配置
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 30000,

    // 重试配置
    retries: {
      runMode: 2,
      openMode: 0
    }
  }
}
```

---

## 📊 学习进度检查

完成本阶段后，你应该能够：

- [ ] 熟练拦截和模拟网络请求
- [ ] 处理各种异步操作和等待
- [ ] 执行文件上传下载测试
- [ ] 创建和使用自定义命令
- [ ] 实现数据驱动测试
- [ ] 监控页面性能指标
- [ ] 集成第三方插件和工具
- [ ] 优化测试执行性能

---

## 💡 实战技巧

### 错误处理和调试
```javascript
// 全局错误处理
Cypress.on('uncaught:exception', (err, runnable) => {
  // 返回 false 阻止 Cypress 因未捕获的异常而失败
  if (err.message.includes('Script error')) {
    return false
  }
})

// 条件性测试
cy.get('body').then(($body) => {
  if ($body.find('[data-cy="modal"]').length > 0) {
    cy.get('[data-cy="close-modal"]').click()
  }
})
```

### 性能优化技巧
```javascript
// 使用 session 缓存登录状态
cy.session('user-session', () => {
  cy.login('user', 'password')
})

// 并行化测试
// cypress.config.js
module.exports = {
  e2e: {
    experimentalRunAllSpecs: true
  }
}
```

### 数据管理最佳实践
```javascript
// 测试前清理数据
beforeEach(() => {
  cy.exec('npm run db:reset')
  cy.exec('npm run db:seed')
})

// 使用环境变量
const apiUrl = Cypress.env('API_URL') || 'http://localhost:3000'
```

---

## 🚀 进阶路线图

### 下一步学习方向：
1. **第四阶段 (Expert)**:
   - 测试架构设计
   - CI/CD 深度集成
   - 跨浏览器测试
   - 视觉回归测试

2. **实际项目应用**:
   - 真实项目测试覆盖
   - 团队协作流程
   - 测试报告和指标

3. **生态系统扩展**:
   - Percy 视觉测试
   - Lighthouse 性能测试
   - Cucumber BDD 测试

---

**你已经进入 Cypress 的高级领域！继续探索更深层次的测试技巧！** 🎉