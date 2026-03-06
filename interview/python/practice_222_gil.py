#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
第222题：全局解释器锁（GIL）- 实践练习

学习目标：
1. 理解GIL是什么及其作用
2. 观察GIL对CPU密集型任务的影响
3. 验证GIL对IO密集型任务的影响
4. 学习如何绕过GIL限制

运行方式：
python practice_222_gil.py
"""

import threading
import multiprocessing
import time
import sys

print("=" * 70)
print("第222题：Python 全局解释器锁（GIL）实践")
print("=" * 70)

# ============================================================
# 练习1：GIL对CPU密集型任务的影响
# ============================================================
print("\n【练习1】GIL对CPU密集型任务的影响")
print("-" * 70)

def cpu_bound_task(n):
    """CPU密集型任务：计算"""
    count = 0
    for i in range(n):
        count += i * i
    return count

# 测试参数
n = 10000000

print("测试任务：计算0到10,000,000的平方和")
print()

# 单线程执行
print("1️⃣ 单线程执行（基准）")
start = time.time()
result1 = cpu_bound_task(n)
result2 = cpu_bound_task(n)
single_time = time.time() - start
print(f"   执行时间: {single_time:.2f}秒")
print()

# 多线程执行（受GIL限制）
print("2️⃣ 多线程执行（2个线程）")
start = time.time()
threads = []
for _ in range(2):
    t = threading.Thread(target=cpu_bound_task, args=(n,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
multi_thread_time = time.time() - start
print(f"   执行时间: {multi_thread_time:.2f}秒")
print(f"   加速比: {single_time/multi_thread_time:.2f}x")
print(f"   ⚠️  多线程甚至可能更慢！（因为GIL和线程切换开销）")
print()

# 多进程执行（无GIL限制）
print("3️⃣ 多进程执行（2个进程）")
if __name__ == '__main__':
    start = time.time()
    processes = []
    for _ in range(2):
        p = multiprocessing.Process(target=cpu_bound_task, args=(n,))
        processes.append(p)
        p.start()

    for p in processes:
        p.join()
    multi_process_time = time.time() - start
    print(f"   执行时间: {multi_process_time:.2f}秒")
    print(f"   加速比: {single_time/multi_process_time:.2f}x")
    print(f"   ✅ 多进程充分利用多核CPU，实现真正的并行！")
    print()

# ============================================================
# 练习2：GIL对IO密集型任务的影响
# ============================================================
print("\n【练习2】GIL对IO密集型任务的影响")
print("-" * 70)

def io_bound_task():
    """IO密集型任务：模拟网络请求或文件读写"""
    time.sleep(1)  # 模拟IO等待（会释放GIL）

print("测试任务：模拟5个网络请求（每个1秒）")
print()

# 串行执行
print("1️⃣ 串行执行（基准）")
start = time.time()
for _ in range(5):
    io_bound_task()
serial_time = time.time() - start
print(f"   执行时间: {serial_time:.2f}秒")
print()

# 多线程执行（IO操作会释放GIL）
print("2️⃣ 多线程执行（5个线程）")
start = time.time()
threads = []
for _ in range(5):
    t = threading.Thread(target=io_bound_task)
    threads.append(t)
    t.start()

for t in threads:
    t.join()
multi_thread_io_time = time.time() - start
print(f"   执行时间: {multi_thread_io_time:.2f}秒")
print(f"   加速比: {serial_time/multi_thread_io_time:.2f}x")
print(f"   ✅ 多线程对IO密集型任务非常有效！")
print()

# ============================================================
# 练习3：GIL切换间隔
# ============================================================
print("\n【练习3】GIL切换间隔")
print("-" * 70)

print(f"当前GIL切换间隔: {sys.getswitchinterval():.6f}秒")
print()
print("说明：")
print("  - Python 3.2+ 默认每5毫秒（0.005秒）切换一次GIL")
print("  - 这意味着线程大约每5ms轮换一次执行机会")
print("  - 对于CPU密集型任务，频繁切换会带来开销")
print()

# ============================================================
# 练习4：GIL的释放时机
# ============================================================
print("\n【练习4】GIL何时会被释放？")
print("-" * 70)

print("GIL会在以下情况自动释放：")
print()
print("1️⃣ IO操作")
print("   - 文件读写：open(), read(), write()")
print("   - 网络请求：socket操作")
print("   - 数据库查询")
print("   - time.sleep()")
print()
print("2️⃣ 时间片到期")
print("   - 默认每5毫秒强制切换")
print()
print("3️⃣ C扩展主动释放")
print("   - NumPy矩阵运算")
print("   - Pandas数据处理")
print("   - 使用 Py_BEGIN_ALLOW_THREADS")
print()

# ============================================================
# 练习5：NumPy释放GIL的例子
# ============================================================
print("\n【练习5】NumPy如何绕过GIL")
print("-" * 70)

try:
    import numpy as np

    def numpy_computation():
        """NumPy在内部释放GIL"""
        a = np.random.rand(1000, 1000)
        b = np.random.rand(1000, 1000)
        c = np.dot(a, b)  # 矩阵乘法时释放GIL
        return c

    print("测试：4个线程同时进行NumPy矩阵运算")
    print()

    # 单线程
    print("1️⃣ 单线程执行")
    start = time.time()
    for _ in range(4):
        numpy_computation()
    numpy_single_time = time.time() - start
    print(f"   执行时间: {numpy_single_time:.2f}秒")
    print()

    # 多线程
    print("2️⃣ 多线程执行（4个线程）")
    start = time.time()
    threads = []
    for _ in range(4):
        t = threading.Thread(target=numpy_computation)
        threads.append(t)
        t.start()

    for t in threads:
        t.join()
    numpy_multi_time = time.time() - start
    print(f"   执行时间: {numpy_multi_time:.2f}秒")
    print(f"   加速比: {numpy_single_time/numpy_multi_time:.2f}x")
    print(f"   ✅ NumPy内部释放GIL，多线程有一定加速！")
    print()

except ImportError:
    print("❌ 未安装NumPy，跳过此练习")
    print("   安装命令：pip install numpy")
    print()

# ============================================================
# 总结：如何应对GIL
# ============================================================
print("\n" + "=" * 70)
print("🎯 GIL 应对策略总结")
print("=" * 70)
print("""
1️⃣ CPU密集型任务（计算）
   ❌ 不适合：threading（受GIL限制）
   ✅ 推荐：multiprocessing（多进程，无GIL）
   ✅ 推荐：使用NumPy/Pandas等库（内部释放GIL）

2️⃣ IO密集型任务（网络、文件）
   ✅ 推荐：threading（IO操作释放GIL）
   ✅ 推荐：asyncio（单线程异步）
   ⚠️  可选：multiprocessing（但开销大）

3️⃣ 混合型任务
   ✅ 推荐：asyncio + ProcessPoolExecutor
   ✅ 推荐：threading + multiprocessing 组合

4️⃣ 其他解决方案
   - 使用Cython编写C扩展
   - 使用PyPy（JIT编译）
   - 使用Jython/IronPython（无GIL）
""")

print("=" * 70)
print("🎓 学习要点")
print("=" * 70)
print("""
✅ GIL是什么：
   - Global Interpreter Lock（全局解释器锁）
   - CPython的内存管理机制
   - 同一时刻只有一个线程执行Python字节码

✅ GIL的影响：
   - CPU密集型：多线程无法利用多核（甚至更慢）
   - IO密集型：多线程仍然有效（IO时释放GIL）

✅ 为什么有GIL：
   - 简化内存管理（引用计数机制）
   - 简化C扩展开发
   - 保护内部数据结构

✅ 如何验证GIL影响：
   - 观察CPU使用率（多线程CPU密集型只用一个核心）
   - 对比单线程、多线程、多进程的执行时间
   - 使用性能分析工具（cProfile）

💡 下一步：
   学习第223题 - 线程同步与Lock锁机制
""")
