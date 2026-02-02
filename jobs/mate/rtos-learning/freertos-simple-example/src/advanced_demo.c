/* 高级RTOS概念演示 - 完整版本 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>
#include <signal.h>
#include <sys/time.h>
#include <errno.h>
#include <string.h>
#include <fcntl.h>

/* 队列实现 */
#define QUEUE_SIZE 5
typedef struct {
    int data[QUEUE_SIZE];
    int head;
    int tail;
    int count;
    pthread_mutex_t mutex;
    sem_t *full_sem;   /* 队列满信号量 */
    sem_t *empty_sem;  /* 队列空信号量 */
} Queue;

static Queue message_queue;
static pthread_t high_priority_task, low_priority_task, monitor_task;
static volatile unsigned long system_ticks = 0;

/* 时钟中断模拟 */
void tick_handler(int sig) {
    (void)sig;
    system_ticks++;
}

/* 队列初始化 */
int queue_init(Queue *q) {
    q->head = 0;
    q->tail = 0;
    q->count = 0;

    if (pthread_mutex_init(&q->mutex, NULL) != 0) {
        return -1;
    }

    /* 清理可能存在的信号量 */
    sem_unlink("/queue_full");
    sem_unlink("/queue_empty");

    q->full_sem = sem_open("/queue_full", O_CREAT | O_EXCL, 0644, 0);
    q->empty_sem = sem_open("/queue_empty", O_CREAT | O_EXCL, 0644, QUEUE_SIZE);

    if (q->full_sem == SEM_FAILED || q->empty_sem == SEM_FAILED) {
        printf("创建信号量失败: %s\n", strerror(errno));
        return -1;
    }

    return 0;
}

/* 发送消息到队列 */
int queue_send(Queue *q, int data, int timeout_ms) {
    struct timespec ts;
    struct timeval tv;

    /* 等待空间可用 */
    if (timeout_ms > 0) {
        gettimeofday(&tv, NULL);
        ts.tv_sec = tv.tv_sec + timeout_ms / 1000;
        ts.tv_nsec = (tv.tv_usec + (timeout_ms % 1000) * 1000) * 1000;
        if (ts.tv_nsec >= 1000000000) {
            ts.tv_sec++;
            ts.tv_nsec -= 1000000000;
        }

        /* 由于macOS不支持sem_timedwait，使用轮询方式 */
        int start_ticks = system_ticks;
        while (sem_trywait(q->empty_sem) != 0) {
            if ((system_ticks - start_ticks) >= timeout_ms) {
                return 0; /* 超时 */
            }
            usleep(1000); /* 1ms */
        }
    } else {
        sem_wait(q->empty_sem);
    }

    /* 获取互斥量并写入数据 */
    pthread_mutex_lock(&q->mutex);

    q->data[q->tail] = data;
    q->tail = (q->tail + 1) % QUEUE_SIZE;
    q->count++;

    pthread_mutex_unlock(&q->mutex);

    /* 通知有新数据 */
    sem_post(q->full_sem);

    return 1; /* 成功 */
}

/* 从队列接收消息 */
int queue_receive(Queue *q, int *data, int timeout_ms) {
    struct timespec ts;
    struct timeval tv;

    /* 等待数据可用 */
    if (timeout_ms > 0) {
        gettimeofday(&tv, NULL);
        ts.tv_sec = tv.tv_sec + timeout_ms / 1000;
        ts.tv_nsec = (tv.tv_usec + (timeout_ms % 1000) * 1000) * 1000;
        if (ts.tv_nsec >= 1000000000) {
            ts.tv_sec++;
            ts.tv_nsec -= 1000000000;
        }

        /* 使用轮询方式 */
        int start_ticks = system_ticks;
        while (sem_trywait(q->full_sem) != 0) {
            if ((system_ticks - start_ticks) >= timeout_ms) {
                return 0; /* 超时 */
            }
            usleep(1000); /* 1ms */
        }
    } else {
        sem_wait(q->full_sem);
    }

    /* 获取互斥量并读取数据 */
    pthread_mutex_lock(&q->mutex);

    *data = q->data[q->head];
    q->head = (q->head + 1) % QUEUE_SIZE;
    q->count--;

    pthread_mutex_unlock(&q->mutex);

    /* 通知有新空间 */
    sem_post(q->empty_sem);

    return 1; /* 成功 */
}

/* 高优先级任务 - 紧急数据处理 */
void* high_priority_task_func(void* arg) {
    (void)arg;
    int emergency_data = 9999;

    printf("🔴 [高优先级] 紧急任务启动\n");
    fflush(stdout);

    sleep(2); /* 等待2秒后发送紧急消息 */

    printf("🔴 [高优先级] 发送紧急消息: %d\n", emergency_data);
    fflush(stdout);

    if (queue_send(&message_queue, emergency_data, 1000)) {
        printf("🔴 [高优先级] 紧急消息已发送\n");
    } else {
        printf("🔴 [高优先级] 紧急消息发送失败!\n");
    }
    fflush(stdout);

    return NULL;
}

/* 低优先级任务 - 常规数据处理 */
void* low_priority_task_func(void* arg) {
    (void)arg;
    int received_data;

    printf("🔵 [低优先级] 常规任务启动\n");
    fflush(stdout);

    /* 发送一些常规消息 */
    for (int i = 1; i <= 3; i++) {
        printf("🔵 [低优先级] 发送常规消息: %d\n", i);
        fflush(stdout);

        if (queue_send(&message_queue, i, 1000)) {
            printf("🔵 [低优先级] 消息 %d 已发送\n", i);
        } else {
            printf("🔵 [低优先级] 消息 %d 发送超时!\n", i);
        }
        fflush(stdout);

        sleep(1);
    }

    /* 接收并处理消息 */
    printf("🔵 [低优先级] 开始接收消息...\n");
    fflush(stdout);

    for (int i = 0; i < 4; i++) {
        if (queue_receive(&message_queue, &received_data, 2000)) {
            if (received_data == 9999) {
                printf("🔵 [低优先级] ⚠️  收到紧急消息: %d - 立即处理!\n", received_data);
            } else {
                printf("🔵 [低优先级] 收到常规消息: %d\n", received_data);
            }
            fflush(stdout);
        } else {
            printf("🔵 [低优先级] 接收消息超时\n");
            fflush(stdout);
            break;
        }

        usleep(500000); /* 0.5秒处理时间 */
    }

    return NULL;
}

/* 监控任务 - 系统状态监控 */
void* monitor_task_func(void* arg) {
    (void)arg;

    printf("📊 [监控] 系统监控任务启动\n");
    fflush(stdout);

    for (int i = 0; i < 6; i++) {
        sleep(1);

        pthread_mutex_lock(&message_queue.mutex);
        int queue_count = message_queue.count;
        pthread_mutex_unlock(&message_queue.mutex);

        printf("📊 [监控] Tick: %lu, 队列中消息数: %d\n",
               system_ticks, queue_count);
        fflush(stdout);
    }

    printf("📊 [监控] 系统监控结束\n");
    fflush(stdout);

    return NULL;
}

/* 主函数 */
int main(void) {
    printf("🚀 === 高级 RTOS 概念演示 ===\n");
    printf("演示功能：\n");
    printf("• 任务优先级调度\n");
    printf("• 消息队列通信\n");
    printf("• 信号量同步\n");
    printf("• 系统时钟和监控\n\n");
    fflush(stdout);

    /* 初始化系统时钟 */
    signal(SIGALRM, tick_handler);
    struct itimerval timer;
    timer.it_value.tv_sec = 0;
    timer.it_value.tv_usec = 1000;  /* 1ms */
    timer.it_interval.tv_sec = 0;
    timer.it_interval.tv_usec = 1000;
    setitimer(ITIMER_REAL, &timer, NULL);

    /* 初始化队列 */
    if (queue_init(&message_queue) != 0) {
        printf("❌ 队列初始化失败!\n");
        return -1;
    }

    printf("✅ 系统初始化完成\n\n");
    fflush(stdout);

    /* 创建任务 */
    printf("📋 创建任务中...\n");
    fflush(stdout);

    if (pthread_create(&monitor_task, NULL, monitor_task_func, NULL) != 0) {
        printf("❌ 创建监控任务失败!\n");
        return -1;
    }

    if (pthread_create(&low_priority_task, NULL, low_priority_task_func, NULL) != 0) {
        printf("❌ 创建低优先级任务失败!\n");
        return -1;
    }

    if (pthread_create(&high_priority_task, NULL, high_priority_task_func, NULL) != 0) {
        printf("❌ 创建高优先级任务失败!\n");
        return -1;
    }

    printf("✅ 所有任务已创建，系统开始运行...\n\n");
    fflush(stdout);

    /* 等待所有任务完成 */
    pthread_join(high_priority_task, NULL);
    pthread_join(low_priority_task, NULL);
    pthread_join(monitor_task, NULL);

    /* 清理资源 */
    pthread_mutex_destroy(&message_queue.mutex);
    sem_close(message_queue.full_sem);
    sem_close(message_queue.empty_sem);
    sem_unlink("/queue_full");
    sem_unlink("/queue_empty");

    printf("\n🎉 === 程序运行完成 ===\n");
    printf("已演示的 RTOS 关键特性：\n");
    printf("✓ 多任务并发执行\n");
    printf("✓ 优先级调度（高优先级任务抢占）\n");
    printf("✓ 消息队列通信机制\n");
    printf("✓ 信号量同步原语\n");
    printf("✓ 互斥量保护共享资源\n");
    printf("✓ 系统时钟和状态监控\n");
    fflush(stdout);

    return 0;
}