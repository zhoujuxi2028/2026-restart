/**
 * 🌱 Day 2: 第一个测试
 *
 * 学习目标：
 * - 掌握 cy.visit()、cy.get()、cy.contains() 的使用
 * - 学习基本交互操作 .click()、.type()
 * - 理解 .should() 断言的用法
 * - 掌握链式调用的概念
 *
 * 自我检测：
 * ✅ 能够访问页面并验证内容
 * ✅ 能够选择元素并进行交互
 * ✅ 能够使用断言验证结果
 * ✅ 理解 Cypress 的时间旅行调试
 */

describe('🌱 Day 2: 第一个完整测试', () => {

  beforeEach(() => {
    // 每个测试前都访问首页
    cy.visit('https://example.cypress.io')
  })

  describe('🎯 核心命令学习', () => {

    it('✅ 应该掌握 cy.visit() 页面访问', () => {
      // 🎯 学习要点：页面导航基础
      cy.log('学习 cy.visit() 的使用')

      // 验证当前页面
      cy.url().should('include', 'example.cypress.io')
      cy.title().should('include', 'Kitchen Sink')

      // 访问不同页面
      cy.visit('https://example.cypress.io/commands/querying')
      cy.url().should('include', '/commands/querying')

      cy.log('✅ cy.visit() 掌握完成')
    })

    it('✅ 应该掌握 cy.get() 元素选择', () => {
      // 🎯 学习要点：元素选择器
      cy.log('学习 cy.get() 的各种用法')

      // 标签选择器
      cy.get('h1').should('contain.text', 'Kitchen Sink')

      // 类选择器
      cy.get('.navbar-brand').should('be.visible')

      // 属性选择器
      cy.get('[href]').should('exist')
      cy.get('[class*="navbar"]').should('exist')

      // 导航到有更多元素的页面
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Querying').click()

      // 验证页面有查询相关元素
      cy.get('h1').should('exist')

      cy.log('✅ cy.get() 选择器掌握完成')
    })

    it('✅ 应该掌握 cy.contains() 文本查找', () => {
      // 🎯 学习要点：通过文本内容查找元素
      cy.log('学习 cy.contains() 的使用')

      // 查找包含特定文本的元素
      cy.contains('Kitchen Sink').should('be.visible')

      // 文本匹配 - 使用页面上可见的文本
      cy.contains('Commands').should('exist')

      // 导航到 Actions 页面进行更多测试
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // 在 Actions 页面查找按钮
      cy.contains('Action').should('exist')

      cy.log('✅ cy.contains() 掌握完成')
    })

    it('✅ 应该掌握 .click() 点击操作', () => {
      // 🎯 学习要点：基础交互操作
      cy.log('学习 .click() 点击操作')

      // 点击下拉菜单
      cy.get('.dropdown').contains('Commands').click()

      // 点击导航链接
      cy.contains('Actions').click()

      // 验证页面跳转
      cy.url().should('include', '/commands/actions')

      // 点击输入框（演示点击功能）
      cy.get('.action-email').click().should('be.focused')

      cy.log('✅ .click() 操作掌握完成')
    })

    it('✅ 应该掌握 .type() 输入操作', () => {
      // 🎯 学习要点：文本输入操作
      cy.log('学习 .type() 输入操作')

      // 导航到 Actions 页面
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // 基础文本输入
      cy.get('.action-email')
        .type('test@example.com')
        .should('have.value', 'test@example.com')

      // 清除并重新输入
      cy.get('.action-email')
        .clear()
        .type('new@example.com')
        .should('have.value', 'new@example.com')

      cy.log('✅ .type() 操作掌握完成')
    })

    it('✅ 应该掌握 .should() 断言验证', () => {
      // 🎯 学习要点：断言验证技巧
      cy.log('学习 .should() 断言的各种用法')

      // 存在性断言
      cy.get('h1').should('exist')
      cy.get('h1').should('be.visible')

      // 内容断言
      cy.title().should('include', 'Kitchen Sink')
      cy.get('h1').should('contain.text', 'Kitchen Sink')

      // 属性断言 - 验证页面有带 class 属性的元素
      cy.get('.navbar-brand').should('have.class', 'navbar-brand')

      // 链式断言
      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Kitchen Sink')

      cy.log('✅ .should() 断言掌握完成')
    })
  })

  describe('🔗 链式调用练习', () => {

    it('✅ 应该理解链式调用的概念', () => {
      // 🎯 学习要点：Cypress 链式调用的强大之处
      cy.log('学习 Cypress 链式调用')

      // 单一链式操作 - 导航并验证
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Querying').click()
      cy.url().should('include', '/commands/querying')

      // 复杂链式操作
      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Querying')

      cy.log('✅ 链式调用概念掌握完成')
    })

    it('✅ 应该掌握链式操作的最佳实践', () => {
      // 🎯 学习要点：链式操作的正确使用
      cy.log('学习链式操作最佳实践')

      // 导航到 Actions 页面
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // 好的链式操作：逻辑清晰
      cy.get('.action-email')
        .should('exist')
        .should('be.visible')
        .should('be.enabled')

      // 分步验证：复杂逻辑分解
      cy.get('.action-email').clear()
      cy.get('.action-email').type('best@practice.com')
      cy.get('.action-email').should('have.value', 'best@practice.com')

      cy.log('✅ 链式操作最佳实践掌握完成')
    })
  })

  describe('🎪 Time Travel 调试', () => {

    it('✅ 应该理解 Time Travel 调试功能', () => {
      // 🎯 学习要点：Cypress 独特的调试体验
      cy.log('🕐 体验 Time Travel 调试')

      // 记录每一步操作，便于调试
      cy.get('h1').should('be.visible')
      cy.log('第1步：验证页面标题')

      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()
      cy.log('第2步：导航到 Actions 页面')

      cy.url().should('include', '/commands/actions')
      cy.log('第3步：验证页面跳转')

      cy.get('.action-email').type('debug@example.com')
      cy.log('第4步：输入邮箱地址')

      // 添加调试点
      cy.debug()
      cy.log('🔍 调试点：可以在 DevTools 中查看元素状态')

      cy.log('✅ Time Travel 调试体验完成')
    })
  })

  describe('🎯 实战练习', () => {

    it('🏆 综合练习：用户注册流程测试', () => {
      // 🎯 学习要点：综合运用所学技能
      cy.log('开始用户注册流程测试...')

      // 1. 导航到表单页面
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()
      cy.log('✅ 步骤1：导航到表单页面')

      // 2. 填写用户信息
      cy.get('.action-email')
        .clear()
        .type('user@example.com')
      cy.log('✅ 步骤2：填写邮箱')

      // 验证邮箱输入
      cy.get('.action-email').should('have.value', 'user@example.com')
      cy.log('✅ 步骤3：验证邮箱输入')

      // 如果有其他输入框，也进行测试
      cy.get('input[type="text"]').first().then(($input) => {
        if ($input.is(':visible')) {
          cy.wrap($input).clear().type('Test User')
          cy.log('✅ 步骤4：填写其他表单字段')
        }
      })

      cy.log('🎉 用户注册流程测试完成！')
    })

    it('🏆 综合练习：页面导航和内容验证', () => {
      // 🎯 学习要点：页面间导航和内容验证
      cy.log('开始页面导航测试...')

      // 导航测试数据
      const pages = [
        { link: 'Querying', url: '/commands/querying', content: 'Querying' },
        { link: 'Traversal', url: '/commands/traversal', content: 'Traversal' },
        { link: 'Actions', url: '/commands/actions', content: 'Actions' }
      ]

      pages.forEach((page, index) => {
        cy.log(`测试第 ${index + 1} 个页面: ${page.link}`)

        // 回到首页
        if (index > 0) {
          cy.visit('https://example.cypress.io')
        }

        // 点击导航链接（通过下拉菜单）
        cy.get('.dropdown').contains('Commands').click()
        cy.contains(page.link).click()

        // 验证 URL
        cy.url().should('include', page.url)

        // 验证页面内容
        cy.get('h1').should('contain', page.content)

        cy.log(`✅ ${page.link} 页面测试完成`)
      })

      cy.log('🎉 页面导航测试全部完成！')
    })
  })

  describe('📊 自我检测评估', () => {

    it('📋 Day 2 学习成果检测', () => {
      const skills = {
        pageVisit: false,
        elementSelection: false,
        textFinding: false,
        clicking: false,
        typing: false,
        assertions: false,
        chaining: false
      }

      cy.log('🔍 开始 Day 2 学习成果检测...')

      // 检测1：页面访问
      cy.visit('https://example.cypress.io').then(() => {
        skills.pageVisit = true
        cy.log('✅ 页面访问：通过')
      })

      // 检测2：元素选择
      cy.get('h1').should('exist').then(() => {
        skills.elementSelection = true
        cy.log('✅ 元素选择：通过')
      })

      // 检测3：文本查找
      cy.contains('Kitchen Sink').should('be.visible').then(() => {
        skills.textFinding = true
        cy.log('✅ 文本查找：通过')
      })

      // 检测4：点击操作
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click().then(() => {
        skills.clicking = true
        cy.log('✅ 点击操作：通过')
      })

      // 检测5：文本输入
      cy.get('.action-email').type('test@cypress.io').should('have.value', 'test@cypress.io').then(() => {
        skills.typing = true
        cy.log('✅ 文本输入：通过')
      })

      // 检测6：断言验证
      cy.url().should('include', '/commands/actions').then(() => {
        skills.assertions = true
        cy.log('✅ 断言验证：通过')
      })

      // 检测7：链式调用
      cy.get('.action-email').clear().type('chain@test.com').should('have.value', 'chain@test.com').then(() => {
        skills.chaining = true
        cy.log('✅ 链式调用：通过')
      })

      // 生成检测报告
      cy.then(() => {
        const passedSkills = Object.values(skills).filter(Boolean).length
        const totalSkills = Object.keys(skills).length
        const passRate = (passedSkills / totalSkills * 100).toFixed(1)

        cy.log('')
        cy.log('📊 Day 2 学习成果报告：')
        cy.log(`通过技能: ${passedSkills}/${totalSkills}`)
        cy.log(`通过率: ${passRate}%`)

        Object.keys(skills).forEach(skill => {
          const status = skills[skill] ? '✅' : '❌'
          cy.log(`${status} ${skill}`)
        })

        if (passRate >= 85) {
          cy.log('🎉 优秀！Day 2 学习目标超额达成！')
          cy.log('🚀 准备挑战 Day 3 深度内容')
        } else if (passRate >= 70) {
          cy.log('👍 良好！Day 2 基本目标达成')
          cy.log('📚 可以继续学习 Day 3 内容')
        } else {
          cy.log('⚠️ 建议加强练习 Day 2 内容')
          cy.log('🔄 重点复习未通过的技能点')
        }

        expect(passedSkills).to.be.at.least(6) // 至少通过6个技能点
      })
    })

    it('📝 学习建议和下一步', () => {
      cy.then(() => {
        cy.log('💡 Day 2 学习建议：')
        cy.log('1. 🎯 多练习不同类型的选择器')
        cy.log('2. 🔗 理解链式调用的优势和合理使用')
        cy.log('3. 🐛 善用 Time Travel 功能调试')
        cy.log('4. 📝 编写清晰的测试步骤和日志')
        cy.log('')
        cy.log('🚀 下一步学习：')
        cy.log('📖 Day 3: 基本命令深度掌握')
        cy.log('🎯 重点：高级选择器、复杂交互、条件处理')
        cy.log('💪 目标：成为 Cypress 基础操作专家')
      })
    })
  })
})

/**
 * 🌟 Day 2 核心学习要点总结：
 *
 * 1. **核心命令掌握**
 *    - cy.visit()：页面导航
 *    - cy.get()：元素选择
 *    - cy.contains()：文本查找
 *    - .click()：点击交互
 *    - .type()：文本输入
 *    - .should()：断言验证
 *
 * 2. **链式调用理解**
 *    - Cypress 命令的自动排队
 *    - 链式操作的优势
 *    - 合理的链式调用实践
 *
 * 3. **调试技巧**
 *    - Time Travel 功能
 *    - 使用 cy.debug()
 *    - 日志输出和步骤追踪
 *
 * 4. **实战应用**
 *    - 表单交互测试
 *    - 页面导航验证
 *    - 多步骤流程测试
 *
 * 💡 **关键概念**：
 * - 异步命令排队机制
 * - 自动等待和重试
 * - 选择器优先级策略
 *
 * 🎯 **准备进入 Day 3**：
 * 深入学习高级选择器和复杂交互场景
 */