// ============================================
// 第三天挑战练习：进阶实战场景
// ============================================
// 挑战目标：在实际场景中应用基本命令，为第二阶段做准备

describe('Day 3: 挑战练习 - 实战场景', () => {

  // ============================================
  // 挑战 1: 表单操作综合练习
  // ============================================
  describe('挑战 1: 复杂表单操作', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/actions')
    })

    it('1.1 多输入框表单填写', () => {
      // 邮箱输入
      cy.get('.action-email')
        .should('be.visible')
        .clear()
        .type('challenge@cypress.io')
        .should('have.value', 'challenge@cypress.io')

      // 文本输入（检查是否存在其他输入框）
   cy.get('body').then(($body) => {
  const otherInputs = $body.find('input[type="text"]:not(.action-email)')
  cy.log(`找到 ${otherInputs.length} 个其他文本输入框`)
  
  if (otherInputs.length > 0) {
    cy.wrap(otherInputs).first().then(($input) => {
      cy.log(`输入框是否可见: ${$input.is(':visible')}`)
      cy.log(`输入框是否启用: ${!$input.is('[disabled]')}`)
    })
    cy.wrap(otherInputs).first().type('DISCOUNT50').should('have.value', 'DISCOUNT50')
  } else {
    cy.log('没有找到其他可用的文本输入框')
  }
})
     // 密码输入（如果存在）
      cy.get('body').then(($body) => {
        if ($body.find('input[type="password"]').length) {
          cy.get('input[type="password"]')
            .type('SecurePassword123!')
            .should('have.value', 'SecurePassword123!')
        }
      })
    })

    it('1.2 文本区域和特殊字符处理', () => {
      // 查找可用的文本区域（非disabled）
      cy.get('body').then(($body) => {
        const enabledTextareas = $body.find('textarea:not([disabled])')
        if (enabledTextareas.length > 0) {
          const specialText = 'Hello!\nThis is a multi-line text.\nWith special chars: @#$%^&*()'
          cy.wrap(enabledTextareas).first()
            .clear()
            .type(specialText)
            .should('contain', 'Hello!')
        } else {
          cy.log('没有找到可用的文本区域')
        }
      })

      // 验证disabled元素确实是disabled状态
      cy.get('.action-disabled').should('be.disabled')
    })
  })

  // ============================================
  // 挑战 2: 动态元素处理
  // ============================================
  describe('挑战 2: 动态内容处理', () => {

    it('2.1 等待元素出现并交互', () => {
      cy.visit('https://example.cypress.io')

      // 等待页面完全加载
      cy.get('.banner').should('be.visible')

      // 使用直接访问方式代替复杂的导航逻辑
      const pages = [
        { name: 'Querying', url: '/commands/querying' },
        { name: 'Traversal', url: '/commands/traversal' },
        { name: 'Actions', url: '/commands/actions' },
        { name: 'Aliasing', url: '/commands/aliasing' }
      ]

      pages.forEach((page) => {
        // 直接访问页面
        cy.visit(`https://example.cypress.io${page.url}`)

        // 验证页面加载
        cy.url().should('include', page.url)

        // 验证页面内容
        cy.get('h1').should('contain', page.name)
      })
    })

    it('2.2 条件性元素检查', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 检查元素存在性并执行条件操作
      cy.get('body').then(($body) => {
        // 如果存在下拉菜单
        if ($body.find('select').length > 0) {
          cy.get('select').first().select(2) // 选择第二个选项
        }

        // 如果存在可用的复选框（非disabled）
        if ($body.find('input[type="checkbox"]:not([disabled])').length > 0) {
          cy.get('input[type="checkbox"]:not([disabled])').check()
        }

        // 如果存在可用的单选按钮（非disabled）
        if ($body.find('input[type="radio"]:not([disabled])').length > 0) {
          cy.get('input[type="radio"]:not([disabled])').eq(0).check()
        }
      })
    })
  })

  // ============================================
  // 挑战 3: 错误处理和边界测试
  // ============================================
  describe('挑战 3: 错误处理技巧', () => {

    it('3.1 优雅的错误处理', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 测试无效输入
      cy.get('.action-email').then(($input) => {
        // 测试极长输入
        const longEmail = 'a'.repeat(100) + '@example.com'
        cy.wrap($input).clear().type(longEmail)

        // 验证浏览器的自然行为
        cy.wrap($input).should('have.value', longEmail)
      })

      // 测试特殊字符输入
      cy.get('.action-email')
        .clear()
        .type('test+tag@example-domain.co.uk')
        .should('have.value', 'test+tag@example-domain.co.uk')
    })

    it('3.2 网络和加载状态处理', () => {
      // 测试页面重新加载
      cy.visit('https://example.cypress.io')

      // 等待关键元素加载完成（使用更稳定的元素）
      cy.get('.banner').should('be.visible')

      // 刷新页面测试
      cy.reload()

      // 验证页面重新加载后的状态
      cy.get('h1').should('be.visible').should('contain', 'Kitchen Sink')
    })
  })

  // ============================================
  // 挑战 4: 性能和最佳实践
  // ============================================
  describe('挑战 4: 最佳实践应用', () => {

    it('4.1 高效的元素查找策略', () => {
      cy.visit('https://example.cypress.io')

      // 演示优选器策略的降级处理
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="banner"]').length > 0) {
          // 最优：测试专用属性
          cy.get('[data-cy="banner"]').should('exist')
        } else if ($body.find('.banner').length > 0) {
          // 备选：class 选择器
          cy.get('.banner').should('exist')
        } else {
          // 兜底：使用稳定的元素
          cy.get('h1').should('exist')
        }
      })

      // 避免使用脆弱的选择器
      cy.get('h1').should('exist') // 好的选择器
      // cy.get('body > div:nth-child(1) > h1') // 避免这种脆弱选择器
    })

    it('4.2 链式命令的最佳实践', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 优秀的链式命令组合
      cy.get('.action-email')
        .should('be.visible')      // 先验证可见
        .should('be.enabled')      // 然后验证可用
        .clear()                   // 清空
        .type('best@practice.com') // 输入
        .should('have.value', 'best@practice.com') // 验证结果
        .blur()                    // 失去焦点
        .should('not.be.focused')  // 验证状态变化
    })

    it('4.3 可读性和维护性', () => {
      // 使用描述性的变量和方法
      const testEmail = 'maintainable@code.com'
      const emailSelector = '.action-email'

      cy.visit('https://example.cypress.io/commands/actions')

      // 清晰的测试步骤分离
      // 步骤1: 准备
      cy.get(emailSelector).should('be.visible')

      // 步骤2: 操作
      cy.get(emailSelector).clear().type(testEmail)

      // 步骤3: 验证
      cy.get(emailSelector).should('have.value', testEmail)
    })
  })

  // ============================================
  // 挑战 5: 综合项目模拟
  // ============================================
  describe('挑战 5: 真实项目场景模拟', () => {

    it('5.1 模拟用户注册流程', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟完整的表单填写流程
      const userData = {
        email: 'newuser@company.com',
        fullName: 'Test User',
        company: 'Cypress Learning Inc'
      }

      // 邮箱输入
      cy.get('.action-email')
        .clear()
        .type(userData.email)
        .should('have.value', userData.email)

      // 如果页面有其他可见的输入框，继续填写
      cy.get('body').then(($body) => {
        // 动态查找可见且可用的输入框
        const visibleInputs = $body.find('input[type="text"]:not(.action-email):visible:not([disabled])')
        if (visibleInputs.length > 0) {
          cy.wrap(visibleInputs).each(($input, index) => {
            cy.wrap($input).type(`TestValue${index}`)
          })
        } else {
          cy.log('没有找到其他可用的可见输入框')
        }
      })
    })

    it('5.2 模拟电商搜索和浏览', () => {
      cy.visit('https://example.cypress.io')

      // 模拟搜索功能（如果存在搜索框）
      cy.get('body').then(($body) => {
        if ($body.find('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').length) {
          cy.get('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]')
            .first()
            .type('cypress testing{enter}')
        }
      })

      // 模拟浏览不同类别（使用直接访问方式）
      const categories = [
        { name: 'Querying', url: '/commands/querying' },
        { name: 'Actions', url: '/commands/actions' },
        { name: 'Traversal', url: '/commands/traversal' }
      ]
      categories.forEach((category) => {
        cy.visit(`https://example.cypress.io${category.url}`)
        cy.url().should('include', category.url)

        // 验证类别页面内容
        cy.get('h1').should('be.visible')
      })
    })

    it.only('5.3 模拟数据验证和提交', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟表单验证场景
      cy.get('.action-email')
        .clear()
        .type('invalid-email')  // 无效邮箱
        .blur()

      // 检查是否有验证提示（在真实应用中会有）
      cy.get('.action-email').then(($input) => {
        // 在真实应用中，这里会检查验证错误信息
        // cy.get('.error-message').should('contain', 'Invalid email')

        // 纠正输入
        cy.wrap($input)
          .clear()
          .type('valid@email.com')
          .should('have.value', 'valid@email.com')
      })

      // 模拟提交按钮（如果存在）
      cy.get('body').then(($body) => {
        if ($body.find('button[type="submit"], input[type="submit"]').length) {
          cy.get('button[type="submit"], input[type="submit"]')
            .should('be.enabled')
            .click()
        }
      })
    })
  })
})

// ============================================
// 进阶练习指导
// ============================================
/*
🚀 挑战完成标准：
□ 能够流畅使用四个基本命令
□ 理解选择器的优先级和最佳实践
□ 能够处理动态内容和条件逻辑
□ 掌握链式命令的正确使用方法
□ 能够编写可维护的测试代码

🔥 进阶技巧：
1. 使用 .within() 限制查找范围
2. 使用 .then() 处理异步操作
3. 使用 .wrap() 包装 jQuery 元素
4. 使用条件判断处理可选元素
5. 使用数据驱动方法减少重复代码

📈 下一步准备：
完成这些挑战后，你已经具备了进入第二阶段的所有基础技能！
第二阶段将学习：
- 更复杂的选择器和查询方法
- 过滤和遍历技巧
- 高级交互和断言
- Hooks 和测试组织

💡 调试技巧：
- 使用 cy.pause() 暂停测试
- 使用 cy.debug() 进入调试模式
- 利用 Chrome DevTools 检查元素
- 观察 Time Travel 功能的每一步
*/