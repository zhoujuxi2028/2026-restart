# Day 7: 综合项目 - Todo List API

## 项目概述

### 🎯 项目目标
构建一个功能完整的 Todo List RESTful API，整合 Week 1 学到的所有知识。

### ✨ 核心功能
1. **用户系统**
   - 用户注册
   - 用户登录（JWT Token）
   - 用户信息管理

2. **Todo 管理**
   - 创建 Todo
   - 查看 Todo（列表/详情）
   - 更新 Todo
   - 删除 Todo
   - 标记完成/未完成

3. **分类管理**
   - 创建分类
   - Todo 归类
   - 按分类筛选

4. **标签系统**
   - 添加标签
   - Todo 打标签
   - 按标签搜索

5. **高级功能**
   - 搜索和过滤
   - 排序（优先级、日期）
   - 统计信息
   - 分页

### 🛠 技术栈
- **框架**: FastAPI
- **验证**: Pydantic
- **认证**: JWT (简化实现)
- **存储**: 内存字典（模拟数据库）

---

## 项目结构

```
todo-api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # 应用入口
│   ├── config.py               # 配置
│   │
│   ├── api/                    # API 路由
│   │   ├── __init__.py
│   │   ├── deps.py             # 共享依赖
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py         # 认证路由
│   │       ├── todos.py        # Todo 路由
│   │       ├── categories.py   # 分类路由
│   │       └── tags.py         # 标签路由
│   │
│   ├── models/                 # Pydantic 模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── todo.py
│   │   ├── category.py
│   │   └── tag.py
│   │
│   ├── middleware/             # 中间件
│   │   ├── __init__.py
│   │   └── logging.py
│   │
│   ├── exceptions/             # 自定义异常
│   │   ├── __init__.py
│   │   └── custom.py
│   │
│   ├── database/               # 数据存储（模拟）
│   │   ├── __init__.py
│   │   └── memory.py
│   │
│   └── utils/                  # 工具函数
│       ├── __init__.py
│       └── security.py         # 密码哈希、JWT
│
├── tests/                      # 测试（可选）
│   └── __init__.py
│
├── requirements.txt
└── README.md
```

---

## 数据模型设计

### 1. 用户模型

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    """用户基础模型"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    """用户注册模型"""
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    """用户登录模型"""
    username: str
    password: str

class UserResponse(UserBase):
    """用户响应模型"""
    id: int
    created_at: datetime
    is_active: bool

class UserInDB(UserResponse):
    """数据库用户模型"""
    password_hash: str

class Token(BaseModel):
    """Token 响应模型"""
    access_token: str
    token_type: str = "bearer"
```

### 2. Todo 模型

```python
from enum import Enum

class Priority(str, Enum):
    """优先级枚举"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TodoBase(BaseModel):
    """Todo 基础模型"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    priority: Priority = Priority.MEDIUM
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None

class TodoCreate(TodoBase):
    """创建 Todo"""
    tag_ids: Optional[list[int]] = []

class TodoUpdate(BaseModel):
    """更新 Todo"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None
    category_id: Optional[int] = None

class TodoResponse(TodoBase):
    """Todo 响应模型"""
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    tags: list[str] = []
```

### 3. 分类模型

```python
class CategoryBase(BaseModel):
    """分类基础模型"""
    name: str = Field(..., min_length=1, max_length=100)
    color: Optional[str] = Field(None, regex="^#[0-9A-Fa-f]{6}$")  # 十六进制颜色
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    """创建分类"""
    pass

class CategoryResponse(CategoryBase):
    """分类响应模型"""
    id: int
    user_id: int
    todo_count: int
    created_at: datetime
```

### 4. 标签模型

```python
class TagBase(BaseModel):
    """标签基础模型"""
    name: str = Field(..., min_length=1, max_length=50)

class TagCreate(TagBase):
    """创建标签"""
    pass

class TagResponse(TagBase):
    """标签响应模型"""
    id: int
    user_id: int
    todo_count: int
```

---

## API 端点设计

### 认证端点 (`/api/v1/auth`)

```python
POST   /register        # 用户注册
POST   /login           # 用户登录
GET    /me              # 获取当前用户信息
```

### Todo 端点 (`/api/v1/todos`)

```python
GET    /                # 获取 Todo 列表（支持过滤、搜索、分页）
POST   /                # 创建 Todo
GET    /{todo_id}       # 获取 Todo 详情
PUT    /{todo_id}       # 更新 Todo
DELETE /{todo_id}       # 删除 Todo
PATCH  /{todo_id}/complete     # 标记为完成
PATCH  /{todo_id}/uncomplete   # 标记为未完成
```

**查询参数**:
- `q`: 搜索关键词
- `category_id`: 按分类筛选
- `tag_id`: 按标签筛选
- `is_completed`: 完成状态
- `priority`: 优先级
- `sort_by`: 排序字段（created_at, due_date, priority）
- `order`: 排序方向（asc, desc）
- `skip`: 分页偏移
- `limit`: 每页数量

### 分类端点 (`/api/v1/categories`)

```python
GET    /                # 获取分类列表
POST   /                # 创建分类
GET    /{category_id}   # 获取分类详情
PUT    /{category_id}   # 更新分类
DELETE /{category_id}   # 删除分类
GET    /{category_id}/todos  # 获取分类下的所有 Todo
```

### 标签端点 (`/api/v1/tags`)

```python
GET    /                # 获取标签列表
POST   /                # 创建标签
DELETE /{tag_id}        # 删除标签
GET    /{tag_id}/todos  # 获取标签下的所有 Todo
```

### 统计端点 (`/api/v1/stats`)

```python
GET    /overview        # 统计概览
GET    /by-category     # 按分类统计
GET    /by-priority     # 按优先级统计
```

---

## 核心功能实现

### 1. 依赖注入 - 认证

```python
# app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import decode_access_token
from app.database.memory import get_user_by_username

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """获取当前用户依赖"""
    token = credentials.credentials

    # 解码 token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # 获取用户
    username = payload.get("sub")
    user = get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

async def get_active_user(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """验证用户是否激活"""
    if not current_user.get("is_active"):
        raise HTTPException(status_code=403, detail="User is not active")
    return current_user
```

### 2. 中间件 - 日志和性能监控

```python
# app/middleware/logging.py
import time
import logging
from fastapi import Request

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """请求日志中间件"""
    start_time = time.time()
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    logger.info(
        f"[{request_id}] Started {request.method} {request.url.path}"
    )

    response = await call_next(request)

    duration = time.time() - start_time
    logger.info(
        f"[{request_id}] Completed Status: {response.status_code} "
        f"Duration: {duration:.3f}s"
    )

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(duration)

    return response
```

### 3. 路由 - Todo CRUD

```python
# app/api/v1/todos.py
from fastapi import APIRouter, Depends, Query
from app.api.deps import get_active_user
from app.models.todo import TodoCreate, TodoResponse, TodoUpdate
from app.database.memory import (
    create_todo, get_todos, get_todo_by_id,
    update_todo, delete_todo
)

router = APIRouter(prefix="/todos", tags=["todos"])

@router.post("/", response_model=TodoResponse, status_code=201)
async def create_new_todo(
    todo: TodoCreate,
    current_user: dict = Depends(get_active_user)
):
    """创建 Todo"""
    return create_todo(todo, current_user["id"])

@router.get("/", response_model=list[TodoResponse])
async def list_todos(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    is_completed: Optional[bool] = None,
    priority: Optional[Priority] = None,
    sort_by: str = Query("created_at", regex="^(created_at|due_date|priority)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    current_user: dict = Depends(get_active_user)
):
    """获取 Todo 列表（支持过滤和搜索）"""
    return get_todos(
        user_id=current_user["id"],
        skip=skip,
        limit=limit,
        search=q,
        category_id=category_id,
        is_completed=is_completed,
        priority=priority,
        sort_by=sort_by,
        order=order
    )

@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: int,
    current_user: dict = Depends(get_active_user)
):
    """获取 Todo 详情"""
    todo = get_todo_by_id(todo_id, current_user["id"])
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.put("/{todo_id}", response_model=TodoResponse)
async def update_existing_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    current_user: dict = Depends(get_active_user)
):
    """更新 Todo"""
    updated_todo = update_todo(todo_id, todo_update, current_user["id"])
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo

@router.delete("/{todo_id}", status_code=204)
async def delete_existing_todo(
    todo_id: int,
    current_user: dict = Depends(get_active_user)
):
    """删除 Todo"""
    success = delete_todo(todo_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return None
```

---

## 实现步骤

### 第 1 步: 项目搭建
1. 创建项目目录结构
2. 安装依赖
3. 创建基础配置

### 第 2 步: 数据模型
1. 定义所有 Pydantic 模型
2. 实现数据验证
3. 测试模型

### 第 3 步: 数据存储
1. 实现内存数据库
2. 编写 CRUD 函数
3. 添加搜索和过滤

### 第 4 步: 认证系统
1. 实现密码哈希
2. 实现 JWT token
3. 创建认证依赖

### 第 5 步: API 路由
1. 实现认证路由
2. 实现 Todo 路由
3. 实现分类和标签路由
4. 实现统计路由

### 第 6 步: 中间件
1. 添加日志中间件
2. 添加 CORS 配置
3. 添加错误处理

### 第 7 步: 测试
1. 手动测试所有端点
2. 编写测试用例（可选）
3. 性能测试

---

## 测试场景

### 用户注册和登录
```bash
# 注册用户
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "Password123",
    "full_name": "John Doe"
  }'

# 登录
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "Password123"
  }'
# 响应: {"access_token": "...", "token_type": "bearer"}
```

### Todo 操作
```bash
# 保存 token
TOKEN="your-token-here"

# 创建 Todo
curl -X POST "http://localhost:8000/api/v1/todos/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "学习 FastAPI",
    "description": "完成 Week 1 所有练习",
    "priority": "high",
    "category_id": 1,
    "tag_ids": [1, 2]
  }'

# 获取 Todo 列表
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/todos/?skip=0&limit=10"

# 搜索 Todo
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/todos/?q=FastAPI&is_completed=false"

# 标记完成
curl -X PATCH -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/todos/1/complete"

# 更新 Todo
curl -X PUT "http://localhost:8000/api/v1/todos/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "学习 FastAPI 进阶"}'

# 删除 Todo
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/todos/1"
```

---

## 扩展功能（可选）

### 1. 协作功能
- 分享 Todo
- 团队协作
- 权限管理

### 2. 提醒功能
- 到期提醒
- 定时任务

### 3. 统计图表
- 完成率趋势
- 分类分布
- 优先级分析

### 4. 导入导出
- 导出 CSV
- 导入数据

---

## 学习检查清单

### 知识整合
- [ ] 使用 Pydantic 模型进行数据验证
- [ ] 使用 APIRouter 组织路由
- [ ] 实现自定义异常处理
- [ ] 使用依赖注入实现认证
- [ ] 添加中间件（日志、CORS）
- [ ] 正确使用 HTTP 状态码

### 代码质量
- [ ] 代码结构清晰
- [ ] 函数职责单一
- [ ] 错误处理完善
- [ ] 日志记录详细

### 功能完整
- [ ] 用户注册和登录
- [ ] Todo CRUD 操作
- [ ] 搜索和过滤
- [ ] 分类和标签管理
- [ ] 统计功能

---

## 总结

通过完成这个项目，你将：
1. 巩固 Week 1 所有知识
2. 理解实际项目开发流程
3. 掌握 API 设计最佳实践
4. 具备独立开发能力

**下一步**: Week 2 - 数据库集成！
