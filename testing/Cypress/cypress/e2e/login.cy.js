describe('用户登录测试', () => {
  it('应该能够成功登录', () => {
    // 访问登录页面
    cy.visit('https://example.com/login')

    // 输入用户名和密码
    cy.get('[data-test="username"]').type('testuser@example.com')
    cy.get('[data-test="password"]').type('Test@123456')

    // 点击登录按钮
    cy.get('[data-test="login-button"]').click()
  })
})
