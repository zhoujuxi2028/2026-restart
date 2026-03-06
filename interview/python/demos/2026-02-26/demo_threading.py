"""
多线程演示 - threading
适合IO密集型任务，受GIL限制
"""
import threading
import time

def cpu_task(name, count):
    """模拟CPU计算任务"""
    print(f"[线程 {name}] 开始计算...")
    result = 0
    for i in range(count):
        result += i * i
    print(f"[线程 {name}] 完成，结果: {result}")
    return result

if __name__ == '__main__':
    count = 10**7  # 1000万次计算

    print("=" * 50)
    print("多线程演示 (threading)")
    print("=" * 50)

    # 记录开始时间
    start = time.time()

    # 创建4个线程
    threads = []
    for i in range(4):
        t = threading.Thread(target=cpu_task, args=(f"T{i}", count))
        threads.append(t)

    # 启动所有线程
    for t in threads:
        t.start()

    # 等待所有线程完成
    for t in threads:
        t.join()

    end = time.time()

    print("-" * 50)
    print(f"4个线程完成，总耗时: {end - start:.2f} 秒")
    print("注意: 由于GIL，线程是交替执行的，不是真正并行")
