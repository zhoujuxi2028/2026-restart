# JavaScript/TypeScript + Performance Testing - Core Concepts

## Table of Contents
1. [JavaScript Fundamentals](#1-javascript-fundamentals)
2. [TypeScript for Test Automation](#2-typescript-for-test-automation)
3. [Performance Testing Concepts](#3-performance-testing-concepts)
4. [JMeter Basics](#4-jmeter-basics)

---

## 1. JavaScript Fundamentals

### 1.1 Closures

**Definition**: A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

**Example**:
```javascript
function createCounter() {
  let count = 0;  // Private variable
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2
```

**Interview Explanation**:
"Closures allow us to create private variables in JavaScript. In test automation, I use closures to maintain state across test steps or to create factory functions that generate test data with encapsulated configuration."

**Use Case in Testing**:
```javascript
function createTestDataFactory(baseUrl) {
  return {
    getLoginUrl: () => `${baseUrl}/login`,
    getApiUrl: (endpoint) => `${baseUrl}/api/${endpoint}`
  };
}

const testData = createTestDataFactory('https://staging.example.com');
```

### 1.2 Promises

**Definition**: Promises represent the eventual completion (or failure) of an asynchronous operation.

**States**: Pending → Fulfilled / Rejected

**Basic Usage**:
```javascript
// Creating a promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: 'Success' });
    }, 1000);
  });
};

// Consuming a promise
fetchData()
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Complete'));
```

**Promise Chaining**:
```javascript
cy.request('/api/users')
  .then(response => response.body[0].id)
  .then(userId => cy.request(`/api/users/${userId}`))
  .then(userDetails => {
    expect(userDetails.body).to.have.property('email');
  });
```

**Interview Point**: "Promises are fundamental to Cypress—every Cypress command returns a promise. Understanding promise chaining is critical for writing clean, sequential test steps."

### 1.3 Async/Await

**Definition**: Syntactic sugar for working with promises, making asynchronous code look synchronous.

**Comparison**:
```javascript
// With Promises
function getUser() {
  return fetch('/api/user')
    .then(response => response.json())
    .then(user => user.name)
    .catch(error => console.error(error));
}

// With Async/Await (cleaner)
async function getUser() {
  try {
    const response = await fetch('/api/user');
    const user = await response.json();
    return user.name;
  } catch (error) {
    console.error(error);
  }
}
```

**Test Automation Example**:
```javascript
describe('API Tests', () => {
  it('should create and verify user', async () => {
    // Create user
    const createResponse = await cy.request('POST', '/api/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    const userId = createResponse.body.id;
    
    // Verify user exists
    const getResponse = await cy.request(`/api/users/${userId}`);
    expect(getResponse.body.name).to.equal('John Doe');
  });
});
```

**Interview Explanation**: "Async/await makes test code more readable. Instead of nested .then() chains, we write sequential steps that are easier to understand and maintain."

### 1.4 Arrow Functions

**Syntax**:
```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With implicit return
const users = [1, 2, 3].map(id => ({ id, name: `User ${id}` }));
```

**Key Difference - `this` binding**:
```javascript
// Traditional function - 'this' is dynamic
function Counter() {
  this.count = 0;
  setInterval(function() {
    this.count++;  // 'this' is undefined (doesn't work)
  }, 1000);
}

// Arrow function - 'this' is lexical
function Counter() {
  this.count = 0;
  setInterval(() => {
    this.count++;  // 'this' refers to Counter (works!)
  }, 1000);
}
```

**Test Automation Usage**:
```javascript
describe('Test Suite', () => {
  const testData = [
    { input: 'admin', expected: 'Administrator' },
    { input: 'user', expected: 'Regular User' }
  ];
  
  testData.forEach(({ input, expected }) => {
    it(`should map ${input} to ${expected}`, () => {
      cy.visit(`/login?role=${input}`);
      cy.get('.user-type').should('contain', expected);
    });
  });
});
```

### 1.5 Array Methods

**Essential methods for testing**:

**map()** - Transform array:
```javascript
const userIds = [1, 2, 3];
const apiCalls = userIds.map(id => cy.request(`/api/users/${id}`));
```

**filter()** - Select elements:
```javascript
const failedTests = testResults.filter(test => test.status === 'failed');
```

**reduce()** - Aggregate data:
```javascript
const totalDuration = tests.reduce((sum, test) => sum + test.duration, 0);
```

**find()** - Get first match:
```javascript
const adminUser = users.find(user => user.role === 'admin');
```

**Interview Point**: "Array methods are crucial for processing test data, filtering results, and generating dynamic test cases."

### 1.6 Event Loop

**Concept**: JavaScript is single-threaded but handles asynchronous operations through the event loop.

**Execution Order**:
```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
// Sync code runs first, then microtasks (Promises), then macrotasks (setTimeout)
```

**Interview Explanation**: "The event loop is why Cypress commands are queued and executed sequentially. Understanding this helps debug timing issues in tests."

---

## 2. TypeScript for Test Automation

### 2.1 Why TypeScript?

**Benefits for Test Automation**:
1. **Type Safety**: Catch errors at compile time
2. **Intellisense**: Better IDE autocomplete
3. **Refactoring**: Safer code changes
4. **Documentation**: Types serve as inline docs
5. **Team Collaboration**: Clearer interfaces

**Example Without TypeScript**:
```javascript
// JavaScript - no type checking
function createUser(name, email, age) {
  // What types? What's required?
  return { name, email, age };
}

createUser('John', 25, 'john@example.com');  // Wrong order, no error!
```

**Example With TypeScript**:
```typescript
// TypeScript - type-safe
interface User {
  name: string;
  email: string;
  age: number;
}

function createUser(name: string, email: string, age: number): User {
  return { name, email, age };
}

createUser('John', 25, 'john@example.com');  // Compile error!
```

### 2.2 Type Annotations

**Basic Types**:
```typescript
const testName: string = 'Login Test';
const retryCount: number = 3;
const isHeadless: boolean = true;

const testData: string[] = ['user1', 'user2', 'user3'];
const testConfig: { [key: string]: any } = { timeout: 5000 };
```

**Function Types**:
```typescript
// Parameter and return types
function multiply(a: number, b: number): number {
  return a * b;
}

// Void return
function logMessage(message: string): void {
  console.log(message);
}

// Optional parameters
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}
```

### 2.3 Interfaces

**Definition**: Interfaces define the shape of objects.

**Test Data Interface**:
```typescript
interface TestUser {
  username: string;
  password: string;
  role: 'admin' | 'user';  // Union type
  metadata?: {              // Optional property
    createdAt: Date;
    permissions: string[];
  };
}

const adminUser: TestUser = {
  username: 'admin@example.com',
  password: 'Admin@123',
  role: 'admin'
};

// Type error if required fields missing or wrong type
const invalidUser: TestUser = {
  username: 'user',
  // Missing password - error!
  role: 'superadmin'  // Not in union type - error!
};
```

**Page Object with Interface**:
```typescript
interface LoginPage {
  visit(): void;
  fillUsername(username: string): void;
  fillPassword(password: string): void;
  submit(): void;
  getErrorMessage(): Cypress.Chainable<string>;
}

class LoginPageImpl implements LoginPage {
  visit(): void {
    cy.visit('/login');
  }
  
  fillUsername(username: string): void {
    cy.get('[data-cy="username"]').type(username);
  }
  
  // Must implement all interface methods
}
```

### 2.4 Generics Basics

**Concept**: Create reusable components that work with multiple types.

**Example**:
```typescript
// Generic function
function wrapInArray<T>(item: T): T[] {
  return [item];
}

wrapInArray<string>('test');   // string[]
wrapInArray<number>(123);      // number[]

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: { name: 'John', email: 'john@example.com', age: 30 },
  status: 200,
  message: 'Success'
};
```

**Test Utility**:
```typescript
function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  return fn().catch(error => {
    if (maxRetries > 0) {
      return retryAsync(fn, maxRetries - 1);
    }
    throw error;
  });
}

// Usage
const data = await retryAsync(() => fetch('/api/data').then(r => r.json()));
```

---

## 3. Performance Testing Concepts

### 3.1 Types of Performance Testing

**1. Load Testing**:
- **Goal**: Verify system behavior under expected load
- **Example**: 100 concurrent users browsing site
- **Metric**: Response time stays under 2 seconds

**2. Stress Testing**:
- **Goal**: Find system breaking point
- **Example**: Gradually increase users until system fails
- **Metric**: Maximum concurrent users before errors

**3. Spike Testing**:
- **Goal**: Test sudden traffic surge
- **Example**: 1000 users in 10 seconds (flash sale)
- **Metric**: System recovers after spike

**4. Endurance Testing (Soak)**:
- **Goal**: Verify stability over time
- **Example**: 500 users for 24 hours
- **Metric**: No memory leaks, stable response times

### 3.2 Performance Metrics

**Key Metrics**:

| Metric | Description | Target Example |
|--------|-------------|----------------|
| **Response Time** | Time to complete request | < 2 seconds |
| **Throughput** | Requests per second | > 1000 req/s |
| **Error Rate** | % failed requests | < 1% |
| **Concurrent Users** | Simultaneous active users | 500 users |
| **CPU/Memory** | Resource utilization | < 70% |

**Interview Explanation**: "In my performance testing, I focus on response time (user experience), throughput (system capacity), and error rate (stability). These three metrics give a complete picture of system performance."

### 3.3 Performance Testing Process

**Steps**:
1. **Define Goals**: What are acceptable response times?
2. **Identify Scenarios**: Which user flows to test?
3. **Create Scripts**: JMeter test plans
4. **Execute Tests**: Run with load
5. **Analyze Results**: Identify bottlenecks
6. **Optimize**: Fix issues and retest

---

## 4. JMeter Basics

### 4.1 JMeter Architecture

**Components**:
```
Test Plan
├── Thread Group (simulates users)
│   ├── HTTP Request Sampler
│   ├── HTTP Request Sampler
│   └── Assertions
├── Listeners (view results)
└── Config Elements (variables, CSV data)
```

### 4.2 Thread Group

**Configuration**:
- **Number of Threads**: Concurrent users (e.g., 100)
- **Ramp-up Period**: Time to start all users (e.g., 10 seconds)
- **Loop Count**: How many times each user repeats (e.g., 5 loops)

**Example**: 100 users, 10s ramp-up, 5 loops
- Users start gradually over 10 seconds
- Each user executes test 5 times
- Total requests: 100 users × 5 loops × number of samplers

### 4.3 HTTP Request Sampler

**Configuration**:
```
Server Name: api.example.com
Port: 443
Protocol: https
Method: POST
Path: /api/users
Body Data: {"name": "John", "email": "john@example.com"}
```

### 4.4 Assertions

**Response Assertion**:
- Check response contains "success"
- Verify status code = 200

**Duration Assertion**:
- Response time < 2000ms

**JSON Assertion**:
- Validate JSON structure
- Check specific field values

### 4.5 Listeners

**Common Listeners**:
- **View Results Tree**: See individual requests/responses
- **Summary Report**: Average metrics
- **Aggregate Report**: Detailed statistics
- **Graph Results**: Visual response time graph

### 4.6 Best Practices

1. **Use CSV for test data**: Don't hardcode values
2. **Add timers**: Simulate realistic user pacing
3. **Monitor resources**: CPU, memory during tests
4. **Run non-GUI mode**: CLI for better performance
   ```bash
   jmeter -n -t test.jmx -l results.jtl
   ```
5. **Gradual ramp-up**: Don't hit server instantly

---

## Interview Preparation Checklist

Can you explain these clearly (2-3 minutes each)?

**JavaScript**:
- [ ] Closures with example
- [ ] Promises vs Async/Await
- [ ] Arrow functions vs traditional
- [ ] Event loop basics

**TypeScript**:
- [ ] Why TypeScript for testing?
- [ ] Interfaces in test automation
- [ ] Type annotations benefits

**Performance Testing**:
- [ ] Load vs Stress vs Spike testing
- [ ] Key performance metrics
- [ ] JMeter thread groups
- [ ] When to use performance testing

**Key Metrics to Mention**:
- "Response time under 2 seconds"
- "Error rate below 1%"
- "Throughput 1000+ requests/second"
- "TypeScript reduced bugs by 30%"

---

**Next**: Practice with code examples and prepare interview answers in `02-interview-qa.md`
