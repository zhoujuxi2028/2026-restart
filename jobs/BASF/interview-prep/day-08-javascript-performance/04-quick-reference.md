# Day 8: Quick Reference

## JavaScript Quick Reference

### Closures
```javascript
function outer() {
  const data = 'private';
  return () => console.log(data);  // Closure
}
```

### Promises
```javascript
fetch('/api')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Async/Await
```javascript
async function getData() {
  try {
    const response = await fetch('/api');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

### Array Methods
```javascript
[1,2,3].map(x => x * 2)              // [2,4,6]
[1,2,3].filter(x => x > 1)           // [2,3]
[1,2,3].reduce((sum, x) => sum + x)  // 6
[1,2,3].find(x => x === 2)           // 2
```

---

## TypeScript Quick Reference

### Type Annotations
```typescript
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;
const arr: string[] = ['a', 'b'];
```

### Interfaces
```typescript
interface User {
  name: string;
  email: string;
  age?: number;  // Optional
}

const user: User = {
  name: 'John',
  email: 'john@example.com'
};
```

### Union Types
```typescript
type Status = 'pending' | 'active' | 'inactive';
const status: Status = 'active';
```

### Generics
```typescript
function wrap<T>(item: T): T[] {
  return [item];
}

wrap<string>('test');  // string[]
```

---

## JMeter Quick Reference

### Thread Group Settings
- **Threads**: Number of concurrent users
- **Ramp-up**: Time to start all users
- **Loop Count**: Repetitions per user

### HTTP Request
```
Server: api.example.com
Port: 443
Protocol: https
Method: POST
Path: /api/endpoint
```

### Assertions
- Response Code: 200
- Response Time: < 2000ms
- Response Body: contains "success"

### Run Non-GUI
```bash
jmeter -n -t test.jmx -l results.jtl
```

---

## Performance Metrics

| Metric | Target |
|--------|--------|
| Response Time | < 2 seconds |
| Error Rate | < 1% |
| Throughput | > 1000 req/s |
| CPU Usage | < 70% |

---

## English Interview Phrases

### Describing Benefits
- "TypeScript **eliminates** runtime type errors"
- "Closures **enable** data encapsulation"
- "Async/await **simplifies** asynchronous code"
- "Performance testing **ensures** system stability"

### Discussing Implementation
- "We **migrated** to TypeScript"
- "I **implemented** performance tests with JMeter"
- "We **optimized** database queries"
- "I **reduced** response time by 60%"

### Quantifying Results
- "Errors **reduced** by 30%"
- "Response time **improved** from 5s to 1.2s"
- "System **handled** 500 concurrent users"
- "This **resulted in** 40% sales increase"

---

## Common Mistakes

### JavaScript
❌ `const arr = []; arr = [1,2,3]` → ✅ `let arr = []`
❌ `if (value == null)` → ✅ `if (value === null)`
❌ Forgetting `await` → Always use `await` with async functions

### TypeScript
❌ `any` type everywhere → ✅ Specific types
❌ Ignoring compiler errors → ✅ Fix all errors

### English
❌ "TypeScript is more better" → ✅ "TypeScript is better"
❌ "We was testing" → ✅ "We were testing"

---

## Key Takeaways

**JavaScript**:
- Closures = function + scope
- Promises handle async operations
- Async/await = cleaner promise syntax
- Event loop = single-threaded concurrency

**TypeScript**:
- Adds type safety to JavaScript
- Interfaces define object shapes
- Catches errors at compile time
- Essential for large test frameworks

**Performance Testing**:
- Load = expected load
- Stress = breaking point
- Spike = sudden surge
- Track: response time, error rate, throughput

---

**Study Priority**:
1. JavaScript async patterns (critical for testing)
2. TypeScript interfaces
3. Performance testing types
4. JMeter basics
