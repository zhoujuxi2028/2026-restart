#ifndef FREERTOS_H
#define FREERTOS_H

#include "FreeRTOSConfig.h"

/* 数据类型定义 */
#define portCHAR        char
#define portFLOAT       float
#define portDOUBLE      double
#define portLONG        long
#define portSHORT       short
#define portSTACK_TYPE  uint16_t
#define portBASE_TYPE   long

typedef portSTACK_TYPE StackType_t;
typedef long BaseType_t;
typedef unsigned long UBaseType_t;

#if( configUSE_16_BIT_TICKS == 1 )
    typedef uint16_t TickType_t;
    #define portMAX_DELAY ( TickType_t ) 0xffff
#else
    typedef uint32_t TickType_t;
    #define portMAX_DELAY ( TickType_t ) 0xffffffffUL
    #define portTICK_TYPE_IS_ATOMIC 1
#endif

/* 函数返回值 */
#define pdFALSE         ( ( BaseType_t ) 0 )
#define pdTRUE          ( ( BaseType_t ) 1 )
#define pdPASS          ( pdTRUE )
#define pdFAIL          ( pdFALSE )

/* 时间转换宏 */
#define pdMS_TO_TICKS( xTimeInMs ) ( ( TickType_t ) ( ( ( TickType_t ) ( xTimeInMs ) * ( TickType_t ) configTICK_RATE_HZ ) / ( TickType_t ) 1000 ) )

/* 栈相关 */
#define configSTACK_DEPTH_TYPE uint16_t

/* 中断控制 */
#define portDISABLE_INTERRUPTS()
#define portENABLE_INTERRUPTS()

#define taskDISABLE_INTERRUPTS() portDISABLE_INTERRUPTS()
#define taskENABLE_INTERRUPTS()  portENABLE_INTERRUPTS()

/* 内存对齐 */
#define portBYTE_ALIGNMENT 8

/* 包含额外的头文件 */
#include <stdint.h>
#include <stddef.h>
#include <fcntl.h>
#include <semaphore.h>

#endif /* FREERTOS_H */