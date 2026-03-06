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
