# Cypress Advanced Concepts

## Table of Contents
1. [Custom Commands](#custom-commands)
2. [Plugin System](#plugin-system)
3. [Advanced Network Interception](#advanced-network-interception)
4. [Configuration Management](#configuration-management)
5. [Debugging Techniques](#debugging-techniques)
6. [Component Testing vs E2E Testing](#component-testing-vs-e2e-testing)
7. [Test Organization Patterns](#test-organization-patterns)

---

## Custom Commands

### What Are Custom Commands?

Custom commands are reusable functions that extend Cypress's built-in command set. They help eliminate code duplication and create a domain-specific language for your tests.

**When to create custom commands:**
- Authentication flows (login, logout, token management)
- Complex multi-step interactions (filling forms, navigating workflows)
- Assertions you use frequently
- Integration with third-party libraries

### Syntax and Creation

**Basic Custom Command:**
```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login')
  cy.get('[data-cy="username"]').type(username)
  cy.get('[data-cy="password"]').type(password)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Usage in tests
cy.login('testuser@example.com', 'password123')
```

**Custom Command with Options:**
```javascript
Cypress.Commands.add('loginViaApi', (username, password, options = {}) => {
  const { cacheSession = true } = options

  const login = () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: { username, password }
    }).then((response) => {
      window.localStorage.setItem('authToken', response.body.token)
    })
  }

  if (cacheSession) {
    cy.session([username, password], login)
  } else {
    login()
  }
})

// Usage
cy.loginViaApi('user@test.com', 'pass123', { cacheSession: true })
```

**Child Commands (chainable commands):**
```javascript
Cypress.Commands.add('getByDataCy', { prevSubject: 'element' }, (subject, dataCyValue) => {
  return cy.wrap(subject).find(`[data-cy="${dataCyValue}"]`)
})

// Usage
cy.get('.form-container').getByDataCy('submit-button').click()
```

**Overwriting Existing Commands:**
```javascript
// Add custom logging to cy.visit()
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  cy.log(`Navigating to: ${url}`)
  return originalFn(url, options)
})
```

### Best Practices for Custom Commands

✅ **DO**:
- Keep commands focused and single-purpose
- Use meaningful, descriptive names
- Document command parameters and return values
- Use TypeScript definitions for better IDE support
- Add them to `cypress/support/commands.js`

❌ **DON'T**:
- Create commands for one-time operations
- Make commands too complex (split into smaller commands)
- Use custom commands for simple operations (just use cy.get())
- Return values from commands (use .then() instead)

### Interview Talking Points

**Question: "When would you create a custom command vs just using regular Cypress commands?"**

**Answer framework:**
```
"I create custom commands when I have:

1. Repeated patterns: If I'm doing the same sequence of actions in 3+ tests,
   I'll extract it to a custom command for DRY (Don't Repeat Yourself) principle.

2. Complex authentication: Login flows often require multiple steps (API calls,
   token storage, UI navigation), so I encapsulate them in commands like
   cy.loginViaUI() and cy.loginViaAPI().

3. Business domain actions: For e-commerce, I might create cy.addToCart(),
   cy.checkout(), or cy.applyPromoCode() - these make tests readable at a
   business level, not just technical.

4. Improving readability: Commands like cy.getByDataCy() or cy.waitForApiCall()
   make test intent clearer than raw selectors and waits.

However, I avoid over-abstraction. Simple operations like cy.get().click()
should stay as-is. The goal is balance between reusability and transparency."
```

---

## Plugin System

### How Plugins Work

Cypress runs in two processes:
1. **Browser process**: Where tests execute (Cypress app code)
2. **Node.js process**: Where plugins run (has access to Node.js APIs, filesystem, databases)

Plugins bridge these processes, allowing tests to:
- Access the filesystem (read/write files)
- Query databases
- Modify configuration dynamically
- Integrate with external services

### Plugin Configuration

**cypress.config.js:**
```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Plugins are registered here using the 'on' and 'config' objects

      // Example 1: Task for database operations
      on('task', {
        'db:seed': () => {
          // Seed database logic
          return require('./cypress/tasks/seedDatabase')()
        },
        'db:reset': () => {
          // Reset database logic
          return null
        }
      })

      // Example 2: Before/after hooks
      on('before:run', (details) => {
        console.log('Test run starting:', details)
      })

      on('after:run', (results) => {
        console.log('Test run completed:', results)
      })

      // Example 3: Modify config based on environment
      if (config.env.environment === 'staging') {
        config.baseUrl = 'https://staging.example.com'
      }

      return config
    }
  }
})
```

### Common Plugin Use Cases

**1. Code Coverage Plugin**
```javascript
// Install: npm install --save-dev @cypress/code-coverage

const codeCoverageTask = require('@cypress/code-coverage/task')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)
      return config
    }
  }
})

// In cypress/support/e2e.js
import '@cypress/code-coverage/support'
```

**2. File Upload Plugin**
```javascript
// Install: npm install --save-dev cypress-file-upload

// In cypress/support/commands.js
import 'cypress-file-upload'

// Usage
cy.get('[data-cy="file-input"]').attachFile('example.json')
```

**3. Custom Task for External API Call**
```javascript
on('task', {
  'generateTestData': async ({ count, type }) => {
    const axios = require('axios')
    const response = await axios.get(`https://api.example.com/generate?count=${count}&type=${type}`)
    return response.data
  }
})

// Usage in tests
cy.task('generateTestData', { count: 10, type: 'users' }).then((testData) => {
  // Use the generated data
})
```

### Popular Cypress Plugins

| Plugin | Purpose | Interview Talking Point |
|--------|---------|------------------------|
| @cypress/code-coverage | Track code coverage | "We achieved 85% code coverage using this plugin" |
| cypress-file-upload | Upload files in tests | "Essential for testing file upload features" |
| cypress-axe | Accessibility testing | "We integrated a11y testing into our E2E suite" |
| cypress-real-events | Real user events | "Needed for testing hover states and focus" |
| @cypress/grep | Filter tests by tags | "Helps run smoke tests vs full regression" |

### Interview Talking Points

**Question: "How do plugins extend Cypress functionality?"**

**Answer:**
```
"Cypress plugins run in the Node.js process, which gives them access to the
filesystem, databases, and external services - things the browser can't do
directly due to security restrictions.

For example, in my last project, I used plugins to:

1. Database operations: I created a task plugin to seed test data in PostgreSQL
   before each test suite. This ensured tests always started with a known state.

2. Code coverage: We integrated @cypress/code-coverage to track which parts of
   our React application were exercised by E2E tests. This helped identify gaps
   in test coverage.

3. Custom reporting: I wrote a plugin that sent test results to our Slack
   channel after each CI run, including screenshots of failures.

The key is that plugins handle operations that need Node.js capabilities, while
custom commands handle browser-side interactions. They complement each other."
```

---

## Advanced Network Interception

### Request and Response Modification

**Modifying Request Headers:**
```javascript
cy.intercept('POST', '/api/orders', (req) => {
  // Add authentication header
  req.headers['Authorization'] = 'Bearer fake-token-12345'

  // Modify request body
  req.body.couponCode = 'TEST50OFF'

  // Continue the request with modifications
  req.continue()
})
```

**Modifying Response Data:**
```javascript
cy.intercept('GET', '/api/products', (req) => {
  req.continue((res) => {
    // Modify response body
    res.body.products = res.body.products.map(product => ({
      ...product,
      price: product.price * 0.5 // 50% off all products for testing
    }))
  })
})
```

**Simulating Network Delays:**
```javascript
cy.intercept('GET', '/api/slow-endpoint', (req) => {
  req.continue((res) => {
    // Delay response by 3 seconds
    res.delay = 3000
  })
}).as('slowRequest')

cy.visit('/page')
cy.get('[data-cy="loading-spinner"]').should('be.visible')
cy.wait('@slowRequest')
cy.get('[data-cy="loading-spinner"]').should('not.exist')
```

**Simulating Network Failures:**
```javascript
// Simulate timeout
cy.intercept('GET', '/api/data', (req) => {
  req.destroy() // Destroys the request, simulating network error
})

// Simulate specific error codes
cy.intercept('GET', '/api/data', {
  statusCode: 503,
  body: { error: 'Service Unavailable' },
  headers: { 'x-custom-error': 'maintenance' }
})
```

### Dynamic Response Based on Request

```javascript
cy.intercept('POST', '/api/search', (req) => {
  const searchTerm = req.body.query

  // Return different responses based on search term
  if (searchTerm === 'laptop') {
    req.reply({
      statusCode: 200,
      body: { results: [/* laptop results */] }
    })
  } else if (searchTerm === '') {
    req.reply({
      statusCode: 400,
      body: { error: 'Search term required' }
    })
  } else {
    req.reply({
      statusCode: 200,
      body: { results: [] }
    })
  }
})
```

### Conditional Interception

```javascript
let requestCount = 0

cy.intercept('GET', '/api/products', (req) => {
  requestCount++

  // First request succeeds, subsequent requests fail
  if (requestCount === 1) {
    req.continue()
  } else {
    req.reply({
      statusCode: 500,
      body: { error: 'Too many requests' }
    })
  }
})
```

### Interview Talking Points

**Question: "Give me an example of a complex cy.intercept() scenario you've implemented."**

**Answer with STAR format:**
```
Situation: "We had a payment gateway integration that was difficult to test
because it required hitting a live API with real credit cards in sandbox mode,
which was slow and flaky."

Task: "I needed to create a reliable test suite for the entire checkout flow
without depending on the external payment API."

Action: "I used cy.intercept() to mock the payment gateway responses:

1. Request modification: I intercepted the payment request and validated that
   our app was sending correct data (card number, amount, billing info).

2. Response simulation: I created fixtures for different scenarios:
   - Successful payment (200 with transaction ID)
   - Declined card (402 with error message)
   - Timeout (simulated with req.delay)
   - Network error (req.destroy)

3. Token handling: The payment API returned a single-use token. I used
   req.continue() to modify the response to return a predictable token that
   our tests could verify.

4. Conditional logic: For tests that needed to hit the real API (integration
   tests), I used an environment variable to conditionally apply interception:

   if (Cypress.env('MOCK_PAYMENTS') === true) {
     cy.intercept(/* mocking logic */)
   }"

Result: "This approach allowed us to:
- Run 50+ checkout tests in 2 minutes vs 15 minutes with real API
- Reduce flakiness from 15% to less than 1%
- Test edge cases (expired cards, fraud detection) easily
- Still maintain 10 integration tests that hit the real sandbox API weekly"
```

---

## Configuration Management

### Multiple Environments

**cypress.config.js with environment-specific settings:**
```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const environment = config.env.environment || 'development'

      const environments = {
        development: {
          baseUrl: 'http://localhost:3000',
          apiUrl: 'http://localhost:4000/api',
          slowTestThreshold: 10000
        },
        staging: {
          baseUrl: 'https://staging.myapp.com',
          apiUrl: 'https://api-staging.myapp.com',
          slowTestThreshold: 15000
        },
        production: {
          baseUrl: 'https://myapp.com',
          apiUrl: 'https://api.myapp.com',
          slowTestThreshold: 20000
        }
      }

      const envConfig = environments[environment]
      config.baseUrl = envConfig.baseUrl
      config.env.apiUrl = envConfig.apiUrl
      config.slowTestThreshold = envConfig.slowTestThreshold

      return config
    },

    // Global settings
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0
    }
  }
})
```

**Running tests with different environments:**
```bash
# Development (default)
npx cypress run

# Staging
npx cypress run --env environment=staging

# Production
npx cypress run --env environment=production
```

### Environment Variables

**Using environment variables in tests:**
```javascript
// Access in tests
const apiUrl = Cypress.env('apiUrl')
cy.request(`${apiUrl}/users`)

// Access base URL
cy.visit('/') // Uses baseUrl from config

// Access custom env vars
const isCI = Cypress.env('CI')
if (isCI) {
  // Skip certain tests in CI
}
```

**Setting environment variables:**
```bash
# Command line
npx cypress run --env apiKey=12345,userId=abc

# cypress.env.json (not committed to git)
{
  "apiKey": "real-api-key-12345",
  "testUserEmail": "test@example.com",
  "testUserPassword": "securePassword123"
}
```

### Test Retries Configuration

```javascript
module.exports = defineConfig({
  e2e: {
    retries: {
      runMode: 2,      // Retry failed tests 2 times in CI
      openMode: 0      // Don't retry in interactive mode
    }
  }
})

// Or per-test retry configuration
it('flaky test', { retries: 3 }, () => {
  // This test will retry up to 3 times
})
```

---

## Debugging Techniques

### Time-Travel Debugging

**Using Cypress Test Runner:**
- Hover over commands in the command log to see DOM snapshots
- Click on commands to "pin" and inspect the state
- Use the "Before" and "After" states to see changes

**Programmatic Debugging:**
```javascript
cy.get('.product-list')
  .debug() // Pauses test and opens debugger
  .find('.product-item')
  .should('have.length', 5)

// Or use .pause() to pause test execution
cy.pause()
cy.get('#next-button').click()
```

### Logging and Inspection

```javascript
// Custom logging
cy.log('Starting checkout process')

// Log variable values
cy.get('.price').then(($price) => {
  const priceValue = $price.text()
  cy.log(`Current price: ${priceValue}`)
})

// Inspect network requests
cy.intercept('POST', '/api/orders').as('createOrder')
cy.get('[data-cy="submit-order"]').click()
cy.wait('@createOrder').then((interception) => {
  cy.log('Request body:', interception.request.body)
  cy.log('Response:', interception.response.body)
})
```

### Screenshot and Video Debugging

```javascript
// Take custom screenshots
cy.screenshot('before-click')
cy.get('#button').click()
cy.screenshot('after-click')

// Screenshots are auto-captured on failures when configured:
// screenshotOnRunFailure: true
```

### Debugging Flaky Tests

**Common causes and solutions:**

1. **Timing issues:**
```javascript
// ❌ BAD: Arbitrary waits
cy.wait(3000)

// ✅ GOOD: Wait for specific conditions
cy.get('.loading-spinner').should('not.exist')
cy.get('.content').should('be.visible')
```

2. **Async state issues:**
```javascript
// ❌ BAD: Assuming immediate state change
cy.get('#button').click()
cy.get('.result').should('contain', 'Success')

// ✅ GOOD: Wait for API call to complete
cy.intercept('POST', '/api/submit').as('submit')
cy.get('#button').click()
cy.wait('@submit')
cy.get('.result').should('contain', 'Success')
```

3. **Test isolation issues:**
```javascript
// Ensure clean state between tests
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/')
})
```

---

## Component Testing vs E2E Testing

### When to Use Each

**E2E Testing (End-to-End):**
- Tests complete user workflows (login → browse → checkout)
- Uses full application stack (frontend + backend)
- Slower but more realistic
- Best for critical user journeys

**Component Testing:**
- Tests individual React/Vue/Angular components in isolation
- Faster execution (no backend needed)
- Better for testing component variants and edge cases
- Best for UI component libraries and complex widgets

### Component Test Example

```javascript
// ProductCard.cy.jsx (component test)
import ProductCard from '../../src/components/ProductCard'

describe('ProductCard Component', () => {
  it('displays product information correctly', () => {
    const product = {
      name: 'Laptop Pro',
      price: 1299.99,
      inStock: true
    }

    cy.mount(<ProductCard product={product} />)

    cy.get('[data-cy="product-name"]').should('contain', 'Laptop Pro')
    cy.get('[data-cy="product-price"]').should('contain', '$1,299.99')
    cy.get('[data-cy="stock-status"]').should('contain', 'In Stock')
  })

  it('displays sold out state correctly', () => {
    const product = {
      name: 'Laptop Pro',
      price: 1299.99,
      inStock: false
    }

    cy.mount(<ProductCard product={product} />)

    cy.get('[data-cy="add-to-cart"]').should('be.disabled')
    cy.get('[data-cy="stock-status"]').should('contain', 'Sold Out')
  })
})
```

### Test Pyramid Strategy

```
         /\
        /  \  E2E Tests (10%)
       /____\  - Critical user flows
      /      \ - Cross-browser scenarios
     /        \
    / Integration\ (30%)
   /____________\ - API + Frontend
  /              \ - Multiple components
 /   Unit Tests   \ (60%)
/__________________\ - Component tests
                     - Utility functions
```

**Interview talking point:**
"I follow the test pyramid principle: majority unit/component tests for speed
and coverage, some integration tests for API contracts, and a focused set of
E2E tests for critical user journeys. This balances confidence with execution time."

---

## Test Organization Patterns

### Page Object Model (POM)

**pages/LoginPage.js:**
```javascript
class LoginPage {
  visit() {
    cy.visit('/login')
  }

  fillUsername(username) {
    cy.get('[data-cy="username"]').type(username)
    return this
  }

  fillPassword(password) {
    cy.get('[data-cy="password"]').type(password)
    return this
  }

  submit() {
    cy.get('[data-cy="submit"]').click()
    return this
  }

  getErrorMessage() {
    return cy.get('[data-cy="error-message"]')
  }
}

export default new LoginPage()
```

**Usage in tests:**
```javascript
import LoginPage from '../pages/LoginPage'

it('shows error for invalid credentials', () => {
  LoginPage
    .visit()
    .fillUsername('invalid@example.com')
    .fillPassword('wrongpassword')
    .submit()

  LoginPage.getErrorMessage()
    .should('be.visible')
    .and('contain', 'Invalid credentials')
})
```

### App Actions Pattern

Instead of POM, use custom commands that represent app actions:

```javascript
Cypress.Commands.add('createProduct', (productData) => {
  // Bypasses UI, directly creates product via API
  cy.request('POST', '/api/products', productData)
})

// Test focuses on the specific behavior being tested
it('displays newly created product', () => {
  cy.createProduct({ name: 'Test Product', price: 99.99 })
  cy.visit('/products')
  cy.contains('Test Product').should('be.visible')
})
```

**Advantage:** Faster test setup, focuses on testing the specific feature

### Interview Summary

Be ready to explain:
- ✅ Custom commands vs plugins (browser vs Node.js)
- ✅ When to use cy.intercept() for mocking vs real API calls
- ✅ Multi-environment configuration strategies
- ✅ Debugging techniques for flaky tests
- ✅ Component testing vs E2E testing trade-offs
- ✅ Page Object Model and alternative patterns

These are common senior-level interview topics for Cypress roles!
