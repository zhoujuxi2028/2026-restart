/**
 * 🛠️ Day 12: 自定义命令和插件
 *
 * 学习目标：
 * - 掌握 Cypress.Commands.add() 创建自定义命令
 * - 学习命令参数和选项处理
 * - 理解命令链式调用
 * - 学习 Page Object 模式
 * - 集成第三方插件
 */

describe('🛠️ Day 12: 自定义命令和插件', () => {

  // 在测试开始前定义自定义命令
  before(() => {
    // 注意：在实际项目中，自定义命令通常在 cypress/support/commands.js 中定义
    // 这里为了演示，我们在测试文件中定义

    // 🎯 学习要点：基础自定义命令
    Cypress.Commands.add('customLog', (message) => {
      cy.log(`🔥 自定义日志: ${message}`)
    })

    // 🎯 学习要点：带参数的自定义命令
    Cypress.Commands.add('loginAsUser', (username, password) => {
      cy.visit('/login')
      cy.get('[data-cy="username"]').type(username)
      cy.get('[data-cy="password"]').type(password)
      cy.get('[data-cy="submit"]').click()
      cy.url().should('include', '/dashboard')
    })

    // 🎯 学习要点：链式自定义命令
    Cypress.Commands.add('getByDataCy', (selector) => {
      return cy.get(`[data-cy="${selector}"]`)
    })

    // 🎯 学习要点：条件性自定义命令
    Cypress.Commands.add('conditionalClick', (selector, condition = true) => {
      if (condition) {
        cy.get(selector).click()
      } else {
        cy.log(`跳过点击: ${selector}`)
      }
    })

    // 🎯 学习要点：复杂表单填写命令
    Cypress.Commands.add('fillForm', (formData) => {
      Object.keys(formData).forEach(field => {
        cy.get(`[data-cy="${field}"]`).type(formData[field])
      })
    })
  })

  beforeEach(() => {
    cy.visit('https://example.cypress.io')
  })

  describe('🔧 基础自定义命令', () => {

    it('应该能够使用简单的自定义命令', () => {
      // 🎯 学习要点：使用自定义日志命令
      cy.customLog('这是一个自定义日志消息')
      cy.customLog('测试自定义命令功能')

      cy.then(() => {
        cy.log('✅ 自定义日志命令测试完成')
      })
    })

    it('应该能够使用带参数的自定义命令', () => {
      // 🎯 学习要点：参数化自定义命令
      // 注意：这里的登录命令在实际场景中使用，这里只是演示语法
      cy.then(() => {
        cy.log('模拟使用登录命令：')
        cy.log('cy.loginAsUser("admin", "password123")')
        cy.log('登录命令将会：')
        cy.log('1. 访问登录页面')
        cy.log('2. 输入用户名和密码')
        cy.log('3. 点击提交按钮')
        cy.log('4. 验证跳转到仪表板')
      })
    })

    it('应该能够使用链式自定义命令', () => {
      // 🎯 学习要点：链式命令调用
      cy.visit('https://example.cypress.io/commands/querying')

      // 使用自定义的 data-cy 选择器命令
      cy.get('[data-cy="data-cy-query"]').should('exist')

      // 链式调用示例
      cy.get('.query-list')
        .find('li')
        .first()
        .should('contain', 'cy.get()')
    })
  })

  describe('📝 表单处理自定义命令', () => {

    it('应该能够使用表单填写命令', () => {
      // 🎯 学习要点：复杂表单数据处理
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890'
      }

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟表单填写（实际需要对应的表单元素）
      cy.then(() => {
        cy.log('模拟使用表单填写命令：')
        cy.log('cy.fillForm(userData)')
        cy.log('表单数据：', userData)
      })
    })

    it('应该能够创建复杂的验证命令', () => {
      // 定义表单验证命令
      Cypress.Commands.add('validateForm', (expectedData) => {
        Object.keys(expectedData).forEach(field => {
          cy.get(`[data-cy="${field}"]`).should('have.value', expectedData[field])
        })
      })

      const formData = {
        email: 'test@example.com',
        name: 'Test User'
      }

      cy.then(() => {
        cy.log('表单验证命令创建完成')
        cy.log('使用方式: cy.validateForm(formData)')
      })
    })
  })

  describe('🔐 认证和会话管理命令', () => {

    it('应该能够创建会话管理命令', () => {
      // 🎯 学习要点：会话和认证命令
      Cypress.Commands.add('setupUserSession', (userType = 'regular') => {
        const users = {
          admin: { username: 'admin', password: 'admin123', role: 'admin' },
          regular: { username: 'user', password: 'user123', role: 'user' },
          guest: { username: 'guest', password: 'guest123', role: 'guest' }
        }

        const user = users[userType]
        if (!user) {
          throw new Error(`Unknown user type: ${userType}`)
        }

        cy.session([userType], () => {
          cy.visit('/login')
          cy.get('[data-cy="username"]').type(user.username)
          cy.get('[data-cy="password"]').type(user.password)
          cy.get('[data-cy="submit"]').click()
          cy.url().should('include', '/dashboard')

          // 验证用户角色
          cy.get('[data-cy="user-role"]').should('contain', user.role)
        })
      })

      cy.then(() => {
        cy.log('会话管理命令已定义')
        cy.log('支持的用户类型: admin, regular, guest')
      })
    })

    it('应该能够创建权限检查命令', () => {
      // 🎯 学习要点：权限验证命令
      Cypress.Commands.add('verifyPermission', (action, shouldAllow = true) => {
        const selector = `[data-cy="${action}-button"]`

        if (shouldAllow) {
          cy.get(selector).should('not.be.disabled')
          cy.get(selector).click()
          cy.get('[data-cy="success-message"]').should('be.visible')
        } else {
          cy.get(selector).should('be.disabled')
          // 或者元素不存在
          // cy.get(selector).should('not.exist')
        }
      })

      cy.then(() => {
        cy.log('权限检查命令已定义')
        cy.log('用法: cy.verifyPermission("delete", false)')
      })
    })
  })

  describe('📱 响应式测试命令', () => {

    it('应该能够创建视口切换命令', () => {
      // 🎯 学习要点：响应式测试命令
      Cypress.Commands.add('testResponsive', (callback) => {
        const viewports = [
          { name: '手机', width: 375, height: 667 },
          { name: '平板', width: 768, height: 1024 },
          { name: '桌面', width: 1920, height: 1080 }
        ]

        viewports.forEach(viewport => {
          cy.viewport(viewport.width, viewport.height)
          cy.log(`测试 ${viewport.name} 视图 (${viewport.width}x${viewport.height})`)

          if (callback) {
            callback(viewport)
          }

          // 默认的响应式检查
          cy.get('body').should('be.visible')
        })
      })

      // 使用响应式测试命令
      cy.testResponsive((viewport) => {
        if (viewport.width < 768) {
          cy.log('手机端特定检查')
        } else if (viewport.width < 1200) {
          cy.log('平板端特定检查')
        } else {
          cy.log('桌面端特定检查')
        }
      })
    })
  })

  describe('🎨 Page Object 模式', () => {

    it('应该能够使用 Page Object 命令', () => {
      // 🎯 学习要点：Page Object 模式实现
      const LoginPage = {
        visit: () => cy.visit('/login'),

        fillUsername: (username) =>
          cy.get('[data-cy="username"]').type(username),

        fillPassword: (password) =>
          cy.get('[data-cy="password"]').type(password),

        submit: () =>
          cy.get('[data-cy="submit"]').click(),

        login: (username, password) => {
          LoginPage.visit()
          LoginPage.fillUsername(username)
          LoginPage.fillPassword(password)
          LoginPage.submit()
        },

        verifyErrorMessage: (message) =>
          cy.get('[data-cy="error"]').should('contain', message),

        verifySuccessfulLogin: () =>
          cy.url().should('include', '/dashboard')
      }

      // 创建页面对象命令
      Cypress.Commands.add('loginPage', () => {
        return cy.wrap(LoginPage)
      })

      // 使用页面对象
      cy.then(() => {
        cy.log('Page Object 模式示例：')
        cy.log('cy.loginPage().login("user", "password")')
        cy.log('cy.loginPage().verifySuccessfulLogin()')
      })
    })

    it('应该能够创建可链式调用的页面对象', () => {
      // 🎯 学习要点：链式页面对象
      class DashboardPage {
        static visit() {
          cy.visit('/dashboard')
          return new DashboardPage()
        }

        clickMenuItem(item) {
          cy.get(`[data-cy="menu-${item}"]`).click()
          return this
        }

        verifyTitle(title) {
          cy.get('[data-cy="page-title"]').should('contain', title)
          return this
        }

        searchFor(query) {
          cy.get('[data-cy="search-input"]').type(query)
          cy.get('[data-cy="search-button"]').click()
          return this
        }

        verifySearchResults(count) {
          cy.get('[data-cy="search-results"]').should('have.length', count)
          return this
        }
      }

      // 使用链式页面对象
      cy.then(() => {
        cy.log('链式页面对象使用示例：')
        cy.log('DashboardPage.visit()')
        cy.log('  .clickMenuItem("reports")')
        cy.log('  .verifyTitle("报告")')
        cy.log('  .searchFor("sales")')
        cy.log('  .verifySearchResults(5)')
      })
    })
  })

  describe('🔌 第三方插件集成', () => {

    it('应该能够集成数据生成插件', () => {
      // 🎯 学习要点：faker.js 类似的数据生成
      Cypress.Commands.add('generateTestData', (type) => {
        const generators = {
          user: () => ({
            name: `TestUser${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            age: Math.floor(Math.random() * 50) + 18,
            id: Math.floor(Math.random() * 10000)
          }),

          product: () => ({
            name: `Product ${Math.floor(Math.random() * 1000)}`,
            price: (Math.random() * 100).toFixed(2),
            category: ['Electronics', 'Clothing', 'Books'][Math.floor(Math.random() * 3)],
            inStock: Math.random() > 0.5
          }),

          order: () => ({
            id: `ORD${Date.now()}`,
            total: (Math.random() * 500).toFixed(2),
            status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
            items: Math.floor(Math.random() * 5) + 1
          })
        }

        return generators[type] ? generators[type]() : null
      })

      // 使用数据生成命令
      cy.generateTestData('user').then(user => {
        cy.log('生成的用户数据：', user)
        expect(user).to.have.property('name')
        expect(user).to.have.property('email')
        expect(user.email).to.include('@')
      })

      cy.generateTestData('product').then(product => {
        cy.log('生成的产品数据：', product)
        expect(product).to.have.property('name')
        expect(product).to.have.property('price')
      })
    })

    it('应该能够集成数据库操作插件', () => {
      // 🎯 学习要点：数据库操作命令
      Cypress.Commands.add('dbSeed', (seedType) => {
        const seeds = {
          users: [
            { name: 'Alice', role: 'admin' },
            { name: 'Bob', role: 'user' },
            { name: 'Charlie', role: 'user' }
          ],
          products: [
            { name: 'Laptop', price: 999.99, category: 'Electronics' },
            { name: 'Mouse', price: 29.99, category: 'Electronics' },
            { name: 'Book', price: 19.99, category: 'Books' }
          ]
        }

        const seedData = seeds[seedType]
        if (!seedData) {
          throw new Error(`Unknown seed type: ${seedType}`)
        }

        // 模拟数据库操作
        cy.log(`正在种植 ${seedType} 数据...`)
        cy.wrap(seedData).as(`${seedType}Data`)
        cy.log(`✅ ${seedType} 数据种植完成`)

        return cy.wrap(seedData)
      })

      Cypress.Commands.add('dbCleanup', () => {
        cy.log('清理测试数据库...')
        // 在实际场景中，这里会执行数据库清理操作
        cy.log('✅ 数据库清理完成')
      })

      // 使用数据库命令
      cy.dbSeed('users').then(users => {
        expect(users).to.have.length(3)
        cy.log(`种植了 ${users.length} 个用户`)
      })
    })

    it('应该能够集成 API 测试插件', () => {
      // 🎯 学习要点：API 测试辅助命令
      Cypress.Commands.add('apiRequest', (method, endpoint, options = {}) => {
        const baseUrl = Cypress.env('API_BASE_URL') || 'https://jsonplaceholder.typicode.com'

        const requestOptions = {
          method,
          url: `${baseUrl}${endpoint}`,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        }

        return cy.request(requestOptions).then(response => {
          cy.log(`${method} ${endpoint} - Status: ${response.status}`)
          return response
        })
      })

      // API 快捷命令
      Cypress.Commands.add('apiGet', (endpoint, options) =>
        cy.apiRequest('GET', endpoint, options))

      Cypress.Commands.add('apiPost', (endpoint, body, options) =>
        cy.apiRequest('POST', endpoint, { body, ...options }))

      Cypress.Commands.add('apiPut', (endpoint, body, options) =>
        cy.apiRequest('PUT', endpoint, { body, ...options }))

      Cypress.Commands.add('apiDelete', (endpoint, options) =>
        cy.apiRequest('DELETE', endpoint, options))

      // 使用 API 测试命令
      cy.apiGet('/posts/1').then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('id', 1)
        cy.log('✅ API GET 测试成功')
      })
    })
  })

  describe('🎯 实战练习', () => {

    it('🏆 练习：构建完整的测试工具包', () => {
      // 创建一个综合性的测试工具包
      const TestUtils = {
        // 等待工具
        waitForElement: (selector, timeout = 10000) => {
          cy.get(selector, { timeout }).should('exist').and('be.visible')
        },

        // 随机选择器
        selectRandom: (selector) => {
          cy.get(selector).then($elements => {
            const randomIndex = Math.floor(Math.random() * $elements.length)
            cy.wrap($elements[randomIndex]).click()
          })
        },

        // 表格操作
        clickTableCell: (row, column) => {
          cy.get(`table tr:nth-child(${row + 1}) td:nth-child(${column + 1})`).click()
        },

        // 模态框处理
        handleModal: (action = 'close') => {
          cy.get('.modal').should('be.visible')

          if (action === 'close') {
            cy.get('.modal-close, .modal .close, [data-cy="modal-close"]').click()
          } else if (action === 'confirm') {
            cy.get('.modal-confirm, [data-cy="modal-confirm"]').click()
          }

          cy.get('.modal').should('not.exist')
        },

        // 文件上传辅助
        uploadFile: (inputSelector, fileName, fileType = 'application/json') => {
          cy.get(inputSelector).selectFile({
            contents: Cypress.Buffer.from(JSON.stringify({ test: 'data' })),
            fileName,
            mimeType: fileType
          })
        }
      }

      // 将工具包添加为命令
      Object.keys(TestUtils).forEach(methodName => {
        Cypress.Commands.add(methodName, TestUtils[methodName])
      })

      cy.then(() => {
        cy.log('🛠️ 测试工具包已创建完成')
        cy.log('包含以下工具：')
        Object.keys(TestUtils).forEach(tool => {
          cy.log(`- ${tool}`)
        })
      })
    })

    it('🏆 练习：创建测试断言库', () => {
      // 创建自定义断言命令
      Cypress.Commands.add('shouldBeValidEmail', { prevSubject: true }, (subject) => {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
        expect(subject).to.match(emailRegex)
        return cy.wrap(subject)
      })

      Cypress.Commands.add('shouldBeValidPhoneNumber', { prevSubject: true }, (subject) => {
        const phoneRegex = /^[\\+]?[1-9][\\d]{0,15}$/
        expect(subject).to.match(phoneRegex)
        return cy.wrap(subject)
      })

      Cypress.Commands.add('shouldBeInRange', { prevSubject: true }, (subject, min, max) => {
        const num = typeof subject === 'string' ? parseFloat(subject) : subject
        expect(num).to.be.at.least(min)
        expect(num).to.be.at.most(max)
        return cy.wrap(subject)
      })

      // 测试自定义断言
      cy.wrap('test@example.com').shouldBeValidEmail()
      cy.wrap('+1234567890').shouldBeValidPhoneNumber()
      cy.wrap(50).shouldBeInRange(1, 100)

      cy.then(() => {
        cy.log('✅ 自定义断言库测试完成')
      })
    })
  })

  describe('💡 总结和最佳实践', () => {

    it('📚 自定义命令最佳实践总结', () => {
      cy.then(() => {
        cy.log('🛠️ 自定义命令核心技能 ✅')
        cy.log('1. ✅ 基础命令创建 (Cypress.Commands.add)')
        cy.log('2. ✅ 参数化命令设计')
        cy.log('3. ✅ 链式命令实现')
        cy.log('4. ✅ 表单处理命令')
        cy.log('5. ✅ 认证和会话命令')
        cy.log('6. ✅ 响应式测试命令')
        cy.log('7. ✅ Page Object 模式')
        cy.log('8. ✅ 第三方插件集成')

        cy.log('')
        cy.log('🎯 命令设计原则:')
        cy.log('1. 🔄 可复用性 - 抽象通用操作')
        cy.log('2. 📝 可读性 - 使用清晰的命名')
        cy.log('3. 🔧 可配置性 - 提供灵活的参数')
        cy.log('4. 🛡️ 错误处理 - 优雅的失败处理')
        cy.log('5. 📖 文档化 - 提供清晰的使用说明')

        cy.log('')
        cy.log('📈 下一步学习：数据驱动测试 (Day 13)')
        cy.log('🎯 重点：fixtures、参数化、批量测试')
      })
    })

    it('📋 命令使用指南', () => {
      cy.then(() => {
        cy.log('📋 自定义命令分类和使用场景：')
        cy.log('')

        cy.log('🔐 认证相关命令:')
        cy.log('- cy.loginAsUser(username, password)')
        cy.log('- cy.setupUserSession(userType)')
        cy.log('- cy.logout()')

        cy.log('')
        cy.log('📝 表单相关命令:')
        cy.log('- cy.fillForm(formData)')
        cy.log('- cy.validateForm(expectedData)')
        cy.log('- cy.submitForm()')

        cy.log('')
        cy.log('🎨 UI 相关命令:')
        cy.log('- cy.getByDataCy(selector)')
        cy.log('- cy.testResponsive(callback)')
        cy.log('- cy.handleModal(action)')

        cy.log('')
        cy.log('🔧 工具类命令:')
        cy.log('- cy.generateTestData(type)')
        cy.log('- cy.apiRequest(method, endpoint, options)')
        cy.log('- cy.dbSeed(seedType)')
      })
    })
  })
})

/**
 * 🌟 Day 12 学习要点总结：
 *
 * 1. **自定义命令基础**
 *    - Cypress.Commands.add() 语法
 *    - 命令参数和选项处理
 *    - 链式调用实现
 *
 * 2. **命令设计模式**
 *    - 参数化命令设计
 *    - 条件性执行
 *    - 错误处理机制
 *
 * 3. **表单和认证**
 *    - 复杂表单处理
 *    - 用户会话管理
 *    - 权限验证命令
 *
 * 4. **Page Object 模式**
 *    - 页面对象封装
 *    - 链式页面对象
 *    - 可维护性提升
 *
 * 5. **插件集成**
 *    - 数据生成插件
 *    - 数据库操作
 *    - API 测试辅助
 *
 * 6. **实用工具**
 *    - 响应式测试
 *    - 自定义断言
 *    - 测试工具包
 *
 * 💡 **设计原则**：
 * - 单一职责：每个命令专注一个功能
 * - 可复用性：抽象通用操作逻辑
 * - 可配置性：提供灵活的参数选项
 * - 文档化：清晰的使用说明和示例
 *
 * 🚀 **下一步**：掌握数据驱动测试和批量测试执行
 */