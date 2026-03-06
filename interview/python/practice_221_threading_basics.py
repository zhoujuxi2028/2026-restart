#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
第221题：线程基础 - 实践练习

学习目标：
1. 掌握两种创建线程的方式
2. 理解start()和join()的作用
3. 了解线程属性和守护线程

运行方式：
python practice_221_threading_basics.py
"""

import threading
import time

print("=" * 60)
print("第221题：Python 线程基础实践")
print("=" * 60)

# ============================================================
# 练习1：使用Thread类创建线程
# ============================================================
print("\n【练习1】使用Thread类创建线程")
print("-" * 60)

def worker(name, delay):
    """线程工作函数"""
    print(f"{name} 开始工作 (线程ID: {threading.current_thread().ident})")
    time.sleep(delay)
    print(f"{name} 完成工作")

# 创建线程
thread1 = threading.Thread(target=worker, args=("线程1", 2))
thread2 = threading.Thread(target=worker, args=("线程2", 1))

print(f"当前活跃线程数: {threading.active_count()}")

# 启动线程
thread1.start()
thread2.start()

# 等待线程完成
thread1.join()
thread2.join()

print("所有线程完成")
print(f"当前活跃线程数: {threading.active_count()}")

# ============================================================
# 练习2：继承Thread类创建自定义线程
# ============================================================
print("\n【练习2】继承Thread类创建自定义线程")
print("-" * 60)

class WorkerThread(threading.Thread):
    def __init__(self, name, delay):
        super().__init__()
        self.worker_name = name
        self.delay = delay

    def run(self):
        """线程执行的主要方法"""
        print(f"{self.worker_name} 开始工作")
        time.sleep(self.delay)
        print(f"{self.worker_name} 完成工作")

# 使用自定义线程类
t1 = WorkerThread("自定义线程1", 1)
t2 = WorkerThread("自定义线程2", 2)

t1.start()
t2.start()
t1.join()
t2.join()

# ============================================================
# 练习3：线程属性
# ============================================================
print("\n【练习3】线程属性")
print("-" * 60)

def demo_worker():
    print(f"工作线程正在运行...")
    time.sleep(2)

t = threading.Thread(target=demo_worker, name="DemoThread")

print(f"线程名称: {t.name}")
print(f"线程是否存活: {t.is_alive()}")
print(f"线程是否为守护线程: {t.daemon}")

t.start()
print(f"启动后 - 线程ID: {t.ident}")
print(f"启动后 - 线程是否存活: {t.is_alive()}")

t.join()
print(f"完成后 - 线程是否存活: {t.is_alive()}")

# ============================================================
# 练习4：守护线程（daemon）
# ============================================================
print("\n【练习4】守护线程")
print("-" * 60)

def daemon_worker():
    print("守护线程启动")
    for i in range(5):
        print(f"守护线程运行中... {i+1}/5")
        time.sleep(1)
    print("守护线程结束")  # 可能不会打印

def normal_worker():
    print("普通线程启动")
    for i in range(2):
        print(f"普通线程运行中... {i+1}/2")
        time.sleep(1)
    print("普通线程结束")

# 创建守护线程
daemon_thread = threading.Thread(target=daemon_worker)
daemon_thread.daemon = True  # 设置为守护线程

# 创建普通线程
normal_thread = threading.Thread(target=normal_worker)

daemon_thread.start()
normal_thread.start()

# 只等待普通线程
normal_thread.join()

print("主线程结束（守护线程会被强制终止）")
print("提示：守护线程可能没有完整运行完")

# ============================================================
# 练习5：获取当前线程信息
# ============================================================
print("\n【练习5】获取当前线程信息")
print("-" * 60)

def thread_info_worker(worker_id):
    current = threading.current_thread()
    print(f"工作者 {worker_id}:")
    print(f"  - 线程名称: {current.name}")
    print(f"  - 线程ID: {current.ident}")
    print(f"  - 是否守护线程: {current.daemon}")

threads = []
for i in range(3):
    t = threading.Thread(target=thread_info_worker, args=(i,), name=f"Worker-{i}")
    threads.append(t)
    t.start()

for t in threads:
    t.join()

# ============================================================
# 挑战练习：并发下载模拟
# ============================================================
print("\n【挑战练习】并发下载模拟")
print("-" * 60)

def download_file(file_name, file_size):
    """模拟文件下载"""
    print(f"开始下载: {file_name} ({file_size}MB)")
    # 模拟下载时间（1MB = 0.5秒）
    time.sleep(file_size * 0.5)
    print(f"完成下载: {file_name}")

# 要下载的文件列表
files = [
    ("file1.zip", 2),
    ("file2.pdf", 3),
    ("file3.mp4", 4),
    ("file4.jpg", 1),
]

# 串行下载
print("\n串行下载:")
start_time = time.time()
for file_name, file_size in files:
    download_file(file_name, file_size)
serial_time = time.time() - start_time
print(f"串行下载总时间: {serial_time:.2f}秒\n")

# 并发下载
print("并发下载:")
start_time = time.time()
threads = []
for file_name, file_size in files:
    t = threading.Thread(target=download_file, args=(file_name, file_size))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

parallel_time = time.time() - start_time
print(f"并发下载总时间: {parallel_time:.2f}秒")
print(f"加速比: {serial_time / parallel_time:.2f}x")

# ============================================================
# 总结
# ============================================================
print("\n" + "=" * 60)
print("第221题学习总结")
print("=" * 60)
print("""
✅ 你已经学会了：
1. 使用 Thread 类创建线程
2. 继承 Thread 类创建自定义线程
3. 线程的基本属性（name、ident、is_alive）
4. 守护线程的概念和用法
5. 线程并发的优势

🎯 关键要点：
- start() 启动线程，join() 等待线程完成
- 守护线程会在主线程结束时被强制终止
- 多线程适合 IO 密集型任务（如网络请求、文件操作）
- threading.current_thread() 获取当前线程对象

💡 下一步：
学习第222题 - 全局解释器锁（GIL）机制
""")
