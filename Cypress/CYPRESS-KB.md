# Cypress 学习知识库 (Knowledge Base)

> 系统化整理Cypress学习过程中的核心概念、最佳实践和问题解答

## 📚 目录结构

- [测试执行控制](#测试执行控制)
- [CSS选择器深度解析](#css选择器深度解析)
- [动态元素处理](#动态元素处理)
- [代码模式与最佳实践](#代码模式与最佳实践)
- [调试技巧](#调试技巧)
- [常见问题解答](#常见问题解答)

---

## 🎯 测试执行控制

### 单独执行测试用例的方法

#### 方法1: `.only()` 方法 (推荐)
```javascript
it.only('测试用例名称', () => {
  // 只有这个测试会执行
})

describe.only('测试组名称', () => {
  // 只有这个测试组会执行
})
```

#### 方法2: 命令行指定文件
```bash
# 执行特定文件
npx cypress run --spec "cypress/e2e/specific-test.cy.js"

# 执行特定测试（使用grep）
npx cypress run --spec "cypress/e2e/*.cy.js" --env grep="测试用例名称"
```

#### 方法3: 图形界面选择
```bash
npx cypress open --e2e
```

**使用场景对比:**
- `.only()`: 开发调试时快速隔离测试
- 命令行: CI/CD或批量执行特定测试
- 图形界面: 学习和详细调试

---

## 🔍 CSS选择器深度解析

### 选择器类型完整参考

#### 1. 基本选择器 (Basic Selectors)

**类型选择器 (Type Selector)**
```javascript
cy.get('input')    // 选择所有 input 元素
cy.get('div')      // 选择所有 div 元素
cy.get('button')   // 选择所有 button 元素
```

**类选择器 (Class Selector)**
```javascript
cy.get('.button')       // 选择所有 class="button" 的元素
cy.get('.nav-item')     // 选择所有 class="nav-item" 的元素
cy.get('.action-email') // 选择所有 class="action-email" 的元素
```

**ID选择器 (ID Selector)**
```javascript
cy.get('#header')     // 选择 id="header" 的元素
cy.get('#email1')     // 选择 id="email1" 的元素
cy.get('#main-form')  // 选择 id="main-form" 的元素
```

**通配符选择器 (Universal Selector)**
```javascript
cy.get('*')   // 选择所有元素（谨慎使用）
```

#### 2. 属性选择器 (Attribute Selectors)

```javascript
// 存在属性
cy.get('[type]')                    // 有 type 属性的元素
cy.get('[data-cy]')                 // 有 data-cy 属性的元素

// 精确匹配
cy.get('[type="radio"]')            // type 属性值为 "radio"
cy.get('[data-cy="submit"]')        // data-cy 属性值为 "submit"

// 包含词汇
cy.get('[class~="nav"]')            // class 属性包含 "nav" 词

// 前缀匹配
cy.get('[href^="https"]')           // href 属性以 "https" 开头
cy.get('[class^="btn"]')            // class 属性以 "btn" 开头

// 后缀匹配
cy.get('[href$=".pdf"]')            // href 属性以 ".pdf" 结尾
cy.get('[src$=".jpg"]')             // src 属性以 ".jpg" 结尾

// 包含子串
cy.get('[title*="test"]')           // title 属性包含 "test"
cy.get('[class*="button"]')         // class 属性包含 "button"
```

#### 3. 伪类选择器 (Pseudo-class Selectors)

```javascript
// 交互状态
cy.get('button:hover')              // 鼠标悬停状态
cy.get('input:focus')               // 获得焦点状态
cy.get('button:active')             // 激活状态

// 元素状态
cy.get('input:disabled')            // 禁用状态
cy.get('input:enabled')             // 启用状态
cy.get('input:checked')             // 选中状态（checkbox/radio）
cy.get('input:required')            // 必填状态
cy.get('input:optional')            // 非必填状态

// 位置选择
cy.get('li:first-child')            // 第一个子元素
cy.get('li:last-child')             // 最后一个子元素
cy.get('li:nth-child(2)')           // 第2个子元素
cy.get('li:nth-child(2n)')          // 偶数位置的子元素
cy.get('li:nth-child(odd)')         // 奇数位置的子元素

// 排除选择器
cy.get('input:not(.action-email)')  // 排除有 action-email 类的input
cy.get('button:not([disabled])')    // 排除禁用的button
```

#### 4. 伪元素选择器 (Pseudo-element Selectors)

```javascript
// 注意：在Cypress中较少直接使用，主要用于CSS样式验证
cy.get('p').should('have.css', 'content') // 间接验证 ::before/::after
```

#### 5. 组合选择器 (Combinator Selectors)

**后代选择器 (Descendant Combinator)**
```javascript
cy.get('div p')                     // div 内的所有 p 元素（任意层级）
cy.get('.container input')          // container 类内的所有 input
cy.get('form .form-control')        // form 内所有 form-control 类的元素
```

**子选择器 (Child Combinator)**
```javascript
cy.get('div > p')                   // div 的直接子元素 p
cy.get('.form > input')             // form 类的直接子 input
cy.get('ul > li')                   // ul 的直接子 li
```

**相邻兄弟选择器 (Adjacent Sibling)**
```javascript
cy.get('h1 + p')                    // 紧跟在 h1 后的第一个 p 元素
cy.get('label + input')             // 紧跟在 label 后的 input
```

**通用兄弟选择器 (General Sibling)**
```javascript
cy.get('h1 ~ p')                    // h1 后面所有的同级 p 元素
cy.get('.title ~ .content')         // title 类后面所有同级 content 类元素
```

#### 6. 复合选择器 (Compound Selectors)

**多条件组合（无空格连接）**
```javascript
// 类型 + 属性 + 伪类
cy.get('input[type="radio"]:not([disabled])')      // 未禁用的radio按钮
cy.get('input[type="text"].form-control')          // 有form-control类的文本框
cy.get('button.primary:enabled')                   // 启用的主要按钮

// 类型 + 类 + ID
cy.get('div.container#main')                       // id为main的container div
cy.get('input.email#user-email')                   // id为user-email的email输入框

// 多个类组合
cy.get('.btn.btn-primary.btn-large')               // 同时有三个类的元素

// 多个属性组合
cy.get('input[type="text"][required][maxlength="50"]') // 多属性限制的输入框
```

### 选择器优先级 (从高到低)

1. **内联样式** (style属性) - 优先级: 1000
2. **ID选择器** (#id) - 优先级: 100
3. **类选择器、属性选择器、伪类** (.class, [attr], :hover) - 优先级: 10
4. **类型选择器、伪元素** (div, ::before) - 优先级: 1
5. **通配符选择器** (*) - 优先级: 0

### 选择器性能考虑

**高性能选择器（推荐）**
```javascript
cy.get('#unique-id')                // ID选择器 - 最快
cy.get('[data-cy="element"]')       // 专用测试属性 - 推荐
cy.get('.specific-class')           // 单一类选择器 - 较快
```

**需要优化的选择器**
```javascript
cy.get('div div div p')             // 过深的嵌套 - 避免
cy.get('*[class*="something"]')     // 通配符组合 - 慢
cy.get('p:nth-child(n+3):nth-child(-n+8)')  // 复杂伪类 - 复杂
```

### 实际案例：为什么Email和Password输入框不被选中？

**问题背景:**
```javascript
const textInputs = $body.find('input[type="text"]:not(.action-email)')
```

**HTML结构分析:**
```html
<!-- Email输入框 -->
<input type="email" class="form-control action-email" id="email1">

<!-- Password输入框 -->
<input type="password" class="form-control action-focus" id="password1">

<!-- 普通Text输入框 -->
<input type="text" class="form-control action-focus">
```

**排除原因:**
1. **Email输入框**: `type="email"` ≠ `type="text"` + 有 `action-email` 类
2. **Password输入框**: `type="password"` ≠ `type="text"`
3. **设计意图**: 避免重复操作已处理的元素

**改进方案:**
```javascript
// 包含多种输入框类型
const allInputs = $body.find('input[type="text"], input[type="email"], input[type="password"]')

// 条件式处理
const inputs = $body.find('input:not(.action-email)')
```

---

## 🔧 动态元素处理

### cy.wrap() 的作用与用法

#### 基本概念
- **作用**: 将jQuery对象转换为Cypress命令链
- **场景**: 需要对DOM查询结果进行Cypress操作时

#### 代码模式
```javascript
cy.get('body').then(($body) => {
  // jQuery查询
  const elements = $body.find('selector')

  // 条件判断
  if (elements.length > 0) {
    // 转换为Cypress命令
    cy.wrap(elements).first()
      .clear()
      .type('content')
      .should('have.value', 'content')
  } else {
    cy.log('未找到匹配元素')
  }
})
```

### 条件判断模式

#### 健壮性设计原则
1. **存在性检查**: 验证元素是否存在
2. **可见性检查**: 确保元素可交互
3. **状态检查**: 验证元素是否可用（非disabled）
4. **备用方案**: 提供alternative selector

#### 实用代码模板
```javascript
cy.get('body').then(($body) => {
  // 主要选择器
  const primaryElements = $body.find('.primary-selector')

  if (primaryElements.length > 0) {
    // 执行主要逻辑
    cy.wrap(primaryElements).first().click()
  } else {
    // 备用选择器
    const fallbackElements = $body.find('.fallback-selector')
    if (fallbackElements.length > 0) {
      cy.wrap(fallbackElements).first().click()
    } else {
      cy.log('警告: 未找到可操作的元素')
    }
  }
})
```

---

## 📋 代码模式与最佳实践

### 多步骤操作模式

#### 标准结构
```javascript
it('多步骤操作示例', () => {
  // 步骤1: 页面访问
  cy.visit('url')
  cy.log('✅ 页面访问完成')

  // 步骤2: 元素操作
  cy.get('selector')
    .clear()
    .type('value')
    .should('have.value', 'value')
  cy.log('✅ 元素操作完成')

  // 步骤3: 动态处理
  cy.get('body').then(($body) => {
    // 动态逻辑
  })
})
```

### 命令链设计原则

1. **链式调用**: 保持操作的连续性
2. **断言验证**: 每个关键步骤后进行验证
3. **日志记录**: 使用 `cy.log()` 记录关键步骤
4. **错误处理**: 提供备用方案和错误信息

---

## 🐛 调试技巧

### 日志与调试
```javascript
// 详细日志
cy.log('🔍 开始执行特定操作')

// 元素信息记录
cy.get('element').then(($el) => {
  cy.log(`元素信息: tag=${$el[0].tagName}, class=${$el[0].className}`)
})

// 条件分支记录
if (condition) {
  cy.log('✅ 执行分支A')
} else {
  cy.log('⚠️ 执行分支B')
}
```

### 时光机调试
- 在Cypress Test Runner中点击命令查看当时DOM状态
- 使用浏览器开发工具检查元素
- 查看网络请求和控制台输出

---

## ❓ 常见问题解答

### Q1: 为什么选择器找不到元素？
**A**:
1. 检查元素是否存在于DOM中
2. 验证CSS选择器语法
3. 确认元素是否动态生成（需要等待）
4. 检查元素是否在iframe中

### Q2: 如何处理动态生成的元素？
**A**:
```javascript
// 等待元素出现
cy.get('selector', { timeout: 10000 }).should('exist')

// 条件等待
cy.get('body').then(($body) => {
  if ($body.find('selector').length > 0) {
    // 元素存在时的处理
  }
})
```

### Q3: .then() 和 .should() 的区别？
**A**:
- `.then()`: 允许使用原生JavaScript/jQuery，不自动重试
- `.should()`: Cypress内置断言，自动重试直到条件满足

---

## 🚀 进阶主题 (待扩展)

- [ ] 自定义命令开发
- [ ] 页面对象模式 (Page Object)
- [ ] API测试集成
- [ ] 测试数据管理
- [ ] CI/CD集成
- [ ] 性能测试

---

## 📝 更新日志

| 日期 | 更新内容 |
|-----|---------|
| 2026-01-20 | 创建知识库，添加CSS选择器和测试执行控制章节 |
| 2026-01-20 | 大幅扩展CSS选择器章节：增加6种选择器类型完整参考、优先级说明、性能考虑 |

---

**💡 使用建议:**
1. 按主题查找相关知识点
2. 复制代码模板进行实际练习
3. 根据学习进度补充新的章节
4. 定期回顾和更新内容