describe('Cypress 基础测试', () => {
  // 辅助函数：导航到 type 页面
  const navigateToTypePage = () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    cy.url().should('include', '/commands/actions')
  }

  it('验证页面标题和输入功能', () => {
    navigateToTypePage()

    // 验证页面标题
    cy.title().should('include', 'Kitchen Sink')

    // 测试输入框
    cy.get('.action-email')
      .type('test@example.com')
      .should('have.value', 'test@example.com')
  })

  it('验证页面基本元素', () => {
    cy.visit('https://example.cypress.io')

    // 验证页面加载
    cy.get('h1').should('be.visible')

    // 验证导航栏
    cy.get('.navbar').should('exist')

    // 验证标题不为空
    cy.title().should('not.be.empty')
  })

  it('验证链接点击和页面跳转', () => {
    navigateToTypePage()

    // 验证新页面内容
    cy.get('.action-email').should('exist')
  })
})