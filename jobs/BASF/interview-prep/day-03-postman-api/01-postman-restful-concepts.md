# Postman + RESTful API Testing - Core Concepts

## Table of Contents
1. [RESTful API Fundamentals](#restful-api-fundamentals)
2. [HTTP Methods Deep Dive](#http-methods-deep-dive)
3. [HTTP Status Codes](#http-status-codes)
4. [Authentication Mechanisms](#authentication-mechanisms)
5. [Postman Advanced Features](#postman-advanced-features)
6. [API Testing Strategy](#api-testing-strategy)
7. [Newman CLI Integration](#newman-cli-integration)

---

## RESTful API Fundamentals

### What is REST?

**REST** (Representational State Transfer) is an architectural style for designing networked applications. It relies on stateless, client-server communication protocol (typically HTTP).

### The 6 REST Constraints

#### 1. **Client-Server Architecture**
- **Principle**: Separation of concerns between client and server
- **Benefit**: Allows independent evolution of client and server code
- **Interview Point**: "This separation improves portability and scalability"

#### 2. **Statelessness**
- **Principle**: Each request contains all information needed to process it
- **Benefit**: Improves scalability (no session storage on server)
- **Interview Example**:
  > "In my projects, I ensure each API request includes the authentication token. The server doesn't maintain session state, which allows horizontal scaling."

#### 3. **Cacheability**
- **Principle**: Responses must define themselves as cacheable or not
- **Benefit**: Reduces load and improves performance
- **HTTP Headers**: `Cache-Control`, `ETag`, `Expires`

#### 4. **Layered System**
- **Principle**: Client cannot tell if connected directly to end server
- **Benefit**: Allows load balancers, caches, proxies
- **Testing Consideration**: Tests should work regardless of intermediate layers

#### 5. **Code on Demand (Optional)**
- **Principle**: Servers can extend client functionality
- **Example**: Sending JavaScript to be executed by client
- **Note**: Rarely used in modern APIs

#### 6. **Uniform Interface**
- **Principle**: Consistent way to interact with resources
- **Components**:
  - Resource identification via URIs
  - Resource manipulation through representations
  - Self-descriptive messages
  - HATEOAS (Hypermedia as the Engine of Application State)

### RESTful Resource Naming Best Practices

```
✅ GOOD Examples:
GET    /users              - Collection of users
GET    /users/123          - Specific user
GET    /users/123/posts    - User's posts (nested resource)
POST   /users              - Create new user
PUT    /users/123          - Update entire user
PATCH  /users/123          - Partial update
DELETE /users/123          - Delete user

❌ BAD Examples:
GET    /getUser?id=123     - Don't use verbs in URIs
POST   /users/delete       - Use DELETE method instead
GET    /user_list          - Use plural nouns
GET    /Users              - Use lowercase
```

### Interview Talking Points

**Question: "What makes an API RESTful?"**

**Answer Template:**
> "A RESTful API follows six architectural constraints. Most importantly, it uses standard HTTP methods for CRUD operations, maintains statelessness where each request is self-contained, and organizes resources using meaningful URI patterns. For example, in my testing, I validate that GET requests are idempotent, POST creates resources, PUT/PATCH updates them, and DELETE removes them. I also verify proper status codes - 200 for success, 201 for creation, 400 for bad requests, and 401 for authentication failures."

---

## HTTP Methods Deep Dive

### GET - Retrieve Resources
**Characteristics:**
- Safe (doesn't modify resources)
- Idempotent (multiple identical requests have same effect)
- Cacheable

**Test Cases:**
```javascript
// Postman Test Script
pm.test("GET /users - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("Each user has required fields", function () {
    const jsonData = pm.response.json();
    jsonData.forEach(user => {
        pm.expect(user).to.have.property('id');
        pm.expect(user).to.have.property('name');
        pm.expect(user).to.have.property('email');
    });
});
```

### POST - Create New Resources
**Characteristics:**
- Not safe (creates resources)
- Not idempotent (multiple requests create multiple resources)
- Returns 201 Created with Location header

**Test Cases:**
```javascript
// Pre-request Script: Set dynamic data
pm.environment.set("randomEmail", `user${Date.now()}@test.com`);

// Test Script
pm.test("POST /users - Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response contains created resource", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');

    // Save ID for subsequent tests
    pm.environment.set("createdUserId", jsonData.id);
});

pm.test("Location header is present", function () {
    pm.response.to.have.header("Location");
});
```

### PUT - Update Entire Resource
**Characteristics:**
- Not safe (modifies resources)
- Idempotent (multiple identical requests have same result)
- Replaces entire resource

**Test Cases:**
```javascript
// PUT requires all fields
pm.test("PUT /users/:id - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("All fields are updated", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql(pm.variables.get("updatedName"));
    pm.expect(jsonData.email).to.eql(pm.variables.get("updatedEmail"));
});
```

### PATCH - Partial Update
**Characteristics:**
- Not safe (modifies resources)
- Idempotent
- Updates only specified fields

**Test Cases:**
```javascript
// PATCH updates only provided fields
pm.test("PATCH /users/:id - Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Only specified field is updated", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.name).to.eql(pm.variables.get("patchedName"));
    // Other fields remain unchanged
});
```

### DELETE - Remove Resources
**Characteristics:**
- Not safe (removes resources)
- Idempotent (deleting same resource multiple times has same effect)
- Returns 204 No Content or 200 OK

**Test Cases:**
```javascript
pm.test("DELETE /users/:id - Status code is 204", function () {
    pm.response.to.have.status(204);
});

pm.test("Response body is empty", function () {
    pm.expect(pm.response.text()).to.be.empty;
});

// Verify deletion with GET
pm.test("GET after DELETE returns 404", function () {
    pm.sendRequest({
        url: pm.variables.get("baseUrl") + "/users/" + pm.variables.get("deletedUserId"),
        method: 'GET'
    }, function (err, response) {
        pm.expect(response.code).to.equal(404);
    });
});
```

### Idempotency Comparison Table

| Method | Safe | Idempotent | Purpose |
|--------|------|------------|---------|
| GET    | ✅   | ✅         | Retrieve resource(s) |
| POST   | ❌   | ❌         | Create new resource |
| PUT    | ❌   | ✅         | Replace entire resource |
| PATCH  | ❌   | ✅         | Partial update |
| DELETE | ❌   | ✅         | Remove resource |

---

## HTTP Status Codes

### 2xx Success
| Code | Meaning | When to Use |
|------|---------|-------------|
| 200  | OK | Successful GET, PUT, PATCH, DELETE |
| 201  | Created | Successful POST creating new resource |
| 204  | No Content | Successful DELETE with no response body |

### 4xx Client Errors
| Code | Meaning | When to Use |
|------|---------|-------------|
| 400  | Bad Request | Invalid request syntax/validation failed |
| 401  | Unauthorized | Missing or invalid authentication |
| 403  | Forbidden | Authenticated but not authorized |
| 404  | Not Found | Resource doesn't exist |
| 409  | Conflict | Resource already exists (duplicate) |
| 422  | Unprocessable Entity | Validation errors with details |
| 429  | Too Many Requests | Rate limit exceeded |

### 5xx Server Errors
| Code | Meaning | When to Use |
|------|---------|-------------|
| 500  | Internal Server Error | Unexpected server error |
| 502  | Bad Gateway | Invalid response from upstream server |
| 503  | Service Unavailable | Server temporarily unavailable |
| 504  | Gateway Timeout | Upstream server timeout |

### Testing Status Codes

```javascript
// Test Suite for Status Code Validation
pm.test("Successful request returns 2xx", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
});

pm.test("Invalid input returns 400", function () {
    // This would be in a separate request with invalid data
    pm.expect(pm.response.code).to.equal(400);
});

pm.test("Unauthorized request returns 401", function () {
    // Request without authentication token
    pm.expect(pm.response.code).to.equal(401);
});

pm.test("Non-existent resource returns 404", function () {
    pm.expect(pm.response.code).to.equal(404);
});

// Advanced: Validate error response structure
pm.test("Error response has proper structure", function () {
    if (pm.response.code >= 400) {
        const error = pm.response.json();
        pm.expect(error).to.have.property('message');
        pm.expect(error).to.have.property('status');
    }
});
```

---

## Authentication Mechanisms

### 1. API Key Authentication

**How it works:**
- Client includes API key in header or query parameter
- Server validates key against database

**Postman Configuration:**
```javascript
// Pre-request Script
pm.request.headers.add({
    key: 'X-API-Key',
    value: pm.environment.get('apiKey')
});

// Or as query parameter
pm.request.url.query.add({
    key: 'api_key',
    value: pm.environment.get('apiKey')
});
```

**Test Cases:**
```javascript
pm.test("Request with valid API key succeeds", function () {
    pm.response.to.have.status(200);
});

pm.test("Request without API key returns 401", function () {
    // Separate request without key
    pm.expect(pm.response.code).to.equal(401);
});
```

### 2. Bearer Token (JWT)

**How it works:**
- Client authenticates with credentials
- Server returns JWT token
- Client includes token in Authorization header

**Postman Configuration:**
```javascript
// Step 1: Login Request (Pre-request)
pm.sendRequest({
    url: pm.environment.get("baseUrl") + "/auth/login",
    method: 'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            username: pm.environment.get("username"),
            password: pm.environment.get("password")
        })
    }
}, function (err, response) {
    const token = response.json().token;
    pm.environment.set("bearerToken", token);
});

// Step 2: Authenticated Request
// In Authorization tab: Type = Bearer Token
// Token = {{bearerToken}}
```

**Test Cases:**
```javascript
pm.test("Login returns access token", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
    pm.expect(jsonData.token).to.be.a('string');
    pm.environment.set("bearerToken", jsonData.token);
});

pm.test("Authenticated request succeeds", function () {
    pm.expect(pm.response.code).to.equal(200);
});

pm.test("Request with expired token returns 401", function () {
    // Test token expiration handling
    pm.expect(pm.response.code).to.equal(401);
    pm.expect(pm.response.json().message).to.include('expired');
});
```

### 3. OAuth 2.0

**How it works:**
- Client redirects user to authorization server
- User grants permission
- Client receives access token

**Postman Configuration:**
```
Authorization Tab:
- Type: OAuth 2.0
- Add auth data to: Request Headers
- Grant Type: Authorization Code / Client Credentials
- Access Token URL: [provider's token endpoint]
- Client ID: [your client ID]
- Client Secret: [your client secret]
```

**Test Cases:**
```javascript
pm.test("OAuth token is obtained", function () {
    const token = pm.variables.get("oauthToken");
    pm.expect(token).to.not.be.undefined;
});

pm.test("Request with OAuth token succeeds", function () {
    pm.expect(pm.response.code).to.equal(200);
});
```

### 4. Basic Authentication

**How it works:**
- Credentials sent as base64-encoded string in header
- Format: `Authorization: Basic base64(username:password)`

**Postman Configuration:**
```
Authorization Tab:
- Type: Basic Auth
- Username: {{username}}
- Password: {{password}}
```

**Test Cases:**
```javascript
pm.test("Basic auth with valid credentials succeeds", function () {
    pm.expect(pm.response.code).to.equal(200);
});

pm.test("Basic auth with invalid credentials returns 401", function () {
    pm.expect(pm.response.code).to.equal(401);
});
```

### Authentication Testing Strategy

```javascript
// Collection-level Pre-request Script for Token Management
if (!pm.environment.get("bearerToken") || isTokenExpired()) {
    // Refresh token
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/auth/login",
        method: 'POST',
        header: {'Content-Type': 'application/json'},
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                username: pm.environment.get("username"),
                password: pm.environment.get("password")
            })
        }
    }, function (err, response) {
        const token = response.json().token;
        pm.environment.set("bearerToken", token);
        pm.environment.set("tokenExpiry", Date.now() + 3600000); // 1 hour
    });
}

function isTokenExpired() {
    const expiry = pm.environment.get("tokenExpiry");
    return !expiry || Date.now() > expiry;
}
```

---

## Postman Advanced Features

### 1. Environment Variables

**Purpose**: Manage different configurations (dev, staging, prod)

**Setup:**
```javascript
// Collection variables (shared across all requests)
pm.collectionVariables.set("version", "v1");

// Environment variables (per environment)
pm.environment.set("baseUrl", "https://api.example.com");
pm.environment.set("timeout", 5000);

// Global variables (across all collections)
pm.globals.set("company", "BASF");

// Usage in requests
{{baseUrl}}/{{version}}/users
```

**Variable Scope Priority**: Global < Collection < Environment < Data < Local

### 2. Pre-request Scripts

**Purpose**: Setup before sending request

**Common Use Cases:**
```javascript
// 1. Generate timestamp
pm.environment.set("timestamp", new Date().toISOString());

// 2. Generate random data
const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
pm.environment.set("testEmail", randomEmail);

// 3. Create signature/hash
const crypto = require('crypto-js');
const payload = pm.request.body.raw;
const signature = crypto.HmacSHA256(payload, pm.environment.get("secret")).toString();
pm.request.headers.add({key: 'X-Signature', value: signature});

// 4. Conditional logic
if (pm.environment.get("environment") === "production") {
    pm.request.url.host = "api.prod.example.com";
} else {
    pm.request.url.host = "api.dev.example.com";
}

// 5. Load test data from file
const testData = pm.iterationData.toObject();
pm.environment.set("userId", testData.userId);
```

### 3. Test Scripts (Post-response)

**Purpose**: Validate response and extract data

**Common Patterns:**
```javascript
// 1. Status code validation
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

// 2. Response time validation
pm.test("Response time is acceptable", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// 3. Header validation
pm.test("Content-Type is application/json", () => {
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});

// 4. JSON schema validation
const schema = {
    type: "object",
    required: ["id", "name", "email"],
    properties: {
        id: {type: "integer"},
        name: {type: "string", minLength: 1},
        email: {type: "string", format: "email"}
    }
};
pm.test("Response matches schema", () => {
    pm.response.to.have.jsonSchema(schema);
});

// 5. Extract data for next request
const jsonData = pm.response.json();
pm.environment.set("userId", jsonData.id);

// 6. Conditional tests
if (pm.response.code === 200) {
    pm.test("Success response has data", () => {
        pm.expect(jsonData).to.have.property('data');
    });
} else if (pm.response.code === 400) {
    pm.test("Error response has message", () => {
        pm.expect(jsonData).to.have.property('error');
    });
}

// 7. Array validation
pm.test("Response contains at least one item", () => {
    pm.expect(jsonData.length).to.be.above(0);
});

pm.test("All items have required structure", () => {
    jsonData.forEach(item => {
        pm.expect(item).to.have.all.keys('id', 'name', 'status');
    });
});
```

### 4. Collection Runner

**Purpose**: Run multiple requests sequentially

**Features:**
- Iteration support (run collection N times)
- Data file support (CSV/JSON for data-driven testing)
- Delay between requests
- Folder selection (run subset of requests)

**Usage:**
```
1. Click "Runner" in Postman
2. Select collection and environment
3. (Optional) Upload data file for iterations
4. Set iteration count and delay
5. Click "Run"
```

### 5. Data-Driven Testing

**CSV File (test-data.csv):**
```csv
username,email,role
john_doe,john@example.com,admin
jane_smith,jane@example.com,user
bob_jones,bob@example.com,moderator
```

**Usage in Request:**
```json
{
    "username": "{{username}}",
    "email": "{{email}}",
    "role": "{{role}}"
}
```

**Test Script:**
```javascript
pm.test("User created with correct role", () => {
    const response = pm.response.json();
    pm.expect(response.role).to.equal(pm.iterationData.get("role"));
});
```

---

## API Testing Strategy

### Test Pyramid for APIs

```
         /\
        /  \  E2E UI Tests (10%)
       /____\
      /      \
     / API    \ Integration Tests (30%)
    /  Tests   \
   /____________\
  / Unit Tests   \ (60%)
 /________________\
```

### Comprehensive Test Coverage

#### 1. **Functional Testing**
```javascript
// Positive scenarios
✅ Valid inputs return success
✅ Data is correctly created/updated/deleted
✅ Relationships between resources work

// Negative scenarios
✅ Invalid inputs return 400 with error details
✅ Missing required fields return 422
✅ Non-existent resources return 404
✅ Duplicate resources return 409
```

#### 2. **Authentication & Authorization Testing**
```javascript
✅ Requests without token return 401
✅ Expired tokens return 401
✅ Invalid tokens return 401
✅ Valid token for wrong user returns 403
✅ Role-based access control works correctly
```

#### 3. **Schema Validation Testing**
```javascript
pm.test("Response schema is valid", () => {
    const schema = {
        type: "object",
        required: ["id", "name", "createdAt"],
        properties: {
            id: {type: "integer", minimum: 1},
            name: {type: "string", minLength: 1, maxLength: 100},
            email: {type: "string", format: "email"},
            createdAt: {type: "string", format: "date-time"}
        }
    };
    pm.response.to.have.jsonSchema(schema);
});
```

#### 4. **Performance Testing**
```javascript
pm.test("Response time is acceptable", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Monitor performance trends
pm.test("Performance baseline", () => {
    const responseTime = pm.response.responseTime;
    console.log(`Response time: ${responseTime}ms`);

    if (responseTime > 1000) {
        console.warn("Performance degradation detected!");
    }
});
```

#### 5. **Rate Limiting Testing**
```javascript
// Send multiple requests in quick succession
for (let i = 0; i < 100; i++) {
    pm.sendRequest(pm.request.url, (err, response) => {
        if (response.code === 429) {
            pm.test("Rate limiting works", () => {
                pm.expect(response.code).to.equal(429);
                pm.expect(response.headers.get('Retry-After')).to.exist;
            });
        }
    });
}
```

#### 6. **Error Handling Testing**
```javascript
// Test various error scenarios
✅ Server errors (500) have proper error messages
✅ Error responses follow consistent format
✅ Detailed validation errors for 422 responses

pm.test("Error response structure", () => {
    if (pm.response.code >= 400) {
        const error = pm.response.json();
        pm.expect(error).to.have.property('status');
        pm.expect(error).to.have.property('message');
        pm.expect(error).to.have.property('timestamp');
    }
});
```

---

## Newman CLI Integration

### Installation
```bash
npm install -g newman
npm install -g newman-reporter-html
npm install -g newman-reporter-htmlextra
```

### Basic Commands

```bash
# Run collection
newman run collection.json

# With environment
newman run collection.json -e environment.json

# With multiple environments
newman run collection.json -e dev.json -e staging.json

# Generate HTML report
newman run collection.json -r html --reporter-html-export report.html

# Data-driven testing
newman run collection.json -d test-data.csv

# Multiple iterations
newman run collection.json -n 10

# With delay between requests
newman run collection.json --delay-request 1000

# Bail on first failure
newman run collection.json --bail

# Run specific folder
newman run collection.json --folder "Authentication Tests"

# Set timeout
newman run collection.json --timeout-request 10000

# Suppress console output
newman run collection.json --silent

# Disable SSL verification (dev only!)
newman run collection.json --insecure
```

### Advanced Newman Usage

```bash
# Export environment after run
newman run collection.json -e env.json --export-environment env-output.json

# Export globals
newman run collection.json --export-globals globals-output.json

# Multiple reporters
newman run collection.json -r cli,json,html

# Custom reporter options
newman run collection.json \
    -r htmlextra \
    --reporter-htmlextra-export report.html \
    --reporter-htmlextra-darkTheme \
    --reporter-htmlextra-title "BASF API Tests"

# Environment variable override
newman run collection.json \
    --env-var "baseUrl=https://api.prod.com" \
    --env-var "apiKey=secret123"
```

### CI/CD Integration Examples

#### GitHub Actions
```yaml
name: API Tests
on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install Newman
        run: npm install -g newman newman-reporter-htmlextra

      - name: Run API Tests
        run: |
          newman run collection.json \
            -e environment.json \
            -r htmlextra,cli \
            --reporter-htmlextra-export reports/api-test-report.html

      - name: Upload Report
        uses: actions/upload-artifact@v2
        with:
          name: api-test-report
          path: reports/
```

#### GitLab CI
```yaml
api-tests:
  stage: test
  image: postman/newman:alpine
  script:
    - newman run collection.json -e environment.json -r html,cli
  artifacts:
    paths:
      - newman/
    expire_in: 1 week
```

#### Jenkins Pipeline
```groovy
pipeline {
    agent any
    stages {
        stage('API Tests') {
            steps {
                sh 'npm install -g newman'
                sh 'newman run collection.json -e environment.json -r junit,html'
            }
        }
    }
    post {
        always {
            junit 'newman/*.xml'
            publishHTML([
                reportDir: 'newman',
                reportFiles: 'report.html',
                reportName: 'API Test Report'
            ])
        }
    }
}
```

---

## Interview Talking Points Summary

### Key Phrases to Master:

1. **"I implemented comprehensive API testing using Postman Collections with over 50 test cases covering CRUD operations, authentication flows, and error scenarios."**

2. **"We integrated Newman CLI into our GitLab CI pipeline, running automated API tests on every merge request. This caught contract violations before deployment."**

3. **"I validate API responses using JSON schema validation to ensure contract compliance. This catches unexpected data structure changes early."**

4. **"Our API test strategy covers positive scenarios, negative scenarios, authentication edge cases, and performance baselines. We achieved 85% API coverage."**

5. **"I use environment variables in Postman to manage configurations across dev, staging, and production, making our tests portable and maintainable."**

6. **"For data-driven testing, I use CSV files with Newman to test multiple input combinations efficiently, reducing test maintenance effort."**

7. **"I implement pre-request scripts to generate dynamic authentication tokens, ensuring tests don't fail due to token expiration."**

8. **"Our error handling tests validate that all 4xx errors return consistent error response structures with helpful messages for debugging."**

### Quantifiable Achievements:

- "Created a test suite of 50+ API tests covering 25 endpoints"
- "Reduced API regression bugs by 60% through automated testing"
- "Achieved < 500ms average response time for all critical endpoints"
- "Integrated tests run in under 2 minutes in CI/CD pipeline"
- "Caught 15+ API contract violations before production deployment"

---

## Practice Exercises

### Exercise 1: Build Complete CRUD Collection
Create a collection for a user management API with:
- List all users (GET)
- Get single user (GET)
- Create user (POST) with schema validation
- Update user (PUT)
- Partial update (PATCH)
- Delete user (DELETE)
- Error scenarios (404, 400, 401)

### Exercise 2: Implement Authentication Flow
1. Login request saves token
2. Subsequent requests use saved token
3. Test token expiration handling
4. Test unauthorized access (403)

### Exercise 3: Data-Driven Testing
Create CSV with 5 test users and iterate through:
- User creation
- Validation of created data
- Cleanup (deletion)

### Exercise 4: Newman Integration
1. Export your collection
2. Run with Newman CLI
3. Generate HTML report
4. Write bash script to run tests

---

**Ready for interviews?** You should now be able to discuss API testing strategies, demonstrate Postman expertise, and explain CI/CD integration confidently in English!
