// ============================================
// Day 5: Async Operations & Wait Mechanisms
// ============================================
// Learning Objectives: Master async operation handling, wait mechanisms, network interception basics
// Website: https://example.cypress.io + Actual API testing

describe('Day 5: Async Operations & Wait Mechanisms', () => {

  // ============================================
  // Module 1: Deep Dive into Wait Mechanisms
  // ============================================
  describe('Module 1: Wait Mechanisms', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io')
    })

    it('1.1 Implicit Wait vs Explicit Wait', () => {
      cy.log('⏳ Understanding Cypress default wait mechanisms')

      // Cypress implicit wait (default 4 seconds)
      cy.get('h1').should('be.visible') // Automatically waits until element appears

      // Navigate to Actions page to observe waiting
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // Cypress automatically waits for page load and element appearance
      cy.url().should('include', '/commands/actions')
      cy.get('.action-email').should('be.visible')

      cy.log('✅ Implicit wait mechanism verification completed')
    })

    it('1.2 Explicit Wait - cy.wait()', () => {
      cy.log('🕐 Learning explicit wait use cases')

      cy.visit('https://example.cypress.io/commands/actions')

      // Scenario 1: Fixed time wait
      cy.log('Waiting 1 second to simulate loading time')
      cy.wait(1000)

      // Scenario 2: Simulate waiting for animation completion
      cy.get('.action-email')
        .clear()
        .type('slow-typing@example.com')

      cy.log('Waiting for input animation to complete')
      cy.wait(500)

      cy.get('.action-email').should('have.value', 'slow-typing@example.com')

      // Note: Fixed time waits should be avoided in real projects
      cy.log('⚠️ Note: Prefer conditional waits over fixed time waits')
    })

    it('1.3 Conditional Wait - should() & Retry Mechanism', () => {
      cy.log('🔄 Mastering conditional wait and retry mechanism')

      cy.visit('https://example.cypress.io/commands/actions')

      // Wait for element to become visible
      cy.get('.action-email')
        .should('be.visible')
        .should('be.enabled')
        .should('not.be.disabled')

      // Wait for specific attribute value
      cy.get('.action-email')
        .invoke('attr', 'type')
        .should('equal', 'email')

      // Wait for text content
      cy.get('h1')
        .should('contain.text', 'Actions')
        .should('be.visible')

      cy.log('✅ Conditional wait mechanism verification completed')
    })

    it('1.4 Custom Wait Conditions', () => {
      cy.log('🎯 Creating custom wait conditions')

      cy.visit('https://example.cypress.io/commands/querying')

      // Wait for page fully loaded (multiple conditions combined)
      cy.get('h1').should('be.visible')
      cy.get('body').should('be.visible')
      cy.url().should('include', '/querying')

      // Wait for specific element count
      cy.get('li').should('have.length.greaterThan', 5)

      // Custom complex wait conditions
      cy.get('body').within(() => {
        cy.get('h1').should('exist')
        cy.get('p').should('have.length.greaterThan', 0)
      })

      cy.log('✅ Custom wait condition verification completed')
    })
  })

  // ============================================
  // Module 2: Network Interception Basics
  // ============================================
  describe('Module 2: Network Interception Introduction (cy.intercept)', () => {

    beforeEach(() => {
      // Setup network interception - using more generic interception pattern
      cy.intercept('GET', '**/commands/querying').as('queryingPage')
    })

    it('2.1 Basic Network Interception', () => {
      cy.log('🌐 Learning basic network interception')

      // Visit page to trigger interception
      cy.visit('https://example.cypress.io')

      // Click navigation link (through dropdown menu)
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Querying').click()

      // Wait for network request to complete
      cy.wait('@queryingPage').then((interception) => {
        cy.log('Network request intercepted')
        cy.log(`Request URL: ${interception.request.url}`)
        if (interception.response) {
          cy.log(`Response status: ${interception.response.statusCode}`)
        }
      })

      cy.url().should('include', '/commands/querying')
    })

    it('2.2 Dynamic Response Interception', () => {
      cy.log('📡 Dynamically modifying network response')

      // Intercept and modify response
      cy.intercept('GET', '**/commands/actions', (req) => {
        req.reply((res) => {
          // Simulate slow network
          res.delay = 1000
          res.send(res.body)
        })
      }).as('actionsPage')

      cy.visit('https://example.cypress.io')
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // Wait for delayed request
      cy.wait('@actionsPage')
      cy.url().should('include', '/commands/actions')

      cy.log('✅ Dynamic response interception verification completed')
    })

    it('2.3 API Request Interception', () => {
      cy.log('🔗 Intercepting API requests')

      // Simulate API request interception
      cy.intercept('GET', '**/api/**', {
        statusCode: 200,
        body: {
          success: true,
          data: { message: 'Mock API Response' }
        }
      }).as('apiRequest')

      // Since example.cypress.io has no real API, we simulate with page requests
      cy.intercept('GET', '**/commands/misc', {
        statusCode: 200,
        body: '<html><body><h1>Mock Response</h1></body></html>'
      }).as('mockApi')

      cy.visit('https://example.cypress.io')

      // Try to trigger request (if exists)
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="misc"]').length > 0) {
          cy.contains('Misc').click()
          cy.wait('@mockApi')
        } else {
          cy.log('Misc link not found, skipping API interception test')
        }
      })
    })
  })

  // ============================================
  // Module 3: Dynamic Content Handling
  // ============================================
  describe('Module 3: Dynamic Content & Loading States', () => {

    it('3.1 Wait for Dynamic Content Loading', () => {
      cy.log('📱 Handling dynamically loaded content')

      cy.visit('https://example.cypress.io/commands/querying')

      // Wait for basic page elements to load
      cy.get('h1').should('contain', 'Querying')

      // Wait for list items to finish loading
      cy.get('li').should('have.length.greaterThan', 3)

      // Wait for specific content to appear
      cy.contains('cy.get()').should('be.visible')
      cy.contains('cy.contains()').should('be.visible')

      cy.log('✅ Dynamic content loading completed')
    })

    it('3.2 Handle Asynchronously Rendered Elements', () => {
      cy.log('⚡ Handling asynchronously rendered elements')

      cy.visit('https://example.cypress.io/commands/traversal')

      // Wait for page title
      cy.get('h1').should('be.visible')

      // Wait for page content to load (using more generic selector)
      cy.get('body').within(() => {
        // Use more flexible wait strategy - wait for any content element
        cy.get('p, div, code').first().should('exist')
      })

      // Wait for interactive elements to be ready
      cy.get('body').should('be.visible')
      cy.url().should('include', '/traversal')

      cy.log('✅ Async element rendering completed')
    })

    it('3.3 Polling Check Pattern', () => {
      cy.log('🔄 Implementing polling check pattern')

      cy.visit('https://example.cypress.io/commands/actions')

      // Simulate polling to check a state
      const checkElementState = () => {
        cy.get('.action-email').then(($el) => {
          const currentValue = $el.val()
          cy.log(`Current value: ${currentValue || 'empty'}`)

          if (!currentValue) {
            cy.log('Element not yet initialized, continue checking...')
            // In real applications, this would be actual polling
            cy.wait(100)
          }
        })
      }

      checkElementState()

      // Verify final element state
      cy.get('.action-email')
        .should('be.visible')
        .should('have.attr', 'placeholder')

      cy.log('✅ Polling check completed')
    })

    it('3.4 Complex Async Scenario Handling', () => {
      cy.log('🎭 Handling complex async scenarios')

      cy.visit('https://example.cypress.io')

      // Scenario: Multi-step async navigation
      cy.get('h1').should('contain', 'Kitchen Sink')

      // Step 1: Wait for navigation link to be available (through dropdown menu)
      cy.get('.dropdown').contains('Commands').should('be.visible').click()

      // Step 2: Click submenu item
      cy.contains('Actions').click()

      // Verify navigation success
      cy.url().should('include', '/commands/actions')
      cy.get('body').should('be.visible')

      // Step 3: Confirm on correct page
      cy.get('.action-email').should('be.visible')

      // Step 4: Execute complex operation
      cy.get('.action-email')
        .clear()
        .type('complex@example.com')
        .should('have.value', 'complex@example.com')

      // Verify entire flow
      cy.url().should('include', '/actions')
      cy.get('h1').should('contain', 'Actions')

      cy.log('✅ Complex async scenario handling completed')
    })
  })

  // ============================================
  // Module 4: Real-World Application Scenarios
  // ============================================
  describe('Module 4: Practical Async Operation Scenarios', () => {

    it('4.1 Form Submission Wait', () => {
      cy.log('📝 Simulating async form submission handling')

      cy.visit('https://example.cypress.io/commands/actions')

      // Fill form
      cy.get('.action-email')
        .clear()
        .type('submit-test@example.com')

      // Simulate form validation wait
      cy.get('.action-email')
        .should('have.value', 'submit-test@example.com')
        .should('be.visible')

      // In real applications, this would wait for submission response
      cy.log('Simulating server response wait...')
      cy.wait(500)

      // Verify submission result (simulated)
      cy.get('.action-email').should('be.visible')
      cy.log('✅ Form submission flow completed')
    })

    it('4.2 File Upload Wait', () => {
      cy.log('📁 Simulating async file upload handling')

      cy.visit('https://example.cypress.io/commands/actions')

      // Look for file upload element (if exists)
      cy.get('body').then(($body) => {
        if ($body.find('input[type="file"]').length > 0) {
          cy.log('File upload control found')

          // Simulate file selection
          cy.get('input[type="file"]').selectFile({
            contents: 'cypress/fixtures/example.json',
            fileName: 'test-file.json'
          }, { force: true })

          // Wait for upload processing
          cy.wait(1000)
        } else {
          cy.log('File upload control not found, using simulated scenario')

          // Simulate file upload flow
          cy.get('.action-email')
            .clear()
            .type('file-upload@example.com')

          cy.log('Simulating file upload...')
          cy.wait(800)
          cy.log('✅ File upload completed (simulated)')
        }
      })
    })

    it('4.3 Search Autocomplete Wait', () => {
      cy.log('🔍 Simulating search autocomplete')

      cy.visit('https://example.cypress.io/commands/actions')

      // Simulate search input
      cy.get('.action-email')
        .clear()
        .type('search-query')

      // Simulate waiting for search results
      cy.log('Waiting for search results...')
      cy.wait(300)

      // Continue typing to trigger more suggestions
      cy.get('.action-email')
        .type('@example')

      cy.log('Waiting for updated search suggestions...')
      cy.wait(200)

      // Complete search
      cy.get('.action-email')
        .type('.com')
        .should('have.value', 'search-query@example.com')

      cy.log('✅ Search autocomplete flow completed')
    })

    it('4.4 Pagination Load Wait', () => {
      cy.log('📄 Simulating async pagination loading')

      cy.visit('https://example.cypress.io/commands/querying')

      // Wait for initial content to load
      cy.get('h1').should('be.visible')
      cy.get('li').should('have.length.greaterThan', 0)

      const initialItemCount = 0
      cy.get('li').then(($items) => {
        const currentCount = $items.length
        cy.log(`Initial item count: ${currentCount}`)

        // Simulate scrolling to bottom to trigger more loading
        cy.scrollTo('bottom')
        cy.wait(500)

        // Check if new content exists
        cy.get('li').should('have.length.greaterThan', 0)
        cy.log('✅ Pagination load check completed')
      })
    })

    it('4.5 Real-time Data Update Wait', () => {
      cy.log('🔄 Simulating real-time data updates')

      cy.visit('https://example.cypress.io/commands/actions')

      // Record initial state
      let initialTime = Date.now()
      cy.wrap(initialTime).as('startTime')

      // Simulate data update check
      const checkForUpdates = () => {
        cy.get('@startTime').then((startTime) => {
          const currentTime = Date.now()
          const elapsed = currentTime - startTime

          cy.log(`Checking for updates, elapsed time: ${elapsed}ms`)

          if (elapsed < 2000) {
            // Continue waiting for updates
            cy.wait(200)
            checkForUpdates()
          } else {
            cy.log('✅ Simulated data update completed')
          }
        })
      }

      // Start checking for updates
      checkForUpdates()

      // Verify final state
      cy.get('body').should('be.visible')
    })

    it('4.6 Network Error Recovery', () => {
      cy.log('🛠️ Handling network errors and retries')

      // Simulate network error
      cy.intercept('GET', '**/commands/network-requests', {
        statusCode: 500,
        body: { error: 'Server Error' }
      }).as('networkError')

      cy.visit('https://example.cypress.io')

      // Try to access page that may fail
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="network-requests"]').length > 0) {
          cy.contains('Network Requests').click()
          cy.wait('@networkError')
        }
      })

      // Simulate error recovery
      cy.intercept('GET', '**/commands/network-requests', {
        statusCode: 200,
        body: '<html><body><h1>Network Recovered</h1></body></html>'
      }).as('networkRecovered')

      // Retry operation
      cy.log('Network recovered, retrying request')
      cy.wait(1000)

      cy.log('✅ Network error recovery handling completed')
    })
  })

  // ============================================
  // Module 5: Performance & Timeout Management
  // ============================================
  describe('Module 5: Timeout & Performance Management', () => {

    it('5.1 Custom Timeout Configuration', () => {
      cy.log('⏱️ Learning custom timeout configuration')

      cy.visit('https://example.cypress.io/commands/actions')

      // Set longer timeout for specific operations
      cy.get('.action-email', { timeout: 10000 })
        .should('be.visible')
        .clear({ timeout: 5000 })
        .type('timeout-test@example.com', { delay: 100 })

      // Verify timeout configuration is effective
      cy.get('.action-email', { timeout: 8000 })
        .should('have.value', 'timeout-test@example.com')

      cy.log('✅ Custom timeout test completed')
    })

    it('5.2 Performance Monitoring', () => {
      cy.log('📊 Monitoring operation performance')

      const startTime = performance.now()

      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email')
        .clear()
        .type('performance-test@example.com')
        .then(() => {
          const endTime = performance.now()
          const duration = endTime - startTime
          cy.log(`Operation duration: ${duration.toFixed(2)}ms`)

          // Verify performance is within reasonable range
          expect(duration).to.be.lessThan(10000) // Less than 10 seconds
        })

      cy.log('✅ Performance monitoring test completed')
    })

    it('5.3 Batch Operation Optimization', () => {
      cy.log('⚡ Optimizing batch operation performance')

      cy.visit('https://example.cypress.io/commands/actions')

      // Batch operation simulation
      const testEmails = [
        'batch1@example.com',
        'batch2@example.com',
        'batch3@example.com'
      ]

      testEmails.forEach((email, index) => {
        cy.log(`Batch test ${index + 1}/${testEmails.length}: ${email}`)

        cy.get('.action-email')
          .clear()
          .type(email)
          .should('have.value', email)

        // Brief wait to avoid too fast operations
        cy.wait(200)
      })

      cy.log('✅ Batch operation optimization completed')
    })
  })
})

// ============================================
// Day 5 Module 2 Summary
// ============================================
/*
🎯 Learning Outcomes:
□ Understand the difference between implicit and explicit waits
□ Master the correct use cases for cy.wait()
□ Learn to use conditional waits and retry mechanisms
□ Master cy.intercept() network interception basics
□ Able to handle dynamically loaded content
□ Learn to handle complex async scenarios
□ Master performance monitoring and timeout management

🔥 Key Tips:
1. Prefer conditional waits over fixed time waits
2. Network interception can control test environment
3. Timeout settings should be reasonable, not too short or long
4. Use aliases to manage network requests
5. Polling checks are suitable for state change scenarios

⚠️ Important Notes:
1. Avoid overusing cy.wait() with fixed times
2. Network interceptions should be set in beforeEach
3. Timeout durations should be adjusted based on actual situations
4. Async operations should have proper error handling

📈 Next Steps:
Day 5 Module 3 will cover comprehensive practical project applications
*/
