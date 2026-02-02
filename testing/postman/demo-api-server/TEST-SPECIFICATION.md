# 📋 Demo API Server - 测试规范文档

## 📖 目录

- [文档简介](#文档简介)
- [测试用例编号规范](#测试用例编号规范)
- [完整测试用例列表](#完整测试用例列表)
- [测试执行指南](#测试执行指南)
- [新测试用例添加指南](#新测试用例添加指南)
- [项目测试架构](#项目测试架构)

---

## 📄 文档简介

### 文档目的
本文档是 **Demo API Server** 项目的官方测试规范，定义了测试用例的编号规范、组织结构和执行指南。

### 适用范围
- 项目开发团队成员
- 新加入项目的开发者
- 代码审查和质量保证

### 项目概览
Demo API Server 是一个集成多种技术的示例项目，包含：
- **Node.js + Express** REST API 服务器
- **SQLite 数据库** CRUD 操作
- **C++ 程序集成** 数学计算功能
- **Java 程序集成** 数据处理功能

### 测试统计
- **总测试用例数**: 33个
- **测试覆盖模块**: 3个 (数据库、C++集成、Java集成)
- **测试方法**: Test-Driven Development (TDD)
- **测试框架**: Jest + Supertest

---

## 🎯 测试用例编号规范

### 📐 编号格式标准

```
[模块标识]-[功能类型]-[结果类型]-[序号]
```

### 🏷️ 标识符说明

#### 模块标识 (Module)
| 标识 | 含义 | 范围 |
|------|------|------|
| **DB** | Database | 数据库 CRUD 操作测试 |
| **CPP** | C++ Integration | C++ 程序集成测试 |
| **JAVA** | Java Integration | Java 程序集成测试 |

#### 功能类型 (Function Type)
| 类型 | 含义 | 适用场景 |
|------|------|----------|
| **CRUD-GET** | 数据获取操作 | GET 请求测试 |
| **CRUD-POST** | 数据创建操作 | POST 请求测试 |
| **CRUD-PUT** | 数据更新操作 | PUT 请求测试 |
| **CRUD-DELETE** | 数据删除操作 | DELETE 请求测试 |
| **INTEGRATION-CALC** | 计算集成功能 | C++ 数学计算测试 |
| **INTEGRATION-PROCESS** | 数据处理集成功能 | Java 数据处理测试 |
| **STATUS-CHECK** | 状态检查功能 | 系统状态监控测试 |

#### 结果类型 (Result Type)
| 类型 | 含义 | 测试场景 |
|------|------|----------|
| **SUCCESS** | 成功场景 | 正常流程，期望成功的操作 |
| **VALIDATION** | 参数验证 | 输入验证，数据格式检查 |
| **ERROR** | 错误处理 | 异常情况，错误边界测试 |

#### 序号 (Number)
- 从 **01** 开始的两位数序号
- 在同一分类下按顺序递增
- 便于快速定位和引用

### 💡 编号示例

```
DB-CRUD-GET-SUCCESS-01     → 数据库获取操作的第1个成功场景测试
CPP-INTEGRATION-CALC-VALIDATION-02  → C++计算集成的第2个参数验证测试
JAVA-STATUS-CHECK-SUCCESS-01 → Java状态检查的第1个成功场景测试
```

---

## 📊 完整测试用例列表

### 🗃️ 数据库 CRUD 测试 (10个测试用例)

**测试文件**: `server.test.js`

#### GET 操作测试
| 编号 | 测试描述 | API 端点 | 期望结果 |
|------|----------|----------|----------|
| **DB-CRUD-GET-SUCCESS-01** | 获取所有项目列表 | `GET /items` | 200 + 项目数组 |
| **DB-CRUD-GET-SUCCESS-02** | 获取指定项目 | `GET /items/:id` | 200 + 项目对象 |
| **DB-CRUD-GET-ERROR-01** | 获取不存在项目 | `GET /items/999` | 404 + 错误信息 |

#### POST 操作测试
| 编号 | 测试描述 | API 端点 | 期望结果 |
|------|----------|----------|----------|
| **DB-CRUD-POST-SUCCESS-01** | 创建新项目 | `POST /items` | 201 + 新项目对象 |
| **DB-CRUD-POST-VALIDATION-01** | 缺少name字段验证 | `POST /items` | 400 + 验证错误 |

#### PUT 操作测试
| 编号 | 测试描述 | API 端点 | 期望结果 |
|------|----------|----------|----------|
| **DB-CRUD-PUT-SUCCESS-01** | 更新已存在项目 | `PUT /items/:id` | 200 + 更新后对象 |
| **DB-CRUD-PUT-ERROR-01** | 更新不存在项目 | `PUT /items/999` | 404 + 错误信息 |
| **DB-CRUD-PUT-VALIDATION-01** | 缺少name字段验证 | `PUT /items/:id` | 400 + 验证错误 |

#### DELETE 操作测试
| 编号 | 测试描述 | API 端点 | 期望结果 |
|------|----------|----------|----------|
| **DB-CRUD-DELETE-SUCCESS-01** | 删除已存在项目 | `DELETE /items/:id` | 200 + 删除确认 |
| **DB-CRUD-DELETE-ERROR-01** | 删除不存在项目 | `DELETE /items/999` | 404 + 错误信息 |

### ⚡ C++ 集成测试 (10个测试用例)

**测试文件**: `server.cpp.test.js`

#### 计算功能测试
| 编号 | 测试描述 | 操作类型 | 测试数据 | 期望结果 |
|------|----------|----------|----------|----------|
| **CPP-INTEGRATION-CALC-SUCCESS-01** | C++加法运算 | `add` | `[15, 25]` | `40` |
| **CPP-INTEGRATION-CALC-SUCCESS-02** | C++乘法运算 | `multiply` | `[7, 8]` | `56` |
| **CPP-INTEGRATION-CALC-SUCCESS-03** | C++斐波那契计算 | `fibonacci` | `[10]` | `55` |
| **CPP-INTEGRATION-CALC-SUCCESS-04** | C++平方和计算 | `squares` | `[3, 4, 5]` | `50` |

#### 参数验证测试
| 编号 | 测试描述 | 验证场景 | 期望结果 |
|------|----------|----------|----------|
| **CPP-INTEGRATION-CALC-VALIDATION-01** | 无效操作类型验证 | `invalid_op` | 400 + 错误信息 |
| **CPP-INTEGRATION-CALC-VALIDATION-02** | 缺少operation验证 | 无operation字段 | 400 + 错误信息 |
| **CPP-INTEGRATION-CALC-VALIDATION-03** | 缺少numbers验证 | 无numbers字段 | 400 + 错误信息 |
| **CPP-INTEGRATION-CALC-VALIDATION-04** | 数字参数数量验证 | add操作仅1个数字 | 400 + 错误信息 |

#### 错误处理测试
| 编号 | 测试描述 | 测试场景 | 期望结果 |
|------|----------|----------|----------|
| **CPP-INTEGRATION-CALC-ERROR-01** | C++程序执行错误处理 | 程序不存在/执行失败 | 200 或 500 |

#### 状态检查测试
| 编号 | 测试描述 | API 端点 | 期望结果 |
|------|----------|----------|----------|
| **CPP-STATUS-CHECK-SUCCESS-01** | C++集成状态检查 | `GET /api/cpp/status` | 200 + 状态信息 |

### ☕ Java 集成测试 (13个测试用例)

**测试文件**: `server.java.test.js`

#### 数据处理功能测试
| 编号 | 测试描述 | 操作类型 | 测试数据 | 期望结果 |
|------|----------|----------|----------|----------|
| **JAVA-INTEGRATION-PROCESS-SUCCESS-01** | Java字符串反转 | `reverse` | `"Hello World"` | `"dlroW olleH"` |
| **JAVA-INTEGRATION-PROCESS-SUCCESS-02** | Java数组排序 | `sort` | `["cherry","apple","banana"]` | `"apple,banana,cherry"` |
| **JAVA-INTEGRATION-PROCESS-SUCCESS-03** | Java质数检查 | `prime` | `17` | `"true"` |
| **JAVA-INTEGRATION-PROCESS-SUCCESS-04** | Java阶乘计算 | `factorial` | `5` | `"120"` |
| **JAVA-INTEGRATION-PROCESS-SUCCESS-05** | Java字符串转大写 | `uppercase` | `"hello java"` | `"HELLO JAVA"` |
| **JAVA-INTEGRATION-PROCESS-SUCCESS-06** | Java回文检查 | `palindrome` | `"A man a plan a canal Panama"` | `"true"` |
| **JAVA-INTEGRATION-PROCESS-SUCCESS-07** | Java数组去重 | `unique` | `["apple","banana","apple"]` | `"apple,banana"` |
| **JAVA-INTEGRATION-PROCESS-SUCCESS-08** | Java单词计数 | `wordcount` | `"Java and Node.js integration"` | `"6"` |

#### 参数验证测试
| 编号 | 测试描述 | 验证场景 | 期望结果 |
|------|----------|----------|----------|
| **JAVA-INTEGRATION-PROCESS-VALIDATION-01** | 无效操作类型验证 | `invalid_operation` | 400 + 错误信息 |
| **JAVA-INTEGRATION-PROCESS-VALIDATION-02** | 缺少operation验证 | 无operation字段 | 400 + 错误信息 |
| **JAVA-INTEGRATION-PROCESS-VALIDATION-03** | 缺少data验证 | 无data字段 | 400 + 错误信息 |

#### 错误处理测试
| 编号 | 测试描述 | 测试场景 | 期望结果 |
|------|----------|----------|----------|
| **JAVA-INTEGRATION-PROCESS-ERROR-01** | Java程序执行错误处理 | 程序不存在/执行失败 | 200 或 500 |

#### 状态检查测试
| 编号 | 测试描述 | API 端点 | 期望结果 |
|------|----------|----------|----------|
| **JAVA-STATUS-CHECK-SUCCESS-01** | Java集成状态检查 | `GET /api/java/status` | 200 + 状态信息 |

---

## 🚀 测试执行指南

### 📋 基本测试命令

#### 运行所有测试
```bash
npm test
```
**期望输出**:
```
Test Suites: 3 passed, 3 total
Tests: 33 passed, 33 total
```

#### 运行特定模块测试
```bash
# 数据库 CRUD 测试
npm test server.test.js

# C++ 集成测试
npm test server.cpp.test.js

# Java 集成测试
npm test server.java.test.js
```

#### 监听模式（开发时使用）
```bash
npm run test:watch
```

#### 详细输出模式
```bash
npx jest --verbose
```

#### 测试覆盖率报告
```bash
npx jest --coverage
```

### 🔍 测试结果解读

#### 成功运行示例
```bash
PASS ./server.test.js (10个测试)
PASS ./server.cpp.test.js (10个测试)
PASS ./server.java.test.js (13个测试)
```

#### 失败案例分析
- **数据库连接错误**: 检查 SQLite 数据库配置
- **C++ 程序不存在**: 确保 `cpp/calculator` 已编译
- **Java 程序不存在**: 确保 `java/DataProcessor.class` 已编译

### 📊 测试环境要求

#### 系统依赖
- **Node.js**: v22.19.0 或更高版本
- **Java**: v8.0 或更高版本（用于 Java 集成测试）
- **C++ 编译器**: GCC 或 Clang（用于 C++ 集成测试）

#### 环境变量
```bash
NODE_ENV=test  # 自动设置，使用内存数据库
```

---

## ➕ 新测试用例添加指南

### 📝 编号分配规则

#### 1. 确定模块归属
- 数据库操作 → `DB`
- C++ 集成 → `CPP`
- Java 集成 → `JAVA`

#### 2. 确定功能类型
- CRUD 操作 → `CRUD-[GET/POST/PUT/DELETE]`
- C++ 计算 → `INTEGRATION-CALC`
- Java 处理 → `INTEGRATION-PROCESS`
- 状态检查 → `STATUS-CHECK`

#### 3. 确定结果类型
- 正常场景 → `SUCCESS`
- 参数验证 → `VALIDATION`
- 错误处理 → `ERROR`

#### 4. 分配序号
- 查找同类型现有测试的最大序号
- 新序号 = 最大序号 + 1
- 使用两位数格式 (01, 02, 03...)

### 💻 代码注释格式

```javascript
// [编号]: [测试描述]
// 功能: [详细功能说明]
// 期望: [期望结果描述]
// 依赖: [测试依赖条件]
// 说明: [额外说明信息]
it('[测试用例描述]', async () => {
  // 测试代码
});
```

### 🔄 添加流程示例

假设要添加一个新的数据库查询测试：

1. **确定编号**: `DB-CRUD-GET-SUCCESS-03`
2. **编写注释**:
```javascript
// DB-CRUD-GET-SUCCESS-03: 按条件查询项目列表
// 功能: 验证 GET /items?name=xxx 条件查询功能
// 期望: 200状态码 + 符合条件的项目数组
// 依赖: 数据库包含测试数据
// 说明: 测试查询参数功能
```

3. **更新文档**: 在本文档相应章节添加测试用例信息

---

## 🏗️ 项目测试架构

### 📐 技术架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Jest + Supertest   │    │   SQLite Database   │    │   Child Process     │
│   测试框架           │    │   内存数据库        │    │   进程调用          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Express Server                      │
│                       (server.js)                             │
└─────────────────────────────────────────────────────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database CRUD     │    │   C++ Calculator    │    │  Java DataProcessor │
│   /items APIs       │    │   /api/cpp/*        │    │   /api/java/*       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔄 TDD 开发流程

#### 红-绿-重构循环
1. **🔴 RED**: 编写失败的测试用例
2. **🟢 GREEN**: 编写最少代码使测试通过
3. **🔵 BLUE**: 重构代码，保持测试通过

#### 测试隔离机制
- **环境隔离**: `NODE_ENV=test` 使用内存数据库
- **数据隔离**: 每个测试套件独立的数据库实例
- **进程隔离**: C++/Java 程序通过子进程调用

### 🌐 跨语言集成架构

#### C++ 集成流程
```
HTTP Request → Node.js API → Child Process → C++ Executable → stdout → JSON Response
```

#### Java 集成流程
```
HTTP Request → Node.js API → Child Process → Java JVM → stdout → JSON Response
```

#### 通信协议
- **输入**: JSON 格式的 HTTP 请求
- **处理**: 命令行参数传递
- **输出**: 标准化的 `RESULT: xxx` 格式
- **响应**: JSON 格式的 HTTP 响应

### 📈 测试覆盖范围

#### 功能覆盖
- ✅ **API 端点**: 100% 覆盖所有 REST 端点
- ✅ **业务逻辑**: CRUD 操作、计算功能、数据处理
- ✅ **集成测试**: 跨语言程序调用
- ✅ **错误处理**: 参数验证、异常情况

#### 场景覆盖
- ✅ **正常流程**: 成功场景测试 (19个)
- ✅ **参数验证**: 输入验证测试 (8个)
- ✅ **错误处理**: 异常边界测试 (4个)
- ✅ **状态监控**: 系统状态检查 (2个)

---

## 📚 参考信息

### 🔗 相关文档
- [Node.js 官方文档](https://nodejs.org/docs/)
- [Jest 测试框架](https://jestjs.io/docs/getting-started)
- [Supertest HTTP 测试](https://github.com/ladjs/supertest)

### 💼 最佳实践
1. **测试独立性**: 每个测试应该独立运行
2. **有意义的命名**: 测试描述应该清晰明确
3. **适当的断言**: 验证足够但不过度
4. **错误处理**: 覆盖边界情况和异常路径
5. **文档同步**: 代码变更时及时更新文档

### 🆕 版本历史
- **v1.0.0**: 初始版本，包含33个测试用例
- **编号规范**: 统一的测试用例编号格式
- **最后更新**: 2026-01-19

---

**📝 维护者**: Demo API Server 开发团队
**🔄 更新频率**: 随项目开发同步更新
**📧 联系方式**: 项目仓库 Issues 区域