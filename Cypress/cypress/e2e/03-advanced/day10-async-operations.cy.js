/**
 * ⏳ Day 10: Async Operations Handling
 *
 * Learning Objectives:
 * - Master various waiting strategies (cy.wait())
 * - Learn to handle dynamic content loading
 * - Master progress bars and loading states
 * - Learn to handle complex animation waits
 * - Understand performance testing basics
 */

describe('⏳ Day 10: Async Operations Handling', () => {

  describe('🔄 Basic Waiting Strategies', () => {

    it('should be able to wait for a fixed time', () => {
      // 🎯 Learning Point: cy.wait() fixed time waiting
      cy.visit('https://example.cypress.io')

      const startTime = Date.now()

      // 等待 1 秒
      cy.wait(1000)

      cy.then(() => {
        const elapsed = Date.now() - startTime
        expect(elapsed).to.be.at.least(1000)
        cy.log(`✅ Waited for ${elapsed}ms`)
      })
    })

    it('should be able to wait for network requests to complete', () => {
      // 🎯 Learning Point: Waiting for network requests
      cy.intercept('GET', '**/commands/network-requests').as('pageLoad')

      cy.visit('https://example.cypress.io/commands/network-requests')

      // Wait for network request to complete
      cy.wait('@pageLoad').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        cy.log('✅ Network request completed')
      })
    })

    it('should be able to wait for element to appear', () => {
      // 🎯 Learning Point: Waiting for DOM elements
      cy.visit('https://example.cypress.io/commands/actions')

      // Wait for form element to appear
      cy.get('.action-email', { timeout: 10000 })
        .should('exist')
        .and('be.visible')

      cy.log('✅ Element appeared')
    })

    it('should be able to wait for element attribute changes', () => {
      // 🎯 Learning Point: Waiting for element attribute changes
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email')
        .should('have.attr', 'type', 'email')
        .and('have.attr', 'placeholder')

      cy.log('✅ Element attribute verification completed')
    })
  })

  describe('📈 Dynamic Content Handling', () => {

    it('should be able to handle dynamically loaded network requests', () => {
      // 🎯 Learning Point: Dynamic network request waiting
      cy.visit('https://example.cypress.io/commands/network-requests')

      // Intercept API request
      cy.intercept('GET', '**/comments/*').as('getComment')

      // Trigger network request
      cy.get('.network-btn').click()

      // Wait for API request to complete
      cy.wait('@getComment').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body).to.have.property('name')
        cy.log('✅ Dynamic content loaded')
      })
    })

    it('should be able to handle multiple network requests', () => {
      // 🎯 Learning Point: Waiting for multiple requests
      cy.visit('https://example.cypress.io/commands/network-requests')

      cy.intercept('GET', '**/comments/*').as('getComment')
      cy.intercept('PUT', '**/comments/*').as('putComment')

      // Trigger GET request
      cy.get('.network-btn').click()
      cy.wait('@getComment')

      // Trigger PUT request
      cy.get('.network-put').click()
      cy.wait('@putComment').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        cy.log('✅ Multiple requests handled')
      })
    })

    it('should be able to handle page scrolling', () => {
      // 🎯 Learning Point: Scroll operation waiting
      cy.visit('https://example.cypress.io')

      // Scroll to bottom of page
      cy.scrollTo('bottom', { duration: 1000 })
      cy.wait(500)

      // Verify scroll completed
      cy.window().then((win) => {
        const scrollY = win.scrollY
        expect(scrollY).to.be.greaterThan(0)
        cy.log(`✅ Scrolled ${scrollY}px`)
      })
    })
  })

  describe('🎪 Form Interaction Waiting', () => {

    it('should be able to wait for input completion', () => {
      // 🎯 Learning Point: Input operation waiting
      cy.visit('https://example.cypress.io/commands/actions')

      const testEmail = 'test@example.com'

      cy.get('.action-email')
        .clear()
        .type(testEmail, { delay: 50 })
        .should('have.value', testEmail)

      cy.log('✅ Input operation completed')
    })

    it('should be able to wait for select operation', () => {
      // 🎯 Learning Point: Select operation waiting
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-select')
        .select('apples')
        .should('have.value', 'fr-apples')

      cy.log('✅ Select operation completed')
    })

    it('should be able to wait for multiple select operation', () => {
      // 🎯 Learning Point: Multiple select operation waiting
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-select-multiple')
        .select(['apples', 'oranges', 'bananas'])
        .then(($select) => {
          const selectedValues = Array.from($select.val())
          expect(selectedValues).to.have.length(3)
          cy.log('✅ Multiple select completed')
        })
    })
  })

  describe('🎨 Animation and Transition Handling', () => {

    it('should be able to handle scroll into view', () => {
      // 🎯 Learning Point: scrollIntoView waiting
      cy.visit('https://example.cypress.io')

      // Scroll to link at bottom of page
      cy.contains('cypress.io')
        .scrollIntoView()
        .should('be.visible')

      cy.log('✅ Scroll into view completed')
    })

    it('should be able to handle element focus', () => {
      // 🎯 Learning Point: focus operation waiting
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-focus')
        .focus()
        .should('have.class', 'focus')
        .prev()
        .should('have.attr', 'style', 'color: orange;')

      cy.log('✅ Focus operation completed')
    })

    it('should be able to handle element blur', () => {
      // 🎯 Learning Point: blur operation waiting
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-blur')
        .type('About to blur')
        .blur()
        .should('have.class', 'error')
        .prev()
        .should('have.attr', 'style', 'color: red;')

      cy.log('✅ Blur operation completed')
    })
  })

  describe('⚡ Performance Testing Basics', () => {

    it('should be able to measure page load time', () => {
      // 🎯 Learning Point: Page load performance testing
      cy.visit('https://example.cypress.io')

      cy.window().then((win) => {
        // 使用 Navigation Timing 计算首字节和整页加载时间
        const nav = win.performance.getEntriesByType('navigation')[0]
        const loadTime = nav
          ? nav.loadEventEnd - nav.startTime
          : win.performance.timing.loadEventEnd - win.performance.timing.navigationStart
        const ttfb = nav
          ? nav.responseStart - nav.startTime
          : win.performance.timing.responseStart - win.performance.timing.navigationStart

        cy.log(`TTFB: ${Math.round(ttfb)}ms, Load: ${Math.round(loadTime)}ms`)
        expect(loadTime).to.be.lessThan(5000) // Within 5 seconds
      })
    })

    it('should be able to monitor resource loading', () => {
      // 🎯 Learning Point: Resource loading monitoring
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
      })

      cy.visit('https://example.cypress.io')

      cy.then(() => {
        cy.log(`Total resources: ${resourceTimes.length}`)

        const slowResources = resourceTimes.filter(r => r.duration > 1000)
        if (slowResources.length > 0) {
          cy.log(`⚠️ Slow resources: ${slowResources.length}`)
        } else {
          cy.log('✅ All resources loaded well')
        }
      })
    })

    it('should be able to test API response time', () => {
      // 🎯 Learning Point: API performance testing
      cy.intercept('GET', '**/comments/*').as('apiCall')

      cy.visit('https://example.cypress.io/commands/network-requests')

      const startTime = Date.now()
      cy.get('.network-btn').click()

      cy.wait('@apiCall').then((interception) => {
        const endTime = Date.now()
        const responseTime = endTime - startTime

        cy.log(`API response time: ${responseTime}ms`)
        expect(responseTime).to.be.lessThan(5000) // Within 5 seconds
        cy.log('✅ API performance is good')
      })
    })
  })

  describe('🛠️ Custom Waiting Strategies', () => {

    it('should be able to use conditional waiting', () => {
      // 🎯 Learning Point: Conditional waiting
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email').should(($input) => {
        expect($input).to.exist
        expect($input).to.be.visible
        expect($input.attr('type')).to.equal('email')
      })

      cy.log('✅ Conditional waiting completed')
    })

    it('should be able to wait for multiple conditions', () => {
      // 🎯 Learning Point: Multiple condition waiting
      cy.visit('https://example.cypress.io/commands/querying')

      cy.get('h1').should(($h1) => {
        expect($h1).to.have.length(1)
        expect($h1.text()).to.include('Querying')
      })

      cy.get('.query-list').should(($list) => {
        expect($list).to.be.visible
        expect($list.children()).to.have.length.greaterThan(0)
      })

      cy.log('✅ Multiple condition waiting completed')
    })

    it('should be able to implement retry mechanism', () => {
      // 🎯 Learning Point: Retry strategy
      cy.visit('https://example.cypress.io/commands/actions')

      // Cypress automatically retries assertions until timeout
      cy.get('.action-email', { timeout: 10000 })
        .should('be.visible')
        .and('have.attr', 'placeholder')

      cy.log('✅ Retry mechanism verified')
    })
  })

  describe('🎯 Practical Exercises', () => {

    it('🏆 Exercise: Handle complete form flow', () => {
      // Comprehensive exercise: Form filling and submission
      cy.visit('https://example.cypress.io/commands/actions')

      cy.log('Starting form flow')

      // Step 1: Fill email
      cy.get('.action-email')
        .clear()
        .type('test@example.com')
        .should('have.value', 'test@example.com')
      cy.log('✅ Email filled')

      // Step 2: Select dropdown
      cy.get('.action-select')
        .select('apples')
        .should('have.value', 'fr-apples')
      cy.log('✅ Dropdown selected')

      // Step 3: Multi-select
      cy.get('.action-select-multiple')
        .select(['apples', 'oranges'])
      cy.log('✅ Multi-select completed')

      // Step 4: Focus and blur
      cy.get('.action-focus')
        .focus()
        .should('have.class', 'focus')
      cy.log('✅ Focus operation completed')

      cy.log('🎉 Form flow completed')
    })

    it('🏆 Exercise: Handle network requests and data validation', () => {
      // Comprehensive exercise: Network request handling
      cy.visit('https://example.cypress.io/commands/network-requests')

      cy.log('Starting network request testing')

      // Intercept all requests
      cy.intercept('GET', '**/comments/*').as('getComment')
      cy.intercept('POST', '**/comments').as('postComment')
      cy.intercept('PUT', '**/comments/*').as('putComment')

      // GET request
      cy.get('.network-btn').click()
      cy.wait('@getComment').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body).to.have.property('name')
        cy.log('✅ GET request completed')
      })

      // POST request
      cy.get('.network-post').click()
      cy.wait('@postComment').then((interception) => {
        expect(interception.response.statusCode).to.eq(201)
        cy.log('✅ POST request completed')
      })

      // PUT request
      cy.get('.network-put').click()
      cy.wait('@putComment').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        cy.log('✅ PUT request completed')
      })

      cy.log('🎉 Network request testing completed')
    })

    it('🏆 Exercise: Performance monitoring and optimization', () => {
      // Comprehensive exercise: Performance monitoring
      const performanceMetrics = {
        pageLoad: 0,
        resourceCount: 0,
        slowResources: 0
      }

      cy.log('Starting performance monitoring')

      const startTime = Date.now()

      cy.intercept('**/*', (req) => {
        performanceMetrics.resourceCount++
        const reqStart = Date.now()

        req.continue((res) => {
          const duration = Date.now() - reqStart
          if (duration > 1000) {
            performanceMetrics.slowResources++
          }
        })
      })

      cy.visit('https://example.cypress.io')

      cy.window().then(() => {
        performanceMetrics.pageLoad = Date.now() - startTime

        cy.log('Performance Metrics Summary:')
        cy.log(`- Page load time: ${performanceMetrics.pageLoad}ms`)
        cy.log(`- Total resources: ${performanceMetrics.resourceCount}`)
        cy.log(`- Slow resources: ${performanceMetrics.slowResources}`)

        // Performance assertion
        expect(performanceMetrics.pageLoad).to.be.lessThan(5000)

        if (performanceMetrics.slowResources === 0) {
          cy.log('✅ All resources loaded well')
        } else {
          cy.log(`⚠️ Found ${performanceMetrics.slowResources} slow resources`)
        }

        cy.log('🎉 Performance monitoring completed')
      })
    })
  })

  describe('💡 Summary and Best Practices', () => {

    it('📚 Async operations handling best practices summary', () => {
      cy.then(() => {
        cy.log('⏳ Async Operations Core Skills ✅')
        cy.log('1. ✅ Basic waiting strategies (time, network, elements)')
        cy.log('2. ✅ Dynamic content handling (requests, scrolling)')
        cy.log('3. ✅ Form interaction waiting (input, select, focus)')
        cy.log('4. ✅ Animation and transition handling')
        cy.log('5. ✅ Performance testing basics')
        cy.log('6. ✅ Custom waiting strategies')
        cy.log('7. ✅ Comprehensive practical exercises')

        cy.log('')
        cy.log('🎯 Waiting Strategy Priority:')
        cy.log('1. 🥇 Element state waiting (.should())')
        cy.log('2. 🥈 Network request waiting (cy.wait(@alias))')
        cy.log('3. 🥉 Custom condition waiting')
        cy.log('4. ❌ Fixed time waiting (last resort)')

        cy.log('')
        cy.log('📈 Next Learning: File Operations (Day 11)')
        cy.log('🎯 Focus: File I/O, upload/download, multimedia handling')
      })
    })
  })
})

/**
 * 🌟 Day 10 Learning Points Summary:
 *
 * 1. **Basic Waiting Strategies**
 *    - Various uses of cy.wait()
 *    - Network request waiting
 *    - DOM element waiting
 *
 * 2. **Dynamic Content Handling**
 *    - Network request interception and waiting
 *    - Page scrolling handling
 *    - Dynamic content loading
 *
 * 3. **Form Interaction**
 *    - Input operation waiting
 *    - Select operation waiting
 *    - Focus and blur handling
 *
 * 4. **Performance Testing**
 *    - Page load time
 *    - Resource loading monitoring
 *    - API response time
 *
 * 5. **Advanced Techniques**
 *    - Conditional waiting
 *    - Retry mechanism
 *    - Comprehensive practical applications
 *
 * 💡 **Practical Tips**:
 * - Prefer .should() over cy.wait(time)
 * - Set timeout parameters appropriately
 * - Leverage network interception for optimized waiting
 * - Implement custom waiting conditions
 *
 * 🚀 **Next Step**: Master file operations and upload/download testing
 */
