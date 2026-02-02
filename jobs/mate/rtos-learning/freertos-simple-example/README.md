# FreeRTOS 学习示例项目

这是一个在 macOS 上学习 FreeRTOS 概念的示例项目。由于 FreeRTOS 主要设计用于嵌入式系统，这个项目使用了模拟实现来在 macOS 上演示 RTOS 的核心概念。

## 项目特点

- ✅ 任务创建和调度
- ✅ 信号量同步
- ✅ 互斥量保护共享资源
- ✅ 队列通信
- ✅ 周期性任务
- ✅ 系统状态监控

## 项目结构

```
freertos-simple-example/
├── src/
│   ├── main.c          # 主程序和任务实现
│   └── freertos_sim.c  # FreeRTOS 模拟实现
├── include/
│   ├── FreeRTOS.h      # FreeRTOS 主头文件
│   ├── FreeRTOSConfig.h# FreeRTOS 配置
│   ├── task.h          # 任务管理API
│   ├── semphr.h        # 信号量API
│   └── queue.h         # 队列API
├── Makefile            # 构建脚本
└── README.md           # 项目说明
```

## 快速开始

### 编译项目
```bash
make
```

### 运行程序
```bash
make run
```

### 清理编译文件
```bash
make clean
```

### 获取帮助
```bash
make help
```

## 程序说明

该示例程序创建了三个任务来演示 FreeRTOS 的核心功能：

### 任务1: Producer（生产者）
- 优先级: 2
- 功能: 生成数据并发送到队列
- 同步: 使用互斥量保护共享资源，使用信号量通知消费者

### 任务2: Consumer（消费者）
- 优先级: 2
- 功能: 从队列接收数据并处理
- 同步: 等待信号量通知，使用互斥量访问共享资源

### 任务3: Monitor（监控）
- 优先级: 1（较低）
- 功能: 定期显示系统状态信息
- 特点: 周期性执行，展示任务栈使用情况和系统资源

## 学习要点

### 1. 任务调度
```c
xTaskCreate(vTask1_Producer, "Producer", stack_size, NULL, priority, &handle);
```

### 2. 信号量使用
```c
// 创建计数信号量
xCountingSemaphore = xSemaphoreCreateCounting(10, 0);

// 等待信号量
xSemaphoreTake(xCountingSemaphore, timeout);

// 释放信号量
xSemaphoreGive(xCountingSemaphore);
```

### 3. 互斥量使用
```c
// 创建互斥量
xMutex = xSemaphoreCreateMutex();

// 获取互斥量
xSemaphoreTake(xMutex, timeout);

// 释放互斥量
xSemaphoreGive(xMutex);
```

### 4. 队列通信
```c
// 创建队列
xQueue = xQueueCreate(length, item_size);

// 发送数据
xQueueSend(xQueue, &data, timeout);

// 接收数据
xQueueReceive(xQueue, &buffer, timeout);
```

### 5. 任务延迟
```c
// 相对延迟
vTaskDelay(pdMS_TO_TICKS(1000)); // 1秒

// 周期性延迟
vTaskDelayUntil(&xLastWakeTime, xFrequency);
```

## 注意事项

1. **模拟实现**: 这是一个教学用的模拟实现，实际的 FreeRTOS 在嵌入式系统中运行
2. **线程安全**: 使用了 pthread 库来模拟 RTOS 的多任务特性
3. **时间精度**: 时间控制基于 usleep()，精度有限
4. **资源管理**: 程序运行时请注意资源使用，按 Ctrl+C 退出

## 进一步学习

完成这个示例后，建议：

1. **修改任务优先级**，观察调度行为变化
2. **增加更多任务**，实验任务间通信
3. **调整队列大小**，观察阻塞行为
4. **模拟硬件中断**，理解中断服务例程
5. **学习真实的嵌入式开发板**，如 STM32、ESP32 等

## 扩展实验

1. **优先级倒置**: 创建高、中、低三个优先级任务，观察优先级倒置现象
2. **饥饿现象**: 创建多个不同优先级任务，观察低优先级任务的执行情况
3. **死锁检测**: 创建可能导致死锁的场景，学习避免死锁的方法
4. **性能测试**: 测量任务切换时间、中断响应时间等性能指标

## 相关资源

- [FreeRTOS 官方文档](https://www.freertos.org/Documentation/RTOS_book.html)
- [FreeRTOS API 参考](https://www.freertos.org/a00106.html)
- [实时系统设计原理](https://en.wikipedia.org/wiki/Real-time_operating_system)