# Day 3: Daily Checklist - Postman + RESTful API Testing

## Date: ________________

## Morning Session (9:00 AM - 12:00 PM)

### Technical Learning (90 minutes)

- [ ] **Read Core Concepts Document** (45 min)
  - [x] RESTful API fundamentals and 6 constraints
  - [x] HTTP methods deep dive (GET, POST, PUT, PATCH, DELETE)
  - [x] HTTP status codes (2xx, 4xx, 5xx)
  - [x] Authentication mechanisms (API Key, Bearer Token, OAuth 2.0)

- [x] **Review Postman Advanced Features** (45 min)
  - [x] Environment variables and scopes
  - [x] Pre-request scripts
  - [x] Test scripts with assertions
  - [x] Collection Runner
  - [x] Data-driven testing

**Self-Assessment Questions:**
1. Can I explain what makes an API "RESTful"? (Yes/No) ____
2. Do I understand the difference between PUT and PATCH? (Yes/No) ____
3. Can I list 5 HTTP status codes and their meanings? (Yes/No) ____
4. Do I know how Bearer token authentication works? (Yes/No) ____

---

### Hands-On Practice (90 minutes)

- [x] **Create Postman Collection** (60 min)
  - [x] Create new collection: "BASF Interview - JSONPlaceholder API Tests"
  - [x] Add GET request: Retrieve all users
  - [x] Add GET request: Retrieve single user
  - [x] Add POST request: Create user with dynamic data
  - [x] Add PUT request: Update entire user
  - [x] Add PATCH request: Partial update
  - [x] Add DELETE request: Remove user
  - [x] Add requests for posts and comments

- [x] **Add Test Scripts** (30 min)
  - [x] Status code validation for each request
  - [x] Response schema validation (at least 2 requests)
  - [x] Response time assertions
  - [x] Business logic validations
  - [x] Collection-level common tests

**Verification:**
- [x] All requests run successfully in Postman
- [x] All tests pass
- [x] Total request count: _____ (target: 15+)
- [x] Total test assertions: _____ (target: 30+)

---

## Afternoon Session (2:00 PM - 5:00 PM)

### Interview Preparation (60 minutes)

- [ ] **Read Interview Questions Document**
  - [x] Question 1: What is RESTful API? ✓
  - [x] Question 2: How do you validate API responses? ✓
  - [x] Question 3: PUT vs PATCH difference ✓
  - [x] Question 4: Authentication handling ✓
  - [x] Question 5: Error scenario testing ✓
  - [x] Question 6: CI/CD integration ✓
  - [x] Question 7: Data-driven testing ✓
  - [x] Question 8: Performance testing ✓
  - [x] Question 9: Rate limiting testing ✓
  - [x] Question 10: Test maintainability ✓

- [ ] **Prepare Your Own Answers** (Write for 3 questions)
  1. Question #___: ________________________________
  2. Question #___: ________________________________
  3. Question #___: ________________________________

---

### Newman CLI Integration (45 minutes)

- [x] **Install Newman**
  ```bash
  npm install -g newman
  npm install -g newman-reporter-html
  newman --version  # Verify installation
  ```

- [x] **Export and Run Collection**
  - [x] Export Postman collection as JSON
  - [x] Export environment as JSON
  - [x] Run basic Newman command
  - [x] Generate HTML report
  - [x] Review report for failures

**Newman Commands Executed:**
```bash
# Command 1:
_____________________________________________

# Command 2:
_____________________________________________
```

**Results:**
- Total requests executed: _____
- Passed tests: _____
- Failed tests: _____
- Average response time: _____ ms

---

### English Communication Practice (60 minutes)

- [ ] **5-Minute Presentation Preparation** (30 min)
  - Topic: "API Testing Best Practices in CI/CD"
  - [ ] Write outline (Introduction, Strategy, Implementation, Results)
  - [ ] Practice delivery once (time yourself)
  - [ ] Record yourself delivering it

- [ ] **Practice Interview Answers** (30 min)
  - [ ] Record answer to Question 2 (validate API responses)
  - [ ] Record answer to Question 6 (CI/CD integration)
  - [ ] Listen to recordings and note improvements

**Audio Recordings Created:**
- [ ] 5-minute presentation: _____________.mp3/.m4a
- [ ] Interview Q&A practice: _____________.mp3/.m4a

---

## End of Day Assessment

### Technical Skills (Rate 1-5, where 5 is expert)

| Skill | Rating | Notes |
|-------|--------|-------|
| RESTful API principles | ___/5 | |
| HTTP methods usage | ___/5 | |
| Postman Collection creation | ___/5 | |
| Test script writing | ___/5 | |
| Schema validation | ___/5 | |
| Newman CLI usage | ___/5 | |
| Authentication testing | ___/5 | |
| Error scenario testing | ___/5 | |

**Areas needing more practice:**
_____________________________________________________________
_____________________________________________________________

---

### English Communication (Rate 1-5, where 5 is fluent)

| Skill | Rating | Notes |
|-------|--------|-------|
| Explaining RESTful concepts | ___/5 | |
| Describing API testing projects | ___/5 | |
| Using technical vocabulary correctly | ___/5 | |
| STAR format answers | ___/5 | |
| Overall speaking confidence | ___/5 | |

**Pronunciation challenges:**
_____________________________________________________________
_____________________________________________________________

---

### Completed Artifacts

- [x] Postman Collection (15+ requests): ✓ / ✗
- [x] Newman HTML report generated: ✓ / ✗
- [x] 3 written interview answers: ✓ / ✗
- [x] 5-minute presentation recorded: ✓ / ✗
- [x] 2 Q&A recordings: ✓ / ✗

**Files Created Today:**
1. _____________________________________.postman_collection.json
2. _____________________________________.postman_environment.json
3. newman-report-________________________________.html
4. presentation-________________________________.mp3
5. interview-qa-________________________________.mp3

---

## Key Takeaways from Today

### Top 3 Technical Concepts Learned:
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________

### Top 3 Interview Points to Remember:
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________

### Key English Phrases Mastered:
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________

---

## Challenges Faced Today

**Challenge 1:**
- Problem: _____________________________________________________
- Solution: _____________________________________________________

**Challenge 2:**
- Problem: _____________________________________________________
- Solution: _____________________________________________________

---

## Tomorrow's Preparation (Day 4)

### Preview Day 4 Topics:
- [ ] CI/CD pipeline deep dive
- [ ] Jenkins/GitLab CI/GitHub Actions
- [ ] Docker containerization
- [ ] DevOps best practices

### Pre-work for Day 4:
- [ ] Ensure Docker is installed (if practicing locally)
- [ ] Review Git basics (branches, commits, pull requests)
- [ ] Think about CI/CD projects you can discuss

---

## Daily Reflection

### What went well today?
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

### What could I improve tomorrow?
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

### Energy level today (1-10): _____/10

### Confidence level for interview (1-10): _____/10

### Hours spent studying today: _____ hours

---

## Tomorrow's Goals

### Must Complete:
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________

### Nice to Have:
1. _____________________________________________________________
2. _____________________________________________________________

---

## Interview Readiness Check

After Day 3, I can confidently:

- [x] Explain RESTful API principles in English
- [x] Describe how I validate API responses
- [x] Discuss authentication testing strategies
- [x] Explain Newman CLI integration
- [x] Give examples of data-driven testing
- [x] Describe error scenario testing approach
- [x] Talk about API performance testing
- [x] Discuss test maintainability practices

**Overall Day 3 Readiness: _____/10**

---

## Notes and Ideas

_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## Action Items for Later Review

- [ ] ________________________________________________________
- [ ] ________________________________________________________
- [ ] ________________________________________________________

---

**Remember:**
- API testing is about contracts—ensure your tests validate both success and failure scenarios
- Practice explaining technical concepts out loud, not just in your head
- Record yourself—it's uncomfortable but incredibly valuable for improvement
- Newman integration is a key differentiator—make sure you can demo it confidently

**Tomorrow we focus on CI/CD pipelines and DevOps practices!**

---

## Signature: _________________ Date: _________________

**Day 3 Complete!** ✓

*Keep this checklist for interview preparation review. Your progress is evidence of commitment and thoroughness—qualities that BASF values in QA engineers.*
