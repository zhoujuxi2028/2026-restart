# Day 7: Interview Questions - Testing Methodologies + ISTQB

## Overview
This file contains 12 high-frequency interview questions covering STLC, BDD, OOP, ISTQB, and test strategy. For detailed concept explanations, see `01-testing-methodologies-istqb-concepts.md`.

---

## STLC and BDD Questions (1-4)

### Q1: Explain the Software Testing Life Cycle (STLC). What are the key phases and activities?

**Key Points:**
- Six phases: Requirement Analysis → Test Planning → Test Case Development → Environment Setup → Test Execution → Test Closure
- Each phase has entry/exit criteria and deliverables
- Shift-left principle: Start testing early
- Runs parallel to SDLC, not after it

**Example Answer:**
"STLC has six phases. First, Requirement Analysis where we review requirements for testability. Second, Test Planning where we define strategy and scope. Third, Test Case Development where we write tests and automation scripts. Fourth, Environment Setup where we prepare infrastructure. Fifth, Test Execution where we run tests and log defects. Sixth, Test Closure where we create reports and document lessons learned. Each phase has specific entry and exit criteria to ensure quality gates are met."

---

### Q2: What is BDD? How does it differ from TDD?

**Key Points:**
- BDD = Behavior-Driven Development (collaboration focused)
- Uses Gherkin syntax (Given-When-Then)
- Three Amigos: Dev, QA, Business
- TDD = Test-Driven Development (technical focused)
- BDD: Business behavior in plain English
- TDD: Technical implementation in unit tests

**Example Scenario:**
```gherkin
Scenario: Successful login
  Given the user is on the login page
  When the user enters valid credentials
  Then the user should see the dashboard
```

---

### Q3: Walk me through writing a BDD scenario for a feature.

**Process:**
1. **Discovery**: Three Amigos session
2. **Examples**: Discuss concrete scenarios
3. **Gherkin**: Write Feature, Scenario, Given-When-Then
4. **Coverage**: Happy path, errors, edge cases
5. **Automation**: Implement step definitions

**Best Practices:**
- Declarative (what, not how)
- Business language
- Independent scenarios
- Single responsibility per scenario

See `03-methodology-examples/bdd-scenarios.feature` for detailed examples.

---

### Q4: How does STLC integrate with Agile/Scrum?

**Integration:**
- Sprint Planning: Requirement Analysis + Test Planning
- Early Sprint: Test Case Development (parallel with dev)
- Mid Sprint: Test Execution (continuous)
- Late Sprint: Final testing + Closure
- Retrospective: Lessons learned

**Key Differences:**
- Compressed timeline (2-week sprints vs months)
- Lightweight documentation (BDD scenarios vs heavy test plans)
- Continuous testing (not a phase)
- Definition of Done includes testing

---

## OOP and Framework Design Questions (5-8)

### Q5: Explain Page Object Model (POM). Why is it important?

**Concept:**
- Design pattern separating test logic from page structure
- Each page = class with elements and actions
- Tests use high-level methods, not raw selectors

**Benefits:**
- **Maintainability**: Update locator once, not in every test
- **Reusability**: Page objects used across multiple tests
- **Readability**: Tests read like plain English
- **Separation**: Test logic separate from UI details

**Example:**
```javascript
// Instead of: cy.get('#username').type('user')
// Use: loginPage.enterUsername('user')
```

See `03-methodology-examples/page-object-example.js` for complete implementation.

---

### Q6: How do you design a test automation framework from scratch?

**Architecture:**
1. **Layered Structure**: Tests → Page Objects → Utilities → Config
2. **Design Patterns**: POM, Factory, Singleton, Builder, Strategy
3. **Organization**: Clear folders, naming conventions
4. **Configuration**: Environment-based config management
5. **CI/CD Ready**: Pipeline integration
6. **Documentation**: README, contribution guide

**Principles:**
- SOLID principles
- DRY (Don't Repeat Yourself)
- Separation of concerns
- Scalability and maintainability

**Real Impact:**
"Framework I designed was adopted by 5 teams, reduced onboarding from 1 week to 1 day, and scaled from 100 to 500+ tests."

---

### Q7: What design patterns do you use besides POM?

**Key Patterns:**

1. **Factory**: Create test data objects
   ```javascript
   UserFactory.createAdmin()
   UserFactory.createBulkUsers(50)
   ```

2. **Singleton**: Single config/logger instance
   ```javascript
   ConfigManager.getInstance()
   ```

3. **Strategy**: Interchangeable algorithms (data sources)
   ```javascript
   DataLoader.setStrategy(new APIDataStrategy())
   ```

4. **Builder**: Complex object construction
   ```javascript
   new OrderBuilder()
     .withCustomer(user)
     .addItems(products)
     .build()
   ```

5. **Facade**: Simplify complex subsystems
   ```javascript
   TestDataFacade.setupTestEnvironment()
   ```

---

### Q8: How do you ensure framework maintainability and scalability?

**Strategies:**

1. **Architecture**: Separation of concerns, DRY, SOLID
2. **Organization**: Clear folder structure, consistent naming
3. **Locators**: Stable selectors (data-cy attributes)
4. **Independence**: No test dependencies
5. **Configuration**: Environment-based configs
6. **Documentation**: Comprehensive README, code comments
7. **Metrics**: Track flakiness, maintenance time, coverage
8. **Refactoring**: Regular code reviews, remove obsolete tests

**Result:**
"Test maintenance time reduced from 5-10 hours/week to 1-2 hours/week. Flakiness dropped from 15% to 3%."

---

## ISTQB and Test Strategy Questions (9-12)

### Q9: Explain key ISTQB test design techniques with examples.

**Techniques:**

1. **Equivalence Partitioning**
   - Divide inputs into partitions, test one from each
   - Example: Age 18-65 → Test 15 (invalid), 30 (valid), 70 (invalid)

2. **Boundary Value Analysis**
   - Test at boundaries
   - Example: Age 18-65 → Test 17, 18, 19, 64, 65, 66

3. **Decision Table Testing**
   - Test condition combinations
   - Example: Discount rules (member Y/N × total >= $100 Y/N = 4 combinations)

4. **State Transition Testing**
   - Test state changes
   - Example: Order: Created → Paid → Shipped → Delivered

5. **Error Guessing**
   - Based on experience, guess error-prone areas
   - Example: SQL injection, empty fields, special characters

**Real Impact:**
"Using BVA and equivalence partitioning, found 3 edge case bugs in payment form that manual testing missed."

---

### Q10: Describe your approach to test strategy and planning.

**Approach:**

1. **Risk Assessment**: Prioritize by (Business Impact × Complexity)
   - High risk: Payment processing, user data
   - Low risk: About Us page, help tooltips

2. **Test Pyramid**: 60% Unit, 30% API, 10% E2E
   - Most tests at unit level (fast, cheap)
   - Fewest at E2E (slow, expensive)

3. **Automation Strategy**: 80% automated, 20% manual
   - Automate: Regressions, critical paths, API contracts
   - Manual: Exploratory, usability, one-time tests

4. **Entry/Exit Criteria**: Clear definitions
   - Entry: Build deployed, environment stable, test data ready
   - Exit: 95%+ pass rate, zero P1 bugs, stakeholder sign-off

5. **Test Environment**: Docker-based for consistency

6. **Metrics**: Track pass rate, coverage, flakiness, defect leakage

See `03-methodology-examples/test-plan-template.md` for detailed structure.

---

### Q11: How do you measure test effectiveness? What metrics do you track?

**Key Metrics:**

**Execution:**
- Pass Rate: > 95% target
- Flakiness: < 5% target
- Execution Time: < 15 min target (parallelized)

**Quality:**
- Defect Detection Effectiveness: > 90% bugs found in testing
- Defect Leakage: < 10% bugs escape to production
- Defect Density: Defects per 1000 LOC

**Coverage:**
- Code Coverage: 80%+ (unit tests)
- Requirements Coverage: 100%
- Automation Coverage: 75-85%

**Efficiency:**
- Test Maintenance Time: < 2 hours/week
- ROI: (Time Saved - Dev Cost) / Dev Cost × 100%
- Test Development Velocity: Tests created per sprint

**Business:**
- Release Frequency: Deployments per month
- Mean Time to Detect: Hours from bug introduction to detection
- Customer Satisfaction: CSAT score correlation

**Dashboard Example:**
```
Sprint 42 Metrics
- Tests: 500 (485 passed, 97%)
- Flaky: 5 (1%)
- Defects Found: 18 (2 P1, 5 P2, 11 P3)
- Defect Leakage: 0% (zero production bugs)
- Execution Time: 12 minutes
```

---

### Q12: How do you balance automation with manual/exploratory testing?

**Balanced Approach (80/20 Rule):**
- 80% Automated: Critical paths, regressions, API contracts
- 20% Manual: Exploratory, usability, creative testing

**Decision Matrix:**
| Factor | Automate | Manual |
|--------|----------|--------|
| Frequency | Runs often (every PR) | Rarely (one-time) |
| Stability | Stable feature | Changing feature |
| Complexity | Clear pass/fail | Requires judgment |
| Value | High business impact | Low impact |
| Time | Time-consuming | Quick to test |
| ROI | Savings > cost | Manual faster |

**Test Pyramid:**
```
        E2E (10%)        ← Few, slow, expensive
      API (30%)          ← Moderate speed/cost
    Unit (60%)           ← Many, fast, cheap
```

**Exploratory Testing:**
- Dedicate 2-3 hours per sprint
- Structured sessions with charters
- Focus: Usability, UX, edge cases, creative scenarios

**Collaboration:**
- Automation enables manual (frees up time)
- Manual informs automation (bugs → regression tests)

**Real Example:**
"For e-commerce checkout: 75% automated (critical paths, API contracts), 25% manual (exploratory usability testing). Automation caught 85% of bugs, manual caught 15% (mostly UX issues)."

---

## Summary and Practice

### Quick Reference

**STLC Phases (6):**
1. Requirement Analysis
2. Test Planning
3. Test Case Development
4. Environment Setup
5. Test Execution
6. Test Closure

**BDD Keywords:**
- Feature, Scenario, Given, When, Then, And, But, Background, Scenario Outline, Examples

**POM Benefits:**
- Maintainability, Reusability, Readability, Separation of Concerns

**ISTQB Techniques (5):**
1. Equivalence Partitioning
2. Boundary Value Analysis
3. Decision Table Testing
4. State Transition Testing
5. Error Guessing

**Test Pyramid:**
- 60% Unit
- 30% API/Integration
- 10% E2E

### Practice Checklist

- [ ] Explain STLC in 2 minutes (record)
- [ ] Write 3 Gherkin scenarios
- [ ] Describe POM benefits in 1 minute
- [ ] Compare BDD vs TDD in 90 seconds
- [ ] Explain 3 ISTQB techniques with examples
- [ ] Discuss test strategy approach in 3 minutes
- [ ] Answer all 12 questions without notes
- [ ] Record yourself answering 5 questions

**Time Each Answer:** 2-3 minutes average

**Tip:** Use specific examples from your experience. Quantify results when possible (percentages, time savings, bug counts).

---

**Next:** Review `04-english-templates.md` for vocabulary and `05-daily-checklist.md` to track progress.
