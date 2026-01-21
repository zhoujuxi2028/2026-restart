// ============================================
// Day 15: 高级测试架构模式 (Advanced Testing Patterns)
// ============================================
// 学习目标：
// - 掌握 Page Object Model (POM) 设计模式
// - 学习 App Actions 模式
// - 实现可复用的测试组件
// - 建立可维护的测试架构

describe('Day 15: 高级测试架构模式', () => {

  // ============================================
  // 模块 1: Page Object Model (POM) 模式
  // ============================================
  describe('模块 1: Page Object Model 设计模式', () => {

    // 定义 Page Object - 登录页面
    class LoginPage {
      // 元素选择器
      get emailInput() { return cy.get('.action-email') }
      get submitButton() { return cy.get('.action-btn').first() }
      get errorMessage() { return cy.get('.error-message') }

      // 页面操作方法
      visit() {
        cy.visit('https://example.cypress.io/commands/actions')
        return this
      }

      enterEmail(email) {
        this.emailInput.clear().type(email)
        return this
      }

      submit() {
        this.submitButton.click()
        return this
      }

      // 复合操作
      login(email) {
        this.enterEmail(email)
        this.submit()
        return this
      }

      // 验证方法
      verifyEmailValue(expectedEmail) {
        this.emailInput.should('have.value', expectedEmail)
        return this
      }
    }

    it('1.1 使用 Page Object 模式进行测试', () => {
      cy.log('📄 演示 Page Object Model 模式')

      const loginPage = new LoginPage()

      loginPage
        .visit()
        .enterEmail('user@example.com')
        .verifyEmailValue('user@example.com')
        .submit()

      cy.log('✅ Page Object 模式测试完成')
    })

    it('1.2 Page Object 的链式调用', () => {
      cy.log('🔗 演示链式调用的优雅性')

      const loginPage = new LoginPage()

      // 链式调用，代码更简洁
      loginPage
        .visit()
        .login('chained@example.com')
        .verifyEmailValue('chained@example.com')

      cy.log('✅ 链式调用验证完成')
    })

    it('1.3 多个 Page Object 协作', () => {
      cy.log('🤝 演示多个页面对象协作')

      // 主页 Page Object
      class HomePage {
        visitCommands() {
          cy.get('.dropdown').contains('Commands').click()
          return this
        }

        navigateToActions() {
          cy.contains('Actions').click()
          return new ActionsPage()
        }
      }

      // Actions 页面 Page Object
      class ActionsPage {
        get emailInput() { return cy.get('.action-email') }

        fillEmail(email) {
          this.emailInput.clear().type(email)
          return this
        }

        verifyUrl() {
          cy.url().should('include', '/commands/actions')
          return this
        }
      }

      // 使用多个页面对象
      cy.visit('https://example.cypress.io')

      const homePage = new HomePage()
      homePage
        .visitCommands()
        .navigateToActions()
        .verifyUrl()
        .fillEmail('multi-page@example.com')

      cy.log('✅ 多页面对象协作完成')
    })
  })

  // ============================================
  // 模块 2: App Actions 模式
  // ============================================
  describe('模块 2: App Actions 模式', () => {

    // App Actions: 直接通过应用程序接口执行操作
    // 跳过 UI 交互，提高测试速度和稳定性

    it('2.1 使用 App Actions 设置应用状态', () => {
      cy.log('⚡ 演示 App Actions 模式')

      // 访问页面
      cy.visit('https://example.cypress.io/commands/actions')

      // 使用 App Action 直接设置状态（模拟）
      cy.window().then((win) => {
        // 在实际应用中，这里可以调用应用的内部 API
        // 例如: win.app.setUser({ email: 'test@example.com' })
        cy.log('通过 App Action 设置应用状态')
      })

      // 验证状态
      cy.get('.action-email')
        .clear()
        .type('app-action@example.com')
        .should('have.value', 'app-action@example.com')

      cy.log('✅ App Actions 演示完成')
    })

    it('2.2 结合 UI 和 App Actions', () => {
      cy.log('🔄 混合使用 UI 和 App Actions')

      cy.visit('https://example.cypress.io/commands/actions')

      // 关键路径使用 UI 测试
      cy.get('.action-email')
        .clear()
        .type('hybrid@example.com')

      // 非关键路径使用 App Actions（更快）
      cy.window().then(() => {
        cy.log('使用 App Action 跳过非关键 UI 交互')
      })

      // 验证最终状态
      cy.get('.action-email').should('have.value', 'hybrid@example.com')

      cy.log('✅ 混合模式测试完成')
    })

    it('2.3 App Actions 用于测试准备', () => {
      cy.log('🎯 使用 App Actions 快速准备测试数据')

      // 访问页面
      cy.visit('https://example.cypress.io')

      // 使用 App Action 快速准备测试状态
      cy.window().then((win) => {
        // 模拟快速设置：
        // - 创建测试用户
        // - 设置权限
        // - 准备测试数据
        cy.log('App Action: 准备测试环境')
        cy.log('App Action: 创建测试用户')
        cy.log('App Action: 设置权限和状态')
      })

      // 直接开始测试关键功能
      cy.get('h1').should('contain', 'Kitchen Sink')

      cy.log('✅ 测试准备完成')
    })
  })

  // ============================================
  // 模块 3: 可复用测试组件
  // ============================================
  describe('模块 3: 可复用测试组件设计', () => {

    // 可复用的测试辅助类
    class TestHelpers {
      // 通用等待方法
      static waitForElement(selector, timeout = 5000) {
        return cy.get(selector, { timeout }).should('be.visible')
      }

      // 通用填充表单方法
      static fillForm(formData) {
        Object.keys(formData).forEach(key => {
          cy.get(`[name="${key}"]`).clear().type(formData[key])
        })
      }

      // 通用验证方法
      static verifyFormValues(formData) {
        Object.keys(formData).forEach(key => {
          cy.get(`[name="${key}"]`).should('have.value', formData[key])
        })
      }

      // 通用导航方法
      static navigateTo(section, subsection) {
        cy.get('.dropdown').contains(section).click()
        cy.contains(subsection).click()
      }
    }

    it('3.1 使用可复用组件简化测试', () => {
      cy.log('🧩 演示可复用测试组件')

      cy.visit('https://example.cypress.io')

      // 使用可复用导航方法
      TestHelpers.navigateTo('Commands', 'Actions')

      // 验证导航成功
      cy.url().should('include', '/commands/actions')

      // 使用可复用等待方法
      TestHelpers.waitForElement('.action-email')

      cy.log('✅ 可复用组件测试完成')
    })

    it('3.2 组合使用多个辅助方法', () => {
      cy.log('🔧 组合使用测试辅助方法')

      cy.visit('https://example.cypress.io/commands/actions')

      // 等待页面加载
      TestHelpers.waitForElement('.action-email')

      // 填充表单
      cy.get('.action-email')
        .clear()
        .type('helper@example.com')

      // 验证结果
      cy.get('.action-email').should('have.value', 'helper@example.com')

      cy.log('✅ 组合辅助方法完成')
    })

    it('3.3 创建领域特定的测试 DSL', () => {
      cy.log('🎨 创建测试领域特定语言')

      // 定义测试 DSL
      const TestDSL = {
        // 用户操作
        user: {
          navigateToActions() {
            cy.visit('https://example.cypress.io')
            cy.get('.dropdown').contains('Commands').click()
            cy.contains('Actions').click()
          },

          enterEmail(email) {
            cy.get('.action-email').clear().type(email)
          },

          shouldSeeEmail(email) {
            cy.get('.action-email').should('have.value', email)
          }
        },

        // 页面验证
        page: {
          shouldBeOnActions() {
            cy.url().should('include', '/commands/actions')
            cy.get('h1').should('contain', 'Actions')
          }
        }
      }

      // 使用 DSL 编写测试
      TestDSL.user.navigateToActions()
      TestDSL.page.shouldBeOnActions()
      TestDSL.user.enterEmail('dsl@example.com')
      TestDSL.user.shouldSeeEmail('dsl@example.com')

      cy.log('✅ DSL 测试完成')
    })
  })

  // ============================================
  // 模块 4: 测试数据管理
  // ============================================
  describe('模块 4: 测试数据管理模式', () => {

    // 测试数据工厂
    class UserFactory {
      static validUser() {
        return {
          email: `user-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'user'
        }
      }

      static adminUser() {
        return {
          email: `admin-${Date.now()}@example.com`,
          name: 'Admin User',
          role: 'admin'
        }
      }

      static invalidUser() {
        return {
          email: 'invalid-email',
          name: '',
          role: ''
        }
      }
    }

    it('4.1 使用数据工厂模式', () => {
      cy.log('🏭 演示数据工厂模式')

      const testUser = UserFactory.validUser()

      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email')
        .clear()
        .type(testUser.email)
        .should('have.value', testUser.email)

      cy.log(`✅ 使用测试数据: ${testUser.email}`)
    })

    it('4.2 数据构建器模式', () => {
      cy.log('🔨 演示数据构建器模式')

      // 数据构建器
      class UserBuilder {
        constructor() {
          this.user = {
            email: 'default@example.com',
            name: 'Default',
            role: 'user'
          }
        }

        withEmail(email) {
          this.user.email = email
          return this
        }

        withName(name) {
          this.user.name = name
          return this
        }

        asAdmin() {
          this.user.role = 'admin'
          return this
        }

        build() {
          return this.user
        }
      }

      // 使用构建器
      const customUser = new UserBuilder()
        .withEmail('builder@example.com')
        .withName('Builder User')
        .asAdmin()
        .build()

      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email')
        .clear()
        .type(customUser.email)
        .should('have.value', customUser.email)

      cy.log(`✅ 构建的用户: ${JSON.stringify(customUser)}`)
    })

    it('4.3 测试数据集管理', () => {
      cy.log('📚 管理测试数据集')

      // 集中管理测试数据
      const TestData = {
        users: {
          valid: ['user1@test.com', 'user2@test.com', 'user3@test.com'],
          invalid: ['invalid', '@test.com', 'test@'],
          special: ['test+filter@example.com', 'user.name@example.com']
        }
      }

      cy.visit('https://example.cypress.io/commands/actions')

      // 遍历测试数据
      TestData.users.valid.forEach((email, index) => {
        cy.log(`测试用户 ${index + 1}: ${email}`)
        cy.get('.action-email')
          .clear()
          .type(email)
          .should('have.value', email)
      })

      cy.log('✅ 数据集测试完成')
    })
  })

  // ============================================
  // 模块 5: 综合实践 - 构建完整测试框架
  // ============================================
  describe('模块 5: 综合实践', () => {

    // 完整的测试框架示例
    class TestFramework {
      // Page Objects
      static pages = {
        home: {
          visit() {
            cy.visit('https://example.cypress.io')
          },
          navigateToCommands() {
            cy.get('.dropdown').contains('Commands').click()
          }
        },
        actions: {
          visit() {
            cy.visit('https://example.cypress.io/commands/actions')
          },
          fillEmail(email) {
            cy.get('.action-email').clear().type(email)
          },
          verifyEmail(email) {
            cy.get('.action-email').should('have.value', email)
          }
        }
      }

      // Test Helpers
      static helpers = {
        waitFor(selector, timeout = 5000) {
          return cy.get(selector, { timeout }).should('be.visible')
        },
        verifyUrl(path) {
          cy.url().should('include', path)
        }
      }

      // Test Data
      static data = {
        generateEmail() {
          return `test-${Date.now()}@example.com`
        }
      }
    }

    it('5.1 使用完整测试框架', () => {
      cy.log('🎯 演示完整测试框架')

      // 使用框架的各个部分
      TestFramework.pages.home.visit()
      TestFramework.pages.home.navigateToCommands()

      cy.contains('Actions').click()
      TestFramework.helpers.verifyUrl('/commands/actions')

      const testEmail = TestFramework.data.generateEmail()
      TestFramework.pages.actions.fillEmail(testEmail)
      TestFramework.pages.actions.verifyEmail(testEmail)

      cy.log('✅ 框架集成测试完成')
    })

    it('5.2 可维护的测试结构', () => {
      cy.log('📐 演示可维护的测试结构')

      // 清晰的测试步骤
      // 1. 准备
      const testUser = {
        email: 'maintainable@example.com'
      }

      // 2. 执行
      TestFramework.pages.actions.visit()
      TestFramework.pages.actions.fillEmail(testUser.email)

      // 3. 验证
      TestFramework.pages.actions.verifyEmail(testUser.email)

      cy.log('✅ 可维护结构演示完成')
    })

    it('5.3 最佳实践总结', () => {
      cy.log('📚 测试架构最佳实践')

      cy.visit('https://example.cypress.io/commands/actions')

      // 最佳实践要点
      const bestPractices = [
        '✅ 使用 Page Object 封装页面逻辑',
        '✅ 创建可复用的辅助函数',
        '✅ 使用数据工厂管理测试数据',
        '✅ 保持测试代码 DRY (Don\'t Repeat Yourself)',
        '✅ 编写清晰的测试描述',
        '✅ 分离测试逻辑和页面交互',
        '✅ 使用链式调用提高可读性',
        '✅ 集中管理测试配置和常量'
      ]

      bestPractices.forEach(practice => {
        cy.log(practice)
      })

      cy.get('.action-email')
        .clear()
        .type('best-practices@example.com')
        .should('have.value', 'best-practices@example.com')

      cy.log('🎉 高级测试模式学习完成！')
    })
  })
})

/**
 * 🌟 Day 15 学习要点总结：
 *
 * 1. **Page Object Model (POM)**
 *    - 封装页面元素和操作
 *    - 提高代码复用性
 *    - 降低维护成本
 *    - 支持链式调用
 *
 * 2. **App Actions 模式**
 *    - 直接通过应用 API 操作
 *    - 提高测试速度
 *    - 增强测试稳定性
 *    - 快速准备测试状态
 *
 * 3. **可复用组件**
 *    - 创建测试辅助类
 *    - 建立测试 DSL
 *    - 提取通用逻辑
 *    - 提高测试效率
 *
 * 4. **测试数据管理**
 *    - 数据工厂模式
 *    - 数据构建器模式
 *    - 集中管理测试数据
 *    - 动态生成测试数据
 *
 * 5. **架构设计原则**
 *    - 单一职责原则
 *    - DRY 原则
 *    - 关注点分离
 *    - 可扩展性设计
 *
 * 💡 **关键收获**：
 * - 好的测试架构能显著提高测试的可维护性
 * - 合理使用设计模式能减少重复代码
 * - 清晰的代码组织让团队协作更顺畅
 * - 投资于测试基础设施会在长期获得回报
 */
