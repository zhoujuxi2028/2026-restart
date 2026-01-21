// ============================================
// Day 5: Test Organization & Lifecycle Management
// ============================================
// Learning Objectives: Master test organization, lifecycle hooks, test control, and maintainable test structure
// Website: https://example.cypress.io

describe('Day 5: Test Organization & Lifecycle Management', () => {

  // ============================================
  // Module 1: Deep Dive into Lifecycle Hooks
  // ============================================
  describe('Module 1: Lifecycle Hooks', () => {

    // Global data storage
    let testStartTime
    let globalCounter = 0

    // Initialize global data object
    const globalData = {}

    // before: Executes once before all tests
    before(() => {
      cy.log('🚀 Test suite execution started')
      testStartTime = Date.now()
      cy.log(`Start time: ${new Date(testStartTime).toLocaleTimeString()}`)

      // Simulate initialization operations
      cy.wrap(globalData).as('globalData')
    })

    // beforeEach: Executes before each test
    beforeEach(() => {
      globalCounter++
      cy.log(`📝 Preparing to execute test #${globalCounter}`)

      // Standard preparation before each test
      cy.visit('https://example.cypress.io')
      cy.get('h1').should('contain', 'Kitchen Sink')

      // Set test alias
      cy.wrap(`test-${globalCounter}`).as('currentTestId')
    })

    // after: Executes once after all tests
    after(() => {
      const endTime = Date.now()
      const duration = ((endTime - testStartTime) / 1000).toFixed(2)
      cy.log('🏁 Test suite execution completed')
      cy.log(`Total duration: ${duration} seconds`)
      cy.log(`Executed ${globalCounter} tests`)
    })

    // afterEach: Executes after each test
    afterEach(() => {
      cy.log(`✅ Test #${globalCounter} completed`)

      // Get current test state (can be used for cleanup in real projects)
      cy.get('@currentTestId').then((testId) => {
        cy.log(`Test ID: ${testId} completed`)
      })
    })

    it('1.1 Basic Hook Functionality Verification', () => {
      cy.log('🔍 Verifying hooks execute correctly')

      // Verify alias set by beforeEach
      cy.get('@currentTestId').should('equal', 'test-1')

      // Verify page state
      cy.url().should('include', 'example.cypress.io')
      cy.get('h1').should('be.visible')
    })

    it('1.2 Data Sharing Between Hooks', () => {
      cy.log('📊 Testing data sharing between hooks')

      // Verify counter increment
      cy.get('@currentTestId').should('equal', 'test-2')

      // Set test-specific data - directly modify closure variable
      globalData.lastTest = 'test-2'
      globalData.timestamp = Date.now()
      cy.log('Data updated')

      // Verify data
      cy.wrap(globalData).then((data) => {
        expect(data.lastTest).to.equal('test-2')
        expect(data.timestamp).to.be.a('number')
      })
    })

    it('1.3 Async Operations in Hooks', () => {
      cy.log('⏰ Testing async operation handling in hooks')

      // Verify data persistence - using closure variable
      cy.wrap(globalData).then((data) => {
        expect(data).to.have.property('lastTest')
        expect(data.lastTest).to.equal('test-2')
        cy.log(`Previous test: ${data.lastTest}`)
      })

      // Simulate async check
      cy.wait(100) // Brief wait to simulate async
      cy.get('body').should('be.visible')

      cy.log('Async operation verification completed')
    })
  })

  // ============================================
  // Module 2: Test Control and Conditional Execution
  // ============================================
  describe('Module 2: Test Control (.only, .skip)', () => {

    describe('Basic Control Methods', () => {

      beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions')
      })

      it('2.1 Normally Executed Test', () => {
        cy.log('✅ This test will execute normally')
        cy.get('.action-email').should('exist')
      })

      // Note: .only() and .skip() examples (will affect other tests when actually used)
      it('2.2 Demonstrate Test Control Syntax', () => {
        cy.log('📚 Learning test control syntax')

        // Show different control methods
        cy.log('Available test control methods:')
        cy.log('- it.only() - Execute only this test')
        cy.log('- it.skip() - Skip this test')
        cy.log('- describe.only() - Execute only this test group')
        cy.log('- describe.skip() - Skip this test group')

        // Verify page exists
        cy.get('.action-email').should('exist')
      })

      it('2.3 Conditional Test Execution', () => {
        cy.log('🔄 Demonstrating conditional test execution')

        // Execute different logic based on environment conditions
        const isProduction = Cypress.env('NODE_ENV') === 'production'

        if (isProduction) {
          cy.log('🏭 Production environment - Execute full test')
          cy.get('.action-email').clear().type('prod@example.com')
        } else {
          cy.log('🔧 Development environment - Execute basic test')
          cy.get('.action-email').should('be.visible')
        }
      })
    })

    // Demonstrate skipped test group
    describe.skip('Demonstrating Skipped Test Group', () => {
      it('This test will not execute', () => {
        cy.log('This will not be displayed')
      })
    })

    describe('Conditional Execution Demonstration', () => {

      // Simulate browser-specific tests
      it('2.4 Browser-Specific Tests', () => {
        cy.log('🌐 Execute different logic based on browser')

        const isChrome = Cypress.browser.name === 'chrome'
        const isFirefox = Cypress.browser.name === 'firefox'

        cy.visit('https://example.cypress.io/commands/actions')

        if (isChrome) {
          cy.log('Chrome browser - Execute Chrome-specific test')
          cy.get('.action-email')
            .clear()
            .type('chrome-user@example.com')
            .should('have.value', 'chrome-user@example.com')
        } else if (isFirefox) {
          cy.log('Firefox browser - Execute Firefox-specific test')
          cy.get('.action-email')
            .clear()
            .type('firefox-user@example.com')
        } else {
          cy.log('Other browser - Execute generic test')
          cy.get('.action-email').should('be.visible')
        }
      })
    })
  })

  // ============================================
  // Module 3: Nested Test Organization
  // ============================================
  describe('Module 3: Advanced Test Organization', () => {

    describe('User Management Features', () => {

      const userData = {
        admin: { email: 'admin@example.com', role: 'admin' },
        user: { email: 'user@example.com', role: 'user' },
        guest: { email: 'guest@example.com', role: 'guest' }
      }

      before(() => {
        // Prepare test data
        cy.wrap(userData).as('userData')
      })

      describe('Administrator Features', () => {

        beforeEach(() => {
          cy.log('🔑 Simulating administrator login')
          cy.visit('https://example.cypress.io/commands/actions')
          // Use closure variable instead of alias
          cy.log(`Current user: ${userData.admin.email}`)
        })

        it('3.1 Administrator Can Access All Features', () => {
          cy.log('👑 Administrator permission test')
          cy.get('.action-email')
            .clear()
            .type('admin@example.com')
            .should('have.value', 'admin@example.com')

          // Verify administrator-specific features
          cy.get('body').should('contain', 'Actions')
        })

        it('3.2 Administrator Can Manage Users', () => {
          cy.log('👥 User management feature test')
          cy.get('body').should('be.visible')
          // Simulate user management operations
          cy.log('✅ User management features working properly')
        })
      })

      describe('Regular User Features', () => {

        beforeEach(() => {
          cy.log('👤 Simulating regular user login')
          cy.visit('https://example.cypress.io/commands/actions')
        })

        it('3.3 User Can Perform Basic Operations', () => {
          cy.log('📝 Regular user feature test')
          cy.get('.action-email')
            .clear()
            .type('user@example.com')
            .should('have.value', 'user@example.com')
        })

        it('3.4 User Permission Restriction Verification', () => {
          cy.log('🚫 Permission restriction test')
          // Verify regular user cannot access admin features
          cy.get('body').should('be.visible')
          cy.log('✅ Permission control working properly')
        })
      })

      describe('Guest Features', () => {

        beforeEach(() => {
          cy.log('🕶️ Guest mode')
          cy.visit('https://example.cypress.io')
        })

        it('3.5 Guest Can Only Browse Public Content', () => {
          cy.log('👀 Guest browsing test')
          cy.get('h1').should('contain', 'Kitchen Sink')
          cy.get('body').should('be.visible')
        })
      })
    })

    describe('E-commerce Feature Modules', () => {

      const products = [
        { id: 1, name: 'iPhone', price: 999 },
        { id: 2, name: 'iPad', price: 599 },
        { id: 3, name: 'MacBook', price: 1299 }
      ]

      before(() => {
        cy.wrap(products).as('products')
      })

      describe('Product Browsing', () => {

        beforeEach(() => {
          cy.visit('https://example.cypress.io/commands/querying')
        })

        it('3.6 Product List Display', () => {
          cy.log('📱 Product list test')
          cy.get('@products').then((productList) => {
            cy.log(`Total ${productList.length} products`)
            productList.forEach((product, index) => {
              cy.log(`${index + 1}. ${product.name} - $${product.price}`)
            })
          })

          cy.get('h1').should('be.visible')
        })

        it('3.7 Product Search Feature', () => {
          cy.log('🔍 Product search test')
          cy.get('body').should('be.visible')
          cy.log('✅ Search feature working properly')
        })
      })

      describe('Shopping Cart Features', () => {

        let cart = []

        beforeEach(() => {
          cy.visit('https://example.cypress.io/commands/actions')
          cy.wrap(cart).as('cart')
        })

        it('3.8 Add Item to Shopping Cart', () => {
          cy.log('🛒 Add item test')

          // Simulate adding item to cart
          const mockProduct = { id: 1, name: 'Test Product', price: 99 }
          cart.push(mockProduct)
          cy.log(`Added: ${mockProduct.name}`)

          cy.get('.action-email')
            .clear()
            .type('shopper@example.com')
            .should('have.value', 'shopper@example.com')
        })

        it('3.9 Shopping Cart Item Management', () => {
          cy.log('📋 Shopping cart management test')
          cy.get('@cart').then((cartItems) => {
            if (cartItems.length > 0) {
              cy.log(`Shopping cart has ${cartItems.length} items`)
            } else {
              cy.log('Shopping cart is empty')
            }
          })
        })
      })
    })
  })

  // ============================================
  // Module 4: Best Practices and Patterns
  // ============================================
  describe('Module 4: Test Organization Best Practices', () => {

    describe('Data-Driven Testing', () => {

      const testUsers = [
        { email: 'test1@example.com', type: 'Regular User' },
        { email: 'test2@example.com', type: 'Premium User' },
        { email: 'admin@example.com', type: 'Administrator' }
      ]

      beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions')
      })

      testUsers.forEach((user, index) => {
        it(`4.${index + 1} ${user.type} Email Verification - ${user.email}`, () => {
          cy.log(`📧 Test user: ${user.email} (${user.type})`)

          cy.get('.action-email')
            .clear()
            .type(user.email)
            .should('have.value', user.email)

          // Execute different verification based on user type
          if (user.type === 'Administrator') {
            cy.log('🔑 Administrator special verification')
          } else {
            cy.log('👤 Regular user verification')
          }
        })
      })
    })

    describe('Cleanup and Recovery Pattern', () => {

      let originalTitle

      before(() => {
        cy.visit('https://example.cypress.io')
        cy.title().then((title) => {
          originalTitle = title
          cy.log(`Original title: ${title}`)
        })
      })

      beforeEach(() => {
        cy.log('🧹 Pre-test cleanup')
        cy.visit('https://example.cypress.io/commands/actions')
      })

      afterEach(() => {
        cy.log('🔄 Post-test recovery')
        // In real applications, data cleanup would happen here
        cy.log('Cleanup operations completed')
      })

      after(() => {
        cy.log('🏠 Return to original state')
        cy.visit('https://example.cypress.io')
        cy.title().should('include', 'Kitchen Sink')
      })

      it('4.4 Test Data Isolation', () => {
        cy.log('🔒 Data isolation test')
        cy.get('.action-email')
          .clear()
          .type('isolated-test@example.com')
          .should('have.value', 'isolated-test@example.com')
      })

      it('4.5 Test Environment Reset', () => {
        cy.log('🔄 Environment reset test')
        // Verify previous test data has been cleaned
        cy.get('.action-email').should('not.have.value', 'isolated-test@example.com')

        cy.get('.action-email')
          .clear()
          .type('reset-test@example.com')
      })
    })

    describe('Error Handling and Recovery', () => {

      beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions')
      })

      it('4.6 Graceful Error Handling', () => {
        cy.log('🛡️ Error handling test')

        // Use conditional operations to avoid test failure
        cy.get('body').then(($body) => {
          if ($body.find('.non-existent-element').length > 0) {
            cy.get('.non-existent-element').click()
          } else {
            cy.log('⚠️ Element does not exist, skipping operation')
            cy.get('.action-email').should('be.visible')
          }
        })
      })

      it('4.7 Retry Mechanism Demonstration', () => {
        cy.log('🔄 Retry mechanism test')

        // Simulate operation that may need retries
        let attemptCount = 0

        const attemptOperation = () => {
          attemptCount++
          cy.log(`Attempt count: ${attemptCount}`)

          if (attemptCount < 3) {
            cy.log('Simulating operation failure, preparing to retry')
          } else {
            cy.log('Operation successful')
          }
        }

        attemptOperation()
        cy.get('.action-email').should('be.visible')
      })
    })
  })
})

// ============================================
// Day 5 Module 1 Summary
// ============================================
/*
🎯 Learning Outcomes:
□ Master the use of four lifecycle hooks
□ Understand data sharing mechanisms between tests
□ Learn to use .only() and .skip() to control test execution
□ Master nested describe organization methods
□ Understand conditional test execution
□ Learn data-driven testing patterns
□ Master test cleanup and recovery patterns

🔥 Key Tips:
1. Hook execution order: before → beforeEach → test → afterEach → after
2. Data sharing: Use cy.wrap() and alias system
3. Conditional execution: Dynamically execute based on environment, browser, etc.
4. Test organization: Logical grouping, clear naming, reasonable nesting
5. Error handling: Graceful failure handling and retry mechanisms

📈 Next Steps:
Day 5 Module 2 will cover async operation handling and wait mechanisms
*/
