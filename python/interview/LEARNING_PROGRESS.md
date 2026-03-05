# Python Interview 300 - Learning Progress

**Start Date**: 2026-01-23
**Current Status**: Active

---

## Progress Overview

| Date | Topic | Status |
|------|-------|--------|
| 2026-01-23 | Core concepts (10 topics) | Started |
| 2026-02-15 | Threading basics (#221-222) | Completed |
| 2026-02-25 | Thread sync (Lock, Condition) | Completed |
| 2026-02-26 | RLock, Event, ThreadPool | Completed |
| 2026-03-02 | Multiprocessing | Completed |

---

## Completed Topics

### Threading & Multiprocessing

**Threading Basics (Feb 15)**
- Thread creation: `threading.Thread(target=func, args=())`
- Methods: `start()`, `join()`, `is_alive()`
- Daemon threads
- GIL mechanism

**Thread Sync (Feb 25)**
- Lock: `with lock: critical_section`
- Condition: `wait()`, `notify()`, `notify_all()`
- Semaphore: Resource limiting
- Producer-Consumer pattern with Queue

**Advanced Threading (Feb 26)**
- RLock: Reentrant lock for recursive calls
- Event: `set()`, `clear()`, `wait()`
- ThreadPoolExecutor: `submit()`, `map()`, `as_completed()`

**Multiprocessing (Mar 2)**
- Process vs Thread (GIL bypass)
- ProcessPoolExecutor for CPU-intensive tasks
- IPC: Queue (multi-to-multi), Pipe (point-to-point)
- Shared memory: Value, Array

---

## Key Code Templates

### Multi-threading
```python
import threading

def worker(arg):
    pass

threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

### Thread Safety
```python
lock = threading.Lock()
shared_data = 0

def safe_increment():
    global shared_data
    with lock:
        shared_data += 1
```

### Thread Pool
```python
from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(task, i) for i in range(10)]
    for future in as_completed(futures):
        result = future.result()
```

### Process Pool (CPU-intensive)
```python
from concurrent.futures import ProcessPoolExecutor

if __name__ == '__main__':
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = executor.map(cpu_task, data_list)
```

### Producer-Consumer
```python
from queue import Queue

queue = Queue(maxsize=10)

def producer():
    queue.put(item)

def consumer():
    item = queue.get()
    queue.task_done()
```

---

## Interview Quick Reference

### GIL
- Global Interpreter Lock
- CPU-intensive: Use multiprocessing
- IO-intensive: Use threading

### Thread vs Process
| | Thread | Process |
|--|--------|---------|
| Memory | Shared | Independent |
| GIL | Limited | Bypassed |
| CPU tasks | Bad | Good |
| IO tasks | Good | Overkill |

### Sync Mechanisms
| Tool | Purpose | Use Case |
|------|---------|----------|
| Lock | Mutual exclusion | Protect shared data |
| RLock | Reentrant lock | Recursive functions |
| Condition | Wait/notify | Producer-consumer |
| Semaphore | Limit concurrency | Connection pool |
| Event | Signal flag | Start/stop signals |

---

## Next Steps
- [ ] asyncio basics
- [ ] async/await patterns
- [ ] Complete remaining topics (08-16)
