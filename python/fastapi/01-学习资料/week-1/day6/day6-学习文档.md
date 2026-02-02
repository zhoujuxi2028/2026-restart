# Day 6: 中间件与 CORS 配置

## 学习目标
- 理解中间件（Middleware）的概念和作用
- 掌握 FastAPI 中间件的使用方法
- 学会配置 CORS（跨域资源共享）
- 掌握自定义中间件的编写
- 理解请求/响应拦截和处理

---

## 1. 什么是中间件？

### 1.1 核心概念

**中间件**是在请求到达路由处理函数之前和响应返回客户端之后执行的代码。

```
客户端请求
    ↓
中间件 1 (请求处理)
    ↓
中间件 2 (请求处理)
    ↓
路由处理函数
    ↓
中间件 2 (响应处理)
    ↓
中间件 1 (响应处理)
    ↓
客户端响应
```

**用途：**
- 记录请求日志
- 添加响应头
- 处理认证和授权
- 处理 CORS
- 性能监控
- 错误处理

### 1.2 基础中间件

```python
from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """添加处理时间头"""
    start_time = time.time()
    
    # 调用下一个中间件或路由处理函数
    response = await call_next(request)
    
    # 计算处理时间
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

---

## 2. CORS (跨域资源共享)

### 2.1 什么是 CORS？

CORS 是一种机制，允许浏览器从不同源（域名、协议或端口）请求资源。

**同源示例：**
- `http://example.com/api` 和 `http://example.com/data` ✓ 同源
- `http://example.com` 和 `https://example.com` ✗ 不同协议
- `http://example.com` 和 `http://api.example.com` ✗ 不同域名
- `http://example.com:80` 和 `http://example.com:8000` ✗ 不同端口

### 2.2 基础 CORS 配置

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源（生产环境应该限制）
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头
)

@app.get("/api/data")
async def get_data():
    return {"data": "This can be accessed from any origin"}
```

### 2.3 安全的 CORS 配置

```python
# 生产环境的安全配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://example.com",
        "https://www.example.com",
        "https://app.example.com"
    ],  # 只允许特定源
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # 限制方法
    allow_headers=["Content-Type", "Authorization"],  # 限制头
    max_age=3600,  # 预检请求缓存时间（秒）
)
```

### 2.4 动态 CORS 配置

```python
from fastapi import Request

def get_allowed_origins():
    """动态获取允许的源"""
    return [
        "https://example.com",
        "https://staging.example.com"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 3. 自定义中间件

### 3.1 日志中间件

```python
from fastapi import Request
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """记录所有请求"""
    # 请求开始
    start_time = time.time()
    logger.info(f"Started request: {request.method} {request.url.path}")
    
    # 处理请求
    response = await call_next(request)
    
    # 请求完成
    process_time = time.time() - start_time
    logger.info(
        f"Completed request: {request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Duration: {process_time:.3f}s"
    )
    
    return response
```

### 3.2 错误处理中间件

```python
from fastapi.responses import JSONResponse

@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    """捕获所有未处理的异常"""
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"Unhandled exception: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "internal_server_error",
                "message": "An unexpected error occurred",
                "path": str(request.url.path)
            }
        )
```

### 3.3 认证中间件

```python
from fastapi import HTTPException

# 需要认证的路径
PROTECTED_PATHS = ["/api/admin", "/api/users"]

@app.middleware("http")
async def authenticate_requests(request: Request, call_next):
    """认证中间件"""
    # 检查路径是否需要认证
    path = request.url.path
    needs_auth = any(path.startswith(protected) for protected in PROTECTED_PATHS)
    
    if needs_auth:
        # 检查 Authorization 头
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"error": "unauthorized", "message": "Authentication required"}
            )
        
        token = auth_header.replace("Bearer ", "")
        # 简化的 token 验证
        if token != "valid-token":
            return JSONResponse(
                status_code=401,
                content={"error": "unauthorized", "message": "Invalid token"}
            )
    
    response = await call_next(request)
    return response
```

### 3.4 请求ID中间件

```python
import uuid

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """为每个请求添加唯一ID"""
    # 生成或获取请求 ID
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    
    # 添加到请求状态（可在路由中访问）
    request.state.request_id = request_id
    
    # 处理请求
    response = await call_next(request)
    
    # 添加到响应头
    response.headers["X-Request-ID"] = request_id
    
    return response

# 在路由中访问
@app.get("/test")
async def test_route(request: Request):
    request_id = request.state.request_id
    return {"request_id": request_id}
```

---

## 4. 性能监控中间件

### 4.1 请求计数和耗时

```python
from collections import defaultdict
from datetime import datetime

# 统计数据
request_stats = {
    "total_requests": 0,
    "endpoint_stats": defaultdict(lambda: {"count": 0, "total_time": 0.0}),
    "status_codes": defaultdict(int)
}

@app.middleware("http")
async def monitor_performance(request: Request, call_next):
    """性能监控中间件"""
    start_time = time.time()
    
    # 处理请求
    response = await call_next(request)
    
    # 记录统计
    duration = time.time() - start_time
    endpoint = f"{request.method} {request.url.path}"
    
    request_stats["total_requests"] += 1
    request_stats["endpoint_stats"][endpoint]["count"] += 1
    request_stats["endpoint_stats"][endpoint]["total_time"] += duration
    request_stats["status_codes"][response.status_code] += 1
    
    # 添加性能头
    response.headers["X-Response-Time"] = f"{duration:.3f}"
    
    return response

@app.get("/stats")
async def get_stats():
    """获取统计信息"""
    # 计算平均响应时间
    endpoint_stats_with_avg = {}
    for endpoint, stats in request_stats["endpoint_stats"].items():
        avg_time = stats["total_time"] / stats["count"] if stats["count"] > 0 else 0
        endpoint_stats_with_avg[endpoint] = {
            "count": stats["count"],
            "avg_response_time": f"{avg_time:.3f}s"
        }
    
    return {
        "total_requests": request_stats["total_requests"],
        "endpoint_stats": endpoint_stats_with_avg,
        "status_codes": dict(request_stats["status_codes"])
    }
```

### 4.2 速率限制中间件

```python
from collections import defaultdict
from datetime import datetime, timedelta

# 速率限制配置
RATE_LIMIT_REQUESTS = 10  # 每分钟请求数
RATE_LIMIT_WINDOW = 60    # 时间窗口（秒）

# 存储请求历史
request_history = defaultdict(list)

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    """速率限制中间件"""
    # 获取客户端 IP
    client_ip = request.client.host
    
    # 清理过期记录
    now = datetime.now()
    cutoff_time = now - timedelta(seconds=RATE_LIMIT_WINDOW)
    request_history[client_ip] = [
        req_time for req_time in request_history[client_ip]
        if req_time > cutoff_time
    ]
    
    # 检查是否超过限制
    if len(request_history[client_ip]) >= RATE_LIMIT_REQUESTS:
        return JSONResponse(
            status_code=429,
            content={
                "error": "rate_limit_exceeded",
                "message": f"Too many requests. Limit: {RATE_LIMIT_REQUESTS} per {RATE_LIMIT_WINDOW}s"
            },
            headers={"Retry-After": str(RATE_LIMIT_WINDOW)}
        )
    
    # 记录请求
    request_history[client_ip].append(now)
    
    # 处理请求
    response = await call_next(request)
    
    # 添加速率限制头
    remaining = RATE_LIMIT_REQUESTS - len(request_history[client_ip])
    response.headers["X-Rate-Limit-Limit"] = str(RATE_LIMIT_REQUESTS)
    response.headers["X-Rate-Limit-Remaining"] = str(remaining)
    response.headers["X-Rate-Limit-Reset"] = str(RATE_LIMIT_WINDOW)
    
    return response
```

---

## 5. 使用 Starlette 中间件

### 5.1 GZip 压缩

```python
from starlette.middleware.gzip import GZipMiddleware

# 添加 GZip 压缩
app.add_middleware(GZipMiddleware, minimum_size=1000)  # 最小 1KB

@app.get("/large-data")
async def get_large_data():
    """返回大量数据（自动压缩）"""
    return {"data": "x" * 10000}
```

### 5.2 HTTPS 重定向

```python
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

# 生产环境：强制 HTTPS
app.add_middleware(HTTPSRedirectMiddleware)
```

### 5.3 Trusted Host

```python
from starlette.middleware.trustedhostmiddleware import TrustedHostMiddleware

# 只允许特定主机
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["example.com", "*.example.com"]
)
```

---

## 6. 中间件执行顺序

### 6.1 理解执行顺序

```python
@app.middleware("http")
async def middleware_1(request: Request, call_next):
    print("Middleware 1: Before request")
    response = await call_next(request)
    print("Middleware 1: After request")
    return response

@app.middleware("http")
async def middleware_2(request: Request, call_next):
    print("Middleware 2: Before request")
    response = await call_next(request)
    print("Middleware 2: After request")
    return response

@app.get("/test")
async def test():
    print("Route handler")
    return {"message": "test"}

# 输出顺序：
# Middleware 2: Before request
# Middleware 1: Before request
# Route handler
# Middleware 1: After request
# Middleware 2: After request
```

### 6.2 中间件最佳实践

```python
# 正确的顺序（从最后添加到最先添加）
app.add_middleware(GZipMiddleware)              # 最后执行（压缩响应）
app.add_middleware(CORSMiddleware, ...)         # CORS处理
# 自定义中间件通过 @app.middleware 添加
# 认证中间件
# 日志中间件
# 错误处理中间件                              # 最先执行（捕获所有错误）
```

---

## 7. 实战示例：完整的中间件栈

```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.gzip import GZipMiddleware
import time
import logging
import uuid

app = FastAPI(title="Complete Middleware Stack")

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== 1. 错误处理中间件（最先执行） ====================

@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    """捕获所有错误"""
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"Unhandled error: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "internal_error",
                "message": "An unexpected error occurred",
                "request_id": getattr(request.state, "request_id", "unknown")
            }
        )

# ==================== 2. 请求ID中间件 ====================

@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    """添加请求ID"""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    
    return response

# ==================== 3. 日志中间件 ====================

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """记录请求日志"""
    start_time = time.time()
    request_id = request.state.request_id
    
    logger.info(
        f"[{request_id}] Started {request.method} {request.url.path} "
        f"from {request.client.host}"
    )
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    logger.info(
        f"[{request_id}] Completed {request.method} {request.url.path} "
        f"Status: {response.status_code} Duration: {duration:.3f}s"
    )
    
    response.headers["X-Response-Time"] = f"{duration:.3f}"
    return response

# ==================== 4. 认证中间件 ====================

PROTECTED_PATHS = ["/api/admin", "/api/protected"]

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    """认证检查"""
    path = request.url.path
    
    if any(path.startswith(p) for p in PROTECTED_PATHS):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if token != "valid-token":
            return JSONResponse(
                status_code=401,
                content={"error": "unauthorized", "message": "Invalid credentials"}
            )
    
    return await call_next(request)

# ==================== 5. CORS 中间件 ====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== 6. GZip 压缩（最后执行） ====================

app.add_middleware(GZipMiddleware, minimum_size=500)

# ==================== 路由 ====================

@app.get("/")
async def root():
    return {"message": "Hello with middleware stack"}

@app.get("/api/protected/data")
async def protected_data(request: Request):
    return {
        "message": "Protected data",
        "request_id": request.state.request_id
    }

@app.get("/api/large-data")
async def large_data():
    """大数据（会被压缩）"""
    return {"data": "x" * 5000}
```

---

## 8. 重点总结

### 今天你学到了：

1. **中间件概念**
   - 请求/响应拦截
   - 执行顺序
   - 用途和场景

2. **CORS 配置**
   - 什么是跨域
   - 安全的 CORS 配置
   - 动态配置

3. **自定义中间件**
   - 日志中间件
   - 认证中间件
   - 性能监控
   - 速率限制

4. **内置中间件**
   - GZip 压缩
   - HTTPS 重定向
   - Trusted Host

### 最佳实践：

- 按正确顺序添加中间件
- 错误处理中间件放在最外层
- 压缩中间件放在最内层
- 合理使用 request.state 传递数据
- 记录详细的日志信息
- 生产环境限制 CORS 源

### 关键要点：

- **执行顺序很重要**：后添加的先执行
- **异常处理**：确保中间件不会泄露敏感信息
- **性能考虑**：中间件会影响所有请求
- **安全第一**：CORS、认证、速率限制

---

## 9. 下一步

Day 7 我们将整合所有知识，构建一个完整的项目！
