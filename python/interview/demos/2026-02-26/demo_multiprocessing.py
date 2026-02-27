"""
多进程演示 - multiprocessing
适合CPU密集型任务，绑过GIL，真正并行
"""
import multiprocessing
import time

def cpu_task(name, count):
    """模拟CPU计算任务"""
    print(f"[进程 {name}] 开始计算...")
    result = 0
    for i in range(count):
        result += i * i
    print(f"[进程 {name}] 完成，结果: {result}")
    return result

if __name__ == '__main__':
    count = 10**7  # 1000万次计算

    print("=" * 50)
    print("多进程演示 (multiprocessing)")
    print(f"CPU核心数: {multiprocessing.cpu_count()}")
    print("=" * 50)

    # 记录开始时间
    start = time.time()

    # 创建4个进程
    processes = []
    for i in range(4):
        p = multiprocessing.Process(target=cpu_task, args=(f"P{i}", count))
        processes.append(p)

    # 启动所有进程
    for p in processes:
        p.start()

    # 等待所有进程完成
    for p in processes:
        p.join()

    end = time.time()

    print("-" * 50)
    print(f"4个进程完成，总耗时: {end - start:.2f} 秒")
    print("注意: 4个进程在4个CPU核心上真正并行执行")
