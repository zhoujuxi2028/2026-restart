/**
 * 🌱 Day 1: 环境搭建和第一个测试
 *
 * 学习目标：
 * - 验证 Cypress 环境搭建是否正确
 * - 理解基本的测试结构
 * - 掌握 cy.visit() 和基础断言
 *
 * 自我检测：
 * ✅ 能够运行 Cypress 测试
 * ✅ 理解 describe 和 it 的作用
 * ✅ 掌握基本的页面访问和验证
 */

describe('🌱 Day 1: Cypress 环境搭建验证', () => {

  describe('📋 环境检测', () => {

    it('✅ 应该能够成功启动 Cypress', () => {
      // 🎯 学习要点：验证 Cypress 基础功能
      cy.log('🎉 Cypress 环境搭建成功！')

      // 验证 Cypress 对象存在
      expect(Cypress).to.exist
      expect(Cypress.version).to.be.a('string')

      cy.log(`Cypress 版本: ${Cypress.version}`)
    })

    it('✅ 应该能够访问外部网站', () => {
      // 🎯 学习要点：网络连接和页面访问
      cy.visit('https://example.cypress.io')

      // 验证页面标题
      cy.title().should('include', 'Kitchen Sink')

      // 验证页面内容
      cy.contains('Kitchen Sink').should('be.visible')

      cy.log('✅ 网络连接正常，可以访问测试页面')
    })

    it('✅ 应该能够与页面元素交互', () => {
      // 🎯 学习要点：基础元素交互
      cy.visit('https://example.cypress.io')

      // 点击直接可见的导航链接（使用 Actions 替代 Commands）
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click({ force: true })

      // 验证 URL 变化
      cy.url().should('include', '/commands/actions')

      // 验证页面内容变化 - 检查页面标题
      cy.get('h1').should('contain', 'Actions')

      cy.log('✅ 基础交互功能正常')
    })
  })

  describe('🎓 基础概念验证', () => {

    it('✅ 理解测试套件 (describe) 的作用', () => {
      // 🎯 学习要点：测试组织结构
      cy.then(() => {
        cy.log('📚 测试套件用于组织相关的测试用例')
        cy.log('📚 可以嵌套使用，创建层次结构')
        cy.log('📚 提供共同的上下文和配置')
      })

      // 验证这是在正确的测试套件中
      expect(Cypress.currentTest.title).to.include('理解测试套件')
    })

    it('✅ 理解测试用例 (it) 的作用', () => {
      // 🎯 学习要点：具体测试实现
      cy.then(() => {
        cy.log('📝 测试用例是具体的测试实现')
        cy.log('📝 每个测试用例应该测试一个特定功能')
        cy.log('📝 测试用例之间应该相互独立')
      })

      // 验证测试用例信息
      expect(Cypress.currentTest.title).to.be.a('string')
      expect(Cypress.currentTest.title.length).to.be.greaterThan(0)
    })

    it('✅ 掌握基本断言语法', () => {
      // 🎯 学习要点：断言的重要性
      const testData = {
        name: 'Cypress',
        version: '1.0.0',
        features: ['testing', 'automation', 'debugging']
      }

      // 基础断言
      expect(testData.name).to.equal('Cypress')
      expect(testData.version).to.be.a('string')
      expect(testData.features).to.have.length(3)
      expect(testData.features).to.include('testing')

      cy.log('✅ 断言语法掌握正确')
    })
  })

  describe('🎯 实战练习', () => {

    it('🏆 综合练习：完整的页面测试流程', () => {
      // 🎯 学习要点：完整测试流程
      cy.log('开始综合练习...')

      // 1. 访问页面
      cy.visit('https://example.cypress.io')
      cy.log('✅ 第1步：页面访问完成')

      // 2. 验证页面加载
      cy.get('h1').should('be.visible')
      cy.title().should('not.be.empty')
      cy.log('✅ 第2步：页面加载验证完成')

      // 3. 查找并点击元素（通过下拉菜单导航）
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Querying').click()
      cy.log('✅ 第3步：元素交互完成')

      // 4. 验证结果
      cy.url().should('include', '/commands/querying')
      cy.contains('cy.get()').should('be.visible')
      cy.log('✅ 第4步：结果验证完成')

      cy.log('🎉 综合练习全部完成！')
    })
  })

  describe('📊 自我检测评估', () => {

    it('📋 Day 1 学习成果检测', () => {
      const skills = {
        environment: false,
        basicSyntax: false,
        pageNavigation: false,
        elementInteraction: false,
        basicAssertions: false
      }

      cy.then(() => {
        cy.log('🔍 开始 Day 1 学习成果检测...')
      })

      // 检测1：环境搭建
      cy.then(() => {
        if (Cypress && Cypress.version) {
          skills.environment = true
          cy.log('✅ 环境搭建：通过')
        } else {
          cy.log('❌ 环境搭建：需要检查')
        }
      })

      // 检测2：基础语法
      cy.visit('https://example.cypress.io').then(() => {
        skills.basicSyntax = true
        cy.log('✅ 基础语法：通过')
      })

      // 检测3：页面导航
      cy.url().should('include', 'example.cypress.io').then(() => {
        skills.pageNavigation = true
        cy.log('✅ 页面导航：通过')
      })

      // 检测4：元素交互
      cy.get('h1').should('be.visible').then(() => {
        skills.elementInteraction = true
        cy.log('✅ 元素交互：通过')
      })

      // 检测5：基础断言
      cy.title().should('include', 'Kitchen Sink').then(() => {
        skills.basicAssertions = true
        cy.log('✅ 基础断言：通过')
      })

      // 生成检测报告
      cy.then(() => {
        const passedSkills = Object.values(skills).filter(Boolean).length
        const totalSkills = Object.keys(skills).length
        const passRate = (passedSkills / totalSkills * 100).toFixed(1)

        cy.log('')
        cy.log('📊 Day 1 学习成果报告：')
        cy.log(`通过技能: ${passedSkills}/${totalSkills}`)
        cy.log(`通过率: ${passRate}%`)

        if (passRate >= 80) {
          cy.log('🎉 恭喜！Day 1 学习目标达成！')
          cy.log('📚 可以继续学习 Day 2 内容')
        } else {
          cy.log('⚠️ 建议复习 Day 1 内容')
          cy.log('📖 重点关注未通过的技能点')
        }

        // 断言检测结果
        expect(passedSkills).to.be.at.least(4) // 至少通过4个技能点
      })
    })

    it('📝 学习建议和下一步', () => {
      cy.then(() => {
        cy.log('💡 Day 1 学习建议：')
        cy.log('1. 🎯 理解 Cypress 的基本工作原理')
        cy.log('2. 🔧 熟练掌握 cy.visit() 的使用')
        cy.log('3. 📝 练习编写清晰的测试描述')
        cy.log('4. 🎪 多练习基础的元素查找和交互')
        cy.log('')
        cy.log('🚀 下一步学习：')
        cy.log('📖 Day 2: 第一个完整测试')
        cy.log('🎯 重点：cy.get()、cy.contains()、.should()')
        cy.log('💪 目标：能够独立编写基础测试用例')
      })
    })
  })
})

/**
 * 🌟 Day 1 核心学习要点总结：
 *
 * 1. **环境验证**
 *    - Cypress 安装和配置正确
 *    - 网络连接正常
 *    - 基础功能可用
 *
 * 2. **基础概念**
 *    - describe：组织测试套件
 *    - it：具体测试用例
 *    - 测试的层次结构
 *
 * 3. **核心命令**
 *    - cy.visit()：访问页面
 *    - 基础断言语法
 *    - 简单的元素交互
 *
 * 4. **最佳实践**
 *    - 清晰的测试描述
 *    - 合理的测试组织
 *    - 有效的断言验证
 *
 * 💡 **学习提示**：
 * - 多运行几次测试，观察 Cypress 的行为
 * - 尝试修改测试代码，看看会发生什么
 * - 理解每一行代码的作用
 *
 * 🎯 **准备进入 Day 2**：
 * 掌握更多的元素选择和交互方法
 */