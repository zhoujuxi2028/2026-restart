/* 简单的RTOS概念演示程序
 * 使用pthread来模拟任务调度
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>
#include <string.h>
#include <signal.h>
#include <sys/time.h>

/* 模拟的RTOS类型定义 */
typedef void* TaskHandle_t;
typedef unsigned long TickType_t;
typedef void (*TaskFunction_t)(void*);

/* 全局变量 */
static pthread_t task1_thread, task2_thread, task3_thread;
static sem_t *counting_sem;
static sem_t *mutex_sem;
static volatile int queue_data[5];
static volatile int queue_head = 0, queue_tail = 0;
static volatile TickType_t tick_count = 0;

/* 时钟模拟 */
void tick_handler(int sig) {
    (void)sig;
    tick_count++;
}

TickType_t get_tick_count(void) {
    return tick_count;
}

void delay_ms(int ms) {
    usleep(ms * 1000);
}

/* 队列操作 */
int queue_send(int data, int timeout_ms) {
    int start_time = get_tick_count();

    while (((queue_tail + 1) % 5) == queue_head) {
        if (timeout_ms > 0 && (get_tick_count() - start_time) >= timeout_ms) {
            return 0; // 超时
        }
        usleep(1000); // 1ms
    }

    queue_data[queue_tail] = data;
    queue_tail = (queue_tail + 1) % 5;
    return 1; // 成功
}

int queue_receive(int *data, int timeout_ms) {
    int start_time = get_tick_count();

    while (queue_head == queue_tail) {
        if (timeout_ms > 0 && (get_tick_count() - start_time) >= timeout_ms) {
            return 0; // 超时
        }
        usleep(1000); // 1ms
    }

    *data = queue_data[queue_head];
    queue_head = (queue_head + 1) % 5;
    return 1; // 成功
}

/* 任务1：生产者 */
void* task1_producer(void* arg) {
    (void)arg;
    int counter = 0;

    printf("[生产者] 任务启动\n");

    while (1) {
        counter++;

        // 模拟获取互斥量
        sem_wait(mutex_sem);

        printf("[生产者] 发送数据: %d\n", counter);

        if (queue_send(counter, 100)) {
            printf("[生产者] 数据已发送到队列\n");
            // 通知消费者
            sem_post(counting_sem);
        } else {
            printf("[生产者] 队列发送超时!\n");
        }

        // 释放互斥量
        sem_post(mutex_sem);

        delay_ms(1000); // 1秒
    }

    return NULL;
}

/* 任务2：消费者 */
void* task2_consumer(void* arg) {
    (void)arg;
    int received_data;

    printf("[消费者] 任务启动\n");

    while (1) {
        // 等待信号量
        if (sem_trywait(counting_sem) == 0) {
            // 获取互斥量
            sem_wait(mutex_sem);

            if (queue_receive(&received_data, 100)) {
                printf("[消费者] 接收到数据: %d\n", received_data);
            } else {
                printf("[消费者] 队列接收超时!\n");
            }

            // 释放互斥量
            sem_post(mutex_sem);
        } else {
            printf("[消费者] 等待数据...\n");
            delay_ms(500);
        }
    }

    return NULL;
}

/* 任务3：监控 */
void* task3_monitor(void* arg) {
    (void)arg;

    printf("[监控] 任务启动\n");

    while (1) {
        delay_ms(3000); // 3秒

        printf("=== [监控] 系统状态 ===\n");
        printf("系统运行时间: %lu ticks\n", (unsigned long)get_tick_count());
        printf("队列状态: head=%d, tail=%d\n", queue_head, queue_tail);
        printf("========================\n");
    }

    return NULL;
}

/* 初始化系统 */
int init_system(void) {
    // 创建信号量
    sem_unlink("/counting_sem");
    counting_sem = sem_open("/counting_sem", O_CREAT | O_EXCL, 0644, 0);

    sem_unlink("/mutex_sem");
    mutex_sem = sem_open("/mutex_sem", O_CREAT | O_EXCL, 0644, 1);

    if (counting_sem == SEM_FAILED || mutex_sem == SEM_FAILED) {
        printf("创建信号量失败!\n");
        return -1;
    }

    // 设置时钟中断
    signal(SIGALRM, tick_handler);
    struct itimerval timer;
    timer.it_value.tv_sec = 0;
    timer.it_value.tv_usec = 1000; // 1ms
    timer.it_interval.tv_sec = 0;
    timer.it_interval.tv_usec = 1000;
    setitimer(ITIMER_REAL, &timer, NULL);

    return 0;
}

/* 主函数 */
int main(void) {
    printf("=== 简化的 RTOS 学习演示 ===\n");
    printf("演示：任务调度、信号量、队列、互斥量\n\n");

    // 初始化系统
    if (init_system() != 0) {
        printf("系统初始化失败!\n");
        return -1;
    }

    printf("创建任务...\n");

    // 创建任务
    if (pthread_create(&task1_thread, NULL, task1_producer, NULL) != 0) {
        printf("创建生产者任务失败!\n");
        return -1;
    }

    if (pthread_create(&task2_thread, NULL, task2_consumer, NULL) != 0) {
        printf("创建消费者任务失败!\n");
        return -1;
    }

    if (pthread_create(&task3_thread, NULL, task3_monitor, NULL) != 0) {
        printf("创建监控任务失败!\n");
        return -1;
    }

    printf("所有任务创建成功!\n");
    printf("程序开始运行，按 Ctrl+C 退出...\n\n");

    // 等待任务完成（实际上不会完成）
    pthread_join(task1_thread, NULL);
    pthread_join(task2_thread, NULL);
    pthread_join(task3_thread, NULL);

    // 清理资源
    sem_close(counting_sem);
    sem_close(mutex_sem);
    sem_unlink("/counting_sem");
    sem_unlink("/mutex_sem");

    return 0;
}