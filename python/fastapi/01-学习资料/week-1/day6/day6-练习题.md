# Day 6: 实践练习 - 中间件与 CORS

## 练习说明
- 请在 `day6-exercises.py` 文件中完成以下练习
- 理解中间件的执行流程和用途
- 完成后运行并测试
- 参考答案在 `day6-solutions.py` 文件中

---

## 练习 1: 基础日志中间件 (基础) ⭐

**需求：**
创建一个日志中间件，记录以下信息：
- 请求方法和路径
- 请求开始时间
- 响应状态码
- 处理耗时

**要求：**
1. 使用 `@app.middleware("http")` 装饰器
2. 记录请求开始和完成信息
3. 在响应头中添加 `X-Process-Time`

**测试：**
```bash
curl -v http://localhost:8000/test
# 检查响应头中的 X-Process-Time
```

---

## 练习 2: CORS 配置 (基础) ⭐

**需求：**
配置 CORS 允许前端应用访问：

1. **开发环境配置**：
   - 允许的源：`http://localhost:3000`, `http://localhost:5173`
   - 允许的方法：所有
   - 允许的头：所有
   - 允许携带凭证

2. **创建测试端点**：
   - `GET /api/users` - 返回用户列表
   - `POST /api/users` - 创建用户

**测试（使用前端）：**
```javascript
// 在浏览器控制台测试
fetch('http://localhost:8000/api/users', {
  method: 'GET',
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
```

---

## 练习 3: 请求 ID 中间件 (中等) ⭐⭐

**需求：**
为每个请求添加唯一的请求 ID：

1. 生成或从请求头获取 `X-Request-ID`
2. 将 ID 存储在 `request.state`
3. 在响应头中返回 `X-Request-ID`
4. 在日志中使用请求 ID

**示例输出：**
```
[abc-123] Started GET /users
[abc-123] Completed GET /users Status: 200 Duration: 0.123s
```

**测试：**
```bash
# 不带 request ID
curl -v http://localhost:8000/test

# 带自定义 request ID
curl -v -H "X-Request-ID: my-custom-id" http://localhost:8000/test
```

---

## 练习 4: 认证中间件 (中等) ⭐⭐

**需求：**
创建认证中间件保护特定路径：

1. **保护的路径**：`/api/protected/*`, `/admin/*`
2. **认证方式**：Bearer Token
3. **Token 验证**：简单验证 token 是否在白名单中
4. **未认证响应**：401 状态码，带 `WWW-Authenticate` 头

**Token 白名单：**
```python
valid_tokens = {
    "user-token-123": {"username": "user1", "role": "user"},
    "admin-token-456": {"username": "admin1", "role": "admin"}
}
```

**测试：**
```bash
# 公开端点（不需要认证）
curl http://localhost:8000/api/public/data

# 受保护端点（需要认证）
curl http://localhost:8000/api/protected/data  # 应该返回 401

# 带 token 访问
curl -H "Authorization: Bearer user-token-123" http://localhost:8000/api/protected/data
```

---

## 练习 5: 性能监控中间件 (困难) ⭐⭐⭐

**需求：**
创建性能监控中间件收集统计信息：

1. **统计内容**：
   - 总请求数
   - 每个端点的请求数
   - 每个端点的平均响应时间
   - 每个状态码的数量

2. **创建统计端点**：
   - `GET /stats` - 返回统计信息
   - `POST /stats/reset` - 重置统计

3. **添加响应头**：
   - `X-Response-Time` - 本次请求耗时
   - `X-Total-Requests` - 总请求数

**输出示例：**
```json
{
  "total_requests": 150,
  "endpoints": {
    "GET /users": {"count": 50, "avg_time": 0.123},
    "POST /users": {"count": 20, "avg_time": 0.234}
  },
  "status_codes": {
    "200": 140,
    "404": 8,
    "500": 2
  }
}
```

---

## 练习 6: 速率限制中间件 (困难) ⭐⭐⭐

**需求：**
实现简单的速率限制（IP 基础）：

1. **限制规则**：
   - 每个 IP 每分钟最多 10 个请求
   - 超过限制返回 429 状态码

2. **响应头**：
   - `X-Rate-Limit-Limit` - 限制数量
   - `X-Rate-Limit-Remaining` - 剩余请求数
   - `X-Rate-Limit-Reset` - 重置时间（秒）
   - `Retry-After` - 超限后需要等待的时间

3. **清理过期记录**：定期清理超过时间窗口的记录

**测试：**
```bash
# 快速发送多个请求
for i in {1..15}; do
  curl -v http://localhost:8000/test
  sleep 0.1
done
# 前 10 个应该成功，后 5 个应该返回 429
```

---

## 练习 7: 错误处理中间件 (挑战) ⭐⭐⭐⭐

**需求：**
创建统一的错误处理中间件：

1. **捕获所有未处理异常**
2. **返回统一错误格式**：
   ```json
   {
     "error": "internal_error",
     "message": "An unexpected error occurred",
     "request_id": "abc-123",
     "timestamp": "2024-01-26T10:00:00",
     "path": "/api/test"
   }
   ```

3. **日志记录**：
   - 记录完整的错误堆栈
   - 包含请求信息

4. **不同错误类型的处理**：
   - 路由未找到（404）
   - 验证错误（422）
   - 业务异常
   - 系统异常（500）

**测试：**
```bash
# 触发不同类型的错误
curl http://localhost:8000/non-existent     # 404
curl -X POST http://localhost:8000/users    # 422 (缺少参数)
curl http://localhost:8000/trigger-error    # 500 (模拟系统错误)
```

---

## 练习 8: 完整中间件栈 (综合) 🏆

**需求：**
整合所有中间件，构建完整的中间件栈：

1. **中间件顺序**（从外到内）：
   - 错误处理中间件
   - 请求 ID 中间件
   - 日志中间件
   - 速率限制中间件
   - 认证中间件
   - 性能监控中间件
   - CORS 中间件
   - GZip 压缩中间件

2. **确保顺序正确**：后添加的先执行

3. **创建完整的 API**：
   - 公开端点：`/`, `/health`, `/stats`
   - 受保护端点：`/api/protected/*`
   - 管理端点：`/admin/*`

4. **测试场景**：
   - 正常请求流程
   - 认证失败
   - 速率限制
   - 错误处理
   - 性能监控

---

## 挑战任务：高级中间件功能 (专家) 💎

**需求：**
实现高级中间件功能：

1. **缓存中间件**：
   - 缓存 GET 请求的响应
   - 支持 TTL（过期时间）
   - 添加 `X-Cache: HIT/MISS` 头

2. **压缩中间件**：
   - 根据 `Accept-Encoding` 选择压缩算法
   - 支持 gzip 和 brotli
   - 只压缩超过阈值的响应

3. **请求队列中间件**：
   - 限制并发请求数
   - 超过限制的请求排队等待
   - 添加 `X-Queue-Position` 头

4. **健康检查中间件**：
   - 监控应用健康状态
   - 不健康时返回 503
   - 提供健康检查端点

---

## 评分标准

### 基础分（60分）
- [ ] 完成练习 1-2
- [ ] 正确使用中间件装饰器
- [ ] 理解中间件执行流程
- [ ] CORS 基本配置

### 进阶分（80分）
- [ ] 完成练习 3-5
- [ ] 请求状态管理
- [ ] 性能监控实现
- [ ] 合理的日志记录

### 高级分（100分）
- [ ] 完成练习 6-7
- [ ] 速率限制实现
- [ ] 统一错误处理
- [ ] 中间件栈组织

### 挑战分（120分）
- [ ] 完成练习 8 和挑战任务
- [ ] 高级缓存机制
- [ ] 并发控制
- [ ] 完善的监控系统

---

## 学习建议

1. **理解执行顺序**：打印日志观察中间件执行顺序
2. **逐步添加**：一个一个中间件添加，观察效果
3. **测试边界**：测试各种异常情况
4. **性能考虑**：注意中间件对性能的影响
5. **安全第一**：认证和速率限制要严格

---

## 下一步

完成练习后：
1. 对照参考答案
2. 优化中间件性能
3. 思考实际应用场景
4. 准备 Day 7 的综合项目

加油！💪
