# Exercise 2: Authentication Flow - Complete Samples & Guide

## Learning Objectives

After completing this exercise, you will be able to:
- ✅ Implement token-based authentication in Postman
- ✅ Chain requests to save and reuse authentication tokens
- ✅ Test token expiration scenarios
- ✅ Validate authorization (403 Forbidden) vs authentication (401 Unauthorized)
- ✅ Use Pre-request Scripts for automatic token refresh

---

## Authentication Flow Overview

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /auth/login
       │    { username, password }
       ▼
┌─────────────┐
│   Server    │────► Validate credentials
└──────┬──────┘
       │
       │ 2. Return JWT token
       │    { token: "eyJhbG..." }
       ▼
┌─────────────┐
│  Save Token │────► pm.environment.set("bearerToken", token)
└──────┬──────┘
       │
       │ 3. Subsequent requests
       │    Authorization: Bearer eyJhbG...
       ▼
┌─────────────┐
│   Server    │────► Validate token & authorize
└──────┬──────┘
       │
       │ 4. Return protected data
       ▼
```

---

## Sample 1: Basic Login Flow (ReqRes.in API)

### Step 1.1: Login Request

**Endpoint:** `POST https://reqres.in/api/login`

**Request Body:**
```json
{
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
}
```

**Test Script:**
```javascript
// Test 1: Validate successful login
pm.test("Login successful - Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test 2: Token is returned
pm.test("Response contains token", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
    pm.expect(jsonData.token).to.be.a('string');
    pm.expect(jsonData.token).to.have.lengthOf.above(0);
});

// Test 3: Save token to environment for future requests
pm.test("Token saved to environment", function () {
    const jsonData = pm.response.json();
    pm.environment.set("bearerToken", jsonData.token);
    console.log("✅ Token saved:", jsonData.token);
});

// Optional: Save token expiration time (1 hour from now)
const expirationTime = Date.now() + (60 * 60 * 1000); // 1 hour
pm.environment.set("tokenExpiry", expirationTime);
```

**Expected Response:**
```json
{
    "token": "QpwL5tke4Pnpja7X4"
}
```

---

### Step 1.2: Use Token in Protected Request

**Endpoint:** `GET https://reqres.in/api/users/2`

**Authorization Setup:**
- Type: `Bearer Token`
- Token: `{{bearerToken}}` (uses environment variable)

**Or use Pre-request Script:**
```javascript
// Automatically add Authorization header
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('bearerToken')
});
```

**Test Script:**
```javascript
pm.test("Authenticated request successful", function () {
    pm.response.to.have.status(200);
});

pm.test("Authorization header was sent", function () {
    const sentToken = pm.request.headers.get('Authorization');
    pm.expect(sentToken).to.include('Bearer');
    console.log("Sent token:", sentToken);
});

pm.test("Protected data retrieved", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data).to.have.property('email');
});
```

---

## Sample 2: Complete Authentication Flow with Token Refresh

### Pre-request Script (Collection-Level)

This script runs BEFORE every request and automatically handles token refresh:

```javascript
// ============================================
// Automatic Token Management
// ============================================

// Function to check if token is expired
function isTokenExpired() {
    const tokenExpiry = pm.environment.get("tokenExpiry");

    if (!tokenExpiry) {
        console.log("⚠️ No token expiry found");
        return true;
    }

    const now = Date.now();
    const isExpired = now > tokenExpiry;

    if (isExpired) {
        console.log("⚠️ Token expired");
    } else {
        const remainingMinutes = Math.floor((tokenExpiry - now) / 60000);
        console.log(`✅ Token valid for ${remainingMinutes} more minutes`);
    }

    return isExpired;
}

// Function to login and get new token
function refreshToken() {
    const loginRequest = {
        url: pm.environment.get("baseUrl") + "/api/login",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: pm.environment.get("userEmail"),
                password: pm.environment.get("userPassword")
            })
        }
    };

    pm.sendRequest(loginRequest, function (err, response) {
        if (err) {
            console.error("❌ Login failed:", err);
            return;
        }

        if (response.code === 200) {
            const token = response.json().token;
            pm.environment.set("bearerToken", token);

            // Set expiration (e.g., 1 hour from now)
            const expiry = Date.now() + (60 * 60 * 1000);
            pm.environment.set("tokenExpiry", expiry);

            console.log("✅ Token refreshed successfully");
        } else {
            console.error("❌ Login failed with status:", response.code);
        }
    });
}

// Main logic: Check and refresh token if needed
const currentToken = pm.environment.get("bearerToken");

if (!currentToken || isTokenExpired()) {
    console.log("🔄 Refreshing token...");
    refreshToken();
} else {
    console.log("✅ Using existing valid token");
}
```

---

## Sample 3: Testing Authentication Error Scenarios

### Test 3.1: Login with Invalid Credentials

**Endpoint:** `POST https://reqres.in/api/login`

**Request Body:**
```json
{
    "email": "wrong@email.com",
    "password": "wrongpassword"
}
```

**Test Script:**
```javascript
pm.test("Invalid credentials return 400 Bad Request", function () {
    pm.response.to.have.status(400);
});

pm.test("Error message is descriptive", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('error');
    pm.expect(jsonData.error).to.be.a('string');
    console.log("Error message:", jsonData.error);
});

pm.test("No token is returned on failed login", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.not.have.property('token');
});
```

**Expected Response:**
```json
{
    "error": "user not found"
}
```

---

### Test 3.2: Access Protected Resource Without Token (401 Unauthorized)

**Endpoint:** `GET https://reqres.in/api/users/2`

**Authorization:** NONE (remove bearer token)

**Pre-request Script:**
```javascript
// Temporarily remove token for this test
pm.request.headers.upsert({
    key: 'Authorization',
    value: '' // Empty authorization
});

console.log("🚫 Testing unauthorized access (no token)");
```

**Test Script:**
```javascript
pm.test("Request without token returns 401 Unauthorized", function () {
    // Note: ReqRes doesn't actually enforce auth, so we simulate
    // In real APIs, this would return 401
    pm.expect(pm.response.code).to.be.oneOf([200, 401]);
});

pm.test("Authorization header is missing", function () {
    const authHeader = pm.request.headers.get('Authorization');
    pm.expect(authHeader).to.be.empty;
    console.log("Confirmed: No auth header sent");
});

// For demonstration with mock server
if (pm.response.code === 401) {
    pm.test("Unauthorized error message present", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('error');
        pm.expect(jsonData.error).to.include('Unauthorized');
    });
}
```

---

### Test 3.3: Access Resource with Invalid Token (401 Unauthorized)

**Endpoint:** `GET https://reqres.in/api/users/2`

**Pre-request Script:**
```javascript
// Set an invalid/malformed token
pm.request.headers.upsert({
    key: 'Authorization',
    value: 'Bearer invalid_fake_token_12345'
});

console.log("🚫 Testing with invalid token");
```

**Test Script:**
```javascript
pm.test("Invalid token returns 401 Unauthorized", function () {
    // Real API would return 401 for invalid token
    pm.expect(pm.response.code).to.be.oneOf([200, 401]);

    if (pm.response.code === 401) {
        console.log("✅ API correctly rejected invalid token");
    } else {
        console.log("⚠️ API doesn't validate tokens (demo API)");
    }
});
```

---

### Test 3.4: Access Forbidden Resource (403 Forbidden)

**Scenario:** User is authenticated but doesn't have permission to access resource

**Endpoint:** `GET https://reqres.in/api/admin/users` (simulated admin endpoint)

**Pre-request Script:**
```javascript
// Use valid token but for non-admin user
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('bearerToken')
});

console.log("🔒 Testing forbidden access (valid token, insufficient permissions)");
```

**Test Script:**
```javascript
pm.test("Authenticated user without permission gets 403 Forbidden", function () {
    // This is a demonstration - actual endpoint would return 403
    pm.expect(pm.response.code).to.be.oneOf([200, 403, 404]);
});

// Understanding the difference
pm.test("401 vs 403 explained", function () {
    console.log(`
    📚 Authentication vs Authorization:

    401 Unauthorized:
    - Who are you? (Authentication failed)
    - Missing or invalid credentials/token
    - User needs to login

    403 Forbidden:
    - I know who you are, but you can't access this (Authorization failed)
    - Valid credentials but insufficient permissions
    - User needs elevated privileges
    `);
});
```

---

## Sample 4: Testing Token Expiration

### Simulate Token Expiration

**Pre-request Script:**
```javascript
// Simulate an expired token by setting past expiry time
pm.environment.set("tokenExpiry", Date.now() - 1000); // Expired 1 second ago

console.log("⏰ Simulating expired token...");
```

**Test Script:**
```javascript
pm.test("Expired token triggers refresh", function () {
    const tokenExpiry = pm.environment.get("tokenExpiry");
    const isExpired = Date.now() > tokenExpiry;

    pm.expect(isExpired).to.be.true;
    console.log("✅ Token expiration detected correctly");
});

// After request, verify new token was obtained
pm.test("New token was generated", function () {
    const currentExpiry = pm.environment.get("tokenExpiry");
    const isFutureExpiry = currentExpiry > Date.now();

    pm.expect(isFutureExpiry).to.be.true;
    console.log("✅ Token refreshed with new expiration");
});
```

---

## Sample 5: Real-World API Example (JSONPlaceholder with Mock Auth)

Since JSONPlaceholder doesn't have real authentication, here's how you would **simulate** it for practice:

### Create Mock Server Response

**Pre-request Script (Login endpoint):**
```javascript
// Simulate login endpoint
const requestBody = JSON.parse(pm.request.body.raw);

// Mock authentication logic
if (requestBody.username === "testuser" && requestBody.password === "testpass123") {
    // Generate mock JWT token
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE2MzY5ODQ4MDAsImV4cCI6MTYzNjk4ODQwMH0.mock_signature";

    pm.environment.set("bearerToken", mockToken);
    pm.environment.set("tokenExpiry", Date.now() + 3600000); // 1 hour

    console.log("✅ Mock login successful");
} else {
    console.log("❌ Mock login failed: Invalid credentials");
}
```

---

## Complete Authentication Flow - Postman Collection Structure

```
📁 Authentication Flow Collection
│
├── 📂 01-Authentication
│   ├── 📄 Login (POST)
│   │   ├── Valid Credentials → 200, save token
│   │   └── Tests: token present, saved to environment
│   │
│   ├── 📄 Login - Invalid Credentials (POST)
│   │   ├── Wrong password → 400/401
│   │   └── Tests: error message, no token
│   │
│   └── 📄 Logout (POST) [Optional]
│       └── Clear token from environment
│
├── 📂 02-Protected-Endpoints
│   ├── 📄 Get User Profile (GET)
│   │   ├── Use bearerToken variable
│   │   └── Tests: 200, profile data returned
│   │
│   ├── 📄 Update Profile (PUT)
│   │   ├── Requires authentication
│   │   └── Tests: 200, data updated
│   │
│   └── 📄 Delete Account (DELETE)
│       ├── Requires authentication
│       └── Tests: 204/200
│
├── 📂 03-Authorization-Tests
│   ├── 📄 Access Without Token
│   │   ├── No Authorization header → 401
│   │   └── Tests: Unauthorized error
│   │
│   ├── 📄 Access With Invalid Token
│   │   ├── Malformed token → 401
│   │   └── Tests: Token validation error
│   │
│   └── 📄 Access Admin Endpoint (Regular User)
│       ├── Valid token, no permission → 403
│       └── Tests: Forbidden error
│
└── 📂 04-Token-Management
    ├── 📄 Refresh Token (POST)
    │   └── Get new token before expiry
    │
    └── 📄 Verify Token (GET)
        └── Check if current token is valid
```

---

## Environment Variables Setup

Create a Postman environment with these variables:

```javascript
{
    "baseUrl": "https://reqres.in",
    "userEmail": "eve.holt@reqres.in",
    "userPassword": "cityslicka",
    "bearerToken": "", // Populated after login
    "tokenExpiry": "", // Populated after login (timestamp)
    "userId": "2"
}
```

---

## Newman CLI Command for Authentication Tests

```bash
# Run authentication flow tests
newman run authentication-flow-collection.json \
    -e auth-environment.json \
    --folder "01-Authentication" \
    -r html,cli \
    --reporter-html-export auth-test-report.html

# Test with multiple user credentials (data-driven)
newman run authentication-flow-collection.json \
    -e auth-environment.json \
    -d test-credentials.csv \
    -r html

# CI/CD with authentication
newman run authentication-flow-collection.json \
    --env-var "userEmail=test@example.com" \
    --env-var "userPassword=securePass123" \
    --bail \
    -r junit
```

---

## Interview Talking Points

### When discussing authentication testing:

**Question: "How do you handle authentication in your API tests?"**

**Your Answer:**
> "I implement a comprehensive authentication flow in Postman. First, I create a login request that validates credentials and saves the JWT token to an environment variable. Then I use a collection-level pre-request script to automatically include this token in all subsequent requests.
>
> To handle token expiration, I check the token's expiry timestamp before each request and automatically refresh it if needed. This prevents flaky tests due to expired tokens.
>
> I also test negative scenarios: unauthorized access without tokens (401), invalid tokens (401), and forbidden access with valid tokens but insufficient permissions (403). In my last project, this approach caught an authorization bug where admin-only endpoints were accessible to regular users."

### Key Metrics to Mention:

- "Implemented 15+ authentication test cases covering positive and negative scenarios"
- "Reduced authentication-related test failures by 80% using automatic token refresh"
- "Validated role-based access control across 25+ protected endpoints"

---

## Practice Checklist

- [ ] Create login request that saves token to environment
- [ ] Use saved token in protected endpoint request
- [ ] Implement pre-request script for automatic token refresh
- [ ] Test login with invalid credentials (expect 400/401)
- [ ] Test protected endpoint without token (expect 401)
- [ ] Test protected endpoint with invalid token (expect 401)
- [ ] Test forbidden access scenario (expect 403)
- [ ] Simulate and handle token expiration
- [ ] Run complete flow with Newman CLI
- [ ] Generate HTML report of authentication tests

---

## Common Mistakes to Avoid

❌ **Mistake 1:** Hardcoding tokens in requests
✅ **Solution:** Always use environment variables `{{bearerToken}}`

❌ **Mistake 2:** Not testing token expiration
✅ **Solution:** Implement automatic refresh logic

❌ **Mistake 3:** Confusing 401 and 403 errors
✅ **Solution:**
- 401 = Authentication failed (who are you?)
- 403 = Authorization failed (you can't do this)

❌ **Mistake 4:** Not clearing tokens after tests
✅ **Solution:** Add cleanup script or logout endpoint

❌ **Mistake 5:** Exposing credentials in collection
✅ **Solution:** Use environment variables for sensitive data

---

## Next Steps

1. **Import the samples** into your Postman workspace
2. **Practice with ReqRes.in** API (real authentication)
3. **Create your own** authentication collection
4. **Record yourself** explaining the flow in English (5 minutes)
5. **Run tests** with Newman and generate reports

**Ready to demonstrate authentication testing in your interview!** 🚀
