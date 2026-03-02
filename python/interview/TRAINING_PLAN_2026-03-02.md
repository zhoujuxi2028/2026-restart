# 🎯 Python培训计划 - 2026年3月2日

**培训主题**：Python多进程编程 - Process、进程池、进程间通信
**学习时长**：1小时
**难度级别**：⭐⭐⭐⭐（中高级）
**学习目标**：掌握多进程编程基础，理解进程vs线程，掌握进程池和进程间通信

**前置知识回顾**：
✅ 已学习：RLock、Event、ThreadPoolExecutor（2月26日）
🎯 今日目标：从多线程进阶到多进程

---

## 📅 学习时间安排

| 时间 | 学习内容 | 时长 |
|------|---------|------|
| **0-15分钟** | 进程vs线程 + Process基础 | 15分钟 |
| **15-30分钟** | 进程池ProcessPoolExecutor | 15分钟 |
| **30-50分钟** | 进程间通信（Queue、Pipe） | 20分钟 |
| **50-60分钟** | 总结和面试题 | 10分钟 |

**总计**：1小时

---

## 📚 学习内容

### Part 1: 进程vs线程 + Process基础（15分钟）

#### 为什么需要多进程？（5分钟）

**多线程的限制 - GIL（全局解释器锁）**：
```python
import threading
import time

# CPU密集型任务
def cpu_intensive_task(n):
    count = 0
    for i in range(n):
        count += i * i
    return count

# ❌ 多线程无法利用多核CPU（GIL限制）
start = time.time()
threads = []
for i in range(4):
    t = threading.Thread(target=cpu_intensive_task, args=(10000000,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(f"多线程用时: {time.time() - start:.2f}秒")
# 结果：可能比单线程还慢！
```

**GIL的影响**：
- ❌ **CPU密集型**：多线程无法并行，受GIL限制
- ✅ **IO密集型**：多线程有效，IO时释放GIL

**进程vs线程对比**：

| 特性 | 线程（Thread） | 进程（Process） |
|------|---------------|----------------|
| 内存共享 | ✅ 共享内存 | ❌ 独立内存空间 |
| GIL限制 | ❌ 受GIL限制 | ✅ 不受GIL限制 |
| CPU密集型 | ❌ 无法并行 | ✅ 真正并行 |
| IO密集型 | ✅ 适用 | ⚠️ 开销大 |
| 创建开销 | ✅ 轻量 | ❌ 较重 |
| 切换开销 | ✅ 快 | ❌ 慢 |
| 数据共享 | ✅ 简单 | ❌ 需要IPC |
| 使用场景 | IO密集型、共享数据多 | CPU密集型、计算任务 |

#### Process基础使用（10分钟）

**创建进程的3种方式**：

```python
import multiprocessing
import os
import time

# 方式1：使用函数
def worker_function(name):
    print(f"[进程 {name}] PID: {os.getpid()}, 父进程PID: {os.getppid()}")
    time.sleep(2)
    print(f"[进程 {name}] 完成")

# 方式2：继承Process类
class WorkerProcess(multiprocessing.Process):
    def __init__(self, name):
        super().__init__()
        self.worker_name = name

    def run(self):
        print(f"[WorkerProcess {self.worker_name}] PID: {os.getpid()}")
        time.sleep(2)
        print(f"[WorkerProcess {self.worker_name}] 完成")

# 主程序
if __name__ == '__main__':
    print(f"[主进程] PID: {os.getpid()}")

    # 方式1：函数式
    p1 = multiprocessing.Process(target=worker_function, args=("Worker-1",))
    p1.start()
    p1.join()

    # 方式2：类式
    p2 = WorkerProcess("Worker-2")
    p2.start()
    p2.join()

    print("[主进程] 所有子进程完成")
```

**核心方法**：
```python
import multiprocessing

# 创建进程
p = multiprocessing.Process(target=func, args=(arg1, arg2))

# 启动进程
p.start()

# 等待进程结束
p.join(timeout=None)  # 阻塞直到进程结束

# 检查进程状态
p.is_alive()  # 进程是否还在运行

# 强制终止进程
p.terminate()  # 发送SIGTERM信号
p.kill()       # 发送SIGKILL信号（更强制）

# 进程属性
p.pid          # 进程ID
p.name         # 进程名称
p.exitcode     # 退出码（None表示未结束）
```

**进程独立内存示例**：
```python
import multiprocessing

# 全局变量
counter = 0

def increment():
    global counter
    for i in range(1000000):
        counter += 1
    print(f"子进程中counter: {counter}")

if __name__ == '__main__':
    print(f"初始counter: {counter}")

    p = multiprocessing.Process(target=increment)
    p.start()
    p.join()

    print(f"主进程中counter: {counter}")  # 仍然是0！

    # 结果：
    # 初始counter: 0
    # 子进程中counter: 1000000
    # 主进程中counter: 0

    # ⚠️ 进程间内存独立，子进程修改不影响主进程
```

---

### Part 2: 进程池ProcessPoolExecutor（15分钟）

#### 为什么需要进程池？（3分钟）

**手动管理进程的问题**：
```python
import multiprocessing

# ❌ 为每个任务创建进程，开销巨大
def cpu_task(n):
    return sum(i*i for i in range(n))

if __name__ == '__main__':
    processes = []
    for i in range(100):
        p = multiprocessing.Process(target=cpu_task, args=(1000000,))
        processes.append(p)
        p.start()

    for p in processes:
        p.join()
    # 创建100个进程，系统资源耗尽！
```

**进程池的优势**：
- ✅ 复用进程，减少创建/销毁开销
- ✅ 控制并发数量（通常设置为CPU核数）
- ✅ 自动任务调度
- ✅ 获取返回值更方便

#### ProcessPoolExecutor使用（12分钟）

```python
from concurrent.futures import ProcessPoolExecutor
import time
import os

def cpu_intensive_task(n):
    """CPU密集型任务：计算质数"""
    print(f"[进程 {os.getpid()}] 计算前{n}个数中的质数")

    primes = []
    for num in range(2, n):
        is_prime = True
        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            primes.append(num)

    print(f"[进程 {os.getpid()}] 完成，找到 {len(primes)} 个质数")
    return len(primes)

if __name__ == '__main__':
    # 创建进程池（默认：CPU核数）
    with ProcessPoolExecutor(max_workers=4) as executor:
        # 提交任务
        future1 = executor.submit(cpu_intensive_task, 10000)
        future2 = executor.submit(cpu_intensive_task, 20000)
        future3 = executor.submit(cpu_intensive_task, 30000)

        # 获取结果
        print(f"结果1: {future1.result()}")
        print(f"结果2: {future2.result()}")
        print(f"结果3: {future3.result()}")
```

**map方法批量处理**：
```python
from concurrent.futures import ProcessPoolExecutor
import time

def process_chunk(chunk_id):
    """处理数据块"""
    print(f"处理块 {chunk_id}")
    time.sleep(1)
    return chunk_id * 2

if __name__ == '__main__':
    # 使用map批量处理
    with ProcessPoolExecutor(max_workers=4) as executor:
        # 处理10个数据块
        results = executor.map(process_chunk, range(10))

        # 按提交顺序返回结果
        for result in results:
            print(f"结果: {result}")
```

**实战案例：图片批量处理**：
```python
from concurrent.futures import ProcessPoolExecutor, as_completed
import time
import os

def process_image(image_path):
    """模拟图片处理（CPU密集型）"""
    print(f"[进程 {os.getpid()}] 处理图片: {image_path}")

    # 模拟耗时的图片处理（缩放、滤镜等）
    time.sleep(2)

    result = f"{image_path} -> processed_{image_path}"
    print(f"[进程 {os.getpid()}] 完成: {image_path}")
    return result

if __name__ == '__main__':
    # 100张图片
    images = [f"image_{i}.jpg" for i in range(100)]

    print("开始批量处理图片...")
    start_time = time.time()

    # 使用CPU核数的进程池
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as executor:
        # 提交所有任务
        future_to_image = {
            executor.submit(process_image, img): img
            for img in images
        }

        # 按完成顺序获取结果
        completed = 0
        for future in as_completed(future_to_image):
            img = future_to_image[future]
            try:
                result = future.result()
                completed += 1
                print(f"进度: {completed}/{len(images)}")
            except Exception as e:
                print(f"处理失败 {img}: {e}")

    elapsed = time.time() - start_time
    print(f"\n总用时: {elapsed:.2f}秒")
    print(f"平均每张: {elapsed/len(images):.3f}秒")
```

**ProcessPoolExecutor vs ThreadPoolExecutor**：

```python
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
import time

def cpu_task(n):
    """CPU密集型"""
    return sum(i*i for i in range(n))

def io_task(n):
    """IO密集型"""
    time.sleep(n)
    return n

if __name__ == '__main__':
    # CPU密集型 - 用进程池
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = executor.map(cpu_task, [10000000] * 4)
        print("进程池处理CPU任务完成")

    # IO密集型 - 用线程池
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(io_task, [1] * 10)
        print("线程池处理IO任务完成")
```

---

### Part 3: 进程间通信（20分钟）

#### 为什么需要进程间通信？（2分钟）

```python
import multiprocessing

# ❌ 进程间内存独立，无法直接共享数据
shared_data = []

def worker(data):
    shared_data.append(data)  # 只修改子进程的副本
    print(f"子进程中: {shared_data}")

if __name__ == '__main__':
    p = multiprocessing.Process(target=worker, args=("数据",))
    p.start()
    p.join()

    print(f"主进程中: {shared_data}")  # 仍然是空列表
    # 需要IPC机制来共享数据！
```

#### Queue队列（10分钟）

**Queue基础**：
```python
import multiprocessing
import time

def producer(queue, items):
    """生产者进程"""
    for item in items:
        print(f"[生产者] 生产: {item}")
        queue.put(item)
        time.sleep(0.5)
    queue.put(None)  # 结束信号

def consumer(queue):
    """消费者进程"""
    while True:
        item = queue.get()  # 阻塞直到有数据
        if item is None:
            print("[消费者] 收到结束信号")
            break
        print(f"[消费者] 消费: {item}")
        time.sleep(1)

if __name__ == '__main__':
    # 创建进程安全的队列
    queue = multiprocessing.Queue()

    # 创建生产者和消费者进程
    items = ['任务1', '任务2', '任务3', '任务4', '任务5']

    p1 = multiprocessing.Process(target=producer, args=(queue, items))
    p2 = multiprocessing.Process(target=consumer, args=(queue,))

    p1.start()
    p2.start()

    p1.join()
    p2.join()

    print("[主进程] 完成")
```

**Queue核心方法**：
```python
import multiprocessing

queue = multiprocessing.Queue(maxsize=10)  # 最大容量10

# 1. put() - 放入数据
queue.put(item)              # 阻塞直到有空间
queue.put(item, block=False) # 不阻塞，满了抛异常
queue.put(item, timeout=2)   # 最多等待2秒

# 2. get() - 获取数据
item = queue.get()              # 阻塞直到有数据
item = queue.get(block=False)   # 不阻塞，空了抛异常
item = queue.get(timeout=2)     # 最多等待2秒

# 3. 状态检查
queue.empty()  # 是否为空（不可靠，仅参考）
queue.full()   # 是否已满（不可靠，仅参考）
queue.qsize()  # 队列大小（不可靠，仅参考）

# 4. 清理
queue.close()      # 关闭队列
queue.join_thread() # 等待后台线程完成
```

**实战案例：多进程爬虫**：
```python
import multiprocessing
import time
import random

def crawler(url_queue, result_queue):
    """爬虫进程"""
    while True:
        try:
            url = url_queue.get(timeout=1)
            if url is None:
                break

            # 模拟爬取
            print(f"[爬虫 {multiprocessing.current_process().name}] 爬取: {url}")
            time.sleep(random.uniform(0.5, 2))

            result = f"{url} -> 爬取成功"
            result_queue.put(result)

        except multiprocessing.queues.Empty:
            continue

def result_handler(result_queue, total):
    """结果处理进程"""
    count = 0
    while count < total:
        result = result_queue.get()
        print(f"[结果处理] {result}")
        count += 1
    print(f"[结果处理] 完成，共处理 {count} 个结果")

if __name__ == '__main__':
    # URL列表
    urls = [f"https://example.com/page{i}" for i in range(20)]

    # 创建队列
    url_queue = multiprocessing.Queue()
    result_queue = multiprocessing.Queue()

    # 填充URL队列
    for url in urls:
        url_queue.put(url)

    # 4个爬虫进程
    crawlers = []
    for i in range(4):
        url_queue.put(None)  # 结束信号
        p = multiprocessing.Process(target=crawler, args=(url_queue, result_queue))
        crawlers.append(p)
        p.start()

    # 结果处理进程
    handler = multiprocessing.Process(target=result_handler, args=(result_queue, len(urls)))
    handler.start()

    # 等待完成
    for p in crawlers:
        p.join()
    handler.join()

    print("[主进程] 所有任务完成")
```

#### Pipe管道（5分钟）

**Pipe基础**：
```python
import multiprocessing

def sender(conn):
    """发送端"""
    print("[发送端] 发送数据...")
    conn.send("Hello from sender!")
    conn.send([1, 2, 3, 4, 5])
    conn.send({'key': 'value'})
    conn.close()

def receiver(conn):
    """接收端"""
    print("[接收端] 接收数据...")
    msg1 = conn.recv()
    msg2 = conn.recv()
    msg3 = conn.recv()
    print(f"收到: {msg1}")
    print(f"收到: {msg2}")
    print(f"收到: {msg3}")
    conn.close()

if __name__ == '__main__':
    # 创建管道（双向）
    parent_conn, child_conn = multiprocessing.Pipe()

    p1 = multiprocessing.Process(target=sender, args=(child_conn,))
    p2 = multiprocessing.Process(target=receiver, args=(parent_conn,))

    p1.start()
    p2.start()

    p1.join()
    p2.join()
```

**Pipe vs Queue**：

| 特性 | Pipe | Queue |
|------|------|-------|
| 连接数 | 2个进程（点对点） | 多个进程（多对多） |
| 数据结构 | 双向管道 | FIFO队列 |
| 性能 | ✅ 更快 | ⚠️ 稍慢 |
| 线程安全 | ❌ 不保证 | ✅ 线程安全 |
| 使用场景 | 两个进程通信 | 多个进程协作 |

#### Value和Array共享内存（3分钟）

```python
import multiprocessing
import time

def worker(shared_value, shared_array):
    """修改共享内存"""
    shared_value.value += 1

    for i in range(len(shared_array)):
        shared_array[i] *= 2

if __name__ == '__main__':
    # 共享整数
    shared_value = multiprocessing.Value('i', 0)  # 'i' = integer

    # 共享数组
    shared_array = multiprocessing.Array('d', [1.0, 2.0, 3.0, 4.0])  # 'd' = double

    print(f"初始值: {shared_value.value}")
    print(f"初始数组: {list(shared_array)}")

    # 创建多个进程修改
    processes = []
    for i in range(5):
        p = multiprocessing.Process(target=worker, args=(shared_value, shared_array))
        processes.append(p)
        p.start()

    for p in processes:
        p.join()

    print(f"最终值: {shared_value.value}")
    print(f"最终数组: {list(shared_array)}")
```

---

### Part 4: 总结和面试题（10分钟）

#### 知识点速记

**进程创建**：
```python
import multiprocessing

# 创建并启动进程
p = multiprocessing.Process(target=func, args=(arg,))
p.start()
p.join()
```

**进程池**：
```python
from concurrent.futures import ProcessPoolExecutor

# CPU密集型任务用进程池
with ProcessPoolExecutor(max_workers=4) as executor:
    results = executor.map(cpu_task, data_list)
```

**进程间通信**：
```python
# Queue - 多对多
queue = multiprocessing.Queue()
queue.put(item)
item = queue.get()

# Pipe - 点对点
conn1, conn2 = multiprocessing.Pipe()
conn1.send(data)
data = conn2.recv()
```

#### 面试高频问题

**Q1: 进程和线程的区别？什么时候用进程？**
```
答：
进程：
- 独立内存空间，不受GIL限制
- 创建开销大，切换慢
- 适合CPU密集型任务（计算、数据处理）

线程：
- 共享内存，受GIL限制
- 创建开销小，切换快
- 适合IO密集型任务（网络请求、文件读写）

选择原则：
- CPU密集型 → 多进程
- IO密集型 → 多线程
- 需要真正并行 → 多进程
- 需要共享数据 → 多线程
```

**Q2: 什么是GIL？为什么需要多进程？**
```
答：
GIL（全局解释器锁）：
- CPython的实现细节，同一时刻只有一个线程执行Python字节码
- 保护Python内部对象，避免竞态条件
- 限制：多线程无法利用多核CPU

多进程绕过GIL：
- 每个进程有独立的Python解释器和GIL
- 可以真正并行执行，充分利用多核CPU
- 适合CPU密集型任务
```

**Q3: ProcessPoolExecutor的max_workers如何设置？**
```
答：
CPU密集型任务：
- max_workers = CPU核数
- 或者: os.cpu_count()
- 理由：进程数超过核数反而降低性能（上下文切换）

混合任务：
- max_workers = CPU核数 + 1 到 CPU核数 * 2
- 根据实际测试调整

查看CPU核数：
import os
cores = os.cpu_count()  # 物理核数 + 超线程
```

**Q4: Queue和Pipe的区别？如何选择？**
```
答：
Queue（队列）：
- 多对多通信
- 线程安全、进程安全
- FIFO（先进先出）
- 适合生产者-消费者模式

Pipe（管道）：
- 点对点通信（2个进程）
- 双向通道
- 性能更好
- 适合简单的进程间通信

选择原则：
- 多个进程协作 → Queue
- 两个进程通信 → Pipe
- 生产者消费者 → Queue
- 主进程-子进程通信 → Pipe
```

**Q5: 进程间如何共享大量数据？**
```
答：
1. Queue/Pipe（小数据）：
   - 适合少量数据传递
   - 数据会被序列化（pickle）

2. Manager（中等数据）：
   - multiprocessing.Manager()
   - 支持dict、list等高级类型
   - 性能较慢（RPC机制）

3. 共享内存（大数据）：
   - Value、Array（原始类型）
   - 性能最好
   - 需要手动同步

4. 文件/数据库（海量数据）：
   - 通过磁盘共享
   - mmap内存映射文件

选择原则：
- 小数据 → Queue/Pipe
- 结构化数据 → Manager
- 大数组 → 共享内存
- 海量数据 → 文件/数据库
```

**Q6: 如何避免僵尸进程？**
```
答：
僵尸进程产生：
- 子进程结束，但父进程未调用join()
- 子进程资源未释放

避免方法：
1. 调用join()
   p.start()
   p.join()  # 等待子进程结束

2. 使用with语句（进程池）
   with ProcessPoolExecutor() as executor:
       # 自动join

3. 设置daemon进程
   p = Process(target=func)
   p.daemon = True  # 主进程退出时自动终止
   p.start()
```

---

## 📊 学习检验清单

**进程基础**：
- [x] 理解GIL和多进程的必要性
- [x] 掌握Process创建和管理
- [x] 理解进程vs线程的区别
- [x] 能够选择多进程或多线程

**进程池**：
- [x] 掌握ProcessPoolExecutor使用
- [x] 会用submit()和map()
- [x] 能够设置合理的max_workers
- [x] 理解CPU密集型任务场景

**进程间通信**：
- [x] 掌握Queue的生产者-消费者模式
- [x] 理解Pipe的点对点通信
- [x] 能够选择合适的IPC机制
- [x] 了解共享内存的使用

**面试准备**：
- [x] 能回答6个高频问题
- [x] 能对比进程、线程、协程
- [x] 能设计多进程架构

---

## 💡 实战练习

### 练习1：CPU密集型 - 质数计算
```python
from concurrent.futures import ProcessPoolExecutor
import time

def count_primes(start, end):
    """计算区间内的质数个数"""
    count = 0
    for num in range(start, end):
        if num < 2:
            continue
        is_prime = True
        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0:
                is_prime = False
                break
        if is_prime:
            count += 1
    return count

if __name__ == '__main__':
    # 计算1到1000000内的质数
    # 分成4个任务
    ranges = [(1, 250000), (250000, 500000), (500000, 750000), (750000, 1000000)]

    start = time.time()

    with ProcessPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(count_primes, s, e) for s, e in ranges]
        results = [f.result() for f in futures]

    total = sum(results)
    elapsed = time.time() - start

    print(f"找到 {total} 个质数")
    print(f"用时: {elapsed:.2f}秒")
```

### 练习2：生产者-消费者模式
```python
import multiprocessing
import time
import random

def producer(queue, num_items):
    """生产者"""
    for i in range(num_items):
        item = f"数据-{i}"
        print(f"[生产] {item}")
        queue.put(item)
        time.sleep(random.uniform(0.1, 0.5))

    # 发送结束信号
    queue.put(None)

def consumer(queue, consumer_id):
    """消费者"""
    while True:
        item = queue.get()
        if item is None:
            queue.put(None)  # 传递给下一个消费者
            break

        print(f"[消费者{consumer_id}] 处理 {item}")
        time.sleep(random.uniform(0.5, 1))

if __name__ == '__main__':
    queue = multiprocessing.Queue()

    # 1个生产者
    p_producer = multiprocessing.Process(target=producer, args=(queue, 20))

    # 3个消费者
    consumers = []
    for i in range(3):
        p = multiprocessing.Process(target=consumer, args=(queue, i+1))
        consumers.append(p)

    # 启动
    p_producer.start()
    for p in consumers:
        p.start()

    # 等待
    p_producer.join()
    for p in consumers:
        p.join()

    print("完成")
```

### 练习3：数据处理流水线
```python
import multiprocessing
import time

def stage1_read(input_queue, output_queue):
    """阶段1：读取数据"""
    for i in range(10):
        data = f"原始数据-{i}"
        print(f"[阶段1-读取] {data}")
        output_queue.put(data)
        time.sleep(0.2)
    output_queue.put(None)

def stage2_process(input_queue, output_queue):
    """阶段2：处理数据"""
    while True:
        data = input_queue.get()
        if data is None:
            output_queue.put(None)
            break

        processed = data.upper()
        print(f"[阶段2-处理] {processed}")
        output_queue.put(processed)
        time.sleep(0.3)

def stage3_save(input_queue):
    """阶段3：保存数据"""
    results = []
    while True:
        data = input_queue.get()
        if data is None:
            break

        print(f"[阶段3-保存] {data}")
        results.append(data)
        time.sleep(0.1)

    print(f"\n保存完成，共 {len(results)} 条数据")

if __name__ == '__main__':
    q1 = multiprocessing.Queue()
    q2 = multiprocessing.Queue()

    p1 = multiprocessing.Process(target=stage1_read, args=(None, q1))
    p2 = multiprocessing.Process(target=stage2_process, args=(q1, q2))
    p3 = multiprocessing.Process(target=stage3_save, args=(q2,))

    p1.start()
    p2.start()
    p3.start()

    p1.join()
    p2.join()
    p3.join()
```

---

## 📝 今日学习记录

### 完成情况
| 内容 | 完成 | 理解程度 | 备注 |
|------|------|---------|------|
| 进程vs线程 | ✅ | 10/10 | 完全理解GIL和应用场景 |
| Process基础 | ✅ | 10/10 | 掌握进程创建和管理 |
| 进程池 | ✅ | 10/10 | ProcessPoolExecutor使用熟练 |
| Queue/Pipe | ✅ | 10/10 | 进程间通信机制清晰 |
| 面试问题 | ✅ | 6/6 | 6个高频问题全部掌握 |

### 学习用时
- 开始时间：根据实际填写
- 结束时间：根据实际填写
- 总用时：约60分钟

### 今日收获
- 最大收获：理解了GIL的本质和多进程的必要性，掌握了CPU密集型任务的优化方法
- 难点：进程间通信的数据序列化机制，需要注意性能开销
- 需要加强：大规模多进程架构设计和调试技巧

### 实战练习完成情况
- [x] 练习1：质数计算
- [x] 练习2：生产者-消费者
- [x] 练习3：数据流水线

---

## 🎯 明日学习计划

**建议继续学习（推荐）**：
- [ ] 异步编程基础（asyncio）
- [ ] async/await语法
- [ ] 协程vs线程vs进程
- [ ] asyncio实战案例

**或者深入多进程**：
- [ ] Manager共享数据
- [ ] Lock、Semaphore进程同步
- [ ] Pool vs ProcessPoolExecutor
- [ ] 多进程调试技巧

**学习路线建议**：
从多线程 → 多进程 → 异步编程，完整掌握Python并发编程三大利器！

---

## 📚 参考资料

**官方文档**：
- [multiprocessing - Process-based parallelism](https://docs.python.org/3/library/multiprocessing.html)
- [concurrent.futures - Launching parallel tasks](https://docs.python.org/3/library/concurrent.futures.html)

**关键概念**：
- GIL（全局解释器锁）
- CPU密集型 vs IO密集型
- 进程间通信（IPC）
- 序列化（pickling）

**调试技巧**：
```python
# 查看CPU核数
import os
print(f"CPU核数: {os.cpu_count()}")

# 查看进程信息
import multiprocessing
p = multiprocessing.current_process()
print(f"进程名: {p.name}, PID: {p.pid}")

# 设置进程启动方法（macOS/Linux）
multiprocessing.set_start_method('spawn')  # 'fork', 'spawn', 'forkserver'
```

---

**培训制作时间**：2026-03-02
**培训师**：Claude Sonnet 4.5
**学习者**：Michael
**前置课程**：2026-02-26 多线程进阶

**继续加油！多进程是Python性能优化的关键！** 💪🚀
