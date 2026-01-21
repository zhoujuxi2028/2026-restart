/**
 * 🌱 Day 3: 基本命令深度掌握
 *
 * 学习目标：
 * - 精通各种选择器策略和最佳实践
 * - 掌握高级点击操作和表单交互
 * - 学习条件性元素处理
 * - 理解动态内容等待机制
 *
 * 自我检测：
 * ✅ 掌握选择器优先级策略
 * ✅ 能够处理复杂的交互场景
 * ✅ 理解链式断言的正确使用
 * ✅ 掌握条件性元素处理技巧
 */

describe('🌱 Day 3: 基本命令深度掌握', () => {

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

  // ============================================
  // 自我检测和学习评估
  // ============================================
  describe('📊 自我检测评估', () => {

    it('📋 Day 3 学习成果检测', () => {
      const skills = {
        advancedVisit: false,
        selectorMastery: false,
        complexInteractions: false,
        chainedAssertions: false,
        conditionalHandling: false,
        debuggingSkills: false,
        bestPractices: false
      }

      cy.log('🔍 开始 Day 3 学习成果检测...')

      // 检测1：高级页面访问
      cy.visit('https://example.cypress.io/commands/actions')
        .then(() => {
          skills.advancedVisit = true
          cy.log('✅ 高级页面访问：通过')
        })

      // 检测2：选择器精通度
      cy.get('.action-email').should('exist')
        .then(() => {
          skills.selectorMastery = true
          cy.log('✅ 选择器精通度：通过')
        })

      // 检测3：复杂交互
      cy.get('.action-email')
        .clear()
        .type('advanced@test.com')
        .should('have.value', 'advanced@test.com')
        .then(() => {
          skills.complexInteractions = true
          cy.log('✅ 复杂交互：通过')
        })

      // 检测4：链式断言
      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Actions')
        .then(() => {
          skills.chainedAssertions = true
          cy.log('✅ 链式断言：通过')
        })

      // 检测5：条件处理
      cy.get('body').then(($body) => {
        if ($body.find('.action-email').length > 0) {
          skills.conditionalHandling = true
          cy.log('✅ 条件处理：通过')
        }
      })

      // 检测6：调试技巧
      cy.log('调试信息：正在验证调试技巧')
        .then(() => {
          skills.debuggingSkills = true
          cy.log('✅ 调试技巧：通过')
        })

      // 检测7：最佳实践
      cy.get('.action-email')
        .should('be.visible')
        .clear()
        .type('bestpractice@test.com')
        .should('have.value', 'bestpractice@test.com')
        .then(() => {
          skills.bestPractices = true
          cy.log('✅ 最佳实践：通过')
        })

      // 生成检测报告
      cy.then(() => {
        const passedSkills = Object.values(skills).filter(Boolean).length
        const totalSkills = Object.keys(skills).length
        const passRate = (passedSkills / totalSkills * 100).toFixed(1)

        cy.log('')
        cy.log('📊 Day 3 学习成果报告：')
        cy.log(`通过技能: ${passedSkills}/${totalSkills}`)
        cy.log(`通过率: ${passRate}%`)

        Object.keys(skills).forEach(skill => {
          const status = skills[skill] ? '✅' : '❌'
          const skillNames = {
            advancedVisit: '高级页面访问',
            selectorMastery: '选择器精通',
            complexInteractions: '复杂交互',
            chainedAssertions: '链式断言',
            conditionalHandling: '条件处理',
            debuggingSkills: '调试技巧',
            bestPractices: '最佳实践'
          }
          cy.log(`${status} ${skillNames[skill]}`)
        })

        if (passRate >= 90) {
          cy.log('🏆 卓越！Day 3 学习目标完美达成！')
          cy.log('🚀 你已经是 Cypress 基础专家了！')
          cy.log('📚 强烈建议进入 Day 4 核心功能学习')
        } else if (passRate >= 80) {
          cy.log('🎉 优秀！Day 3 学习目标超额达成！')
          cy.log('📚 可以自信地进入第二阶段学习')
        } else if (passRate >= 70) {
          cy.log('👍 良好！Day 3 基本目标达成')
          cy.log('💪 建议加强练习，然后进入 Day 4')
        } else {
          cy.log('⚠️ 建议重点复习 Day 3 内容')
          cy.log('🔄 特别关注未通过的技能点')
        }

        expect(passedSkills).to.be.at.least(6) // 至少通过6个技能点
      })
    })

    it('📈 第一阶段总体评估', () => {
      const phase1Skills = {
        day1Environment: true,  // Day 1 环境搭建
        day1BasicSyntax: true,  // Day 1 基础语法
        day2CoreCommands: true, // Day 2 核心命令
        day2ChainCalls: true,   // Day 2 链式调用
        day3SelectorMastery: false, // Day 3 选择器精通
        day3AdvancedInteractions: false, // Day 3 高级交互
        day3BestPractices: false // Day 3 最佳实践
      }

      cy.log('🔍 第一阶段 (Day 1-3) 总体技能评估...')

      // 模拟检测 Day 3 核心技能
      cy.visit('https://example.cypress.io/commands/actions')
        .then(() => {
          phase1Skills.day3SelectorMastery = true
          cy.log('✅ Day 3 选择器精通：验证通过')
        })

      cy.get('.action-email')
        .type('phase1@assessment.com')
        .should('have.value', 'phase1@assessment.com')
        .then(() => {
          phase1Skills.day3AdvancedInteractions = true
          cy.log('✅ Day 3 高级交互：验证通过')
        })

      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Actions')
        .then(() => {
          phase1Skills.day3BestPractices = true
          cy.log('✅ Day 3 最佳实践：验证通过')
        })

      // 生成第一阶段总评
      cy.then(() => {
        const passedPhase1 = Object.values(phase1Skills).filter(Boolean).length
        const totalPhase1 = Object.keys(phase1Skills).length
        const phase1Rate = (passedPhase1 / totalPhase1 * 100).toFixed(1)

        cy.log('')
        cy.log('🏆 第一阶段 (Day 1-3) 总评报告：')
        cy.log(`掌握技能: ${passedPhase1}/${totalPhase1}`)
        cy.log(`掌握率: ${phase1Rate}%`)

        const skillGroups = {
          'Day 1 - 环境基础': {
            day1Environment: '环境搭建',
            day1BasicSyntax: '基础语法'
          },
          'Day 2 - 核心命令': {
            day2CoreCommands: '核心命令',
            day2ChainCalls: '链式调用'
          },
          'Day 3 - 深度掌握': {
            day3SelectorMastery: '选择器精通',
            day3AdvancedInteractions: '高级交互',
            day3BestPractices: '最佳实践'
          }
        }

        Object.keys(skillGroups).forEach(group => {
          cy.log(`📋 ${group}:`)
          Object.keys(skillGroups[group]).forEach(skill => {
            const status = phase1Skills[skill] ? '✅' : '❌'
            cy.log(`  ${status} ${skillGroups[group][skill]}`)
          })
        })

        if (phase1Rate >= 85) {
          cy.log('')
          cy.log('🎉 恭喜！第一阶段学习圆满完成！')
          cy.log('🏅 你已经完全掌握了 Cypress 基础知识')
          cy.log('🚀 准备进入第二阶段 - 核心功能学习')
          cy.log('')
          cy.log('🎯 下一步学习计划：')
          cy.log('📖 Day 4: 选择器和交互进阶')
          cy.log('📖 Day 5: 遍历和过滤技巧')
          cy.log('📖 Day 6: 常用交互命令')
          cy.log('📖 Day 7: 断言系统深入')
          cy.log('📖 Day 8: Hooks 和测试组织')
        } else if (phase1Rate >= 75) {
          cy.log('')
          cy.log('👍 第一阶段学习基本完成！')
          cy.log('💪 建议加强练习后进入第二阶段')
        } else {
          cy.log('')
          cy.log('⚠️ 建议继续巩固第一阶段基础知识')
          cy.log('🔄 重点复习未掌握的技能点')
        }

        expect(passedPhase1).to.be.at.least(6) // 第一阶段至少掌握6项技能
      })
    })

    it('📝 学习建议和资源推荐', () => {
      cy.then(() => {
        cy.log('💡 Day 3 学习建议总结：')
        cy.log('')
        cy.log('🎯 核心技能强化：')
        cy.log('1. 📍 选择器策略 - 优先使用 [data-cy] > #id > .class')
        cy.log('2. 🔗 链式调用 - 合理组织，避免过度复杂')
        cy.log('3. 🛡️ 条件处理 - 使用 .then() 进行条件判断')
        cy.log('4. 🐛 调试技巧 - 善用 cy.log() 和 Time Travel')
        cy.log('')
        cy.log('📚 推荐练习：')
        cy.log('1. 🌐 在不同网站练习相同技能')
        cy.log('2. 🔄 重复运行测试，观察 Cypress 行为')
        cy.log('3. 🛠️ 尝试修改测试代码，理解每个部分作用')
        cy.log('4. 📝 记录遇到的问题和解决方案')
        cy.log('')
        cy.log('🔗 有用资源：')
        cy.log('📖 Cypress 官方文档: https://docs.cypress.io')
        cy.log('🎥 Cypress 官方示例: https://example.cypress.io')
        cy.log('💬 社区支持: https://github.com/cypress-io/cypress')
        cy.log('')
        cy.log('🎉 恭喜完成第一阶段！准备迎接更多挑战！')
      })
    })
  })
})

/**
 * 🌟 Day 3 核心学习要点总结：
 *
 * 1. **选择器策略精通**
 *    - 选择器优先级：[data-cy] > #id > .class > tag
 *    - 合理使用不同类型选择器
 *    - 避免脆弱的选择器策略
 *
 * 2. **高级交互技巧**
 *    - 复杂的点击操作
 *    - 表单处理最佳实践
 *    - 条件性元素处理
 *
 * 3. **链式断言掌握**
 *    - .should() 和 .and() 的组合使用
 *    - 多重验证策略
 *    - 断言失败的调试技巧
 *
 * 4. **调试和最佳实践**
 *    - cy.log() 的有效使用
 *    - Time Travel 调试技巧
 *    - 条件性操作处理
 *    - 自定义超时配置
 *
 * 💡 **关键概念巩固**：
 * - Cypress 的自动等待和重试机制
 * - 命令链的正确组织方式
 * - 错误处理和条件判断
 * - 测试的可读性和可维护性
 *
 * 🎯 **第一阶段完成标志**：
 * 能够独立编写包含页面导航、元素交互、
 * 条件判断和结果验证的完整测试用例
 *
 * 🚀 **准备进入第二阶段**：
 * 核心功能深入学习，包括高级选择器、
 * 表单处理、遍历技巧和测试组织
 */