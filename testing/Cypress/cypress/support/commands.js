// ***********************************************
// 自定义 Cypress 命令
//
// 在这里添加可复用的测试命令，提高测试效率
// 文档：https://on.cypress.io/custom-commands
// ***********************************************

// ==============================================
// 1. 登录相关命令
// ==============================================

/**
 * 模拟用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @example cy.login('testuser', 'password123')
 */
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('[data-cy="username"]').type(username)
    cy.get('[data-cy="password"]').type(password)
    cy.get('[data-cy="login-button"]').click()
    cy.url().should('not.include', '/login')
  })
})

/**
 * 登出
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-button"]').click()
  cy.url().should('include', '/login')
})

// ==============================================
// 2. 表单相关命令
// ==============================================

/**
 * 填充表单
 * @param {Object} formData - 表单数据对象
 * @example
 * cy.fillForm({
 *   '[data-cy="name"]': 'John Doe',
 *   '[data-cy="email"]': 'john@example.com'
 * })
 */
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach(selector => {
    cy.get(selector).clear().type(formData[selector])
  })
})

/**
 * 清空表单
 * @param {string} formSelector - 表单选择器
 * @example cy.clearForm('form')
 */
Cypress.Commands.add('clearForm', (formSelector) => {
  cy.get(formSelector).within(() => {
    cy.get('input[type="text"], input[type="email"], textarea').clear()
  })
})

// ==============================================
// 3. 等待和加载相关命令
// ==============================================

/**
 * 等待页面加载完成（无加载动画）
 * @example cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('.loading', { timeout: 10000 }).should('not.exist')
  cy.get('body').should('be.visible')
})

/**
 * 等待 API 请求完成
 * @param {string} alias - 请求别名
 * @example cy.waitForApi('@getUsers')
 */
Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(alias).its('response.statusCode').should('eq', 200)
})

// ==============================================
// 4. 断言增强命令
// ==============================================

/**
 * 验证元素完全可见且可交互
 * @example cy.get('button').shouldBeInteractive()
 */
Cypress.Commands.add('shouldBeInteractive', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject)
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
})

/**
 * 验证元素包含文本（不区分大小写）
 * @param {string} text - 要验证的文本
 * @example cy.get('h1').shouldContainText('Welcome')
 */
Cypress.Commands.add('shouldContainText', { prevSubject: 'element' }, (subject, text) => {
  cy.wrap(subject).invoke('text').then(elementText => {
    expect(elementText.toLowerCase()).to.include(text.toLowerCase())
  })
})

// ==============================================
// 5. 数据和 Fixtures 命令
// ==============================================

/**
 * 加载并使用 fixture 数据
 * @param {string} fixtureName - fixture 文件名（不含.json）
 * @param {function} callback - 使用数据的回调函数
 * @example
 * cy.useFixture('users', (users) => {
 *   cy.fillForm(users[0])
 * })
 */
Cypress.Commands.add('useFixture', (fixtureName, callback) => {
  cy.fixture(fixtureName).then(callback)
})

// ==============================================
// 6. 调试辅助命令
// ==============================================

/**
 * 打印元素信息到控制台
 * @example cy.get('.element').printInfo()
 */
Cypress.Commands.add('printInfo', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).then($el => {
    console.log('Element Info:', {
      tag: $el.prop('tagName'),
      classes: $el.attr('class'),
      id: $el.attr('id'),
      text: $el.text(),
      visible: $el.is(':visible'),
      html: $el.html()
    })
  })
  return cy.wrap(subject)
})

/**
 * 暂停测试并显示元素信息
 * @example cy.get('.element').pauseAndInspect()
 */
Cypress.Commands.add('pauseAndInspect', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).printInfo().pause()
  return cy.wrap(subject)
})

// ==============================================
// 7. 常用操作命令
// ==============================================

/**
 * 点击并等待导航
 * @param {number} timeout - 超时时间（可选）
 * @example cy.get('a').clickAndWait()
 */
Cypress.Commands.add('clickAndWait', { prevSubject: 'element' }, (subject, timeout = 5000) => {
  const initialUrl = cy.url()
  cy.wrap(subject).click()
  cy.url({ timeout }).should('not.eq', initialUrl)
})

/**
 * 选择下拉菜单并验证
 * @param {string} value - 要选择的值
 * @example cy.get('select').selectAndVerify('option1')
 */
Cypress.Commands.add('selectAndVerify', { prevSubject: 'element' }, (subject, value) => {
  cy.wrap(subject)
    .select(value)
    .should('have.value', value)
})

// ==============================================
// 8. 自定义覆盖命令示例
// ==============================================

/**
 * 覆盖 visit 命令，添加默认等待
 */
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(url, options)
  cy.waitForPageLoad()
})