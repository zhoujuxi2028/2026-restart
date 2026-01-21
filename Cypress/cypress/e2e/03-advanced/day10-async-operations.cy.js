/**
 * ⏳ Day 10: 异步操作处理
 *
 * 学习目标：
 * - 掌握各种等待策略 (cy.wait())
 * - 学习处理动态内容加载
 * - 掌握 Progress bars 和 Loading states
 * - 学会处理复杂动画等待
 * - 理解性能测试基础
 */

describe('⏳ Day 10: 异步操作处理', () => {

  beforeEach(() => {
    // 访问示例页面
    cy.visit('https://example.cypress.io/commands/waiting')
  })

  describe('🔄 基础等待策略', () => {

    it('应该能够等待固定时间', () => {
      // 🎯 学习要点：cy.wait() 固定时间等待
      cy.get('[data-cy="wait-button"]', { timeout: 10000 }).should('exist')

      // 等待 2 秒
      cy.wait(2000)

      cy.then(() => {
        cy.log('✅ 已等待 2 秒')
      })
    })

    it('应该能够等待网络请求完成', () => {
      // 🎯 学习要点：等待网络请求
      cy.intercept('GET', '**/api/slow-endpoint').as('slowRequest')

      // 模拟一个缓慢的网络请求
      cy.window().then((win) => {
        win.fetch('/api/slow-endpoint')
      })

      // 等待网络请求完成
      cy.wait('@slowRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
      })
    })

    it('应该能够等待元素出现', () => {
      // 🎯 学习要点：等待 DOM 元素
      cy.get('[data-cy="trigger-async"]').click()

      // 等待异步元素出现
      cy.get('[data-cy="async-content"]', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .and('contain.text', '异步内容已加载')
    })

    it('应该能够等待元素消失', () => {
      // 🎯 学习要点：等待元素消失
      cy.get('[data-cy="loading-indicator"]').should('exist')

      // 等待加载指示器消失
      cy.get('[data-cy="loading-indicator"]').should('not.exist')

      // 验证内容已加载
      cy.get('[data-cy="main-content"]').should('be.visible')
    })
  })

  describe('📈 动态内容处理', () => {

    it('应该能够处理动态加载的列表', () => {
      // 🎯 学习要点：动态列表内容等待
      cy.intercept('GET', '**/api/items').as('getItems')

      cy.get('[data-cy="load-items"]').click()

      // 等待 API 请求完成
      cy.wait('@getItems')

      // 等待列表项加载完成
      cy.get('[data-cy="item-list"]')
        .children()
        .should('have.length.greaterThan', 0)

      // 验证第一个项目已正确加载
      cy.get('[data-cy="item-list"] li')
        .first()
        .should('contain.text', '项目')
    })

    it('应该能够处理无限滚动', () => {
      // 🎯 学习要点：无限滚动处理
      cy.intercept('GET', '**/api/items*').as('getMoreItems')

      // 模拟滚动到底部
      cy.get('[data-cy="scroll-container"]').scrollTo('bottom')

      // 等待新内容加载
      cy.wait('@getMoreItems')

      // 验证新内容已添加
      cy.get('[data-cy="scroll-container"]')
        .children()
        .should('have.length.greaterThan', 10)
    })

    it('应该能够处理懒加载图片', () => {
      // 🎯 学习要点：懒加载图片等待
      cy.get('[data-cy="lazy-image"]')
        .should('have.attr', 'data-src')
        .and('not.have.attr', 'src')

      // 滚动到图片位置
      cy.get('[data-cy="lazy-image"]').scrollIntoView()

      // 等待图片加载完成
      cy.get('[data-cy="lazy-image"]')
        .should('have.attr', 'src')
        .and('be.visible')

      // 验证图片已正确加载
      cy.get('[data-cy="lazy-image"]')
        .should(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
    })
  })

  describe('🎪 Progress Bars 和 Loading States', () => {

    it('应该能够监控进度条变化', () => {
      // 🎯 学习要点：进度条监控
      cy.get('[data-cy="start-progress"]').click()

      // 等待进度条出现
      cy.get('[data-cy="progress-bar"]').should('exist')

      // 监控进度变化
      cy.get('[data-cy="progress-bar"]')
        .should('have.attr', 'data-progress', '0')

      // 等待进度增长
      cy.get('[data-cy="progress-bar"]', { timeout: 15000 })
        .should(($progress) => {
          const progress = parseInt($progress.attr('data-progress') || '0')
          expect(progress).to.be.greaterThan(0)
        })

      // 等待进度完成
      cy.get('[data-cy="progress-bar"]', { timeout: 30000 })
        .should('have.attr', 'data-progress', '100')

      // 验证完成状态
      cy.get('[data-cy="progress-complete"]').should('be.visible')
    })

    it('应该能够处理多步骤加载', () => {
      // 🎯 学习要点：多步骤加载流程
      const steps = [
        { selector: '[data-cy="step-1"]', text: '步骤 1 完成' },
        { selector: '[data-cy="step-2"]', text: '步骤 2 完成' },
        { selector: '[data-cy="step-3"]', text: '步骤 3 完成' }
      ]

      cy.get('[data-cy="start-multi-step"]').click()

      steps.forEach((step, index) => {
        cy.get(step.selector, { timeout: 10000 })
          .should('be.visible')
          .and('contain.text', step.text)

        cy.log(`✅ ${step.text}`)
      })

      // 验证所有步骤都完成
      cy.get('[data-cy="all-steps-complete"]').should('be.visible')
    })

    it('应该能够处理 Skeleton Loading', () => {
      // 🎯 学习要点：骨架屏加载
      cy.get('[data-cy="load-with-skeleton"]').click()

      // 验证骨架屏出现
      cy.get('[data-cy="skeleton-loader"]').should('be.visible')

      // 等待真实内容加载
      cy.get('[data-cy="actual-content"]', { timeout: 10000 })
        .should('be.visible')

      // 验证骨架屏消失
      cy.get('[data-cy="skeleton-loader"]').should('not.exist')
    })
  })

  describe('🎨 复杂动画处理', () => {

    it('应该能够等待 CSS 动画完成', () => {
      // 🎯 学习要点：CSS 动画等待
      cy.get('[data-cy="start-animation"]').click()

      // 等待动画开始
      cy.get('[data-cy="animated-element"]')
        .should('have.class', 'animating')

      // 等待动画完成
      cy.get('[data-cy="animated-element"]', { timeout: 5000 })
        .should('not.have.class', 'animating')
        .and('have.class', 'animation-complete')
    })

    it('应该能够处理 JavaScript 动画', () => {
      // 🎯 学习要点：JavaScript 动画等待
      cy.get('[data-cy="js-animation-trigger"]').click()

      // 使用自定义等待条件
      cy.get('[data-cy="js-animated-element"]')
        .should(($el) => {
          const computedStyle = window.getComputedStyle($el[0])
          const transform = computedStyle.getPropertyValue('transform')
          expect(transform).to.not.equal('none')
        })

      // 等待动画完成
      cy.get('[data-cy="js-animated-element"]')
        .should('have.attr', 'data-animation-state', 'completed')
    })

    it('应该能够处理过渡效果', () => {
      // 🎯 学习要点：CSS 过渡处理
      cy.get('[data-cy="toggle-transition"]').click()

      // 等待过渡开始
      cy.get('[data-cy="transition-element"]')
        .should('have.class', 'transitioning')

      // 等待过渡完成
      cy.get('[data-cy="transition-element"]', { timeout: 3000 })
        .should('not.have.class', 'transitioning')
        .and('have.class', 'transition-complete')
    })
  })

  describe('⚡ 性能测试基础', () => {

    it('应该能够测量页面加载时间', () => {
      // 🎯 学习要点：页面加载性能测试
      const startTime = Date.now()

      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        const endTime = Date.now()
        const loadTime = endTime - startTime

        cy.log(`页面加载时间: ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(5000) // 5 秒内
      })
    })

    it('应该能够监控资源加载', () => {
      // 🎯 学习要点：资源加载监控
      const resourceTimes = []

      cy.intercept('**/*', (req) => {
        const startTime = Date.now()

        req.continue((res) => {
          const endTime = Date.now()
          resourceTimes.push({
            url: req.url,
            method: req.method,
            status: res.statusCode,
            duration: endTime - startTime
          })
        })
      }).as('allResources')

      cy.visit('https://example.cypress.io')

      cy.then(() => {
        cy.log(`总资源数: ${resourceTimes.length}`)

        const slowResources = resourceTimes.filter(r => r.duration > 1000)
        if (slowResources.length > 0) {
          cy.log('⚠️ 慢速资源:')
          slowResources.forEach(r => {
            cy.log(`${r.method} ${r.url} - ${r.duration}ms`)
          })
        }
      })
    })

    it('应该能够测试 API 响应时间', () => {
      // 🎯 学习要点：API 性能测试
      cy.intercept('GET', '**/api/**').as('apiCalls')

      cy.visit('https://example.cypress.io/commands/network-requests')
      cy.get('.network-btn').click()

      cy.wait('@apiCalls').then((interception) => {
        const { requestWaited, responseWaited } = interception

        cy.log(`请求等待时间: ${requestWaited}ms`)
        cy.log(`响应等待时间: ${responseWaited}ms`)

        expect(responseWaited).to.be.lessThan(3000) // 3 秒内
      })
    })
  })

  describe('🛠️ 自定义等待工具', () => {

    it('应该能够创建自定义等待函数', () => {
      // 🎯 学习要点：自定义等待逻辑
      const waitForCondition = (conditionFn, options = {}) => {
        const { timeout = 10000, interval = 100 } = options

        return cy.then(() => {
          return new Cypress.Promise((resolve, reject) => {
            const startTime = Date.now()

            const checkCondition = () => {
              try {
                const result = conditionFn()
                if (result) {
                  resolve(result)
                  return
                }
              } catch (error) {
                // 条件检查失败，继续等待
              }

              const elapsed = Date.now() - startTime
              if (elapsed >= timeout) {
                reject(new Error(`等待条件超时: ${timeout}ms`))
                return
              }

              setTimeout(checkCondition, interval)
            }

            checkCondition()
          })
        })
      }

      // 使用自定义等待函数
      cy.get('[data-cy="custom-trigger"]').click()

      waitForCondition(() => {
        const element = Cypress.$('[data-cy="custom-result"]')
        return element.length > 0 && element.text().includes('完成')
      }, { timeout: 15000, interval: 200 })
        .then(() => {
          cy.log('✅ 自定义条件满足')
        })
    })

    it('应该能够实现智能重试机制', () => {
      // 🎯 学习要点：智能重试
      const retryOperation = (operationFn, options = {}) => {
        const { maxRetries = 3, delay = 1000 } = options
        let attempt = 0

        const executeOperation = () => {
          attempt++

          return cy.then(() => {
            try {
              return operationFn()
            } catch (error) {
              if (attempt >= maxRetries) {
                throw new Error(`操作失败，已重试 ${maxRetries} 次: ${error.message}`)
              }

              cy.log(`操作失败，第 ${attempt} 次重试...`)
              cy.wait(delay)
              return executeOperation()
            }
          })
        }

        return executeOperation()
      }

      // 使用重试机制
      retryOperation(() => {
        cy.get('[data-cy="flaky-element"]')
          .should('be.visible')
          .click()

        cy.get('[data-cy="success-indicator"]')
          .should('exist')

        return '操作成功'
      }, { maxRetries: 3, delay: 500 })
        .then((result) => {
          cy.log(`✅ ${result}`)
        })
    })
  })

  describe('🎯 实战练习', () => {

    it('🏆 练习：处理复杂的单页应用加载', () => {
      // 模拟现代 SPA 的复杂加载流程
      const loadingStages = [
        { name: '初始化应用', selector: '[data-cy="app-initializing"]' },
        { name: '加载用户数据', selector: '[data-cy="loading-user"]' },
        { name: '获取权限信息', selector: '[data-cy="loading-permissions"]' },
        { name: '渲染界面', selector: '[data-cy="rendering-ui"]' },
        { name: '加载完成', selector: '[data-cy="app-ready"]' }
      ]

      cy.visit('/spa-demo') // 假设的 SPA 应用

      loadingStages.forEach((stage, index) => {
        cy.log(`等待阶段 ${index + 1}: ${stage.name}`)

        cy.get(stage.selector, { timeout: 15000 })
          .should('exist')
          .then(() => {
            cy.log(`✅ ${stage.name} 完成`)
          })
      })

      // 验证应用完全可用
      cy.get('[data-cy="main-navigation"]').should('be.visible')
      cy.get('[data-cy="user-dashboard"]').should('be.visible')
      cy.get('[data-cy="app-ready"]').should('have.attr', 'data-loaded', 'true')
    })

    it('🏆 练习：实时数据流处理', () => {
      // 模拟实时数据更新（如聊天、股票价格等）
      let messageCount = 0

      cy.intercept('GET', '**/api/realtime-data', (req) => {
        messageCount++
        req.reply({
          statusCode: 200,
          body: {
            id: messageCount,
            timestamp: Date.now(),
            data: `实时消息 ${messageCount}`,
            type: 'update'
          }
        })
      }).as('realtimeData')

      cy.visit('/realtime-demo')

      // 等待初始连接
      cy.get('[data-cy="connection-status"]')
        .should('contain.text', '已连接')

      // 监控实时数据更新
      for (let i = 0; i < 5; i++) {
        cy.wait('@realtimeData')

        cy.get('[data-cy="message-list"]')
          .children()
          .should('have.length', i + 1)

        cy.get('[data-cy="message-list"]')
          .children()
          .last()
          .should('contain.text', `实时消息 ${i + 1}`)

        cy.log(`✅ 收到第 ${i + 1} 条实时消息`)
      }

      // 验证数据完整性
      cy.get('[data-cy="total-messages"]')
        .should('contain.text', '5')
    })
  })

  describe('💡 总结和最佳实践', () => {

    it('📚 异步操作处理最佳实践总结', () => {
      cy.then(() => {
        cy.log('⏳ 异步操作核心技能 ✅')
        cy.log('1. ✅ 基础等待策略 (时间、网络、元素)')
        cy.log('2. ✅ 动态内容处理 (列表、滚动、懒加载)')
        cy.log('3. ✅ Progress Bars 和 Loading States')
        cy.log('4. ✅ 复杂动画和过渡处理')
        cy.log('5. ✅ 性能测试基础')
        cy.log('6. ✅ 自定义等待工具')
        cy.log('7. ✅ 智能重试机制')
        cy.log('8. ✅ 实时数据流处理')

        cy.log('')
        cy.log('🎯 等待策略优先级:')
        cy.log('1. 🥇 元素状态等待 (.should())')
        cy.log('2. 🥈 网络请求等待 (cy.wait(@alias))')
        cy.log('3. 🥉 自定义条件等待')
        cy.log('4. ❌ 固定时间等待 (最后选择)')

        cy.log('')
        cy.log('📈 下一步学习：文件操作 (Day 11)')
        cy.log('🎯 重点：文件读写、上传下载、多媒体处理')
      })
    })
  })
})

/**
 * 🌟 Day 10 学习要点总结：
 *
 * 1. **等待策略基础**
 *    - cy.wait() 的各种用法
 *    - 网络请求等待
 *    - DOM 元素等待
 *
 * 2. **动态内容处理**
 *    - 异步列表加载
 *    - 无限滚动处理
 *    - 懒加载资源等待
 *
 * 3. **加载状态管理**
 *    - 进度条监控
 *    - 多步骤流程
 *    - 骨架屏处理
 *
 * 4. **动画和过渡**
 *    - CSS 动画等待
 *    - JavaScript 动画
 *    - 过渡效果处理
 *
 * 5. **性能测试**
 *    - 页面加载时间
 *    - 资源加载监控
 *    - API 响应时间
 *
 * 6. **高级技巧**
 *    - 自定义等待函数
 *    - 智能重试机制
 *    - 实时数据处理
 *
 * 💡 **实用技巧**：
 * - 优先使用 .should() 而非 cy.wait(时间)
 * - 合理设置 timeout 参数
 * - 利用网络拦截优化等待
 * - 实现自定义等待条件
 *
 * 🚀 **下一步**：掌握文件操作和上传下载测试
 */