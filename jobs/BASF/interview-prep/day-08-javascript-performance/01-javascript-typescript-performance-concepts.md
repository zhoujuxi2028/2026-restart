# Day 8: JavaScript/TypeScript + Performance Testing - Core Concepts

## Table of Contents

1. [JavaScript Fundamentals for Test Automation](#1-javascript-fundamentals)
2. [Async Programming: Promises and Async/Await](#2-async-programming)
3. [Array Methods and Functional Programming](#3-array-methods)
4. [ES6+ Features](#4-es6-features)
5. [TypeScript Fundamentals](#5-typescript-fundamentals)
6. [JMeter Performance Testing](#6-jmeter-performance-testing)
7. [Performance Metrics and Analysis](#7-performance-metrics)
8. [Performance Testing Strategy](#8-performance-testing-strategy)

---

## 1. JavaScript Fundamentals for Test Automation

### Why JavaScript Matters for QA

JavaScript/TypeScript is the language of modern test automation:
- **Cypress**: Written entirely in JavaScript
- **Postman**: Pre-request and test scripts use JavaScript
- **Newman**: Node.js CLI tool
- **Most CI/CD integrations**: Node.js-based

### Key Concepts

#### Variables and Scope

```javascript
// var (avoid - function scoped, can be redeclared)
var oldStyle = 'avoid this';

// let (preferred - block scoped, mutable)
let userName = 'john@example.com';
userName = 'jane@example.com';  // ✅ Can reassign

// const (preferred - block scoped, immutable reference)
const apiUrl = 'https://api.example.com';
// apiUrl = 'https://other.com';  // ❌ Error

const user = { name: 'John' };
user.name = 'Jane';  // ✅ Can modify object properties
// user = {};  // ❌ Cannot reassign entire object
```

**Best practice**: Use `const` by default, `let` only when you need to reassign.

#### Functions

```javascript
// Function declaration
function login(username, password) {
  return `Logged in as ${username}`;
}

// Function expression
const logout = function() {
  return 'Logged out';
};

// Arrow function (preferred in modern code)
const getUser = (id) => {
  return fetch(`/api/users/${id}`);
};

// Arrow function shorthand (implicit return)
const getFullName = (user) => `${user.firstName} ${user.lastName}`;

// Async arrow function
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};
```

**Interview tip**: Arrow functions are concise and preserve `this` context, making them ideal for callbacks and test code.

---

## 2. Async Programming: Promises and Async/Await

### Why Async Matters

Test automation is inherently asynchronous:
- Waiting for API responses
- Waiting for UI elements to appear
- Database queries
- File operations

### Callbacks (Old Approach - Avoid)

```javascript
// ❌ Callback hell - hard to read and maintain
getUser(userId, function(user) {
  getOrders(user.id, function(orders) {
    getOrderDetails(orders[0].id, function(details) {
      console.log(details);
    });
  });
});
```

### Promises (Better Approach)

```javascript
// Promise represents eventual completion of an async operation
const promise = fetch('/api/users/1');

promise
  .then(response => response.json())
  .then(user => console.log(user))
  .catch(error => console.error(error))
  .finally(() => console.log('Cleanup'));
```

**Promise States:**
- **Pending**: Initial state, operation in progress
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

**Creating Promises:**

```javascript
function wait(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error('Time cannot be negative'));
    }
    setTimeout(() => resolve(`Waited ${ms}ms`), ms);
  });
}

// Usage
wait(1000)
  .then(message => console.log(message))  // "Waited 1000ms"
  .catch(error => console.error(error));
```

### Async/Await (Best Approach)

```javascript
// ✅ Clean, readable async code
async function getUserOrders(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const details = await getOrderDetails(orders[0].id);
    return details;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;  // Re-throw to caller
  }
}

// Usage
try {
  const orders = await getUserOrders(123);
  console.log(orders);
} catch (error) {
  // Handle error
}
```

**Key Points:**
- `async` keyword before function makes it return a Promise
- `await` keyword pauses execution until Promise resolves
- Must use `await` inside `async` functions (or top-level in modules)
- Use `try/catch` for error handling

### Sequential vs Parallel Execution

**Sequential (one after another):**

```javascript
async function sequential() {
  const user = await getUser(1);      // Wait 100ms
  const products = await getProducts(); // Wait 200ms
  const orders = await getOrders(1);   // Wait 150ms
  // Total: 450ms
  return { user, products, orders };
}
```

**Parallel (simultaneously):**

```javascript
async function parallel() {
  // Start all requests at once
  const [user, products, orders] = await Promise.all([
    getUser(1),       // 100ms
    getProducts(),    // 200ms
    getOrders(1)      // 150ms
  ]);
  // Total: 200ms (longest request)
  return { user, products, orders };
}
```

**When to use parallel:**
- Requests are independent (don't depend on each other)
- Order doesn't matter
- Want to optimize performance

### Promise Methods

```javascript
// Promise.all - Wait for ALL to complete (fails if any fails)
const [user, orders] = await Promise.all([
  fetch('/api/users/1'),
  fetch('/api/orders')
]);

// Promise.race - Return FIRST to complete (success or failure)
const fastest = await Promise.race([
  fetch('https://api1.com/data'),
  fetch('https://api2.com/data'),
  timeout(5000)  // Fail after 5s
]);

// Promise.allSettled - Wait for ALL, return results even if some fail
const results = await Promise.allSettled([
  fetch('/api/users/1'),
  fetch('/api/users/999'),  // Might fail
  fetch('/api/users/2')
]);
// results[0] = { status: 'fulfilled', value: ... }
// results[1] = { status: 'rejected', reason: ... }
// results[2] = { status: 'fulfilled', value: ... }

// Promise.any - Return FIRST success (ignore failures)
const firstSuccess = await Promise.any([
  fetch('https://unreliable1.com'),  // Might fail
  fetch('https://unreliable2.com'),  // Might fail
  fetch('https://reliable.com')      // Succeeds
]);
```

### Real Test Automation Examples

**Cypress Custom Command with Async:**

```javascript
Cypress.Commands.add('loginViaAPI', async (username, password) => {
  const response = await cy.request({
    method: 'POST',
    url: '/api/login',
    body: { username, password }
  });

  window.localStorage.setItem('authToken', response.body.token);
  return response.body;
});

// Usage
cy.loginViaAPI('user@example.com', 'password123')
  .then(user => {
    cy.log(`Logged in as ${user.name}`);
  });
```

**Postman Test Script with Promise:**

```javascript
// pm.sendRequest returns a Promise
pm.sendRequest('https://api.example.com/users', (err, response) => {
  if (err) {
    console.error(err);
  } else {
    pm.test('User API is accessible', () => {
      pm.expect(response.code).to.equal(200);
    });
  }
});
```

**Retry Logic with Async/Await:**

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
      }
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const data = await retry(() => fetch('/api/flaky-endpoint').then(r => r.json()));
```

---

## 3. Array Methods and Functional Programming

### Why Array Methods Matter

Test automation involves:
- Processing test results
- Filtering failed tests
- Calculating metrics (pass rate, coverage)
- Transforming data for reports

### Essential Array Methods

#### .map() - Transform Each Element

```javascript
// Transform test results to summary
const testResults = [
  { name: 'Login Test', duration: 1200, status: 'passed' },
  { name: 'Checkout Test', duration: 3400, status: 'failed' },
  { name: 'API Test', duration: 890, status: 'passed' }
];

const summary = testResults.map(test => ({
  name: test.name,
  passed: test.status === 'passed',
  durationSec: (test.duration / 1000).toFixed(2)
}));
// [
//   { name: 'Login Test', passed: true, durationSec: '1.20' },
//   { name: 'Checkout Test', passed: false, durationSec: '3.40' },
//   { name: 'API Test', passed: true, durationSec: '0.89' }
// ]

// Extract just test names
const testNames = testResults.map(test => test.name);
// ['Login Test', 'Checkout Test', 'API Test']
```

#### .filter() - Keep Elements Matching Condition

```javascript
// Find all failed tests
const failedTests = testResults.filter(test => test.status === 'failed');
// [{ name: 'Checkout Test', ... }]

// Find slow tests (> 2 seconds)
const slowTests = testResults.filter(test => test.duration > 2000);

// Complex condition
const criticalFailures = testResults.filter(test =>
  test.status === 'failed' && test.tags.includes('critical')
);

// Combine with map
const failedTestNames = testResults
  .filter(test => test.status === 'failed')
  .map(test => test.name);
// ['Checkout Test']
```

#### .reduce() - Aggregate to Single Value

```javascript
// Calculate total test duration
const totalDuration = testResults.reduce((sum, test) => sum + test.duration, 0);
// 5490 (1200 + 3400 + 890)

// Count passed tests
const passedCount = testResults.reduce((count, test) =>
  test.status === 'passed' ? count + 1 : count, 0
);
// 2

// Calculate pass rate
const passRate = testResults.reduce((acc, test) => {
  acc.total++;
  if (test.status === 'passed') acc.passed++;
  return acc;
}, { total: 0, passed: 0 });

const passRatePercentage = (passRate.passed / passRate.total * 100).toFixed(2);
// '66.67'

// Group tests by status
const groupedByStatus = testResults.reduce((groups, test) => {
  const status = test.status;
  if (!groups[status]) {
    groups[status] = [];
  }
  groups[status].push(test);
  return groups;
}, {});
// {
//   passed: [{ name: 'Login Test', ... }, { name: 'API Test', ... }],
//   failed: [{ name: 'Checkout Test', ... }]
// }
```

#### .forEach() - Iterate with Side Effects

```javascript
// Log each test result
testResults.forEach(test => {
  console.log(`${test.name}: ${test.status}`);
});

// Update external state (use sparingly)
const report = [];
testResults.forEach(test => {
  report.push(`Test: ${test.name} - ${test.status.toUpperCase()}`);
});
```

**Note**: `.forEach()` doesn't return anything (returns `undefined`). Use `.map()` if you need a new array.

#### .find() - Get First Matching Element

```javascript
// Find first failed test
const firstFailure = testResults.find(test => test.status === 'failed');
// { name: 'Checkout Test', ... }

// Find test by name
const specificTest = testResults.find(test => test.name === 'Login Test');

// Returns undefined if not found
const notFound = testResults.find(test => test.name === 'Nonexistent');
// undefined
```

#### .some() and .every() - Boolean Checks

```javascript
// Check if ANY test failed
const hasFailures = testResults.some(test => test.status === 'failed');
// true

// Check if ALL tests passed
const allPassed = testResults.every(test => test.status === 'passed');
// false

// Check if any test took longer than 5 seconds
const hasSlow = testResults.some(test => test.duration > 5000);
// false
```

### Method Chaining (Fluent API)

```javascript
// Complex data processing pipeline
const report = testResults
  .filter(test => test.status === 'failed')      // Only failed tests
  .map(test => ({                                 // Transform to report format
    name: test.name,
    duration: `${(test.duration / 1000).toFixed(2)}s`,
    failureReason: test.error?.message || 'Unknown'
  }))
  .sort((a, b) => b.duration - a.duration);      // Sort by duration (slowest first)

// Calculate statistics
const stats = testResults
  .reduce((acc, test) => {
    acc.total++;
    acc[test.status] = (acc[test.status] || 0) + 1;
    acc.totalDuration += test.duration;
    return acc;
  }, { total: 0, totalDuration: 0 });

stats.passRate = ((stats.passed || 0) / stats.total * 100).toFixed(2) + '%';
stats.avgDuration = (stats.totalDuration / stats.total / 1000).toFixed(2) + 's';
```

### Real-World Test Automation Example

```javascript
class TestReporter {
  constructor(results) {
    this.results = results;
  }

  getFailedTests() {
    return this.results.filter(t => t.status === 'failed');
  }

  getSlowTests(thresholdMs = 2000) {
    return this.results
      .filter(t => t.duration > thresholdMs)
      .sort((a, b) => b.duration - a.duration);
  }

  getStatistics() {
    return {
      total: this.results.length,
      passed: this.results.filter(t => t.status === 'passed').length,
      failed: this.results.filter(t => t.status === 'failed').length,
      skipped: this.results.filter(t => t.status === 'skipped').length,
      passRate: this.calculatePassRate(),
      avgDuration: this.calculateAvgDuration(),
      totalDuration: this.results.reduce((sum, t) => sum + t.duration, 0)
    };
  }

  calculatePassRate() {
    const passed = this.results.filter(t => t.status === 'passed').length;
    const total = this.results.length;
    return ((passed / total) * 100).toFixed(2) + '%';
  }

  calculateAvgDuration() {
    const total = this.results.reduce((sum, t) => sum + t.duration, 0);
    return (total / this.results.length / 1000).toFixed(2) + 's';
  }

  generateReport() {
    const stats = this.getStatistics();
    const failed = this.getFailedTests();
    const slow = this.getSlowTests();

    return {
      summary: stats,
      failures: failed.map(t => ({ name: t.name, reason: t.error })),
      slowTests: slow.map(t => ({ name: t.name, duration: t.duration }))
    };
  }
}

// Usage
const reporter = new TestReporter(testResults);
console.log(reporter.generateReport());
```

---

## 4. ES6+ Features

### Arrow Functions

```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Arrow function with block body
const add = (a, b) => {
  const result = a + b;
  return result;
};

// Single parameter (parentheses optional)
const square = x => x * x;

// No parameters
const getMessage = () => 'Hello World';

// Returning object literal (wrap in parentheses)
const createUser = (name, age) => ({ name, age });
```

**Key difference**: Arrow functions don't have their own `this`, they inherit from parent scope. This is useful for callbacks.

```javascript
class TestRunner {
  constructor() {
    this.results = [];
  }

  // ✅ Arrow function preserves 'this'
  runTest = async (test) => {
    const result = await test.execute();
    this.results.push(result);  // 'this' refers to TestRunner instance
  }

  // ❌ Regular function loses 'this' context when passed as callback
  runTestTraditional(test) {
    test.execute().then(result => {
      this.results.push(result);  // 'this' might be undefined
    });
  }
}
```

### Template Literals

```javascript
// Old way (string concatenation)
const message = 'Test ' + testName + ' ' + status + ' in ' + duration + 'ms';

// New way (template literals)
const message = `Test ${testName} ${status} in ${duration}ms`;

// Multi-line strings
const report = `
Test Suite Results:
-------------------
Total: ${total}
Passed: ${passed}
Failed: ${failed}
Pass Rate: ${passRate}%
`;

// Expression interpolation
const result = `2 + 2 = ${2 + 2}`;  // "2 + 2 = 4"

// Calling functions
const message = `User: ${getUsername()}`;
```

### Destructuring

**Object Destructuring:**

```javascript
const user = {
  name: 'John',
  email: 'john@example.com',
  age: 30
};

// Extract properties
const { name, email } = user;
console.log(name);   // 'John'
console.log(email);  // 'john@example.com'

// Rename while destructuring
const { name: userName, email: userEmail } = user;

// Default values
const { address = 'Not provided' } = user;

// Nested destructuring
const response = {
  data: {
    user: {
      name: 'John',
      id: 123
    }
  }
};
const { data: { user: { name, id } } } = response;

// Function parameters
function login({ username, password }) {
  console.log(`Logging in ${username}`);
}
login({ username: 'john', password: 'secret' });
```

**Array Destructuring:**

```javascript
const colors = ['red', 'green', 'blue'];

// Extract values
const [first, second] = colors;
console.log(first);   // 'red'
console.log(second);  // 'green'

// Skip elements
const [, , third] = colors;
console.log(third);   // 'blue'

// Rest operator
const [firstColor, ...otherColors] = colors;
console.log(otherColors);  // ['green', 'blue']

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];  // Now a = 2, b = 1

// Function return values
function getTestStats() {
  return [100, 85, 15];  // [total, passed, failed]
}
const [total, passed, failed] = getTestStats();
```

### Spread Operator (...)

```javascript
// Copy arrays
const original = [1, 2, 3];
const copy = [...original];  // New array with same values

// Combine arrays
const array1 = [1, 2];
const array2 = [3, 4];
const combined = [...array1, ...array2];  // [1, 2, 3, 4]

// Add elements
const numbers = [1, 2, 3];
const moreNumbers = [0, ...numbers, 4, 5];  // [0, 1, 2, 3, 4, 5]

// Copy objects
const user = { name: 'John', age: 30 };
const userCopy = { ...user };  // New object with same properties

// Merge objects
const defaults = { timeout: 5000, retries: 3 };
const custom = { timeout: 10000 };
const config = { ...defaults, ...custom };  // { timeout: 10000, retries: 3 }

// Function arguments
const numbers = [1, 5, 3, 9, 2];
Math.max(...numbers);  // 9 (equivalent to Math.max(1, 5, 3, 9, 2))
```

### Rest Parameters

```javascript
// Collect remaining arguments into an array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5);  // 15

// Combine with named parameters
function createUser(name, ...roles) {
  return { name, roles };
}
createUser('John', 'admin', 'editor', 'viewer');
// { name: 'John', roles: ['admin', 'editor', 'viewer'] }
```

### Default Parameters

```javascript
function wait(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
wait();      // Waits 1000ms (default)
wait(2000);  // Waits 2000ms

// Complex default values
function runTest(test, config = { timeout: 5000, retries: 3 }) {
  // config will use default if not provided
}
```

### Object Shorthand

```javascript
const name = 'John';
const age = 30;

// Old way
const user = { name: name, age: age };

// Shorthand (when variable name matches property name)
const user = { name, age };

// Method shorthand
const user = {
  name: 'John',
  // Old way
  greet: function() {
    return `Hello, ${this.name}`;
  },
  // Shorthand
  greet() {
    return `Hello, ${this.name}`;
  }
};
```

---

## 5. TypeScript Fundamentals

### Why TypeScript for Test Automation

TypeScript adds static typing to JavaScript, providing:
- **Error detection at compile time** (before running tests)
- **Better IDE support** (autocomplete, refactoring)
- **Self-documenting code** (types describe expected data)
- **Easier maintenance** (catch breaking changes early)

### Basic Types

```typescript
// Primitive types
let testName: string = 'Login Test';
let duration: number = 1234;
let passed: boolean = true;

// Arrays
let testNames: string[] = ['Test 1', 'Test 2', 'Test 3'];
let durations: number[] = [100, 200, 300];
// Alternative syntax
let results: Array<boolean> = [true, false, true];

// Any (avoid when possible - defeats purpose of TypeScript)
let anything: any = 'string';
anything = 123;  // OK, but loses type safety

// Union types (value can be one of multiple types)
let result: 'passed' | 'failed' | 'skipped';
result = 'passed';  // ✅
// result = 'unknown';  // ❌ Error

let id: string | number;
id = '123';  // ✅
id = 123;    // ✅
```

### Interfaces

```typescript
// Define structure of an object
interface TestCase {
  id: string;
  name: string;
  description: string;
  duration: number;
  status: 'passed' | 'failed' | 'skipped';
  execute: () => Promise<void>;
  tags?: string[];  // Optional property
}

// Usage
const loginTest: TestCase = {
  id: 'TC001',
  name: 'Login Test',
  description: 'Verify login with valid credentials',
  duration: 1200,
  status: 'passed',
  execute: async () => {
    // Test logic
  }
  // tags is optional, can be omitted
};

// Extending interfaces
interface E2ETestCase extends TestCase {
  browser: 'chrome' | 'firefox' | 'safari';
  retries: number;
}

const cypressTest: E2ETestCase = {
  ...loginTest,  // Spread existing properties
  browser: 'chrome',
  retries: 2
};
```

### Type Aliases

```typescript
// Create custom types
type Status = 'passed' | 'failed' | 'skipped';
type TestResult = {
  testId: string;
  status: Status;
  duration: number;
};

// Function types
type TestExecutor = (testCase: TestCase) => Promise<TestResult>;

// Union types
type StringOrNumber = string | number;
type MaybeUser = User | null;
```

### Functions with Types

```typescript
// Typed parameters and return value
function calculatePassRate(
  passed: number,
  failed: number
): string {
  const total = passed + failed;
  const rate = (passed / total) * 100;
  return `${rate.toFixed(2)}%`;
}

// Optional parameters
function runTest(
  name: string,
  timeout?: number  // Optional, can be undefined
): Promise<void> {
  const actualTimeout = timeout ?? 5000;  // Default to 5000 if undefined
  // Test logic
}

// Default parameters
function createConfig(
  baseUrl: string = 'https://example.com',
  timeout: number = 5000
): Config {
  return { baseUrl, timeout };
}

// Rest parameters with types
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
```

### Generics (Reusable Types)

```typescript
// Generic function (works with any type)
function firstElement<T>(array: T[]): T | undefined {
  return array[0];
}

const firstNumber = firstElement([1, 2, 3]);  // Type: number | undefined
const firstName = firstElement(['a', 'b']);   // Type: string | undefined

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Usage with specific types
interface User {
  id: number;
  name: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'John' },
  status: 200,
  message: 'Success'
};

const testResults: ApiResponse<TestResult[]> = {
  data: [
    { testId: 'TC001', status: 'passed', duration: 1200 }
  ],
  status: 200,
  message: 'Tests completed'
};

// Generic retry function
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
    }
  }
  throw new Error('Should never reach here');
}

// Usage
const user = await retry(() => fetchUser(123));  // Type: User
const products = await retry(() => fetchProducts());  // Type: Product[]
```

### Classes with TypeScript

```typescript
class TestRunner {
  // Properties with types
  private results: TestResult[] = [];
  private config: TestConfig;

  constructor(config: TestConfig) {
    this.config = config;
  }

  // Method with typed parameters and return
  async runTest(test: TestCase): Promise<TestResult> {
    const startTime = Date.now();

    try {
      await test.execute();
      const result: TestResult = {
        testId: test.id,
        status: 'passed',
        duration: Date.now() - startTime
      };
      this.results.push(result);
      return result;
    } catch (error) {
      const result: TestResult = {
        testId: test.id,
        status: 'failed',
        duration: Date.now() - startTime
      };
      this.results.push(result);
      return result;
    }
  }

  // Getter with return type
  getResults(): TestResult[] {
    return [...this.results];  // Return copy
  }

  // Method with generics
  filterResults<T extends TestResult>(
    predicate: (result: T) => boolean
  ): T[] {
    return this.results.filter(predicate) as T[];
  }
}

// Interface for dependency injection
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

class TestRunnerWithLogger extends TestRunner {
  constructor(
    config: TestConfig,
    private logger: Logger  // Dependency injection
  ) {
    super(config);
  }

  async runTest(test: TestCase): Promise<TestResult> {
    this.logger.log(`Running test: ${test.name}`);
    const result = await super.runTest(test);
    this.logger.log(`Test ${test.name}: ${result.status}`);
    return result;
  }
}
```

### Real-World Test Framework Example

```typescript
// types.ts
export interface TestCase {
  id: string;
  name: string;
  description: string;
  tags: string[];
  execute: () => Promise<void>;
}

export interface TestResult {
  testId: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: Error;
}

export interface TestSuite {
  name: string;
  tests: TestCase[];
  beforeAll?: () => Promise<void>;
  afterAll?: () => Promise<void>;
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
}

// test-runner.ts
export class TestRunner {
  private results: TestResult[] = [];

  async runSuite(suite: TestSuite): Promise<TestResult[]> {
    if (suite.beforeAll) {
      await suite.beforeAll();
    }

    for (const test of suite.tests) {
      if (suite.beforeEach) {
        await suite.beforeEach();
      }

      const result = await this.runTest(test);
      this.results.push(result);

      if (suite.afterEach) {
        await suite.afterEach();
      }
    }

    if (suite.afterAll) {
      await suite.afterAll();
    }

    return this.results;
  }

  private async runTest(test: TestCase): Promise<TestResult> {
    const startTime = Date.now();

    try {
      await test.execute();
      return {
        testId: test.id,
        name: test.name,
        status: 'passed',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        testId: test.id,
        name: test.name,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error as Error
      };
    }
  }

  getStatistics() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const passRate = ((passed / total) * 100).toFixed(2);

    return { total, passed, failed, passRate: `${passRate}%` };
  }
}

// Usage
const suite: TestSuite = {
  name: 'Login Tests',
  tests: [
    {
      id: 'TC001',
      name: 'Login with valid credentials',
      description: 'User should login successfully',
      tags: ['smoke', 'authentication'],
      execute: async () => {
        // Test logic
      }
    }
  ],
  beforeAll: async () => {
    console.log('Setting up test environment');
  }
};

const runner = new TestRunner();
const results = await runner.runSuite(suite);
console.log(runner.getStatistics());
```

---

## 6. JMeter Performance Testing

### What is JMeter?

Apache JMeter is an open-source tool for:
- Load testing (simulate normal user traffic)
- Stress testing (push system beyond limits)
- Performance testing (measure response times, throughput)
- API testing (validate functionality under load)

### When to Use JMeter

**Good use cases:**
- ✅ Load testing REST APIs
- ✅ Stress testing database connections
- ✅ Simulating concurrent users
- ✅ Performance regression testing in CI/CD

**Not ideal for:**
- ❌ Complex UI interactions (use Cypress or Selenium)
- ❌ JavaScript-heavy SPAs (JMeter doesn't execute JS)
- ❌ Real browser testing (use headless browsers instead)

### JMeter Test Plan Structure

```
Test Plan (root container)
├── Thread Group (simulates users)
│   ├── Number of Threads: 100 (concurrent users)
│   ├── Ramp-Up Period: 60 seconds (time to start all users)
│   ├── Loop Count: 5 (each user repeats actions 5 times)
│   │
│   ├── HTTP Request Sampler (API call)
│   │   ├── Protocol: https
│   │   ├── Server: api.example.com
│   │   ├── Path: /api/users
│   │   ├── Method: GET
│   │
│   ├── Response Assertion (validate response)
│   │   ├── Response Code: 200
│   │   ├── Response Time: < 2000ms
│   │
│   └── Listener (view results)
│       ├── View Results Tree (individual requests)
│       ├── Summary Report (aggregate statistics)
│       └── Graph Results (visual trends)
├── CSV Data Set Config (test data from file)
└── HTTP Cookie Manager (handle cookies)
```

### Key Components Explained

#### 1. Thread Group

Simulates concurrent users executing tests.

**Configuration:**
- **Number of Threads (users)**: How many virtual users to simulate
  - Example: 100 threads = 100 concurrent users
- **Ramp-Up Period (seconds)**: Time to gradually start all users
  - Example: 60s ramp-up for 100 users = 1.67 users start per second
  - Avoids unrealistic spike at test start
- **Loop Count**: How many times each user repeats actions
  - Example: Loop 5 = each user executes test 5 times
  - Infinite loop: Runs until manually stopped or duration limit
- **Duration (optional)**: Run for specific time regardless of loop count

**Real-world example:**
```
Scenario: Test e-commerce site on Black Friday
- Number of Threads: 500 (expected peak concurrent users)
- Ramp-Up Period: 300s (5 minutes to reach peak)
- Loop Count: 10 (each user browses 10 products)
- Duration: 1800s (30 minutes total test)
```

#### 2. HTTP Request Sampler

Configures individual HTTP requests (API calls).

**Configuration:**
- **Protocol**: http or https
- **Server Name or IP**: api.example.com
- **Port**: 80 (http), 443 (https), or custom
- **Method**: GET, POST, PUT, PATCH, DELETE
- **Path**: /api/users/123
- **Parameters**: Query parameters or form data
- **Body Data**: JSON payload for POST/PUT
- **Headers**: Content-Type, Authorization, etc.

**Example: POST request**
```
Method: POST
Path: /api/orders
Headers:
  Content-Type: application/json
  Authorization: Bearer ${auth_token}
Body:
{
  "userId": "${userId}",
  "products": [
    { "id": "${productId}", "quantity": 2 }
  ]
}
```

#### 3. Assertions

Validate that responses meet expectations.

**Types:**
- **Response Assertion**:
  - Response Code: 200, 201, 400, etc.
  - Response Message: "OK", "Created"
  - Response Data: Text contains "success"
  - Response Headers: Content-Type = application/json

- **JSON Assertion**:
  - Validate JSON structure
  - Example: `$.data.userId` exists

- **Duration Assertion**:
  - Ensure response time < threshold
  - Example: Response < 2000ms

**Example:**
```
Response Assertion:
  Field to Test: Response Code
  Pattern Matching Rule: Equals
  Pattern: 200

Duration Assertion:
  Duration in milliseconds: 2000
```

#### 4. Listeners

Display and collect test results.

**Common listeners:**
- **View Results Tree**: See individual requests and responses (debugging)
- **Summary Report**: Aggregate statistics (average, min, max, error%)
- **Aggregate Report**: Detailed statistics with percentiles
- **Graph Results**: Visual representation of response times
- **Backend Listener**: Send results to external tools (InfluxDB, Grafana)

**Important**: Disable heavy listeners (View Results Tree, Graph Results) during actual load tests - they consume significant memory.

#### 5. Config Elements

**HTTP Cookie Manager**:
- Handles cookies automatically (like a browser)
- Essential for session-based authentication

**HTTP Header Manager**:
- Set headers for all requests
- Example: Content-Type, Accept, User-Agent

**CSV Data Set Config**:
- Load test data from CSV file
- Variables can be used in requests

**Example CSV:**
```csv
username,password
user1@example.com,pass123
user2@example.com,pass456
```

**Usage in HTTP Request:**
```
Path: /api/login
Body: { "username": "${username}", "password": "${password}" }
```

### Performance Testing Types

#### Load Testing

**Goal**: Verify application performs well under expected load.

**Example:**
```
Thread Group:
  - Users: 100 (expected normal traffic)
  - Ramp-Up: 60s
  - Duration: 600s (10 minutes)

Success Criteria:
  - Average response time < 1s
  - 95th percentile < 2s
  - Error rate < 1%
  - Throughput >= 50 req/sec
```

#### Stress Testing

**Goal**: Find breaking point - how much load can the system handle?

**Example:**
```
Thread Group:
  - Users: Start at 100, increase by 50 every 5 minutes
  - Ramp-Up: 60s per increment
  - Loop: Infinite
  - Stop when error rate > 5% or response time > 10s

Objective: Identify at what user count system degrades
```

#### Spike Testing

**Goal**: Test system behavior under sudden traffic spikes.

**Example:**
```
Thread Group:
  - Users: 500
  - Ramp-Up: 10s (rapid spike)
  - Duration: 120s
  - Then reduce to 50 users for 300s (recovery)

Objective: Ensure system recovers gracefully after spike
```

#### Endurance Testing (Soak Testing)

**Goal**: Test system stability over extended period (memory leaks, resource exhaustion).

**Example:**
```
Thread Group:
  - Users: 50 (moderate load)
  - Ramp-Up: 60s
  - Duration: 28800s (8 hours)

Objective: Ensure response times and error rates remain stable
```

### CI/CD Integration

JMeter can run in command-line mode for CI/CD pipelines.

**Command:**
```bash
jmeter -n -t test-plan.jmx -l results.jtl -e -o report/

# Flags:
# -n: Non-GUI mode
# -t: Test plan file
# -l: Results log file
# -e: Generate HTML report
# -o: Output folder for report
```

**GitLab CI Example:**
```yaml
performance-test:
  stage: test
  image: justb4/jmeter:5.4.3
  script:
    - jmeter -n -t tests/load-test.jmx -l results.jtl -e -o report/
    - if [ $(grep -c "errors=\"[1-9]" results.jtl) -gt 0 ]; then exit 1; fi
  artifacts:
    paths:
      - report/
    when: always
  only:
    - main
```

**Jenkins Pipeline:**
```groovy
stage('Performance Test') {
  steps {
    sh '''
      jmeter -n -t tests/api-load-test.jmx -l results.jtl
      # Parse results and fail if error rate > 5%
    '''
  }
  post {
    always {
      perfReport sourceDataFiles: 'results.jtl'
    }
  }
}
```

---

## 7. Performance Metrics and Analysis

### Key Metrics

#### Response Time

Time from sending request to receiving full response.

**Types:**
- **Average**: Mean of all response times
  - Good: < 1s for APIs, < 3s for web pages
- **Median (50th percentile)**: Middle value
  - More representative than average (not skewed by outliers)
- **90th percentile**: 90% of requests faster than this
  - Better indicator of user experience
- **95th percentile**: 95% of requests faster than this
- **99th percentile**: 99% of requests faster than this
  - Represents worst-case scenarios

**Example interpretation:**
```
Average: 450ms
Median: 400ms
90th: 800ms
95th: 1200ms
99th: 3000ms

Analysis: Most requests (90%) complete in under 800ms, but 10% take longer,
with worst cases reaching 3s. Investigate slow queries causing long tail.
```

#### Throughput

Requests processed per second (RPS) or transactions per second (TPS).

**Calculation:**
```
Throughput = Total Requests / Total Time

Example:
10,000 requests in 200 seconds = 50 req/sec
```

**Good throughput:**
- Depends on application and infrastructure
- Compare against baseline and requirements
- Declining throughput over time indicates bottleneck

#### Error Rate

Percentage of failed requests.

```
Error Rate = (Failed Requests / Total Requests) × 100%

Example:
50 failures out of 10,000 requests = 0.5%
```

**Acceptable thresholds:**
- < 1%: Excellent
- 1-5%: Acceptable (investigate causes)
- > 5%: Poor (serious issues)

**Common error causes:**
- 4xx errors: Client issues (bad requests, authentication failures)
- 5xx errors: Server issues (crashes, timeouts, database errors)
- Connection errors: Network issues, server overload

#### Latency vs Response Time

- **Latency**: Time for first byte (server processing time)
- **Response Time**: Total time including network transfer

```
Response Time = Latency + Transfer Time

High latency, low response time: Server processing slow
Low latency, high response time: Large response size or slow network
```

#### Standard Deviation

Measure of response time consistency.

```
Low standard deviation: Consistent performance (good)
High standard deviation: Unpredictable performance (investigate)

Example:
Average: 500ms, StdDev: 50ms  ✅ Consistent
Average: 500ms, StdDev: 800ms ❌ Highly variable
```

### Analyzing JMeter Results

#### Summary Report Analysis

```
Label: API /users
Samples: 10000
Average: 450ms
Median: 400ms
90% Line: 800ms
95% Line: 1200ms
99% Line: 3000ms
Min: 120ms
Max: 5400ms
Error %: 0.5%
Throughput: 48.2/sec
KB/sec: 96.4
```

**Interpretation:**
1. **Error rate** (0.5%) is acceptable
2. **Average** (450ms) is good for an API
3. **90th percentile** (800ms) is reasonable
4. Large gap between **95th (1200ms) and 99th (3000ms)** suggests outliers
5. **Throughput** (48.2 req/sec) should be compared against requirements
6. **Max response time** (5.4s) is concerning - investigate what caused it

#### Response Times Over Time

**Patterns to watch:**

**1. Flat line (good):**
```
Response Time (ms)
1000 |------------------------
 800 |------------------------
 600 |------------------------
 400 |------------------------
 200 |------------------------
   0 |________________________
     0min    5min    10min

Interpretation: Consistent performance, system handles load well
```

**2. Increasing trend (bad):**
```
Response Time (ms)
1000 |              ________--
 800 |          ___/
 600 |      ___/
 400 |  ___/
 200 |_/
   0 |________________________
     0min    5min    10min

Interpretation: Performance degrades over time
Possible causes: Memory leak, database connection exhaustion
```

**3. Spikes (investigate):**
```
Response Time (ms)
1000 |        |        |
 800 |        |        |
 600 |        |        |
 400 |--------|--------|------
 200 |
   0 |________________________
     0min    5min    10min

Interpretation: Intermittent slowdowns
Possible causes: Garbage collection, database locks, batch jobs
```

### Bottleneck Identification

**Common bottlenecks:**

1. **Application Server**:
   - Symptom: CPU usage high, response times increase with load
   - Solution: Optimize code, add caching, scale horizontally

2. **Database**:
   - Symptom: Slow queries, database CPU/memory high
   - Solution: Add indexes, optimize queries, connection pooling

3. **Network**:
   - Symptom: High latency, large response sizes
   - Solution: Compress responses, use CDN, optimize payload

4. **External APIs**:
   - Symptom: Response times correlate with third-party API calls
   - Solution: Implement caching, fallback mechanisms, timeouts

**Diagnostic approach:**
```
1. Identify slow endpoint: Which URL has highest response time?
2. Check error logs: Any exceptions or warnings?
3. Monitor resources: CPU, memory, database connections
4. Analyze query patterns: Slow database queries?
5. Check dependencies: External APIs responding slowly?
```

### Real-World Example

**Scenario: E-commerce checkout API performance test**

**Test Configuration:**
```
Thread Group: 200 users
Ramp-Up: 120s
Duration: 600s (10 minutes)
```

**Results:**
```
Endpoint: POST /api/orders
Samples: 12,000
Average: 1,800ms
90th: 3,200ms
95th: 4,500ms
99th: 8,900ms
Error%: 2.3%
Throughput: 20 req/sec
```

**Analysis:**
```
1. Average response time (1.8s) exceeds target (<1s)
2. High percentiles indicate significant slowdowns
3. Error rate (2.3%) is concerning
4. Throughput (20 req/sec) below expected (50 req/sec)
```

**Investigation:**
```
1. Checked application logs: Database connection timeout errors
2. Monitored database: Connection pool exhausted (max 50 connections)
3. Analyzed slow queries: Order creation query taking 800ms
```

**Actions:**
```
1. Increased database connection pool: 50 → 200
2. Added index to orders table: product_id column
3. Implemented Redis caching for product lookups
```

**Retest Results:**
```
Average: 480ms (73% improvement)
90th: 850ms (73% improvement)
Error%: 0.1% (95% reduction)
Throughput: 48 req/sec (140% increase)
```

---

## 8. Performance Testing Strategy

### Planning a Performance Test

**Step 1: Define Objectives**
```
What are we testing?
- API endpoints? Web pages? Database queries?

What do we want to learn?
- Can system handle expected load?
- What's the breaking point?
- Are there performance regressions?

Success criteria?
- Response time < 1s
- Error rate < 1%
- Throughput >= 100 req/sec
```

**Step 2: Identify Critical Scenarios**
```
High-priority:
- User login (authentication)
- Checkout/payment (revenue-critical)
- Search/browse (high traffic)

Lower-priority:
- Admin functions (low volume)
- Help pages (static content)
```

**Step 3: Determine Load Profile**
```
Expected normal load:
- 500 concurrent users during business hours
- 1000 concurrent users during promotions

Peak load:
- 2000 concurrent users (holiday season)

Test scenarios:
- Load test: 500 users (baseline)
- Stress test: Increase to 3000 users (find limit)
- Spike test: Rapid jump to 2000 users (test elasticity)
```

**Step 4: Prepare Test Data**
```
Realistic data:
- Mix of user types (new, returning, admin)
- Variety of products/orders
- Different geographic locations

Data volume:
- Sufficient for testing (no duplicates causing artificial caching)
- Representative of production (size, variety)
```

**Step 5: Configure Test Environment**
```
Production-like:
- Same infrastructure (cloud, on-premise)
- Same configuration (memory, CPU, network)
- Separate from production (don't test on live systems)

Isolated:
- No other processes consuming resources
- Dedicated database
- Stable network
```

**Step 6: Execute Test**
```
Start small:
- Baseline test with 10 users (verify test works)
- Gradually increase load

Monitor:
- Application metrics (response times, errors)
- Infrastructure metrics (CPU, memory, disk, network)
- Database metrics (queries, connections)

Document:
- Test configuration
- Observations during test
- Any anomalies or issues
```

**Step 7: Analyze Results**
```
Compare to baselines:
- Is performance better or worse than last test?

Identify bottlenecks:
- Which components are slow?
- Where are resources constrained?

Document findings:
- Clear metrics
- Root cause analysis
- Recommendations
```

**Step 8: Optimize and Retest**
```
Implement fixes:
- Code optimizations
- Infrastructure scaling
- Database tuning

Retest:
- Verify improvements
- Ensure no regressions in other areas
```

### Best Practices

**Do:**
- ✅ Use realistic user scenarios (don't just hammer one endpoint)
- ✅ Ramp up gradually (avoid artificial spike at start)
- ✅ Run tests multiple times (ensure consistency)
- ✅ Monitor infrastructure during tests (CPU, memory, network)
- ✅ Test in production-like environment
- ✅ Automate performance tests in CI/CD

**Don't:**
- ❌ Test in production (use staging environment)
- ❌ Use unrealistic data (all users doing same action)
- ❌ Ignore infrastructure metrics (focus only on app)
- ❌ Run tests with debugging tools enabled (skews results)
- ❌ Test with tiny datasets (artificial caching effects)
- ❌ Forget to isolate test environment (other processes interfere)

### Integration with CI/CD

**Performance Gate in Pipeline:**
```yaml
stages:
  - build
  - test
  - performance
  - deploy

performance:
  stage: performance
  script:
    - jmeter -n -t load-test.jmx -l results.jtl
    - python analyze_results.py results.jtl
  only:
    - main
  allow_failure: true  # Don't block deployment on performance issues

deploy:
  stage: deploy
  script:
    - deploy_to_production.sh
  when: on_success
```

**Performance Regression Detection:**
```
1. Run performance test after each merge to main
2. Compare metrics to baseline:
   - Response time increased by >20%? 🚨 Alert
   - Throughput decreased by >10%? 🚨 Alert
   - Error rate increased? 🚨 Alert
3. Store historical metrics for trend analysis
4. Generate report and notify team
```

---

## Interview Preparation Tips

### JavaScript/TypeScript Questions

**Practice explaining:**
- "Async/await vs Promises vs callbacks"
  - Start with problem (callback hell), show evolution
  - Demonstrate with code example
  - Mention error handling differences

- "Why use TypeScript for test automation?"
  - Type safety catches errors early
  - Better IDE support (autocomplete, refactoring)
  - Self-documenting code
  - Example: Interface for test case structure

- "Explain how you'd use array methods to process test results"
  - Show filter for failed tests
  - Show map to transform data
  - Show reduce to calculate statistics
  - Combine methods in fluent chain

### Performance Testing Questions

**Practice explaining:**
- "How do you design a performance test?"
  - Define objectives and success criteria
  - Identify critical scenarios
  - Determine load profile (users, ramp-up, duration)
  - Prepare realistic test data
  - Execute, monitor, analyze

- "What's the difference between load, stress, and spike testing?"
  - Load: Expected normal traffic, verify performance meets requirements
  - Stress: Increase load beyond normal to find breaking point
  - Spike: Sudden traffic increase, test elasticity and recovery

- "How do you identify performance bottlenecks?"
  - Analyze metrics: Which endpoints are slow?
  - Check resource utilization: CPU, memory, database
  - Review logs: Errors, slow queries
  - Profile code: Which functions take most time
  - Example: Found database query taking 2s, added index, reduced to 200ms

### Coding Challenges

**Be prepared to:**
- Write async functions with error handling
- Use array methods to process test results
- Define TypeScript interfaces for test data
- Explain code while writing (live coding)

**Example challenge:**
```
"Write a function that takes an array of test results and returns
 statistics (total, passed, failed, pass rate)"

Expected approach:
1. Clarify requirements: What fields exist in test result objects?
2. Write function signature with types (if TypeScript)
3. Use array methods (filter, reduce) to calculate
4. Handle edge cases (empty array, all failed)
5. Return clear result object
6. Test with sample data
```

---

## Summary and Key Takeaways

**JavaScript/TypeScript:**
- Async/await is the modern, readable way to handle asynchronous operations
- Array methods (map, filter, reduce) are essential for processing test data
- TypeScript adds type safety, improves code quality and maintainability
- Practice explaining code concepts out loud

**Performance Testing:**
- JMeter simulates load and measures application performance
- Key metrics: Response time, throughput, error rate, percentiles
- Test types: Load (normal traffic), stress (breaking point), spike (sudden increase)
- Performance testing is part of CI/CD pipeline, not a one-time activity

**Interview Readiness:**
- Prepare STAR format stories with quantifiable results
- Practice coding challenges (LeetCode Easy level)
- Be ready to explain technical concepts clearly in English
- Relate everything back to test automation and BASF role

**Next:** Move to Day 9 for Agile practices, cross-cultural collaboration, and full mock interview.
