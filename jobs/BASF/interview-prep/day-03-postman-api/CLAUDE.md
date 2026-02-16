# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Day 3 materials for BASF QA Automation Engineer interview preparation, focusing on Postman + RESTful API testing + Newman CLI integration. This is part of a 10-day intensive preparation plan (see parent directory `jobs/BASF/7133.md`).

**Primary Language**: English (all interview-facing materials)
**Time Allocation**: 3-4 hours of structured learning
**Core Skills**: Postman Collections, Newman CLI, RESTful API principles, API testing strategies

## Directory Structure

```
day-03-postman-api/
├── README.md                              # Learning objectives, time allocation, success criteria
├── GETTING-STARTED.md                     # Step-by-step learning path (90 min concepts + 90 min hands-on + 60 min English)
├── 01-postman-restful-concepts.md         # RESTful principles, HTTP methods, status codes, authentication
├── 02-interview-questions.md              # 10 high-frequency API testing Q&A with STAR format answers
├── 03-postman-collection-examples.json    # Production-ready Postman Collection (20+ requests)
├── 04-english-templates.md                # Communication templates, technical vocabulary, presentation scripts
├── 05-daily-checklist.md                  # Progress tracking and self-assessment
├── fixtures/
│   ├── test-data.csv                      # Data-driven test data for Newman
│   └── test-users.json                    # User test data fixtures
└── newman-report.html                     # Generated HTML test report (not in version control)
```

## Common Commands

### Newman CLI - Running Postman Collections from Command Line

```bash
# Install Newman and HTML reporter
npm install -g newman
npm install -g newman-reporter-html

# Verify installation
newman --version

# Basic test execution
newman run 03-postman-collection-examples.json

# With environment variables (if you export an environment file from Postman)
newman run 03-postman-collection-examples.json -e environment.json

# Generate HTML report
newman run 03-postman-collection-examples.json \
    -r html \
    --reporter-html-export newman-report.html

# Data-driven testing using CSV file
newman run 03-postman-collection-examples.json \
    -d fixtures/test-data.csv \
    -r html

# CI/CD integration with timeout and fail-fast
newman run 03-postman-collection-examples.json \
    --timeout-request 10000 \
    --bail \
    -r html
```

### Postman Collection Usage

**Import Collection:**
1. Open Postman
2. Import → Upload Files → Select `03-postman-collection-examples.json`
3. Create environment with these variables:
   - `baseUrl`: https://jsonplaceholder.typicode.com
   - `userId`: 1
   - `postId`: 1

**Run Collection:**
- Interactive: Collection → Run → Configure iterations and data file
- Automated: Use Newman CLI commands above

## Key Architecture Patterns

### Postman Collection Structure

The `03-postman-collection-examples.json` demonstrates interview-critical patterns:

**1. Collection-Level Scripts**
- **Pre-request Scripts**: Run before every request
  - Generate timestamps for dynamic data
  - Set environment variables
  - Add default headers
- **Test Scripts**: Run after every response
  - Common assertions (Content-Type, response time)
  - Global test counters

**2. Request Organization**
Grouped by functionality:
- **Users**: CRUD operations on user resources
- **Posts**: Blog post management with nested comments
- **Authentication**: Token-based auth flow examples
- **Error Scenarios**: 400, 401, 404, 500 error handling
- **Performance**: Response time assertions

**3. Test Script Patterns**
```javascript
// Status code validation
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Response structure validation
pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
});

// Schema validation
pm.test("Response matches schema", function () {
    const schema = {
        type: "object",
        required: ["id", "name", "email"],
        properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" }
        }
    };
    pm.response.to.have.jsonSchema(schema);
});

// Performance assertions
pm.test("Response time < 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

**4. Environment Variables**
Used throughout collection for:
- Base URL configuration (`{{baseUrl}}`)
- Dynamic test data (`{{randomUserId}}`, `{{timestamp}}`)
- Authentication tokens (`{{bearerToken}}`)
- Resource IDs for chaining requests

**5. Data-Driven Testing**
- CSV file (`fixtures/test-data.csv`) with test scenarios
- Each row represents one test iteration
- Headers map to Postman variables: `username`, `email`, `role`, `expectedStatus`

### RESTful API Testing Strategy

The materials emphasize these core concepts:

**HTTP Methods Coverage:**
- `GET`: Idempotent, safe, cacheable retrieval
- `POST`: Non-idempotent resource creation (201 status)
- `PUT`: Idempotent full resource update (200 status)
- `PATCH`: Partial resource update
- `DELETE`: Idempotent resource deletion (204 status)

**Status Code Categories:**
- `2xx`: Success (200 OK, 201 Created, 204 No Content)
- `4xx`: Client errors (400 Bad Request, 401 Unauthorized, 404 Not Found)
- `5xx`: Server errors (500 Internal Server Error, 503 Service Unavailable)

**Authentication Mechanisms:**
1. API Key (query param or header)
2. Bearer Token (JWT in Authorization header)
3. Basic Auth (Base64 encoded credentials)
4. OAuth 2.0 (token exchange flow)

## Interview Preparation Context

### Key Talking Points

**When discussing Postman experience:**
- Collection organization and reusability
- Pre-request scripts for dynamic data generation
- Test script patterns (status codes, schema validation, performance)
- Environment management for multi-stage testing (dev/staging/prod)
- Newman CLI for CI/CD integration

**When discussing API testing approach:**
- Test both positive and negative scenarios
- Validate response schemas (not just status codes)
- Performance assertions (response time thresholds)
- Error handling (4xx, 5xx status codes)
- Authentication and authorization testing
- Data-driven testing for multiple scenarios

**Quantifiable metrics to mention:**
- "Created collections with 20+ requests covering all CRUD operations"
- "Reduced API testing time by 70% through Newman automation"
- "Validated 50+ API endpoints with schema validation"
- "Average response time under 500ms for all endpoints"

### STAR Format Answers

The `02-interview-questions.md` file contains 10 prepared answers following STAR format:
- **S**ituation: Context and background
- **T**ask: Your responsibility
- **A**ction: Specific steps you took
- **R**esult: Quantifiable outcome

Practice these answers out loud in English before interviews.

### Technical Vocabulary

Essential terms to use fluently:
- Schema validation, bearer token, rate limiting
- Idempotency, statelessness, cacheability
- Collection runner, pre-request script, test script
- Newman CLI, data-driven testing, environment variable
- HTTP status codes (2xx, 4xx, 5xx)

## Learning Materials Organization

### Phase 1: Concepts (90 minutes)
1. Read `01-postman-restful-concepts.md` - RESTful principles, HTTP methods, auth mechanisms
2. Study `02-interview-questions.md` - 10 Q&A with STAR format

### Phase 2: Hands-On (90 minutes)
3. Import `03-postman-collection-examples.json` into Postman
4. Run requests individually to understand test scripts
5. Use Collection Runner to execute full suite
6. Export and run with Newman CLI
7. Generate HTML report and analyze results

### Phase 3: English Communication (60 minutes)
8. Review `04-english-templates.md` - self-introduction, project descriptions
9. Prepare 5-minute "API Testing Best Practices" presentation
10. Record yourself explaining Newman integration
11. Practice answering interview questions out loud

### Phase 4: Self-Assessment (15 minutes)
12. Complete `05-daily-checklist.md` - track progress, rate confidence (1-5)

## Success Criteria

Before moving to Day 4, verify:
- [ ] Can explain RESTful API's 6 constraints in English
- [ ] Created/modified Postman Collection with test scripts
- [ ] Successfully ran collection with Newman CLI
- [ ] Generated HTML report
- [ ] Prepared answers to 10 interview questions
- [ ] Can fluently discuss API testing strategy in English
- [ ] Recorded at least 2 minutes of Newman integration explanation

## Practice API Endpoint

The collection uses **JSONPlaceholder** (https://jsonplaceholder.typicode.com):
- Free, no authentication required
- RESTful design
- Supports CRUD operations
- Realistic response formats
- Perfect for learning and demos

Key endpoints:
- `/posts` - Blog posts
- `/users` - User accounts
- `/comments` - Post comments
- `/posts/{id}/comments` - Nested resources

## CI/CD Integration Notes

Newman enables Postman collections to run in CI/CD pipelines:

**Jenkins/GitLab CI/GitHub Actions:**
```bash
# Install Newman in pipeline
npm install -g newman newman-reporter-html

# Run tests and fail build on error
newman run collection.json --bail

# Archive HTML reports as artifacts
newman run collection.json -r html --reporter-html-export reports/newman-report.html
```

**Docker Integration:**
```dockerfile
FROM postman/newman:alpine
COPY 03-postman-collection-examples.json /etc/newman/
RUN newman run /etc/newman/03-postman-collection-examples.json
```

This is a key differentiator in interviews - automated API testing in CI/CD pipelines.

## Tips for Working with These Materials

1. **Language Focus**: All materials are in English for interview readiness
2. **Recording Practice**: Use phone/computer to record yourself explaining concepts
3. **Timing**: Practice presentations with a timer (5 minutes exactly)
4. **Quantify**: Add specific metrics to your answers (percentages, numbers)
5. **Portfolio**: Export collection and Newman reports for interview portfolio
6. **Live Demo**: Be prepared to create a simple Postman request during interview

## Next Steps

Day 4 continues with CI/CD + DevOps:
- Jenkins/GitLab CI/GitHub Actions integration
- Docker containerization
- DevOps best practices
- Complete automation pipelines
