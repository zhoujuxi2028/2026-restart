#ifndef SEMPHR_H
#define SEMPHR_H

#include "FreeRTOS.h"
#include "queue.h"

/* 信号量句柄类型 */
typedef void * SemaphoreHandle_t;

/* 二进制信号量创建 */
#define xSemaphoreCreateBinary() xQueueGenericCreate( ( UBaseType_t ) 1, semSEMAPHORE_QUEUE_ITEM_LENGTH, queueQUEUE_TYPE_BINARY_SEMAPHORE )

/* 互斥量相关函数 */
SemaphoreHandle_t xSemaphoreCreateMutex(void);
SemaphoreHandle_t xSemaphoreCreateRecursiveMutex(void);

/* 计数信号量相关函数 */
SemaphoreHandle_t xSemaphoreCreateCounting(UBaseType_t uxMaxCount, UBaseType_t uxInitialCount);

/* 信号量操作函数 */
BaseType_t xSemaphoreTake(SemaphoreHandle_t xSemaphore, TickType_t xBlockTime);
BaseType_t xSemaphoreGive(SemaphoreHandle_t xSemaphore);

/* 从ISR中操作信号量 */
BaseType_t xSemaphoreTakeFromISR(SemaphoreHandle_t xSemaphore, BaseType_t *pxHigherPriorityTaskWoken);
BaseType_t xSemaphoreGiveFromISR(SemaphoreHandle_t xSemaphore, BaseType_t *pxHigherPriorityTaskWoken);

/* 递归互斥量操作 */
BaseType_t xSemaphoreTakeRecursive(SemaphoreHandle_t xMutex, TickType_t xBlockTime);
BaseType_t xSemaphoreGiveRecursive(SemaphoreHandle_t xMutex);

/* 获取信号量计数 */
UBaseType_t uxSemaphoreGetCount(SemaphoreHandle_t xSemaphore);

/* 删除信号量 */
void vSemaphoreDelete(SemaphoreHandle_t xSemaphore);

/* 宏定义 */
#define semBINARY_SEMAPHORE_QUEUE_LENGTH    ( ( uint8_t ) 1U )
#define semSEMAPHORE_QUEUE_ITEM_LENGTH      ( ( uint8_t ) 0U )
#define semGIVE_BLOCK_TIME                  ( ( TickType_t ) 0U )

#endif /* SEMPHR_H */