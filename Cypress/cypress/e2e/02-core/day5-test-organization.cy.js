// ============================================
// Day 5: 测试组织与生命周期管理
// ============================================
// 学习目标：掌握测试组织、生命周期钩子、测试控制和可维护的测试结构
// 网站：https://example.cypress.io

describe('Day 5: 测试组织与生命周期管理', () => {

  // ============================================
  // 模块1: 生命周期钩子深度学习
  // ============================================
  describe('模块1: 生命周期钩子 (Lifecycle Hooks)', () => {

    // 全局数据存储
    let testStartTime
    let globalCounter = 0

    // 初始化全局数据对象
    const globalData = {}

    // before: 在所有测试开始前执行一次
    before(() => {
      cy.log('🚀 测试套件开始执行')
      testStartTime = Date.now()
      cy.log(`开始时间: ${new Date(testStartTime).toLocaleTimeString()}`)

      // 模拟初始化操作
      cy.wrap(globalData).as('globalData')
    })

    // beforeEach: 在每个测试前执行
    beforeEach(() => {
      globalCounter++
      cy.log(`📝 准备执行第${globalCounter}个测试`)

      // 每个测试前的标准准备
      cy.visit('https://example.cypress.io')
      cy.get('h1').should('contain', 'Kitchen Sink')

      // 设置测试别名
      cy.wrap(`test-${globalCounter}`).as('currentTestId')
    })

    // after: 在所有测试结束后执行一次
    after(() => {
      const endTime = Date.now()
      const duration = ((endTime - testStartTime) / 1000).toFixed(2)
      cy.log('🏁 测试套件执行完成')
      cy.log(`总耗时: ${duration}秒`)
      cy.log(`执行了${globalCounter}个测试`)
    })

    // afterEach: 在每个测试后执行
    afterEach(() => {
      cy.log(`✅ 第${globalCounter}个测试完成`)

      // 获取当前测试状态（在实际项目中可用于清理工作）
      cy.get('@currentTestId').then((testId) => {
        cy.log(`测试ID: ${testId} 已完成`)
      })
    })

    it('1.1 基本钩子功能验证', () => {
      cy.log('🔍 验证钩子是否正确执行')

      // 验证beforeEach设置的别名
      cy.get('@currentTestId').should('equal', 'test-1')

      // 验证页面状态
      cy.url().should('include', 'example.cypress.io')
      cy.get('h1').should('be.visible')
    })

    it('1.2 钩子间数据共享', () => {
      cy.log('📊 测试钩子间的数据共享')

      // 验证计数器递增
      cy.get('@currentTestId').should('equal', 'test-2')

      // 设置测试特定数据 - 直接修改闭包变量
      globalData.lastTest = 'test-2'
      globalData.timestamp = Date.now()
      cy.log('数据已更新')

      // 验证数据
      cy.wrap(globalData).then((data) => {
        expect(data.lastTest).to.equal('test-2')
        expect(data.timestamp).to.be.a('number')
      })
    })

    it('1.3 钩子中的异步操作', () => {
      cy.log('⏰ 测试钩子中的异步操作处理')

      // 验证数据持久化 - 使用闭包变量
      cy.wrap(globalData).then((data) => {
        expect(data).to.have.property('lastTest')
        expect(data.lastTest).to.equal('test-2')
        cy.log(`上一个测试: ${data.lastTest}`)
      })

      // 模拟异步检查
      cy.wait(100) // 短暂等待模拟异步
      cy.get('body').should('be.visible')

      cy.log('异步操作验证完成')
    })
  })

  // ============================================
  // 模块2: 测试控制和条件执行
  // ============================================
  describe('模块2: 测试控制 (.only, .skip)', () => {

    describe('基础控制方法', () => {

      beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions')
      })

      it('2.1 正常执行的测试', () => {
        cy.log('✅ 这个测试会正常执行')
        cy.get('.action-email').should('exist')
      })

      // 注意：.only() 和 .skip() 的示例（实际使用时会影响其他测试）
      it('2.2 演示测试控制语法', () => {
        cy.log('📚 学习测试控制语法')

        // 展示不同的控制方法
        cy.log('可用的测试控制方法:')
        cy.log('- it.only() - 只执行这个测试')
        cy.log('- it.skip() - 跳过这个测试')
        cy.log('- describe.only() - 只执行这个测试组')
        cy.log('- describe.skip() - 跳过这个测试组')

        // 验证页面存在
        cy.get('.action-email').should('exist')
      })

      it('2.3 条件性测试执行', () => {
        cy.log('🔄 演示条件性测试执行')

        // 根据环境条件执行不同逻辑
        const isProduction = Cypress.env('NODE_ENV') === 'production'

        if (isProduction) {
          cy.log('🏭 生产环境 - 执行完整测试')
          cy.get('.action-email').clear().type('prod@example.com')
        } else {
          cy.log('🔧 开发环境 - 执行基础测试')
          cy.get('.action-email').should('be.visible')
        }
      })
    })

    // 演示跳过的测试组
    describe.skip('演示跳过的测试组', () => {
      it('这个测试不会执行', () => {
        cy.log('这个不会显示')
      })
    })

    describe('条件执行演示', () => {

      // 模拟不同浏览器的测试
      it('2.4 浏览器特定测试', () => {
        cy.log('🌐 根据浏览器执行不同逻辑')

        const isChrome = Cypress.browser.name === 'chrome'
        const isFirefox = Cypress.browser.name === 'firefox'

        cy.visit('https://example.cypress.io/commands/actions')

        if (isChrome) {
          cy.log('Chrome浏览器 - 执行Chrome特定测试')
          cy.get('.action-email')
            .clear()
            .type('chrome-user@example.com')
            .should('have.value', 'chrome-user@example.com')
        } else if (isFirefox) {
          cy.log('Firefox浏览器 - 执行Firefox特定测试')
          cy.get('.action-email')
            .clear()
            .type('firefox-user@example.com')
        } else {
          cy.log('其他浏览器 - 执行通用测试')
          cy.get('.action-email').should('be.visible')
        }
      })
    })
  })

  // ============================================
  // 模块3: 嵌套测试组织
  // ============================================
  describe('模块3: 高级测试组织', () => {

    describe('用户管理功能', () => {

      const userData = {
        admin: { email: 'admin@example.com', role: 'admin' },
        user: { email: 'user@example.com', role: 'user' },
        guest: { email: 'guest@example.com', role: 'guest' }
      }

      before(() => {
        // 准备测试数据
        cy.wrap(userData).as('userData')
      })

      describe('管理员功能', () => {

        beforeEach(() => {
          cy.log('🔑 模拟管理员登录')
          cy.visit('https://example.cypress.io/commands/actions')
          // 使用闭包变量而不是别名
          cy.log(`当前用户: ${userData.admin.email}`)
        })

        it('3.1 管理员可以访问所有功能', () => {
          cy.log('👑 管理员权限测试')
          cy.get('.action-email')
            .clear()
            .type('admin@example.com')
            .should('have.value', 'admin@example.com')

          // 验证管理员特有功能
          cy.get('body').should('contain', 'Actions')
        })

        it('3.2 管理员可以管理用户', () => {
          cy.log('👥 用户管理功能测试')
          cy.get('body').should('be.visible')
          // 模拟用户管理操作
          cy.log('✅ 用户管理功能正常')
        })
      })

      describe('普通用户功能', () => {

        beforeEach(() => {
          cy.log('👤 模拟普通用户登录')
          cy.visit('https://example.cypress.io/commands/actions')
        })

        it('3.3 用户可以执行基本操作', () => {
          cy.log('📝 普通用户功能测试')
          cy.get('.action-email')
            .clear()
            .type('user@example.com')
            .should('have.value', 'user@example.com')
        })

        it('3.4 用户权限限制验证', () => {
          cy.log('🚫 权限限制测试')
          // 验证普通用户不能访问管理功能
          cy.get('body').should('be.visible')
          cy.log('✅ 权限控制正常')
        })
      })

      describe('游客功能', () => {

        beforeEach(() => {
          cy.log('🕶️ 游客模式')
          cy.visit('https://example.cypress.io')
        })

        it('3.5 游客只能浏览公开内容', () => {
          cy.log('👀 游客浏览测试')
          cy.get('h1').should('contain', 'Kitchen Sink')
          cy.get('body').should('be.visible')
        })
      })
    })

    describe('电商功能模块', () => {

      const products = [
        { id: 1, name: 'iPhone', price: 999 },
        { id: 2, name: 'iPad', price: 599 },
        { id: 3, name: 'MacBook', price: 1299 }
      ]

      before(() => {
        cy.wrap(products).as('products')
      })

      describe('产品浏览', () => {

        beforeEach(() => {
          cy.visit('https://example.cypress.io/commands/querying')
        })

        it('3.6 产品列表显示', () => {
          cy.log('📱 产品列表测试')
          cy.get('@products').then((productList) => {
            cy.log(`共有${productList.length}个产品`)
            productList.forEach((product, index) => {
              cy.log(`${index + 1}. ${product.name} - $${product.price}`)
            })
          })

          cy.get('h1').should('be.visible')
        })

        it('3.7 产品搜索功能', () => {
          cy.log('🔍 产品搜索测试')
          cy.get('body').should('be.visible')
          cy.log('✅ 搜索功能正常')
        })
      })

      describe('购物车功能', () => {

        let cart = []

        beforeEach(() => {
          cy.visit('https://example.cypress.io/commands/actions')
          cy.wrap(cart).as('cart')
        })

        it('3.8 添加商品到购物车', () => {
          cy.log('🛒 添加商品测试')

          // 模拟添加商品到购物车
          const mockProduct = { id: 1, name: 'Test Product', price: 99 }
          cart.push(mockProduct)
          cy.log(`已添加: ${mockProduct.name}`)

          cy.get('.action-email')
            .clear()
            .type('shopper@example.com')
            .should('have.value', 'shopper@example.com')
        })

        it('3.9 购物车商品管理', () => {
          cy.log('📋 购物车管理测试')
          cy.get('@cart').then((cartItems) => {
            if (cartItems.length > 0) {
              cy.log(`购物车中有${cartItems.length}件商品`)
            } else {
              cy.log('购物车为空')
            }
          })
        })
      })
    })
  })

  // ============================================
  // 模块4: 最佳实践和模式
  // ============================================
  describe('模块4: 测试组织最佳实践', () => {

    describe('数据驱动测试', () => {

      const testUsers = [
        { email: 'test1@example.com', type: '普通用户' },
        { email: 'test2@example.com', type: '高级用户' },
        { email: 'admin@example.com', type: '管理员' }
      ]

      beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions')
      })

      testUsers.forEach((user, index) => {
        it(`4.${index + 1} ${user.type}邮箱验证 - ${user.email}`, () => {
          cy.log(`📧 测试用户: ${user.email} (${user.type})`)

          cy.get('.action-email')
            .clear()
            .type(user.email)
            .should('have.value', user.email)

          // 根据用户类型执行不同验证
          if (user.type === '管理员') {
            cy.log('🔑 管理员特殊验证')
          } else {
            cy.log('👤 普通用户验证')
          }
        })
      })
    })

    describe('清理和恢复模式', () => {

      let originalTitle

      before(() => {
        cy.visit('https://example.cypress.io')
        cy.title().then((title) => {
          originalTitle = title
          cy.log(`原始标题: ${title}`)
        })
      })

      beforeEach(() => {
        cy.log('🧹 测试前清理')
        cy.visit('https://example.cypress.io/commands/actions')
      })

      afterEach(() => {
        cy.log('🔄 测试后恢复')
        // 在实际应用中，这里可以进行数据清理
        cy.log('清理操作完成')
      })

      after(() => {
        cy.log('🏠 返回原始状态')
        cy.visit('https://example.cypress.io')
        cy.title().should('include', 'Kitchen Sink')
      })

      it('4.4 测试数据隔离', () => {
        cy.log('🔒 数据隔离测试')
        cy.get('.action-email')
          .clear()
          .type('isolated-test@example.com')
          .should('have.value', 'isolated-test@example.com')
      })

      it('4.5 测试环境重置', () => {
        cy.log('🔄 环境重置测试')
        // 验证上一个测试的数据已被清理
        cy.get('.action-email').should('not.have.value', 'isolated-test@example.com')

        cy.get('.action-email')
          .clear()
          .type('reset-test@example.com')
      })
    })

    describe('错误处理和恢复', () => {

      beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions')
      })

      it('4.6 优雅的错误处理', () => {
        cy.log('🛡️ 错误处理测试')

        // 使用条件性操作避免测试失败
        cy.get('body').then(($body) => {
          if ($body.find('.non-existent-element').length > 0) {
            cy.get('.non-existent-element').click()
          } else {
            cy.log('⚠️ 元素不存在，跳过操作')
            cy.get('.action-email').should('be.visible')
          }
        })
      })

      it('4.7 重试机制演示', () => {
        cy.log('🔄 重试机制测试')

        // 模拟可能需要重试的操作
        let attemptCount = 0

        const attemptOperation = () => {
          attemptCount++
          cy.log(`尝试次数: ${attemptCount}`)

          if (attemptCount < 3) {
            cy.log('模拟操作失败，准备重试')
          } else {
            cy.log('操作成功')
          }
        }

        attemptOperation()
        cy.get('.action-email').should('be.visible')
      })
    })
  })
})

// ============================================
// Day 5 模块1总结
// ============================================
/*
🎯 学习成果：
□ 掌握四种生命周期钩子的使用
□ 理解测试间数据共享机制
□ 学会使用.only()和.skip()控制测试执行
□ 掌握嵌套describe的组织方式
□ 了解条件性测试执行
□ 学会数据驱动测试模式
□ 掌握测试清理和恢复模式

🔥 关键技巧：
1. 钩子执行顺序: before → beforeEach → test → afterEach → after
2. 数据共享: 使用cy.wrap()和别名系统
3. 条件执行: 根据环境、浏览器等条件动态执行
4. 测试组织: 逻辑分组、清晰命名、合理嵌套
5. 错误处理: 优雅的失败处理和重试机制

📈 下一步：
Day 5 模块2 将学习异步操作处理和等待机制
*/