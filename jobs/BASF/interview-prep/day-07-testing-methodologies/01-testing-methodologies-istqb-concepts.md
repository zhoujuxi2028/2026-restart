# Testing Methodologies + ISTQB - Core Concepts

## Table of Contents
1. [Software Testing Life Cycle (STLC)](#1-software-testing-life-cycle-stlc)
2. [Behavior-Driven Development (BDD)](#2-behavior-driven-development-bdd)
3. [OOP in Test Automation](#3-oop-in-test-automation)
4. [ISTQB Fundamentals](#4-istqb-fundamentals)
5. [Test Strategy and Planning](#5-test-strategy-and-planning)

---

## 1. Software Testing Life Cycle (STLC)

### 1.1 What is STLC?

**Definition:**
The Software Testing Life Cycle (STLC) is a sequence of specific activities conducted during the testing process to ensure software quality. It defines the phases of testing and what activities occur in each phase.

**STLC vs SDLC:**
- **SDLC** (Software Development Life Cycle): Entire software development process
- **STLC** (Software Testing Life Cycle): Testing-specific activities within SDLC

**Key Concept:**
STLC is not separate from SDLC—it runs in parallel. Testing activities start early (shift-left) and continue throughout development.

### 1.2 The Six Phases of STLC

```
1. Requirement Analysis
        ↓
2. Test Planning
        ↓
3. Test Case Development
        ↓
4. Test Environment Setup
        ↓
5. Test Execution
        ↓
6. Test Closure
```

---

### Phase 1: Requirement Analysis

**Purpose:**
Understand what needs to be tested and identify testability issues early.

**Activities:**
1. **Review Requirements**
   - Analyze functional and non-functional requirements
   - Identify ambiguities or gaps
   - Clarify requirements with stakeholders

2. **Identify Testable Requirements**
   - Determine what can be tested
   - Mark requirements that are vague or untestable
   - Flag requirements that need clarification

3. **Define Test Objectives**
   - What should testing achieve?
   - What are the quality goals?
   - What are the acceptance criteria?

4. **Identify Test Types**
   - Functional testing needed?
   - Non-functional testing (performance, security)?
   - Regression testing scope?

**Entry Criteria:**
- Requirements document available
- Requirement traceability matrix (RTM) prepared
- Access to stakeholders for clarification

**Exit Criteria:**
- Requirements reviewed and understood
- Testability issues identified and resolved
- Test objectives defined
- Test types identified

**Deliverables:**
- Requirements Traceability Matrix (RTM)
- Test feasibility report
- List of testable requirements
- Automation feasibility analysis

**Example (Interview Talking Point):**
> "In my previous project, during requirement analysis, I identified that the acceptance criteria for the 'password reset' feature was vague—it didn't specify timeout behavior or retry limits. I raised this in a requirements review meeting before development started. We clarified that password reset links expire after 24 hours and users can request unlimited resets. This prevented rework later and allowed me to design proper test cases upfront."

---

### Phase 2: Test Planning

**Purpose:**
Define the test strategy, scope, resources, schedule, and approach for testing.

**Activities:**
1. **Define Test Strategy**
   - Types of testing (functional, non-functional, regression)
   - Test approach (manual, automated, hybrid)
   - Test levels (unit, integration, system, acceptance)

2. **Estimate Effort and Resources**
   - How many test cases?
   - How long will testing take?
   - What resources (people, tools, environments) are needed?

3. **Define Test Scope**
   - What features will be tested?
   - What features are out of scope?
   - What are the priorities?

4. **Identify Risks**
   - Technical risks (complex features, new technology)
   - Schedule risks (tight deadlines)
   - Resource risks (team availability)

5. **Define Entry/Exit Criteria**
   - When can testing start? (e.g., "Build is deployed to QA environment")
   - When is testing done? (e.g., "95% test cases passed, no critical bugs")

6. **Define Test Deliverables**
   - What will testing produce? (test cases, reports, metrics)

**Entry Criteria:**
- Requirements analysis complete
- Test objectives defined
- Resources identified

**Exit Criteria:**
- Test plan document approved
- Test strategy defined
- Effort estimated
- Risks identified

**Deliverables:**
- Test Plan document
- Test Strategy document
- Effort estimation
- Resource allocation plan

**Test Plan Template (Key Sections):**
```
1. Introduction
   - Purpose of testing
   - Scope (in-scope and out-of-scope)

2. Test Strategy
   - Test levels (unit, integration, E2E)
   - Test types (functional, performance, security)
   - Test approach (manual, automated)

3. Resources
   - Team members and roles
   - Tools and environments

4. Schedule
   - Timeline for test phases
   - Milestones

5. Entry/Exit Criteria
   - When testing starts
   - When testing is complete

6. Risks and Mitigation
   - Identified risks
   - Mitigation strategies

7. Deliverables
   - Test cases
   - Test reports
   - Metrics

8. Approvals
   - Sign-off from stakeholders
```

**Example (Interview Talking Point):**
> "In my recent project, I created a test plan that defined our strategy: 80% automated coverage using Cypress for E2E tests and Postman for API tests, with 20% exploratory manual testing for edge cases. I estimated 120 hours of effort for 200 test cases, with 2 QA engineers over a 3-week sprint. We defined clear exit criteria: 95% test pass rate, zero critical bugs, all P1 features tested. This plan was approved by the team and guided our testing activities."

---

### Phase 3: Test Case Development

**Purpose:**
Design and develop detailed test cases, test scripts, and test data.

**Activities:**
1. **Write Test Cases**
   - Detailed step-by-step test cases
   - Expected results for each step
   - Test data requirements

2. **Develop Automated Test Scripts**
   - Cypress E2E tests
   - Postman/Newman API tests
   - Unit/integration tests

3. **Create Test Data**
   - Valid test data
   - Invalid test data (negative testing)
   - Boundary values
   - Edge cases

4. **Review Test Cases**
   - Peer review of test cases
   - Ensure coverage of all requirements
   - Verify test data is sufficient

5. **Establish Traceability**
   - Map test cases to requirements (RTM)
   - Ensure every requirement has test coverage

**Entry Criteria:**
- Test plan approved
- Requirements finalized
- Test environment requirements understood

**Exit Criteria:**
- Test cases written and reviewed
- Automated test scripts developed
- Test data created
- Traceability established (requirements ↔ test cases)

**Deliverables:**
- Test cases (manual or automated)
- Test scripts (Cypress, Postman, etc.)
- Test data
- Requirements Traceability Matrix (updated)

**Test Case Format:**
```
Test Case ID: TC-LOGIN-001
Title: Verify successful login with valid credentials
Preconditions: User account exists in database
Test Steps:
  1. Navigate to login page
  2. Enter valid username
  3. Enter valid password
  4. Click "Login" button
Expected Result:
  - User is redirected to dashboard
  - Welcome message displays user's name
  - Session token is created
Test Data:
  - Username: test@example.com
  - Password: ValidP@ss123
Priority: High
Automated: Yes (Cypress)
```

**Example (Interview Talking Point):**
> "During test case development for an e-commerce checkout flow, I wrote 50 test cases covering happy path, error scenarios, and edge cases. I created 30 automated Cypress tests for the critical path and 20 manual test cases for exploratory testing. I also generated synthetic test data—100 test users, 50 products, various payment scenarios. Each test case was mapped to requirements in our RTM, ensuring we had complete coverage."

---

### Phase 4: Test Environment Setup

**Purpose:**
Prepare the infrastructure, tools, and data needed to execute tests.

**Activities:**
1. **Set Up Test Environment**
   - Deploy application to test environment
   - Configure databases
   - Set up network configurations
   - Install necessary software

2. **Install Test Tools**
   - Test automation tools (Cypress, Postman)
   - Defect tracking tools (Jira)
   - Test management tools (TestRail, Zephyr)
   - CI/CD integration (GitLab CI, Jenkins)

3. **Prepare Test Data**
   - Load test data into databases
   - Create test user accounts
   - Set up third-party integrations (if needed)

4. **Verify Environment**
   - Smoke test to verify environment is working
   - Verify all services are running
   - Verify test tools can access the application

**Entry Criteria:**
- Test plan approved
- Test environment requirements defined
- Infrastructure available

**Exit Criteria:**
- Test environment is set up and accessible
- Test tools installed and configured
- Test data loaded
- Smoke test passed

**Deliverables:**
- Test environment setup documentation
- Test data setup scripts
- Environment configuration files

**Example (Interview Talking Point):**
> "For my recent project, I Dockerized the entire test environment using docker-compose. The setup included the Node.js application, PostgreSQL database, Redis cache, and Cypress tests. I created database seed scripts to populate test data—100 users, 500 products. New team members could run 'docker-compose up' and have a fully working test environment in 5 minutes, compared to the previous 2-day manual setup process."

---

### Phase 5: Test Execution

**Purpose:**
Execute test cases, log defects, and track test progress.

**Activities:**
1. **Execute Test Cases**
   - Run automated test suites
   - Perform manual testing
   - Follow test case steps and verify results

2. **Log Defects**
   - Report bugs in defect tracking system (Jira)
   - Provide detailed steps to reproduce
   - Include screenshots, logs, and environment details
   - Assign severity and priority

3. **Re-test Fixed Defects**
   - Verify bug fixes
   - Perform regression testing
   - Update test case status

4. **Track Test Progress**
   - Monitor test execution metrics
   - Update test status (passed, failed, blocked)
   - Report progress to stakeholders

5. **Perform Regression Testing**
   - Re-run tests after code changes
   - Ensure new changes didn't break existing functionality

**Entry Criteria:**
- Test environment ready
- Test cases/scripts available
- Test data prepared
- Build deployed to test environment

**Exit Criteria:**
- All planned test cases executed
- Critical and high-priority defects resolved
- Exit criteria from test plan met (e.g., 95% pass rate)
- Regression testing complete

**Deliverables:**
- Test execution reports
- Defect reports
- Test metrics (pass/fail rate, defect density, coverage)
- Traceability matrix (updated with test results)

**Defect Report Format:**
```
Defect ID: BUG-1234
Summary: Login fails with special characters in password
Severity: High
Priority: P1
Steps to Reproduce:
  1. Navigate to login page
  2. Enter username: test@example.com
  3. Enter password: P@ss!word#123 (contains special characters)
  4. Click "Login" button
Expected Result: User logs in successfully
Actual Result: Error message "Invalid credentials" appears
Environment: QA, Chrome 110, Windows 10
Attachments: screenshot.png, console-log.txt
Status: Open
Assigned To: Dev Team
```

**Example (Interview Talking Point):**
> "During test execution for a recent release, I ran our automated Cypress test suite (200 tests) in CI on every commit. I also performed exploratory testing for 5 hours, focusing on edge cases not covered by automation. I discovered and logged 12 defects—3 critical, 5 high, 4 medium. I worked closely with developers to reproduce issues, providing detailed steps and logs. After fixes were deployed, I performed regression testing to ensure nothing broke. Our final pass rate was 97%, exceeding the 95% exit criteria."

---

### Phase 6: Test Closure

**Purpose:**
Complete testing activities, create final reports, and document lessons learned.

**Activities:**
1. **Create Test Summary Report**
   - Total test cases executed
   - Pass/fail rate
   - Defects found and fixed
   - Test coverage achieved
   - Test metrics (execution time, defect density)

2. **Analyze Test Results**
   - What went well?
   - What went poorly?
   - Were test objectives met?
   - What are the risks for production?

3. **Document Lessons Learned**
   - What could be improved?
   - What best practices emerged?
   - What should be avoided in future?

4. **Archive Test Artifacts**
   - Test cases, scripts, data
   - Test reports and metrics
   - Defect reports
   - Test environment documentation

5. **Conduct Retrospective**
   - Team discussion on testing process
   - Identify improvements for next cycle
   - Update test processes/frameworks

**Entry Criteria:**
- Test execution complete
- All critical/high defects resolved or accepted
- Exit criteria met

**Exit Criteria:**
- Test summary report completed
- Lessons learned documented
- Test artifacts archived
- Sign-off from stakeholders

**Deliverables:**
- Test Summary Report
- Test Metrics Dashboard
- Lessons Learned Document
- Archived test artifacts

**Test Summary Report (Key Metrics):**
```
Test Summary Report
Project: E-commerce Checkout Feature
Test Period: Jan 15 - Feb 5, 2026

Test Execution Summary:
  - Total Test Cases: 250
  - Executed: 245 (98%)
  - Passed: 235 (96%)
  - Failed: 10 (4%)
  - Blocked: 5 (2%)

Defect Summary:
  - Total Defects Found: 28
  - Critical: 2 (both resolved)
  - High: 8 (7 resolved, 1 deferred to next release)
  - Medium: 12 (all resolved)
  - Low: 6 (4 resolved, 2 deferred)

Test Coverage:
  - Requirement Coverage: 98%
  - Code Coverage: 82%
  - Automated Test Coverage: 75%

Environment:
  - QA Environment (AWS)
  - Chrome, Firefox, Safari tested

Recommendations:
  - 1 high-priority defect deferred (BUG-1250) - document workaround
  - Increase test automation coverage to 85% for next sprint
  - Add performance testing for checkout flow

Sign-Off:
  - QA Lead: Approved
  - Dev Lead: Approved
  - Product Owner: Approved
```

**Example (Interview Talking Point):**
> "At the end of our sprint, I created a comprehensive test summary report showing that we executed 245 of 250 planned test cases (98%), with a 96% pass rate. We found and fixed 26 of 28 bugs, with 2 low-priority issues deferred to the next sprint. I also conducted a retrospective where we identified that our automated test suite could be 15% faster with better parallelization. I documented these lessons learned and implemented the improvements in the next sprint."

---

### 1.3 STLC Best Practices

1. **Start Early (Shift-Left)**
   - Begin test planning during requirements phase
   - Review requirements for testability
   - Identify risks early

2. **Continuous Testing**
   - Don't wait for testing phase—test throughout
   - Integrate tests into CI/CD pipelines
   - Provide fast feedback to developers

3. **Traceability**
   - Maintain RTM (Requirements ↔ Test Cases ↔ Defects)
   - Ensure every requirement is tested
   - Track coverage gaps

4. **Automation**
   - Automate repetitive tests
   - Use automation for regression testing
   - Balance automation with exploratory manual testing

5. **Collaboration**
   - Involve QA in requirement discussions
   - Work closely with developers
   - Communicate with stakeholders

6. **Metrics-Driven**
   - Track test metrics (pass rate, defect density, coverage)
   - Use metrics to improve process
   - Make data-driven decisions

---

## 2. Behavior-Driven Development (BDD)

### 2.1 What is BDD?

**Definition:**
Behavior-Driven Development (BDD) is a software development approach that emphasizes collaboration between developers, QA, and business stakeholders. It uses examples in plain language to describe how software should behave.

**Key Principles:**
1. **Ubiquitous Language**: Use domain language, not technical jargon
2. **Three Amigos**: Dev, QA, and Business collaborate
3. **Examples Over Specifications**: Concrete examples instead of abstract requirements
4. **Executable Documentation**: Tests serve as living documentation

**BDD vs TDD:**
| Aspect | TDD (Test-Driven Development) | BDD (Behavior-Driven Development) |
|--------|-------------------------------|-----------------------------------|
| **Focus** | Technical implementation | Business behavior |
| **Language** | Technical (unit tests) | Plain English (Gherkin) |
| **Participants** | Developers | Developers + QA + Business |
| **Purpose** | Verify code works correctly | Ensure software behaves as expected |
| **Tool** | Unit testing frameworks (Jest, JUnit) | BDD frameworks (Cucumber, SpecFlow) |

**Interview Talking Point:**
> "BDD and TDD are complementary, not competing. TDD focuses on how code works internally (unit tests), while BDD focuses on how the system behaves from a user perspective. I use TDD for writing testable code and BDD for defining acceptance criteria and E2E behavior."

### 2.2 Gherkin Syntax

**Gherkin** is the language used to write BDD scenarios. It's plain English with specific keywords.

**Keywords:**
- `Feature`: High-level description of a feature
- `Scenario`: A specific test case
- `Given`: Precondition (setup)
- `When`: Action (trigger)
- `Then`: Expected result (assertion)
- `And` / `But`: Additional steps

**Basic Structure:**
```gherkin
Feature: User Login
  As a registered user
  I want to log in to my account
  So that I can access personalized features

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    And the user has a valid account
    When the user enters username "user@example.com"
    And the user enters password "ValidP@ss123"
    And the user clicks the "Login" button
    Then the user should be redirected to the dashboard
    And the user should see a welcome message "Welcome, User!"
```

**Scenario Outline (Data-Driven Testing):**
```gherkin
Feature: Login with different credentials

  Scenario Outline: Login with various inputs
    Given the user is on the login page
    When the user enters username "<username>"
    And the user enters password "<password>"
    And the user clicks the "Login" button
    Then the user should see "<result>"

    Examples:
      | username          | password      | result                |
      | user@example.com  | ValidP@ss123  | Dashboard             |
      | user@example.com  | wrongpass     | Invalid credentials   |
      | invalid@email.com | ValidP@ss123  | Invalid credentials   |
      | <blank>           | ValidP@ss123  | Username is required  |
      | user@example.com  | <blank>       | Password is required  |
```

**Background (Common Setup):**
```gherkin
Feature: E-commerce Shopping Cart

  Background:
    Given the user is logged in
    And the user has added 3 items to the cart

  Scenario: Remove item from cart
    When the user clicks "Remove" on the first item
    Then the cart should contain 2 items

  Scenario: Update item quantity
    When the user changes the quantity of the first item to 5
    Then the cart total should be updated
```

### 2.3 BDD Workflow

**Step 1: Discovery (Three Amigos)**
- Dev, QA, and Business stakeholder meet
- Discuss feature requirements
- Identify examples and edge cases
- Create initial Gherkin scenarios

**Step 2: Formulation**
- Refine Gherkin scenarios
- Ensure scenarios are clear and unambiguous
- Review and get approval from stakeholders

**Step 3: Automation**
- Implement step definitions (code that executes Gherkin steps)
- Connect Gherkin scenarios to test automation (Cucumber, SpecFlow)
- Run automated tests

**Example Step Definitions (Cucumber + JavaScript):**
```javascript
// Gherkin
// Given the user is on the login page

// Step Definition
Given('the user is on the login page', () => {
  cy.visit('/login');
});

// Gherkin
// When the user enters username "user@example.com"

// Step Definition
When('the user enters username {string}', (username) => {
  cy.get('#username').type(username);
});

// Gherkin
// Then the user should be redirected to the dashboard

// Step Definition
Then('the user should be redirected to the dashboard', () => {
  cy.url().should('include', '/dashboard');
});
```

### 2.4 Benefits of BDD

1. **Improved Collaboration**
   - Shared understanding between Dev, QA, Business
   - Reduces miscommunication
   - Everyone contributes to defining behavior

2. **Living Documentation**
   - Gherkin scenarios serve as documentation
   - Always up-to-date (tests fail if behavior changes)
   - Non-technical stakeholders can read and understand

3. **Clear Requirements**
   - Examples clarify ambiguous requirements
   - Edge cases identified early
   - Acceptance criteria defined upfront

4. **Early Defect Detection**
   - Tests written before code (or alongside)
   - Behavior defined before implementation
   - Less rework

5. **Better Test Coverage**
   - Scenarios cover both happy path and edge cases
   - Business-driven test cases (not just technical)

**Example (Interview Talking Point):**
> "In my previous project, we adopted BDD for a complex payment processing feature. The Three Amigos (developer, QA, product owner) met to discuss requirements. We identified 15 scenarios including edge cases like 'What if payment gateway times out?' or 'What if user's card is declined?' We wrote these as Gherkin scenarios, which became our acceptance criteria. I automated these scenarios using Cucumber and Cypress. The result was that all stakeholders had a clear, shared understanding of expected behavior, and we caught several edge case bugs before they reached production."

### 2.5 BDD Best Practices

1. **Write Scenarios from User Perspective**
   - Focus on user behavior, not technical implementation
   - Describe "what" not "how"

   ```gherkin
   # Good: Focus on user behavior
   When the user submits the checkout form
   Then the user should see an order confirmation

   # Bad: Focus on technical implementation
   When the user clicks button with ID "submit-checkout"
   Then the API POST request should return status 201
   And the database should contain a new order record
   ```

2. **Keep Scenarios Simple**
   - One scenario tests one behavior
   - Avoid long scenarios with too many steps
   - Break complex scenarios into multiple simpler ones

3. **Use Background for Common Setup**
   - Don't repeat setup steps in every scenario
   - Use `Background` keyword for common preconditions

4. **Make Scenarios Independent**
   - Each scenario should run in isolation
   - Don't rely on execution order
   - Clean up data after each scenario

5. **Use Scenario Outlines for Data-Driven Tests**
   - When testing same behavior with different data
   - Use Examples table
   - Keeps scenarios DRY (Don't Repeat Yourself)

6. **Keep Step Definitions Reusable**
   - Write step definitions that can be reused
   - Avoid hard-coding values
   - Use parameters

---

## 3. OOP in Test Automation

### 3.1 Why OOP in Test Automation?

**Benefits:**
1. **Maintainability**: Changes in one place (e.g., locator update)
2. **Reusability**: Reuse page objects, utilities across tests
3. **Readability**: Tests read like plain English
4. **Scalability**: Easy to add new tests and pages

**OOP Principles:**
- **Encapsulation**: Hide implementation details
- **Inheritance**: Reuse common functionality
- **Polymorphism**: Same interface, different implementations
- **Abstraction**: Simplify complex operations

### 3.2 Page Object Model (POM)

**Definition:**
POM is a design pattern that creates an object repository for web UI elements, separating test logic from page structure.

**Key Concept:**
Each web page is represented as a class. The class contains:
- **Elements**: Locators for UI elements
- **Actions**: Methods to interact with elements

**Without POM (Bad Practice):**
```javascript
// Test file (messy, hard to maintain)
describe('Login Tests', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('#username').type('user@example.com');
    cy.get('#password').type('ValidP@ss123');
    cy.get('button[type="submit"]').click();
    cy.get('.welcome-message').should('contain', 'Welcome');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');
    cy.get('#username').type('user@example.com');
    cy.get('#password').type('wrong-password');
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });
});

// Problem: If locator #username changes to #email, must update in every test
```

**With POM (Good Practice):**
```javascript
// LoginPage.js (Page Object)
class LoginPage {
  // Elements (encapsulation)
  get usernameField() { return cy.get('#username'); }
  get passwordField() { return cy.get('#password'); }
  get submitButton() { return cy.get('button[type="submit"]'); }
  get welcomeMessage() { return cy.get('.welcome-message'); }
  get errorMessage() { return cy.get('.error-message'); }

  // Actions (methods)
  visit() {
    cy.visit('/login');
  }

  enterUsername(username) {
    this.usernameField.type(username);
  }

  enterPassword(password) {
    this.passwordField.type(password);
  }

  clickSubmit() {
    this.submitButton.click();
  }

  // High-level action (abstraction)
  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickSubmit();
  }

  // Assertions
  verifyWelcomeMessage(expectedMessage) {
    this.welcomeMessage.should('contain', expectedMessage);
  }

  verifyErrorMessage(expectedMessage) {
    this.errorMessage.should('contain', expectedMessage);
  }
}

export default new LoginPage();
```

```javascript
// login.spec.js (Test file - clean and readable)
import loginPage from '../pages/LoginPage';

describe('Login Tests', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('should login successfully', () => {
    loginPage.login('user@example.com', 'ValidP@ss123');
    loginPage.verifyWelcomeMessage('Welcome');
  });

  it('should show error for invalid credentials', () => {
    loginPage.login('user@example.com', 'wrong-password');
    loginPage.verifyErrorMessage('Invalid credentials');
  });
});

// Benefit: If locator changes, update only in LoginPage.js, not in every test
```

### 3.3 Inheritance in Test Automation

**Base Page Class:**
```javascript
// BasePage.js (common functionality for all pages)
class BasePage {
  visit(path) {
    cy.visit(path);
  }

  getElement(selector) {
    return cy.get(selector);
  }

  click(element) {
    element.click();
  }

  type(element, text) {
    element.clear().type(text);
  }

  verifyText(element, expectedText) {
    element.should('contain', expectedText);
  }

  verifyUrl(expectedUrl) {
    cy.url().should('include', expectedUrl);
  }
}

export default BasePage;
```

**Derived Page Class:**
```javascript
// LoginPage.js (inherits from BasePage)
import BasePage from './BasePage';

class LoginPage extends BasePage {
  constructor() {
    super();
    this.url = '/login';
  }

  get usernameField() { return this.getElement('#username'); }
  get passwordField() { return this.getElement('#password'); }
  get submitButton() { return this.getElement('button[type="submit"]'); }

  visit() {
    super.visit(this.url);  // Use inherited method
  }

  login(username, password) {
    this.type(this.usernameField, username);     // Use inherited method
    this.type(this.passwordField, password);     // Use inherited method
    this.click(this.submitButton);               // Use inherited method
  }
}

export default new LoginPage();
```

**Benefit:** Common functionality (visit, click, type) is written once in BasePage and reused by all page objects.

### 3.4 Design Patterns in Test Automation

**1. Singleton Pattern (Single Instance)**

Ensures a class has only one instance.

```javascript
// ConfigManager.js
class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;  // Return existing instance
    }

    this.config = {
      baseUrl: Cypress.env('BASE_URL') || 'http://localhost:3000',
      apiUrl: Cypress.env('API_URL') || 'http://localhost:3001/api',
      timeout: 10000
    };

    ConfigManager.instance = this;
  }

  getBaseUrl() {
    return this.config.baseUrl;
  }

  getApiUrl() {
    return this.config.apiUrl;
  }
}

export default new ConfigManager();  // Single instance exported

// Usage in tests
import config from '../utils/ConfigManager';
cy.visit(config.getBaseUrl());
```

**2. Factory Pattern (Object Creation)**

Creates objects without specifying exact class.

```javascript
// UserFactory.js
class UserFactory {
  static createUser(role) {
    switch (role) {
      case 'admin':
        return {
          username: 'admin@example.com',
          password: 'AdminP@ss123',
          role: 'admin',
          permissions: ['read', 'write', 'delete']
        };

      case 'editor':
        return {
          username: 'editor@example.com',
          password: 'EditorP@ss123',
          role: 'editor',
          permissions: ['read', 'write']
        };

      case 'viewer':
        return {
          username: 'viewer@example.com',
          password: 'ViewerP@ss123',
          role: 'viewer',
          permissions: ['read']
        };

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}

export default UserFactory;

// Usage in tests
import UserFactory from '../factories/UserFactory';

it('should allow admin to delete posts', () => {
  const admin = UserFactory.createUser('admin');
  loginPage.login(admin.username, admin.password);
  // ... test admin-specific functionality
});
```

**3. Strategy Pattern (Interchangeable Algorithms)**

Defines a family of algorithms and makes them interchangeable.

```javascript
// DataProvider Strategy
class CSVDataProvider {
  loadData(filePath) {
    // Load data from CSV file
    return cy.fixture(filePath).then((data) => {
      return this.parseCSV(data);
    });
  }

  parseCSV(data) {
    // CSV parsing logic
    return data.split('\n').map(row => row.split(','));
  }
}

class JSONDataProvider {
  loadData(filePath) {
    // Load data from JSON file
    return cy.fixture(filePath);
  }
}

class APIDataProvider {
  loadData(endpoint) {
    // Load data from API
    return cy.request(endpoint).then((response) => response.body);
  }
}

// DataManager uses Strategy
class DataManager {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  getData(source) {
    return this.strategy.loadData(source);
  }
}

// Usage
const csvProvider = new CSVDataProvider();
const dataManager = new DataManager(csvProvider);
dataManager.getData('users.csv').then((users) => {
  // Use users in test
});

// Can easily switch strategy
const apiProvider = new APIDataProvider();
dataManager.setStrategy(apiProvider);
dataManager.getData('/api/users').then((users) => {
  // Same interface, different source
});
```

### 3.5 OOP Best Practices

1. **Single Responsibility Principle**
   - Each class should have one responsibility
   - Page Object represents one page
   - Utility class performs one type of operation

2. **DRY (Don't Repeat Yourself)**
   - Extract common functionality to base classes or utilities
   - Reuse code instead of duplicating

3. **Meaningful Names**
   - Class names: `LoginPage`, `CheckoutPage` (noun)
   - Method names: `login()`, `addToCart()` (verb)
   - Clear and descriptive

4. **Encapsulation**
   - Hide implementation details
   - Expose only necessary methods

5. **Keep It Simple**
   - Don't over-engineer
   - Apply patterns only when they add value

**Example (Interview Talking Point):**
> "I designed our Cypress test framework using Page Object Model. Each page is represented as a class with elements and actions. For example, the LoginPage class has methods like `login(username, password)` and `verifyErrorMessage()`. All page objects inherit from a BasePage class that provides common functionality like `visit()`, `click()`, and `type()`. This structure makes our tests highly maintainable—when a locator changes, I update it in one place, not across dozens of tests. The framework is also readable—tests read like plain English: `loginPage.login('user@example.com', 'password')`, not cryptic selectors."

---

## 4. ISTQB Fundamentals

### 4.1 What is ISTQB?

**International Software Testing Qualifications Board (ISTQB)** is a globally recognized certification body for software testing professionals.

**Certification Levels:**
1. **Foundation Level**: Entry-level (what we cover today)
2. **Advanced Level**: Experienced testers (Test Manager, Test Analyst, Technical Test Analyst)
3. **Expert Level**: Senior specialists

**For BASF Interview:**
- You don't need the certification
- But knowing Foundation Level concepts demonstrates professional knowledge
- Shows you speak the same "testing language" as global teams

### 4.2 Seven Testing Principles

These are fundamental principles from ISTQB Foundation Level:

**1. Testing Shows Presence of Defects**
- Testing can show bugs exist, but not that bugs don't exist
- You can never test everything
- **Interview Point**: "Testing reduces the probability of undiscovered defects, but we can never guarantee bug-free software."

**2. Exhaustive Testing is Impossible**
- Can't test all inputs, all combinations, all paths
- Must use risk-based and priority-based testing
- **Interview Point**: "With infinite possible inputs, we use techniques like equivalence partitioning and boundary value analysis to test efficiently."

**3. Early Testing (Shift-Left)**
- Testing activities should start early (requirement phase)
- Finding bugs early is cheaper
- **Interview Point**: "By reviewing requirements for testability before development starts, I've prevented bugs that would have cost 10x more to fix later."

**4. Defect Clustering**
- Small number of modules contain most defects
- 80/20 rule: 80% of bugs in 20% of code
- **Interview Point**: "I identify high-risk modules (complex features, frequently changed code) and allocate more testing effort there."

**5. Pesticide Paradox**
- Same tests repeated won't find new bugs
- Must regularly review and update tests
- **Interview Point**: "I periodically refactor our test suite, removing obsolete tests and adding new scenarios based on production issues."

**6. Testing is Context-Dependent**
- Different applications need different testing approaches
- E-commerce site vs medical device have different quality needs
- **Interview Point**: "For an e-commerce site, I focus heavily on performance and user experience. For a banking application, security and data integrity are paramount."

**7. Absence-of-Errors Fallacy**
- Bug-free software is useless if it doesn't meet user needs
- Must also verify software meets requirements
- **Interview Point**: "Testing isn't just finding bugs—it's ensuring the software meets user expectations and solves their problems."

### 4.3 Test Levels

**1. Unit Testing**
- Tests individual components/functions in isolation
- Done by developers
- Fast, many tests
- **Tools**: Jest, JUnit, pytest
- **Example**: Test that a `calculateTotal()` function correctly sums prices

**2. Integration Testing**
- Tests interaction between integrated components
- Verifies interfaces and data flow
- **Tools**: Postman/Newman, Cypress (API tests)
- **Example**: Test that frontend can successfully call backend API and receive correct response

**3. System Testing**
- Tests the complete, integrated system
- End-to-end testing
- **Tools**: Cypress, Selenium, Playwright
- **Example**: Test complete user journey from login to checkout to order confirmation

**4. Acceptance Testing**
- Validates software meets business requirements
- Often done by users or QA
- Final validation before release
- **Types**:
  - **UAT (User Acceptance Testing)**: Real users test
  - **Alpha Testing**: Internal testing
  - **Beta Testing**: Limited external users

**Test Pyramid:**
```
        /\
       /E2E\        Few, Slow, Expensive (System/Acceptance Tests)
      /────\
     /  API \       Moderate number, Medium speed (Integration Tests)
    /────────\
   /   Unit   \     Many, Fast, Cheap (Unit Tests)
  /────────────\
```

**Pyramid Principle:**
- Most tests at unit level (fast, cheap)
- Fewer tests at integration level
- Fewest tests at E2E level (slow, expensive)

**Interview Point:**
> "I follow the test pyramid. I encourage developers to write comprehensive unit tests (they're fast and catch logic errors). I focus my automation on integration tests (API tests with Postman) and critical path E2E tests (Cypress). I avoid over-relying on E2E tests because they're slow and brittle. This balanced approach gives us strong coverage with reasonable execution time."

### 4.4 Test Types

**1. Functional Testing**
- Verifies software functions according to requirements
- "Does it do what it's supposed to do?"
- **Examples**: Login works, checkout calculates correct total, search returns relevant results

**2. Non-Functional Testing**

**a) Performance Testing**
- Load testing: System behavior under expected load
- Stress testing: System behavior under extreme load
- Spike testing: Sudden load increases
- **Tools**: JMeter, Gatling, k6

**b) Security Testing**
- Vulnerability testing
- Penetration testing
- Authentication/authorization testing
- **Tools**: OWASP ZAP, Burp Suite

**c) Usability Testing**
- User-friendliness
- Ease of use
- Accessibility

**d) Compatibility Testing**
- Cross-browser testing (Chrome, Firefox, Safari)
- Cross-platform testing (Windows, Mac, Linux)
- Mobile device testing

**3. Regression Testing**
- Re-running tests after code changes
- Ensures new changes didn't break existing functionality
- Typically automated
- **Interview Point**: "Our automated Cypress regression suite runs on every PR. It takes 15 minutes and covers all critical user paths, giving us confidence that changes didn't introduce bugs."

**4. Smoke Testing (Sanity Testing)**
- Quick test to verify basic functionality
- "Can we even start testing?"
- Often first test after deployment
- **Example**: After deployment, verify homepage loads, login works, key API endpoints respond

**5. Exploratory Testing**
- Unscripted, creative testing
- Tester actively explores application
- Good for finding unexpected bugs
- **Interview Point**: "While automation covers known scenarios, I allocate 20% of testing time to exploratory testing where I actively try to break the application in unexpected ways."

### 4.5 Test Design Techniques

**1. Equivalence Partitioning**

**Concept**: Divide inputs into groups (partitions) that should behave similarly. Test one value from each partition.

**Example: Age Field (valid: 18-65)**

Partitions:
- Invalid (< 18): Test with age = 10
- Valid (18-65): Test with age = 30
- Invalid (> 65): Test with age = 70

```gherkin
Scenario Outline: Verify age validation
  When the user enters age "<age>"
  Then the system should display "<result>"

  Examples:
    | age | result       |
    | 10  | Invalid age  |  # Invalid partition
    | 30  | Valid        |  # Valid partition
    | 70  | Invalid age  |  # Invalid partition
```

**2. Boundary Value Analysis**

**Concept**: Errors often occur at boundaries. Test values at and around boundaries.

**Example: Age Field (valid: 18-65)**

Test values:
- 17 (just below lower boundary) - should fail
- 18 (lower boundary) - should pass
- 19 (just above lower boundary) - should pass
- 64 (just below upper boundary) - should pass
- 65 (upper boundary) - should pass
- 66 (just above upper boundary) - should fail

```gherkin
Scenario Outline: Verify age boundary values
  When the user enters age "<age>"
  Then the system should display "<result>"

  Examples:
    | age | result       |
    | 17  | Invalid age  |
    | 18  | Valid        |
    | 19  | Valid        |
    | 64  | Valid        |
    | 65  | Valid        |
    | 66  | Invalid age  |
```

**3. Decision Table Testing**

**Concept**: Test combinations of conditions.

**Example: Discount Eligibility**

Conditions:
- Customer is a member: Yes/No
- Order total >= $100: Yes/No

Rules:
- Member + Order >= $100 → 20% discount
- Member + Order < $100 → 10% discount
- Non-member + Order >= $100 → 5% discount
- Non-member + Order < $100 → No discount

Decision Table:

| Rule | Member | Order >= $100 | Discount |
|------|--------|---------------|----------|
| 1    | Yes    | Yes           | 20%      |
| 2    | Yes    | No            | 10%      |
| 3    | No     | Yes           | 5%       |
| 4    | No     | No            | 0%       |

**4. State Transition Testing**

**Concept**: Test transitions between states.

**Example: Order States**

States:
- Created
- Paid
- Shipped
- Delivered
- Cancelled

Transitions:
- Created → Paid (user pays)
- Paid → Shipped (admin ships)
- Shipped → Delivered (delivery confirmed)
- Created → Cancelled (user cancels before payment)
- Paid → Cancelled (admin cancels after payment, refund issued)

Tests:
- Valid transition: Created → Paid → Shipped → Delivered ✅
- Invalid transition: Created → Shipped (can't ship unpaid order) ❌
- Valid transition: Paid → Cancelled (refund) ✅

**Interview Point:**
> "I use equivalence partitioning and boundary value analysis extensively. For example, when testing a date picker accepting dates from 2000-2025, I don't test all 9,000+ dates. I use equivalence partitioning: one date from invalid range (<2000), one from valid range (2000-2025), one from invalid range (>2025). I also test boundaries: 1999, 2000, 2025, 2026. This gives comprehensive coverage with minimal test cases."

---

## 5. Test Strategy and Planning

### 5.1 What is Test Strategy?

**Test Strategy** is a high-level document that defines the overall approach to testing for an organization or project.

**Key Components:**
1. **Scope**: What will be tested?
2. **Objectives**: What should testing achieve?
3. **Approach**: How will testing be conducted?
4. **Resources**: Who and what tools?
5. **Schedule**: When will testing occur?
6. **Risks**: What are the risks?

**Test Strategy vs Test Plan:**
- **Test Strategy**: High-level, organization-wide, reusable
- **Test Plan**: Specific project, detailed, one-time

### 5.2 Risk-Based Testing

**Concept**: Prioritize testing based on risk (likelihood × impact).

**Risk Assessment:**

| Feature | Likelihood of Failure | Impact if Fails | Risk Level | Test Priority |
|---------|----------------------|-----------------|------------|---------------|
| Payment processing | Medium | High | **High** | Priority 1 |
| User login | Low | High | **Medium** | Priority 2 |
| Product search | Medium | Medium | **Medium** | Priority 2 |
| User profile | Low | Low | **Low** | Priority 3 |
| About Us page | Very Low | Low | **Low** | Priority 4 |

**Testing Allocation:**
- **High Risk**: Extensive testing (automation + manual + exploratory)
- **Medium Risk**: Moderate testing (automation + selective manual)
- **Low Risk**: Minimal testing (automation only or spot checks)

**Interview Point:**
> "I use risk-based testing to allocate effort efficiently. For an e-commerce site, payment processing is high-risk (critical to business, financial impact), so I invest heavily in testing it—automated tests, manual testing, edge cases, security testing. The 'About Us' static page is low-risk, so I only verify it loads correctly. This ensures we focus on what matters most."

### 5.3 Test Coverage

**Code Coverage:**
- Percentage of code executed by tests
- **Types**:
  - Statement coverage
  - Branch coverage
  - Path coverage
- **Tools**: Istanbul (JavaScript), Coverage.py (Python), JaCoCo (Java)

**Requirement Coverage:**
- Percentage of requirements with tests
- Use Requirements Traceability Matrix (RTM)

**Test Pyramid Coverage:**
- Unit: 70% of tests
- Integration: 20% of tests
- E2E: 10% of tests

**Coverage Goals:**
- **Unit tests**: 80%+ code coverage
- **Integration tests**: All API endpoints
- **E2E tests**: All critical user paths

**Interview Point:**
> "I track multiple coverage metrics. Our code coverage is 85% (measured by Istanbul). Our requirement coverage is 95%—every requirement in Jira is traced to at least one test case in our RTM. I also ensure we follow the test pyramid: 70% unit tests (fast), 20% API tests (medium), 10% E2E (slow). This balanced approach gives us confidence without excessive test execution time."

### 5.4 Defect Management

**Defect Lifecycle:**
```
New → Assigned → Open → Fixed → Re-test → Closed
                           ↓
                       Rejected / Deferred
```

**Defect Severity:**
- **Critical**: System crash, data loss, security breach
- **High**: Major feature not working
- **Medium**: Minor feature issue, workaround available
- **Low**: Cosmetic issue, typo

**Defect Priority:**
- **P1**: Fix immediately (blocks release)
- **P2**: Fix before release
- **P3**: Fix in next release
- **P4**: Fix if time permits

**Defect Metrics:**
- **Defect Density**: Defects / Size (e.g., defects per 1000 lines of code)
- **Defect Removal Efficiency**: Defects found / Total defects
- **Defect Leakage**: Production bugs / Total bugs found

**Interview Point:**
> "I use Jira for defect management. Each bug is categorized by severity (how bad?) and priority (how soon to fix?). For example, a typo might be low severity but high priority if it's on the homepage visible to all users. I track defect density to identify problematic modules. If one module has 10 defects while others have 1-2, that module needs refactoring or more testing attention."

### 5.5 Entry and Exit Criteria

**Entry Criteria** (when to start testing):
- Requirements finalized
- Build deployed to test environment
- Test environment ready
- Test data available
- Test cases prepared

**Exit Criteria** (when to stop testing):
- All planned test cases executed
- 95%+ test pass rate
- No critical/high severity bugs open
- Test coverage goals met
- Stakeholder sign-off obtained

**Interview Point:**
> "I define clear entry and exit criteria in the test plan. We don't start testing until the build passes smoke tests and is deployed to a stable QA environment. We don't close testing until we achieve 95% test pass rate, all critical bugs are resolved, and we have stakeholder approval. This prevents premature or delayed testing phases."

---

## Summary: Key Takeaways

### STLC
- Six phases: Requirement Analysis → Test Planning → Test Case Development → Environment Setup → Test Execution → Test Closure
- Each phase has specific activities, entry/exit criteria, and deliverables
- Apply shift-left principle—start testing early

### BDD
- Collaboration between Dev, QA, and Business
- Gherkin syntax: Given-When-Then
- Executable documentation
- Use for defining acceptance criteria and behavior

### OOP in Testing
- Page Object Model separates test logic from page structure
- Inheritance for reusable base classes
- Design patterns (Singleton, Factory, Strategy) improve test framework
- Maintainability and scalability are key benefits

### ISTQB
- Seven testing principles (especially shift-left and risk-based)
- Test levels: Unit → Integration → System → Acceptance (Test Pyramid)
- Test types: Functional, Non-functional, Regression, Smoke, Exploratory
- Test design techniques: Equivalence Partitioning, Boundary Value Analysis

### Test Strategy
- High-level approach to testing
- Risk-based testing prioritizes high-risk areas
- Track coverage (code, requirement, pyramid)
- Defect management with severity/priority
- Clear entry/exit criteria

---

## Interview Preparation Checklist

After studying this document, you should be able to:

- [ ] Explain STLC phases and activities
- [ ] Write a Gherkin BDD scenario
- [ ] Describe Page Object Model pattern
- [ ] Explain 2-3 ISTQB test design techniques
- [ ] Discuss risk-based testing approach
- [ ] Articulate test pyramid and its benefits
- [ ] Explain difference between BDD and TDD
- [ ] Describe defect management process
- [ ] Give one STAR format test strategy example

**Next Step:** Practice answering interview questions in `02-interview-questions.md`
