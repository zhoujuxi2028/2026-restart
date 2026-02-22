# Testing Methodologies + ISTQB - Core Concepts

## 1. Software Testing Life Cycle (STLC)

### What is STLC?
Sequence of testing activities to ensure software quality. Runs in parallel with SDLC.

### Six Phases

**1. Requirement Analysis**
- Review requirements for testability
- Identify test objectives and types
- **Deliverables**: RTM, test feasibility report

**2. Test Planning**
- Define test strategy, scope, resources
- Identify risks and priorities
- Define entry/exit criteria
- **Deliverables**: Test plan, test strategy, effort estimation

**3. Test Case Development**
- Write test cases and automation scripts
- Create test data
- Establish traceability (requirements ↔ tests)
- **Deliverables**: Test cases, test scripts, test data, RTM

**4. Test Environment Setup**
- Deploy application to test environment
- Install test tools and configure
- Load test data and verify environment
- **Deliverables**: Environment documentation, setup scripts

**5. Test Execution**
- Execute tests (automated + manual)
- Log defects with detailed reproduction steps
- Re-test fixed defects
- Track progress and report status
- **Deliverables**: Test reports, defect reports, test metrics

**6. Test Closure**
- Create test summary report
- Analyze results and document lessons learned
- Archive test artifacts
- **Deliverables**: Test summary, lessons learned, archived artifacts

### Best Practices
- **Shift-Left**: Start testing early (requirement phase)
- **Continuous Testing**: Test throughout SDLC, not just at the end
- **Traceability**: Maintain RTM (Requirements ↔ Test Cases ↔ Defects)
- **Metrics-Driven**: Track pass rate, defect density, coverage

---

## 2. Behavior-Driven Development (BDD)

### What is BDD?
Collaboration approach using plain language examples to define software behavior.

**Key Principles:**
- Ubiquitous language (domain terms, not technical jargon)
- Three Amigos (Dev, QA, Business collaborate)
- Examples over specifications
- Executable documentation

### BDD vs TDD
| Aspect | BDD | TDD |
|--------|-----|-----|
| **Focus** | Business behavior | Technical implementation |
| **Language** | Plain English (Gherkin) | Technical (unit tests) |
| **Participants** | Dev + QA + Business | Developers |
| **Tools** | Cucumber, SpecFlow | Jest, JUnit |

### Gherkin Syntax

**Basic Structure:**
```gherkin
Feature: User Login
  As a registered user
  I want to log in
  So that I can access my account

  Scenario: Successful login
    Given the user is on the login page
    When the user enters valid credentials
    And the user clicks "Login"
    Then the user should see the dashboard
```

**Scenario Outline (Data-Driven):**
```gherkin
Scenario Outline: Login with different inputs
  Given the user is on the login page
  When the user enters "<username>" and "<password>"
  Then the result is "<result>"

  Examples:
    | username         | password    | result              |
    | valid@email.com  | ValidPass   | Dashboard           |
    | valid@email.com  | wrongpass   | Invalid credentials |
    | invalid@email.com| ValidPass   | Invalid credentials |
```

**Background (Common Setup):**
```gherkin
Feature: Shopping Cart

  Background:
    Given the user is logged in
    And the cart has 3 items

  Scenario: Remove item
    When the user removes the first item
    Then the cart should have 2 items
```

### BDD Workflow
1. **Discovery**: Three Amigos discuss requirements
2. **Formulation**: Write Gherkin scenarios
3. **Automation**: Implement step definitions and run tests

### Best Practices
- Write from user perspective (what, not how)
- Keep scenarios simple (one behavior per scenario)
- Use Background for common setup
- Make scenarios independent
- Use Scenario Outlines for data-driven tests

---

## 3. OOP in Test Automation

### Why OOP?
- **Maintainability**: Change locator once
- **Reusability**: Reuse page objects across tests
- **Readability**: Tests read like plain English
- **Scalability**: Easy to add new tests

### Page Object Model (POM)

**Without POM (Bad):**
```javascript
cy.get('#username').type('user@example.com');
cy.get('#password').type('password');
cy.get('button[type="submit"]').click();
// If #username changes, must update in every test
```

**With POM (Good):**
```javascript
// LoginPage.js
class LoginPage {
  get usernameField() { return cy.get('#username'); }
  get passwordField() { return cy.get('#password'); }
  get submitButton() { return cy.get('button[type="submit"]'); }

  login(username, password) {
    this.usernameField.type(username);
    this.passwordField.type(password);
    this.submitButton.click();
  }
}

// Test file
loginPage.login('user@example.com', 'password');
// If locator changes, update only in LoginPage.js
```

### Inheritance

**BasePage (common functionality):**
```javascript
class BasePage {
  visit(path) { cy.visit(path); }
  click(element) { element.click(); }
  type(element, text) { element.clear().type(text); }
}

class LoginPage extends BasePage {
  visit() { super.visit('/login'); }

  login(username, password) {
    this.type(this.usernameField, username);
    this.type(this.passwordField, password);
    this.click(this.submitButton);
  }
}
```

### Design Patterns

**1. Singleton** (single instance)
```javascript
class ConfigManager {
  constructor() {
    if (ConfigManager.instance) return ConfigManager.instance;
    this.config = { baseUrl: 'http://localhost:3000' };
    ConfigManager.instance = this;
  }
}
export default new ConfigManager();
```

**2. Factory** (object creation)
```javascript
class UserFactory {
  static createUser(role) {
    switch (role) {
      case 'admin': return { username: 'admin@example.com', role: 'admin' };
      case 'editor': return { username: 'editor@example.com', role: 'editor' };
    }
  }
}
```

**3. Strategy** (interchangeable algorithms)
```javascript
class JSONDataProvider {
  loadData(file) { return cy.fixture(file); }
}

class APIDataProvider {
  loadData(endpoint) { return cy.request(endpoint); }
}

class DataManager {
  constructor(strategy) { this.strategy = strategy; }
  getData(source) { return this.strategy.loadData(source); }
}
```

---

## 4. ISTQB Fundamentals

### Seven Testing Principles

1. **Testing Shows Presence of Defects** - Can't prove absence of bugs
2. **Exhaustive Testing is Impossible** - Use risk-based testing
3. **Early Testing (Shift-Left)** - Start testing early, cheaper to fix
4. **Defect Clustering** - 80% of bugs in 20% of code
5. **Pesticide Paradox** - Same tests won't find new bugs, update tests
6. **Testing is Context-Dependent** - Different apps need different approaches
7. **Absence-of-Errors Fallacy** - Bug-free ≠ meets user needs

### Test Levels

**1. Unit Testing**
- Individual components/functions
- Done by developers, fast
- Tools: Jest, JUnit, pytest

**2. Integration Testing**
- Interaction between components
- Verifies interfaces and data flow
- Tools: Postman, Cypress API tests

**3. System Testing**
- Complete integrated system, E2E
- Tools: Cypress, Selenium, Playwright

**4. Acceptance Testing**
- Validates business requirements
- UAT, Alpha, Beta testing

**Test Pyramid:**
```
      /E2E\      Few, Slow, Expensive
     /─────\
    /  API  \    Moderate
   /─────────\
  /   Unit   \   Many, Fast, Cheap
 /───────────\
```

**Ratio**: 60% Unit, 30% Integration, 10% E2E

### Test Types

**Functional Testing**: Does it work as expected?
- Login, checkout, search functionality

**Non-Functional Testing**:
- **Performance**: Load, stress, spike (JMeter, k6)
- **Security**: Vulnerabilities, pen testing (OWASP ZAP)
- **Usability**: User-friendliness, accessibility
- **Compatibility**: Cross-browser, cross-platform

**Regression Testing**: Ensure changes didn't break existing functionality
**Smoke Testing**: Quick basic functionality check
**Exploratory Testing**: Unscripted creative testing

### Test Design Techniques

**1. Equivalence Partitioning**
Divide inputs into groups, test one from each.

Example: Age 18-65
- Test: 15 (invalid), 30 (valid), 70 (invalid)

**2. Boundary Value Analysis**
Test at boundaries.

Example: Age 18-65
- Test: 17, 18, 19, 64, 65, 66

**3. Decision Table Testing**
Test condition combinations.

| Member | Order ≥$100 | Discount |
|--------|-------------|----------|
| Yes    | Yes         | 20%      |
| Yes    | No          | 10%      |
| No     | Yes         | 5%       |
| No     | No          | 0%       |

**4. State Transition Testing**
Test state changes.

States: Created → Paid → Shipped → Delivered
- Valid: Created → Paid ✅
- Invalid: Created → Shipped ❌

---

## 5. Test Strategy and Planning

### Risk-Based Testing
Prioritize testing by: **Risk = Likelihood × Impact**

| Feature | Likelihood | Impact | Risk | Priority |
|---------|------------|--------|------|----------|
| Payment | Medium | High | **High** | P1 |
| Login | Low | High | Medium | P2 |
| About page | Very Low | Low | Low | P4 |

### Test Coverage

**Code Coverage**: % of code executed by tests (80%+ target)
- Tools: Istanbul (JS), Coverage.py (Python)

**Requirement Coverage**: % of requirements with tests (100% target)
- Use RTM (Requirements Traceability Matrix)

**Test Pyramid Coverage**:
- 60% Unit tests
- 30% Integration tests
- 10% E2E tests

### Defect Management

**Defect Lifecycle:**
```
New → Assigned → Open → Fixed → Re-test → Closed
                          ↓
                    Rejected/Deferred
```

**Severity vs Priority:**
- **Severity**: How bad? (Critical, High, Medium, Low)
- **Priority**: How soon? (P1: immediate, P2: before release, P3: next release)

**Metrics:**
- Defect Density: Defects / 1000 LOC
- Defect Removal Efficiency: Defects found / Total defects
- Defect Leakage: Production bugs / Total bugs

### Entry/Exit Criteria

**Entry Criteria** (when to start):
- Requirements finalized
- Build deployed to test environment
- Test data available
- Test cases prepared

**Exit Criteria** (when to stop):
- All test cases executed
- 95%+ pass rate
- No critical/high bugs open
- Test coverage goals met
- Stakeholder sign-off

---

## Summary

### STLC
6 phases: Requirement Analysis → Test Planning → Test Case Development → Environment Setup → Test Execution → Test Closure

### BDD
- Gherkin: Given-When-Then
- Three Amigos collaboration
- Executable documentation

### OOP
- Page Object Model: Separates test logic from page structure
- Inheritance: BasePage for common functionality
- Design Patterns: Singleton, Factory, Strategy

### ISTQB
- 7 principles (shift-left, risk-based)
- Test levels: Unit → Integration → System → Acceptance
- Test types: Functional, Non-functional, Regression
- Techniques: Equivalence Partitioning, Boundary Value Analysis

### Test Strategy
- Risk-based prioritization
- Test pyramid (60% Unit, 30% API, 10% E2E)
- Clear entry/exit criteria
- Track coverage and defect metrics
