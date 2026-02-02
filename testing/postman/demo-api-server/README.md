# Demo API Server Documentation

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [安装和运行](#安装和运行)
  - [安装依赖](#安装依赖)
  - [运行服务器](#运行服务器)
  - [运行测试](#运行测试)
- [API 端点](#api-端点)
  - [数据模型](#数据模型)
  - [端点列表](#端点列表)
- [错误码](#错误码)
- [测试](#测试)
  - [自动化测试](#自动化测试)
  - [手动测试](#手动测试)
- [日志](#日志)
- [数据库](#数据库)
- [开发](#开发)
  - [TDD 开发流程](#tdd-开发流程)
  - [项目结构](#项目结构)
- [贡献](#贡献)
- [许可证](#许可证)

## 项目概述

这是一个简单的 REST API 服务器，使用 Node.js、Express 和 SQLite 数据库实现。提供基本的 CRUD 操作，用于演示和学习目的。

## 技术栈

- **Node.js**: JavaScript 运行环境
- **Express**: Web 框架
- **SQLite**: 轻量级数据库
- **Jest & Supertest**: 测试框架

## 安装和运行

### 安装依赖

```bash
npm install
```

### 运行服务器

```bash
npm start
# 或
node server.js
```

服务器将在 `http://localhost:3000` 启动。

### 运行测试

```bash
npm test
```

## API 端点

### 数据模型

Item 对象结构：
```json
{
  "id": 1,
  "name": "Item Name",
  "createdAt": "2026-01-18T08:09:20.741Z"
}
```

### 端点列表

#### 1. GET /items
获取所有 items。

**请求**
```
GET /items
```

**响应**
```json
[
  {
    "id": 1,
    "name": "Item 1",
    "createdAt": "2026-01-18T08:09:20.741Z"
  },
  {
    "id": 2,
    "name": "Item 2",
    "createdAt": "2026-01-18T08:09:20.741Z"
  }
]
```

#### 2. GET /items/:id
获取指定 ID 的 item。

**请求**
```
GET /items/1
```

**响应**
```json
{
  "id": 1,
  "name": "Item 1",
  "createdAt": "2026-01-18T08:09:20.741Z"
}
```

**错误响应** (404)
```json
{
  "message": "Item not found"
}
```

#### 3. POST /items
创建新 item。

**请求**
```
POST /items
Content-Type: application/json

{
  "name": "New Item"
}
```

**响应** (201)
```json
{
  "id": 3,
  "name": "New Item",
  "createdAt": "2026-01-18T09:00:00.000Z"
}
```

**错误响应** (400)
```json
{
  "message": "name is required"
}
```

#### 4. PUT /items/:id
更新指定 ID 的 item。

**请求**
```
PUT /items/1
Content-Type: application/json

{
  "name": "Updated Item"
}
```

**响应**
```json
{
  "id": 1,
  "name": "Updated Item",
  "createdAt": "2026-01-18T08:09:20.741Z"
}
```

**错误响应** (400/404)
```json
{
  "message": "name is required"
}
// 或
{
  "message": "Item not found"
}
```

#### 5. DELETE /items/:id
删除指定 ID 的 item。

**请求**
```
DELETE /items/1
```

**响应**
```json
{
  "message": "Item deleted successfully"
}
```

**错误响应** (404)
```json
{
  "message": "Item not found"
}
```

## 错误码

- **200 OK**: 成功
- **201 Created**: 创建成功
- **400 Bad Request**: 请求参数错误
- **404 Not Found**: 资源不存在
- **500 Internal Server Error**: 服务器错误

## 测试

### 自动化测试
运行 `npm test` 执行所有测试用例。

### 手动测试
使用 curl 或 Postman 测试 API：

```bash
# 获取所有 items
curl http://localhost:3000/items

# 创建新 item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item"}'

# 更新 item
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item"}'

# 删除 item
curl -X DELETE http://localhost:3000/items/1
```

## 日志

服务器会记录所有请求和操作到控制台，包括时间戳和详细信息。

## 数据库

数据存储在 `items.db` SQLite 文件中。服务器启动时会自动创建表和默认数据。

## 开发

### TDD 开发流程
项目使用测试驱动开发 (TDD) 流程：
1. 写失败的测试
2. 写最少代码让测试通过
3. 重构代码

### 项目结构
```
demo-api-server/
├── server.js          # 主服务器文件
├── server.test.js     # 测试文件
├── package.json       # 项目配置
├── items.db          # SQLite 数据库文件
└── node_modules/     # 依赖包
```

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

ISC