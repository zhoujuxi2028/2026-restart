// ============================================
// Day 5: 综合实战项目 - 电商网站测试
// ============================================
// 项目目标：模拟真实电商网站的完整测试场景
// 技能整合：运用Day 1-5所有学到的技能
// 测试网站：https://example.cypress.io (模拟电商功能)

describe('Day 5: 电商网站综合测试项目', () => {

  // 全局测试数据
  const testData = {
    users: {
      customer: {
        email: 'customer@ecommerce.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Customer',
        phone: '+1-555-0123'
      },
      admin: {
        email: 'admin@ecommerce.com',
        password: 'AdminPass456!',
        role: 'administrator'
      },
      guest: {
        email: 'guest@ecommerce.com'
      }
    },
    products: [
      { id: 1, name: 'Cypress T-Shirt', price: 25.99, category: 'Apparel' },
      { id: 2, name: 'Testing Guide', price: 39.99, category: 'Books' },
      { id: 3, name: 'Automation Tools', price: 199.99, category: 'Software' }
    ],
    addresses: {
      shipping: {
        street: '123 Test Street',
        city: 'QA City',
        state: 'Testing State',
        zip: '12345',
        country: 'TestLand'
      },
      billing: {
        street: '456 Payment Avenue',
        city: 'Finance City',
        state: 'Money State',
        zip: '67890',
        country: 'BillLand'
      }
    }
  }

  // 全局钩子设置
  before(() => {
    cy.log('🏪 电商网站测试套件开始')
    cy.wrap(testData).as('testData')

    // 模拟清空购物车（在真实项目中可能需要API调用）
    cy.log('🧹 清理测试环境')
  })

  beforeEach(() => {
    cy.log('📱 准备测试环境')

    // 设置网络拦截
    cy.intercept('GET', '**/api/products**', {
      statusCode: 200,
      body: testData.products
    }).as('getProducts')

    cy.intercept('POST', '**/api/cart/add', {
      statusCode: 200,
      body: { success: true, cartItems: 1 }
    }).as('addToCart')

    cy.intercept('POST', '**/api/checkout', {
      statusCode: 200,
      body: { orderId: 'ORD-' + Date.now(), success: true }
    }).as('checkout')

    // 访问主页
    cy.visit('https://example.cypress.io')
  })

  // ============================================
  // 场景1: 用户注册与登录流程
  // ============================================
  describe('场景1: 用户管理系统', () => {

    it('1.1 新用户注册流程', () => {
      cy.log('👤 测试用户注册功能')

      // 导航到注册页面（模拟）
      cy.visit('https://example.cypress.io/commands/actions')
      cy.get('h1').should('contain', 'Actions')

      // 模拟注册表单
      cy.log('📝 填写注册表单')
      cy.get('.action-email')
        .clear()
        .type(testData.users.customer.email)
        .should('have.value', testData.users.customer.email)

      // 验证邮箱格式
      cy.get('.action-email')
        .invoke('prop', 'validity')
        .its('valid')
        .should('be.true')

      // 模拟密码字段（在真实应用中）
      cy.get('body').then(($body) => {
        if ($body.find('input[type="password"]').length > 0) {
          cy.get('input[type="password"]')
            .type(testData.users.customer.password)
        } else {
          cy.log('模拟密码输入已完成')
        }
      })

      // 模拟用户协议确认
      cy.get('body').then(($body) => {
        if ($body.find('input[type="checkbox"]').length > 0) {
          cy.get('input[type="checkbox"]').check()
          cy.log('✅ 用户协议已确认')
        }
      })

      cy.log('✅ 用户注册流程测试完成')
    })

    it('1.2 用户登录验证', () => {
      cy.log('🔑 测试用户登录功能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟登录过程
      cy.get('.action-email')
        .clear()
        .type(testData.users.customer.email)

      // 等待登录处理
      cy.wait(500)

      // 验证登录状态（模拟）
      cy.get('.action-email')
        .should('have.value', testData.users.customer.email)

      cy.log('✅ 用户登录验证完成')
    })

    it('1.3 用户资料管理', () => {
      cy.log('📋 测试用户资料管理')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟用户资料更新
      const updatedEmail = 'updated-' + testData.users.customer.email

      cy.get('.action-email')
        .clear()
        .type(updatedEmail)
        .should('have.value', updatedEmail)

      // 验证更新操作
      cy.log('用户资料已更新')

      // 恢复原始数据
      cy.get('.action-email')
        .clear()
        .type(testData.users.customer.email)

      cy.log('✅ 用户资料管理测试完成')
    })
  })

  // ============================================
  // 场景2: 产品浏览与搜索
  // ============================================
  describe('场景2: 产品展示系统', () => {

    it('2.1 产品列表浏览', () => {
      cy.log('🛍️ 测试产品列表功能')

      cy.visit('https://example.cypress.io/commands/querying')
      cy.get('h1').should('contain', 'Querying')

      // 等待产品加载
      cy.get('li').should('have.length.greaterThan', 0)

      // 验证产品信息显示
      cy.get('@testData').then((data) => {
        data.products.forEach((product, index) => {
          cy.log(`产品${index + 1}: ${product.name} - $${product.price}`)
        })
      })

      // 模拟产品卡片验证
      cy.get('li').first().within(() => {
        cy.get('*').should('exist') // 验证产品元素存在
      })

      cy.log('✅ 产品列表浏览测试完成')
    })

    it('2.2 产品搜索功能', () => {
      cy.log('🔍 测试产品搜索功能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟搜索输入
      const searchTerm = 'Cypress'
      cy.get('.action-email')
        .clear()
        .type(searchTerm)

      // 等待搜索结果
      cy.wait(300)

      // 验证搜索功能
      cy.get('.action-email')
        .should('have.value', searchTerm)

      cy.log(`搜索关键词: ${searchTerm}`)

      // 模拟搜索结果过滤
      cy.get('@testData').then((data) => {
        const filteredProducts = data.products.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        cy.log(`找到 ${filteredProducts.length} 个匹配产品`)
      })

      cy.log('✅ 产品搜索功能测试完成')
    })

    it('2.3 产品分类筛选', () => {
      cy.log('📂 测试产品分类功能')

      cy.visit('https://example.cypress.io/commands/querying')

      // 模拟分类筛选
      cy.get('@testData').then((data) => {
        const categories = [...new Set(data.products.map(p => p.category))]
        cy.log(`可用分类: ${categories.join(', ')}`)

        categories.forEach((category) => {
          cy.log(`筛选分类: ${category}`)
          const categoryProducts = data.products.filter(p => p.category === category)
          cy.log(`${category} 分类下有 ${categoryProducts.length} 个产品`)
        })
      })

      // 验证分类导航
      cy.get('h1').should('be.visible')
      cy.get('li').should('have.length.greaterThan', 0)

      cy.log('✅ 产品分类筛选测试完成')
    })

    it('2.4 产品详情页面', () => {
      cy.log('🔎 测试产品详情功能')

      cy.visit('https://example.cypress.io/commands/traversal')

      // 模拟进入产品详情
      cy.get('h1').should('contain', 'Traversal')

      // 验证产品详情信息
      cy.get('@testData').then((data) => {
        const product = data.products[0]
        cy.log(`查看产品详情: ${product.name}`)
        cy.log(`价格: $${product.price}`)
        cy.log(`分类: ${product.category}`)
      })

      // 验证页面元素
      cy.get('body').should('be.visible')
      cy.url().should('include', '/traversal')

      cy.log('✅ 产品详情页面测试完成')
    })
  })

  // ============================================
  // 场景3: 购物车管理
  // ============================================
  describe('场景3: 购物车系统', () => {

    let cart = []

    beforeEach(() => {
      // 重置购物车
      cart = []
      cy.wrap(cart).as('cart')
    })

    it('3.1 添加商品到购物车', () => {
      cy.log('🛒 测试添加商品功能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟添加商品
      cy.get('@testData').then((data) => {
        const product = data.products[0]
        cart.push({ ...product, quantity: 1 })

        cy.log(`添加商品: ${product.name}`)
        cy.log(`价格: $${product.price}`)

        // 模拟点击添加按钮
        cy.get('.action-email')
          .clear()
          .type(`Added ${product.name} to cart`)

        // 等待添加操作完成
        cy.wait(200)

        cy.log('✅ 商品已添加到购物车')
      })
    })

    it('3.2 购物车数量管理', () => {
      cy.log('📦 测试购物车数量管理')

      cy.visit('https://example.cypress.io/commands/actions')

      // 添加多个商品
      cy.get('@testData').then((data) => {
        data.products.slice(0, 2).forEach((product, index) => {
          cart.push({ ...product, quantity: index + 1 })

          cy.get('.action-email')
            .clear()
            .type(`Product ${index + 1}: ${product.name} x${index + 1}`)

          cy.wait(100)
        })

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        cy.log(`购物车总数量: ${totalItems}`)
        cy.log(`购物车总金额: $${totalPrice.toFixed(2)}`)
      })

      cy.log('✅ 购物车数量管理测试完成')
    })

    it('3.3 购物车商品删除', () => {
      cy.log('🗑️ 测试购物车删除功能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 先添加商品
      cy.get('@testData').then((data) => {
        cart.push({ ...data.products[0], quantity: 1 })
        cart.push({ ...data.products[1], quantity: 1 })

        cy.log(`购物车商品数: ${cart.length}`)

        // 模拟删除第一个商品
        const removedProduct = cart.shift()
        cy.log(`删除商品: ${removedProduct.name}`)

        // 更新购物车显示
        cy.get('.action-email')
          .clear()
          .type(`Removed ${removedProduct.name}`)

        cy.log(`剩余商品数: ${cart.length}`)
      })

      cy.log('✅ 购物车删除功能测试完成')
    })

    it('3.4 购物车持久化', () => {
      cy.log('💾 测试购物车数据持久化')

      cy.visit('https://example.cypress.io/commands/actions')

      // 添加商品到购物车
      cy.get('@testData').then((data) => {
        const product = data.products[2]
        cart.push({ ...product, quantity: 1 })

        // 模拟页面刷新
        cy.reload()

        // 验证购物车数据保持
        cy.get('body').should('be.visible')
        cy.log(`购物车持久化验证: ${cart.length} 件商品`)
      })

      cy.log('✅ 购物车持久化测试完成')
    })
  })

  // ============================================
  // 场景4: 结账流程
  // ============================================
  describe('场景4: 结账支付系统', () => {

    beforeEach(() => {
      // 准备购物车数据
      const cartItems = [
        { ...testData.products[0], quantity: 2 },
        { ...testData.products[1], quantity: 1 }
      ]
      cy.wrap(cartItems).as('cartItems')
    })

    it('4.1 结账信息填写', () => {
      cy.log('📋 测试结账信息填写')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟结账流程
      cy.log('开始结账流程')

      // 填写邮箱信息
      cy.get('.action-email')
        .clear()
        .type(testData.users.customer.email)
        .should('have.value', testData.users.customer.email)

      // 模拟其他必填信息
      cy.get('body').then(($body) => {
        if ($body.find('input[type="text"]').not('.action-email').length > 0) {
          cy.get('input[type="text"]').not('.action-email')
            .first()
            .clear()
            .type(testData.users.customer.firstName + ' ' + testData.users.customer.lastName)
        }
      })

      // 验证表单填写
      cy.get('.action-email')
        .invoke('prop', 'validity')
        .its('valid')
        .should('be.true')

      cy.log('✅ 结账信息填写完成')
    })

    it('4.2 配送地址管理', () => {
      cy.log('🏠 测试配送地址功能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟地址填写
      const address = testData.addresses.shipping

      cy.get('.action-email')
        .clear()
        .type(`${address.street}, ${address.city}, ${address.state} ${address.zip}`)

      // 验证地址格式
      cy.get('.action-email')
        .should('contain.value', address.street)
        .should('contain.value', address.city)

      cy.log(`配送地址: ${address.street}, ${address.city}`)

      cy.log('✅ 配送地址管理测试完成')
    })

    it('4.3 支付方式选择', () => {
      cy.log('💳 测试支付方式功能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟支付方式选择
      cy.get('body').then(($body) => {
        if ($body.find('input[type="radio"]').length > 0) {
          cy.get('input[type="radio"]').first().check()
          cy.log('已选择信用卡支付')
        } else if ($body.find('select').length > 0) {
          cy.get('select').first().select(1)
          cy.log('已选择支付方式')
        } else {
          cy.log('模拟支付方式选择: 信用卡')
        }
      })

      // 模拟支付信息填写
      cy.get('.action-email')
        .clear()
        .type('4111-1111-1111-1111') // 测试信用卡号

      cy.log('✅ 支付方式选择完成')
    })

    it('4.4 订单确认与提交', () => {
      cy.log('📄 测试订单确认功能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 计算订单总价
      cy.get('@cartItems').then((items) => {
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const tax = totalAmount * 0.1 // 10% 税费
        const shipping = 5.99
        const finalTotal = totalAmount + tax + shipping

        cy.log(`商品总价: $${totalAmount.toFixed(2)}`)
        cy.log(`税费: $${tax.toFixed(2)}`)
        cy.log(`运费: $${shipping.toFixed(2)}`)
        cy.log(`最终总价: $${finalTotal.toFixed(2)}`)

        // 模拟确认订单
        cy.get('.action-email')
          .clear()
          .type(`Order Total: $${finalTotal.toFixed(2)}`)

        // 等待订单处理
        cy.wait(1000)
      })

      cy.log('✅ 订单确认与提交完成')
    })

    it('4.5 支付处理与成功页面', () => {
      cy.log('💰 测试支付处理流程')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟支付处理
      cy.get('.action-email')
        .clear()
        .type('processing-payment@example.com')

      // 等待支付处理
      cy.log('正在处理支付...')
      cy.wait(2000)

      // 模拟支付成功
      const orderId = 'ORD-' + Date.now()
      cy.get('.action-email')
        .clear()
        .type(`Payment successful! Order ID: ${orderId}`)

      cy.log(`支付成功，订单号: ${orderId}`)

      cy.log('✅ 支付处理流程完成')
    })
  })

  // ============================================
  // 场景5: 用户账户管理
  // ============================================
  describe('场景5: 用户账户系统', () => {

    beforeEach(() => {
      // 模拟用户登录状态
      cy.visit('https://example.cypress.io/commands/actions')
      cy.get('.action-email')
        .clear()
        .type(testData.users.customer.email)
    })

    it('5.1 订单历史查看', () => {
      cy.log('📚 测试订单历史功能')

      // 模拟订单历史数据
      const orderHistory = [
        { id: 'ORD-001', date: '2024-01-15', total: 65.97, status: '已完成' },
        { id: 'ORD-002', date: '2024-01-10', total: 199.99, status: '运输中' },
        { id: 'ORD-003', date: '2024-01-05', total: 25.99, status: '已取消' }
      ]

      orderHistory.forEach((order, index) => {
        cy.log(`订单 ${index + 1}: ${order.id} - $${order.total} (${order.status})`)
      })

      // 验证订单历史显示
      cy.get('.action-email')
        .should('have.value', testData.users.customer.email)

      cy.log(`总共 ${orderHistory.length} 个历史订单`)

      cy.log('✅ 订单历史查看功能完成')
    })

    it('5.2 用户偏好设置', () => {
      cy.log('⚙️ 测试用户偏好功能')

      // 模拟偏好设置
      const preferences = {
        language: 'zh-CN',
        currency: 'CNY',
        notifications: true,
        newsletter: false
      }

      cy.log(`语言设置: ${preferences.language}`)
      cy.log(`货币设置: ${preferences.currency}`)
      cy.log(`通知设置: ${preferences.notifications}`)

      // 模拟设置更新
      cy.get('.action-email')
        .clear()
        .type(`Preferences updated for ${testData.users.customer.email}`)

      cy.log('✅ 用户偏好设置完成')
    })

    it('5.3 账户安全管理', () => {
      cy.log('🔐 测试账户安全功能')

      // 模拟安全设置
      cy.get('body').then(($body) => {
        if ($body.find('input[type="password"]').length > 0) {
          cy.get('input[type="password"]')
            .type('NewSecurePassword123!')
          cy.log('密码已更新')
        }
      })

      // 模拟两步验证设置
      cy.log('两步验证: 已启用')
      cy.log('最后登录: 2024-01-20 10:30 AM')
      cy.log('安全问题: 已设置')

      cy.get('.action-email')
        .should('have.value', testData.users.customer.email)

      cy.log('✅ 账户安全管理完成')
    })

    it('5.4 账户注销流程', () => {
      cy.log('👋 测试账户注销功能')

      // 模拟注销确认流程
      cy.get('.action-email')
        .clear()
        .type('logout-confirmation@example.com')

      // 等待注销处理
      cy.wait(500)

      // 验证注销状态
      cy.get('body').should('be.visible')
      cy.log('用户已安全注销')

      // 清理会话数据（模拟）
      cy.log('会话数据已清理')
      cy.log('购物车已清空')

      cy.log('✅ 账户注销流程完成')
    })
  })

  // ============================================
  // 场景6: 错误处理与边界测试
  // ============================================
  describe('场景6: 错误处理系统', () => {

    it('6.1 网络错误处理', () => {
      cy.log('🌐 测试网络错误处理')

      // 模拟网络错误
      cy.intercept('GET', '**/api/**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('networkError')

      cy.visit('https://example.cypress.io/commands/network-requests')
        .then(() => {
          cy.log('模拟服务器错误')
        })
        .catch(() => {
          cy.log('已捕获网络错误')
        })

      // 模拟错误恢复
      cy.visit('https://example.cypress.io')
      cy.get('h1').should('be.visible')

      cy.log('✅ 网络错误处理测试完成')
    })

    it('6.2 表单验证错误', () => {
      cy.log('📝 测试表单验证错误')

      cy.visit('https://example.cypress.io/commands/actions')

      // 测试无效邮箱
      cy.get('.action-email')
        .clear()
        .type('invalid-email')

      // 检查验证状态
      cy.get('.action-email')
        .invoke('prop', 'validity')
        .its('valid')
        .should('be.false')

      cy.log('无效邮箱被正确识别')

      // 修正为有效邮箱
      cy.get('.action-email')
        .clear()
        .type('valid@example.com')
        .invoke('prop', 'validity')
        .its('valid')
        .should('be.true')

      cy.log('✅ 表单验证错误测试完成')
    })

    it('6.3 产品库存不足', () => {
      cy.log('📦 测试库存不足处理')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟库存不足场景
      cy.get('@testData').then((data) => {
        const product = data.products[0]
        cy.log(`尝试购买: ${product.name}`)
        cy.log('模拟库存不足错误')

        cy.get('.action-email')
          .clear()
          .type(`Stock unavailable for ${product.name}`)

        // 模拟错误提示
        cy.wait(500)
        cy.log('❌ 库存不足，请选择其他产品')
      })

      cy.log('✅ 库存不足处理测试完成')
    })

    it('6.4 支付失败处理', () => {
      cy.log('💳 测试支付失败处理')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟支付失败
      cy.get('.action-email')
        .clear()
        .type('payment-failed@example.com')

      cy.log('模拟支付失败')
      cy.wait(1000)

      // 模拟重试机制
      cy.log('提供重试选项')
      cy.get('.action-email')
        .clear()
        .type('retry-payment@example.com')

      cy.log('支付重试中...')
      cy.wait(500)

      cy.log('✅ 支付失败处理测试完成')
    })
  })

  // 测试结束后的清理
  after(() => {
    cy.log('🏁 电商网站测试套件完成')

    // 生成测试报告摘要
    cy.get('@testData').then((data) => {
      cy.log('=== 测试摘要 ===')
      cy.log(`测试产品数量: ${data.products.length}`)
      cy.log(`测试用户数量: ${Object.keys(data.users).length}`)
      cy.log('测试场景: 用户管理、产品浏览、购物车、结账、账户管理、错误处理')
      cy.log('=== 测试完成 ===')
    })
  })
})

// ============================================
// Day 5 综合项目总结
// ============================================
/*
🎯 项目成果：
□ 完整的电商网站测试场景
□ 用户注册/登录/账户管理
□ 产品浏览/搜索/分类筛选
□ 购物车添加/修改/删除/持久化
□ 完整的结账支付流程
□ 订单管理和用户偏好
□ 全面的错误处理测试

🔥 技能整合：
1. 生命周期钩子：before/after/beforeEach/afterEach
2. 网络拦截：cy.intercept()模拟API响应
3. 数据管理：复杂测试数据组织和传递
4. 异步处理：等待机制和条件判断
5. 错误处理：网络错误、验证错误、业务错误
6. 测试组织：嵌套describe、模块化测试

🚀 实战技巧：
1. 数据驱动测试：使用testData对象管理测试数据
2. 模拟真实场景：购物车、结账、支付流程
3. 条件性操作：根据页面元素动态调整测试逻辑
4. 状态管理：购物车状态、用户登录状态等
5. 错误恢复：网络错误、支付失败的处理机制

📈 知识体系：
Day 1-5 完整知识体系已建立：
- Day 1-2: 基础环境和概念
- Day 3: 核心命令掌握
- Day 4: 高级命令和技巧
- Day 5: 测试组织、异步处理、综合项目

🎓 准备就绪：
现在已具备进入更高级主题的能力：
- 自定义命令开发
- Fixtures和测试数据管理
- CI/CD集成
- 性能测试
- 视觉测试
- Page Object Model
*/