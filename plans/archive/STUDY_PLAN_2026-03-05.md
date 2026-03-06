# Study Plan - 2026-03-05

**Topic**: Asyncio - Python Async Programming
**Duration**: 1 hour
**Goal**: Complete the concurrency trifecta (threading -> multiprocessing -> asyncio)

---

## Schedule

| Time | Content | Duration |
|------|---------|----------|
| 0-15 min | Why asyncio? + async/await basics | 15 min |
| 15-35 min | Core patterns (gather, create_task) | 20 min |
| 35-50 min | Practical example: async HTTP | 15 min |
| 50-60 min | Interview questions + summary | 10 min |

---

## Part 1: Why Asyncio? (15 min)

### The Concurrency Comparison

| | Threading | Multiprocessing | Asyncio |
|--|-----------|-----------------|---------|
| Best for | IO-bound | CPU-bound | IO-bound (many) |
| Parallelism | No (GIL) | Yes | No |
| Memory | Shared | Separate | Shared |
| Overhead | Medium | High | Low |
| Complexity | Medium | Medium | Low |

### When to Use Asyncio
- Many IO operations (1000+ connections)
- Web servers, API clients
- Database queries
- File operations

### Basic Syntax

```python
import asyncio

# Define async function
async def fetch_data():
    print("Start fetching")
    await asyncio.sleep(2)  # Non-blocking wait
    print("Done fetching")
    return "data"

# Run async function
async def main():
    result = await fetch_data()
    print(result)

# Entry point
asyncio.run(main())
```

### Key Concepts
- `async def` - Defines a coroutine
- `await` - Pause and wait for result (non-blocking)
- `asyncio.run()` - Entry point to run async code

---

## Part 2: Core Patterns (20 min)

### Pattern 1: Run Multiple Tasks Concurrently

```python
import asyncio

async def task(name, seconds):
    print(f"[{name}] Start")
    await asyncio.sleep(seconds)
    print(f"[{name}] Done")
    return f"{name} result"

async def main():
    # Method 1: gather (wait for all)
    results = await asyncio.gather(
        task("A", 2),
        task("B", 1),
        task("C", 3)
    )
    print(results)  # ['A result', 'B result', 'C result']

asyncio.run(main())
# Total time: 3 seconds (not 6!)
```

### Pattern 2: Create Background Tasks

```python
async def main():
    # Create tasks (start immediately)
    task1 = asyncio.create_task(task("A", 2))
    task2 = asyncio.create_task(task("B", 1))

    # Do other work while tasks run
    print("Tasks started, doing other work...")

    # Wait for results when needed
    result1 = await task1
    result2 = await task2

asyncio.run(main())
```

### Pattern 3: Timeout

```python
async def slow_operation():
    await asyncio.sleep(10)
    return "done"

async def main():
    try:
        result = await asyncio.wait_for(
            slow_operation(),
            timeout=2.0
        )
    except asyncio.TimeoutError:
        print("Operation timed out!")

asyncio.run(main())
```

### Pattern 4: Process as Completed

```python
async def main():
    tasks = [
        asyncio.create_task(task("A", 3)),
        asyncio.create_task(task("B", 1)),
        asyncio.create_task(task("C", 2))
    ]

    # Process results as they complete
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print(f"Got: {result}")

    # Output order: B, C, A (fastest first)

asyncio.run(main())
```

---

## Part 3: Practical Example (15 min)

### Async HTTP Requests

```python
import asyncio
import aiohttp  # pip install aiohttp

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    urls = [
        "https://api.github.com",
        "https://httpbin.org/get",
        "https://jsonplaceholder.typicode.com/posts/1"
    ]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)

        for url, result in zip(urls, results):
            print(f"{url}: {len(result)} bytes")

asyncio.run(main())
```

### Comparison: Sync vs Async

```python
# Sync version: 3 seconds (sequential)
import requests
import time

start = time.time()
for url in urls:
    requests.get(url)
print(f"Sync: {time.time() - start:.2f}s")

# Async version: 1 second (concurrent)
start = time.time()
asyncio.run(main())
print(f"Async: {time.time() - start:.2f}s")
```

### Simple Web Scraper Pattern

```python
import asyncio
import aiohttp

async def scrape(session, url):
    try:
        async with session.get(url, timeout=5) as resp:
            if resp.status == 200:
                return {"url": url, "status": "ok"}
            return {"url": url, "status": resp.status}
    except Exception as e:
        return {"url": url, "status": str(e)}

async def scrape_all(urls, max_concurrent=10):
    # Limit concurrent connections
    semaphore = asyncio.Semaphore(max_concurrent)

    async def limited_scrape(session, url):
        async with semaphore:
            return await scrape(session, url)

    async with aiohttp.ClientSession() as session:
        tasks = [limited_scrape(session, url) for url in urls]
        return await asyncio.gather(*tasks)

# Usage
urls = [f"https://httpbin.org/delay/{i%3}" for i in range(20)]
results = asyncio.run(scrape_all(urls))
```

---

## Part 4: Interview Questions (10 min)

### Q1: What is asyncio and when to use it?
```
Asyncio is Python's async IO framework for writing concurrent code
using async/await syntax.

Use it when:
- Many IO operations (network, file, database)
- Need to handle thousands of connections
- Want single-threaded concurrency (simpler than threading)

Don't use it for:
- CPU-intensive tasks (use multiprocessing)
- Simple scripts with few IO operations
```

### Q2: async/await vs threading?
```
Threading:
- Preemptive: OS switches threads
- Multiple threads, shared memory
- GIL limits parallelism
- Good for: moderate IO, need threads for libraries

Asyncio:
- Cooperative: you control switching with await
- Single thread, event loop
- No GIL issues (single thread)
- Good for: many connections, high concurrency
```

### Q3: What is gather vs create_task?
```
create_task():
- Schedules coroutine to run
- Returns Task object
- Task starts immediately
- Good when you need the Task handle

gather():
- Runs multiple coroutines concurrently
- Returns all results in order
- Simpler API for "run all, wait all"
```

### Q4: How to limit concurrency in asyncio?
```python
# Use Semaphore
semaphore = asyncio.Semaphore(10)

async def limited_task():
    async with semaphore:
        # Only 10 tasks run here at once
        await do_work()
```

### Q5: Common mistakes?
```
1. Forgetting await
   result = fetch_data()  # Wrong: returns coroutine
   result = await fetch_data()  # Correct

2. Blocking the event loop
   time.sleep(1)  # Wrong: blocks everything
   await asyncio.sleep(1)  # Correct

3. Mixing sync and async
   # Wrong: calling sync function in async
   requests.get(url)
   # Correct: use async library
   await session.get(url)
```

---

## Quick Reference

```python
import asyncio

# Define coroutine
async def my_func():
    await asyncio.sleep(1)
    return "result"

# Run single coroutine
asyncio.run(my_func())

# Run multiple concurrently
await asyncio.gather(func1(), func2(), func3())

# Create background task
task = asyncio.create_task(my_func())

# Timeout
await asyncio.wait_for(my_func(), timeout=5.0)

# Process as completed
for coro in asyncio.as_completed(tasks):
    result = await coro

# Limit concurrency
sem = asyncio.Semaphore(10)
async with sem:
    await work()
```

---

## Checklist

- [ ] Understand async/await syntax
- [ ] Can use gather() for concurrent tasks
- [ ] Can use create_task() for background tasks
- [ ] Know how to limit concurrency with Semaphore
- [ ] Can answer 5 interview questions
- [ ] Understand when to use asyncio vs threading vs multiprocessing

---

## After Today

You've completed the Python concurrency trifecta:
1. Threading - for IO-bound tasks
2. Multiprocessing - for CPU-bound tasks
3. Asyncio - for high-concurrency IO

Next suggestions:
- [ ] Practice with aiohttp web scraper
- [ ] Study 08-文件IO.md (File operations)
- [ ] Study 09-模块与包.md (Modules and packages)
