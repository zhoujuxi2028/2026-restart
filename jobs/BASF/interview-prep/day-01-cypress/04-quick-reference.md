# Day 1: Quick Reference - Cypress

## Command Cheat Sheet

### Basic Commands
```javascript
cy.visit('/url')                    // Navigate to URL
cy.get('.selector')                 // Get element(s)
cy.contains('text')                 // Find by text content
cy.click()                          // Click element
cy.type('text')                     // Type into input
cy.check()                          // Check checkbox/radio
cy.select('option')                 // Select dropdown option
```

### Assertions
```javascript
.should('be.visible')               // Element visible
.should('have.text', 'text')        // Contains exact text
.should('contain', 'text')          // Contains partial text
.should('have.value', 'value')      // Input has value
.should('be.disabled')              // Element disabled
.should('exist')                    // Element exists in DOM
```

### Network & API
```javascript
cy.intercept('GET', '/api/users').as('getUsers')  // Spy on request
cy.wait('@getUsers')                               // Wait for request
cy.request('POST', '/api', {data})                 // Make HTTP request
```

### Advanced
```javascript
cy.fixture('data.json')             // Load test data
cy.session('key', setup)            // Cache session
cy.origin('domain', callback)       // Cross-origin testing
```

---

## Key Terminology

| Term | Meaning | Example Usage |
|------|---------|---------------|
| **Flaky test** | Test that passes/fails inconsistently | "We reduced flaky tests by 60%" |
| **Retry mechanism** | Auto-retry until success/timeout | "Cypress has built-in retry logic" |
| **Headless** | Browser running without UI | "Tests run headless in CI" |
| **Automatic waiting** | Built-in wait for elements | "No explicit waits needed" |
| **cy.intercept()** | Mock/spy on network requests | "We stub API responses with cy.intercept()" |
| **Time-travel** | Debug by viewing past states | "Cypress time-travel debugging helped find the bug" |

---

## English Phrases for Interviews

### Describing Benefits
- "Cypress **eliminates** the need for explicit waits"
- "Automatic waiting **reduces** test flakiness by 60%"
- "cy.intercept() **enables** testing edge cases"
- "Time-travel debugging **simplifies** troubleshooting"

### Discussing Implementation
- "We **migrated** from Selenium to Cypress"
- "I **implemented** custom commands for authentication"
- "We **integrated** Cypress into our CI/CD pipeline"
- "I **optimized** test execution time using cy.session()"

### Explaining Challenges
- "One challenge we **encountered** was..."
- "The **root cause** was timing issues"
- "We **addressed** this by using cy.intercept()"
- "The **main obstacle** was cross-origin testing"
- "We **resolved** it using cy.origin()"

### Quantifying Results
- "We **reduced** test time **by** 40%"
- "Flakiness **dropped** from 25% **to** 3%"
- "CI pipeline success rate **increased** to 98%"
- "This **resulted in** faster releases"

---

## Self-Introduction Template (2 minutes)

**Structure**: Background → Experience → Skills → Achievement

**Example**:
"Hi, I'm [Name], a QA Automation Engineer with [X] years of experience in test automation. I specialize in Cypress and have built end-to-end testing frameworks for web applications.

In my most recent role at [Company], I led the migration from Selenium to Cypress for our e-commerce platform. This migration reduced our test execution time from 45 minutes to 15 minutes and improved test reliability—our flaky test rate dropped from 25% to under 3%.

I'm proficient in JavaScript/TypeScript and have experience integrating Cypress tests into CI/CD pipelines using GitHub Actions and GitLab CI. I've also implemented best practices like custom commands, page object models, and API mocking with cy.intercept().

One achievement I'm particularly proud of is implementing parallel test execution in our CI pipeline, which reduced feedback time for developers from 30 minutes to 8 minutes. This enabled our team to ship features 50% faster.

I'm excited about this opportunity because [specific reason about BASF/role]."

---

## STAR Story Template

**Situation** (30 seconds):
"In my previous role at [Company], our Cypress test suite had a 25% flakiness rate. Tests would randomly fail in CI, causing developers to lose trust in automation and often merging code without waiting for test results."

**Task** (15 seconds):
"I was tasked with improving test reliability to restore confidence in our automation and enable faster releases."

**Action** (60 seconds):
"I took a systematic approach:

First, I analyzed test failures and identified that 80% of flakiness came from 10 problematic tests involving network requests and animations.

Second, I replaced cy.wait() delays with proper assertions using should('be.visible'). I also added cy.intercept() to mock unreliable third-party APIs.

Third, I implemented data-cy attributes to make selectors more stable. Previously, tests broke whenever CSS classes changed during refactoring.

Fourth, I configured automatic retries for E2E tests in CI with retries: 2 in cypress.config.js.

Finally, I documented best practices and conducted a team training session on writing reliable Cypress tests."

**Result** (30 seconds):
"Within 6 weeks, flakiness dropped from 25% to under 3%. Our CI pipeline success rate improved from 70% to 98%. This restored developer confidence—PRs no longer got merged with failing tests. Most importantly, we were able to ship features 40% faster because developers got reliable feedback quickly."

---

## Common Pronunciation

| Term | Pronunciation | Notes |
|------|---------------|-------|
| Cypress | sigh-press | Not "chip-ress" |
| cy.get() | sigh dot get | Say each part clearly |
| cy.intercept() | sigh inter-sept | Emphasize "inter" |
| Flaky | flay-kee | Like "flake" + "y" |
| Assertion | uh-ser-shun | Not "assert-shun" |
| Headless | hed-less | Two syllables |
| Automatic | aw-toh-mat-ik | Four syllables |

---

## Project Description Template

### Template 1: E-Commerce Testing (2 minutes)
"I built a comprehensive Cypress test framework for our e-commerce platform with 200+ tests covering critical user journeys including search, product selection, cart management, and checkout.

For the checkout flow specifically, I used cy.intercept() to mock Stripe payment API calls, allowing us to test success scenarios, declined cards, and network errors without processing real payments. This made tests 10x faster and 100% reliable.

I also implemented custom commands for common actions like login, adding items to cart, and navigating to checkout. This reduced code duplication by 60% and made tests more maintainable.

The framework integrated with GitLab CI with parallel execution across 4 machines, reducing total test time from 30 minutes to 8 minutes. We achieved 98% CI success rate and caught 95% of bugs before production."

### Template 2: Dashboard Testing (1.5 minutes)
"I developed Cypress tests for our analytics dashboard application which displays real-time data from multiple APIs.

The main challenge was testing dynamic charts and graphs. I used cy.intercept() to stub API responses with consistent test data, ensuring charts rendered predictably. For performance, I used cy.request() to seed data directly via API instead of going through the UI.

I also implemented component tests for individual chart widgets using cy.mount(), which ran in milliseconds and provided fast feedback during development. E2E tests validated complete workflows.

The result was 150+ tests running in under 10 minutes with 97% reliability, enabling the team to ship dashboard updates daily instead of weekly."

---

## Quick Comparison: Cypress vs Selenium

| Feature | Selenium | Cypress |
|---------|----------|---------|
| **Waiting** | Manual (WebDriverWait) | Automatic |
| **Speed** | Slower | 2-3x faster |
| **Flakiness** | Common | Rare |
| **Debugging** | Screenshots | Time-travel |
| **Network** | External tools | Built-in cy.intercept() |
| **Languages** | Multi-language | JS/TS only |
| **Browsers** | All | Chrome-family |

**One-sentence summary**: "Cypress trades browser coverage for speed, reliability, and developer experience."

---

## Common Mistakes to Avoid

### In Code
❌ `cy.wait(5000)` → ✅ `cy.get('.modal').should('be.visible')`
❌ `.get('.css-class')` → ✅ `.get('[data-cy="element"]')`
❌ Multiple assertions per test → ✅ One logical flow per test

### In English
❌ "Cypress is more better" → ✅ "Cypress is better"
❌ "Tests was failing" → ✅ "Tests were failing"
❌ "We use Cypress for test" → ✅ "We use Cypress for testing"

---

## Recording Practice Tips

**Structure for 2-min technical explanation**:
1. Introduction (15s): State the topic
2. Main points (90s): 3-4 key points with examples
3. Conclusion (15s): Summary + impact

**Checklist**:
- [ ] Speak slowly and clearly
- [ ] Use transitions ("First...", "Additionally...", "As a result...")
- [ ] Include specific example or metric
- [ ] End with quantifiable result
- [ ] Stay under time limit

**Topics to practice**:
1. "Explain Cypress architecture"
2. "What is cy.intercept() and when do you use it?"
3. "How does Cypress automatic waiting work?"
4. "Describe a Cypress project you worked on"

---

**Remember**: Use these as templates. Adapt with your real experience and metrics!
