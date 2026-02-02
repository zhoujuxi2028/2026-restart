/* 基础RTOS概念演示 - 简化版本 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>

/* 全局变量 */
static pthread_t producer_thread, consumer_thread;
static int shared_data = 0;
static pthread_mutex_t data_mutex = PTHREAD_MUTEX_INITIALIZER;

/* 生产者任务 */
void* producer_task(void* arg) {
    (void)arg;
    int counter = 0;

    printf("[生产者] 任务启动\n");
    fflush(stdout);

    for (int i = 0; i < 5; i++) {
        counter++;

        // 获取互斥量
        pthread_mutex_lock(&data_mutex);

        shared_data = counter;
        printf("[生产者] 生产数据: %d\n", counter);
        fflush(stdout);

        // 释放互斥量
        pthread_mutex_unlock(&data_mutex);

        sleep(1); // 1秒延迟
    }

    printf("[生产者] 任务结束\n");
    fflush(stdout);
    return NULL;
}

/* 消费者任务 */
void* consumer_task(void* arg) {
    (void)arg;

    printf("[消费者] 任务启动\n");
    fflush(stdout);

    for (int i = 0; i < 5; i++) {
        sleep(1); // 等待1秒

        // 获取互斥量
        pthread_mutex_lock(&data_mutex);

        printf("[消费者] 消费数据: %d\n", shared_data);
        fflush(stdout);

        // 释放互斥量
        pthread_mutex_unlock(&data_mutex);
    }

    printf("[消费者] 任务结束\n");
    fflush(stdout);
    return NULL;
}

/* 主函数 */
int main(void) {
    printf("=== 基础 RTOS 概念演示 ===\n");
    printf("演示：任务调度、互斥量\n\n");
    fflush(stdout);

    // 创建生产者任务
    if (pthread_create(&producer_thread, NULL, producer_task, NULL) != 0) {
        printf("创建生产者任务失败!\n");
        return -1;
    }

    // 创建消费者任务
    if (pthread_create(&consumer_thread, NULL, consumer_task, NULL) != 0) {
        printf("创建消费者任务失败!\n");
        return -1;
    }

    printf("任务已创建，开始运行...\n\n");
    fflush(stdout);

    // 等待任务完成
    pthread_join(producer_thread, NULL);
    pthread_join(consumer_thread, NULL);

    printf("\n=== 程序运行完成 ===\n");
    printf("这演示了 RTOS 的基本概念：\n");
    printf("1. 多任务并发执行\n");
    printf("2. 使用互斥量保护共享资源\n");
    printf("3. 任务同步和通信\n");
    fflush(stdout);

    return 0;
}