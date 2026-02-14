# Advanced Cypress Interview Questions - Day 2

## Question 1: Explain the difference between custom commands and plugins. When would you use each?

### Answer:
```
"Custom commands and plugins serve different purposes based on where they execute:

**Custom Commands** run in the browser process alongside your tests. They're
essentially reusable functions that extend Cypress's command API. I use them for:
- Authentication flows (cy.login, cy.logout)
- Common UI interactions (cy.fillForm, cy.selectFromDropdown)
- Domain-specific actions (cy.addToCart, cy.checkout)

For example, I created a custom command cy.loginViaAPI() that handles the entire
authentication flow, stores the token, and sets up session state. This runs in
the browser and can use all Cypress commands.

**Plugins** run in the Node.js process, giving them access to the filesystem,
databases, and external services that the browser can't access. I use them for:
- Database operations (seeding, resetting test data)
- File system access (reading config files, writing test reports)
- Integration with external services (CI/CD notifications)
- Modifying Cypress configuration dynamically

In my last project, I used a plugin to seed our PostgreSQL database before each
test suite and created custom commands to interact with the seeded data through
the UI.

The rule of thumb: If it needs Node.js capabilities, use a plugin. If it's
browser-side test logic, use a custom command."
```

### Key Phrases:
- "browser process vs Node.js process"
- "filesystem access and database operations"
- "domain-specific actions"
- "setupNodeEvents lifecycle hook"

---

## Question 2: How would you structure a large Cypress test suite for maintainability?

### Answer (STAR Format):
```
Situation: "In my previous role, we had over 500 Cypress tests that had become
difficult to maintain due to code duplication and unclear organization."

Task: "I was assigned to refactor the test suite for better maintainability and
faster execution time."

Action: "I implemented a multi-layered architecture:

1. **Page Object Model**: Created page classes for each major section
   - pages/LoginPage.js
   - pages/DashboardPage.js
   - pages/CheckoutPage.js

2. **Custom Commands**: Extracted reusable actions into commands.js
   - cy.login() for authentication
   - cy.setupTestData() for data preparation
   - cy.waitForApiCall() for network operations

3. **Fixtures**: Organized test data by domain
   - fixtures/users/ (different user types)
   - fixtures/products/ (product catalog)
   - fixtures/api-responses/ (mocked API data)

4. **Support files**: Created utility modules
   - support/helpers.js (data generators, formatters)
   - support/constants.js (test URLs, timeout values)

5. **Test organization**:
   ```
   cypress/
   ├── e2e/
   │   ├── auth/           (authentication flows)
   │   ├── checkout/       (purchase workflows)
   │   └── smoke/          (critical path tests)
   ├── support/
   │   ├── commands.js
   │   ├── e2e.js
   │   └── page-objects/
   └── fixtures/
   ```

6. **Configuration**: Used environment-based config
   - cypress.config.js for base settings
   - Separate configs for dev/staging/prod
   - cypress.env.json for secrets (gitignored)

7. **Naming conventions**:
   - Test files: feature-name.cy.js
   - Describe blocks: Feature name
   - It blocks: Should + expected behavior

Result: "This restructure resulted in:
- 40% reduction in code duplication
- Test execution time reduced from 45 minutes to 18 minutes (parallel execution)
- New team members could understand test structure in 1 day vs 1 week
- Bug fix time reduced from hours to minutes due to clear test organization"
```

### Key Architecture Principles:
- DRY (Don't Repeat Yourself)
- Single Responsibility
- Clear separation of concerns
- Easy navigation and discoverability

---

## Question 3: How do you handle authentication in Cypress tests efficiently?

### Answer:
```
"I use a multi-strategy approach depending on the test scenario:

**Strategy 1: cy.session() for Session Caching** (Recommended for most tests)
```javascript
Cypress.Commands.add('loginViaAPI', (username, password) => {
  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: { username, password }
    }).then((response) => {
      window.localStorage.setItem('authToken', response.body.token)
      window.localStorage.setItem('userId', response.body.userId)
    })
  })
})
```
This caches the session across tests, so login only happens once. Reduced our
test execution time by 60%.

**Strategy 2: UI Login** (Only for testing login itself)
```javascript
cy.visit('/login')
cy.get('[data-cy="username"]').type(username)
cy.get('[data-cy="password"]').type(password)
cy.get('[data-cy="submit"]').click()
cy.url().should('include', '/dashboard')
```

**Strategy 3: Token Injection** (For API-first applications)
```javascript
Cypress.Commands.add('setAuthToken', (token) => {
  cy.visit('/')
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', token)
  })
})
```

**Strategy 4: Cookie-based Auth**
```javascript
cy.setCookie('session_id', 'fake-session-id')
```

**Best practices I follow:**
- Use cy.session() for 95% of tests (fastest)
- Only test UI login in dedicated auth spec files
- Never hard-code credentials (use cypress.env.json)
- Create different user roles as separate commands:
  - cy.loginAsAdmin()
  - cy.loginAsCustomer()
  - cy.loginAsGuest()

**Real example:**
In my e-commerce project, we had 300+ tests. By using cy.session(), we reduced
login operations from 300 (one per test) to 3 (one per user role), cutting
total test time from 40 minutes to 15 minutes."
```

---

## Question 4: How do you make Cypress tests less flaky?

### Answer:
```
"Flaky tests are the biggest challenge in E2E testing. Here's my systematic approach:

**1. Eliminate Arbitrary Waits**
❌ Bad: cy.wait(3000)
✅ Good: cy.get('.loading-spinner').should('not.exist')

**2. Use Proper Assertions**
Instead of assuming elements exist, assert their state:
```javascript
cy.get('[data-cy="submit"]')
  .should('be.visible')
  .and('not.be.disabled')
  .click()
```

**3. Wait for Network Requests**
```javascript
cy.intercept('POST', '/api/orders').as('createOrder')
cy.get('[data-cy="submit"]').click()
cy.wait('@createOrder')  // Don't assert until API completes
cy.url().should('include', '/success')
```

**4. Ensure Test Isolation**
Each test should be independent:
```javascript
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.task('db:reset')  // Reset database state
  cy.loginViaAPI('test@example.com', 'password')
})
```

**5. Use Retry-ability Wisely**
Configure retries for known-flaky scenarios:
```javascript
// cypress.config.js
retries: {
  runMode: 2,    // CI environment
  openMode: 0    // Local development
}
```

**6. Improve Selectors**
❌ Bad: cy.get('.btn-primary').eq(2)
✅ Good: cy.get('[data-cy="checkout-button"]')

**7. Handle Race Conditions**
```javascript
// Wait for multiple conditions
cy.get('.product-list').should('be.visible')
cy.get('.product-item').should('have.length.gt', 0)
cy.get('.loading-spinner').should('not.exist')
```

**8. Test Data Management**
Use fixtures and avoid shared mutable state:
```javascript
// Each test gets its own user
cy.task('createTestUser').then((user) => {
  cy.loginViaAPI(user.email, user.password)
})
```

**Real Example:**
In my last project, we had 15% flaky test rate. After applying these principles:
- Removed all cy.wait(ms) calls → added assertion-based waits
- Implemented data-cy attributes across the app
- Used cy.intercept() to wait for API calls
- Result: Flaky rate dropped to 0.5%, CI pipeline became reliable."
```

---

## Question 5: Explain how cy.intercept() can modify requests and responses. Give real examples.

### Answer:
```
"cy.intercept() is incredibly powerful for request/response manipulation. Here
are real scenarios I've implemented:

**Scenario 1: Adding Auth Headers Automatically**
```javascript
cy.intercept('**/api/**', (req) => {
  req.headers['Authorization'] = `Bearer ${Cypress.env('authToken')}`
  req.continue()
})
```
This ensures all API requests include the auth token without modifying app code.

**Scenario 2: Testing Edge Cases by Modifying Responses**
```javascript
cy.intercept('GET', '/api/products', (req) => {
  req.continue((res) => {
    // Modify all prices to test discount logic
    res.body.products = res.body.products.map(p => ({
      ...p,
      price: 0.01  // Test minimum price handling
    }))
  })
})
```

**Scenario 3: Simulating Network Delays**
```javascript
cy.intercept('GET', '/api/user-profile', (req) => {
  req.continue((res) => {
    res.delay = 5000  // 5 second delay
  })
}).as('slowProfile')

cy.visit('/profile')
cy.get('[data-cy="loading-skeleton"]').should('be.visible')
cy.wait('@slowProfile')
cy.get('[data-cy="loading-skeleton"]').should('not.exist')
```

**Scenario 4: Dynamic Responses Based on Request**
```javascript
cy.intercept('POST', '/api/search', (req) => {
  const query = req.body.searchTerm

  if (query.includes('invalid')) {
    req.reply({
      statusCode: 400,
      body: { error: 'Invalid search term' }
    })
  } else if (query === '') {
    req.reply({
      statusCode: 200,
      body: { results: [] }
    })
  } else {
    req.continue()  // Let real API handle it
  }
})
```

**Scenario 5: Testing Retry Logic**
```javascript
let attemptCount = 0

cy.intercept('POST', '/api/payment', (req) => {
  attemptCount++

  if (attemptCount < 3) {
    req.reply({ statusCode: 500, body: { error: 'Service unavailable' } })
  } else {
    req.reply({ statusCode: 200, body: { transactionId: '12345' } })
  }
})

// Verify app retries the request and eventually succeeds
```

**Scenario 6: Validating Request Data**
```javascript
cy.intercept('POST', '/api/orders', (req) => {
  // Assert that the app sends correct data structure
  expect(req.body).to.have.property('items')
  expect(req.body).to.have.property('totalPrice')
  expect(req.body.totalPrice).to.be.a('number')

  req.continue()
})
```

**Real Project Example:**
We had a payment gateway that was unreliable in sandbox mode. I used cy.intercept()
to mock all payment responses, allowing us to test:
- Successful payments
- Declined cards
- Timeout scenarios
- Fraud detection responses

This made our tests 10x faster and 100% reliable while still validating our
payment integration logic."
```

---

## Question 6: How would you implement visual regression testing with Cypress?

### Answer:
```
"Visual regression testing ensures UI changes don't accidentally break the layout
or design. Here's my approach:

**Option 1: Percy Integration** (Recommended for production)
```javascript
// Install: npm install --save-dev @percy/cypress

// cypress/support/e2e.js
import '@percy/cypress'

// In tests
it('renders homepage correctly', () => {
  cy.visit('/')
  cy.percySnapshot('Homepage')
})

it('renders product page correctly', () => {
  cy.visit('/products/laptop-pro')
  cy.percySnapshot('Product Page - Laptop Pro')
})
```

Percy automatically:
- Captures screenshots across different browsers and viewports
- Compares with baseline images
- Highlights visual differences
- Integrates with CI/CD for PR reviews

**Option 2: cypress-image-snapshot Plugin**
```javascript
// Install: npm install --save-dev cypress-image-snapshot

// cypress.config.js
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config)
    }
  }
})

// In tests
cy.get('.hero-section').matchImageSnapshot('hero-section')
```

**Option 3: Custom Screenshot Comparison**
```javascript
// Take baseline screenshots
cy.screenshot('checkout-page-baseline')

// After UI changes, take new screenshots
cy.screenshot('checkout-page-current')

// Use image diff tools (Pixelmatch, Resemble.js) in CI to compare
```

**Best Practices:**
1. **Stable selectors**: Only snapshot stable elements
   ```javascript
   // Wait for all images and fonts to load
   cy.get('img').should('be.visible')
   cy.wait(1000)  // Allow fonts to load
   cy.percySnapshot()
   ```

2. **Ignore dynamic content**:
   ```javascript
   // Hide timestamps, random IDs before snapshot
   cy.get('[data-cy="timestamp"]').invoke('hide')
   cy.percySnapshot()
   ```

3. **Multi-viewport testing**:
   ```javascript
   const viewports = ['iphone-6', 'ipad-2', [1920, 1080]]

   viewports.forEach(viewport => {
     it(`looks correct on ${viewport}`, () => {
       cy.viewport(viewport)
       cy.visit('/responsive-page')
       cy.percySnapshot(`Responsive Page - ${viewport}`)
     })
   })
   ```

**Real Example:**
In a design system project, we used Percy to catch CSS regressions:
- Created visual snapshots for 50+ components
- Ran on every PR
- Caught 12 unintended design changes in first month
- Designers could approve visual changes directly in Percy dashboard

The key is balancing coverage with test stability - too many snapshots create
noise, too few miss regressions."
```

---

## Question 7: How do you test file upload functionality in Cypress?

### Answer:
```
"File upload testing in Cypress requires the cypress-file-upload plugin since
native file input behavior can't be easily automated. Here's my approach:

**Setup:**
```bash
npm install --save-dev cypress-file-upload
```

```javascript
// cypress/support/commands.js
import 'cypress-file-upload'
```

**Basic File Upload:**
```javascript
it('uploads a single file', () => {
  cy.get('[data-cy="file-input"]').attachFile('example.pdf')

  // Verify upload UI feedback
  cy.get('[data-cy="file-name"]').should('contain', 'example.pdf')
  cy.get('[data-cy="upload-status"]').should('contain', 'Ready to upload')

  cy.get('[data-cy="submit"]').click()

  // Wait for upload API call
  cy.wait('@uploadFile')
  cy.get('[data-cy="success-message"]').should('be.visible')
})
```

**Multiple File Upload:**
```javascript
it('uploads multiple files', () => {
  const files = ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']

  cy.get('[data-cy="file-input"]').attachFile(files)

  cy.get('[data-cy="file-list"] li').should('have.length', 3)
})
```

**File Upload with Drag & Drop:**
```javascript
it('uploads file via drag and drop', () => {
  cy.get('[data-cy="drop-zone"]').attachFile('image.png', {
    subjectType: 'drag-n-drop'
  })

  cy.get('[data-cy="preview-image"]')
    .should('be.visible')
    .and('have.attr', 'src')
    .and('include', 'image.png')
})
```

**Testing Different File Types:**
```javascript
describe('File Upload Validation', () => {
  it('accepts valid file types', () => {
    cy.get('input[type="file"]').attachFile('document.pdf')
    cy.get('[data-cy="error"]').should('not.exist')
  })

  it('rejects invalid file types', () => {
    cy.get('input[type="file"]').attachFile('malicious.exe')
    cy.get('[data-cy="error"]')
      .should('be.visible')
      .and('contain', 'Invalid file type')
  })

  it('rejects oversized files', () => {
    // Create a large file fixture
    cy.get('input[type="file"]').attachFile('large-file-10mb.zip')
    cy.get('[data-cy="error"]')
      .should('contain', 'File size exceeds 5MB limit')
  })
})
```

**Testing Upload with API Mocking:**
```javascript
it('handles upload errors gracefully', () => {
  cy.intercept('POST', '/api/upload', {
    statusCode: 500,
    body: { error: 'Upload failed' }
  }).as('uploadError')

  cy.get('[data-cy="file-input"]').attachFile('test.pdf')
  cy.get('[data-cy="submit"]').click()

  cy.wait('@uploadError')
  cy.get('[data-cy="error-message"]')
    .should('contain', 'Upload failed. Please try again.')
})
```

**Creating Custom Fixtures:**
```javascript
// Generate files dynamically
it('uploads programmatically created file', () => {
  const fileContent = 'Test file content'
  const fileName = 'generated-test.txt'

  cy.get('input[type="file"]').attachFile({
    fileContent,
    fileName,
    mimeType: 'text/plain',
    encoding: 'utf-8'
  })
})
```

**Real Project Example:**
I implemented file upload testing for a document management system:
- Tested PDF, DOCX, images (JPEG, PNG)
- Validated file size limits (client-side and server-side)
- Tested batch uploads (up to 10 files)
- Mocked S3 upload responses for faster tests
- Used cy.intercept() to verify multipart/form-data request structure

Key insight: Always test both client-side validation (immediate feedback) and
server-side responses (security and actual upload success)."
```

---

## Question 8: How would you parallelize Cypress tests in CI/CD?

### Answer:
```
"Test parallelization is critical for large test suites. Here's how I implement it:

**Option 1: Cypress Dashboard (Recommended)**
```yaml
# .gitlab-ci.yml
e2e-tests:
  stage: test
  parallel: 4
  script:
    - npm ci
    - npx cypress run --record --parallel --key $CYPRESS_RECORD_KEY
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
```

Cypress Dashboard automatically:
- Distributes tests across parallel machines
- Load-balances based on test duration history
- Provides test analytics and flakiness detection

**Option 2: Manual Parallelization with GitLab CI**
```yaml
# .gitlab-ci.yml
.e2e-base:
  stage: test
  script:
    - npm ci
    - npx cypress run --spec "$SPEC_PATTERN"

e2e-auth:
  extends: .e2e-base
  variables:
    SPEC_PATTERN: "cypress/e2e/auth/**/*.cy.js"

e2e-checkout:
  extends: .e2e-base
  variables:
    SPEC_PATTERN: "cypress/e2e/checkout/**/*.cy.js"

e2e-products:
  extends: .e2e-base
  variables:
    SPEC_PATTERN: "cypress/e2e/products/**/*.cy.js"
```

**Option 3: GitHub Actions Matrix Strategy**
```yaml
# .github/workflows/cypress.yml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        containers: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          record: true
          parallel: true
          group: 'E2E Tests'
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Option 4: Docker Compose Parallelization**
```yaml
# docker-compose.yml
version: '3.8'

services:
  cypress-1:
    image: cypress/included:latest
    volumes:
      - .:/e2e
    working_dir: /e2e
    command: npx cypress run --spec "cypress/e2e/auth/**"

  cypress-2:
    image: cypress/included:latest
    volumes:
      - .:/e2e
    working_dir: /e2e
    command: npx cypress run --spec "cypress/e2e/checkout/**"

  cypress-3:
    image: cypress/included:latest
    volumes:
      - .:/e2e
    working_dir: /e2e
    command: npx cypress run --spec "cypress/e2e/products/**"
```

```bash
# Run all containers in parallel
docker-compose up --abort-on-container-exit
```

**Best Practices for Parallelization:**

1. **Ensure Test Independence**: Tests must not share state
2. **Balance Test Distribution**: Group slow tests separately
3. **Database Strategy**:
   - Use separate DB per parallel worker
   - Or use transactions that rollback after each test
4. **Artifact Collection**: Gather screenshots/videos from all parallel runs
5. **Failure Reporting**: Aggregate results from all parallel runs

**Real Example:**
In my last project with 500 Cypress tests:
- Sequential execution: 45 minutes
- Parallelized across 5 machines: 9 minutes (5x speedup)
- Used Cypress Dashboard for intelligent load balancing
- Set up automatic retries for flaky tests
- Result: Reliable, fast CI pipeline that developers trusted

Key insight: Parallelization ROI is highest when you have 50+ tests taking more
than 10 minutes to run."
```

---

## Question 9: How do you handle cross-origin testing in Cypress?

### Answer:
```
"Cross-origin testing (navigating between different domains) has limitations in
Cypress due to browser security. Here's how I handle it:

**Understanding the Limitation:**
Cypress can only interact with one superdomain at a time. You can't:
- Navigate from example.com to google.com in the same test
- Make assertions across different origins

**Strategy 1: Test Within Your Control (Recommended)**
```javascript
// Instead of navigating to external OAuth provider
cy.intercept('GET', 'https://auth-provider.com/oauth', {
  statusCode: 302,
  headers: {
    location: '/callback?code=fake-auth-code'
  }
})

cy.visit('/login')
cy.get('[data-cy="login-with-oauth"]').click()
// Cypress intercepts the redirect and simulates the callback
```

**Strategy 2: Use cy.origin() for Multi-Origin (Cypress 9.6+)**
```javascript
it('navigates to external site and back', () => {
  cy.visit('https://example.com')
  cy.get('a[href*="external-site.com"]').click()

  cy.origin('https://external-site.com', () => {
    // Commands within this callback run on external-site.com
    cy.get('[data-cy="accept-terms"]').click()
    cy.get('[data-cy="return-link"]').click()
  })

  // Back on example.com
  cy.url().should('include', 'example.com')
  cy.get('[data-cy="status"]').should('contain', 'Verified')
})
```

**Strategy 3: Test Integrations via API**
```javascript
// Instead of testing OAuth flow in UI
it('authenticates via OAuth API', () => {
  cy.request({
    method: 'POST',
    url: 'https://external-auth.com/token',
    body: {
      client_id: Cypress.env('CLIENT_ID'),
      client_secret: Cypress.env('CLIENT_SECRET'),
      grant_type: 'client_credentials'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    const token = response.body.access_token

    // Use the token in your app
    cy.visit('/')
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', token)
    })
  })
})
```

**Strategy 4: Disable Web Security (Last Resort)**
```javascript
// cypress.config.js
module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false
  }
})
```
⚠️ **Warning**: Only use this for testing, never in production code!

**Strategy 5: iframe Cross-Origin Handling**
```javascript
cy.visit('/page-with-iframe')
cy.get('iframe').then(($iframe) => {
  const iframeContent = $iframe.contents()
  cy.wrap(iframeContent.find('[data-cy="button"]')).click()
})

// If iframe is same-origin
```

**Real Example:**
We had a payment flow that redirected to Stripe's checkout page:

```javascript
// Instead of following the redirect to Stripe
cy.intercept('POST', '/api/create-checkout-session', (req) => {
  req.reply({
    statusCode: 200,
    body: {
      checkoutUrl: 'https://checkout.stripe.com/session123',
      sessionId: 'fake-session-id'
    }
  })
})

cy.get('[data-cy="checkout"]').click()

// Instead of actually going to Stripe, simulate the webhook callback
cy.request('POST', '/api/stripe-webhook', {
  type: 'checkout.session.completed',
  data: {
    sessionId: 'fake-session-id',
    paymentStatus: 'paid'
  }
})

cy.visit('/order-confirmation')
cy.get('[data-cy="payment-status"]').should('contain', 'Payment successful')
```

**Key Principle:**
For external services you don't control, mock the integration points. Test the
actual integration in dedicated API tests or manual QA, but keep Cypress focused
on your application's behavior."
```

---

## Question 10: Describe your approach to creating a Cypress test automation framework from scratch.

### Answer (Comprehensive STAR):
```
Situation: "I joined a team that had no automated E2E testing. They were doing
100% manual regression testing before each release, which took 3 days."

Task: "I was tasked with building a comprehensive Cypress test automation
framework from scratch that could cover critical user journeys and integrate
with our CI/CD pipeline."

Action: "I designed and implemented the framework in phases:

**Phase 1: Foundation (Week 1)**
1. **Project setup**:
   ```bash
   npm init -y
   npm install --save-dev cypress
   npx cypress open  # Generate folder structure
   ```

2. **Configuration**:
   - cypress.config.js with environment support (dev/staging/prod)
   - cypress.env.json for secrets (gitignored)
   - Timeout configurations, viewport settings, retry logic

3. **Folder structure**:
   ```
   cypress/
   ├── e2e/              # Test specs organized by feature
   ├── fixtures/         # Test data
   ├── support/
   │   ├── commands.js   # Custom commands
   │   ├── e2e.js        # Global config
   │   └── pages/        # Page Object Models
   └── plugins/          # Custom plugins
   ```

**Phase 2: Core Utilities (Week 2)**
1. **Custom commands** for authentication:
   - cy.loginViaAPI()
   - cy.loginViaUI()
   - cy.logout()

2. **Custom commands** for common actions:
   - cy.waitForApiCall(alias)
   - cy.fillForm(formData)
   - cy.selectFromDropdown(name, value)

3. **Page Object Models** for main pages:
   - LoginPage.js
   - DashboardPage.js
   - CheckoutPage.js

**Phase 3: Test Development (Week 3-4)**
1. **Smoke tests** (15 tests covering critical paths):
   - User registration
   - Login/Logout
   - Product search
   - Add to cart
   - Checkout flow

2. **Comprehensive E2E tests** (100+ tests):
   - Organized by feature (auth/, checkout/, products/, etc.)
   - Used data-cy attributes for stable selectors
   - Implemented API mocking for flaky external services

3. **Visual regression tests**:
   - Integrated Percy for critical pages
   - Homepage, product pages, checkout

**Phase 4: CI/CD Integration (Week 5)**
1. **GitLab CI configuration**:
   ```yaml
   e2e-tests:
     stage: test
     image: cypress/included:latest
     script:
       - npm ci
       - npx cypress run --record --parallel
     parallel: 3
     artifacts:
       when: always
       paths:
         - cypress/videos/
         - cypress/screenshots/
   ```

2. **Cypress Dashboard setup**:
   - Parallel execution across 3 machines
   - Test analytics and flakiness detection
   - Slack integration for failure notifications

3. **Test data management**:
   - Database seeding plugin
   - API fixtures for stable test data
   - Cleanup after test runs

**Phase 5: Documentation & Handoff (Week 6)**
1. **README documentation**:
   - How to run tests locally
   - How to add new tests
   - Best practices and conventions

2. **Team training**:
   - 2-hour workshop on Cypress basics
   - Pair programming sessions
   - Code review guidelines for test PRs

Result: "After 6 weeks, we had:
- 150 automated E2E tests covering 85% of critical user journeys
- CI pipeline running tests on every PR (18 minutes with parallelization)
- Regression testing time reduced from 3 days to 18 minutes
- 23 bugs caught before production in the first month
- Team confidence increased - developers could refactor code knowing tests would
  catch regressions
- Release frequency increased from monthly to weekly

The framework became the foundation for all future E2E testing, and other teams
in the company adopted our patterns."
```

### Key Principles Applied:
- ✅ Start small, iterate quickly
- ✅ Focus on high-value tests first (smoke tests)
- ✅ Build reusable components (commands, page objects)
- ✅ Document everything for team adoption
- ✅ Integrate with CI/CD early
- ✅ Measure and communicate impact

---

## Summary: Day 2 Interview Readiness

After mastering these 10 advanced questions, you should be able to:
- ✅ Explain custom commands vs plugins architecture
- ✅ Design a maintainable test framework
- ✅ Handle authentication efficiently
- ✅ Debug and eliminate flaky tests
- ✅ Use advanced cy.intercept() patterns
- ✅ Implement visual regression testing
- ✅ Test file uploads
- ✅ Parallelize tests in CI/CD
- ✅ Handle cross-origin scenarios
- ✅ Build a complete framework from scratch

These questions represent senior-level Cypress expertise expected at BASF!
