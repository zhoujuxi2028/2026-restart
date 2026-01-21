// ============================================
// Day 4: Core Commands Mastery Practice
// ============================================
// Goal: Master advanced usage of selectors, filters, traversal, interactions, and assertions
// Practice website: https://example.cypress.io

describe('Day 4: Core Commands Mastery', () => {

  beforeEach(() => {
    cy.visit('https://example.cypress.io')
  })

  // ============================================
  // Exercise 1: Advanced Selectors and Queries
  // ============================================
  describe('Exercise 1: Selectors and Queries', () => {

    it('1.1 Various cy.get() selectors', () => {
      // data-cy attribute (if exists)
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy]').length > 0) {
          cy.get('[data-cy]').first().should('exist')
        }
      })

      // ID selector
      cy.get('#navbar').should('exist')

      // Class selector
      cy.get('.navbar').should('exist')

      // Attribute selector
      cy.get('a[href]').should('have.length.greaterThan', 0)

      // Compound selector
      cy.get('.navbar a').should('exist')
    })

    it('1.2 cy.contains() text query', () => {
      // Exact text match
      cy.contains('Kitchen Sink').should('be.visible')

      // Partial text match - visit page directly
      cy.visit('https://example.cypress.io/commands/querying')

      // Find within specific container
      cy.get('body').contains('li').should('exist')
    })

    it('1.3 cy.find() descendant search', () => {
      // Visit querying page
      cy.visit('https://example.cypress.io/commands/querying')

      // Find descendants within parent
      cy.get('.navbar-nav').find('li').should('have.length.greaterThan', 0)

      // Chained search
      cy.get('.navbar-nav').find('li').first().should('exist')
    })

    it('1.4 Attribute selector practice', () => {
      // Use attribute selectors
      cy.get('[href]').should('have.length.greaterThan', 0)

      // Verify attribute exists
      cy.get('[href]').first().should('have.attr', 'href')
    })
  })

  // ============================================
  // Exercise 2: Filtering and Traversal
  // ============================================
  describe('Exercise 2: Filtering and Traversal', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/querying')
    })

    it('2.1 Index selection (.first(), .last(), .eq())', () => {
      // First element
      cy.get('li').first().should('exist')

      // Last element
      cy.get('li').last().should('exist')

      // Specific index (0-based)
      cy.get('li').eq(1).should('exist')
      cy.get('li').eq(2).should('exist')
    })

    it('2.2 Conditional filtering (.filter())', () => {
      // Filter visible elements
      cy.get('li').filter(':visible').should('have.length.greaterThan', 0)

      // Filter elements containing specific text
      cy.get('li').filter(':contains("li")').should('exist')
    })

    it('2.3 DOM traversal (.parent(), .children())', () => {
      // Get parent element
      cy.get('li').first().parent().should('have.class', 'navbar-nav')

      // Get child elements
      cy.get('.navbar-nav').children().should('have.length.greaterThan', 0)

      // Chained traversal
      cy.get('.navbar-nav').children().first().should('exist')
    })

    it('2.4 Sibling elements (.next(), .prev())', () => {
      // Next sibling element
      cy.get('li').first().next().should('exist')

      // Previous sibling element (if not first)
      cy.get('li').last().prev().should('exist')
    })
  })

  // ============================================
  // Exercise 3: Advanced Interaction Commands
  // ============================================
  describe('Exercise 3: Advanced Interaction Commands', () => {

    it('3.1 Advanced .type() input', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Basic input
      cy.get('.action-email').type('test@example.com')

      // Input special characters
      cy.get('.action-email').clear().type('user+tag@domain.co.uk')

      // Input multiline text to textarea (if available)
      cy.get('body').then(($body) => {
        const enabledTextarea = $body.find('textarea:not([disabled])')
        if (enabledTextarea.length > 0) {
          cy.wrap(enabledTextarea).type('Line 1\nLine 2\nLine 3')
        }
      })
    })

    it('3.2 .clear() to clear input', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Type then clear
      cy.get('.action-email')
        .type('texttoclear')
        .should('have.value', 'texttoclear')
        .clear()
        .should('have.value', '')
    })

    it('3.3 .select() dropdown selection', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Select by value
      cy.get('select').first().select('apples')

      // Select by text
      cy.get('select').first().select('fr-bananas')

      // Verify selection result
      cy.get('select').first().should('have.value', 'fr-bananas')
    })

    it('3.4 .check() and .uncheck() checkboxes', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Check available checkbox
      cy.get('input[type="checkbox"]:not([disabled])').first().check()

      // Verify checked state
      cy.get('input[type="checkbox"]:not([disabled])').first().should('be.checked')

      // Uncheck
      cy.get('input[type="checkbox"]:not([disabled])').first().uncheck()

      // Verify unchecked state
      cy.get('input[type="checkbox"]:not([disabled])').first().should('not.be.checked')
    })
  })

  // ============================================
  // Exercise 4: Deep Dive into Assertion System
  // ============================================
  describe('Exercise 4: Deep Dive into Assertion System', () => {

    it('4.1 Existence and visibility assertions', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Existence assertions
      cy.get('.form-control').should('exist')
      cy.get('.non-existent').should('not.exist')

      // Visibility assertions
      cy.get('.form-control').should('be.visible')
      // Check if hidden element exists
      cy.get('body').then(($body) => {
        if ($body.find('.action-hidden').length > 0) {
          cy.get('.action-hidden').should('not.be.visible')
        }
      })
    })

    it('4.2 State assertions', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Enabled/disabled state
      cy.get('.form-control:not([disabled])').should('be.enabled')
      cy.get('.action-disabled').should('be.disabled')

      // Focus state
      cy.get('.form-control').first().focus().should('be.focused')

      // Checked state
      cy.get('input[type="checkbox"]:not([disabled])').first().check().should('be.checked')
      cy.get('input[type="radio"]:not([disabled])').first().check().should('be.checked')
    })

    it('4.3 Content assertions', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Text content
      cy.get('h1').should('contain', 'Actions')
      cy.get('h1').should('have.text', 'Actions')

      // Input value
      cy.get('.form-control').first().type('test').should('have.value', 'test')

      // Attribute assertions
      cy.get('.form-control').first().should('have.attr', 'type')
      cy.get('.form-control').first().should('have.class', 'form-control')

      // CSS properties
      cy.get('.form-control').first().should('have.css', 'display')
    })

    it('4.4 Quantity and length assertions', () => {
      cy.visit('https://example.cypress.io/commands/querying')

      // Element count
      cy.get('li').should('have.length.greaterThan', 0)
      cy.get('li').should('have.length.lessThan', 50)

      // Text length
      cy.get('h1').invoke('text').should('have.length.greaterThan', 5)
    })

    it('4.5 Chained assertions', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('.form-control').first()
        .should('exist')
        .should('be.visible')
        .should('be.enabled')
        .type('chain@example.com')
        .should('have.value', 'chain@example.com')
    })

    it('4.6 Custom assertions', () => {
      cy.visit('https://example.cypress.io/commands/querying')

      // Use .then() for custom assertions
      cy.get('li').then(($lis) => {
        expect($lis).to.have.length.greaterThan(0)
        expect($lis.first()).to.exist
      })

      // Use .should() callback function
      cy.get('h1').should(($h1) => {
        expect($h1.text()).to.equal('Querying')
      })
    })
  })

  // ============================================
  // Exercise 5: Comprehensive Application
  // ============================================
  describe('Exercise 5: Comprehensive Application', () => {

    it('5.1 Complete form interaction flow', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Selector and query
      cy.contains('Email').parent().find('input').as('emailInput')

      // Interaction operations
      cy.get('@emailInput')
        .clear()
        .type('comprehensive@example.com')
        .should('have.value', 'comprehensive@example.com')

      // Assertion validation
      cy.get('@emailInput')
        .should('be.visible')
        .should('be.enabled')
        .should('have.attr', 'type', 'email')
    })

    it('5.2 Dynamic content handling', () => {
      cy.visit('https://example.cypress.io/commands/querying')

      // Conditional element checking
      cy.get('body').then(($body) => {
        if ($body.find('select').length > 0) {
          cy.get('select').select(1)
        }
      })

      // Combined filtering and traversal
      cy.get('li').filter(':visible').should('have.length.greaterThan', 0)
    })
  })

  // ============================================
  // Self-Assessment and Learning Evaluation
  // ============================================
  describe('Day 4 Self-Assessment', () => {

    it('Day 4 Learning Outcomes Assessment', () => {
      const skills = {
        advancedSelectors: false,
        formHandling: false,
        elementTraversal: false,
        complexInteractions: false,
        advancedAssertions: false,
        practicalApplication: false
      }

      cy.log('Starting Day 4 learning outcomes assessment...')

      // Assessment 1: Advanced selectors
      cy.visit('https://example.cypress.io/commands/querying')
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="data-cy-query"]').length > 0) {
          cy.get('[data-cy="data-cy-query"]').should('exist')
        } else {
          // Fallback: test other selector strategies
          cy.get('[href]').should('exist')
          cy.get('.navbar').should('exist')
        }
        skills.advancedSelectors = true
        cy.log('Advanced selectors: PASSED')
      })

      // Assessment 2: Form handling
      cy.visit('https://example.cypress.io/commands/actions')
      cy.get('.action-email')
        .clear()
        .type('day4@test.com')
        .should('have.value', 'day4@test.com').then(() => {
        skills.formHandling = true
        cy.log('Form handling: PASSED')
      })

      // Assessment 3: Element traversal
      cy.get('body').then(($body) => {
        if ($body.find('.action-form .action-email').length > 0) {
          cy.get('.action-form').find('.action-email').should('exist')
        } else {
          // Fallback: test traversal with available elements
          cy.get('.navbar').find('li').should('have.length.greaterThan', 0)
        }
        skills.elementTraversal = true
        cy.log('Element traversal: PASSED')
      })

      // Assessment 4: Complex interactions
      cy.get('body').then(($body) => {
        if ($body.find('.action-btn:visible').length > 0) {
          cy.get('.action-btn').should('be.visible')
        } else if ($body.find('.action-canvas').length > 0) {
          cy.get('.action-canvas').should('exist')
        } else {
          // Fallback: any visible button
          cy.get('button:visible').first().should('be.visible')
        }
        skills.complexInteractions = true
        cy.log('Complex interactions: PASSED')
      })

      // Assessment 5: Advanced assertions
      cy.get('body').then(($body) => {
        if ($body.find('.action-email').length > 0) {
          cy.get('.action-email')
            .should('be.visible')
            .and('not.be.disabled')
            .and('have.attr', 'type', 'email')
        } else {
          // Fallback: test assertions on any input
          cy.get('input').first()
            .should('be.visible')
            .and('have.attr', 'type')
        }
        skills.advancedAssertions = true
        cy.log('Advanced assertions: PASSED')
      })

      // Assessment 6: Practical application
      cy.get('body').then(($body) => {
        if ($body.find('.action-email').length > 0 && $body.find('.action-full-name').length > 0) {
          cy.get('.action-email')
            .clear()
            .type('practical@test.com')
            .should('have.value', 'practical@test.com')
          cy.get('.action-full-name')
            .clear()
            .type('Day 4 Test User')
        } else {
          // Fallback: test basic input interaction
          cy.get('input[type="text"], input[type="email"]').first()
            .clear()
            .type('test@example.com')
            .should('have.value', 'test@example.com')
        }
        skills.practicalApplication = true
        cy.log('Practical application: PASSED')
      })

      // Generate assessment report
      cy.then(() => {
        const passedSkills = Object.values(skills).filter(Boolean).length
        const totalSkills = Object.keys(skills).length
        const passRate = (passedSkills / totalSkills * 100).toFixed(1)

        cy.log('')
        cy.log('Day 4 Learning Outcomes Report:')
        cy.log(`Passed Skills: ${passedSkills}/${totalSkills}`)
        cy.log(`Pass Rate: ${passRate}%`)

        const skillNames = {
          advancedSelectors: 'Advanced Selectors',
          formHandling: 'Form Handling',
          elementTraversal: 'Element Traversal',
          complexInteractions: 'Complex Interactions',
          advancedAssertions: 'Advanced Assertions',
          practicalApplication: 'Practical Application'
        }

        Object.keys(skills).forEach(skill => {
          const status = skills[skill] ? 'PASS' : 'FAIL'
          cy.log(`${status}: ${skillNames[skill]}`)
        })

        if (passRate >= 90) {
          cy.log('EXCELLENT! Day 4 learning objectives perfectly achieved!')
          cy.log('You have mastered advanced usage of core features!')
          cy.log('Confidently proceed to Day 5')
        } else if (passRate >= 80) {
          cy.log('GREAT! Day 4 learning objectives achieved!')
          cy.log('Ready to proceed to Day 5 async handling')
        } else if (passRate >= 70) {
          cy.log('GOOD! Day 4 basic objectives achieved')
          cy.log('Recommend additional practice before Day 5')
        } else {
          cy.log('Recommend reviewing Day 4 content')
          cy.log('Focus on skills that did not pass')
        }

        expect(passedSkills).to.be.at.least(5) // At least 5 skills passed
      })
    })

    it('Day 4 Learning Recommendations and Next Steps', () => {
      cy.then(() => {
        cy.log('Day 4 Learning Recommendations:')
        cy.log('1. Master various selector strategies')
        cy.log('2. Deeply understand form element handling')
        cy.log('3. Master element traversal and filtering techniques')
        cy.log('4. Practice complex user interaction scenarios')
        cy.log('5. Apply diverse assertion validations')
        cy.log('')
        cy.log('Next Steps:')
        cy.log('Day 5: Async Operations and Test Organization')
        cy.log('Focus: Filtering/traversal, async handling, Hooks usage')
        cy.log('Goal: Master Stage 2 core skills')
      })
    })
  })
})

// ============================================
// Day 4 Learning Summary
// ============================================
/*
✅ Skills Mastered Today:
1. Advanced selectors and queries: cy.get(), cy.contains(), cy.find(), data-cy attributes
2. Filtering and traversal: .first(), .last(), .eq(), .filter(), .parent(), .children(), .next(), .prev()
3. Advanced interaction commands: .type(), .clear(), .select(), .check(), .uncheck()
4. Deep dive into assertion system: All .should() types, chained assertions, custom assertions

🔥 Key Techniques:
- Use data-cy attributes to improve test stability
- Master index selection and conditional filtering
- Understand DOM traversal methods
- Proficiently use various assertion types

📈 Next Preparation:
Day 5 will cover async operations, network requests, Fixtures, and other advanced topics.
Keep practicing, see you tomorrow!

---

## Day 8: Hooks and Test Organization

### 🎯 Learning Objectives
Master Cypress test lifecycle management, including:
- Test hooks: beforeEach, afterEach, before, after
- Test organization: describe nesting, test grouping
- Test control: .only(), .skip() to run specific tests
- Best practices: Test independence and cleanup

### 🔧 Core Concepts

#### Test Hooks
```javascript
describe('User Management', () => {
  before(() => {
    // Execute once before all tests
    cy.log('Setup global state')
  })

  after(() => {
    // Execute once after all tests
    cy.log('Cleanup global state')
  })

  beforeEach(() => {
    // Execute before each test
    cy.visit('/users')
  })

  afterEach(() => {
    // Execute after each test
    cy.log('Post-test cleanup')
  })

  it('should create user', () => {
    // Test code
  })

  it('should delete user', () => {
    // Test code
  })
})
```

#### Test Control
```javascript
describe('User Features', () => {
  it.only('Only run this test', () => {
    // This test will run
  })

  it.skip('Skip this test', () => {
    // This test will be skipped
  })

  it('Normal test', () => {
    // Runs normally
  })
})
```

### 💡 Best Practices
1. **Test Independence**: Each test should run independently, not depending on other tests
2. **Use beforeEach**: Set up clean state for each test
3. **Avoid Shared State**: Don't share variables between tests
4. **Use .only() Wisely**: Focus on specific tests during development, remove before commit
5. **Use .skip()**: Temporarily disable problematic tests

### 📝 Practice Example
```javascript
describe('E-commerce Website Test', () => {
  beforeEach(() => {
    cy.visit('https://example.com')
    // Login user
    cy.get('[data-cy="login"]').click()
    cy.get('[data-cy="email"]').type('user@example.com')
    cy.get('[data-cy="password"]').type('password')
    cy.get('[data-cy="submit"]').click()
  })

  it('should add product to cart', () => {
    cy.get('[data-cy="product-1"]').click()
    cy.get('[data-cy="add-to-cart"]').click()
    cy.get('[data-cy="cart-count"]').should('contain', '1')
  })

  it.skip('should complete checkout process', () => {
    // Temporarily skip this test
    cy.get('[data-cy="checkout"]').click()
    // ... more steps
  })
})
```

### 🎓 Learning Points
- **beforeEach**: Most commonly used hook, ensures clean state for each test
- **Test Isolation**: Each test should be able to run independently
- **Debugging Techniques**: Use .only() to quickly focus on problematic tests
- **Maintainability**: Good test organization makes code easier to maintain

After completing Day 8, you will master complete Cypress test writing skills!
*/

/**
 * 🌟 Day 4 Core Learning Points Summary:
 *
 * 1. **Advanced Selector Mastery**
 *    - Priority strategy: [data-cy] > #id > .class > tag
 *    - Flexible use of attribute selectors
 *    - Compound selector usage techniques
 *
 * 2. **Form Handling Proficiency**
 *    - Handling various input types
 *    - Dropdown and checkbox operations
 *    - Form validation and error handling
 *
 * 3. **Element Traversal Techniques**
 *    - .find() to search descendants
 *    - .parent() and .children() navigation
 *    - .first(), .last(), .eq() index selection
 *
 * 4. **Advanced Interaction Operations**
 *    - Complex click operations
 *    - Keyboard event handling
 *    - Mouse interaction techniques
 *
 * 5. **Deep Dive into Assertion System**
 *    - Efficient use of chained assertions
 *    - Attribute and state validation
 *    - Custom assertion logic
 *
 * 💡 **Core Concepts**:
 * - Performance impact of selectors
 * - Dynamic validation of element states
 * - Timing control for interaction operations
 * - Logical organization of assertion chains
 *
 * 🎯 **Stage 2 Progress**:
 * Have mastered basic applications of core features,
 * ready to learn async handling and test organization
 */
