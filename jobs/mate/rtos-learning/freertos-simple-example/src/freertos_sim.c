/* FreeRTOS 模拟实现
 * 这是一个简化的FreeRTOS实现，用于在macOS上学习RTOS概念
 * 实际的FreeRTOS实现更加复杂和完善
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <semaphore.h>
#include <sys/time.h>
#include <signal.h>
#include <errno.h>

#include "FreeRTOS.h"
#include "task.h"
#include "semphr.h"
#include "queue.h"

/* 全局变量 */
static volatile TickType_t xTickCount = 0;
static pthread_t scheduler_thread;
static volatile int scheduler_running = 0;

/* 任务控制块简化结构 */
typedef struct {
    TaskHandle_t handle;
    TaskFunction_t function;
    void *parameters;
    char name[configMAX_TASK_NAME_LEN];
    UBaseType_t priority;
    uint16_t *stack;
    uint16_t stack_size;
    pthread_t thread;
    int created;
} TaskControlBlock_t;

/* 信号量结构 */
typedef struct {
    sem_t *sem;
    UBaseType_t max_count;
    volatile UBaseType_t count;
    int is_mutex;
} Semaphore_t;

/* 队列结构 */
typedef struct {
    void *data;
    UBaseType_t length;
    UBaseType_t item_size;
    volatile UBaseType_t items_waiting;
    volatile UBaseType_t head;
    volatile UBaseType_t tail;
    pthread_mutex_t mutex;
    sem_t *space_available;
    sem_t *items_available;
} Queue_t;

/* 任务列表 */
static TaskControlBlock_t tasks[10];
static int task_count = 0;

/* 时钟中断模拟 */
void tick_interrupt(int sig) {
    (void)sig; /* 避免编译器警告 */
    xTickCount++;
}

/* 初始化调度器 */
void setup_scheduler() {
    struct itimerval timer;
    signal(SIGALRM, tick_interrupt);

    timer.it_value.tv_sec = 0;
    timer.it_value.tv_usec = 1000; // 1ms
    timer.it_interval.tv_sec = 0;
    timer.it_interval.tv_usec = 1000;

    setitimer(ITIMER_REAL, &timer, NULL);
}

/* 任务包装函数 */
void *task_wrapper(void *arg) {
    TaskControlBlock_t *tcb = (TaskControlBlock_t*)arg;

    printf("[调度器] 任务 '%s' 开始执行\n", tcb->name);

    /* 调用实际的任务函数 */
    tcb->function(tcb->parameters);

    printf("[调度器] 任务 '%s' 结束执行\n", tcb->name);
    return NULL;
}

/* ===== FreeRTOS API 实现 ===== */

BaseType_t xTaskCreate(TaskFunction_t pxTaskCode,
                       const char * const pcName,
                       const configSTACK_DEPTH_TYPE usStackDepth,
                       void * const pvParameters,
                       UBaseType_t uxPriority,
                       TaskHandle_t * const pxCreatedTask)
{
    if (task_count >= 10) {
        return pdFAIL;
    }

    TaskControlBlock_t *tcb = &tasks[task_count];

    tcb->handle = (TaskHandle_t)(task_count + 1);
    tcb->function = pxTaskCode;
    tcb->parameters = pvParameters;
    strncpy(tcb->name, pcName, configMAX_TASK_NAME_LEN - 1);
    tcb->name[configMAX_TASK_NAME_LEN - 1] = '\0';
    tcb->priority = uxPriority;
    tcb->stack_size = usStackDepth;
    tcb->created = 1;

    if (pxCreatedTask != NULL) {
        *pxCreatedTask = tcb->handle;
    }

    task_count++;

    printf("[调度器] 任务 '%s' 创建成功，优先级: %lu\n", pcName, (unsigned long)uxPriority);

    return pdPASS;
}

void vTaskStartScheduler(void)
{
    printf("[调度器] 启动调度器，共有 %d 个任务\n", task_count);

    setup_scheduler();
    scheduler_running = 1;

    /* 启动所有任务 */
    for (int i = 0; i < task_count; i++) {
        if (tasks[i].created) {
            if (pthread_create(&tasks[i].thread, NULL, task_wrapper, &tasks[i]) != 0) {
                printf("[调度器] 创建任务线程失败: %s\n", tasks[i].name);
                return;
            }
        }
    }

    /* 等待所有任务完成（实际上不会完成） */
    for (int i = 0; i < task_count; i++) {
        if (tasks[i].created) {
            pthread_join(tasks[i].thread, NULL);
        }
    }
}

void vTaskDelay(const TickType_t xTicksToDelay)
{
    usleep(xTicksToDelay * 1000); // 转换为微秒
}

void vTaskDelayUntil(TickType_t * const pxPreviousWakeTime, const TickType_t xTimeIncrement)
{
    TickType_t current_time = xTaskGetTickCount();
    TickType_t next_wake = *pxPreviousWakeTime + xTimeIncrement;

    if (next_wake > current_time) {
        vTaskDelay(next_wake - current_time);
    }

    *pxPreviousWakeTime = next_wake;
}

TickType_t xTaskGetTickCount(void)
{
    return xTickCount;
}

UBaseType_t uxTaskGetNumberOfTasks(void)
{
    return task_count;
}

UBaseType_t uxTaskGetStackHighWaterMark(TaskHandle_t xTask)
{
    (void)xTask; /* 避免编译器警告 */
    /* 模拟返回栈剩余空间 */
    return 100; // 假设剩余100个字
}

/* 信号量实现 */
SemaphoreHandle_t xSemaphoreCreateCounting(UBaseType_t uxMaxCount, UBaseType_t uxInitialCount)
{
    Semaphore_t *sem = malloc(sizeof(Semaphore_t));
    if (sem == NULL) return NULL;

    /* macOS 不支持无名信号量，使用有名信号量 */
    static int sem_counter = 0;
    char sem_name[32];
    snprintf(sem_name, sizeof(sem_name), "/freertos_sem_%d", sem_counter++);

    sem_unlink(sem_name); // 删除可能存在的旧信号量
    sem->sem = sem_open(sem_name, O_CREAT | O_EXCL, 0644, uxInitialCount);
    if (sem->sem == SEM_FAILED) {
        free(sem);
        return NULL;
    }

    sem->max_count = uxMaxCount;
    sem->count = uxInitialCount;
    sem->is_mutex = 0;

    printf("[信号量] 计数信号量创建成功，最大计数: %lu，初始计数: %lu\n", (unsigned long)uxMaxCount, (unsigned long)uxInitialCount);

    return (SemaphoreHandle_t)sem;
}

SemaphoreHandle_t xSemaphoreCreateMutex(void)
{
    Semaphore_t *sem = malloc(sizeof(Semaphore_t));
    if (sem == NULL) return NULL;

    static int mutex_counter = 0;
    char sem_name[32];
    snprintf(sem_name, sizeof(sem_name), "/freertos_mutex_%d", mutex_counter++);

    sem_unlink(sem_name);
    sem->sem = sem_open(sem_name, O_CREAT | O_EXCL, 0644, 1);
    if (sem->sem == SEM_FAILED) {
        free(sem);
        return NULL;
    }

    sem->max_count = 1;
    sem->count = 1;
    sem->is_mutex = 1;

    printf("[互斥量] 互斥量创建成功\n");

    return (SemaphoreHandle_t)sem;
}

BaseType_t xSemaphoreTake(SemaphoreHandle_t xSemaphore, TickType_t xBlockTime)
{
    Semaphore_t *sem = (Semaphore_t*)xSemaphore;
    if (sem == NULL || sem->sem == NULL) return pdFAIL;

    if (xBlockTime == portMAX_DELAY) {
        /* 无限等待 */
        if (sem_wait(sem->sem) == 0) {
            if (sem->count > 0) sem->count--;
            return pdTRUE;
        }
    } else if (xBlockTime == 0) {
        /* 非阻塞 */
        if (sem_trywait(sem->sem) == 0) {
            if (sem->count > 0) sem->count--;
            return pdTRUE;
        }
    } else {
        /* macOS不支持sem_timedwait，使用轮询方式 */
        TickType_t start_time = xTaskGetTickCount();
        while ((xTaskGetTickCount() - start_time) < xBlockTime) {
            if (sem_trywait(sem->sem) == 0) {
                if (sem->count > 0) sem->count--;
                return pdTRUE;
            }
            usleep(1000); /* 1ms轮询间隔 */
        }
    }

    return pdFAIL;
}

BaseType_t xSemaphoreGive(SemaphoreHandle_t xSemaphore)
{
    Semaphore_t *sem = (Semaphore_t*)xSemaphore;
    if (sem == NULL || sem->sem == NULL) return pdFAIL;

    if (sem->is_mutex || sem->count < sem->max_count) {
        if (sem_post(sem->sem) == 0) {
            if (!sem->is_mutex && sem->count < sem->max_count) {
                sem->count++;
            }
            return pdTRUE;
        }
    }

    return pdFAIL;
}

/* 队列实现 */
QueueHandle_t xQueueCreate(const UBaseType_t uxQueueLength, const UBaseType_t uxItemSize)
{
    Queue_t *queue = malloc(sizeof(Queue_t));
    if (queue == NULL) return NULL;

    queue->data = malloc(uxQueueLength * uxItemSize);
    if (queue->data == NULL) {
        free(queue);
        return NULL;
    }

    queue->length = uxQueueLength;
    queue->item_size = uxItemSize;
    queue->items_waiting = 0;
    queue->head = 0;
    queue->tail = 0;

    pthread_mutex_init(&queue->mutex, NULL);

    static int queue_counter = 0;
    char sem_name[32];

    snprintf(sem_name, sizeof(sem_name), "/queue_space_%d", queue_counter);
    sem_unlink(sem_name);
    queue->space_available = sem_open(sem_name, O_CREAT | O_EXCL, 0644, uxQueueLength);

    snprintf(sem_name, sizeof(sem_name), "/queue_items_%d", queue_counter++);
    sem_unlink(sem_name);
    queue->items_available = sem_open(sem_name, O_CREAT | O_EXCL, 0644, 0);

    if (queue->space_available == SEM_FAILED || queue->items_available == SEM_FAILED) {
        free(queue->data);
        free(queue);
        return NULL;
    }

    printf("[队列] 队列创建成功，长度: %lu，元素大小: %lu 字节\n", (unsigned long)uxQueueLength, (unsigned long)uxItemSize);

    return (QueueHandle_t)queue;
}

BaseType_t xQueueSend(QueueHandle_t xQueue, const void * const pvItemToQueue, TickType_t xTicksToWait)
{
    Queue_t *queue = (Queue_t*)xQueue;
    if (queue == NULL || pvItemToQueue == NULL) return pdFAIL;

    /* 等待空间可用 */
    if (xTicksToWait == portMAX_DELAY) {
        if (sem_wait(queue->space_available) != 0) return pdFAIL;
    } else if (xTicksToWait == 0) {
        if (sem_trywait(queue->space_available) != 0) return pdFAIL;
    } else {
        /* macOS不支持sem_timedwait，使用轮询方式 */
        TickType_t start_time = xTaskGetTickCount();
        while ((xTaskGetTickCount() - start_time) < xTicksToWait) {
            if (sem_trywait(queue->space_available) == 0) break;
            usleep(1000); /* 1ms轮询间隔 */
        }
        if ((xTaskGetTickCount() - start_time) >= xTicksToWait) return pdFAIL;
    }

    /* 加锁并写入数据 */
    pthread_mutex_lock(&queue->mutex);

    memcpy((char*)queue->data + (queue->tail * queue->item_size), pvItemToQueue, queue->item_size);
    queue->tail = (queue->tail + 1) % queue->length;
    queue->items_waiting++;

    pthread_mutex_unlock(&queue->mutex);

    /* 通知有新数据可用 */
    sem_post(queue->items_available);

    return pdTRUE;
}

BaseType_t xQueueReceive(QueueHandle_t xQueue, void * const pvBuffer, TickType_t xTicksToWait)
{
    Queue_t *queue = (Queue_t*)xQueue;
    if (queue == NULL || pvBuffer == NULL) return pdFAIL;

    /* 等待数据可用 */
    if (xTicksToWait == portMAX_DELAY) {
        if (sem_wait(queue->items_available) != 0) return pdFAIL;
    } else if (xTicksToWait == 0) {
        if (sem_trywait(queue->items_available) != 0) return pdFAIL;
    } else {
        /* macOS不支持sem_timedwait，使用轮询方式 */
        TickType_t start_time = xTaskGetTickCount();
        while ((xTaskGetTickCount() - start_time) < xTicksToWait) {
            if (sem_trywait(queue->items_available) == 0) break;
            usleep(1000); /* 1ms轮询间隔 */
        }
        if ((xTaskGetTickCount() - start_time) >= xTicksToWait) return pdFAIL;
    }

    /* 加锁并读取数据 */
    pthread_mutex_lock(&queue->mutex);

    memcpy(pvBuffer, (char*)queue->data + (queue->head * queue->item_size), queue->item_size);
    queue->head = (queue->head + 1) % queue->length;
    queue->items_waiting--;

    pthread_mutex_unlock(&queue->mutex);

    /* 通知有新空间可用 */
    sem_post(queue->space_available);

    return pdTRUE;
}

/* 内存管理 */
size_t xPortGetFreeHeapSize(void)
{
    /* 模拟返回剩余堆空间 */
    return 8192; // 假设剩余8KB
}