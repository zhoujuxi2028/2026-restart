// ============================================
// Day 15: Advanced Testing Architecture Patterns
// ============================================
// Learning Objectives:
// - Master Page Object Model (POM) design pattern
// - Learn App Actions pattern
// - Implement reusable test components
// - Build maintainable test architecture

describe('Day 15: Advanced Testing Architecture Patterns', () => {

  // ============================================
  // Module 1: Page Object Model (POM) Pattern
  // ============================================
  describe('Module 1: Page Object Model Design Pattern', () => {

    // Define Page Object - Login Page
    class LoginPage {
      // Element selectors
      get emailInput() { return cy.get('.action-email') }
      get submitButton() { return cy.get('.action-btn').first() }
      get errorMessage() { return cy.get('.error-message') }

      // Page action methods
      visit() {
        cy.visit('https://example.cypress.io/commands/actions')
        return this
      }

      enterEmail(email) {
        this.emailInput.clear().type(email)
        return this
      }

      submit() {
        this.submitButton.click()
        return this
      }

      // Composite operations
      login(email) {
        this.enterEmail(email)
        this.submit()
        return this
      }

      // Verification methods
      verifyEmailValue(expectedEmail) {
        this.emailInput.should('have.value', expectedEmail)
        return this
      }
    }

    it('1.1 Testing with Page Object pattern', () => {
      cy.log('📄 Demonstrating Page Object Model pattern')

      const loginPage = new LoginPage()

      loginPage
        .visit()
        .enterEmail('user@example.com')
        .verifyEmailValue('user@example.com')
        .submit()

      cy.log('✅ Page Object pattern test completed')
    })

    it('1.2 Page Object method chaining', () => {
      cy.log('🔗 Demonstrating elegance of method chaining')

      const loginPage = new LoginPage()

      // Method chaining for cleaner code
      loginPage
        .visit()
        .login('chained@example.com')
        .verifyEmailValue('chained@example.com')

      cy.log('✅ Method chaining verification completed')
    })

    it('1.3 Multiple Page Objects collaboration', () => {
      cy.log('🤝 Demonstrating multiple page objects working together')

      // Home Page Object
      class HomePage {
        visitCommands() {
          cy.get('.dropdown').contains('Commands').click()
          return this
        }

        navigateToActions() {
          cy.contains('Actions').click()
          return new ActionsPage()
        }
      }

      // Actions Page Object
      class ActionsPage {
        get emailInput() { return cy.get('.action-email') }

        fillEmail(email) {
          this.emailInput.clear().type(email)
          return this
        }

        verifyUrl() {
          cy.url().should('include', '/commands/actions')
          return this
        }
      }

      // Using multiple page objects
      cy.visit('https://example.cypress.io')

      const homePage = new HomePage()
      homePage
        .visitCommands()
        .navigateToActions()
        .verifyUrl()
        .fillEmail('multi-page@example.com')

      cy.log('✅ Multiple page object collaboration completed')
    })
  })

  // ============================================
  // Module 2: App Actions Pattern
  // ============================================
  describe('Module 2: App Actions Pattern', () => {

    // App Actions: Execute operations directly through application interface
    // Skip UI interactions to improve test speed and stability

    it('2.1 Using App Actions to set application state', () => {
      cy.log('⚡ Demonstrating App Actions pattern')

      // Visit page
      cy.visit('https://example.cypress.io/commands/actions')

      // Use App Action to directly set state (simulated)
      cy.window().then((win) => {
        // In real applications, this would call internal APIs
        // For example: win.app.setUser({ email: 'test@example.com' })
        cy.log('Setting application state via App Action')
      })

      // Verify state
      cy.get('.action-email')
        .clear()
        .type('app-action@example.com')
        .should('have.value', 'app-action@example.com')

      cy.log('✅ App Actions demonstration completed')
    })

    it('2.2 Combining UI and App Actions', () => {
      cy.log('🔄 Mixing UI and App Actions')

      cy.visit('https://example.cypress.io/commands/actions')

      // Critical path uses UI testing
      cy.get('.action-email')
        .clear()
        .type('hybrid@example.com')

      // Non-critical path uses App Actions (faster)
      cy.window().then(() => {
        cy.log('Using App Action to skip non-critical UI interactions')
      })

      // Verify final state
      cy.get('.action-email').should('have.value', 'hybrid@example.com')

      cy.log('✅ Hybrid mode testing completed')
    })

    it('2.3 App Actions for test preparation', () => {
      cy.log('🎯 Using App Actions to quickly prepare test data')

      // Visit page
      cy.visit('https://example.cypress.io')

      // Use App Action to quickly prepare test state
      cy.window().then((win) => {
        // Simulate quick setup:
        // - Create test user
        // - Set permissions
        // - Prepare test data
        cy.log('App Action: Preparing test environment')
        cy.log('App Action: Creating test user')
        cy.log('App Action: Setting permissions and state')
      })

      // Directly start testing key functionality
      cy.get('h1').should('contain', 'Kitchen Sink')

      cy.log('✅ Test preparation completed')
    })
  })

  // ============================================
  // Module 3: Reusable Test Components
  // ============================================
  describe('Module 3: Reusable Test Component Design', () => {

    // Reusable test helper class
    class TestHelpers {
      // Generic wait method
      static waitForElement(selector, timeout = 5000) {
        return cy.get(selector, { timeout }).should('be.visible')
      }

      // Generic form filling method
      static fillForm(formData) {
        Object.keys(formData).forEach(key => {
          cy.get(`[name="${key}"]`).clear().type(formData[key])
        })
      }

      // Generic verification method
      static verifyFormValues(formData) {
        Object.keys(formData).forEach(key => {
          cy.get(`[name="${key}"]`).should('have.value', formData[key])
        })
      }

      // Generic navigation method
      static navigateTo(section, subsection) {
        cy.get('.dropdown').contains(section).click()
        cy.contains(subsection).click()
      }
    }

    it('3.1 Simplifying tests with reusable components', () => {
      cy.log('🧩 Demonstrating reusable test components')

      cy.visit('https://example.cypress.io')

      // Use reusable navigation method
      TestHelpers.navigateTo('Commands', 'Actions')

      // Verify navigation succeeded
      cy.url().should('include', '/commands/actions')

      // Use reusable wait method
      TestHelpers.waitForElement('.action-email')

      cy.log('✅ Reusable component testing completed')
    })

    it('3.2 Combining multiple helper methods', () => {
      cy.log('🔧 Combining test helper methods')

      cy.visit('https://example.cypress.io/commands/actions')

      // Wait for page to load
      TestHelpers.waitForElement('.action-email')

      // Fill form
      cy.get('.action-email')
        .clear()
        .type('helper@example.com')

      // Verify results
      cy.get('.action-email').should('have.value', 'helper@example.com')

      cy.log('✅ Combined helper methods completed')
    })

    it('3.3 Creating domain-specific test DSL', () => {
      cy.log('🎨 Creating test domain-specific language')

      // Define test DSL
      const TestDSL = {
        // User actions
        user: {
          navigateToActions() {
            cy.visit('https://example.cypress.io')
            cy.get('.dropdown').contains('Commands').click()
            cy.contains('Actions').click()
          },

          enterEmail(email) {
            cy.get('.action-email').clear().type(email)
          },

          shouldSeeEmail(email) {
            cy.get('.action-email').should('have.value', email)
          }
        },

        // Page verification
        page: {
          shouldBeOnActions() {
            cy.url().should('include', '/commands/actions')
            cy.get('h1').should('contain', 'Actions')
          }
        }
      }

      // Write tests using DSL
      TestDSL.user.navigateToActions()
      TestDSL.page.shouldBeOnActions()
      TestDSL.user.enterEmail('dsl@example.com')
      TestDSL.user.shouldSeeEmail('dsl@example.com')

      cy.log('✅ DSL testing completed')
    })
  })

  // ============================================
  // Module 4: Test Data Management
  // ============================================
  describe('Module 4: Test Data Management Patterns', () => {

    // Test data factory
    class UserFactory {
      static validUser() {
        return {
          email: `user-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'user'
        }
      }

      static adminUser() {
        return {
          email: `admin-${Date.now()}@example.com`,
          name: 'Admin User',
          role: 'admin'
        }
      }

      static invalidUser() {
        return {
          email: 'invalid-email',
          name: '',
          role: ''
        }
      }
    }

    it('4.1 Using data factory pattern', () => {
      cy.log('🏭 Demonstrating data factory pattern')

      const testUser = UserFactory.validUser()

      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email')
        .clear()
        .type(testUser.email)
        .should('have.value', testUser.email)

      cy.log(`✅ Using test data: ${testUser.email}`)
    })

    it('4.2 Data builder pattern', () => {
      cy.log('🔨 Demonstrating data builder pattern')

      // Data builder
      class UserBuilder {
        constructor() {
          this.user = {
            email: 'default@example.com',
            name: 'Default',
            role: 'user'
          }
        }

        withEmail(email) {
          this.user.email = email
          return this
        }

        withName(name) {
          this.user.name = name
          return this
        }

        asAdmin() {
          this.user.role = 'admin'
          return this
        }

        build() {
          return this.user
        }
      }

      // Using builder
      const customUser = new UserBuilder()
        .withEmail('builder@example.com')
        .withName('Builder User')
        .asAdmin()
        .build()

      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.action-email')
        .clear()
        .type(customUser.email)
        .should('have.value', customUser.email)

      cy.log(`✅ Built user: ${JSON.stringify(customUser)}`)
    })

    it('4.3 Test data set management', () => {
      cy.log('📚 Managing test data sets')

      // Centralized test data management
      const TestData = {
        users: {
          valid: ['user1@test.com', 'user2@test.com', 'user3@test.com'],
          invalid: ['invalid', '@test.com', 'test@'],
          special: ['test+filter@example.com', 'user.name@example.com']
        }
      }

      cy.visit('https://example.cypress.io/commands/actions')

      // Iterate through test data
      TestData.users.valid.forEach((email, index) => {
        cy.log(`Testing user ${index + 1}: ${email}`)
        cy.get('.action-email')
          .clear()
          .type(email)
          .should('have.value', email)
      })

      cy.log('✅ Data set testing completed')
    })
  })

  // ============================================
  // Module 5: Comprehensive Practice - Building Complete Test Framework
  // ============================================
  describe('Module 5: Comprehensive Practice', () => {

    // Complete test framework example
    class TestFramework {
      // Page Objects
      static pages = {
        home: {
          visit() {
            cy.visit('https://example.cypress.io')
          },
          navigateToCommands() {
            cy.get('.dropdown').contains('Commands').click()
          }
        },
        actions: {
          visit() {
            cy.visit('https://example.cypress.io/commands/actions')
          },
          fillEmail(email) {
            cy.get('.action-email').clear().type(email)
          },
          verifyEmail(email) {
            cy.get('.action-email').should('have.value', email)
          }
        }
      }

      // Test Helpers
      static helpers = {
        waitFor(selector, timeout = 5000) {
          return cy.get(selector, { timeout }).should('be.visible')
        },
        verifyUrl(path) {
          cy.url().should('include', path)
        }
      }

      // Test Data
      static data = {
        generateEmail() {
          return `test-${Date.now()}@example.com`
        }
      }
    }

    it('5.1 Using complete test framework', () => {
      cy.log('🎯 Demonstrating complete test framework')

      // Using different parts of the framework
      TestFramework.pages.home.visit()
      TestFramework.pages.home.navigateToCommands()

      cy.contains('Actions').click()
      TestFramework.helpers.verifyUrl('/commands/actions')

      const testEmail = TestFramework.data.generateEmail()
      TestFramework.pages.actions.fillEmail(testEmail)
      TestFramework.pages.actions.verifyEmail(testEmail)

      cy.log('✅ Framework integration testing completed')
    })

    it('5.2 Maintainable test structure', () => {
      cy.log('📐 Demonstrating maintainable test structure')

      // Clear test steps
      // 1. Prepare
      const testUser = {
        email: 'maintainable@example.com'
      }

      // 2. Execute
      TestFramework.pages.actions.visit()
      TestFramework.pages.actions.fillEmail(testUser.email)

      // 3. Verify
      TestFramework.pages.actions.verifyEmail(testUser.email)

      cy.log('✅ Maintainable structure demonstration completed')
    })

    it('5.3 Best practices summary', () => {
      cy.log('📚 Test architecture best practices')

      cy.visit('https://example.cypress.io/commands/actions')

      // Best practice points
      const bestPractices = [
        '✅ Use Page Objects to encapsulate page logic',
        '✅ Create reusable helper functions',
        '✅ Use data factories to manage test data',
        '✅ Keep test code DRY (Don\'t Repeat Yourself)',
        '✅ Write clear test descriptions',
        '✅ Separate test logic from page interactions',
        '✅ Use method chaining to improve readability',
        '✅ Centralize test configuration and constants'
      ]

      bestPractices.forEach(practice => {
        cy.log(practice)
      })

      cy.get('.action-email')
        .clear()
        .type('best-practices@example.com')
        .should('have.value', 'best-practices@example.com')

      cy.log('🎉 Advanced testing patterns learning completed!')
    })
  })
})

/**
 * 🌟 Day 15 Learning Points Summary:
 *
 * 1. **Page Object Model (POM)**
 *    - Encapsulate page elements and operations
 *    - Improve code reusability
 *    - Reduce maintenance costs
 *    - Support method chaining
 *
 * 2. **App Actions Pattern**
 *    - Operate directly through application API
 *    - Improve test speed
 *    - Enhance test stability
 *    - Quickly prepare test state
 *
 * 3. **Reusable Components**
 *    - Create test helper classes
 *    - Build test DSL
 *    - Extract common logic
 *    - Improve test efficiency
 *
 * 4. **Test Data Management**
 *    - Data factory pattern
 *    - Data builder pattern
 *    - Centralized test data management
 *    - Dynamic test data generation
 *
 * 5. **Architecture Design Principles**
 *    - Single Responsibility Principle
 *    - DRY Principle
 *    - Separation of Concerns
 *    - Extensibility Design
 *
 * 💡 **Key Takeaways**:
 * - Good test architecture significantly improves test maintainability
 * - Proper use of design patterns reduces code duplication
 * - Clear code organization makes team collaboration smoother
 * - Investing in test infrastructure pays off in the long run
 */
