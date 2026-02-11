/**
 * Cypress Test Examples - Day 1 Practice
 *
 * These 5 test examples demonstrate core Cypress concepts that are
 * commonly discussed in interviews:
 * 1. API Mocking with cy.intercept()
 * 2. Custom Commands for reusable logic
 * 3. Environment-based configuration
 * 4. Cross-origin testing handling
 * 5. Advanced assertions and retries
 *
 * Each test includes detailed English comments explaining the approach
 */

describe('E-commerce Application Test Suite', () => {

  /**
   * TEST 1: API Mocking with cy.intercept()
   *
   * Interview talking points:
   * - "I use cy.intercept() to mock API responses for faster, more reliable tests"
   * - "This allows testing edge cases without needing a live backend"
   * - "We can simulate error scenarios that are difficult to reproduce"
   */
  describe('Product Search Functionality', () => {
    beforeEach(() => {
      // Mock the search API endpoint with predefined data
      cy.intercept('GET', '/api/products/search*', {
        statusCode: 200,
        body: {
          products: [
            { id: 1, name: 'Laptop Pro 15', price: 1299.99, inStock: true },
            { id: 2, name: 'Laptop Air 13', price: 999.99, inStock: true },
            { id: 3, name: 'Laptop Max 17', price: 2499.99, inStock: false }
          ],
          totalResults: 3
        },
        delay: 500 // Simulate network latency
      }).as('searchProducts')

      cy.visit('/products')
    })

    it('should display search results when user enters query', () => {
      // Enter search query in the search box
      cy.get('[data-cy="search-input"]').type('laptop')
      cy.get('[data-cy="search-button"]').click()

      // Wait for the mocked API call to complete
      // Interview point: "Using aliases with cy.wait() ensures requests complete before assertions"
      cy.wait('@searchProducts')

      // Verify that results are displayed
      cy.get('[data-cy="product-card"]').should('have.length', 3)

      // Verify specific product details
      cy.get('[data-cy="product-card"]')
        .first()
        .within(() => {
          cy.get('.product-name').should('contain', 'Laptop Pro 15')
          cy.get('.product-price').should('contain', '$1,299.99')
          cy.get('.stock-status').should('contain', 'In Stock')
        })
    })

    it('should handle API error gracefully', () => {
      // Override the mock to simulate a server error
      // Interview point: "Testing error scenarios ensures robust user experience"
      cy.intercept('GET', '/api/products/search*', {
        statusCode: 500,
        body: {
          error: 'Internal server error'
        }
      }).as('searchError')

      cy.get('[data-cy="search-input"]').type('laptop')
      cy.get('[data-cy="search-button"]').click()

      cy.wait('@searchError')

      // Verify error message is displayed to user
      cy.get('[data-cy="error-message"]')
        .should('be.visible')
        .and('contain', 'Unable to load products')

      // Verify retry button is present
      cy.get('[data-cy="retry-button"]').should('be.visible')
    })

    it('should handle empty search results', () => {
      // Mock empty results
      cy.intercept('GET', '/api/products/search*', {
        statusCode: 200,
        body: {
          products: [],
          totalResults: 0
        }
      }).as('emptySearch')

      cy.get('[data-cy="search-input"]').type('nonexistentproduct123')
      cy.get('[data-cy="search-button"]').click()

      cy.wait('@emptySearch')

      // Verify empty state message
      cy.get('[data-cy="empty-state"]')
        .should('be.visible')
        .and('contain', 'No products found')
    })
  })

  /**
   * TEST 2: Authentication Flow with Custom Commands
   *
   * Interview talking points:
   * - "Custom commands promote code reusability and DRY principles"
   * - "cy.session() caches authentication state for faster test execution"
   * - "API-based login is 5-10x faster than UI-based login"
   */
  describe('User Authentication', () => {

    // Custom command definition (this would normally be in cypress/support/commands.js)
    before(() => {
      // Define a custom login command
      Cypress.Commands.add('loginViaAPI', (username, password) => {
        cy.session([username, password], () => {
          cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { username, password }
          }).then((response) => {
            // Store authentication token
            window.localStorage.setItem('authToken', response.body.token)
            window.localStorage.setItem('userId', response.body.userId)
          })
        }, {
          validate() {
            // Validate that session is still valid
            cy.window().then((win) => {
              expect(win.localStorage.getItem('authToken')).to.exist
            })
          }
        })
      })
    })

    it('should login successfully and access protected page', () => {
      // Intercept the login API call to verify request payload
      cy.intercept('POST', '/api/auth/login').as('loginRequest')

      // Visit login page
      cy.visit('/login')

      // Fill in credentials
      cy.get('[data-cy="username"]').type('john.doe@example.com')
      cy.get('[data-cy="password"]').type('SecurePassword123!')
      cy.get('[data-cy="login-button"]').click()

      // Wait for login to complete
      cy.wait('@loginRequest').then((interception) => {
        // Verify request payload structure
        // Interview point: "I validate API contracts to catch integration issues early"
        expect(interception.request.body).to.have.property('username')
        expect(interception.request.body).to.have.property('password')

        // Verify successful response
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body).to.have.property('token')
      })

      // Verify redirect to dashboard
      cy.url().should('include', '/dashboard')

      // Verify user profile is displayed
      cy.get('[data-cy="user-profile"]')
        .should('be.visible')
        .and('contain', 'john.doe@example.com')
    })

    it('should display error for invalid credentials', () => {
      // Mock failed login response
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: {
          error: 'Invalid username or password'
        }
      }).as('failedLogin')

      cy.visit('/login')
      cy.get('[data-cy="username"]').type('wrong@example.com')
      cy.get('[data-cy="password"]').type('wrongpassword')
      cy.get('[data-cy="login-button"]').click()

      cy.wait('@failedLogin')

      // Verify error message
      cy.get('[data-cy="error-message"]')
        .should('be.visible')
        .and('contain', 'Invalid username or password')

      // Verify user remains on login page
      cy.url().should('include', '/login')
    })

    it('should use custom command for faster authentication', () => {
      // Use custom command to login via API (much faster than UI)
      // Interview point: "I use API login for setup to focus tests on their specific functionality"
      cy.loginViaAPI('john.doe@example.com', 'SecurePassword123!')

      // Navigate directly to protected page
      cy.visit('/dashboard')

      // Verify authenticated state
      cy.get('[data-cy="user-menu"]').should('be.visible')
      cy.get('[data-cy="logout-button"]').should('be.visible')
    })
  })

  /**
   * TEST 3: Environment-based Configuration
   *
   * Interview talking points:
   * - "Environment variables allow tests to run in different environments"
   * - "We can switch between dev, staging, and production with configuration"
   * - "Sensitive data like API keys are managed securely through environment variables"
   */
  describe('Multi-environment Support', () => {

    it('should use environment-specific API URL', () => {
      // Get API URL from environment configuration
      // In cypress.config.js: env: { apiUrl: 'https://api-staging.example.com' }
      const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3000'

      // Intercept requests to the configured API
      cy.intercept('GET', `${apiUrl}/api/config`).as('getConfig')

      cy.visit('/')
      cy.wait('@getConfig').then((interception) => {
        // Verify request went to correct environment
        expect(interception.request.url).to.include(apiUrl)
        cy.log(`API call made to: ${apiUrl}`)
      })
    })

    it('should use test data from fixtures', () => {
      // Load test data from fixture file
      // Interview point: "Fixtures centralize test data management"
      cy.fixture('users.json').then((users) => {
        const testUser = users.standardUser

        // Use fixture data in test
        cy.visit('/login')
        cy.get('[data-cy="username"]').type(testUser.username)
        cy.get('[data-cy="password"]').type(testUser.password)
        cy.get('[data-cy="login-button"]').click()

        // Verify login with fixture data
        cy.url().should('include', '/dashboard')
        cy.get('[data-cy="user-name"]').should('contain', testUser.fullName)
      })
    })
  })

  /**
   * TEST 4: Advanced Form Validation Testing
   *
   * Interview talking points:
   * - "I test both positive and negative scenarios"
   * - "Validation logic is critical for data integrity"
   * - "I use data-driven testing for multiple input combinations"
   */
  describe('User Registration Form', () => {

    beforeEach(() => {
      cy.visit('/register')
    })

    it('should validate email format in real-time', () => {
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'spaces in@email.com'
      ]

      // Test multiple invalid email formats
      invalidEmails.forEach((email) => {
        cy.get('[data-cy="email-input"]').clear().type(email)
        cy.get('[data-cy="email-input"]').blur() // Trigger validation

        // Verify error message appears
        cy.get('[data-cy="email-error"]')
          .should('be.visible')
          .and('contain', 'Please enter a valid email')

        cy.log(`Tested invalid email: ${email}`)
      })

      // Test valid email
      cy.get('[data-cy="email-input"]').clear().type('valid@example.com')
      cy.get('[data-cy="email-input"]').blur()

      // Verify error message disappears
      cy.get('[data-cy="email-error"]').should('not.exist')
    })

    it('should validate password strength requirements', () => {
      // Password requirements: 8+ chars, uppercase, lowercase, number, special char
      const testCases = [
        { password: 'short', valid: false, reason: 'too short' },
        { password: 'alllowercase123!', valid: false, reason: 'no uppercase' },
        { password: 'ALLUPPERCASE123!', valid: false, reason: 'no lowercase' },
        { password: 'NoNumbers!', valid: false, reason: 'no numbers' },
        { password: 'NoSpecial123', valid: false, reason: 'no special character' },
        { password: 'Valid@Password123', valid: true, reason: 'meets all requirements' }
      ]

      testCases.forEach(({ password, valid, reason }) => {
        cy.get('[data-cy="password-input"]').clear().type(password)
        cy.get('[data-cy="password-input"]').blur()

        if (valid) {
          cy.get('[data-cy="password-error"]').should('not.exist')
          cy.get('[data-cy="password-strength"]').should('contain', 'Strong')
        } else {
          cy.get('[data-cy="password-error"]').should('be.visible')
        }

        cy.log(`Testing password (${reason}): ${valid ? 'PASS' : 'FAIL'}`)
      })
    })

    it('should prevent duplicate email registration', () => {
      // Mock API response for duplicate email
      cy.intercept('POST', '/api/auth/register', (req) => {
        if (req.body.email === 'existing@example.com') {
          req.reply({
            statusCode: 409,
            body: {
              error: 'Email already registered'
            }
          })
        } else {
          req.reply({
            statusCode: 201,
            body: {
              message: 'Registration successful',
              userId: '12345'
            }
          })
        }
      }).as('registerUser')

      // Try to register with existing email
      cy.get('[data-cy="email-input"]').type('existing@example.com')
      cy.get('[data-cy="password-input"]').type('Valid@Password123')
      cy.get('[data-cy="confirm-password"]').type('Valid@Password123')
      cy.get('[data-cy="register-button"]').click()

      cy.wait('@registerUser')

      // Verify error message
      cy.get('[data-cy="form-error"]')
        .should('be.visible')
        .and('contain', 'Email already registered')
    })
  })

  /**
   * TEST 5: Shopping Cart - Complex User Flow
   *
   * Interview talking points:
   * - "This tests a complete user journey from browsing to checkout"
   * - "I use proper waiting strategies to handle asynchronous operations"
   * - "State management is verified at each step"
   */
  describe('Shopping Cart User Journey', () => {

    beforeEach(() => {
      // Setup: Mock product catalog
      cy.intercept('GET', '/api/products', {
        fixture: 'products.json' // Load from fixture file
      }).as('getProducts')

      // Setup: Mock empty cart initially
      cy.intercept('GET', '/api/cart', {
        body: {
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0
        }
      }).as('getCart')

      cy.visit('/products')
      cy.wait('@getProducts')
    })

    it('should add products to cart and proceed to checkout', () => {
      // Step 1: Add first product to cart
      cy.get('[data-cy="product-card"]')
        .first()
        .within(() => {
          // Store product name for later verification
          cy.get('.product-name').invoke('text').as('firstProductName')
          cy.get('[data-cy="add-to-cart"]').click()
        })

      // Verify success notification
      cy.get('[data-cy="toast-notification"]')
        .should('be.visible')
        .and('contain', 'Added to cart')

      // Verify cart badge updates
      cy.get('[data-cy="cart-badge"]').should('contain', '1')

      // Step 2: Add second product
      cy.get('[data-cy="product-card"]')
        .eq(1)
        .within(() => {
          cy.get('[data-cy="add-to-cart"]').click()
        })

      cy.get('[data-cy="cart-badge"]').should('contain', '2')

      // Step 3: Navigate to cart
      cy.get('[data-cy="cart-icon"]').click()
      cy.url().should('include', '/cart')

      // Step 4: Verify cart contents
      cy.get('[data-cy="cart-item"]').should('have.length', 2)

      // Step 5: Update quantity
      cy.get('[data-cy="cart-item"]')
        .first()
        .within(() => {
          cy.get('[data-cy="quantity-input"]').clear().type('3')
          cy.get('[data-cy="update-quantity"]').click()
        })

      // Wait for cart update
      cy.intercept('PUT', '/api/cart/items/*').as('updateCart')
      cy.wait('@updateCart')

      // Verify subtotal recalculated
      cy.get('[data-cy="subtotal"]').invoke('text').then((subtotal) => {
        expect(parseFloat(subtotal.replace('$', ''))).to.be.greaterThan(0)
      })

      // Step 6: Proceed to checkout
      cy.get('[data-cy="checkout-button"]').click()
      cy.url().should('include', '/checkout')

      // Verify order summary on checkout page
      cy.get('[data-cy="order-summary"]').within(() => {
        cy.get('[data-cy="item-count"]').should('contain', '2 items')
        cy.get('[data-cy="total-amount"]').should('be.visible')
      })
    })

    it('should handle removing items from cart', () => {
      // Add items first
      cy.get('[data-cy="product-card"]').first().find('[data-cy="add-to-cart"]').click()
      cy.get('[data-cy="cart-icon"]').click()

      // Remove item
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="remove-item"]').click()
      })

      // Confirm removal in modal
      cy.get('[data-cy="confirm-modal"]').within(() => {
        cy.get('[data-cy="confirm-button"]').click()
      })

      // Verify item removed
      cy.get('[data-cy="cart-empty-state"]')
        .should('be.visible')
        .and('contain', 'Your cart is empty')

      cy.get('[data-cy="cart-badge"]').should('not.exist')
    })
  })
})

/**
 * ADDITIONAL NOTES FOR INTERVIEW:
 *
 * 1. Test Organization:
 *    - Tests are grouped logically in describe blocks
 *    - Each test is independent and can run in isolation
 *    - beforeEach hooks setup common preconditions
 *
 * 2. Selectors Strategy:
 *    - Using data-cy attributes for stability
 *    - Avoids brittle CSS class selectors
 *
 * 3. Waiting Strategy:
 *    - Using cy.wait() with aliases for API calls
 *    - Using .should() assertions for automatic retries
 *    - No hard-coded cy.wait(milliseconds)
 *
 * 4. Error Handling:
 *    - Testing both success and failure scenarios
 *    - Mocking various API responses (200, 401, 409, 500)
 *
 * 5. Maintainability:
 *    - Detailed English comments for interview discussion
 *    - DRY principle with custom commands
 *    - Centralized test data with fixtures
 *
 * KEY PHRASES FOR INTERVIEW:
 * - "I use data-cy attributes to avoid coupling tests with implementation details"
 * - "API mocking with cy.intercept() allows fast, reliable tests"
 * - "Custom commands promote reusability and follow DRY principles"
 * - "I test both positive and negative scenarios for comprehensive coverage"
 * - "Proper waiting strategies eliminate flaky tests"
 */
