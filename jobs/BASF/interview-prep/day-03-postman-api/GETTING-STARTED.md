# Getting Started - Day 3: Postman + RESTful API Testing

## Quick Start Guide

Welcome to Day 3! Today you'll master Postman and RESTful API testing, preparing you to confidently discuss API automation in English during your BASF interview.

## What You'll Accomplish Today

By the end of Day 3, you will:
- ✅ Create a production-ready Postman Collection with 20+ requests
- ✅ Master Pre-request Scripts and Test Scripts
- ✅ Run tests using Newman CLI
- ✅ Prepare 10 API testing interview questions in English
- ✅ Record a 5-minute presentation on API testing strategies

## Prerequisites

### Software Setup
```bash
# 1. Install Postman (if not already installed)
# Download from: https://www.postman.com/downloads/

# 2. Install Node.js (for Newman)
# Download from: https://nodejs.org/

# 3. Install Newman CLI
npm install -g newman
npm install -g newman-reporter-html

# 4. Verify installation
newman --version
```

### Postman Account Setup
1. Create a free Postman account at https://www.postman.com
2. This allows you to:
   - Sync collections across devices
   - Collaborate with teams (good interview talking point!)
   - Use Postman API for CI/CD integration

## Step-by-Step Learning Path

### Phase 1: Understand Concepts (90 minutes)

#### Step 1: Read Core Concepts (45 min)
```bash
# Read the concepts document
cat 01-postman-restful-concepts.md
```

**Focus Areas:**
- RESTful API design principles (6 constraints)
- HTTP methods and when to use each
- Status codes (2xx, 4xx, 5xx) and their meanings
- Authentication mechanisms (API Key, Bearer Token, OAuth 2.0)

**Self-Check Questions:**
- Can I explain what makes an API "RESTful"?
- Do I understand the difference between PUT and PATCH?
- Can I list 5 common HTTP status codes and their meanings?

#### Step 2: Review Interview Questions (45 min)
```bash
# Study interview Q&A
cat 02-interview-questions.md
```

**Action Items:**
- Read all 10 questions
- Understand the STAR format answers
- Write your own version of 3 answers based on your experience
- Practice saying answers out loud in English

### Phase 2: Hands-On Practice (90 minutes)

#### Step 3: Create Your Postman Collection (60 min)

**Using JSONPlaceholder API (no auth required):**

1. **Open Postman and create a new Collection**
   - Name: "BASF Interview - JSONPlaceholder API Tests"
   - Add description in English

2. **Create requests for all CRUD operations:**
   ```
   GET    /posts          - Retrieve all posts
   GET    /posts/1        - Retrieve single post
   POST   /posts          - Create new post
   PUT    /posts/1        - Update entire post
   PATCH  /posts/1        - Partial update
   DELETE /posts/1        - Delete post
   GET    /posts/1/comments - Nested resource
   GET    /users/1        - Related resource
   ```

3. **Add Tests to each request:**
   ```javascript
   // Example for GET /posts
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });

   pm.test("Response is an array", function () {
       pm.expect(pm.response.json()).to.be.an('array');
   });

   pm.test("Response time is less than 500ms", function () {
       pm.expect(pm.response.responseTime).to.be.below(500);
   });
   ```

4. **Set up Environment Variables:**
   - Create environment: "JSONPlaceholder - Dev"
   - Add variables:
     - `baseUrl`: https://jsonplaceholder.typicode.com
     - `userId`: 1
     - `postId`: 1

5. **Use variables in requests:**
   ```
   {{baseUrl}}/posts/{{postId}}
   ```

#### Step 4: Add Advanced Features (30 min)

**Pre-request Scripts:**
```javascript
// Generate timestamp
pm.environment.set("timestamp", new Date().toISOString());

// Generate random test data
pm.environment.set("randomTitle", "Test Post " + Math.random().toString(36).substring(7));
```

**Collection-level Tests:**
```javascript
// Set in Collection's Tests tab (runs after every request)
pm.test("Response has correct content-type", function () {
    pm.response.to.have.header("Content-Type");
});
```

**Data-driven Testing:**
1. Create CSV file: `test-data.csv`
   ```csv
   userId,title,body
   1,Test Post 1,This is test body 1
   2,Test Post 2,This is test body 2
   ```

2. Use in request body:
   ```json
   {
       "userId": {{userId}},
       "title": "{{title}}",
       "body": "{{body}}"
   }
   ```

### Phase 3: Newman CLI Integration (45 minutes)

#### Step 5: Export and Run with Newman (30 min)

**Export Collection:**
1. In Postman: Collection → Export → Collection v2.1
2. Save as: `BASF-JSONPlaceholder-Collection.json`

**Export Environment:**
1. In Postman: Environments → Export
2. Save as: `JSONPlaceholder-Dev.json`

**Run with Newman:**
```bash
# Basic run
newman run BASF-JSONPlaceholder-Collection.json \
    -e JSONPlaceholder-Dev.json

# With HTML report
newman run BASF-JSONPlaceholder-Collection.json \
    -e JSONPlaceholder-Dev.json \
    -r html \
    --reporter-html-export newman-report.html

# With data-driven testing
newman run BASF-JSONPlaceholder-Collection.json \
    -d test-data.csv \
    -r html
```

**Interview Talking Point:**
> "I integrated Postman collections into our CI/CD pipeline using Newman. This allows us to run API tests automatically on every commit, ensuring API contracts are validated before deployment."

#### Step 6: Review Generated Reports (15 min)

Open `newman-report.html` and analyze:
- Total requests and test results
- Response times and failure patterns
- Which tests passed/failed

**Practice explaining in English:**
> "The Newman HTML report shows that we executed 20 API requests with 45 test assertions. All tests passed with an average response time of 250ms. This gives us confidence in the API stability."

### Phase 4: English Communication (60 minutes)

#### Step 7: Prepare Interview Answers (30 min)

**Work through these questions out loud:**
1. "How do you validate API response schemas?"
2. "Explain your approach to API authentication testing"
3. "How do you handle test data management in API testing?"

**Record yourself answering one question** (save as audio file)

#### Step 8: Prepare 5-Minute Presentation (30 min)

**Topic: "API Testing Best Practices in CI/CD"**

**Structure:**
1. Introduction (30 sec)
   - "Today I'll share my approach to API testing automation"

2. Testing Strategy (2 min)
   - What: RESTful API testing with Postman
   - Why: Ensure API contracts, catch regressions early
   - How: Automated collection runs in CI/CD

3. Technical Implementation (2 min)
   - Postman Collections with Test Scripts
   - Newman CLI integration
   - Environment management

4. Results & Benefits (30 sec)
   - Quantify improvements (e.g., "reduced API bugs by 60%")
   - Team impact

**Write your script** in the templates document.

**Practice delivering it** - time yourself!

### Phase 5: Complete Checklist (15 minutes)

#### Step 9: Self-Assessment
```bash
# Open and complete
cat 05-daily-checklist.md
```

**Rate yourself (1-5 scale) on:**
- Technical concepts mastered
- Hands-on practice completed
- English fluency for each topic
- Overall confidence level

## Common Issues & Solutions

### Issue 1: Newman Not Found
```bash
# Solution: Install Newman globally
npm install -g newman

# Verify installation
newman --version
```

### Issue 2: CORS Errors in Postman
**Solution:** CORS errors only occur in browsers. Postman doesn't have CORS restrictions, so you won't encounter this issue.

### Issue 3: Authentication Failures
**Interview Tip:** Explain how you debug auth issues:
> "When I encounter 401 errors, I first check if the token is correctly set in headers. I use Postman Console to inspect the actual request being sent, verify token expiration, and ensure the environment variables are properly configured."

## Success Checklist

Before moving to Day 4, ensure:
- [ ] Created a Postman Collection with 20+ requests
- [ ] Added Test Scripts to validate responses
- [ ] Used environment variables for configuration
- [ ] Successfully ran collection with Newman CLI
- [ ] Generated HTML report
- [ ] Prepared answers to 10 interview questions in English
- [ ] Recorded yourself explaining Newman integration (2+ min)
- [ ] Can explain RESTful principles in English fluently

## Tips for Interview Success

### When Discussing API Testing:

**DO:**
- ✅ Mention specific status codes (200, 201, 400, 401, 404, 500)
- ✅ Explain how you validate both positive and negative scenarios
- ✅ Discuss CI/CD integration with Newman
- ✅ Mention schema validation importance
- ✅ Give quantifiable results (e.g., "tested 50+ endpoints")

**DON'T:**
- ❌ Say "I just test if the API works"
- ❌ Forget to mention error handling tests
- ❌ Skip discussing authentication testing
- ❌ Ignore performance considerations

### Key Phrases to Practice:

```
"I implemented comprehensive API testing using Postman Collections..."

"We validate response schemas to ensure API contract compliance..."

"Newman CLI integration allows us to run API tests in our CI/CD pipeline..."

"I test various scenarios including authentication failures, rate limiting, and error handling..."

"Our API test suite covers CRUD operations, authorization checks, and data validation..."
```

## Time Management

**If you're running short on time:**
- **Minimum**: Complete Steps 1-3, 5, and 9 (core concepts + one working example)
- **Priority**: Focus on Newman CLI usage - it's a key interview differentiator

**If you have extra time:**
- Practice with additional APIs (ReqRes, OpenWeatherMap)
- Create a second collection with authentication
- Write a blog post explaining your approach (great portfolio piece!)

## Next Steps

After completing Day 3:
1. Export your collection and save it for your portfolio
2. Take screenshots of Newman reports for interview discussion
3. Write a brief summary (in English) of what you accomplished
4. Review your recorded audio/video and identify improvement areas

Tomorrow (Day 4) we'll integrate everything into CI/CD pipelines with Jenkins, GitLab CI, and Docker!

---

**Questions?** Review the concepts document or search Postman Learning Center.

**Ready?** Let's build some amazing API tests! 🚀
