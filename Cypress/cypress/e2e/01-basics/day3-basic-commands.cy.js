/**
 * 🌱 Day 3: Deep Mastery of Basic Commands
 *
 * Learning Objectives:
 * - Master various selector strategies and best practices
 * - Master advanced click operations and form interactions
 * - Learn conditional element handling
 * - Understand dynamic content waiting mechanisms
 *
 * Self-Assessment:
 * ✅ Master selector priority strategies
 * ✅ Able to handle complex interaction scenarios
 * ✅ Understand the correct use of chained assertions
 * ✅ Master conditional element handling techniques
 */

describe('🌱 Day 3: Deep Mastery of Basic Commands', () => {

  // ============================================
  // Basic Practice: Various uses of cy.visit()
  // ============================================
  describe('✅ Complete Mastery of cy.visit()', () => {

    it('Visit homepage and verify', () => {
      cy.visit('https://example.cypress.io')
      cy.url().should('include', 'example.cypress.io')
      cy.title().should('include', 'Kitchen Sink')
    })

    it('Direct visit to sub-page', () => {
      cy.visit('https://example.cypress.io/commands/actions')
      cy.url().should('include', '/commands/actions')
      cy.get('h1').should('contain', 'Actions')
    })

    it('Visit different pages', () => {
      // Use confirmed available page paths
      const pages = [
        '/commands/querying',
        '/commands/actions',
        '/commands/traversal'  // Replace utilities with more stable traversal
      ]

      pages.forEach(page => {
        cy.visit(`https://example.cypress.io${page}`)
        cy.url().should('include', page)
        cy.get('h1').should('be.visible')
      })
    })
  })

  // ============================================
  // Basic Practice: cy.get() Selector Mastery
  // ============================================
  describe('✅ cy.get() Selector Mastery', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/actions')
    })

    it('Tag selector', () => {
      cy.get('h1').should('exist')
      cy.get('input').should('have.length.greaterThan', 0)
      cy.get('button').should('exist')
    })

    it('Class selector', () => {
      cy.get('.action-email').should('be.visible')
      cy.get('.form-group').should('exist')
    })

    it('Attribute selector', () => {
      cy.get('[placeholder]').should('exist')
      cy.get('[type="email"]').should('be.visible')
      cy.get('input[class*="action"]').should('exist')
    })

    it('Compound selector', () => {
      cy.get('input.action-email').should('be.visible')
      cy.get('div input[type="email"]').should('exist')
    })

    it('Index and filtering', () => {
      cy.get('input').first().should('exist')
      cy.get('input').last().should('exist')
      cy.get('input').eq(0).should('exist')
    })
  })

  // ============================================
  // Basic Practice: .click() Interaction Mastery
  // ============================================
  describe('✅ .click() Interaction Mastery', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/actions')
    })

    it('Click input to gain focus', () => {
      cy.get('.action-email')
        .click()
        .should('be.focused')
    })

    it('Click button (if exists)', () => {
      cy.get('body').then(($body) => {
        const buttons = $body.find('button:visible')
        if (buttons.length > 0) {
          cy.wrap(buttons).first().click()
        } else {
          cy.log('No visible buttons found, test passed')
        }
      })
    })

    it('Force click example', () => {
      cy.get('.action-email').click({ force: true })
      cy.get('.action-email').should('be.focused')
    })

    it('Double click operation', () => {
      // Use stable existing element for double-click demonstration
      cy.get('.action-email').dblclick()
      // Verify element still exists and is interactive after double-click
      cy.get('.action-email').should('be.visible')
    })
  })

  // ============================================
  // Basic Practice: Complete .should() Assertions
  // ============================================
  describe('✅ Complete .should() Assertions', () => {

    beforeEach(() => {
      cy.visit('https://example.cypress.io/commands/actions')
    })

    it('Existence assertions', () => {
      cy.get('.action-email').should('exist')
      cy.get('.non-existent-class').should('not.exist')
    })

    it('Visibility assertions', () => {
      cy.get('.action-email').should('be.visible')
      cy.get('h1').should('not.be.hidden')
    })

    it('Attribute assertions', () => {
      // Separate assertions to avoid type issues in chained assertions
      cy.get('.action-email').should('have.attr', 'type', 'email')
      cy.get('.action-email').should('have.attr', 'placeholder')
      cy.get('.action-email').should('have.class', 'action-email')
    })

    it('State assertions', () => {
      cy.get('.action-email')
        .should('be.enabled')
        .click()
        .should('be.focused')
    })

    it('Text and value assertions', () => {
      cy.get('h1').should('contain', 'Actions')
      cy.get('h1').should('not.be.empty')

      cy.get('.action-email')
        .type('test@example.com')
        .should('have.value', 'test@example.com')
    })

    it('Chained assertions (recommended approach)', () => {
      cy.get('.action-email')
        .should('exist')
        .should('be.visible')
        .should('be.enabled')
        .should('have.attr', 'type', 'email')
    })

    it('Quantity assertions', () => {
      cy.get('input').should('have.length.greaterThan', 1)
      cy.get('h1').should('have.length', 1)
    })
  })

  // ============================================
  // Comprehensive Exercise: Four Commands Collaboration
  // ============================================
  describe('🔥 Comprehensive Exercise: Four Commands Collaboration', () => {

    it('Complete form interaction flow', () => {
      // 1. Visit page
      cy.visit('https://example.cypress.io/commands/actions')
      cy.url().should('include', '/commands/actions')

      // 2. Find element
      cy.get('.action-email')
        .should('be.visible')
        .should('be.enabled')

      // 3. Interaction operations
      cy.get('.action-email')
        .click()
        .clear()
        .type('learning@cypress.io')

      // 4. Verify results
      cy.get('.action-email')
        .should('have.value', 'learning@cypress.io')
        .should('be.focused')
    })

    it('Multi-step operation practice', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Email input
      cy.get('.action-email')
        .clear()
        .type('step1@test.com')
        .should('have.value', 'step1@test.com')

      // If there are more input fields, continue operation
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

    it('Error handling and edge cases', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Test empty value handling
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
  // Learning Summary: Phase One Knowledge Verification
  // ============================================
  describe('🎓 Phase One Knowledge Verification', () => {

    it('Verify all core concepts', () => {
      // Day 1 Concept: Cypress browser-based execution
      cy.visit('https://example.cypress.io')
      cy.title().should('not.be.empty') // Verify page loaded

      // Day 2 Concept: Project structure and basic testing
      cy.url().should('include', 'example.cypress.io')

      // Day 3 Concept: Four core commands
      cy.visit('https://example.cypress.io/commands/actions') // cy.visit()
      cy.get('.action-email')                                 // cy.get()
        .click()                                             // .click()
        .type('mastery@cypress.io')                          // More interaction
        .should('have.value', 'mastery@cypress.io')          // .should()

      // Verify learning achievements
      cy.get('.action-email').should('be.focused')
    })

    it('Demonstrate best practices', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Best Practice 1: Clear chaining
      cy.get('.action-email')
        .should('be.visible')      // Verify first
        .clear()                   // Clear
        .type('best@practice.com') // Operate
        .should('have.value', 'best@practice.com') // Verify result

      // Best Practice 2: Use stable selectors
      cy.get('[type="email"]').should('exist')

      // Best Practice 3: Proper assertions
      cy.get('.action-email').should('be.enabled')
    })
  })

  // ============================================
  // Debugging and Learning Techniques
  // ============================================
  describe('💡 Debugging and Learning Techniques', () => {

    it('Use .then() for conditional logic', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      cy.get('body').then(($body) => {
        // Execute different operations based on actual page conditions
        if ($body.find('.action-email').length > 0) {
          cy.get('.action-email').type('conditional@test.com')
        }

        // Check if there are available textareas (not disabled)
        if ($body.find('textarea:not([disabled])').length > 0) {
          cy.get('textarea:not([disabled])').type('This is a textarea')
        } else {
          cy.log('No available textarea found, skipping operation')
        }
      })
    })

    it('Timeout and retry demonstration', () => {
      cy.visit('https://example.cypress.io/commands/actions')

      // Custom timeout
      cy.get('.action-email', { timeout: 10000 })
        .should('be.visible')

      // Verify automatic retry mechanism
      cy.get('.action-email')
        .type('retry@test.com')
        .should('have.value', 'retry@test.com')
    })

    it('Use .log() to record debugging information', () => {
      cy.log('Starting debugging test')

      cy.visit('https://example.cypress.io/commands/actions')
      cy.log('Page loaded')

      cy.get('.action-email').then(($input) => {
        cy.log(`Found input field, placeholder: ${$input.attr('placeholder')}`)
      })

      // Separate chain calling to avoid .then() affecting subsequent commands
      cy.get('.action-email').type('debug@test.com')

      cy.log('Test completed')
    })
  })

  // ============================================
  // Self-Assessment and Learning Evaluation
  // ============================================
  describe('📊 Self-Assessment Evaluation', () => {

    it('📋 Day 3 Learning Achievement Test', () => {
      const skills = {
        advancedVisit: false,
        selectorMastery: false,
        complexInteractions: false,
        chainedAssertions: false,
        conditionalHandling: false,
        debuggingSkills: false,
        bestPractices: false
      }

      cy.log('🔍 Starting Day 3 learning achievement test...')

      // Test 1: Advanced page visit
      cy.visit('https://example.cypress.io/commands/actions')
        .then(() => {
          skills.advancedVisit = true
          cy.log('✅ Advanced page visit: Passed')
        })

      // Test 2: Selector mastery
      cy.get('.action-email').should('exist')
        .then(() => {
          skills.selectorMastery = true
          cy.log('✅ Selector mastery: Passed')
        })

      // Test 3: Complex interactions
      cy.get('.action-email')
        .clear()
        .type('advanced@test.com')
        .should('have.value', 'advanced@test.com')
        .then(() => {
          skills.complexInteractions = true
          cy.log('✅ Complex interactions: Passed')
        })

      // Test 4: Chained assertions
      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Actions')
        .then(() => {
          skills.chainedAssertions = true
          cy.log('✅ Chained assertions: Passed')
        })

      // Test 5: Conditional handling
      cy.get('body').then(($body) => {
        if ($body.find('.action-email').length > 0) {
          skills.conditionalHandling = true
          cy.log('✅ Conditional handling: Passed')
        }
      })

      // Test 6: Debugging skills
      cy.log('Debug info: Verifying debugging skills')
        .then(() => {
          skills.debuggingSkills = true
          cy.log('✅ Debugging skills: Passed')
        })

      // Test 7: Best practices
      cy.get('.action-email')
        .should('be.visible')
        .clear()
        .type('bestpractice@test.com')
        .should('have.value', 'bestpractice@test.com')
        .then(() => {
          skills.bestPractices = true
          cy.log('✅ Best practices: Passed')
        })

      // Generate test report
      cy.then(() => {
        const passedSkills = Object.values(skills).filter(Boolean).length
        const totalSkills = Object.keys(skills).length
        const passRate = (passedSkills / totalSkills * 100).toFixed(1)

        cy.log('')
        cy.log('📊 Day 3 Learning Achievement Report:')
        cy.log(`Passed skills: ${passedSkills}/${totalSkills}`)
        cy.log(`Pass rate: ${passRate}%`)

        Object.keys(skills).forEach(skill => {
          const status = skills[skill] ? '✅' : '❌'
          const skillNames = {
            advancedVisit: 'Advanced Page Visit',
            selectorMastery: 'Selector Mastery',
            complexInteractions: 'Complex Interactions',
            chainedAssertions: 'Chained Assertions',
            conditionalHandling: 'Conditional Handling',
            debuggingSkills: 'Debugging Skills',
            bestPractices: 'Best Practices'
          }
          cy.log(`${status} ${skillNames[skill]}`)
        })

        if (passRate >= 90) {
          cy.log('🏆 Excellent! Day 3 learning objectives perfectly achieved!')
          cy.log('🚀 You are now a Cypress fundamentals expert!')
          cy.log('📚 Highly recommend proceeding to Day 4 core features')
        } else if (passRate >= 80) {
          cy.log('🎉 Great! Day 3 learning objectives exceeded!')
          cy.log('📚 You can confidently enter Phase Two learning')
        } else if (passRate >= 70) {
          cy.log('👍 Good! Day 3 basic objectives achieved')
          cy.log('💪 Recommend more practice before entering Day 4')
        } else {
          cy.log('⚠️ Recommend focusing on reviewing Day 3 content')
          cy.log('🔄 Pay special attention to failed skill points')
        }

        expect(passedSkills).to.be.at.least(6) // At least 6 skills passed
      })
    })

    it('📈 Phase One Overall Assessment', () => {
      const phase1Skills = {
        day1Environment: true,  // Day 1 Environment setup
        day1BasicSyntax: true,  // Day 1 Basic syntax
        day2CoreCommands: true, // Day 2 Core commands
        day2ChainCalls: true,   // Day 2 Chain calls
        day3SelectorMastery: false, // Day 3 Selector mastery
        day3AdvancedInteractions: false, // Day 3 Advanced interactions
        day3BestPractices: false // Day 3 Best practices
      }

      cy.log('🔍 Phase One (Day 1-3) overall skill assessment...')

      // Simulate Day 3 core skills test
      cy.visit('https://example.cypress.io/commands/actions')
        .then(() => {
          phase1Skills.day3SelectorMastery = true
          cy.log('✅ Day 3 Selector mastery: Verified')
        })

      cy.get('.action-email')
        .type('phase1@assessment.com')
        .should('have.value', 'phase1@assessment.com')
        .then(() => {
          phase1Skills.day3AdvancedInteractions = true
          cy.log('✅ Day 3 Advanced interactions: Verified')
        })

      cy.get('h1')
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Actions')
        .then(() => {
          phase1Skills.day3BestPractices = true
          cy.log('✅ Day 3 Best practices: Verified')
        })

      // Generate Phase One overall report
      cy.then(() => {
        const passedPhase1 = Object.values(phase1Skills).filter(Boolean).length
        const totalPhase1 = Object.keys(phase1Skills).length
        const phase1Rate = (passedPhase1 / totalPhase1 * 100).toFixed(1)

        cy.log('')
        cy.log('🏆 Phase One (Day 1-3) Overall Report:')
        cy.log(`Mastered skills: ${passedPhase1}/${totalPhase1}`)
        cy.log(`Mastery rate: ${phase1Rate}%`)

        const skillGroups = {
          'Day 1 - Environment & Basics': {
            day1Environment: 'Environment Setup',
            day1BasicSyntax: 'Basic Syntax'
          },
          'Day 2 - Core Commands': {
            day2CoreCommands: 'Core Commands',
            day2ChainCalls: 'Chain Calls'
          },
          'Day 3 - Deep Mastery': {
            day3SelectorMastery: 'Selector Mastery',
            day3AdvancedInteractions: 'Advanced Interactions',
            day3BestPractices: 'Best Practices'
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
          cy.log('🎉 Congratulations! Phase One learning completed successfully!')
          cy.log('🏅 You have fully mastered Cypress fundamentals')
          cy.log('🚀 Ready to enter Phase Two - Core Features Learning')
          cy.log('')
          cy.log('🎯 Next Learning Plan:')
          cy.log('📖 Day 4: Advanced Selectors and Interactions')
          cy.log('📖 Day 5: Traversal and Filtering Techniques')
          cy.log('📖 Day 6: Common Interaction Commands')
          cy.log('📖 Day 7: In-Depth Assertion System')
          cy.log('📖 Day 8: Hooks and Test Organization')
        } else if (phase1Rate >= 75) {
          cy.log('')
          cy.log('👍 Phase One learning basically completed!')
          cy.log('💪 Recommend more practice before entering Phase Two')
        } else {
          cy.log('')
          cy.log('⚠️ Recommend continuing to consolidate Phase One fundamentals')
          cy.log('🔄 Focus on reviewing unmastered skill points')
        }

        expect(passedPhase1).to.be.at.least(6) // At least 6 skills mastered in Phase One
      })
    })

    it('📝 Learning suggestions and resource recommendations', () => {
      cy.then(() => {
        cy.log('💡 Day 3 Learning Suggestions Summary:')
        cy.log('')
        cy.log('🎯 Core Skills Enhancement:')
        cy.log('1. 📍 Selector Strategy - Prioritize [data-cy] > #id > .class')
        cy.log('2. 🔗 Chain Calling - Organize properly, avoid over-complexity')
        cy.log('3. 🛡️ Conditional Handling - Use .then() for conditional logic')
        cy.log('4. 🐛 Debugging Techniques - Make good use of cy.log() and Time Travel')
        cy.log('')
        cy.log('📚 Recommended Practice:')
        cy.log('1. 🌐 Practice same skills on different websites')
        cy.log('2. 🔄 Run tests repeatedly, observe Cypress behavior')
        cy.log('3. 🛠️ Try modifying test code, understand each part\'s role')
        cy.log('4. 📝 Record problems encountered and solutions')
        cy.log('')
        cy.log('🔗 Useful Resources:')
        cy.log('📖 Cypress Official Docs: https://docs.cypress.io')
        cy.log('🎥 Cypress Official Examples: https://example.cypress.io')
        cy.log('💬 Community Support: https://github.com/cypress-io/cypress')
        cy.log('')
        cy.log('🎉 Congratulations on completing Phase One! Ready for more challenges!')
      })
    })
  })
})

/**
 * 🌟 Day 3 Core Learning Points Summary:
 *
 * 1. **Selector Strategy Mastery**
 *    - Selector priority: [data-cy] > #id > .class > tag
 *    - Proper use of different selector types
 *    - Avoid fragile selector strategies
 *
 * 2. **Advanced Interaction Techniques**
 *    - Complex click operations
 *    - Form handling best practices
 *    - Conditional element handling
 *
 * 3. **Chained Assertion Mastery**
 *    - Combined use of .should() and .and()
 *    - Multiple verification strategies
 *    - Debugging techniques for assertion failures
 *
 * 4. **Debugging and Best Practices**
 *    - Effective use of cy.log()
 *    - Time Travel debugging techniques
 *    - Conditional operation handling
 *    - Custom timeout configuration
 *
 * 💡 **Key Concepts Consolidation**:
 * - Cypress automatic waiting and retry mechanism
 * - Proper organization of command chains
 * - Error handling and conditional logic
 * - Test readability and maintainability
 *
 * 🎯 **Phase One Completion Criteria**:
 * Ability to independently write complete test cases including
 * page navigation, element interaction, conditional logic,
 * and result verification
 *
 * 🚀 **Preparing for Phase Two**:
 * In-depth learning of core features including advanced selectors,
 * form handling, traversal techniques, and test organization
 */