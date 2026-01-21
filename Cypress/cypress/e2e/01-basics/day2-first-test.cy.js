/**
 * 🌱 Day 2: First Test
 *
 * Learning Objectives:
 * - Master the usage of cy.visit(), cy.get(), cy.contains()
 * - Learn basic interaction operations .click(), .type()
 * - Understand the usage of .should() assertions
 * - Master the concept of chaining
 *
 * Self-Assessment:
 * ✅ Able to visit pages and verify content
 * ✅ Able to select elements and interact with them
 * ✅ Able to use assertions to verify results
 * ✅ Understand Cypress Time Travel debugging
 */

describe('🌱 Day 2: First Complete Test', () => {

  beforeEach(() => {
    // Visit homepage before each test
    cy.visit('https://example.cypress.io')
  })

  describe('🎯 Core Commands Learning', () => {

    it('✅ Should master cy.visit() page navigation', () => {
      // 🎯 Learning Point: Page navigation basics
      cy.log('Learning the usage of cy.visit()')

      // Verify current page
      cy.url().should('include', 'example.cypress.io')
      cy.title().should('include', 'Kitchen Sink')

      // Visit different page
      cy.visit('https://example.cypress.io/commands/querying')
      cy.url().should('include', '/commands/querying')

      cy.log('✅ cy.visit() mastered')
    })

    it('✅ Should master cy.get() element selection', () => {
      // 🎯 Learning Point: Element selectors
      cy.log('Learning various usages of cy.get()')

      // Tag selector
      cy.get('h1').should('contain.text', 'Kitchen Sink')

      // Class selector
      cy.get('.navbar-brand').should('be.visible')

      // Attribute selector
      cy.get('[href]').should('exist')
      cy.get('[class*="navbar"]').should('exist')

      // Navigate to page with more elements
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Querying').click()

      // Verify page has query-related elements
      cy.get('h1').should('exist')

      cy.log('✅ cy.get() selectors mastered')
    })

    it('✅ Should master cy.contains() text finding', () => {
      // 🎯 Learning Point: Finding elements by text content
      cy.log('Learning the usage of cy.contains()')

      // Find elements containing specific text
      cy.contains('Kitchen Sink').should('be.visible')

      // Text matching - using visible text on the page
      cy.contains('Commands').should('exist')

      // Navigate to Actions page for more tests
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // Find buttons on Actions page
      cy.contains('Action').should('exist')

      cy.log('✅ cy.contains() mastered')
    })

    it('✅ Should master .click() operation', () => {
      // 🎯 Learning Point: Basic interaction operations
      cy.log('Learning .click() operation')

      // Click dropdown menu
      cy.get('.dropdown').contains('Commands').click()

      // Click navigation link
      cy.contains('Actions').click()

      // Verify page navigation
      cy.url().should('include', '/commands/actions')

      // Click input field (demonstrating click functionality)
      cy.get('.action-email').click().should('be.focused')

      cy.log('✅ .click() operation mastered')
    })

    it('✅ Should master .type() input operation', () => {
      // 🎯 Learning Point: Text input operation
      cy.log('Learning .type() input operation')

      // Navigate to Actions page
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // Basic text input
      cy.get('.action-email')
        .type('test@example.com')
        .should('have.value', 'test@example.com')

      // Clear and re-enter
      cy.get('.action-email')
        .clear()
        .type('new@example.com')
        .should('have.value', 'new@example.com')

      cy.log('✅ .type() operation mastered')
    })

    it('✅ Should master .should() assertion verification', () => {
      // 🎯 Learning Point: Assertion verification techniques
      cy.log('Learning various usages of .should() assertions')

      // Existence assertions
      cy.get('h1').should('exist')
      cy.get('h1').should('be.visible')

      // Content assertions
      cy.title().should('include', 'Kitchen Sink')
      cy.get('h1').should('contain.text', 'Kitchen Sink')

      // Attribute assertions - verify page has elements with class attribute
      cy.get('.navbar-brand').should('have.class', 'navbar-brand')

      // Chained assertions
      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Kitchen Sink')

      cy.log('✅ .should() assertions mastered')
    })
  })

  describe('🔗 Chain Calling Practice', () => {

    it('✅ Should understand the concept of chain calling', () => {
      // 🎯 Learning Point: The power of Cypress chain calling
      cy.log('Learning Cypress chain calling')

      // Single chain operation - navigate and verify
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Querying').click()
      cy.url().should('include', '/commands/querying')

      // Complex chain operation
      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Querying')

      cy.log('✅ Chain calling concept mastered')
    })

    it('✅ Should master best practices for chain operations', () => {
      // 🎯 Learning Point: Proper use of chain operations
      cy.log('Learning chain operation best practices')

      // Navigate to Actions page
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()

      // Good chain operation: clear logic
      cy.get('.action-email')
        .should('exist')
        .should('be.visible')
        .should('be.enabled')

      // Step-by-step verification: breaking down complex logic
      cy.get('.action-email').clear()
      cy.get('.action-email').type('best@practice.com')
      cy.get('.action-email').should('have.value', 'best@practice.com')

      cy.log('✅ Chain operation best practices mastered')
    })
  })

  describe('🎪 Time Travel Debugging', () => {

    it('✅ Should understand Time Travel debugging feature', () => {
      // 🎯 Learning Point: Cypress unique debugging experience
      cy.log('🕐 Experiencing Time Travel debugging')

      // Record each step for debugging
      cy.get('h1').should('be.visible')
      cy.log('Step 1: Verify page title')

      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()
      cy.log('Step 2: Navigate to Actions page')

      cy.url().should('include', '/commands/actions')
      cy.log('Step 3: Verify page navigation')

      cy.get('.action-email').type('debug@example.com')
      cy.log('Step 4: Enter email address')

      // Add debugging point
      cy.debug()
      cy.log('🔍 Debug point: You can view element state in DevTools')

      cy.log('✅ Time Travel debugging experience complete')
    })
  })

  describe('🎯 Practical Exercises', () => {

    it('🏆 Comprehensive exercise: User registration flow test', () => {
      // 🎯 Learning Point: Comprehensive application of learned skills
      cy.log('Starting user registration flow test...')

      // 1. Navigate to form page
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click()
      cy.log('✅ Step 1: Navigate to form page')

      // 2. Fill in user information
      cy.get('.action-email')
        .clear()
        .type('user@example.com')
      cy.log('✅ Step 2: Fill in email')

      // Verify email input
      cy.get('.action-email').should('have.value', 'user@example.com')
      cy.log('✅ Step 3: Verify email input')

      // If there are other input fields, test them too
      cy.get('input[type="text"]').first().then(($input) => {
        if ($input.is(':visible')) {
          cy.wrap($input).clear().type('Test User')
          cy.log('✅ Step 4: Fill in other form fields')
        }
      })

      cy.log('🎉 User registration flow test complete!')
    })

    it('🏆 Comprehensive exercise: Page navigation and content verification', () => {
      // 🎯 Learning Point: Navigation between pages and content verification
      cy.log('Starting page navigation test...')

      // Navigation test data
      const pages = [
        { link: 'Querying', url: '/commands/querying', content: 'Querying' },
        { link: 'Traversal', url: '/commands/traversal', content: 'Traversal' },
        { link: 'Actions', url: '/commands/actions', content: 'Actions' }
      ]

      pages.forEach((page, index) => {
        cy.log(`Testing page ${index + 1}: ${page.link}`)

        // Return to homepage
        if (index > 0) {
          cy.visit('https://example.cypress.io')
        }

        // Click navigation link (via dropdown menu)
        cy.get('.dropdown').contains('Commands').click()
        cy.contains(page.link).click()

        // Verify URL
        cy.url().should('include', page.url)

        // Verify page content
        cy.get('h1').should('contain', page.content)

        cy.log(`✅ ${page.link} page test complete`)
      })

      cy.log('🎉 All page navigation tests complete!')
    })
  })

  describe('📊 Self-Assessment Evaluation', () => {

    it('📋 Day 2 Learning Achievement Test', () => {
      const skills = {
        pageVisit: false,
        elementSelection: false,
        textFinding: false,
        clicking: false,
        typing: false,
        assertions: false,
        chaining: false
      }

      cy.log('🔍 Starting Day 2 learning achievement test...')

      // Test 1: Page visit
      cy.visit('https://example.cypress.io').then(() => {
        skills.pageVisit = true
        cy.log('✅ Page visit: Passed')
      })

      // Test 2: Element selection
      cy.get('h1').should('exist').then(() => {
        skills.elementSelection = true
        cy.log('✅ Element selection: Passed')
      })

      // Test 3: Text finding
      cy.contains('Kitchen Sink').should('be.visible').then(() => {
        skills.textFinding = true
        cy.log('✅ Text finding: Passed')
      })

      // Test 4: Clicking
      cy.get('.dropdown').contains('Commands').click()
      cy.contains('Actions').click().then(() => {
        skills.clicking = true
        cy.log('✅ Clicking: Passed')
      })

      // Test 5: Text input
      cy.get('.action-email').type('test@cypress.io').should('have.value', 'test@cypress.io').then(() => {
        skills.typing = true
        cy.log('✅ Text input: Passed')
      })

      // Test 6: Assertions
      cy.url().should('include', '/commands/actions').then(() => {
        skills.assertions = true
        cy.log('✅ Assertions: Passed')
      })

      // Test 7: Chaining
      cy.get('.action-email').clear().type('chain@test.com').should('have.value', 'chain@test.com').then(() => {
        skills.chaining = true
        cy.log('✅ Chaining: Passed')
      })

      // Generate test report
      cy.then(() => {
        const passedSkills = Object.values(skills).filter(Boolean).length
        const totalSkills = Object.keys(skills).length
        const passRate = (passedSkills / totalSkills * 100).toFixed(1)

        cy.log('')
        cy.log('📊 Day 2 Learning Achievement Report:')
        cy.log(`Passed skills: ${passedSkills}/${totalSkills}`)
        cy.log(`Pass rate: ${passRate}%`)

        Object.keys(skills).forEach(skill => {
          const status = skills[skill] ? '✅' : '❌'
          cy.log(`${status} ${skill}`)
        })

        if (passRate >= 85) {
          cy.log('🎉 Excellent! Day 2 learning objectives exceeded!')
          cy.log('🚀 Ready to challenge Day 3 advanced content')
        } else if (passRate >= 70) {
          cy.log('👍 Good! Day 2 basic objectives achieved')
          cy.log('📚 You can continue to Day 3 content')
        } else {
          cy.log('⚠️ Recommend strengthening Day 2 practice')
          cy.log('🔄 Focus on reviewing failed skill points')
        }

        expect(passedSkills).to.be.at.least(6) // At least 6 skills passed
      })
    })

    it('📝 Learning suggestions and next steps', () => {
      cy.then(() => {
        cy.log('💡 Day 2 Learning Suggestions:')
        cy.log('1. 🎯 Practice different types of selectors')
        cy.log('2. 🔗 Understand the advantages of chaining and use it properly')
        cy.log('3. 🐛 Make good use of Time Travel feature for debugging')
        cy.log('4. 📝 Write clear test steps and logs')
        cy.log('')
        cy.log('🚀 Next Steps:')
        cy.log('📖 Day 3: Deep Mastery of Basic Commands')
        cy.log('🎯 Focus: Advanced selectors, complex interactions, conditional handling')
        cy.log('💪 Goal: Become a Cypress basic operations expert')
      })
    })
  })
})

/**
 * 🌟 Day 2 Core Learning Points Summary:
 *
 * 1. **Core Commands Mastery**
 *    - cy.visit(): Page navigation
 *    - cy.get(): Element selection
 *    - cy.contains(): Text finding
 *    - .click(): Click interaction
 *    - .type(): Text input
 *    - .should(): Assertion verification
 *
 * 2. **Understanding Chain Calling**
 *    - Automatic queuing of Cypress commands
 *    - Advantages of chain operations
 *    - Proper chain calling practices
 *
 * 3. **Debugging Techniques**
 *    - Time Travel feature
 *    - Using cy.debug()
 *    - Log output and step tracking
 *
 * 4. **Practical Applications**
 *    - Form interaction testing
 *    - Page navigation verification
 *    - Multi-step flow testing
 *
 * 💡 **Key Concepts**:
 * - Asynchronous command queuing mechanism
 * - Automatic waiting and retry
 * - Selector priority strategy
 *
 * 🎯 **Preparing for Day 3**:
 * Deep dive into advanced selectors and complex interaction scenarios
 */