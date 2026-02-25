# 🎯 Python培训计划 - 2026年2月26日

**培训主题**：Python多线程进阶 - RLock、Event、线程池
**学习时长**：1小时
**难度级别**：⭐⭐⭐⭐（中高级）
**学习目标**：掌握RLock递归锁、Event事件和线程池ThreadPoolExecutor

---

## 📅 学习时间安排

| 时间 | 学习内容 | 时长 |
|------|---------|------|
| **0-20分钟** | RLock递归锁 | 20分钟 |
| **20-35分钟** | Event事件机制 | 15分钟 |
| **35-55分钟** | 线程池ThreadPoolExecutor | 20分钟 |
| **55-60分钟** | 总结和面试题 | 5分钟 |

**总计**：1小时

---

## 📚 学习内容

### Part 1: RLock递归锁（20分钟）

#### 为什么需要RLock？（5分钟）

**Lock的限制**：
```python
import threading

lock = threading.Lock()

def func1():
    with lock:
        print("Func1 获取锁")
        func2()  # ❌ 死锁！无法再次获取lock

def func2():
    with lock:  # 尝试再次获取同一个锁
        print("Func2 获取锁")

# func1()  # 会死锁
```

**问题**：
- Lock不可重入（Non-reentrant）
- 同一个线程不能多次获取同一把锁
- 递归调用或嵌套调用时会死锁

#### RLock解决方案（10分钟）

**RLock = Reentrant Lock（可重入锁）**

```python
import threading

rlock = threading.RLock()

def func1():
    with rlock:
        print("Func1 获取锁（第1次）")
        func2()  # ✅ 可以！RLock允许重入
        print("Func1 释放锁（第1次）")

def func2():
    with rlock:  # 同一线程可以再次获取
        print("Func2 获取锁（第2次）")
        print("Func2 释放锁（第2次）")

func1()  # 不会死锁
```

**RLock的工作原理**：
```python
import threading

rlock = threading.RLock()

# RLock记录：
# 1. 哪个线程持有锁
# 2. 持有锁的次数（递归深度）

rlock.acquire()  # 计数: 1
print("获取第1次")

rlock.acquire()  # 计数: 2
print("获取第2次")

rlock.acquire()  # 计数: 3
print("获取第3次")

# 必须释放相同次数
rlock.release()  # 计数: 2
rlock.release()  # 计数: 1
rlock.release()  # 计数: 0，锁被释放

# 如果release次数超过acquire次数，会抛出异常
# rlock.release()  # RuntimeError
```

**RLock vs Lock对比**：

| 特性 | Lock | RLock |
|------|------|-------|
| 重入性 | ❌ 不可重入 | ✅ 可重入 |
| 性能 | ✅ 稍快 | ⚠️ 稍慢 |
| 记录持有者 | ❌ 不记录 | ✅ 记录线程和计数 |
| 使用场景 | 简单临界区 | 递归调用、嵌套调用 |
| 死锁风险 | ⚠️ 递归时会死锁 | ✅ 避免自己锁自己 |

#### 实战案例：银行转账（5分钟）

```python
import threading
import time

class BankAccount:
    def __init__(self, name, balance=0):
        self.name = name
        self.balance = balance
        self.lock = threading.RLock()  # 使用RLock

    def deposit(self, amount):
        """存款"""
        with self.lock:
            print(f"[{self.name}] 存款 {amount}")
            time.sleep(0.01)
            self.balance += amount
            print(f"[{self.name}] 余额：{self.balance}")

    def withdraw(self, amount):
        """取款"""
        with self.lock:
            if self.balance >= amount:
                print(f"[{self.name}] 取款 {amount}")
                time.sleep(0.01)
                self.balance -= amount
                print(f"[{self.name}] 余额：{self.balance}")
                return True
            else:
                print(f"[{self.name}] 余额不足")
                return False

    def transfer_to(self, other, amount):
        """转账到另一个账户"""
        with self.lock:  # 第1次获取锁
            print(f"[转账] 从 {self.name} 转 {amount} 到 {other.name}")

            if self.withdraw(amount):  # ✅ withdraw内部再次获取锁（第2次）
                other.deposit(amount)  # ✅ deposit需要获取other的锁
                print(f"[转账] 成功")
                return True
            else:
                print(f"[转账] 失败")
                return False

# 测试
if __name__ == '__main__':
    account1 = BankAccount("张三", 1000)
    account2 = BankAccount("李四", 500)

    # 转账（会嵌套调用withdraw和deposit）
    account1.transfer_to(account2, 300)

    print(f"\n最终余额：")
    print(f"{account1.name}: {account1.balance}")
    print(f"{account2.name}: {account2.balance}")
```

**关键点**：
- `transfer_to` 获取锁后，调用 `withdraw`
- `withdraw` 内部又要获取锁（RLock允许！）
- 如果用Lock会死锁，RLock完美解决

---

### Part 2: Event事件机制（15分钟）

#### Event概念（5分钟）

**Event是什么？**
- Event = 线程间的信号灯
- 一个线程发出信号，其他线程等待信号
- 比Condition更简单，适合简单的通知场景

**Event的状态**：
```
False（未设置） ──set()──> True（已设置）
     ⬆                        │
     └────────clear()──────────┘
```

**核心方法**：
```python
import threading

event = threading.Event()

# 1. set() - 设置事件为True，唤醒所有等待的线程
event.set()

# 2. clear() - 清除事件，设置为False
event.clear()

# 3. wait(timeout=None) - 等待事件被设置
event.wait()  # 阻塞直到事件为True
event.wait(timeout=2)  # 最多等待2秒

# 4. is_set() - 检查事件状态
if event.is_set():
    print("事件已设置")
```

#### Event基础使用（5分钟）

```python
import threading
import time

# 场景：启动信号
start_event = threading.Event()

def worker(name):
    print(f"[{name}] 准备就绪，等待启动信号...")
    start_event.wait()  # 等待启动信号
    print(f"[{name}] 收到启动信号，开始工作！")
    time.sleep(1)
    print(f"[{name}] 工作完成")

# 创建3个工作线程
threads = [threading.Thread(target=worker, args=(f"线程{i}",)) for i in range(3)]

# 启动所有线程（它们会等待）
for t in threads:
    t.start()

print("[主线程] 所有线程已启动，等待2秒...")
time.sleep(2)

print("[主线程] 发送启动信号！")
start_event.set()  # 发送信号，所有线程同时开始

for t in threads:
    t.join()

print("[主线程] 所有线程完成")
```

#### 实战案例：任务完成通知（5分钟）

```python
import threading
import time
import random

class TaskMonitor:
    def __init__(self):
        self.task_done = threading.Event()
        self.result = None

    def long_running_task(self):
        """耗时任务"""
        print("[任务] 开始执行...")
        time.sleep(random.uniform(2, 4))  # 模拟耗时操作

        self.result = "任务执行结果：成功"
        print("[任务] 执行完成！")

        self.task_done.set()  # 通知任务完成

    def wait_for_result(self, timeout=None):
        """等待任务完成"""
        print("[等待] 等待任务完成...")

        if self.task_done.wait(timeout=timeout):
            print("[等待] 任务已完成，获取结果")
            return self.result
        else:
            print("[等待] 等待超时")
            return None

# 测试
monitor = TaskMonitor()

# 启动任务线程
task_thread = threading.Thread(target=monitor.long_running_task)
task_thread.start()

# 主线程等待结果
result = monitor.wait_for_result(timeout=5)
print(f"[主线程] 获得结果: {result}")

task_thread.join()
```

**Event的典型场景**：
- ✅ 启动信号（多个线程同时开始）
- ✅ 任务完成通知
- ✅ 暂停/恢复机制
- ✅ 一对多的简单通知

---

### Part 3: 线程池ThreadPoolExecutor（20分钟）

#### 为什么需要线程池？（5分钟）

**手动管理线程的问题**：
```python
import threading

# ❌ 每次都创建新线程，开销大
def process_task(task_id):
    print(f"处理任务 {task_id}")

# 处理100个任务，创建100个线程（浪费！）
threads = []
for i in range(100):
    t = threading.Thread(target=process_task, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

**线程池的优势**：
- ✅ 复用线程，减少创建/销毁开销
- ✅ 控制并发数量，避免资源耗尽
- ✅ 任务队列管理，自动调度
- ✅ 异步执行，获取返回值
- ✅ 异常处理更方便

#### ThreadPoolExecutor基础（10分钟）

```python
from concurrent.futures import ThreadPoolExecutor
import time

# 创建线程池（最多3个工作线程）
executor = ThreadPoolExecutor(max_workers=3)

def task(name):
    print(f"[任务 {name}] 开始")
    time.sleep(2)
    print(f"[任务 {name}] 完成")
    return f"结果-{name}"

# 提交任务（异步执行）
future1 = executor.submit(task, "A")
future2 = executor.submit(task, "B")
future3 = executor.submit(task, "C")

print("任务已提交，继续执行其他代码...")

# 获取结果（阻塞直到任务完成）
result1 = future1.result()  # 等待任务A完成
result2 = future2.result()
result3 = future3.result()

print(f"结果: {result1}, {result2}, {result3}")

# 关闭线程池
executor.shutdown(wait=True)  # 等待所有任务完成
```

**核心方法**：
```python
from concurrent.futures import ThreadPoolExecutor

# 1. submit() - 提交单个任务，返回Future对象
future = executor.submit(func, arg1, arg2)

# 2. map() - 批量提交任务，自动获取结果
results = executor.map(func, [1, 2, 3, 4, 5])

# 3. shutdown() - 关闭线程池
executor.shutdown(wait=True)  # 等待所有任务完成

# 4. Future对象方法
future.result(timeout=None)  # 获取结果（阻塞）
future.done()  # 任务是否完成
future.cancel()  # 取消任务
future.exception()  # 获取异常
```

#### 实战案例：批量下载（5分钟）

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import random

def download_file(url):
    """模拟下载文件"""
    print(f"[下载] 开始下载 {url}")
    time.sleep(random.uniform(1, 3))  # 模拟下载时间

    # 模拟随机失败
    if random.random() < 0.2:
        raise Exception(f"{url} 下载失败")

    print(f"[下载] {url} 完成")
    return f"{url} - 下载成功"

# 批量下载URL
urls = [f"https://example.com/file{i}.zip" for i in range(10)]

# 方式1：使用submit + as_completed（推荐）
print("=== 方式1: submit + as_completed ===")
with ThreadPoolExecutor(max_workers=3) as executor:
    # 提交所有任务
    future_to_url = {executor.submit(download_file, url): url for url in urls}

    # 按完成顺序获取结果
    for future in as_completed(future_to_url):
        url = future_to_url[future]
        try:
            result = future.result()
            print(f"✅ {result}")
        except Exception as e:
            print(f"❌ {url} 失败: {e}")

# 方式2：使用map（简单但不能处理异常）
print("\n=== 方式2: map ===")
urls2 = [f"https://example.com/doc{i}.pdf" for i in range(5)]

with ThreadPoolExecutor(max_workers=3) as executor:
    results = executor.map(download_file, urls2)

    for result in results:
        print(f"✅ {result}")
```

**with语句自动管理**：
```python
# ✅ 推荐：with语句自动shutdown
with ThreadPoolExecutor(max_workers=5) as executor:
    # 提交任务
    futures = [executor.submit(task, i) for i in range(10)]

    # 获取结果
    for future in as_completed(futures):
        result = future.result()
# 自动shutdown(wait=True)

# ❌ 不推荐：手动管理
executor = ThreadPoolExecutor(max_workers=5)
# ... 使用 ...
executor.shutdown(wait=True)
```

---

### Part 4: 总结和面试题（5分钟）

#### 知识点速记

**RLock递归锁**：
```python
# 允许同一线程多次获取，必须释放相同次数
rlock = threading.RLock()
with rlock:
    # 可以再次获取rlock
    with rlock:
        pass
```

**Event事件**：
```python
# 线程间信号灯
event = threading.Event()
event.wait()  # 等待信号
event.set()   # 发送信号
event.clear() # 清除信号
```

**线程池**：
```python
# 复用线程，控制并发
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=5) as executor:
    future = executor.submit(func, arg)
    result = future.result()
```

#### 面试高频问题

**Q1: Lock和RLock的区别？**
```
答：
- Lock不可重入，同一线程不能多次获取
- RLock可重入，同一线程可多次获取，需释放相同次数
- RLock记录持有线程和计数，Lock不记录
- 使用场景：递归调用用RLock，简单临界区用Lock
```

**Q2: Event和Condition的区别？**
```
答：
- Event更简单，只有两个状态（True/False）
- Condition更复杂，支持wait、notify、notify_all
- Event适合简单的一对多通知
- Condition适合复杂的生产者-消费者模式
```

**Q3: 什么时候用线程池？**
```
答：
- 任务数量多，频繁创建销毁线程
- 需要控制并发数量
- 需要异步执行并获取返回值
- IO密集型任务（网络请求、文件读写）
优势：复用线程、控制并发、自动调度、异常处理
```

**Q4: ThreadPoolExecutor的max_workers如何设置？**
```
答：
- IO密集型：max_workers = CPU核数 × (1 + IO等待时间/CPU时间)
  例如：4核CPU，IO等待是CPU的10倍 → 4 × (1+10) = 44
- CPU密集型：不应该用线程池，应该用进程池
- 经验值：IO密集型一般设置为 20-100
- 可以通过测试找到最优值
```

**Q5: 如何取消线程池中的任务？**
```
答：
future = executor.submit(task)
if future.cancel():  # 只能取消未开始的任务
    print("取消成功")
else:
    print("任务已开始，无法取消")

对于已开始的任务，需要在任务内部实现取消逻辑（检查标志位）
```

---

## 📊 学习检验清单

**RLock递归锁**：
- [ ] 理解Lock的死锁问题
- [ ] 掌握RLock的重入机制
- [ ] 能够选择Lock vs RLock
- [ ] 会用RLock实现嵌套调用

**Event事件**：
- [ ] 理解Event的信号机制
- [ ] 掌握set()、clear()、wait()
- [ ] 能够实现启动信号
- [ ] 能够实现任务完成通知

**线程池**：
- [ ] 理解线程池的优势
- [ ] 掌握submit()和map()
- [ ] 会使用as_completed()
- [ ] 能够处理异常和超时

**面试准备**：
- [ ] 能回答5个高频问题
- [ ] 能够对比不同同步机制
- [ ] 能够选择合适的工具

---

## 💡 实战练习

### 练习1：RLock实现递归斐波那契缓存
```python
import threading

class FibCache:
    def __init__(self):
        self.cache = {}
        self.lock = threading.RLock()

    def fib(self, n):
        with self.lock:
            if n in self.cache:
                return self.cache[n]

            if n <= 1:
                result = n
            else:
                # 递归调用，会再次获取锁
                result = self.fib(n-1) + self.fib(n-2)

            self.cache[n] = result
            return result

# 测试
cache = FibCache()
print(cache.fib(10))
```

### 练习2：Event实现暂停/恢复
```python
import threading
import time

class PausableWorker:
    def __init__(self):
        self.paused = threading.Event()
        self.paused.set()  # 初始为运行状态

    def work(self):
        for i in range(10):
            self.paused.wait()  # 如果暂停，在这里等待
            print(f"任务 {i}")
            time.sleep(1)

    def pause(self):
        self.paused.clear()
        print("暂停")

    def resume(self):
        self.paused.set()
        print("恢复")

# 测试
worker = PausableWorker()
thread = threading.Thread(target=worker.work)
thread.start()

time.sleep(3)
worker.pause()
time.sleep(2)
worker.resume()
thread.join()
```

### 练习3：线程池处理批量任务
```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def process_data(data_id):
    """处理数据"""
    time.sleep(1)
    return f"数据{data_id}处理完成"

# 处理100个数据，使用10个线程
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(process_data, i) for i in range(100)]

    for future in as_completed(futures):
        result = future.result()
        print(result)
```

---

## 📝 今日学习记录

### 完成情况
| 内容 | 完成 | 理解程度 | 备注 |
|------|------|---------|------|
| RLock递归锁 | ☐ | ___/10 | |
| Event事件 | ☐ | ___/10 | |
| 线程池 | ☐ | ___/10 | |
| 面试问题 | ☐ | ___/5 | |

### 学习用时
- 开始时间：___:___
- 结束时间：___:___
- 总用时：___分钟

### 学习心得
_____________________________________________________
_____________________________________________________
_____________________________________________________

---

## 🎯 明日学习计划

建议继续学习：
- [ ] 多进程基础（multiprocessing.Process）
- [ ] 进程池（ProcessPoolExecutor）
- [ ] 进程间通信（Queue、Pipe）
- [ ] 异步编程（asyncio入门）

---

**培训制作时间**：2026-02-26
**培训师**：Claude Sonnet 4.5
**学习者**：Michael

**加油！继续提升！** 💪🚀
