// Day 19: 跨浏览器与多设备测试
describe('Day 19: 跨浏览器与多设备测试', () => {

  describe('模块 1: 跨浏览器测试', () => {
    it('1.1 浏览器检测和适配', () => {
      cy.log('🌐 演示跨浏览器测试')
      
      const browserInfo = {
        name: Cypress.browser.name,
        version: Cypress.browser.version,
        family: Cypress.browser.family
      }
      
      cy.log(`当前浏览器: ${browserInfo.name} ${browserInfo.version}`)
      
      // 根据浏览器执行不同逻辑
      if (browserInfo.name === 'chrome') {
        cy.log('Chrome 浏览器特定测试')
      } else if (browserInfo.name === 'firefox') {
        cy.log('Firefox 浏览器特定测试')
      }
      
      cy.visit('https://example.cypress.io')
      cy.get('h1').should('be.visible')
      cy.log('✅ 跨浏览器测试完成')
    })
  })

  describe('模块 2: 响应式设计测试', () => {
    it('2.1 多视口测试', () => {
      cy.log('📱 演示多视口测试')
      
      const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1280, height: 720 }
      ]
      
      viewports.forEach(viewport => {
        cy.log(`测试视口: ${viewport.name} (${viewport.width}x${viewport.height})`)
        cy.viewport(viewport.width, viewport.height)
        cy.visit('https://example.cypress.io')
        cy.get('h1').should('be.visible')
      })
      
      cy.log('✅ 多视口测试完成')
    })
  })

  describe('模块 3: 移动端测试', () => {
    it('3.1 移动设备模拟', () => {
      cy.log('📱 演示移动设备测试')
      
      // 设置移动视口
      cy.viewport('iphone-x')
      cy.visit('https://example.cypress.io')
      
      // 移动端验证
      cy.get('h1').should('be.visible')
      cy.log('✅ 移动端测试完成')
    })
  })
})
