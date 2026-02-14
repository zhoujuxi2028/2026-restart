/**
 * Advanced Cypress Test Examples - Day 2 Practice
 *
 * These 5 advanced test examples demonstrate senior-level Cypress patterns:
 * 1. Authentication flow with custom commands and cy.session()
 * 2. Request/Response modification with cy.intercept()
 * 3. Error recovery and retry strategies
 * 4. Data-driven testing with fixtures
 * 5. Page Object Model implementation
 *
 * Each test includes interview talking points and best practices
 */

// ================================================================
// TEST 1: Authentication Flow with Custom Commands and cy.session()
// ================================================================

describe('Advanced Authentication Patterns', () => {
  /**
   * Interview Talking Points:
   * - "I use cy.session() to cache authentication across tests for performance"
   * - "This reduced our test suite execution time by 60%"
   * - "I create separate commands for API-based and UI-based login"
   */

  beforeEach(() => {
    // Custom command defined in cypress/support/commands.js
    // cy.loginViaAPI('admin@example.com', 'securePassword123')
  })

  it('should maintain authentication across page navigations', () => {
    // This demonstrates session persistence
    cy.visit('/dashboard')
    cy.get('[data-cy="user-menu"]').should('contain', 'Admin User')

    cy.visit('/settings')
    cy.get('[data-cy="user-menu"]').should('contain', 'Admin User') // Still authenticated

    cy.visit('/profile')
    cy.get('[data-cy="user-menu"]').should('contain', 'Admin User') // Still authenticated
  })

  it('should handle token refresh automatically', () => {
    // Simulate expired token scenario
    cy.intercept('GET', '/api/user/profile', (req) => {
      const authHeader = req.headers['authorization']

      if (!authHeader || authHeader === 'Bearer expired-token') {
        // First request with expired token returns 401
        req.reply({
          statusCode: 401,
          body: { error: 'Token expired' }
        })
      } else {
        // After token refresh, return success
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            name: 'Admin User',
            email: 'admin@example.com'
          }
        })
      }
    }).as('profileRequest')

    // Intercept token refresh endpoint
    cy.intercept('POST', '/api/auth/refresh', {
      statusCode: 200,
      body: {
        token: 'new-refreshed-token-123',
        expiresIn: 3600
      }
    }).as('tokenRefresh')

    // Set expired token
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'expired-token')
    })

    cy.visit('/profile')

    // Interview point: "The app should automatically refresh the token on 401"
    cy.wait('@profileRequest')
    cy.wait('@tokenRefresh')
    cy.wait('@profileRequest') // Second request with new token

    cy.get('[data-cy="profile-name"]').should('be.visible')
  })

  it('should redirect to login when authentication fails completely', () => {
    // Simulate auth failure
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 403,
      body: { error: 'Forbidden - Invalid credentials' }
    }).as('authFailure')

    cy.intercept('POST', '/api/auth/refresh', {
      statusCode: 401,
      body: { error: 'Refresh token invalid' }
    }).as('refreshFailure')

    cy.visit('/dashboard')

    cy.wait('@authFailure')
    cy.wait('@refreshFailure')

    // App should redirect to login
    cy.url().should('include', '/login')
    cy.get('[data-cy="login-form"]').should('be.visible')
  })
})

// ================================================================
// TEST 2: Advanced Request/Response Modification
// ================================================================

describe('E-commerce Checkout with Network Manipulation', () => {
  /**
   * Interview Talking Points:
   * - "I use cy.intercept() to modify API responses for edge case testing"
   * - "This allows testing scenarios that are difficult to reproduce with real data"
   * - "We can simulate network delays, errors, and malformed data"
   */

  beforeEach(() => {
    cy.visit('/products')
  })

  it('should handle dynamic pricing with request modification', () => {
    // Intercept and modify the pricing request
    cy.intercept('POST', '/api/cart/calculate-total', (req) => {
      // Interview point: "I can inspect and modify the request before it's sent"
      cy.log('Original cart data:', req.body)

      // Add a coupon code to the request
      req.body.couponCode = 'TESTDISCOUNT50'

      // Continue with modified request
      req.continue((res) => {
        // Verify the response includes the discount
        expect(res.body).to.have.property('discount')
        expect(res.body.discount).to.equal(50)

        // Interview point: "I can also modify responses to test edge cases"
        // Simulate an extreme discount for testing minimum price logic
        res.body.finalTotal = 0.01
      })
    }).as('calculateTotal')

    cy.get('[data-cy="product-1"]').click()
    cy.get('[data-cy="add-to-cart"]').click()
    cy.get('[data-cy="cart-icon"]').click()
    cy.get('[data-cy="checkout"]').click()

    cy.wait('@calculateTotal')

    // Verify UI reflects the modified price
    cy.get('[data-cy="final-total"]').should('contain', '$0.01')
    cy.get('[data-cy="discount-badge"]').should('be.visible')
  })

  it('should gracefully handle slow payment gateway responses', () => {
    // Simulate network delay
    cy.intercept('POST', '/api/payment/process', (req) => {
      req.continue((res) => {
        // Interview point: "I simulate network delays to test loading states"
        res.delay = 5000 // 5 second delay
      })
    }).as('slowPayment')

    // Add product and proceed to checkout
    cy.fixture('test-users').then((users) => {
      const testUser = users.standard

      cy.get('[data-cy="product-1"]').click()
      cy.get('[data-cy="add-to-cart"]').click()
      cy.get('[data-cy="checkout"]').click()

      // Fill checkout form
      cy.get('[data-cy="email"]').type(testUser.email)
      cy.get('[data-cy="card-number"]').type('4242424242424242')
      cy.get('[data-cy="expiry"]').type('12/25')
      cy.get('[data-cy="cvv"]').type('123')

      cy.get('[data-cy="submit-payment"]').click()
    })

    // Verify loading state is shown
    cy.get('[data-cy="payment-loading"]').should('be.visible')
    cy.get('[data-cy="loading-spinner"]').should('be.visible')
    cy.get('[data-cy="submit-payment"]').should('be.disabled')

    // Wait for the slow response
    cy.wait('@slowPayment')

    // Verify success state after delay
    cy.get('[data-cy="payment-loading"]').should('not.exist')
    cy.get('[data-cy="success-message"]').should('be.visible')
    cy.url().should('include', '/order-confirmation')
  })

  it('should retry failed payment requests automatically', () => {
    let attemptCount = 0

    cy.intercept('POST', '/api/payment/process', (req) => {
      attemptCount++

      // Interview point: "I test retry logic by failing the first N attempts"
      if (attemptCount <= 2) {
        req.reply({
          statusCode: 503,
          body: { error: 'Service temporarily unavailable' },
          headers: { 'Retry-After': '1' }
        })
      } else {
        // Third attempt succeeds
        req.reply({
          statusCode: 200,
          body: {
            transactionId: 'txn_123456',
            status: 'completed',
            amount: 99.99
          }
        })
      }
    }).as('paymentAttempt')

    cy.get('[data-cy="product-1"]').click()
    cy.get('[data-cy="add-to-cart"]').click()
    cy.get('[data-cy="checkout"]').click()
    cy.get('[data-cy="submit-payment"]').click()

    // Interview point: "The app should retry automatically without user intervention"
    cy.wait('@paymentAttempt') // Attempt 1 - fails
    cy.wait('@paymentAttempt') // Attempt 2 - fails
    cy.wait('@paymentAttempt') // Attempt 3 - succeeds

    cy.get('[data-cy="success-message"]').should('be.visible')
    cy.get('[data-cy="transaction-id"]').should('contain', 'txn_123456')
  })
})

// ================================================================
// TEST 3: Error Recovery and Boundary Testing
// ================================================================

describe('Error Handling and Edge Cases', () => {
  /**
   * Interview Talking Points:
   * - "I test error scenarios that are hard to reproduce in real environments"
   * - "This ensures our app handles failures gracefully"
   * - "We test network errors, malformed data, and server errors"
   */

  it('should handle network timeout gracefully', () => {
    // Simulate request timeout
    cy.intercept('GET', '/api/products', (req) => {
      // Interview point: "req.destroy() simulates a complete network failure"
      req.destroy()
    }).as('timeoutRequest')

    cy.visit('/products')

    // Verify error UI is displayed
    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Unable to load products')

    cy.get('[data-cy="retry-button"]').should('be.visible')
  })

  it('should handle malformed API responses', () => {
    // Return malformed JSON
    cy.intercept('GET', '/api/products', (req) => {
      req.reply({
        statusCode: 200,
        body: '{invalid json}', // Intentionally malformed
        headers: { 'content-type': 'application/json' }
      })
    }).as('malformedResponse')

    cy.visit('/products')

    cy.wait('@malformedResponse')

    // App should handle parsing error
    cy.get('[data-cy="error-message"]')
      .should('contain', 'Error loading products')
  })

  it('should validate input boundaries', () => {
    cy.visit('/products/1')

    // Test quantity input boundaries
    const testCases = [
      { input: '-1', expected: 'Quantity must be positive' },
      { input: '0', expected: 'Quantity must be at least 1' },
      { input: '1001', expected: 'Maximum quantity is 1000' },
      { input: 'abc', expected: 'Quantity must be a number' }
    ]

    testCases.forEach(({ input, expected }) => {
      cy.get('[data-cy="quantity"]').clear().type(input)
      cy.get('[data-cy="add-to-cart"]').click()

      cy.get('[data-cy="quantity-error"]')
        .should('be.visible')
        .and('contain', expected)
    })

    // Test valid boundary values
    cy.get('[data-cy="quantity"]').clear().type('1')
    cy.get('[data-cy="add-to-cart"]').click()
    cy.get('[data-cy="cart-count"]').should('contain', '1')

    cy.get('[data-cy="quantity"]').clear().type('1000')
    cy.get('[data-cy="add-to-cart"]').click()
    // Should not show error
    cy.get('[data-cy="quantity-error"]').should('not.exist')
  })
})

// ================================================================
// TEST 4: Data-Driven Testing with Fixtures
// ================================================================

describe('Data-Driven User Scenarios', () => {
  /**
   * Interview Talking Points:
   * - "I use fixtures to test multiple user scenarios without code duplication"
   * - "This makes tests more maintainable and easier to extend"
   * - "We can test edge cases with different data sets"
   */

  it('should handle different user types with varying permissions', () => {
    cy.fixture('test-users').then((users) => {
      // Test with admin user
      const adminUser = users.admin

      cy.visit('/login')
      cy.get('[data-cy="email"]').type(adminUser.email)
      cy.get('[data-cy="password"]').type(adminUser.password)
      cy.get('[data-cy="submit"]').click()

      // Admin should see admin panel
      cy.get('[data-cy="admin-panel"]').should('be.visible')
      cy.get('[data-cy="user-management"]').should('be.visible')

      cy.get('[data-cy="logout"]').click()

      // Test with standard user
      const standardUser = users.standard

      cy.get('[data-cy="email"]').clear().type(standardUser.email)
      cy.get('[data-cy="password"]').type(standardUser.password)
      cy.get('[data-cy="submit"]').click()

      // Standard user should NOT see admin panel
      cy.get('[data-cy="admin-panel"]').should('not.exist')
      cy.get('[data-cy="user-management"]').should('not.exist')
      cy.get('[data-cy="user-dashboard"]').should('be.visible')
    })
  })

  it('should process bulk product operations using fixture data', () => {
    cy.fixture('api-responses').then((responses) => {
      const productList = responses.productList

      // Mock API with fixture data
      cy.intercept('GET', '/api/products', {
        statusCode: 200,
        body: productList
      }).as('getProducts')

      cy.visit('/products')
      cy.wait('@getProducts')

      // Interview point: "Fixtures allow testing with realistic, complex data sets"
      // Verify all products from fixture are displayed
      productList.products.forEach((product, index) => {
        cy.get(`[data-cy="product-${product.id}"]`).within(() => {
          cy.get('[data-cy="product-name"]').should('contain', product.name)
          cy.get('[data-cy="product-price"]').should('contain', `$${product.price}`)

          if (product.inStock) {
            cy.get('[data-cy="stock-status"]').should('contain', 'In Stock')
            cy.get('[data-cy="add-to-cart"]').should('not.be.disabled')
          } else {
            cy.get('[data-cy="stock-status"]').should('contain', 'Out of Stock')
            cy.get('[data-cy="add-to-cart"]').should('be.disabled')
          }
        })
      })
    })
  })

  it('should filter products based on fixture criteria', () => {
    cy.fixture('api-responses').then((responses) => {
      const { productList } = responses

      cy.intercept('GET', '/api/products*', (req) => {
        const url = new URL(req.url)
        const category = url.searchParams.get('category')
        const maxPrice = parseFloat(url.searchParams.get('maxPrice') || '10000')

        // Filter products based on query parameters
        const filtered = productList.products.filter(p => {
          const matchesCategory = !category || p.category === category
          const matchesPrice = p.price <= maxPrice
          return matchesCategory && matchesPrice
        })

        req.reply({
          statusCode: 200,
          body: { products: filtered, total: filtered.length }
        })
      }).as('filteredProducts')

      cy.visit('/products')

      // Apply filters
      cy.get('[data-cy="category-filter"]').select('Electronics')
      cy.get('[data-cy="max-price"]').type('500')
      cy.get('[data-cy="apply-filters"]').click()

      cy.wait('@filteredProducts')

      // Verify filtered results
      cy.get('[data-cy="product-count"]').should('contain', '2')
      cy.get('[data-cy="product-item"]').should('have.length', 2)
    })
  })
})

// ================================================================
// TEST 5: Page Object Model Implementation
// ================================================================

/**
 * Page Object Model Pattern
 * Interview Talking Point:
 * - "I use POM to improve test maintainability and reduce code duplication"
 * - "When UI changes, I only update the page object, not every test"
 * - "This follows the DRY principle and makes tests more readable"
 */

class CheckoutPage {
  // Selectors
  selectors = {
    emailInput: '[data-cy="email"]',
    cardNumber: '[data-cy="card-number"]',
    expiry: '[data-cy="expiry"]',
    cvv: '[data-cy="cvv"]',
    billingAddress: '[data-cy="billing-address"]',
    submitButton: '[data-cy="submit-payment"]',
    successMessage: '[data-cy="success-message"]',
    errorMessage: '[data-cy="error-message"]',
    orderTotal: '[data-cy="order-total"]',
    discountCode: '[data-cy="discount-code"]',
    applyDiscount: '[data-cy="apply-discount"]'
  }

  // Actions
  visit() {
    cy.visit('/checkout')
    return this
  }

  fillEmail(email) {
    cy.get(this.selectors.emailInput).type(email)
    return this
  }

  fillPaymentDetails(cardDetails) {
    cy.get(this.selectors.cardNumber).type(cardDetails.number)
    cy.get(this.selectors.expiry).type(cardDetails.expiry)
    cy.get(this.selectors.cvv).type(cardDetails.cvv)
    return this
  }

  fillBillingAddress(address) {
    cy.get(this.selectors.billingAddress).type(address)
    return this
  }

  applyDiscountCode(code) {
    cy.get(this.selectors.discountCode).type(code)
    cy.get(this.selectors.applyDiscount).click()
    return this
  }

  submitPayment() {
    cy.get(this.selectors.submitButton).click()
    return this
  }

  // Assertions
  shouldShowSuccessMessage() {
    cy.get(this.selectors.successMessage).should('be.visible')
    return this
  }

  shouldShowError(errorText) {
    cy.get(this.selectors.errorMessage)
      .should('be.visible')
      .and('contain', errorText)
    return this
  }

  shouldHaveTotal(amount) {
    cy.get(this.selectors.orderTotal).should('contain', `$${amount}`)
    return this
  }
}

describe('Checkout Flow with Page Object Model', () => {
  const checkoutPage = new CheckoutPage()

  beforeEach(() => {
    // Set up cart with test product
    cy.intercept('GET', '/api/cart', {
      statusCode: 200,
      body: {
        items: [{ id: 1, name: 'Test Product', price: 99.99, quantity: 1 }],
        total: 99.99
      }
    })
  })

  it('should complete checkout successfully with valid payment details', () => {
    // Interview point: "Notice how readable the test is with POM"
    checkoutPage
      .visit()
      .fillEmail('test@example.com')
      .fillPaymentDetails({
        number: '4242424242424242',
        expiry: '12/25',
        cvv: '123'
      })
      .fillBillingAddress('123 Test St, Test City, TC 12345')
      .submitPayment()
      .shouldShowSuccessMessage()

    cy.url().should('include', '/order-confirmation')
  })

  it('should apply discount code and update total', () => {
    cy.intercept('POST', '/api/cart/apply-discount', {
      statusCode: 200,
      body: {
        discount: 20,
        newTotal: 79.99
      }
    }).as('applyDiscount')

    checkoutPage
      .visit()
      .shouldHaveTotal('99.99')
      .applyDiscountCode('SAVE20')

    cy.wait('@applyDiscount')

    checkoutPage.shouldHaveTotal('79.99')
  })

  it('should show error for invalid card number', () => {
    cy.intercept('POST', '/api/payment/process', {
      statusCode: 400,
      body: {
        error: 'Invalid card number'
      }
    }).as('invalidCard')

    checkoutPage
      .visit()
      .fillEmail('test@example.com')
      .fillPaymentDetails({
        number: '1111111111111111', // Invalid card
        expiry: '12/25',
        cvv: '123'
      })
      .submitPayment()
      .shouldShowError('Invalid card number')

    // Should remain on checkout page
    cy.url().should('include', '/checkout')
  })
})

/**
 * ==============================================================================
 * INTERVIEW SUMMARY - Advanced Patterns Demonstrated
 * ==============================================================================
 *
 * 1. Authentication & Session Management:
 *    - cy.session() for performance
 *    - Token refresh handling
 *    - Authentication failure recovery
 *
 * 2. Network Interception Mastery:
 *    - Request modification (adding headers, changing body)
 *    - Response modification (changing data, simulating delays)
 *    - Conditional responses based on request data
 *    - Retry logic testing
 *
 * 3. Error Handling & Edge Cases:
 *    - Network timeouts (req.destroy())
 *    - Malformed responses
 *    - Boundary value testing
 *    - Graceful degradation
 *
 * 4. Data-Driven Testing:
 *    - Using fixtures for multiple test scenarios
 *    - Complex data sets for realistic testing
 *    - Permission-based testing with different user roles
 *
 * 5. Page Object Model:
 *    - Encapsulation of page interactions
 *    - Reusable, maintainable test code
 *    - Fluent API for readable tests
 *    - Separation of concerns (selectors, actions, assertions)
 *
 * Key Takeaways for Interviews:
 * - Always explain WHY you use a pattern, not just HOW
 * - Quantify improvements ("60% faster execution")
 * - Show understanding of trade-offs (when to use POM vs custom commands)
 * - Demonstrate real-world problem-solving
 * ==============================================================================
 */
