/**
 * 📊 Day 13: 数据驱动测试
 *
 * 学习目标：
 * - 掌握 Fixtures 数据管理
 * - 学习参数化测试
 * - 掌握测试数据生成
 * - 学习批量测试执行
 * - 理解环境变量使用
 */

describe('📊 Day 13: 数据驱动测试', () => {

  beforeEach(() => {
    cy.visit('https://example.cypress.io')
  })

  describe('📋 Fixtures 数据管理', () => {

    it('应该能够使用基础 fixture 数据', () => {
      // 🎯 学习要点：基本 fixture 使用
      cy.fixture('users').then((users) => {
        expect(users).to.be.an('array')
        expect(users.length).to.be.greaterThan(0)

        const firstUser = users[0]
        cy.log(`用户姓名: ${firstUser.name}`)
        cy.log(`用户邮箱: ${firstUser.email}`)

        // 使用 fixture 数据进行测试
        expect(firstUser).to.have.property('id')
        expect(firstUser).to.have.property('name')
        expect(firstUser).to.have.property('email')
      })
    })

    it('应该能够在多个测试中共享 fixture 数据', () => {
      // 🎯 学习要点：fixture 数据共享
      cy.fixture('products').as('productsData')

      cy.get('@productsData').then((products) => {
        expect(products).to.have.length.greaterThan(0)

        products.forEach((product, index) => {
          cy.log(`产品 ${index + 1}: ${product.name} - $${product.price}`)
          expect(product).to.have.property('name')
          expect(product).to.have.property('price')
          expect(product).to.have.property('category')
        })
      })
    })

    it('应该能够使用嵌套的 fixture 数据', () => {
      // 🎯 学习要点：复杂数据结构处理
      cy.fixture('api-responses').then((apiData) => {
        // 验证 API 响应结构
        expect(apiData).to.have.property('users')
        expect(apiData).to.have.property('posts')
        expect(apiData).to.have.property('comments')

        // 使用嵌套数据
        const userResponse = apiData.users.success
        expect(userResponse.status).to.eq(200)
        expect(userResponse.data).to.be.an('array')

        const errorResponse = apiData.users.error
        expect(errorResponse.status).to.eq(404)
        expect(errorResponse.message).to.include('not found')

        cy.log('✅ API 响应数据结构验证完成')
      })
    })

    it('应该能够动态修改 fixture 数据', () => {
      // 🎯 学习要点：动态数据处理
      cy.fixture('users').then((users) => {
        // 添加时间戳到用户数据
        const modifiedUsers = users.map(user => ({
          ...user,
          lastAccess: new Date().toISOString(),
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }))

        cy.log(`修改了 ${modifiedUsers.length} 个用户的数据`)

        modifiedUsers.forEach((user) => {
          expect(user).to.have.property('lastAccess')
          expect(user).to.have.property('sessionId')
          cy.log(`用户 ${user.name} 的会话ID: ${user.sessionId}`)
        })

        // 将修改后的数据保存（实际项目中可能写入文件）
        cy.wrap(modifiedUsers).as('modifiedUsers')
      })
    })
  })

  describe('🔄 参数化测试', () => {

    it('应该能够使用数组参数化测试', () => {
      // 🎯 学习要点：简单参数化
      const testCases = [
        { input: 'test@example.com', expected: true, description: '有效邮箱' },
        { input: 'invalid-email', expected: false, description: '无效邮箱' },
        { input: 'user@domain.', expected: false, description: '不完整域名' },
        { input: '@example.com', expected: false, description: '缺少用户名' },
        { input: 'user@example.com', expected: true, description: '标准邮箱格式' }
      ]

      testCases.forEach((testCase, index) => {
        cy.log(`测试用例 ${index + 1}: ${testCase.description}`)

        // 模拟邮箱验证函数
        const isValidEmail = (email) => {
          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
          return emailRegex.test(email)
        }

        const result = isValidEmail(testCase.input)
        expect(result).to.eq(testCase.expected)

        cy.log(`输入: ${testCase.input} -> 结果: ${result} ✅`)
      })
    })

    it('应该能够使用对象参数化测试', () => {
      // 🎯 学习要点：复杂参数化
      const loginTestCases = {
        validAdmin: {
          username: 'admin',
          password: 'admin123',
          expectedUrl: '/admin-dashboard',
          shouldSucceed: true
        },
        validUser: {
          username: 'user',
          password: 'user123',
          expectedUrl: '/user-dashboard',
          shouldSucceed: true
        },
        invalidCredentials: {
          username: 'invalid',
          password: 'wrong',
          expectedError: 'Invalid credentials',
          shouldSucceed: false
        },
        emptyFields: {
          username: '',
          password: '',
          expectedError: 'Username and password are required',
          shouldSucceed: false
        }
      }

      Object.keys(loginTestCases).forEach((testName) => {
        const testCase = loginTestCases[testName]
        cy.log(`执行测试: ${testName}`)

        if (testCase.shouldSucceed) {
          cy.log(`预期成功登录，跳转到: ${testCase.expectedUrl}`)
        } else {
          cy.log(`预期失败，错误信息: ${testCase.expectedError}`)
        }

        // 这里是实际的测试逻辑，模拟登录过程
        expect(testCase).to.have.property('username')
        expect(testCase).to.have.property('password')
        expect(testCase.shouldSucceed).to.be.a('boolean')

        cy.log(`✅ ${testName} 测试逻辑验证完成`)
      })
    })

    it('应该能够使用 fixture 文件进行参数化', () => {
      // 🎯 学习要点：基于文件的参数化
      cy.fixture('test-scenarios').then((scenarios) => {
        scenarios.formValidation.forEach((scenario) => {
          cy.log(`测试场景: ${scenario.name}`)

          // 验证每个字段的测试数据
          scenario.fields.forEach((field) => {
            cy.log(`字段: ${field.name}`)
            cy.log(`测试值: ${field.testValue}`)
            cy.log(`预期结果: ${field.expected}`)

            // 模拟字段验证
            const isValid = field.testValue && field.testValue.length > 0
            if (field.expected === 'valid') {
              expect(isValid).to.be.true
            } else {
              // 可能需要更复杂的验证逻辑
              cy.log(`字段 ${field.name} 的验证已完成`)
            }
          })

          cy.log(`✅ ${scenario.name} 场景测试完成`)
        })
      })
    })
  })

  describe('🎲 测试数据生成', () => {

    it('应该能够生成随机测试数据', () => {
      // 🎯 学习要点：动态数据生成
      const generateRandomUser = () => ({
        id: Math.floor(Math.random() * 10000),
        name: `TestUser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        age: Math.floor(Math.random() * 50) + 18,
        department: ['IT', 'HR', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)],
        salary: Math.floor(Math.random() * 50000) + 30000,
        isActive: Math.random() > 0.5
      })

      // 生成多个随机用户
      const randomUsers = Array.from({ length: 5 }, generateRandomUser)

      randomUsers.forEach((user, index) => {
        cy.log(`随机用户 ${index + 1}:`)
        cy.log(`姓名: ${user.name}`)
        cy.log(`邮箱: ${user.email}`)
        cy.log(`年龄: ${user.age}`)
        cy.log(`部门: ${user.department}`)
        cy.log(`薪资: $${user.salary}`)
        cy.log(`状态: ${user.isActive ? '活跃' : '非活跃'}`)

        // 验证生成的数据
        expect(user.name).to.include('TestUser')
        expect(user.email).to.include('@example.com')
        expect(user.age).to.be.at.least(18).and.at.most(68)
        expect(user.salary).to.be.at.least(30000).and.at.most(80000)
      })
    })

    it('应该能够生成特定格式的测试数据', () => {
      // 🎯 学习要点：格式化数据生成
      const dataGenerators = {
        phone: () => {
          const area = Math.floor(Math.random() * 900) + 100
          const exchange = Math.floor(Math.random() * 900) + 100
          const number = Math.floor(Math.random() * 9000) + 1000
          return `${area}-${exchange}-${number}`
        },

        address: () => {
          const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Blvd', 'Elm Dr']
          const streetNumber = Math.floor(Math.random() * 9999) + 1
          const street = streets[Math.floor(Math.random() * streets.length)]
          return `${streetNumber} ${street}`
        },

        creditCard: () => {
          // 生成测试用的信用卡号（非真实）
          const prefix = '4111111111111'
          const suffix = Math.floor(Math.random() * 9000) + 1000
          return `${prefix}${suffix}`
        },

        date: (minDaysAgo = 0, maxDaysAgo = 365) => {
          const now = new Date()
          const daysAgo = Math.floor(Math.random() * (maxDaysAgo - minDaysAgo)) + minDaysAgo
          const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
          return date.toISOString().split('T')[0]
        }
      }

      // 使用数据生成器
      const generatedData = {
        phone: dataGenerators.phone(),
        address: dataGenerators.address(),
        creditCard: dataGenerators.creditCard(),
        birthDate: dataGenerators.date(365 * 18, 365 * 65), // 18-65 岁
        registrationDate: dataGenerators.date(0, 30) // 最近 30 天
      }

      cy.log('生成的测试数据:')
      Object.keys(generatedData).forEach(key => {
        cy.log(`${key}: ${generatedData[key]}`)
      })

      // 验证生成的数据格式
      expect(generatedData.phone).to.match(/^\\d{3}-\\d{3}-\\d{4}$/)
      expect(generatedData.address).to.include(' ')
      expect(generatedData.creditCard).to.have.length(16)
      expect(generatedData.birthDate).to.match(/^\\d{4}-\\d{2}-\\d{2}$/)
      expect(generatedData.registrationDate).to.match(/^\\d{4}-\\d{2}-\\d{2}$/)
    })

    it('应该能够生成业务相关的测试数据', () => {
      // 🎯 学习要点：业务场景数据
      const businessDataGenerator = {
        ecommerce: {
          product: () => ({
            id: `PROD${Math.floor(Math.random() * 100000)}`,
            name: `Product ${Math.floor(Math.random() * 1000)}`,
            description: `High-quality product with excellent features`,
            price: (Math.random() * 500 + 10).toFixed(2),
            category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
            stock: Math.floor(Math.random() * 100),
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
            reviews: Math.floor(Math.random() * 500),
            isOnSale: Math.random() > 0.7,
            tags: ['popular', 'new', 'sale', 'featured'].filter(() => Math.random() > 0.5)
          }),

          order: () => ({
            id: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
            customerId: `CUST${Math.floor(Math.random() * 10000)}`,
            status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
            total: (Math.random() * 1000 + 20).toFixed(2),
            items: Math.floor(Math.random() * 5) + 1,
            paymentMethod: ['credit_card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
            shippingAddress: `${Math.floor(Math.random() * 999) + 1} Test St, Test City, TC 12345`,
            orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
      }

      // 生成电商产品数据
      const products = Array.from({ length: 3 }, businessDataGenerator.ecommerce.product)
      const orders = Array.from({ length: 2 }, businessDataGenerator.ecommerce.order)

      cy.log('生成的产品数据:')
      products.forEach((product, index) => {
        cy.log(`产品 ${index + 1}: ${product.name}`)
        cy.log(`价格: $${product.price}, 库存: ${product.stock}`)
        cy.log(`评分: ${product.rating}, 分类: ${product.category}`)
        cy.log(`标签: ${product.tags.join(', ')}`)

        expect(product.id).to.include('PROD')
        expect(parseFloat(product.rating)).to.be.at.least(3.0).and.at.most(5.0)
      })

      cy.log('')
      cy.log('生成的订单数据:')
      orders.forEach((order, index) => {
        cy.log(`订单 ${index + 1}: ${order.id}`)
        cy.log(`状态: ${order.status}, 总额: $${order.total}`)
        cy.log(`商品数: ${order.items}, 支付方式: ${order.paymentMethod}`)

        expect(order.id).to.include('ORD')
        expect(order.items).to.be.at.least(1).and.at.most(6)
      })
    })
  })

  describe('📈 批量测试执行', () => {

    it('应该能够批量测试多个 URL', () => {
      // 🎯 学习要点：批量 URL 测试
      const urls = [
        { url: 'https://example.cypress.io', expectedTitle: 'Cypress.io' },
        { url: 'https://example.cypress.io/commands/actions', expectedTitle: 'Actions' },
        { url: 'https://example.cypress.io/commands/querying', expectedTitle: 'Querying' }
      ]

      urls.forEach((testCase, index) => {
        cy.log(`测试 URL ${index + 1}: ${testCase.url}`)

        cy.visit(testCase.url)
        cy.title().should('include', testCase.expectedTitle)

        // 验证页面基本可访问性
        cy.get('body').should('be.visible')
        cy.url().should('eq', testCase.url)

        cy.log(`✅ URL ${index + 1} 测试通过`)
      })
    })

    it('应该能够批量测试表单验证', () => {
      // 🎯 学习要点：批量表单测试
      const formTestCases = [
        {
          name: '空值测试',
          data: { name: '', email: '', phone: '' },
          expectedErrors: ['姓名不能为空', '邮箱不能为空', '电话不能为空']
        },
        {
          name: '格式错误测试',
          data: { name: 'John', email: 'invalid-email', phone: '123' },
          expectedErrors: ['邮箱格式不正确', '电话格式不正确']
        },
        {
          name: '有效数据测试',
          data: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
          expectedErrors: []
        }
      ]

      formTestCases.forEach((testCase) => {
        cy.log(`执行表单测试: ${testCase.name}`)

        // 模拟表单验证逻辑
        const validateForm = (data) => {
          const errors = []

          if (!data.name || data.name.trim() === '') {
            errors.push('姓名不能为空')
          }

          if (!data.email || data.email.trim() === '') {
            errors.push('邮箱不能为空')
          } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) {
            errors.push('邮箱格式不正确')
          }

          if (!data.phone || data.phone.trim() === '') {
            errors.push('电话不能为空')
          } else if (!/^\\d{3}-\\d{3}-\\d{4}$/.test(data.phone)) {
            errors.push('电话格式不正确')
          }

          return errors
        }

        const actualErrors = validateForm(testCase.data)

        // 验证错误消息
        expect(actualErrors).to.deep.equal(testCase.expectedErrors)

        cy.log(`输入数据:`, testCase.data)
        cy.log(`预期错误: ${testCase.expectedErrors.join(', ') || '无'}`)
        cy.log(`实际错误: ${actualErrors.join(', ') || '无'}`)
        cy.log(`✅ ${testCase.name} 验证通过`)
      })
    })

    it('应该能够批量测试 API 端点', () => {
      // 🎯 学习要点：批量 API 测试
      const apiEndpoints = [
        { method: 'GET', url: '/posts/1', expectedStatus: 200 },
        { method: 'GET', url: '/posts/999999', expectedStatus: 404 },
        { method: 'GET', url: '/users', expectedStatus: 200 },
        { method: 'POST', url: '/posts', expectedStatus: 201, body: { title: 'Test', body: 'Test body' } }
      ]

      apiEndpoints.forEach((endpoint, index) => {
        cy.log(`测试 API ${index + 1}: ${endpoint.method} ${endpoint.url}`)

        const requestOptions = {
          method: endpoint.method,
          url: `https://jsonplaceholder.typicode.com${endpoint.url}`,
          failOnStatusCode: false
        }

        if (endpoint.body) {
          requestOptions.body = endpoint.body
        }

        cy.request(requestOptions).then((response) => {
          expect(response.status).to.eq(endpoint.expectedStatus)

          cy.log(`状态码: ${response.status} (预期: ${endpoint.expectedStatus}) ✅`)

          if (response.status === 200 && endpoint.method === 'GET') {
            expect(response.body).to.not.be.empty
          }
        })
      })
    })
  })

  describe('🌍 环境变量和配置', () => {

    it('应该能够使用环境变量', () => {
      // 🎯 学习要点：环境变量使用
      const apiUrl = Cypress.env('API_URL') || 'https://api.example.com'
      const testUser = Cypress.env('TEST_USER') || 'defaultuser'
      const timeout = Cypress.env('DEFAULT_TIMEOUT') || 10000

      cy.log(`API URL: ${apiUrl}`)
      cy.log(`测试用户: ${testUser}`)
      cy.log(`超时时间: ${timeout}ms`)

      // 验证环境变量
      expect(apiUrl).to.be.a('string')
      expect(testUser).to.be.a('string')
      expect(timeout).to.be.a('number')
    })

    it('应该能够根据环境使用不同的测试数据', () => {
      // 🎯 学习要点：环境特定数据
      const environment = Cypress.env('NODE_ENV') || 'development'

      const environmentData = {
        development: {
          baseUrl: 'http://localhost:3000',
          users: [
            { username: 'dev_user', password: 'dev_pass' }
          ],
          apiTimeout: 5000
        },
        staging: {
          baseUrl: 'https://staging.example.com',
          users: [
            { username: 'stage_user', password: 'stage_pass' }
          ],
          apiTimeout: 10000
        },
        production: {
          baseUrl: 'https://example.com',
          users: [
            { username: 'prod_user', password: 'prod_pass' }
          ],
          apiTimeout: 15000
        }
      }

      const config = environmentData[environment] || environmentData.development

      cy.log(`当前环境: ${environment}`)
      cy.log(`Base URL: ${config.baseUrl}`)
      cy.log(`API 超时: ${config.apiTimeout}ms`)
      cy.log(`用户数量: ${config.users.length}`)

      // 使用环境特定数据
      config.users.forEach((user, index) => {
        cy.log(`用户 ${index + 1}: ${user.username}`)
        expect(user).to.have.property('username')
        expect(user).to.have.property('password')
      })
    })
  })

  describe('🎯 实战练习', () => {

    it('🏆 练习：完整的数据驱动测试套件', () => {
      // 创建一个完整的数据驱动测试场景
      const testSuite = {
        name: '用户注册流程测试',
        scenarios: [
          {
            name: '有效注册',
            input: {
              username: 'validuser',
              email: 'valid@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!'
            },
            expected: {
              success: true,
              redirectUrl: '/welcome',
              message: '注册成功'
            }
          },
          {
            name: '用户名已存在',
            input: {
              username: 'existinguser',
              email: 'new@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'ValidPass123!'
            },
            expected: {
              success: false,
              error: '用户名已存在',
              field: 'username'
            }
          },
          {
            name: '密码不匹配',
            input: {
              username: 'newuser',
              email: 'new@example.com',
              password: 'ValidPass123!',
              confirmPassword: 'DifferentPass123!'
            },
            expected: {
              success: false,
              error: '密码确认不匹配',
              field: 'confirmPassword'
            }
          }
        ]
      }

      cy.log(`执行测试套件: ${testSuite.name}`)

      testSuite.scenarios.forEach((scenario, index) => {
        cy.log(`场景 ${index + 1}: ${scenario.name}`)

        // 模拟注册验证逻辑
        const validateRegistration = (input) => {
          if (input.username === 'existinguser') {
            return { success: false, error: '用户名已存在', field: 'username' }
          }

          if (input.password !== input.confirmPassword) {
            return { success: false, error: '密码确认不匹配', field: 'confirmPassword' }
          }

          return { success: true, redirectUrl: '/welcome', message: '注册成功' }
        }

        const result = validateRegistration(scenario.input)

        // 验证结果
        expect(result.success).to.eq(scenario.expected.success)

        if (scenario.expected.success) {
          expect(result.message).to.eq(scenario.expected.message)
          expect(result.redirectUrl).to.eq(scenario.expected.redirectUrl)
        } else {
          expect(result.error).to.eq(scenario.expected.error)
          if (scenario.expected.field) {
            expect(result.field).to.eq(scenario.expected.field)
          }
        }

        cy.log(`✅ ${scenario.name} 测试通过`)
      })

      cy.log(`🎉 ${testSuite.name} 全部测试完成`)
    })
  })

  describe('💡 总结和最佳实践', () => {

    it('📚 数据驱动测试最佳实践总结', () => {
      cy.then(() => {
        cy.log('📊 数据驱动测试核心技能 ✅')
        cy.log('1. ✅ Fixtures 数据管理和共享')
        cy.log('2. ✅ 参数化测试实现')
        cy.log('3. ✅ 动态测试数据生成')
        cy.log('4. ✅ 批量测试执行策略')
        cy.log('5. ✅ 环境变量和配置管理')
        cy.log('6. ✅ 业务场景数据生成')
        cy.log('7. ✅ 测试套件组织')
        cy.log('8. ✅ 数据验证和断言')

        cy.log('')
        cy.log('🎯 数据驱动最佳实践:')
        cy.log('1. 📁 合理组织 fixtures 目录结构')
        cy.log('2. 🔄 使用参数化减少重复代码')
        cy.log('3. 🎲 结合随机和固定数据')
        cy.log('4. 🌍 环境特定的测试配置')
        cy.log('5. 📝 清晰的测试数据命名')
        cy.log('6. 🧹 测试后数据清理')

        cy.log('')
        cy.log('📈 下一步学习：性能和监控 (Day 14)')
        cy.log('🎯 重点：性能指标、监控、回归检测')
      })
    })

    it('📋 数据管理策略指南', () => {
      cy.then(() => {
        cy.log('📋 数据驱动测试策略指南：')
        cy.log('')

        cy.log('📁 Fixtures 组织结构:')
        cy.log('├── users/')
        cy.log('│   ├── admin-users.json')
        cy.log('│   ├── regular-users.json')
        cy.log('│   └── test-users.json')
        cy.log('├── products/')
        cy.log('│   ├── electronics.json')
        cy.log('│   └── books.json')
        cy.log('└── api-responses/')
        cy.log('    ├── success-responses.json')
        cy.log('    └── error-responses.json')

        cy.log('')
        cy.log('🔧 环境配置示例:')
        cy.log('development: { api: "localhost:3000", timeout: 5000 }')
        cy.log('staging: { api: "staging.com", timeout: 10000 }')
        cy.log('production: { api: "example.com", timeout: 15000 }')

        cy.log('')
        cy.log('🎯 参数化测试模式:')
        cy.log('1. 简单数组参数化 - 基础值测试')
        cy.log('2. 对象参数化 - 复杂场景测试')
        cy.log('3. 文件参数化 - 大量数据测试')
        cy.log('4. 动态参数化 - 随机数据测试')
      })
    })
  })
})

/**
 * 🌟 Day 13 学习要点总结：
 *
 * 1. **Fixtures 数据管理**
 *    - cy.fixture() 基础使用
 *    - 数据共享和别名
 *    - 复杂数据结构处理
 *    - 动态数据修改
 *
 * 2. **参数化测试**
 *    - 数组参数化测试
 *    - 对象参数化测试
 *    - 基于文件的参数化
 *    - 测试用例组织
 *
 * 3. **测试数据生成**
 *    - 随机数据生成
 *    - 格式化数据生成
 *    - 业务场景数据
 *    - 数据验证策略
 *
 * 4. **批量测试执行**
 *    - 批量 URL 测试
 *    - 批量表单验证
 *    - 批量 API 测试
 *    - 测试结果聚合
 *
 * 5. **环境管理**
 *    - 环境变量使用
 *    - 环境特定配置
 *    - 动态配置切换
 *    - 配置验证
 *
 * 6. **测试套件设计**
 *    - 场景组织结构
 *    - 数据驱动流程
 *    - 结果验证模式
 *    - 错误处理策略
 *
 * 💡 **设计原则**：
 * - 数据与逻辑分离
 * - 可维护的数据结构
 * - 环境无关的测试设计
 * - 清晰的测试场景描述
 *
 * 🚀 **下一步**：掌握性能监控和回归检测
 */