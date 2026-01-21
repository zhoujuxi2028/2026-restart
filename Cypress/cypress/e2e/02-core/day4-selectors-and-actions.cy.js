// ============================================
// Day 4: 核心命令精通练习
// ============================================
// 目标：掌握选择器、过滤、遍历、交互和断言的进阶用法
// 练习网站：https://example.cypress.io

describe('Day 4: 核心命令精通', () => {

  beforeEach(() => {
    cy.visit('https://example.cypress.io')
  })

  // ============================================
  // 练习 1: 选择器和查询进阶
  // ============================================
  describe('练习 1: 选择器和查询', () => {

    it('1.1 cy.get() 各种选择器', () => {
      // data-cy 属性（如果存在）
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy]').length > 0) {
          cy.get('[data-cy]').first().should('exist')
        }
      })

      // ID 选择器
      cy.get('#navbar').should('exist')

      // Class 选择器
      cy.get('.navbar').should('exist')

      // 属性选择器
      cy.get('a[href]').should('have.length.greaterThan', 0)

      // 复合选择器
      cy.get('.navbar a').should('exist')
    })

    it('1.2 cy.contains() 文本查询', () => {
      // 精确文本匹配
      cy.contains('Kitchen Sink').should('be.visible')

      // 部分文本匹配 - 直接访问页面
      cy.visit('https://example.cypress.io/commands/querying')

      // 在特定容器内查找
      cy.get('body').contains('li').should('exist')
    })

    it('1.3 cy.find() 子元素查找', () => {
      // 访问querying页面
      cy.visit('https://example.cypress.io/commands/querying')

      // 在父元素内查找子元素
      cy.get('.navbar-nav').find('li').should('have.length.greaterThan', 0)

      // 链式查找
      cy.get('.navbar-nav').find('li').first().should('exist')
    })

    it('1.4 属性选择器实践', () => {
      // 使用属性选择器
      cy.get('[href]').should('have.length.greaterThan', 0)

      // 验证属性存在
      cy.get('[href]').first().should('have.attr', 'href')
    })
  })

  // ============================================
  // 练习 2: 过滤和遍历
  // ============================================
  describe('练习 2: 过滤和遍历', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/querying')
    })

    it('2.1 索引选择 (.first(), .last(), .eq())', () => {
      // 第一个元素
      cy.get('li').first().should('exist')

      // 最后一个元素
      cy.get('li').last().should('exist')

      // 特定索引（从0开始）
      cy.get('li').eq(1).should('exist')
      cy.get('li').eq(2).should('exist')
    })

    it('2.2 条件过滤 (.filter())', () => {
      // 过滤可见元素
      cy.get('li').filter(':visible').should('have.length.greaterThan', 0)

      // 过滤包含特定文本的元素
      cy.get('li').filter(':contains("li")').should('exist')
    })

    it('2.3 DOM 遍历 (.parent(), .children())', () => {
      // 获取父元素
      cy.get('li').first().parent().should('have.class', 'navbar-nav')

      // 获取子元素
      cy.get('.navbar-nav').children().should('have.length.greaterThan', 0)

      // 链式遍历
      cy.get('.navbar-nav').children().first().should('exist')
    })

    it('2.4 兄弟元素 (.next(), .prev())', () => {
      // 下一个兄弟元素
      cy.get('li').first().next().should('exist')

      // 上一个兄弟元素（如果不是第一个）
      cy.get('li').last().prev().should('exist')
    })
  })

  // ============================================
  // 练习 3: 交互命令进阶
  // ============================================
  describe('练习 3: 交互命令进阶', () => {

    it('3.1 .type() 高级输入', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 基本输入
      cy.get('.action-email').type('test@example.com')

      // 输入特殊字符
      cy.get('.action-email').clear().type('user+tag@domain.co.uk')

      // 输入多行文本到textarea（如果可用）
      cy.get('body').then(($body) => {
        const enabledTextarea = $body.find('textarea:not([disabled])')
        if (enabledTextarea.length > 0) {
          cy.wrap(enabledTextarea).type('Line 1\nLine 2\nLine 3')
        }
      })
    })

    it('3.2 .clear() 清除输入', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 输入后清除
      cy.get('.action-email')
        .type('texttoclear')
        .should('have.value', 'texttoclear')
        .clear()
        .should('have.value', '')
    })

    it('3.3 .select() 下拉选择', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 通过值选择
      cy.get('select').first().select('apples')

      // 通过文本选择
      cy.get('select').first().select('fr-bananas')

      // 验证选择结果
      cy.get('select').first().should('have.value', 'fr-bananas')
    })

    it('3.4 .check() 和 .uncheck() 复选框', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 检查可用的复选框
      cy.get('input[type="checkbox"]:not([disabled])').first().check()

      // 验证选中状态
      cy.get('input[type="checkbox"]:not([disabled])').first().should('be.checked')

      // 取消选中
      cy.get('input[type="checkbox"]:not([disabled])').first().uncheck()

      // 验证未选中状态
      cy.get('input[type="checkbox"]:not([disabled])').first().should('not.be.checked')
    })
  })

  // ============================================
  // 练习 4: 断言系统深入
  // ============================================
  describe('练习 4: 断言系统深入', () => {

    it('4.1 存在性和可见性断言', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 存在断言
      cy.get('.form-control').should('exist')
      cy.get('.non-existent').should('not.exist')

      // 可见性断言
      cy.get('.form-control').should('be.visible')
      // 检查隐藏元素是否存在
      cy.get('body').then(($body) => {
        if ($body.find('.action-hidden').length > 0) {
          cy.get('.action-hidden').should('not.be.visible')
        }
      })
    })

    it('4.2 状态断言', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 启用/禁用状态
      cy.get('.form-control:not([disabled])').should('be.enabled')
      cy.get('.action-disabled').should('be.disabled')

      // 聚焦状态
      cy.get('.form-control').first().focus().should('be.focused')

      // 选中状态
      cy.get('input[type="checkbox"]:not([disabled])').first().check().should('be.checked')
      cy.get('input[type="radio"]:not([disabled])').first().check().should('be.checked')
    })

    it('4.3 内容断言', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 文本内容
      cy.get('h1').should('contain', 'Actions')
      cy.get('h1').should('have.text', 'Actions')

      // 输入值
      cy.get('.form-control').first().type('test').should('have.value', 'test')

      // 属性断言
      cy.get('.form-control').first().should('have.attr', 'type')
      cy.get('.form-control').first().should('have.class', 'form-control')

      // CSS 属性
      cy.get('.form-control').first().should('have.css', 'display')
    })

    it('4.4 数量和长度断言', () => {
      cy.visit('https://example.cypress.io/commands/querying')

      // 元素数量
      cy.get('li').should('have.length.greaterThan', 0)
      cy.get('li').should('have.length.lessThan', 50)

      // 文本长度
      cy.get('h1').invoke('text').should('have.length.greaterThan', 5)
    })

    it('4.5 链式断言', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.form-control').first()
        .should('exist')
        .should('be.visible')
        .should('be.enabled')
        .type('chain@example.com')
        .should('have.value', 'chain@example.com')
    })

    it('4.6 自定义断言', () => {
      cy.visit('https://example.cypress.io/commands/querying')

      // 使用 .then() 进行自定义断言
      cy.get('li').then(($lis) => {
        expect($lis).to.have.length.greaterThan(0)
        expect($lis.first()).to.exist
      })

      // 使用 .should() 的回调函数
      cy.get('h1').should(($h1) => {
        expect($h1.text()).to.equal('Querying')
      })
    })
  })

  // ============================================
  // 练习 5: 综合应用
  // ============================================
  describe('练习 5: 综合应用', () => {

    it('5.1 完整表单交互流程', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // 选择器和查询
      cy.contains('Email').parent().find('input').as('emailInput')

      // 交互操作
      cy.get('@emailInput')
        .clear()
        .type('comprehensive@example.com')
        .should('have.value', 'comprehensive@example.com')

      // 断言验证
      cy.get('@emailInput')
        .should('be.visible')
        .should('be.enabled')
        .should('have.attr', 'type', 'email')
    })

    it('5.2 动态内容处理', () => {
      cy.visit('https://example.cypress.io/commands/querying')

      // 条件性元素检查
      cy.get('body').then(($body) => {
        if ($body.find('select').length > 0) {
          cy.get('select').select(1)
        }
      })

      // 过滤和遍历综合应用
      cy.get('li').filter(':visible').should('have.length.greaterThan', 0)
    })
  })
})

// ============================================
// Day 4 学习总结
// ============================================
/*
✅ 今天掌握的技能：
1. 选择器和查询进阶：cy.get(), cy.contains(), cy.find(), data-cy 属性
2. 过滤和遍历：.first(), .last(), .eq(), .filter(), .parent(), .children(), .next(), .prev()
3. 交互命令进阶：.type(), .clear(), .select(), .check(), .uncheck()
4. 断言系统深入：所有 .should() 类型，链式断言，自定义断言

🔥 关键技巧：
- 使用 data-cy 属性提高测试稳定性
- 掌握索引选择和条件过滤
- 理解 DOM 遍历方法
- 熟练运用各种断言类型

📈 下一步准备：
Day 5 将学习异步操作、网络请求、Fixtures 等高级主题。
继续保持练习节奏，明天见！

---

## Day 8: Hooks 和测试组织

### 🎯 学习目标
掌握 Cypress 的测试生命周期管理，包括：
- 测试钩子（Hooks）：beforeEach, afterEach, before, after
- 测试组织：describe 嵌套，测试分组
- 测试控制：.only(), .skip() 运行特定测试
- 最佳实践：测试独立性和清理

### 🔧 核心概念

#### 测试钩子（Hooks）
```javascript
describe('用户管理', () => {
  before(() => {
    // 所有测试前执行一次
    cy.log('设置全局状态')
  })

  after(() => {
    // 所有测试后执行一次
    cy.log('清理全局状态')
  })

  beforeEach(() => {
    // 每个测试前执行
    cy.visit('/users')
  })

  afterEach(() => {
    // 每个测试后执行
    cy.log('测试后清理')
  })

  it('应该创建用户', () => {
    // 测试代码
  })

  it('应该删除用户', () => {
    // 测试代码
  })
})
```

#### 测试控制
```javascript
describe('用户功能', () => {
  it.only('只运行这个测试', () => {
    // 这个测试会运行
  })

  it.skip('跳过这个测试', () => {
    // 这个测试会被跳过
  })

  it('普通测试', () => {
    // 正常运行
  })
})
```

### 💡 最佳实践
1. **测试独立性**：每个测试应该独立运行，不依赖其他测试
2. **使用 beforeEach**：为每个测试设置干净的状态
3. **避免共享状态**：不要在测试间共享变量
4. **合理使用 .only()**：开发时聚焦特定测试，提交前移除
5. **使用 .skip()**：临时禁用有问题的测试

### 📝 练习示例
```javascript
describe('电商网站测试', () => {
  beforeEach(() => {
    cy.visit('https://example.com')
    // 登录用户
    cy.get('[data-cy="login"]').click()
    cy.get('[data-cy="email"]').type('user@example.com')
    cy.get('[data-cy="password"]').type('password')
    cy.get('[data-cy="submit"]').click()
  })

  it('应该添加商品到购物车', () => {
    cy.get('[data-cy="product-1"]').click()
    cy.get('[data-cy="add-to-cart"]').click()
    cy.get('[data-cy="cart-count"]').should('contain', '1')
  })

  it.skip('应该完成结账流程', () => {
    // 暂时跳过这个测试
    cy.get('[data-cy="checkout"]').click()
    // ... 更多步骤
  })
})
```

### 🎓 学习要点
- **beforeEach**：最常用的钩子，确保每个测试的干净状态
- **测试隔离**：每个测试应该能够独立运行
- **调试技巧**：使用 .only() 快速聚焦问题测试
- **维护性**：良好的测试组织使代码更易维护

完成 Day 8 后，你将掌握完整的 Cypress 测试编写技能！

  // ============================================
  // 自我检测和学习评估
  // ============================================
  describe('📊 Day 4 自我检测评估', () => {

    it('📋 Day 4 学习成果检测', () => {
      const skills = {
        advancedSelectors: false,
        formHandling: false,
        elementTraversal: false,
        complexInteractions: false,
        advancedAssertions: false,
        practicalApplication: false
      }

      cy.log('🔍 开始 Day 4 学习成果检测...')

      // 检测1：高级选择器
      cy.visit('https://example.cypress.io/commands/querying')
      cy.get('[data-cy="data-cy-query"]').should('exist').then(() => {
        skills.advancedSelectors = true
        cy.log('✅ 高级选择器：通过')
      })

      // 检测2：表单处理
      cy.visit('https://example.cypress.io/commands/actions')
      cy.get('.action-email')
        .clear()
        .type('day4@test.com')
        .should('have.value', 'day4@test.com').then(() => {
        skills.formHandling = true
        cy.log('✅ 表单处理：通过')
      })

      // 检测3：元素遍历
      cy.get('.action-form')
        .find('.action-email')
        .should('exist').then(() => {
        skills.elementTraversal = true
        cy.log('✅ 元素遍历：通过')
      })

      // 检测4：复杂交互
      cy.get('.action-btn').should('be.visible')
      cy.get('.action-canvas').should('exist').then(() => {
        skills.complexInteractions = true
        cy.log('✅ 复杂交互：通过')
      })

      // 检测5：高级断言
      cy.get('.action-email')
        .should('be.visible')
        .and('not.be.disabled')
        .and('have.attr', 'type', 'email').then(() => {
        skills.advancedAssertions = true
        cy.log('✅ 高级断言：通过')
      })

      // 检测6：实际应用
      cy.get('.action-email')
        .clear()
        .type('practical@test.com')
        .should('have.value', 'practical@test.com')
      cy.get('.action-full-name')
        .clear()
        .type('Day 4 Test User').then(() => {
        skills.practicalApplication = true
        cy.log('✅ 实际应用：通过')
      })

      // 生成检测报告
      cy.then(() => {
        const passedSkills = Object.values(skills).filter(Boolean).length
        const totalSkills = Object.keys(skills).length
        const passRate = (passedSkills / totalSkills * 100).toFixed(1)

        cy.log('')
        cy.log('📊 Day 4 学习成果报告：')
        cy.log(`通过技能: ${passedSkills}/${totalSkills}`)
        cy.log(`通过率: ${passRate}%`)

        const skillNames = {
          advancedSelectors: '高级选择器',
          formHandling: '表单处理',
          elementTraversal: '元素遍历',
          complexInteractions: '复杂交互',
          advancedAssertions: '高级断言',
          practicalApplication: '实际应用'
        }

        Object.keys(skills).forEach(skill => {
          const status = skills[skill] ? '✅' : '❌'
          cy.log(`${status} ${skillNames[skill]}`)
        })

        if (passRate >= 90) {
          cy.log('🏆 卓越！Day 4 学习目标完美达成！')
          cy.log('🚀 你已经掌握了核心功能的高级用法！')
          cy.log('📚 可以自信地继续 Day 5 学习')
        } else if (passRate >= 80) {
          cy.log('🎉 优秀！Day 4 学习目标达成！')
          cy.log('📚 准备进入 Day 5 异步处理学习')
        } else if (passRate >= 70) {
          cy.log('👍 良好！Day 4 基本目标达成')
          cy.log('💪 建议加强练习后进入 Day 5')
        } else {
          cy.log('⚠️ 建议重点复习 Day 4 内容')
          cy.log('🔄 特别关注未通过的技能点')
        }

        expect(passedSkills).to.be.at.least(5) // 至少通过5个技能点
      })
    })

    it('📝 Day 4 学习建议和下一步', () => {
      cy.then(() => {
        cy.log('💡 Day 4 学习建议：')
        cy.log('1. 🎯 熟练掌握各种选择器策略')
        cy.log('2. 📝 深入理解表单元素的处理方法')
        cy.log('3. 🔍 掌握元素遍历和过滤技巧')
        cy.log('4. 🎪 练习复杂的用户交互场景')
        cy.log('5. ✅ 运用多样化的断言验证')
        cy.log('')
        cy.log('🚀 下一步学习：')
        cy.log('📖 Day 5: 异步操作和测试组织')
        cy.log('🎯 重点：过滤遍历、异步处理、Hooks使用')
        cy.log('💪 目标：掌握第二阶段核心技能')
      })
    })
  })
})

/**
 * 🌟 Day 4 核心学习要点总结：
 *
 * 1. **高级选择器掌握**
 *    - 优先级策略：[data-cy] > #id > .class > tag
 *    - 属性选择器的灵活运用
 *    - 复合选择器的使用技巧
 *
 * 2. **表单处理精通**
 *    - 各种输入类型的处理
 *    - 下拉菜单和复选框操作
 *    - 表单验证和错误处理
 *
 * 3. **元素遍历技巧**
 *    - .find() 查找子元素
 *    - .parent() 和 .children() 导航
 *    - .first()、.last()、.eq() 索引选择
 *
 * 4. **交互操作进阶**
 *    - 复杂的点击操作
 *    - 键盘事件处理
 *    - 鼠标交互技巧
 *
 * 5. **断言系统深入**
 *    - 链式断言的高效使用
 *    - 属性和状态验证
 *    - 自定义断言逻辑
 *
 * 💡 **核心概念**：
 * - 选择器的性能影响
 * - 元素状态的动态验证
 * - 交互操作的时机控制
 * - 断言链的逻辑组织
 *
 * 🎯 **第二阶段进展**：
 * 已掌握核心功能的基础应用，
 * 准备学习异步处理和测试组织
 */