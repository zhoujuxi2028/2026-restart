#ifndef QUEUE_H
#define QUEUE_H

#include "FreeRTOS.h"

/* 队列句柄类型 */
typedef void * QueueHandle_t;

/* 队列类型 */
#define queueQUEUE_TYPE_BASE                ( ( uint8_t ) 0U )
#define queueQUEUE_TYPE_SET                 ( ( uint8_t ) 0U )
#define queueQUEUE_TYPE_MUTEX               ( ( uint8_t ) 1U )
#define queueQUEUE_TYPE_COUNTING_SEMAPHORE  ( ( uint8_t ) 2U )
#define queueQUEUE_TYPE_BINARY_SEMAPHORE    ( ( uint8_t ) 3U )
#define queueQUEUE_TYPE_RECURSIVE_MUTEX     ( ( uint8_t ) 4U )

/* 队列创建和删除 */
QueueHandle_t xQueueCreate(const UBaseType_t uxQueueLength, const UBaseType_t uxItemSize);

QueueHandle_t xQueueGenericCreate(const UBaseType_t uxQueueLength, const UBaseType_t uxItemSize, const uint8_t ucQueueType);

void vQueueDelete(QueueHandle_t xQueue);

/* 队列发送操作 */
BaseType_t xQueueSend(QueueHandle_t xQueue, const void * const pvItemToQueue, TickType_t xTicksToWait);

BaseType_t xQueueSendToBack(QueueHandle_t xQueue, const void * const pvItemToQueue, TickType_t xTicksToWait);

BaseType_t xQueueSendToFront(QueueHandle_t xQueue, const void * const pvItemToQueue, TickType_t xTicksToWait);

/* 队列接收操作 */
BaseType_t xQueueReceive(QueueHandle_t xQueue, void * const pvBuffer, TickType_t xTicksToWait);

BaseType_t xQueuePeek(QueueHandle_t xQueue, void * const pvBuffer, TickType_t xTicksToWait);

/* 从ISR中操作队列 */
BaseType_t xQueueSendFromISR(QueueHandle_t xQueue, const void * const pvItemToQueue, BaseType_t * const pxHigherPriorityTaskWoken);

BaseType_t xQueueSendToBackFromISR(QueueHandle_t xQueue, const void * const pvItemToQueue, BaseType_t * const pxHigherPriorityTaskWoken);

BaseType_t xQueueSendToFrontFromISR(QueueHandle_t xQueue, const void * const pvItemToQueue, BaseType_t * const pxHigherPriorityTaskWoken);

BaseType_t xQueueReceiveFromISR(QueueHandle_t xQueue, void * const pvBuffer, BaseType_t * const pxHigherPriorityTaskWoken);

BaseType_t xQueuePeekFromISR(QueueHandle_t xQueue, void * const pvBuffer);

/* 队列状态查询 */
UBaseType_t uxQueueMessagesWaiting(const QueueHandle_t xQueue);

UBaseType_t uxQueueSpacesAvailable(const QueueHandle_t xQueue);

UBaseType_t uxQueueMessagesWaitingFromISR(const QueueHandle_t xQueue);

BaseType_t xQueueIsQueueEmptyFromISR(const QueueHandle_t xQueue);

BaseType_t xQueueIsQueueFullFromISR(const QueueHandle_t xQueue);

/* 队列重置 */
BaseType_t xQueueReset(QueueHandle_t xQueue);

/* 队列覆写操作（用于长度为1的队列） */
BaseType_t xQueueOverwrite(QueueHandle_t xQueue, const void * const pvItemToQueue);

BaseType_t xQueueOverwriteFromISR(QueueHandle_t xQueue, const void * const pvItemToQueue, BaseType_t * const pxHigherPriorityTaskWoken);

#endif /* QUEUE_H */