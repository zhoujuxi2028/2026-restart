// ============================================
// 第三天：学习导向的基本命令练习
// ============================================
// 专注于核心命令掌握，避免复杂的网站交互问题

describe('Day 3: 学习导向的基本命令练习', () => {

  // ============================================
  // 基础练习：cy.visit() 的各种用法
  // ============================================
  describe('✅ cy.visit() 完全掌握', () => {

    it('访问主页并验证', () => {
      cy.visit('https://example.cypress.io')
      cy.url().should('include', 'example.cypress.io')
      cy.title().should('include', 'Kitchen Sink')
    })

    it('直接访问子页面', () => {
      cy.visit('https://example.cypress.io/commands/actions')
      cy.url().should('include', '/commands/actions')
      cy.get('h1').should('contain', 'Actions')
    })

    it('访问不同的页面', () => {
      // 使用确认可用的页面路径
      const pages = [
        '/commands/querying',
        '/commands/actions',
        '/commands/traversal'  // 替换utilities为更稳定的traversal
      ]

      pages.forEach(page => {
        cy.visit(`https://example.cypress.io${page}`)
        cy.url().should('include', page)
        cy.get('h1').should('be.visible')
      })
    })
  })

  // ============================================
  // 基础练习：cy.get() 选择器精通
  // ============================================
  describe('✅ cy.get() 选择器精通', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/actions')
    })

    it('标签选择器', () => {
      cy.get('h1').should('exist')
      cy.get('input').should('have.length.greaterThan', 0)
      cy.get('button').should('exist')
    })

    it('Class 选择器', () => {
      cy.get('.action-email').should('be.visible')
      cy.get('.form-group').should('exist')
    })

    it('属性选择器', () => {
      cy.get('[placeholder]').should('exist')
      cy.get('[type="email"]').should('be.visible')
      cy.get('input[class*="action"]').should('exist')
    })

    it('复合选择器', () => {
      cy.get('input.action-email').should('be.visible')
      cy.get('div input[type="email"]').should('exist')
    })

    it('索引和过滤', () => {
      cy.get('input').first().should('exist')
      cy.get('input').last().should('exist')
      cy.get('input').eq(0).should('exist')
    })
  })

  // ============================================
  // 基础练习：.click() 交互精通
  // ============================================
  describe('✅ .click() 交互精通', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/actions')
    })

    it('点击输入框获得焦点', () => {
      cy.get('.action-email')
        .click()
        .should('be.focused')
    })

    it('点击按钮（如果存在）', () => {
      cy.get('body').then(($body) => {
        const buttons = $body.find('button:visible')
        if (buttons.length > 0) {
          cy.wrap(buttons).first().click()
        } else {
          cy.log('没有找到可见的按钮，测试通过')
        }
      })
    })

    it('强制点击示例', () => {
      cy.get('.action-email').click({ force: true })
      cy.get('.action-email').should('be.focused')
    })

    it('双击操作', () => {
      // 使用稳定存在的元素进行双击演示
      cy.get('.action-email').dblclick()
      // 验证双击后元素仍然存在且可交互
      cy.get('.action-email').should('be.visible')
    })
  })

  // ============================================
  // 基础练习：.should() 断言大全
  // ============================================
  describe('✅ .should() 断言大全', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/actions')
    })

    it('存在性断言', () => {
      cy.get('.action-email').should('exist')
      cy.get('.non-existent-class').should('not.exist')
    })

    it('可见性断言', () => {
      cy.get('.action-email').should('be.visible')
      cy.get('h1').should('not.be.hidden')
    })

    it('属性断言', () => {
      // 分开断言避免链式断言中的类型问题
      cy.get('.action-email').should('have.attr', 'type', 'email')
      cy.get('.action-email').should('have.attr', 'placeholder')
      cy.get('.action-email').should('have.class', 'action-email')
    })

    it('状态断言', () => {
      cy.get('.action-email')
        .should('be.enabled')
        .click()
        .should('be.focused')
    })

    it('文本和值断言', () => {
      cy.get('h1').should('contain', 'Actions')
      cy.get('h1').should('not.be.empty')

      cy.get('.action-email')
        .type('test@example.com')
        .should('have.value', 'test@example.com')
    })

    it('链式断言（推荐方式）', () => {
      cy.get('.action-email')
        .should('exist')
        .should('be.visible')
        .should('be.enabled')
        .should('have.attr', 'type', 'email')
    })

    it('数量断言', () => {
      cy.get('input').should('have.length.greaterThan', 1)
      cy.get('h1').should('have.length', 1)
    })
  })

  // ============================================
  // 综合练习：四个命令协作
  // ============================================
  describe('🔥 综合练习：四命令协作', () => {

    it('完整的表单交互流程', () => {
      // 1. 访问页面
      cy.visit('https://example.cypress.io/commands/actions')
      cy.url().should('include', '/commands/actions')

      // 2. 查找元素
      cy.get('.action-email')
        .should('be.visible')
        .should('be.enabled')

      // 3. 交互操作
      cy.get('.action-email')
        .click()
        .clear()
        .type('learning@cypress.io')

      // 4. 验证结果
      cy.get('.action-email')
        .should('have.value', 'learning@cypress.io')
        .should('be.focused')
    })

    it('多步骤操作练习', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 邮箱输入
      cy.get('.action-email')
        .clear()
        .type('step1@test.com')
        .should('have.value', 'step1@test.com')

      // 如果有更多输入框，继续操作
      cy.get('body').then(($body) => {
        const textInputs = $body.find('input[type="text"]:not(.action-email)')
        if (textInputs.length > 0) {
          cy.wrap(textInputs).first()
            .clear()
            .type('Step 2 value')
            .should('have.value', 'Step 2 value')
        }
      })
    })

    it('错误处理和边界情况', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 测试空值处理
      cy.get('.action-email')
        .clear()
        .should('have.value', '')
        .type('test@domain.com')
        .should('have.value', 'test@domain.com')
        .clear()
        .type('final@test.com')
        .should('have.value', 'final@test.com')
    })
  })

  // ============================================
  // 学习总结：第一阶段知识检验
  // ============================================
  describe('🎓 第一阶段知识检验', () => {

    it('验证所有核心概念', () => {
      // Day 1 概念：Cypress 浏览器内执行
      cy.visit('https://example.cypress.io')
      cy.title().should('not.be.empty') // 验证页面加载

      // Day 2 概念：项目结构和基础测试
      cy.url().should('include', 'example.cypress.io')

      // Day 3 概念：四个核心命令
      cy.visit('https://example.cypress.io/commands/actions') // cy.visit()
      cy.get('.action-email')                                 // cy.get()
        .click()                                             // .click()
        .type('mastery@cypress.io')                          // 更多交互
        .should('have.value', 'mastery@cypress.io')          // .should()

      // 验证学习成果
      cy.get('.action-email').should('be.focused')
    })

    it('展示最佳实践', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 最佳实践 1: 清晰的链式调用
      cy.get('.action-email')
        .should('be.visible')      // 先验证
        .clear()                   // 清空
        .type('best@practice.com') // 操作
        .should('have.value', 'best@practice.com') // 验证结果

      // 最佳实践 2: 使用稳定的选择器
      cy.get('[type="email"]').should('exist')

      // 最佳实践 3: 合理的断言
      cy.get('.action-email').should('be.enabled')
    })
  })

  // ============================================
  // 调试和学习技巧演示
  // ============================================
  describe('💡 调试和学习技巧', () => {

    it('使用 .then() 进行条件判断', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('body').then(($body) => {
        // 根据页面实际情况执行不同操作
        if ($body.find('.action-email').length > 0) {
          cy.get('.action-email').type('conditional@test.com')
        }

        // 检查是否有可用的textarea（非disabled）
        if ($body.find('textarea:not([disabled])').length > 0) {
          cy.get('textarea:not([disabled])').type('This is a textarea')
        } else {
          cy.log('没有找到可用的textarea，跳过操作')
        }
      })
    })

    it('超时和重试演示', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 自定义超时
      cy.get('.action-email', { timeout: 10000 })
        .should('be.visible')

      // 验证自动重试机制
      cy.get('.action-email')
        .type('retry@test.com')
        .should('have.value', 'retry@test.com')
    })

    it('使用 .log() 记录调试信息', () => {
      cy.log('开始调试测试')

      cy.visit('https://example.cypress.io/commands/actions')
      cy.log('页面加载完成')

      cy.get('.action-email').then(($input) => {
        cy.log(`找到输入框，placeholder: ${$input.attr('placeholder')}`)
      })

      // 分开链式调用，避免.then()影响后续命令
      cy.get('.action-email').type('debug@test.com')

      cy.log('测试完成')
    })
  })
})

// ============================================
// 学习指南和下一步建议
// ============================================
/*
🎯 完成这个练习后，你应该能够：

✅ 核心技能检查清单：
□ 熟练使用 cy.visit() 访问不同页面
□ 掌握 cy.get() 的各种选择器用法
□ 能够使用 .click() 进行基本交互
□ 精通 .should() 的各种断言类型
□ 能够组合使用四个命令完成复杂任务
□ 理解 Cypress 的自动等待机制
□ 能够处理基本的条件判断和错误情况

🚀 学习成果：
1. 第一阶段基础知识 - 完全掌握
2. 核心命令使用 - 流畅运用
3. 基本调试技巧 - 初步掌握
4. 测试编写思路 - 基本形成

🔥 准备进入第二阶段：
- Day 4: 选择器和查询进阶
- Day 5: 过滤和遍历技巧
- Day 6: 交互命令进阶
- Day 7: 断言系统深入
- Day 8: Hooks 和测试组织

💡 练习建议：
1. 逐个运行每个测试用例
2. 观察 Time Travel 调试功能
3. 尝试修改选择器和断言
4. 在其他网站上练习相同技能
5. 记录学习心得和疑问

🎉 恭喜！你已经掌握了 Cypress 的核心基础！
*/