# Day 7: Interview Questions - Testing Methodologies + ISTQB

## STLC and BDD (Q1-Q4)

### Q1: Explain the Software Testing Life Cycle (STLC)

**Answer:**
"STLC has six phases: Requirement Analysis (review requirements for testability), Test Planning (define strategy and scope), Test Case Development (write tests and scripts), Environment Setup (prepare infrastructure), Test Execution (run tests and log defects), Test Closure (create reports and document lessons learned). Each phase has entry/exit criteria to ensure quality gates are met."

---

### Q2: What is BDD? How does it differ from TDD?

**Key Points:**
- BDD = Behavior-Driven Development (business behavior, plain English)
- TDD = Test-Driven Development (technical implementation, unit tests)
- BDD: Dev + QA + Business collaborate using Gherkin
- TDD: Developers write tests before code

**Answer:**
"BDD focuses on business behavior using Gherkin syntax (Given-When-Then) with collaboration between Dev, QA, and Business. TDD focuses on technical correctness with developers writing unit tests before implementation. BDD is for 'what' the system should do, TDD is for 'how' code should work. They're complementary, not competing."

---

### Q3: Walk me through writing a BDD scenario

**Process:**
1. Three Amigos session - discuss requirements
2. Identify concrete examples (happy path + edge cases)
3. Write Gherkin: Feature → Scenario → Given-When-Then
4. Implement step definitions and automate

**Example:**
```gherkin
Scenario: Successful login
  Given the user is on the login page
  When the user enters valid credentials
  Then the user should see the dashboard
```

---

### Q4: How does STLC integrate with Agile?

**Answer:**
"In Agile, STLC is compressed into sprints. Requirement Analysis and Test Planning happen during sprint planning. Test Case Development occurs parallel with development. Test Execution is continuous throughout the sprint. Test Closure happens at sprint end with retrospectives. The key difference is lightweight documentation (BDD scenarios vs heavy test plans) and continuous testing instead of a separate phase."

---

## OOP and Framework Design (Q5-Q8)

### Q5: Explain Page Object Model (POM)

**Concept:**
Design pattern separating test logic from page structure. Each page = class with elements and actions.

**Benefits:**
- **Maintainability**: Update locator once
- **Reusability**: Page objects used across tests
- **Readability**: Tests read like plain English
- **Separation**: Test logic separate from UI

**Example:**
```javascript
// Instead of: cy.get('#username').type('user')
// Use: loginPage.enterUsername('user')
```

---

### Q6: How do you design a test automation framework?

**Architecture:**
1. **Layered Structure**: Tests → Page Objects → Utilities → Config
2. **Design Patterns**: POM, Factory, Singleton
3. **Organization**: Clear folders and naming
4. **Configuration**: Environment-based configs
5. **CI/CD Ready**: Pipeline integration

**Principles**: SOLID, DRY, Separation of Concerns

---

### Q7: What design patterns do you use besides POM?

**Key Patterns:**
1. **Factory**: Create test data objects (`UserFactory.createAdmin()`)
2. **Singleton**: Single config/logger instance (`ConfigManager.getInstance()`)
3. **Strategy**: Interchangeable data sources (JSON vs API)
4. **Builder**: Complex object construction (OrderBuilder)

---

### Q8: How do you ensure framework maintainability?

**Strategies:**
1. Separation of concerns, DRY, SOLID
2. Stable selectors (data-cy attributes)
3. Test independence
4. Environment-based configs
5. Documentation and code reviews
6. Track metrics (flakiness, maintenance time)

---

## ISTQB and Test Strategy (Q9-Q12)

### Q9: Explain ISTQB test design techniques

**1. Equivalence Partitioning**
- Divide inputs into groups, test one from each
- Example: Age 18-65 → Test 15 (invalid), 30 (valid), 70 (invalid)

**2. Boundary Value Analysis**
- Test at boundaries
- Example: Age 18-65 → Test 17, 18, 19, 64, 65, 66

**3. Decision Table Testing**
- Test condition combinations
- Example: Discount rules (member Y/N × total ≥$100 Y/N = 4 tests)

**4. State Transition Testing**
- Test state changes
- Example: Order states (Created → Paid → Shipped → Delivered)

---

### Q10: Describe your test strategy approach

**Approach:**
1. **Risk Assessment**: Prioritize by Business Impact × Complexity
   - High risk: Payment, user data → Extensive testing
   - Low risk: About page → Minimal testing

2. **Test Pyramid**: 60% Unit, 30% API, 10% E2E
   - Most tests fast and cheap (unit level)
   - Fewest slow and expensive (E2E)

3. **Automation Strategy**: 80% automated, 20% manual
   - Automate: Regressions, critical paths, API
   - Manual: Exploratory, usability

4. **Entry/Exit Criteria**:
   - Entry: Build deployed, environment stable, test data ready
   - Exit: 95%+ pass rate, zero P1 bugs, stakeholder sign-off

5. **Metrics**: Track pass rate, coverage, flakiness, defect leakage

---

### Q11: What test metrics do you track?

**Key Metrics:**

**Execution:**
- Pass Rate: >95% target
- Flakiness: <5% target
- Execution Time: <15 min (parallelized)

**Quality:**
- Defect Detection Effectiveness: >90%
- Defect Leakage: <10% (production bugs)
- Defect Density: Defects per 1000 LOC

**Coverage:**
- Code Coverage: 80%+ (unit tests)
- Requirements Coverage: 100%
- Automation Coverage: 75-85%

**Efficiency:**
- Test Maintenance Time: <2 hours/week
- ROI: (Time Saved - Dev Cost) / Dev Cost

---

### Q12: How do you balance automation with manual testing?

**80/20 Rule:**
- 80% Automated: Critical paths, regressions, API
- 20% Manual: Exploratory, usability

**Decision Matrix:**
| Factor | Automate | Manual |
|--------|----------|--------|
| Frequency | Runs often | Rarely |
| Stability | Stable feature | Changing |
| Complexity | Clear pass/fail | Requires judgment |
| ROI | Savings > cost | Manual faster |

**Test Pyramid:**
- 60% Unit (many, fast, cheap)
- 30% API (moderate)
- 10% E2E (few, slow, expensive)

**Collaboration:**
- Automation frees time for manual exploratory testing
- Manual testing finds bugs that become automated regression tests

---

## Practice Checklist

- [ ] Explain STLC in 2 minutes (record)
- [ ] Write 3 Gherkin scenarios
- [ ] Describe POM benefits in 1 minute
- [ ] Compare BDD vs TDD in 90 seconds
- [ ] Explain 3 ISTQB techniques with examples
- [ ] Discuss test strategy in 3 minutes
- [ ] Answer all 12 questions without notes
- [ ] Record yourself answering 5 questions

**Time Each Answer**: 2-3 minutes
**Tip**: Use specific examples and quantify results (%, time savings, bug counts)
