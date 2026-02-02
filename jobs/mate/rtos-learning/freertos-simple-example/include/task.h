#ifndef TASK_H
#define TASK_H

#include "FreeRTOS.h"

/* 任务句柄类型 */
typedef void * TaskHandle_t;

/* 任务函数类型 */
typedef void (*TaskFunction_t)(void *);

/* 任务状态 */
typedef enum
{
    eRunning = 0,
    eReady,
    eBlocked,
    eSuspended,
    eDeleted,
    eInvalid
} eTaskState;

/* 任务相关函数声明 */
BaseType_t xTaskCreate(
    TaskFunction_t pxTaskCode,
    const char * const pcName,
    const configSTACK_DEPTH_TYPE usStackDepth,
    void * const pvParameters,
    UBaseType_t uxPriority,
    TaskHandle_t * const pxCreatedTask
);

void vTaskDelete(TaskHandle_t xTaskToDelete);

void vTaskDelay(const TickType_t xTicksToDelay);

void vTaskDelayUntil(TickType_t * const pxPreviousWakeTime, const TickType_t xTimeIncrement);

UBaseType_t uxTaskPriorityGet(TaskHandle_t xTask);

void vTaskPrioritySet(TaskHandle_t xTask, UBaseType_t uxNewPriority);

void vTaskSuspend(TaskHandle_t xTaskToSuspend);

void vTaskResume(TaskHandle_t xTaskToResume);

BaseType_t xTaskResumeFromISR(TaskHandle_t xTaskToResume);

void vTaskStartScheduler(void);

void vTaskEndScheduler(void);

void vTaskSuspendAll(void);

BaseType_t xTaskResumeAll(void);

TickType_t xTaskGetTickCount(void);

TickType_t xTaskGetTickCountFromISR(void);

UBaseType_t uxTaskGetNumberOfTasks(void);

char *pcTaskGetName(TaskHandle_t xTaskToQuery);

TaskHandle_t xTaskGetHandle(const char *pcNameToQuery);

UBaseType_t uxTaskGetStackHighWaterMark(TaskHandle_t xTask);

eTaskState eTaskGetState(TaskHandle_t xTask);

void vTaskGetInfo(TaskHandle_t xTask, void *pxTaskStatus, BaseType_t xGetFreeStackSpace, eTaskState eState);

BaseType_t xTaskAbortDelay(TaskHandle_t xTask);

TaskHandle_t xTaskGetCurrentTaskHandle(void);

BaseType_t xTaskGetSchedulerState(void);

#define taskSCHEDULER_SUSPENDED    ( ( BaseType_t ) 0 )
#define taskSCHEDULER_NOT_STARTED  ( ( BaseType_t ) 1 )
#define taskSCHEDULER_RUNNING      ( ( BaseType_t ) 2 )

#endif /* TASK_H */