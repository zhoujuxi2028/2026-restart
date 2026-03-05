# Python Concurrency Training Plans

Quick reference for Python threading and multiprocessing.

---

## 1. Threading Basics

### Thread Creation
```python
import threading

# Method 1: Function
thread = threading.Thread(target=worker, args=("arg",))
thread.start()
thread.join()

# Method 2: Class
class WorkerThread(threading.Thread):
    def run(self):
        # task logic
        pass
```

### Core Methods
- `start()` - Start thread
- `join()` - Wait for completion
- `is_alive()` - Check if running
- `daemon = True` - Background thread

### GIL (Global Interpreter Lock)
```
CPU-intensive -> multiprocessing (bypass GIL)
IO-intensive  -> threading (GIL released during IO)
```

---

## 2. Thread Synchronization

### Lock (Mutual Exclusion)
```python
lock = threading.Lock()

# Safe access
with lock:
    shared_data += 1
```

### RLock (Reentrant Lock)
```python
rlock = threading.RLock()

def func1():
    with rlock:
        func2()  # Can re-acquire same lock

def func2():
    with rlock:
        pass
```

### Condition (Wait/Notify)
```python
condition = threading.Condition()

# Consumer
with condition:
    while not ready:
        condition.wait()
    # process data

# Producer
with condition:
    ready = True
    condition.notify()
```

### Semaphore (Limit Concurrency)
```python
# Allow max 3 concurrent
semaphore = threading.Semaphore(3)

with semaphore:
    # Only 3 threads can be here at once
    pass
```

### Event (Signal Flag)
```python
event = threading.Event()

# Waiter
event.wait()  # Block until set

# Signaler
event.set()   # Release all waiters
event.clear() # Reset flag
```

---

## 3. Thread Pool

### ThreadPoolExecutor
```python
from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=5) as executor:
    # Submit tasks
    future = executor.submit(func, arg)
    result = future.result()

    # Batch processing
    results = executor.map(func, items)

    # Process as completed
    futures = [executor.submit(func, i) for i in range(10)]
    for future in as_completed(futures):
        result = future.result()
```

---

## 4. Multiprocessing

### Process Creation
```python
import multiprocessing

if __name__ == '__main__':
    p = multiprocessing.Process(target=func, args=(arg,))
    p.start()
    p.join()
```

### Process Pool
```python
from concurrent.futures import ProcessPoolExecutor

if __name__ == '__main__':
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = executor.map(cpu_task, data_list)
```

### Inter-Process Communication

**Queue (Multi-to-Multi)**
```python
queue = multiprocessing.Queue()

# Producer
queue.put(item)

# Consumer
item = queue.get()
```

**Pipe (Point-to-Point)**
```python
conn1, conn2 = multiprocessing.Pipe()

# Sender
conn1.send(data)

# Receiver
data = conn2.recv()
```

**Shared Memory**
```python
# Single value
shared_int = multiprocessing.Value('i', 0)

# Array
shared_array = multiprocessing.Array('d', [1.0, 2.0, 3.0])
```

---

## 5. Common Patterns

### Producer-Consumer (Queue)
```python
from queue import Queue
import threading

buffer = Queue(maxsize=10)

def producer():
    for i in range(10):
        buffer.put(f"item-{i}")
    buffer.put(None)  # End signal

def consumer():
    while True:
        item = buffer.get()
        if item is None:
            break
        process(item)
        buffer.task_done()
```

### Rate Limiter
```python
semaphore = threading.Semaphore(5)  # 5 requests max

def limited_request():
    with semaphore:
        make_request()
```

### Connection Pool
```python
class ConnectionPool:
    def __init__(self, max_conn=3):
        self.sem = threading.BoundedSemaphore(max_conn)

    def execute(self, query):
        with self.sem:
            # Use connection
            pass
```

---

## 6. Interview Quick Answers

**Q: What is GIL?**
> Global Interpreter Lock. Prevents true parallel execution of Python threads. CPU-intensive tasks should use multiprocessing.

**Q: Thread vs Process?**
> Thread: Shared memory, lightweight, GIL-limited
> Process: Separate memory, heavyweight, true parallelism

**Q: How to ensure thread safety?**
> Use Lock to protect shared resources: `with lock: modify_data()`

**Q: Lock vs RLock?**
> Lock: Cannot re-acquire from same thread (deadlock risk in recursion)
> RLock: Same thread can acquire multiple times

**Q: When to use Semaphore?**
> To limit concurrent access (connection pools, rate limiting)

**Q: How to set max_workers?**
> CPU-intensive: `os.cpu_count()`
> IO-intensive: Higher (20-100)

---

## Selection Guide

| Task Type | Solution |
|-----------|----------|
| IO-intensive (network, file) | ThreadPoolExecutor |
| CPU-intensive (compute) | ProcessPoolExecutor |
| Simple concurrency | threading.Thread |
| Shared data protection | Lock/RLock |
| Producer-consumer | Queue + Condition |
| Limit connections | Semaphore |
| Signal between threads | Event |
