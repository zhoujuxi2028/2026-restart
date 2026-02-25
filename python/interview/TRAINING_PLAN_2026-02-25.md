# 🎯 Python培训计划 - 2026年2月25日

**培训主题**：Python多线程同步机制深入学习
**学习时长**：3小时（进阶版）/ 2小时（基础版）
**难度级别**：⭐⭐⭐⭐（中高级）/ ⭐⭐⭐（基础版）
**学习目标**：掌握线程同步的4种核心机制，能够解决线程安全问题

---

## 🎓 学习版本选择指南

本培训提供三个版本，请根据自己的时间选择：

### 🎯 精简版（适合时间紧张，1小时）⭐ 推荐
**适合人群**：
- ✅ 只有1小时学习时间
- ✅ 需要快速掌握核心要点
- ✅ 准备面试突击复习

**学习内容**：
- ✅ 多线程和GIL核心知识（15分钟）
- ✅ Lock锁快速上手（20分钟）
- ✅ 生产者-消费者核心案例（15分钟）
- ✅ 面试高频问题（10分钟）

**跳转到**：👉 [精简版学习计划](#精简版学习计划1小时) ⭐

### 📘 基础版（适合初学者，2小时）
**适合人群**：
- ✅ 刚学习完线程基础的学员
- ✅ 需要快速掌握核心概念的学员
- ✅ 时间有限的学员

**学习内容**：
- ✅ 详细的多线程基础和GIL复习（40分钟）
- ✅ Lock锁基础（30分钟）
- ✅ 生产者-消费者简化案例（30分钟）
- ✅ Semaphore基础应用（20分钟）

**跳转到**：👉 [基础版学习计划](#基础版学习计划2小时)

### 📕 进阶版（适合有基础的学员，3小时）
**适合人群**：
- ✅ 已经掌握线程基础的学员
- ✅ 需要深入学习同步机制的学员
- ✅ 准备面试的学员

**学习内容**：
- ✅ 快速复习（20分钟）
- ✅ Lock + RLock深入学习（60分钟）
- ✅ Condition条件变量详解（60分钟）
- ✅ Semaphore + 综合实战（60分钟）

**跳转到**：👉 [进阶版学习计划](#进阶版学习计划3小时)

---

## 🎯 精简版学习计划（1小时）⭐

### 精简版时间安排

| 时间 | 学习内容 | 时长 |
|------|---------|------|
| **0-15分钟** | 多线程和GIL核心知识 | 15分钟 |
| **15-35分钟** | Lock锁快速上手 | 20分钟 |
| **35-50分钟** | 生产者-消费者核心案例 | 15分钟 |
| **50-60分钟** | 面试高频问题速记 | 10分钟 |

**总计**：1小时

---

### Part 1: 多线程和GIL核心知识（15分钟）

#### 1. 线程基础（5分钟）

**核心概念**：
```python
import threading
import time

# 创建线程的标准方式
def worker(name):
    print(f"{name} 开始工作")
    time.sleep(1)
    print(f"{name} 完成工作")

# 创建并启动线程
thread = threading.Thread(target=worker, args=("线程1",))
thread.start()  # 启动线程
thread.join()   # 等待线程结束
```

**关键方法**：
- `Thread(target=func, args=(...))`：创建线程
- `start()`：启动线程
- `join()`：等待线程结束
- `daemon=True`：设置守护线程（主线程结束时自动终止）

#### 2. GIL机制（5分钟）

**核心要点**：
- GIL = 全局解释器锁
- 同一时间只有一个线程执行Python代码
- **CPU密集型**：多线程无效 → 用 **multiprocessing**
- **IO密集型**：多线程有效 → 用 **threading**

**记忆口诀**：
```
CPU密集用进程，IO密集用线程
```

**快速判断**：
```python
# CPU密集型（大量计算）- 多线程无效
def cpu_task():
    sum(i**2 for i in range(1000000))

# IO密集型（等待IO）- 多线程有效
def io_task():
    time.sleep(1)  # 网络请求、文件读写
```

#### 3. 线程安全问题（5分钟）

**问题代码**：
```python
counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1  # 不是原子操作！

# 10个线程同时执行
threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)  # 不是 1000000！
```

**为什么？**
- `counter += 1` 分为3步：读取、计算、写入
- 多线程同时执行会导致数据丢失

---

### Part 2: Lock锁快速上手（20分钟）

#### Lock基础（10分钟）

**使用Lock修复线程安全问题**：
```python
import threading

counter = 0
lock = threading.Lock()  # 创建锁

def increment():
    global counter
    for _ in range(100000):
        with lock:  # 获取锁
            counter += 1
        # 自动释放锁

# 10个线程
threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)  # 现在一定是 1000000
```

**Lock使用模板**：
```python
lock = threading.Lock()

# 方式1：with语句（推荐）
with lock:
    # 受保护的代码
    pass

# 方式2：手动加锁（不推荐）
lock.acquire()
try:
    # 受保护的代码
    pass
finally:
    lock.release()
```

#### 实战案例：银行账户（10分钟）

```python
import threading
import time

class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance
        self.lock = threading.Lock()

    def withdraw(self, amount):
        """取款"""
        with self.lock:
            if self.balance >= amount:
                print(f"{threading.current_thread().name} 取款 {amount}")
                time.sleep(0.01)  # 模拟处理延迟
                self.balance -= amount
                print(f"余额：{self.balance}")
                return True
            else:
                print(f"{threading.current_thread().name} 余额不足")
                return False

# 测试：2个线程同时取款
account = BankAccount(1000)

threads = [
    threading.Thread(target=account.withdraw, args=(600,), name="线程1"),
    threading.Thread(target=account.withdraw, args=(600,), name="线程2")
]

for t in threads: t.start()
for t in threads: t.join()

print(f"最终余额：{account.balance}")  # 正确：400（只有一个成功）
```

**关键点**：
- Lock保证同一时间只有一个线程执行临界区代码
- 防止数据竞争和不一致

---

### Part 3: 生产者-消费者核心案例（15分钟）

#### 使用Queue实现（最简单）

```python
import threading
import time
import random
from queue import Queue

# Queue是线程安全的
buffer = Queue(maxsize=5)

def producer(name, count):
    """生产者"""
    for i in range(count):
        item = f"{name}-商品{i}"
        buffer.put(item)  # 满了会自动等待
        print(f"[生产者-{name}] 生产 {item}")
        time.sleep(random.uniform(0.1, 0.3))

def consumer(name, count):
    """消费者"""
    for i in range(count):
        item = buffer.get()  # 空了会自动等待
        print(f"[消费者-{name}] 消费 {item}")
        buffer.task_done()
        time.sleep(random.uniform(0.2, 0.4))

# 启动：2个生产者，2个消费者
threads = [
    threading.Thread(target=producer, args=("A", 10)),
    threading.Thread(target=producer, args=("B", 10)),
    threading.Thread(target=consumer, args=("1", 10)),
    threading.Thread(target=consumer, args=("2", 10))
]

for t in threads: t.start()
for t in threads: t.join()

print("完成！")
```

**Queue核心方法**：
- `Queue(maxsize=N)`：创建队列
- `put(item)`：放入元素（满了会等待）
- `get()`：取出元素（空了会等待）
- `task_done()`：标记任务完成
- `qsize()`：队列大小

**使用场景**：
- 任务队列
- 消息队列
- 数据缓冲区

---

### Part 4: 面试高频问题速记（10分钟）

#### 必背5题

**Q1: 什么是GIL？有什么影响？**
```
答：GIL是全局解释器锁，确保同一时间只有一个线程执行Python字节码。
影响：
- CPU密集型任务：多线程无法利用多核，需要用multiprocessing
- IO密集型任务：影响不大，因为IO操作会释放GIL
```

**Q2: 如何保证线程安全？**
```
答：使用锁（Lock）保护共享资源的访问。
示例：
lock = threading.Lock()
with lock:
    # 修改共享变量
    counter += 1
```

**Q3: 线程和进程的区别？**
```
答：
- 线程：轻量级，共享内存，创建快，但受GIL限制
- 进程：重量级，独立内存，创建慢，但可真正并行
选择：CPU密集用进程，IO密集用线程
```

**Q4: 生产者-消费者模式是什么？**
```
答：生产者生产数据，消费者消费数据，通过缓冲区解耦。
Python实现：使用Queue模块，自动处理线程安全和等待/通知。
```

**Q5: 守护线程是什么？**
```
答：守护线程是后台线程，主线程结束时会自动终止。
设置：thread.daemon = True
使用场景：日志记录、心跳检测等后台任务
```

#### 核心代码模板

**多线程模板**：
```python
import threading

def worker(arg):
    # 任务逻辑
    pass

threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

**线程安全模板**：
```python
import threading

lock = threading.Lock()
shared_data = 0

def safe_increment():
    global shared_data
    with lock:
        shared_data += 1
```

**生产者-消费者模板**：
```python
from queue import Queue
import threading

queue = Queue(maxsize=10)

def producer():
    queue.put(item)

def consumer():
    item = queue.get()
    # 处理item
    queue.task_done()
```

#### 快速复习卡片

```
┌─────────────────────────────────┐
│ 多线程核心知识卡片              │
├─────────────────────────────────┤
│ 创建：Thread(target=f, args=()) │
│ 启动：thread.start()            │
│ 等待：thread.join()             │
│ 守护：thread.daemon = True      │
│                                 │
│ GIL：CPU密集用进程，IO密集用线程│
│                                 │
│ 线程安全：用Lock保护共享资源    │
│ 模板：with lock: 修改数据       │
│                                 │
│ 队列：from queue import Queue   │
│ 生产：queue.put(item)           │
│ 消费：item = queue.get()        │
└─────────────────────────────────┘
```

---

### 精简版总结

**1小时你学会了**：
- ✅ 多线程的创建和基本使用
- ✅ GIL机制和并发方案选择
- ✅ 使用Lock保证线程安全
- ✅ 使用Queue实现生产者-消费者
- ✅ 5个面试高频问题的标准答案

**下一步**：
- 如果还有时间，可以学习 RLock、Semaphore
- 实践更多案例巩固知识
- 阅读官方文档深入理解

**学习检验**：
- [ ] 能独立写出多线程代码
- [ ] 能解释GIL对不同任务的影响
- [ ] 能使用Lock修复线程安全问题
- [ ] 能实现简单的生产者-消费者
- [ ] 能回答5个面试高频问题

---

## 📘 基础版学习计划（2小时）

### 基础版时间安排

| 时间段 | 学习内容 | 时长 | 形式 |
|--------|---------|------|------|
| **阶段一 9:00-9:40** | 多线程基础和GIL详细复习 | 40分钟 | 理论+实践 |
| **阶段二 9:40-10:10** | Lock锁基础应用 | 30分钟 | 理论+实践 |
| **阶段三 10:10-10:20** | 休息 | 10分钟 | - |
| **阶段四 10:20-10:50** | 生产者-消费者简化案例 | 30分钟 | 理论+实践 |
| **阶段五 10:50-11:10** | Semaphore信号量基础 | 20分钟 | 理论+实践 |
| **阶段六 11:10-11:20** | 总结和答疑 | 10分钟 | 复习总结 |

**总计**：2小时纯学习时间

---

### 阶段一：多线程基础和GIL详细复习（40分钟）⏰ 9:00-9:40

#### 📌 Part 1: 多线程基础知识（20分钟）

##### 1.1 什么是线程？（5分钟）

**概念理解**：
- **进程 vs 线程**
  ```
  进程（Process）         线程（Thread）
  ├── 独立的内存空间      ├── 共享进程的内存空间
  ├── 资源隔离           ├── 资源共享
  ├── 创建开销大          ├── 创建开销小
  ├── 通信复杂           ├── 通信简单
  └── 稳定性高           └── 一个线程崩溃可能影响整个进程
  ```

- **线程的特点**
  - 轻量级：比进程占用更少资源
  - 共享内存：可以直接访问进程的全局变量
  - 并发执行：多个线程可以同时运行
  - 上下文切换快：切换开销比进程小

**实践代码**：
```python
import threading
import time

# 串行执行
def task_serial():
    for i in range(3):
        print(f"任务 {i}")
        time.sleep(1)

start = time.time()
task_serial()
task_serial()
print(f"串行用时：{time.time() - start:.2f}秒")  # 约6秒

# 并发执行
def task_concurrent(name):
    for i in range(3):
        print(f"{name} - 任务 {i}")
        time.sleep(1)

start = time.time()
t1 = threading.Thread(target=task_concurrent, args=("线程1",))
t2 = threading.Thread(target=task_concurrent, args=("线程2",))
t1.start()
t2.start()
t1.join()
t2.join()
print(f"并发用时：{time.time() - start:.2f}秒")  # 约3秒
```

##### 1.2 创建线程的两种方式（5分钟）

**方式1：使用Thread类**
```python
import threading

def worker(name, count):
    for i in range(count):
        print(f"{name}: 执行第 {i+1} 次")

# 创建线程
thread = threading.Thread(
    target=worker,           # 目标函数
    args=("工作线程", 3),     # 位置参数
    name="Worker-1"          # 线程名称（可选）
)

# 启动线程
thread.start()

# 等待线程结束
thread.join()

print("主线程结束")
```

**方式2：继承Thread类**
```python
import threading

class WorkerThread(threading.Thread):
    def __init__(self, name, count):
        super().__init__()
        self.worker_name = name
        self.count = count

    def run(self):
        """重写run方法"""
        for i in range(self.count):
            print(f"{self.worker_name}: 执行第 {i+1} 次")

# 创建并启动线程
thread = WorkerThread("工作线程", 3)
thread.start()
thread.join()

print("主线程结束")
```

**两种方式对比**：
| 特性 | Thread类 | 继承Thread |
|------|---------|-----------|
| 简洁性 | ✅ 更简洁 | 需要定义类 |
| 灵活性 | 基本够用 | ✅ 更灵活 |
| 推荐场景 | 简单任务 | 复杂任务 |

##### 1.3 线程的核心方法（5分钟）

**常用方法详解**：

```python
import threading
import time

def worker():
    print(f"线程 {threading.current_thread().name} 开始")
    time.sleep(2)
    print(f"线程 {threading.current_thread().name} 结束")

# 创建线程
thread = threading.Thread(target=worker, name="Worker-1")

# 1. start() - 启动线程
thread.start()
print(f"线程已启动：{thread.is_alive()}")  # True

# 2. is_alive() - 检查线程是否还在运行
print(f"线程运行中：{thread.is_alive()}")  # True

# 3. join() - 等待线程结束
thread.join()
print(f"线程已结束：{thread.is_alive()}")  # False

# 4. join(timeout) - 最多等待指定秒数
thread2 = threading.Thread(target=lambda: time.sleep(5))
thread2.start()
thread2.join(timeout=2)  # 最多等2秒
if thread2.is_alive():
    print("线程还在运行，不再等待")
```

**线程属性**：
```python
import threading

def worker():
    pass

thread = threading.Thread(target=worker, name="MyWorker")
thread.start()

# 线程属性
print(f"线程名称：{thread.name}")           # MyWorker
print(f"线程ID：{thread.ident}")           # 系统分配的ID
print(f"是否守护线程：{thread.daemon}")     # False
print(f"是否存活：{thread.is_alive()}")    # True

thread.join()
```

##### 1.4 守护线程（Daemon Thread）（5分钟）

**概念**：
- 守护线程是后台线程
- 主线程结束时，守护线程会自动终止
- 非守护线程会阻止程序退出

**对比示例**：

```python
import threading
import time

def background_task():
    for i in range(10):
        print(f"后台任务 {i}")
        time.sleep(1)

# 情况1：非守护线程（默认）
print("=== 非守护线程 ===")
thread1 = threading.Thread(target=background_task)
thread1.daemon = False  # 默认就是False
thread1.start()
time.sleep(2)
print("主线程结束")
# 结果：程序会等待thread1执行完才退出

# 情况2：守护线程
print("\n=== 守护线程 ===")
thread2 = threading.Thread(target=background_task)
thread2.daemon = True  # 设置为守护线程
thread2.start()
time.sleep(2)
print("主线程结束")
# 结果：主线程结束后，thread2立即终止
```

**守护线程的使用场景**：
- ✅ 日志记录线程
- ✅ 心跳检测线程
- ✅ 后台监控线程
- ❌ 不适合做数据处理（可能会被强制终止）

#### 📌 Part 2: GIL机制详解（20分钟）

##### 2.1 什么是GIL？（5分钟）

**GIL = Global Interpreter Lock（全局解释器锁）**

**定义**：
- Python（CPython）的内存管理不是线程安全的
- GIL是一把全局锁，确保同一时间只有一个线程执行Python字节码
- 即使在多核CPU上，Python线程也无法实现真正的并行计算

**形象比喻**：
```
想象一个厨房（CPU）有4个炉灶（4核），但只有1把铲子（GIL）：
┌─────────────────────────────────┐
│  厨房（CPU）                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │炉灶│ │炉灶│ │炉灶│ │炉灶│   │
│  └────┘ └────┘ └────┘ └────┘   │
│           ⬇️                     │
│         🥄（GIL）                │
│      只有1把铲子                  │
└─────────────────────────────────┘

多个厨师（线程）必须轮流使用这把铲子，
即使有4个炉灶，同一时间也只有1个厨师能做菜。
```

**查看GIL切换间隔**：
```python
import sys

# GIL切换间隔（秒）
print(f"GIL切换间隔：{sys.getswitchinterval()}秒")  # 默认：0.005秒（5毫秒）

# 这意味着每5毫秒，Python会尝试切换到另一个线程
```

##### 2.2 GIL的影响（10分钟）

**实验1：CPU密集型任务**
```python
import threading
import time

def cpu_intensive(n):
    """CPU密集型：大量计算"""
    count = 0
    for i in range(n):
        count += i ** 2
    return count

# 单线程
print("=== 单线程 ===")
start = time.time()
result1 = cpu_intensive(10_000_000)
result2 = cpu_intensive(10_000_000)
print(f"单线程用时：{time.time() - start:.2f}秒")

# 多线程（2个线程）
print("\n=== 多线程 ===")
start = time.time()
t1 = threading.Thread(target=cpu_intensive, args=(10_000_000,))
t2 = threading.Thread(target=cpu_intensive, args=(10_000_000,))
t1.start()
t2.start()
t1.join()
t2.join()
print(f"多线程用时：{time.time() - start:.2f}秒")

# 结果：多线程可能更慢！因为有GIL和线程切换开销
```

**实验2：IO密集型任务**
```python
import threading
import time

def io_intensive():
    """IO密集型：等待IO操作"""
    time.sleep(1)  # 模拟网络请求或文件读写
    return "完成"

# 串行执行
print("=== 串行执行 ===")
start = time.time()
for _ in range(5):
    io_intensive()
print(f"串行用时：{time.time() - start:.2f}秒")  # 约5秒

# 多线程执行
print("\n=== 多线程执行 ===")
start = time.time()
threads = [threading.Thread(target=io_intensive) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print(f"多线程用时：{time.time() - start:.2f}秒")  # 约1秒

# 结果：多线程快5倍！因为IO操作会释放GIL
```

**实验结果对比**：

| 任务类型 | 多线程效果 | 原因 |
|---------|----------|------|
| **CPU密集型** | ❌ 无加速甚至更慢 | GIL限制，只能单核运行 |
| **IO密集型** | ✅ 显著加速 | IO等待时释放GIL |

##### 2.3 如何选择并发方案？（5分钟）

**决策树**：
```
你的任务是什么类型？
│
├─ CPU密集型（大量计算）
│   └─ 使用 multiprocessing（多进程）
│       示例：图像处理、科学计算、数据分析
│
├─ IO密集型（网络/文件操作）
│   └─ 使用 threading（多线程）或 asyncio（异步）
│       示例：网络爬虫、API调用、文件读写
│
└─ 混合型
    └─ 使用 asyncio + ProcessPoolExecutor
        示例：批量处理文件并上传
```

**代码选择示例**：
```python
import threading
import multiprocessing
import time

# 任务1：CPU密集型 - 使用多进程
def cpu_task(n):
    return sum(i**2 for i in range(n))

if __name__ == '__main__':
    # ❌ 不推荐：多线程
    # threads = [threading.Thread(target=cpu_task, args=(1000000,)) for _ in range(4)]

    # ✅ 推荐：多进程
    processes = [multiprocessing.Process(target=cpu_task, args=(1000000,)) for _ in range(4)]
    for p in processes: p.start()
    for p in processes: p.join()

# 任务2：IO密集型 - 使用多线程
def io_task():
    time.sleep(1)  # 模拟IO

# ✅ 推荐：多线程
threads = [threading.Thread(target=io_task) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
```

**快速记忆口诀**：
```
CPU密集用进程（multiprocessing）
IO密集用线程（threading/asyncio）
遇到GIL要绕行
```

#### 🎯 复习检验（5分钟）

**自测问题**：
1. [ ] 线程和进程的主要区别是什么？
2. [ ] `thread.start()` 和 `thread.join()` 各有什么作用？
3. [ ] 什么是守护线程？什么时候使用？
4. [ ] GIL是什么？为什么Python需要GIL？
5. [ ] CPU密集型和IO密集型任务应该分别使用什么并发方案？

**动手练习**：
```python
# 练习：创建3个线程，每个线程打印5次自己的名字
import threading
import time

def print_name(name, count):
    for i in range(count):
        print(f"{name} - 第{i+1}次")
        time.sleep(0.1)

# 你的代码：
# 创建3个线程，分别命名为 Thread-A, Thread-B, Thread-C
# 每个线程打印5次

# 提示：
# threads = [...]
# for t in threads: t.start()
# for t in threads: t.join()
```

---

### 阶段二：Lock锁基础应用（30分钟）⏰ 9:40-10:10

#### 线程安全问题演示（10分钟）

**问题代码**：
```python
import threading

counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1

# 创建10个线程
threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(f"期望结果：1000000")
print(f"实际结果：{counter}")  # 可能是 654321（不确定）
```

**为什么会出错？**
```python
# counter += 1 不是原子操作，实际分为3步：

# 步骤1：读取 counter 的值
temp = counter

# 步骤2：计算 temp + 1
temp = temp + 1

# 步骤3：写回 counter
counter = temp

# 多线程执行时可能发生：
# 线程A读取 counter=0
# 线程B读取 counter=0（还没来得及被A写回）
# 线程A写回 counter=1
# 线程B写回 counter=1（本应该是2）
# 结果：两次操作只增加了1
```

#### Lock锁解决方案（15分钟）

**使用Lock保护**：
```python
import threading

counter = 0
lock = threading.Lock()  # 创建锁

def increment():
    global counter
    for _ in range(100000):
        with lock:  # 获取锁
            counter += 1
        # 自动释放锁

# 创建10个线程
threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(f"期望结果：1000000")
print(f"实际结果：{counter}")  # 现在一定是 1000000
```

**Lock的两种使用方式**：
```python
import threading

lock = threading.Lock()

# 方式1：手动加锁解锁（不推荐）
lock.acquire()
try:
    # 临界区代码
    print("受保护的代码")
finally:
    lock.release()  # 必须在finally中释放

# 方式2：with语句（推荐）
with lock:
    # 临界区代码
    print("受保护的代码")
# 自动释放锁，即使发生异常
```

#### 实战练习（5分钟）

**练习：银行账户**
```python
import threading
import time

class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance
        self.lock = threading.Lock()

    def deposit(self, amount):
        """存款"""
        with self.lock:
            print(f"{threading.current_thread().name} 存款 {amount}")
            temp = self.balance
            time.sleep(0.001)  # 模拟处理延迟
            self.balance = temp + amount
            print(f"余额：{self.balance}")

    def withdraw(self, amount):
        """取款"""
        with self.lock:
            if self.balance >= amount:
                print(f"{threading.current_thread().name} 取款 {amount}")
                temp = self.balance
                time.sleep(0.001)
                self.balance = temp - amount
                print(f"余额：{self.balance}")
                return True
            else:
                print(f"{threading.current_thread().name} 余额不足")
                return False

# 测试
account = BankAccount(1000)

def test_operations():
    account.deposit(100)
    account.withdraw(50)

threads = [threading.Thread(target=test_operations, name=f"Thread-{i}") for i in range(3)]
for t in threads: t.start()
for t in threads: t.join()

print(f"最终余额：{account.balance}")
```

---

### 阶段三：休息（10分钟）⏰ 10:10-10:20

- [ ] 站起来活动活动
- [ ] 喝杯水
- [ ] 回顾前面的笔记

---

### 阶段四：生产者-消费者简化案例（30分钟）⏰ 10:20-10:50

#### 问题场景（5分钟）

**生产者-消费者问题**：
- 生产者生产数据放入缓冲区
- 消费者从缓冲区取数据
- 缓冲区满时，生产者需要等待
- 缓冲区空时，消费者需要等待

**需要解决的问题**：
1. 线程安全：多个生产者/消费者同时访问缓冲区
2. 协调机制：生产者和消费者之间的等待/通知

#### 简化实现（20分钟）

**使用 Queue 模块（推荐）**：
```python
import threading
import time
import random
from queue import Queue

# Queue是线程安全的，不需要额外加锁
buffer = Queue(maxsize=5)  # 最多5个元素

def producer(name, count):
    """生产者"""
    for i in range(count):
        item = f"{name}-商品{i}"
        buffer.put(item)  # 自动阻塞，直到有空位
        print(f"[生产者-{name}] 生产了 {item}，队列大小：{buffer.qsize()}")
        time.sleep(random.uniform(0.1, 0.5))

def consumer(name, count):
    """消费者"""
    for i in range(count):
        item = buffer.get()  # 自动阻塞，直到有数据
        print(f"[消费者-{name}] 消费了 {item}，队列大小：{buffer.qsize()}")
        buffer.task_done()  # 标记任务完成
        time.sleep(random.uniform(0.2, 0.6))

# 启动2个生产者，3个消费者
producers = [
    threading.Thread(target=producer, args=("A", 10)),
    threading.Thread(target=producer, args=("B", 10))
]

consumers = [
    threading.Thread(target=consumer, args=("1", 7)),
    threading.Thread(target=consumer, args=("2", 7)),
    threading.Thread(target=consumer, args=("3", 6))
]

print("=== 开始生产和消费 ===")
for t in producers + consumers:
    t.start()

for t in producers + consumers:
    t.join()

print("\n所有任务完成！")
```

**Queue的核心方法**：
```python
from queue import Queue

q = Queue(maxsize=10)  # 创建队列，最大10个元素

# 放入元素
q.put(item)              # 阻塞，直到有空位
q.put(item, block=False) # 不阻塞，满了抛异常
q.put(item, timeout=2)   # 最多等2秒

# 取出元素
item = q.get()           # 阻塞，直到有元素
item = q.get(block=False)# 不阻塞，空了抛异常
item = q.get(timeout=2)  # 最多等2秒

# 其他方法
q.qsize()     # 队列大小
q.empty()     # 是否为空
q.full()      # 是否已满
q.task_done() # 标记任务完成
q.join()      # 等待所有任务完成
```

#### 实战练习（5分钟）

**练习：简单的任务队列**
```python
import threading
import time
from queue import Queue

def worker(name, task_queue):
    """工作者线程"""
    while True:
        task = task_queue.get()
        if task is None:  # 退出信号
            task_queue.task_done()
            break

        print(f"[{name}] 处理任务：{task}")
        time.sleep(1)  # 模拟处理
        task_queue.task_done()

# 创建任务队列
tasks = Queue()

# 启动3个工作线程
workers = []
for i in range(3):
    t = threading.Thread(target=worker, args=(f"Worker-{i}", tasks))
    t.start()
    workers.append(t)

# 添加10个任务
for i in range(10):
    tasks.put(f"Task-{i}")

# 等待所有任务完成
tasks.join()

# 发送退出信号
for _ in workers:
    tasks.put(None)

for t in workers:
    t.join()

print("所有任务完成！")
```

---

### 阶段五：Semaphore信号量基础（20分钟）⏰ 10:50-11:10

#### 信号量概念（5分钟）

**什么是信号量？**
- Semaphore = 计数器 + Lock
- 允许最多N个线程同时访问资源
- Lock是特殊的Semaphore（N=1）

**形象比喻**：
```
餐厅有5个座位（信号量值=5）：
- 每个顾客进入时 acquire()（座位-1）
- 每个顾客离开时 release()（座位+1）
- 座位满时，新顾客在门外等待
- 有顾客离开时，等待的顾客可以进入
```

#### 基础使用（10分钟）

**创建和使用**：
```python
import threading
import time

# 创建信号量（允许3个并发）
semaphore = threading.Semaphore(3)

def worker(name):
    print(f"[{name}] 等待进入...")

    with semaphore:  # 获取信号量
        print(f"[{name}] 进入，开始工作")
        time.sleep(2)  # 模拟工作
        print(f"[{name}] 完成，离开")
    # 释放信号量

# 创建10个线程，但最多3个同时执行
threads = [threading.Thread(target=worker, args=(f"Thread-{i}",)) for i in range(10)]

print("=== 开始测试（最多3个并发） ===")
for t in threads: t.start()
for t in threads: t.join()

print("所有线程完成！")
```

**Semaphore vs BoundedSemaphore**：
```python
import threading

# Semaphore：可以release超过初始值
sem1 = threading.Semaphore(2)
sem1.release()  # OK，现在值是3
sem1.release()  # OK，现在值是4

# BoundedSemaphore：不能release超过初始值
sem2 = threading.BoundedSemaphore(2)
sem2.release()  # ValueError: 已经达到最大值
```

#### 实战案例：连接池（5分钟）

**数据库连接池模拟**：
```python
import threading
import time
import random

class SimpleConnectionPool:
    def __init__(self, max_connections=3):
        self.semaphore = threading.BoundedSemaphore(max_connections)

    def execute_query(self, query):
        print(f"[{threading.current_thread().name}] 等待连接...")

        with self.semaphore:
            print(f"[{threading.current_thread().name}] 获得连接，执行查询")
            time.sleep(random.uniform(1, 2))  # 模拟查询
            print(f"[{threading.current_thread().name}] 查询完成，释放连接")

# 测试：10个客户端竞争3个连接
pool = SimpleConnectionPool(max_connections=3)

def client(query_id):
    pool.execute_query(f"SELECT * FROM users WHERE id={query_id}")

threads = [threading.Thread(target=client, args=(i,), name=f"Client-{i}") for i in range(10)]

print("=== 开始测试连接池 ===")
for t in threads: t.start()
for t in threads: t.join()

print("测试完成！")
```

---

### 阶段六：总结和答疑（10分钟）⏰ 11:10-11:20

#### 知识点总结

**今日学习成果**：
1. ✅ 深入理解线程基础和GIL机制
2. ✅ 掌握Lock保护线程安全
3. ✅ 学会使用Queue实现生产者-消费者
4. ✅ 理解Semaphore控制并发数

**核心概念对比**：

| 工具 | 作用 | 使用场景 | 示例 |
|------|------|---------|------|
| **Lock** | 互斥锁 | 保护共享资源 | 计数器、账户余额 |
| **Queue** | 线程安全队列 | 生产者-消费者 | 任务队列、缓冲区 |
| **Semaphore** | 信号量 | 限制并发数 | 连接池、限流 |

#### 面试问题准备

**必须能回答的5个问题**：
1. ✅ 什么是GIL？为什么Python需要GIL？
2. ✅ CPU密集型和IO密集型任务应该用什么并发方案？
3. ✅ 什么是线程安全？如何保证线程安全？
4. ✅ 生产者-消费者问题是什么？如何实现？
5. ✅ 如何限制同时执行的线程数量？

#### 下一步学习

如果基础版学完还有精力，可以继续学习：
- RLock递归锁
- Condition条件变量的深入使用
- 多进程编程
- 线程池ThreadPoolExecutor

---

## 📕 进阶版学习计划（3小时）

### 进阶版时间安排（原内容）

## 📅 培训时间安排

| 时间段 | 学习内容 | 时长 | 形式 |
|--------|---------|------|------|
| **上午 9:00-9:20** | 复习回顾（上次内容） | 20分钟 | 理论复习 |
| **上午 9:20-10:20** | Lock锁 + RLock递归锁 | 60分钟 | 理论+实践 |
| **上午 10:20-10:30** | 休息 | 10分钟 | - |
| **上午 10:30-11:30** | Condition条件变量 | 60分钟 | 理论+实践 |
| **下午 14:00-15:00** | Semaphore信号量 + 综合案例 | 60分钟 | 理论+实践 |

**总计**：3小时纯学习时间

---

## 📚 学习内容详细规划

### 阶段一：复习回顾（20分钟）⏰ 9:00-9:20

#### 复习要点
1. **线程基础回顾**（5分钟）
   - [ ] threading.Thread的创建方式
   - [ ] start()、join()、is_alive()方法
   - [ ] 守护线程的概念

2. **GIL机制复习**（10分钟）
   - [ ] 什么是GIL？作用是什么？
   - [ ] GIL对CPU密集型任务的影响（性能数据回顾）
   - [ ] GIL对IO密集型任务的影响
   - [ ] 如何选择threading vs multiprocessing

3. **今日引入问题**（5分钟）
   ```python
   # 思考这段代码会输出什么？
   import threading

   counter = 0

   def increment():
       global counter
       for _ in range(100000):
           counter += 1

   threads = [threading.Thread(target=increment) for _ in range(10)]
   for t in threads: t.start()
   for t in threads: t.join()

   print(counter)  # 期望：1000000，实际：???
   ```
   **问题**：为什么结果不是1000000？（引出线程安全问题）

---

### 阶段二：Lock锁 + RLock递归锁（60分钟）⏰ 9:20-10:20

#### 第223题：Lock锁 ⭐⭐⭐⭐⭐（35分钟）

**学习目标**：
- [ ] 理解线程安全问题的本质
- [ ] 掌握Lock的使用方法
- [ ] 了解Lock的工作原理
- [ ] 掌握上下文管理器的使用

**理论学习**（15分钟）

1. **什么是线程安全问题？**
   - 多个线程同时访问共享资源
   - 操作不是原子性的（counter += 1 包含3步：读取、计算、写入）
   - 导致数据竞争（race condition）

2. **Lock锁的概念**
   ```python
   import threading

   lock = threading.Lock()

   # 方式1：手动加锁解锁
   lock.acquire()
   try:
       # 临界区代码
       pass
   finally:
       lock.release()

   # 方式2：使用with语句（推荐）
   with lock:
       # 临界区代码
       pass
   ```

3. **Lock的特性**
   - 互斥性：同一时间只有一个线程能持有锁
   - 阻塞性：其他线程会等待锁释放
   - 可重入性：Lock不可重入，RLock可重入

**实践练习**（20分钟）

**练习1：修复计数器问题**
```python
import threading

counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100000):
        with lock:
            counter += 1

threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)  # 现在应该是：1000000
```

**练习2：银行账户转账（经典案例）**
```python
import threading
import time

class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance
        self.lock = threading.Lock()

    def withdraw(self, amount):
        with self.lock:
            if self.balance >= amount:
                print(f"{threading.current_thread().name} 正在取款 {amount}")
                time.sleep(0.1)  # 模拟处理时间
                self.balance -= amount
                print(f"{threading.current_thread().name} 取款成功，余额：{self.balance}")
                return True
            else:
                print(f"{threading.current_thread().name} 余额不足")
                return False

# 测试：2个线程同时取款
account = BankAccount(1000)
threads = [
    threading.Thread(target=account.withdraw, args=(600,), name="Thread-1"),
    threading.Thread(target=account.withdraw, args=(600,), name="Thread-2")
]
for t in threads: t.start()
for t in threads: t.join()
```

---

#### 第224题：RLock递归锁 ⭐⭐⭐⭐（25分钟）

**学习目标**：
- [ ] 理解Lock的局限性
- [ ] 掌握RLock的使用场景
- [ ] 理解递归调用的线程安全

**理论学习**（10分钟）

1. **Lock的问题**
   ```python
   import threading

   lock = threading.Lock()

   def func1():
       with lock:
           print("Func1")
           func2()  # 会死锁！

   def func2():
       with lock:  # 尝试再次获取同一个锁
           print("Func2")

   func1()  # 死锁：Lock不可重入
   ```

2. **RLock解决方案**
   - RLock = Reentrant Lock（可重入锁）
   - 同一线程可以多次获取同一把锁
   - 必须释放相同次数才能真正释放锁
   - 记录持有锁的线程和获取次数

3. **RLock vs Lock对比**
   | 特性 | Lock | RLock |
   |------|------|-------|
   | 可重入性 | ❌ 不可重入 | ✅ 可重入 |
   | 性能 | ✅ 稍快 | ⚠️ 稍慢 |
   | 使用场景 | 简单临界区 | 递归调用 |
   | 记录持有者 | ❌ 不记录 | ✅ 记录 |

**实践练习**（15分钟）

**练习3：RLock修复递归问题**
```python
import threading

rlock = threading.RLock()

def func1():
    with rlock:
        print(f"{threading.current_thread().name} 获取锁（第1次）")
        func2()
        print(f"{threading.current_thread().name} 释放锁（第1次）")

def func2():
    with rlock:  # 可以再次获取
        print(f"{threading.current_thread().name} 获取锁（第2次）")
        print("执行 Func2")
        print(f"{threading.current_thread().name} 释放锁（第2次）")

func1()  # 不会死锁
```

**练习4：递归计算斐波那契（带缓存）**
```python
import threading

class FibCalculator:
    def __init__(self):
        self.cache = {}
        self.lock = threading.RLock()

    def calculate(self, n):
        with self.lock:
            if n in self.cache:
                return self.cache[n]

            if n <= 1:
                result = n
            else:
                result = self.calculate(n-1) + self.calculate(n-2)  # 递归调用

            self.cache[n] = result
            return result

# 测试：多线程计算斐波那契
fib = FibCalculator()
threads = [threading.Thread(target=lambda: print(f"Fib(10) = {fib.calculate(10)}")) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()
```

---

### 🔄 休息时间（10分钟）⏰ 10:20-10:30

- [ ] 站起来活动
- [ ] 喝水
- [ ] 回顾前面的学习笔记

---

### 阶段三：Condition条件变量（60分钟）⏰ 10:30-11:30

#### 第225题：Condition条件变量 ⭐⭐⭐⭐⭐

**学习目标**：
- [ ] 理解条件变量的作用
- [ ] 掌握wait()和notify()的使用
- [ ] 实现生产者-消费者模式

**理论学习**（20分钟）

1. **为什么需要Condition？**
   - Lock只能保护临界区，但不能控制执行顺序
   - 生产者-消费者问题：生产者必须等待消费者消费后才能继续生产
   - Condition = Lock + 等待/通知机制

2. **Condition的核心方法**
   ```python
   import threading

   condition = threading.Condition()

   # 消费者线程
   with condition:
       while not has_data:
           condition.wait()      # 释放锁并等待通知
       # 处理数据

   # 生产者线程
   with condition:
       # 生产数据
       condition.notify()        # 通知一个等待的线程
       # 或 condition.notify_all()  # 通知所有等待的线程
   ```

3. **Condition工作流程**
   ```
   消费者                          生产者
     |                              |
     | condition.acquire()          |
     | while not ready:             |
     |   condition.wait() --------->|  (释放锁，进入等待)
     |                              |
     |                              | condition.acquire()
     |                              | 生产数据
     |                              | ready = True
     |  <------------------------- condition.notify()
     | (被唤醒，重新获取锁)           |
     | 消费数据                      |
     | condition.release()          | condition.release()
   ```

**实践练习**（40分钟）

**练习5：生产者-消费者模式（经典案例）**
```python
import threading
import time
import random

class Buffer:
    def __init__(self, size=5):
        self.buffer = []
        self.size = size
        self.condition = threading.Condition()

    def produce(self, item):
        with self.condition:
            # 等待缓冲区有空位
            while len(self.buffer) >= self.size:
                print(f"[生产者] 缓冲区满，等待消费...")
                self.condition.wait()

            self.buffer.append(item)
            print(f"[生产者] 生产了 {item}，缓冲区：{self.buffer}")

            # 通知消费者
            self.condition.notify()

    def consume(self):
        with self.condition:
            # 等待缓冲区有数据
            while len(self.buffer) == 0:
                print(f"[消费者] 缓冲区空，等待生产...")
                self.condition.wait()

            item = self.buffer.pop(0)
            print(f"[消费者] 消费了 {item}，缓冲区：{self.buffer}")

            # 通知生产者
            self.condition.notify()
            return item

def producer(buffer, count):
    for i in range(count):
        time.sleep(random.uniform(0.1, 0.5))  # 模拟生产时间
        buffer.produce(f"商品{i}")

def consumer(buffer, count):
    for i in range(count):
        time.sleep(random.uniform(0.2, 0.6))  # 模拟消费时间
        buffer.consume()

# 测试：2个生产者，3个消费者
buffer = Buffer(size=5)
threads = [
    threading.Thread(target=producer, args=(buffer, 10), name="生产者1"),
    threading.Thread(target=producer, args=(buffer, 10), name="生产者2"),
    threading.Thread(target=consumer, args=(buffer, 7), name="消费者1"),
    threading.Thread(target=consumer, args=(buffer, 7), name="消费者2"),
    threading.Thread(target=consumer, args=(buffer, 6), name="消费者3"),
]

for t in threads: t.start()
for t in threads: t.join()
```

**练习6：事件通知系统**
```python
import threading
import time

class EventNotifier:
    def __init__(self):
        self.condition = threading.Condition()
        self.event_occurred = False
        self.event_data = None

    def wait_for_event(self, timeout=None):
        """等待事件发生"""
        with self.condition:
            while not self.event_occurred:
                print(f"[{threading.current_thread().name}] 等待事件...")
                if not self.condition.wait(timeout=timeout):
                    print(f"[{threading.current_thread().name}] 等待超时")
                    return None

            data = self.event_data
            self.event_occurred = False  # 重置
            self.event_data = None
            return data

    def trigger_event(self, data):
        """触发事件"""
        with self.condition:
            self.event_data = data
            self.event_occurred = True
            print(f"[触发器] 事件触发：{data}")
            self.condition.notify_all()  # 通知所有等待者

# 测试
notifier = EventNotifier()

def waiter(name):
    result = notifier.wait_for_event(timeout=5)
    if result:
        print(f"[{name}] 收到事件：{result}")
    else:
        print(f"[{name}] 未收到事件")

# 创建3个等待者
waiters = [threading.Thread(target=waiter, args=(f"等待者{i}",), name=f"等待者{i}") for i in range(3)]
for t in waiters: t.start()

time.sleep(2)  # 等待2秒后触发事件
notifier.trigger_event("系统更新通知")

for t in waiters: t.join()
```

---

### 阶段四：Semaphore信号量 + 综合案例（60分钟）⏰ 14:00-15:00

#### 第226题：Semaphore信号量 ⭐⭐⭐⭐

**学习目标**：
- [ ] 理解信号量的概念
- [ ] 掌握资源池限制的实现
- [ ] 区分Semaphore和BoundedSemaphore

**理论学习**（15分钟）

1. **什么是信号量？**
   - Semaphore = 计数器 + Lock
   - 允许同时有N个线程访问资源
   - Lock是特殊的Semaphore（N=1）

2. **Semaphore的使用**
   ```python
   import threading

   # 创建信号量（允许3个并发）
   semaphore = threading.Semaphore(3)

   def worker():
       with semaphore:  # 获取信号量（计数-1）
           print(f"{threading.current_thread().name} 进入")
           # 执行任务
           print(f"{threading.current_thread().name} 退出")
       # 释放信号量（计数+1）
   ```

3. **Semaphore vs BoundedSemaphore**
   - `Semaphore`：可以release超过初始值
   - `BoundedSemaphore`：release不能超过初始值（更安全）

**实践练习**（45分钟）

**练习7：数据库连接池模拟**
```python
import threading
import time
import random

class ConnectionPool:
    def __init__(self, max_connections=3):
        self.semaphore = threading.BoundedSemaphore(max_connections)
        self.max_connections = max_connections

    def execute_query(self, query):
        print(f"[{threading.current_thread().name}] 等待连接...")

        with self.semaphore:
            print(f"[{threading.current_thread().name}] 获得连接，执行：{query}")
            time.sleep(random.uniform(1, 3))  # 模拟查询执行
            print(f"[{threading.current_thread().name}] 查询完成，释放连接")

# 测试：10个线程竞争3个连接
pool = ConnectionPool(max_connections=3)

def client(query_id):
    pool.execute_query(f"SELECT * FROM table WHERE id={query_id}")

threads = [threading.Thread(target=client, args=(i,), name=f"客户端{i}") for i in range(10)]

print("=== 开始测试连接池（最大3个并发连接） ===")
start_time = time.time()

for t in threads: t.start()
for t in threads: t.join()

print(f"\n总耗时：{time.time() - start_time:.2f}秒")
```

**练习8：限流器实现**
```python
import threading
import time

class RateLimiter:
    """限流器：每秒最多处理5个请求"""
    def __init__(self, requests_per_second=5):
        self.semaphore = threading.Semaphore(requests_per_second)
        self.requests_per_second = requests_per_second
        self.lock = threading.Lock()

    def acquire(self):
        """获取请求许可"""
        self.semaphore.acquire()

        # 1秒后释放许可
        timer = threading.Timer(1.0, self.semaphore.release)
        timer.daemon = True
        timer.start()

    def process_request(self, request_id):
        self.acquire()
        print(f"[{time.strftime('%H:%M:%S')}] 处理请求 {request_id}")
        time.sleep(0.1)  # 模拟处理

# 测试：20个请求涌入
limiter = RateLimiter(requests_per_second=5)

def client(request_id):
    limiter.process_request(request_id)

threads = [threading.Thread(target=client, args=(i,)) for i in range(20)]

print("=== 测试限流器（每秒5个请求） ===")
for t in threads: t.start()
for t in threads: t.join()
```

**练习9：综合案例 - 多线程爬虫（整合所有知识）**
```python
import threading
import time
import random
from queue import Queue

class WebCrawler:
    def __init__(self, max_workers=3):
        self.task_queue = Queue()
        self.result_lock = threading.Lock()
        self.results = []
        self.semaphore = threading.Semaphore(max_workers)
        self.condition = threading.Condition()
        self.active_workers = 0

    def fetch_url(self, url):
        """模拟爬取网页"""
        time.sleep(random.uniform(0.5, 2))  # 模拟网络延迟
        return f"Content from {url}"

    def worker(self):
        while True:
            with self.semaphore:
                url = self.task_queue.get()
                if url is None:  # 退出信号
                    self.task_queue.task_done()
                    break

                with self.condition:
                    self.active_workers += 1

                try:
                    print(f"[{threading.current_thread().name}] 爬取：{url}")
                    content = self.fetch_url(url)

                    with self.result_lock:
                        self.results.append((url, content))
                        print(f"[{threading.current_thread().name}] 完成：{url}")
                finally:
                    with self.condition:
                        self.active_workers -= 1
                        self.condition.notify_all()

                    self.task_queue.task_done()

    def crawl(self, urls):
        # 添加任务到队列
        for url in urls:
            self.task_queue.put(url)

        # 启动工作线程
        workers = []
        for i in range(3):
            t = threading.Thread(target=self.worker, name=f"Worker-{i}")
            t.start()
            workers.append(t)

        # 等待所有任务完成
        self.task_queue.join()

        # 发送退出信号
        for _ in workers:
            self.task_queue.put(None)

        # 等待所有线程结束
        for t in workers:
            t.join()

        return self.results

# 测试
crawler = WebCrawler(max_workers=3)
urls = [f"https://example.com/page{i}" for i in range(10)]

print("=== 开始爬取 ===")
start_time = time.time()
results = crawler.crawl(urls)
print(f"\n总耗时：{time.time() - start_time:.2f}秒")
print(f"爬取结果数：{len(results)}")
```

---

## 📊 学习成果检验

### 知识点自测清单

**Lock锁**
- [ ] 能解释什么是线程安全问题
- [ ] 能用Lock修复数据竞争
- [ ] 能说出Lock的使用注意事项
- [ ] 能区分acquire/release和with语句

**RLock递归锁**
- [ ] 能解释Lock的死锁问题
- [ ] 理解RLock的重入机制
- [ ] 能选择Lock vs RLock的使用场景
- [ ] 能实现递归函数的线程安全

**Condition条件变量**
- [ ] 理解wait()和notify()的作用
- [ ] 能实现生产者-消费者模式
- [ ] 理解为什么wait要在while循环中
- [ ] 能区分notify()和notify_all()

**Semaphore信号量**
- [ ] 理解信号量的计数器机制
- [ ] 能实现资源池限制
- [ ] 能区分Semaphore和BoundedSemaphore
- [ ] 能应用到实际场景（连接池、限流）

### 面试问题准备

准备回答以下问题：

1. **什么是线程安全？如何保证线程安全？**
   - 答案要点：共享资源、原子性、Lock保护临界区

2. **Lock和RLock的区别是什么？**
   - 答案要点：可重入性、使用场景、性能对比

3. **生产者-消费者模式如何实现？**
   - 答案要点：Condition、wait/notify、缓冲区

4. **如何限制并发数量？**
   - 答案要点：Semaphore、信号量计数、资源池

5. **什么情况下会发生死锁？如何避免？**
   - 答案要点：循环等待、锁顺序、超时机制

---

## 📝 学习记录表

### 完成情况记录

| 练习 | 完成状态 | 运行成功 | 理解程度 | 备注 |
|------|---------|---------|---------|------|
| 练习1：修复计数器 | ☐ | ☐ | ___/10 | |
| 练习2：银行账户转账 | ☐ | ☐ | ___/10 | |
| 练习3：RLock递归 | ☐ | ☐ | ___/10 | |
| 练习4：斐波那契缓存 | ☐ | ☐ | ___/10 | |
| 练习5：生产者-消费者 | ☐ | ☐ | ___/10 | |
| 练习6：事件通知系统 | ☐ | ☐ | ___/10 | |
| 练习7：连接池 | ☐ | ☐ | ___/10 | |
| 练习8：限流器 | ☐ | ☐ | ___/10 | |
| 练习9：多线程爬虫 | ☐ | ☐ | ___/10 | |

### 时间记录

| 阶段 | 计划开始 | 实际开始 | 实际结束 | 用时 |
|------|---------|---------|---------|------|
| 复习回顾 | 9:00 | ___:___ | ___:___ | ___ 分钟 |
| Lock+RLock | 9:20 | ___:___ | ___:___ | ___ 分钟 |
| Condition | 10:30 | ___:___ | ___:___ | ___ 分钟 |
| Semaphore | 14:00 | ___:___ | ___:___ | ___ 分钟 |

**总计用时**：______ 小时 ______ 分钟

---

## 💡 学习心得

### 今日最大收获
_____________________________________________________
_____________________________________________________
_____________________________________________________

### 最难理解的概念
_____________________________________________________
**如何克服**：_______________________________________

### 最实用的技巧
_____________________________________________________
_____________________________________________________

### 遇到的问题
**问题1**：_________________________________________
**解决方案**：_______________________________________

**问题2**：_________________________________________
**解决方案**：_______________________________________

---

## 🎯 课后作业（可选）

如果还有时间和精力，可以尝试：

1. **性能对比实验**
   - 对比Lock、RLock、无锁三种方式的性能
   - 记录执行时间和结果

2. **实战项目**
   - 实现一个线程安全的缓存系统
   - 使用LRU算法 + Lock保护

3. **阅读源码**
   - 阅读threading模块的源代码
   - 理解Lock、Condition的实现原理

---

## 📅 明日学习计划

### 下次学习内容（建议）
- [ ] 第227题：线程池（ThreadPoolExecutor）
- [ ] 第228题：进程基础（multiprocessing.Process）
- [ ] 第229题：进程池（ProcessPoolExecutor）
- [ ] 第230题：进程间通信（Queue、Pipe）

### 需要复习的知识点
- [ ] ____________________________________
- [ ] ____________________________________
- [ ] ____________________________________

---

## 🏆 今日目标达成度

**知识掌握度**：___/10 分
**实践完成度**：___/10 分
**面试准备度**：___/10 分
**整体满意度**：___/10 分

**总评**：___/10 分

---

**培训制作时间**：2026-02-25
**培训师**：Claude Sonnet 4.5
**学习者**：Michael

**加油！你可以的！** 💪🚀

---

## 📎 附录：快速参考

### 四种同步机制对比表

| 同步机制 | 作用 | 使用场景 | 核心方法 |
|---------|------|---------|---------|
| **Lock** | 互斥锁，保护临界区 | 简单的共享资源保护 | acquire(), release() |
| **RLock** | 可重入锁 | 递归调用、嵌套获取 | acquire(), release() |
| **Condition** | 条件变量，线程协调 | 生产者-消费者、事件通知 | wait(), notify(), notify_all() |
| **Semaphore** | 信号量，控制并发数 | 资源池、限流、连接池 | acquire(), release() |

### 代码模板速查

#### Lock模板
```python
lock = threading.Lock()
with lock:
    # 临界区代码
    pass
```

#### Condition模板
```python
condition = threading.Condition()

# 等待方
with condition:
    while not ready:
        condition.wait()
    # 处理

# 通知方
with condition:
    ready = True
    condition.notify()
```

#### Semaphore模板
```python
semaphore = threading.Semaphore(N)
with semaphore:
    # 最多N个线程同时执行
    pass
```

---

**文档结束** ✅
