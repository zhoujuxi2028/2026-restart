/* FreeRTOS 基础学习示例
 * 这个示例演示了：
 * 1. 任务创建和调度
 * 2. 信号量的使用
 * 3. 队列通信
 * 4. 互斥量的使用
 */

#include <stdio.h>
#include <stdint.h>
#include <string.h>

/* FreeRTOS头文件 */
#include "FreeRTOS.h"
#include "task.h"
#include "semphr.h"
#include "queue.h"

/* 声明额外的FreeRTOS函数 */
extern size_t xPortGetFreeHeapSize(void);

/* 任务句柄 */
TaskHandle_t xTask1Handle, xTask2Handle, xTask3Handle;

/* 同步原语 */
SemaphoreHandle_t xCountingSemaphore;
SemaphoreHandle_t xMutex;
QueueHandle_t xQueue;

/* 任务1：生产者任务 - 向队列发送数据 */
void vTask1_Producer(void *pvParameters)
{
    const char *taskName = "Producer";
    uint32_t counter = 0;

    /* 避免编译器警告 */
    (void)pvParameters;

    printf("[%s] 任务启动\n", taskName);

    for(;;)
    {
        counter++;

        /* 获取互斥量保护共享资源 */
        if(xSemaphoreTake(xMutex, pdMS_TO_TICKS(100)) == pdTRUE)
        {
            printf("[%s] 发送数据: %u\n", taskName, counter);

            /* 向队列发送数据 */
            if(xQueueSend(xQueue, &counter, pdMS_TO_TICKS(100)) != pdTRUE)
            {
                printf("[%s] 队列发送失败!\n", taskName);
            }

            /* 释放信号量通知消费者 */
            xSemaphoreGive(xCountingSemaphore);

            /* 释放互斥量 */
            xSemaphoreGive(xMutex);
        }
        else
        {
            printf("[%s] 获取互斥量超时!\n", taskName);
        }

        /* 延迟1秒 */
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

/* 任务2：消费者任务 - 从队列接收数据 */
void vTask2_Consumer(void *pvParameters)
{
    const char *taskName = "Consumer";
    uint32_t receivedData = 0;

    /* 避免编译器警告 */
    (void)pvParameters;

    printf("[%s] 任务启动\n", taskName);

    for(;;)
    {
        /* 等待信号量 */
        if(xSemaphoreTake(xCountingSemaphore, pdMS_TO_TICKS(2000)) == pdTRUE)
        {
            /* 获取互斥量 */
            if(xSemaphoreTake(xMutex, pdMS_TO_TICKS(100)) == pdTRUE)
            {
                /* 从队列接收数据 */
                if(xQueueReceive(xQueue, &receivedData, pdMS_TO_TICKS(100)) == pdTRUE)
                {
                    printf("[%s] 接收到数据: %u\n", taskName, receivedData);
                }
                else
                {
                    printf("[%s] 队列接收失败!\n", taskName);
                }

                /* 释放互斥量 */
                xSemaphoreGive(xMutex);
            }
        }
        else
        {
            printf("[%s] 等待信号量超时\n", taskName);
        }
    }
}

/* 任务3：监控任务 - 显示系统状态 */
void vTask3_Monitor(void *pvParameters)
{
    const char *taskName = "Monitor";
    TickType_t xLastWakeTime;
    const TickType_t xFrequency = pdMS_TO_TICKS(3000); // 3秒周期

    /* 避免编译器警告 */
    (void)pvParameters;

    printf("[%s] 任务启动\n", taskName);

    /* 初始化周期任务的时间基准 */
    xLastWakeTime = xTaskGetTickCount();

    for(;;)
    {
        printf("=== [%s] 系统状态 ===\n", taskName);
        printf("系统运行时间: %lu ticks\n", (unsigned long)xTaskGetTickCount());
        printf("堆剩余内存: %lu bytes\n", (unsigned long)xPortGetFreeHeapSize());
        printf("任务数量: %lu\n", (unsigned long)uxTaskGetNumberOfTasks());

        /* 获取任务状态（如果配置允许） */
        UBaseType_t uxHighWaterMark;

        uxHighWaterMark = uxTaskGetStackHighWaterMark(xTask1Handle);
        printf("Producer 任务栈剩余: %lu words\n", (unsigned long)uxHighWaterMark);

        uxHighWaterMark = uxTaskGetStackHighWaterMark(xTask2Handle);
        printf("Consumer 任务栈剩余: %lu words\n", (unsigned long)uxHighWaterMark);

        uxHighWaterMark = uxTaskGetStackHighWaterMark(NULL); /* 当前任务 */
        printf("Monitor 任务栈剩余: %lu words\n", (unsigned long)uxHighWaterMark);

        printf("========================\n");

        /* 精确周期延迟 */
        vTaskDelayUntil(&xLastWakeTime, xFrequency);
    }
}

/* 主函数 */
int main(void)
{
    printf("=== FreeRTOS 学习示例启动 ===\n");
    printf("演示功能：任务调度、信号量、队列、互斥量\n\n");

    /* 创建同步原语 */
    xCountingSemaphore = xSemaphoreCreateCounting(10, 0); // 最大计数10，初始值0
    xMutex = xSemaphoreCreateMutex();
    xQueue = xQueueCreate(5, sizeof(uint32_t)); // 队列长度5，每个元素4字节

    if(xCountingSemaphore == NULL || xMutex == NULL || xQueue == NULL)
    {
        printf("创建同步原语失败!\n");
        return -1;
    }

    /* 创建任务 */
    BaseType_t xReturned;

    /* 任务1：生产者，优先级2 */
    xReturned = xTaskCreate(
        vTask1_Producer,        /* 任务函数 */
        "Producer",             /* 任务名称 */
        configMINIMAL_STACK_SIZE * 2, /* 栈大小 */
        NULL,                   /* 传递给任务的参数 */
        2,                      /* 优先级 */
        &xTask1Handle           /* 任务句柄 */
    );

    if(xReturned != pdPASS)
    {
        printf("创建Producer任务失败!\n");
        return -1;
    }

    /* 任务2：消费者，优先级2 */
    xReturned = xTaskCreate(
        vTask2_Consumer,
        "Consumer",
        configMINIMAL_STACK_SIZE * 2,
        NULL,
        2,
        &xTask2Handle
    );

    if(xReturned != pdPASS)
    {
        printf("创建Consumer任务失败!\n");
        return -1;
    }

    /* 任务3：监控任务，优先级1（较低） */
    xReturned = xTaskCreate(
        vTask3_Monitor,
        "Monitor",
        configMINIMAL_STACK_SIZE * 2,
        NULL,
        1,
        &xTask3Handle
    );

    if(xReturned != pdPASS)
    {
        printf("创建Monitor任务失败!\n");
        return -1;
    }

    printf("所有任务创建成功，启动调度器...\n\n");

    /* 启动FreeRTOS调度器 */
    vTaskStartScheduler();

    /* 如果程序运行到这里，说明调度器启动失败 */
    printf("调度器启动失败!\n");

    return -1;
}