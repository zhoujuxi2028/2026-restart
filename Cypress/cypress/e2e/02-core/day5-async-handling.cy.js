// ============================================
// Day 5: 异步操作与等待机制
// ============================================
// 学习目标：掌握异步操作处理、等待机制、网络拦截基础
// 网站：https://example.cypress.io + 实际API测试

describe('Day 5: 异步操作与等待机制', () => {

  // ============================================
  // 模块1: 等待机制深度学习
  // ============================================
  describe('模块1: 等待机制 (Wait Mechanisms)', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io')
    })

    it('1.1 隐式等待 vs 显式等待', () => {
      cy.log('⏳ 理解Cypress的默认等待机制')

      // Cypress的隐式等待（默认4秒）
      cy.get('h1').should('be.visible') // 自动等待直到元素出现

      // 导航到Actions页面观察等待
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // Cypress会自动等待页面加载和元素出现
      cy.url().should('include', '/commands/actions')
      cy.get('.action-email').should('be.visible')

      cy.log('✅ 隐式等待机制验证完成')
    })

    it('1.2 显式等待 - cy.wait()', () => {
      cy.log('🕐 学习显式等待的使用场景')

      cy.visit('https://example.cypress.io/commands/actions')

      // 场景1: 固定时间等待
      cy.log('等待1秒模拟加载时间')
      cy.wait(1000)

      // 场景2: 模拟等待动画完成
      cy.get('.action-email')
        .clear()
        .type('slow-typing@example.com')

      cy.log('等待输入动画完成')
      cy.wait(500)

      cy.get('.action-email').should('have.value', 'slow-typing@example.com')

      // 注意：在实际项目中应该避免固定时间等待
      cy.log('⚠️ 注意：尽量使用条件等待而不是固定时间等待')
    })

    it('1.3 条件等待 - should() 与重试机制', () => {
      cy.log('🔄 掌握条件等待和重试机制')

      cy.visit('https://example.cypress.io/commands/actions')

      // 等待元素变为可见状态
      cy.get('.action-email')
        .should('be.visible')
        .should('be.enabled')
        .should('not.be.disabled')

      // 等待特定属性值
      cy.get('.action-email')
        .invoke('attr', 'type')
        .should('equal', 'email')

      // 等待文本内容
      cy.get('h1')
        .should('contain.text', 'Actions')
        .should('be.visible')

      cy.log('✅ 条件等待机制验证完成')
    })

    it('1.4 自定义等待条件', () => {
      cy.log('🎯 创建自定义等待条件')

      cy.visit('https://example.cypress.io/commands/querying')

      // 等待页面完全加载（多个条件组合）
      cy.get('h1').should('be.visible')
      cy.get('body').should('be.visible')
      cy.url().should('include', '/querying')

      // 等待特定元素数量
      cy.get('li').should('have.length.greaterThan', 5)

      // 自定义复杂等待条件
      cy.get('body').within(() => {
        cy.get('h1').should('exist')
        cy.get('p').should('have.length.greaterThan', 0)
      })

      cy.log('✅ 自定义等待条件验证完成')
    })
  })

  // ============================================
  // 模块2: 网络拦截基础
  // ============================================
  describe('模块2: 网络拦截入门 (cy.intercept)', () => {

    beforeEach(() => {
      // 设置网络拦截 - 使用更通用的拦截模式
      cy.intercept('GET', '**/commands/querying').as('queryingPage')
    })

    it('2.1 基本网络拦截', () => {
      cy.log('🌐 学习基本网络拦截')

      // 访问页面触发拦截
      cy.visit('https://example.cypress.io')

      // 点击导航链接（通过下拉菜单）
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Querying').click()

      // 等待网络请求完成
      cy.wait('@queryingPage').then((interception) => {
        cy.log('网络请求已拦截')
        cy.log(`请求URL: ${interception.request.url}`)
        if (interception.response) {
          cy.log(`响应状态: ${interception.response.statusCode}`)
        }
      })

      cy.url().should('include', '/commands/querying')
    })

    it('2.2 动态响应拦截', () => {
      cy.log('📡 动态修改网络响应')

      // 拦截并修改响应
      cy.intercept('GET', '**/commands/actions', (req) => {
        req.reply((res) => {
          // 模拟慢网络
          res.delay = 1000
          res.send(res.body)
        })
      }).as('actionsPage')

      cy.visit('https://example.cypress.io')
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // 等待被延迟的请求
      cy.wait('@actionsPage')
      cy.url().should('include', '/commands/actions')

      cy.log('✅ 动态响应拦截验证完成')
    })

    it('2.3 API请求拦截', () => {
      cy.log('🔗 拦截API请求')

      // 模拟API请求拦截
      cy.intercept('GET', '**/api/**', {
        statusCode: 200,
        body: {
          success: true,
          data: { message: 'Mock API Response' }
        }
      }).as('apiRequest')

      // 由于example.cypress.io没有真实API，我们用页面请求模拟
      cy.intercept('GET', '**/commands/misc', {
        statusCode: 200,
        body: '<html><body><h1>Mock Response</h1></body></html>'
      }).as('mockApi')

      cy.visit('https://example.cypress.io')

      // 尝试触发请求（如果存在）
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="misc"]').length > 0) {
          cy.contains('Misc').click()
          cy.wait('@mockApi')
        } else {
          cy.log('没有找到misc链接，跳过API拦截测试')
        }
      })
    })
  })

  // ============================================
  // 模块3: 动态内容处理
  // ============================================
  describe('模块3: 动态内容与加载状态', () => {

    it('3.1 等待动态内容加载', () => {
      cy.log('📱 处理动态加载的内容')

      cy.visit('https://example.cypress.io/commands/querying')

      // 等待页面基本元素加载
      cy.get('h1').should('contain', 'Querying')

      // 等待列表项加载完成
      cy.get('li').should('have.length.greaterThan', 3)

      // 等待特定内容出现
      cy.contains('cy.get()').should('be.visible')
      cy.contains('cy.contains()').should('be.visible')

      cy.log('✅ 动态内容加载完成')
    })

    it('3.2 处理异步渲染元素', () => {
      cy.log('⚡ 处理异步渲染的元素')

      cy.visit('https://example.cypress.io/commands/traversal')

      // 等待页面标题
      cy.get('h1').should('be.visible')

      // 等待页面内容加载（使用更通用的选择器）
      cy.get('body').within(() => {
        // 使用更灵活的等待策略 - 等待任意内容元素
        cy.get('p, div, code').first().should('exist')
      })

      // 等待交互元素准备就绪
      cy.get('body').should('be.visible')
      cy.url().should('include', '/traversal')

      cy.log('✅ 异步元素渲染完成')
    })

    it('3.3 轮询检查模式', () => {
      cy.log('🔄 实现轮询检查模式')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟轮询检查某个状态
      const checkElementState = () => {
        cy.get('.action-email').then(($el) => {
          const currentValue = $el.val()
          cy.log(`当前值: ${currentValue || '空'}`)

          if (!currentValue) {
            cy.log('元素尚未初始化，继续检查...')
            // 在实际应用中，这里可能会是真正的轮询
            cy.wait(100)
          }
        })
      }

      checkElementState()

      // 验证元素最终状态
      cy.get('.action-email')
        .should('be.visible')
        .should('have.attr', 'placeholder')

      cy.log('✅ 轮询检查完成')
    })

    it('3.4 复杂异步场景处理', () => {
      cy.log('🎭 处理复杂异步场景')

      cy.visit('https://example.cypress.io')

      // 场景: 多步异步导航
      cy.get('h1').should('contain', 'Kitchen Sink')

      // 第一步：等待导航链接可用（通过下拉菜单）
      cy.get('.dropdown').contains('Commands').should('be.visible').click()

      // 第二步：点击子菜单项
      cy.contains('Actions').click()

      // 验证导航成功
      cy.url().should('include', '/commands/actions')
      cy.get('body').should('be.visible')

      // 第三步：确认在正确的页面
      cy.get('.action-email').should('be.visible')

      // 第四步：执行复杂操作
      cy.get('.action-email')
        .clear()
        .type('complex@example.com')
        .should('have.value', 'complex@example.com')

      // 验证整个流程
      cy.url().should('include', '/actions')
      cy.get('h1').should('contain', 'Actions')

      cy.log('✅ 复杂异步场景处理完成')
    })
  })

  // ============================================
  // 模块4: 实际应用场景
  // ============================================
  describe('模块4: 异步操作实战场景', () => {

    it('4.1 表单提交等待', () => {
      cy.log('📝 模拟表单提交异步处理')

      cy.visit('https://example.cypress.io/commands/actions')

      // 填写表单
      cy.get('.action-email')
        .clear()
        .type('submit-test@example.com')

      // 模拟表单验证等待
      cy.get('.action-email')
        .should('have.value', 'submit-test@example.com')
        .should('be.visible')

      // 在真实应用中，这里会等待提交响应
      cy.log('模拟等待服务器响应...')
      cy.wait(500)

      // 验证提交结果（模拟）
      cy.get('.action-email').should('be.visible')
      cy.log('✅ 表单提交流程完成')
    })

    it('4.2 文件上传等待', () => {
      cy.log('📁 模拟文件上传异步处理')

      cy.visit('https://example.cypress.io/commands/actions')

      // 查找文件上传元素（如果存在）
      cy.get('body').then(($body) => {
        if ($body.find('input[type="file"]').length > 0) {
          cy.log('找到文件上传控件')

          // 模拟文件选择
          cy.get('input[type="file"]').selectFile({
            contents: 'cypress/fixtures/example.json',
            fileName: 'test-file.json'
          }, { force: true })

          // 等待上传处理
          cy.wait(1000)
        } else {
          cy.log('未找到文件上传控件，使用模拟场景')

          // 模拟文件上传流程
          cy.get('.action-email')
            .clear()
            .type('file-upload@example.com')

          cy.log('模拟文件上传中...')
          cy.wait(800)
          cy.log('✅ 文件上传完成（模拟）')
        }
      })
    })

    it('4.3 搜索自动完成等待', () => {
      cy.log('🔍 模拟搜索自动完成')

      cy.visit('https://example.cypress.io/commands/actions')

      // 模拟搜索输入
      cy.get('.action-email')
        .clear()
        .type('search-query')

      // 模拟等待搜索结果
      cy.log('等待搜索结果...')
      cy.wait(300)

      // 继续输入触发更多建议
      cy.get('.action-email')
        .type('@example')

      cy.log('等待更新的搜索建议...')
      cy.wait(200)

      // 完成搜索
      cy.get('.action-email')
        .type('.com')
        .should('have.value', 'search-query@example.com')

      cy.log('✅ 搜索自动完成流程完成')
    })

    it('4.4 分页加载等待', () => {
      cy.log('📄 模拟分页异步加载')

      cy.visit('https://example.cypress.io/commands/querying')

      // 等待初始内容加载
      cy.get('h1').should('be.visible')
      cy.get('li').should('have.length.greaterThan', 0)

      const initialItemCount = 0
      cy.get('li').then(($items) => {
        const currentCount = $items.length
        cy.log(`初始项目数量: ${currentCount}`)

        // 模拟滚动到底部触发更多加载
        cy.scrollTo('bottom')
        cy.wait(500)

        // 检查是否有新内容
        cy.get('li').should('have.length.greaterThan', 0)
        cy.log('✅ 分页加载检查完成')
      })
    })

    it('4.5 实时数据更新等待', () => {
      cy.log('🔄 模拟实时数据更新')

      cy.visit('https://example.cypress.io/commands/actions')

      // 记录初始状态
      let initialTime = Date.now()
      cy.wrap(initialTime).as('startTime')

      // 模拟数据更新检查
      const checkForUpdates = () => {
        cy.get('@startTime').then((startTime) => {
          const currentTime = Date.now()
          const elapsed = currentTime - startTime

          cy.log(`检查更新，已过时间: ${elapsed}ms`)

          if (elapsed < 2000) {
            // 继续等待更新
            cy.wait(200)
            checkForUpdates()
          } else {
            cy.log('✅ 模拟数据更新完成')
          }
        })
      }

      // 开始检查更新
      checkForUpdates()

      // 验证最终状态
      cy.get('body').should('be.visible')
    })

    it('4.6 网络错误恢复', () => {
      cy.log('🛠️ 处理网络错误和重试')

      // 模拟网络错误
      cy.intercept('GET', '**/commands/network-requests', {
        statusCode: 500,
        body: { error: 'Server Error' }
      }).as('networkError')

      cy.visit('https://example.cypress.io')

      // 尝试访问可能失败的页面
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="network-requests"]').length > 0) {
          cy.contains('Network Requests').click()
          cy.wait('@networkError')
        }
      })

      // 模拟错误恢复
      cy.intercept('GET', '**/commands/network-requests', {
        statusCode: 200,
        body: '<html><body><h1>Network Recovered</h1></body></html>'
      }).as('networkRecovered')

      // 重试操作
      cy.log('网络已恢复，重试请求')
      cy.wait(1000)

      cy.log('✅ 网络错误恢复处理完成')
    })
  })

  // ============================================
  // 模块5: 性能和超时管理
  // ============================================
  describe('模块5: 超时和性能管理', () => {

    it('5.1 自定义超时设置', () => {
      cy.log('⏱️ 学习自定义超时设置')

      cy.visit('https://example.cypress.io/commands/actions')

      // 为特定操作设置较长超时
      cy.get('.action-email', { timeout: 10000 })
        .should('be.visible')
        .clear({ timeout: 5000 })
        .type('timeout-test@example.com', { delay: 100 })

      // 验证超时设置有效
      cy.get('.action-email', { timeout: 8000 })
        .should('have.value', 'timeout-test@example.com')

      cy.log('✅ 自定义超时测试完成')
    })

    it('5.2 性能监控', () => {
      cy.log('📊 监控操作性能')

      const startTime = performance.now()

      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email')
        .clear()
        .type('performance-test@example.com')
        .then(() => {
          const endTime = performance.now()
          const duration = endTime - startTime
          cy.log(`操作耗时: ${duration.toFixed(2)}ms`)

          // 验证性能在合理范围内
          expect(duration).to.be.lessThan(10000) // 小于10秒
        })

      cy.log('✅ 性能监控测试完成')
    })

    it('5.3 批量操作优化', () => {
      cy.log('⚡ 优化批量操作性能')

      cy.visit('https://example.cypress.io/commands/actions')

      // 批量操作模拟
      const testEmails = [
        'batch1@example.com',
        'batch2@example.com',
        'batch3@example.com'
      ]

      testEmails.forEach((email, index) => {
        cy.log(`批量测试 ${index + 1}/${testEmails.length}: ${email}`)

        cy.get('.action-email')
          .clear()
          .type(email)
          .should('have.value', email)

        // 短暂等待避免过快操作
        cy.wait(200)
      })

      cy.log('✅ 批量操作优化完成')
    })
  })
})

// ============================================
// Day 5 模块2总结
// ============================================
/*
🎯 学习成果：
□ 理解隐式等待vs显式等待的区别
□ 掌握cy.wait()的正确使用场景
□ 学会使用条件等待和重试机制
□ 掌握cy.intercept()网络拦截基础
□ 能够处理动态加载内容
□ 学会处理复杂异步场景
□ 掌握性能监控和超时管理

🔥 关键技巧：
1. 优先使用条件等待而不是固定时间等待
2. 网络拦截可以控制测试环境
3. 超时设置要合理，不能过短或过长
4. 使用别名管理网络请求
5. 轮询检查适用于状态变化场景

⚠️ 注意事项：
1. 避免过度使用cy.wait()固定时间
2. 网络拦截要在beforeEach中设置
3. 超时时间要根据实际情况调整
4. 异步操作要有适当的错误处理

📈 下一步：
Day 5 模块3 将学习综合实战项目应用
*/