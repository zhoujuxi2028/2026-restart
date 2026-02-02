# Day 4: 路由组织与错误处理

## 学习目标
- 掌握 APIRouter 的使用，实现模块化路由管理
- 学会路由分组和组织最佳实践
- 理解 HTTP 状态码的正确使用
- 掌握 HTTPException 和自定义异常处理
- 学会设计合理的响应模型

---

## 1. APIRouter 路由器

### 1.1 为什么需要 APIRouter？

在实际项目中，将所有路由都写在一个文件中会导致：
- 代码难以维护
- 团队协作困难
- 逻辑混乱

APIRouter 可以帮助我们：
- 模块化路由管理
- 按功能分离代码
- 复用路由配置
- 更好的代码组织

### 1.2 基础使用

```python
from fastapi import APIRouter, FastAPI

# 创建路由器
router = APIRouter()

@router.get("/items/")
async def get_items():
    return {"message": "Get all items"}

@router.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}

# 在主应用中注册路由器
app = FastAPI()
app.include_router(router)
```

### 1.3 路由器前缀和标签

```python
from fastapi import APIRouter

# 创建带前缀和标签的路由器
user_router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)

@user_router.get("/")
async def list_users():
    """列出所有用户 - URL: /users/"""
    return [{"username": "john"}, {"username": "jane"}]

@user_router.get("/{user_id}")
async def get_user(user_id: int):
    """获取单个用户 - URL: /users/{user_id}"""
    return {"user_id": user_id, "username": "john"}

@user_router.post("/")
async def create_user(username: str):
    """创建用户 - URL: /users/"""
    return {"username": username, "created": True}
```

### 1.4 多个路由器组织

```python
from fastapi import FastAPI, APIRouter

# users.py - 用户路由
users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.get("/")
async def list_users():
    return {"users": []}

@users_router.post("/")
async def create_user():
    return {"created": True}


# products.py - 商品路由
products_router = APIRouter(prefix="/products", tags=["products"])

@products_router.get("/")
async def list_products():
    return {"products": []}

@products_router.get("/{product_id}")
async def get_product(product_id: int):
    return {"product_id": product_id}


# orders.py - 订单路由
orders_router = APIRouter(prefix="/orders", tags=["orders"])

@orders_router.get("/")
async def list_orders():
    return {"orders": []}

@orders_router.post("/")
async def create_order():
    return {"order_created": True}


# main.py - 主应用
app = FastAPI(title="E-Commerce API", version="1.0.0")

# 注册所有路由器
app.include_router(users_router)
app.include_router(products_router)
app.include_router(orders_router)
```

### 1.5 嵌套路由器

```python
from fastapi import APIRouter

# API v1 路由器
api_v1_router = APIRouter(prefix="/api/v1")

# 用户子路由
users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.get("/")
async def list_users():
    return {"users": []}

# 商品子路由
products_router = APIRouter(prefix="/products", tags=["products"])

@products_router.get("/")
async def list_products():
    return {"products": []}

# 将子路由注册到 v1 路由器
api_v1_router.include_router(users_router)
api_v1_router.include_router(products_router)

# 注册到主应用
app = FastAPI()
app.include_router(api_v1_router)

# 结果：
# /api/v1/users/
# /api/v1/products/
```

---

## 2. HTTP 状态码

### 2.1 常用状态码

```python
from fastapi import FastAPI, status

app = FastAPI()

# 2xx - 成功
@app.get("/items/", status_code=status.HTTP_200_OK)  # 200 - 成功
async def get_items():
    return {"items": []}

@app.post("/items/", status_code=status.HTTP_201_CREATED)  # 201 - 已创建
async def create_item():
    return {"id": 1, "created": True}

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)  # 204 - 无内容
async def delete_item(item_id: int):
    return None  # 204 不返回内容

# 4xx - 客户端错误
# 400 - 错误请求
# 401 - 未授权
# 403 - 禁止访问
# 404 - 未找到
# 422 - 验证错误（FastAPI 自动处理）

# 5xx - 服务器错误
# 500 - 内部服务器错误
# 503 - 服务不可用
```

### 2.2 状态码使用指南

```python
from fastapi import status

# GET 请求
@app.get("/items/{item_id}", status_code=status.HTTP_200_OK)
async def get_item(item_id: int):
    """获取资源 - 200 OK"""
    return {"item_id": item_id}

# POST 请求 - 创建资源
@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(name: str):
    """创建资源 - 201 Created"""
    return {"id": 1, "name": name}

# PUT 请求 - 完全替换
@app.put("/items/{item_id}", status_code=status.HTTP_200_OK)
async def update_item(item_id: int, name: str):
    """更新资源 - 200 OK"""
    return {"item_id": item_id, "name": name}

# PATCH 请求 - 部分更新
@app.patch("/items/{item_id}", status_code=status.HTTP_200_OK)
async def partial_update_item(item_id: int, name: str = None):
    """部分更新 - 200 OK"""
    return {"item_id": item_id, "updated": True}

# DELETE 请求
@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    """删除资源 - 204 No Content"""
    return None
```

---

## 3. HTTPException 异常处理

### 3.1 基础用法

```python
from fastapi import FastAPI, HTTPException, status

app = FastAPI()

# 模拟数据库
items_db = {
    1: {"name": "Laptop", "price": 999.99},
    2: {"name": "Mouse", "price": 29.99}
}

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    """获取商品 - 抛出 404 错误"""
    if item_id not in items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found"
        )
    return items_db[item_id]

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    """删除商品 - 抛出多种错误"""
    if item_id not in items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )

    # 模拟业务逻辑错误
    if items_db[item_id]["price"] > 500:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete expensive items",
            headers={"X-Error": "Expensive-Item"}
        )

    del items_db[item_id]
    return {"deleted": True}
```

### 3.2 带详细信息的异常

```python
from fastapi import HTTPException

@app.post("/users/")
async def create_user(username: str, email: str):
    """创建用户 - 详细错误信息"""

    # 检查用户名
    if len(username) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "validation_error",
                "message": "Username too short",
                "field": "username",
                "min_length": 3
            }
        )

    # 检查邮箱
    if "@" not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "validation_error",
                "message": "Invalid email format",
                "field": "email"
            }
        )

    return {"username": username, "email": email}
```

### 3.3 常见异常场景

```python
from fastapi import HTTPException, status

# 1. 资源未找到 (404)
def get_user_or_404(user_id: int):
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    return user

# 2. 未授权访问 (401)
def verify_token(token: str):
    if not token or token != "secret-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

# 3. 权限不足 (403)
def check_admin_permission(user: dict):
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permission required"
        )

# 4. 冲突错误 (409)
def check_username_unique(username: str):
    if username in existing_usernames:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Username '{username}' already exists"
        )

# 5. 业务逻辑错误 (400)
def validate_age(age: int):
    if age < 18:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must be 18 or older"
        )
```

---

## 4. 自定义异常处理器

### 4.1 自定义异常类

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

# 定义自定义异常
class UserNotFoundError(Exception):
    def __init__(self, user_id: int):
        self.user_id = user_id

class InsufficientBalanceError(Exception):
    def __init__(self, balance: float, required: float):
        self.balance = balance
        self.required = required

class InvalidCredentialsError(Exception):
    pass

app = FastAPI()

# 注册异常处理器
@app.exception_handler(UserNotFoundError)
async def user_not_found_handler(request: Request, exc: UserNotFoundError):
    return JSONResponse(
        status_code=404,
        content={
            "error": "user_not_found",
            "message": f"User {exc.user_id} not found",
            "user_id": exc.user_id
        }
    )

@app.exception_handler(InsufficientBalanceError)
async def insufficient_balance_handler(request: Request, exc: InsufficientBalanceError):
    return JSONResponse(
        status_code=400,
        content={
            "error": "insufficient_balance",
            "message": "Not enough balance",
            "current_balance": exc.balance,
            "required_amount": exc.required
        }
    )

@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(
        status_code=401,
        content={
            "error": "invalid_credentials",
            "message": "Invalid username or password"
        }
    )

# 使用自定义异常
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    if user_id not in users_db:
        raise UserNotFoundError(user_id)
    return users_db[user_id]

@app.post("/purchase/")
async def purchase_item(user_id: int, amount: float):
    user = users_db.get(user_id)
    if not user:
        raise UserNotFoundError(user_id)

    if user["balance"] < amount:
        raise InsufficientBalanceError(user["balance"], amount)

    user["balance"] -= amount
    return {"success": True, "new_balance": user["balance"]}
```

### 4.2 全局异常处理

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

# 处理 HTTP 异常
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP error: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "http_error",
            "message": exc.detail,
            "path": str(request.url)
        }
    )

# 处理验证错误
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })

    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "message": "Request validation failed",
            "details": errors
        }
    )

# 处理未捕获的异常
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred"
        }
    )
```

---

## 5. 响应模型进阶

### 5.1 多种响应模型

```python
from fastapi import FastAPI, status
from pydantic import BaseModel
from typing import Union

app = FastAPI()

class SuccessResponse(BaseModel):
    success: bool
    data: dict

class ErrorResponse(BaseModel):
    success: bool
    error: str
    message: str

# 使用 Union 定义多种响应
@app.get("/items/{item_id}",
         response_model=Union[SuccessResponse, ErrorResponse])
async def get_item(item_id: int):
    if item_id in items_db:
        return SuccessResponse(
            success=True,
            data=items_db[item_id]
        )
    else:
        return ErrorResponse(
            success=False,
            error="not_found",
            message=f"Item {item_id} not found"
        )
```

### 5.2 响应模型配置

```python
from pydantic import BaseModel, Field

class UserInDB(BaseModel):
    """数据库中的用户模型"""
    id: int
    username: str
    email: str
    password: str  # 包含密码
    is_active: bool
    is_admin: bool

class UserResponse(BaseModel):
    """API 响应模型（不包含密码）"""
    id: int
    username: str
    email: str
    is_active: bool

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """自动过滤掉密码字段"""
    user = UserInDB(
        id=user_id,
        username="john",
        email="john@example.com",
        password="secret",  # 不会出现在响应中
        is_active=True,
        is_admin=True  # 也不会出现在响应中
    )
    return user
```

### 5.3 响应模型选项

```python
from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

# 排除未设置的字段
@app.post("/items/", response_model=Item, response_model_exclude_unset=True)
async def create_item(item: Item):
    """只返回客户端提供的字段"""
    return item

# 排除 None 值
@app.get("/items/{item_id}", response_model=Item, response_model_exclude_none=True)
async def get_item(item_id: int):
    """不返回值为 None 的字段"""
    return Item(name="Laptop", price=999.99, description=None, tax=None)

# 排除默认值
@app.get("/items/default", response_model=Item, response_model_exclude_defaults=True)
async def get_default_item():
    """不返回默认值字段"""
    return Item(name="Default Item", price=0.0)
```

---

## 6. 实战示例：完整的用户管理 API

```python
from fastapi import FastAPI, APIRouter, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="User Management API")

# ==================== 数据模型 ====================

class UserBase(BaseModel):
    """用户基础模型"""
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    full_name: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    """用户创建模型"""
    password: str = Field(..., min_length=8)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v

class UserUpdate(BaseModel):
    """用户更新模型（所有字段可选）"""
    email: Optional[str] = Field(None, regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    full_name: Optional[str] = Field(None, max_length=100)

class UserResponse(UserBase):
    """用户响应模型"""
    id: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class UserInDB(UserResponse):
    """数据库用户模型（包含密码）"""
    password: str

# ==================== 自定义异常 ====================

class UserNotFoundError(Exception):
    def __init__(self, user_id: int):
        self.user_id = user_id

class UsernameExistsError(Exception):
    def __init__(self, username: str):
        self.username = username

class EmailExistsError(Exception):
    def __init__(self, email: str):
        self.email = email

# ==================== 异常处理器 ====================

@app.exception_handler(UserNotFoundError)
async def user_not_found_handler(request, exc: UserNotFoundError):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=404,
        content={
            "error": "user_not_found",
            "message": f"User {exc.user_id} not found"
        }
    )

@app.exception_handler(UsernameExistsError)
async def username_exists_handler(request, exc: UsernameExistsError):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=409,
        content={
            "error": "username_exists",
            "message": f"Username '{exc.username}' already exists"
        }
    )

@app.exception_handler(EmailExistsError)
async def email_exists_handler(request, exc: EmailExistsError):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=409,
        content={
            "error": "email_exists",
            "message": f"Email '{exc.email}' already exists"
        }
    )

# ==================== 模拟数据库 ====================

users_db: dict[int, UserInDB] = {}
user_id_counter = 1

# ==================== 路由器 ====================

users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """创建新用户"""
    global user_id_counter

    # 检查用户名是否存在
    if any(u.username == user.username for u in users_db.values()):
        raise UsernameExistsError(user.username)

    # 检查邮箱是否存在
    if any(u.email == user.email for u in users_db.values()):
        raise EmailExistsError(user.email)

    # 创建用户
    user_in_db = UserInDB(
        id=user_id_counter,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        password=user.password,  # 实际应该加密
        is_active=True,
        created_at=datetime.now()
    )

    users_db[user_id_counter] = user_in_db
    user_id_counter += 1

    return user_in_db

@users_router.get("/", response_model=List[UserResponse])
async def list_users(skip: int = 0, limit: int = 10):
    """获取用户列表"""
    users_list = list(users_db.values())
    return users_list[skip:skip + limit]

@users_router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """获取指定用户"""
    if user_id not in users_db:
        raise UserNotFoundError(user_id)
    return users_db[user_id]

@users_router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_update: UserUpdate):
    """更新用户信息"""
    if user_id not in users_db:
        raise UserNotFoundError(user_id)

    user = users_db[user_id]
    update_data = user_update.model_dump(exclude_unset=True)

    # 检查邮箱是否被其他用户使用
    if "email" in update_data:
        if any(u.email == update_data["email"] and u.id != user_id
               for u in users_db.values()):
            raise EmailExistsError(update_data["email"])

    # 更新用户
    for field, value in update_data.items():
        setattr(user, field, value)

    return user

@users_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int):
    """删除用户"""
    if user_id not in users_db:
        raise UserNotFoundError(user_id)

    del users_db[user_id]
    return None

# ==================== 注册路由 ====================

app.include_router(users_router)

# ==================== 根路由 ====================

@app.get("/")
async def root():
    return {
        "message": "User Management API",
        "version": "1.0.0",
        "endpoints": {
            "users": "/users",
            "docs": "/docs"
        }
    }
```

---

## 7. 项目结构最佳实践

```
my_api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # 主应用入口
│   ├── config.py               # 配置文件
│   │
│   ├── api/                    # API 路由
│   │   ├── __init__.py
│   │   ├── v1/                 # API 版本 1
│   │   │   ├── __init__.py
│   │   │   ├── users.py        # 用户路由
│   │   │   ├── products.py     # 商品路由
│   │   │   └── orders.py       # 订单路由
│   │   └── deps.py             # 共享依赖
│   │
│   ├── models/                 # Pydantic 模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   │
│   ├── exceptions/             # 自定义异常
│   │   ├── __init__.py
│   │   └── custom.py
│   │
│   └── utils/                  # 工具函数
│       ├── __init__.py
│       └── helpers.py
│
├── tests/                      # 测试
│   ├── __init__.py
│   └── test_users.py
│
└── requirements.txt
```

---

## 8. 重点总结

### 今天你学到了：

1. **APIRouter 使用**
   - 模块化路由管理
   - 路由前缀和标签
   - 路由器嵌套

2. **HTTP 状态码**
   - 2xx 成功响应
   - 4xx 客户端错误
   - 5xx 服务器错误

3. **异常处理**
   - HTTPException 使用
   - 自定义异常类
   - 全局异常处理器

4. **响应模型**
   - 不同场景的响应模型
   - 响应字段过滤
   - 响应模型配置

### 最佳实践：

- 使用 APIRouter 组织路由，按功能模块分离
- 选择正确的 HTTP 状态码
- 使用自定义异常处理业务逻辑错误
- 响应模型中排除敏感信息
- 提供详细的错误信息帮助调试
- 保持项目结构清晰

### 关键要点：

- **路由组织**：大型项目必须模块化
- **状态码语义**：让 API 更易理解
- **异常处理**：区分业务异常和系统异常
- **响应一致性**：统一的响应格式

---

## 9. 下一步

Day 5 我们将学习依赖注入系统，这是 FastAPI 最强大的特性之一！
