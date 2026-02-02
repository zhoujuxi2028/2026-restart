# Day 5: 依赖注入系统

## 学习目标
- 理解依赖注入（Dependency Injection）的概念和优势
- 掌握 FastAPI 的依赖注入系统
- 学会创建和使用可复用的依赖项
- 理解类依赖和嵌套依赖
- 掌握依赖项的测试和覆盖

---

## 1. 什么是依赖注入？

### 1.1 核心概念

**依赖注入**是一种设计模式，它允许我们将函数或类所需的"依赖"从外部传入，而不是在内部创建。

**优势：**
- **代码复用**：相同的依赖可以在多个地方使用
- **关注分离**：每个函数只关注自己的逻辑
- **易于测试**：可以轻松替换依赖进行测试
- **减少重复**：避免在每个路由中重复相同的逻辑

### 1.2 FastAPI 中的依赖注入

```python
from fastapi import FastAPI, Depends

app = FastAPI()

# 定义一个依赖函数
def common_parameters(q: str = None, skip: int = 0, limit: int = 10):
    """通用查询参数"""
    return {"q": q, "skip": skip, "limit": limit}

# 使用依赖
@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    """FastAPI 会自动调用 common_parameters 并注入结果"""
    return commons

@app.get("/users/")
async def read_users(commons: dict = Depends(common_parameters)):
    """同一个依赖可以在多个路由中使用"""
    return commons
```

---

## 2. 基础依赖注入

### 2.1 简单依赖函数

```python
from fastapi import FastAPI, Depends, HTTPException
from typing import Optional

app = FastAPI()

# 依赖函数 1: 验证查询参数
def pagination_params(skip: int = 0, limit: int = 100):
    """分页参数验证"""
    if skip < 0:
        raise HTTPException(status_code=400, detail="skip must be >= 0")
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 100")
    return {"skip": skip, "limit": limit}

# 依赖函数 2: 搜索参数
def search_params(q: Optional[str] = None, category: Optional[str] = None):
    """搜索参数"""
    return {"q": q, "category": category}

# 使用依赖
@app.get("/items/")
async def list_items(
    pagination: dict = Depends(pagination_params),
    search: dict = Depends(search_params)
):
    """可以同时使用多个依赖"""
    return {
        "pagination": pagination,
        "search": search,
        "message": "Fetching items..."
    }
```

### 2.2 带数据库连接的依赖

```python
from typing import Generator

# 模拟数据库连接
class FakeDB:
    def __init__(self):
        self.connected = False

    def connect(self):
        self.connected = True
        print("Database connected")

    def disconnect(self):
        self.connected = False
        print("Database disconnected")

    def query(self, sql: str):
        if not self.connected:
            raise Exception("Database not connected")
        return f"Result of: {sql}"

# 依赖函数：获取数据库连接
def get_db() -> Generator:
    """
    数据库连接依赖
    使用 yield 确保连接会被正确关闭
    """
    db = FakeDB()
    db.connect()
    try:
        yield db
    finally:
        db.disconnect()

@app.get("/query/")
async def execute_query(db: FakeDB = Depends(get_db)):
    """使用数据库连接"""
    result = db.query("SELECT * FROM users")
    return {"result": result}
```

---

## 3. 类作为依赖

### 3.1 基础类依赖

```python
from fastapi import Depends

class Pagination:
    """分页类"""
    def __init__(self, skip: int = 0, limit: int = 10):
        self.skip = skip
        self.limit = limit

    def apply(self, items: list):
        """应用分页"""
        return items[self.skip : self.skip + self.limit]

@app.get("/items/")
async def get_items(pagination: Pagination = Depends()):
    """
    使用类作为依赖
    Depends() 会自动识别类并调用其 __init__ 方法
    """
    all_items = [f"item_{i}" for i in range(50)]
    paginated_items = pagination.apply(all_items)

    return {
        "skip": pagination.skip,
        "limit": pagination.limit,
        "items": paginated_items
    }
```

### 3.2 带验证的类依赖

```python
from fastapi import HTTPException

class SearchParams:
    """搜索参数类"""
    def __init__(
        self,
        q: str = None,
        min_price: float = 0,
        max_price: float = None,
        category: str = None
    ):
        # 参数验证
        if min_price < 0:
            raise HTTPException(status_code=400, detail="min_price must be >= 0")

        if max_price is not None and max_price < min_price:
            raise HTTPException(
                status_code=400,
                detail="max_price must be >= min_price"
            )

        self.q = q
        self.min_price = min_price
        self.max_price = max_price
        self.category = category

    def matches(self, item: dict) -> bool:
        """检查商品是否匹配搜索条件"""
        # 价格过滤
        if item["price"] < self.min_price:
            return False
        if self.max_price and item["price"] > self.max_price:
            return False

        # 分类过滤
        if self.category and item.get("category") != self.category:
            return False

        # 关键词搜索
        if self.q and self.q.lower() not in item["name"].lower():
            return False

        return True

@app.get("/products/search")
async def search_products(search: SearchParams = Depends()):
    """使用类依赖进行搜索"""
    all_products = [
        {"name": "Laptop", "price": 999.99, "category": "electronics"},
        {"name": "Mouse", "price": 29.99, "category": "electronics"},
        {"name": "Desk", "price": 199.99, "category": "furniture"},
    ]

    filtered_products = [p for p in all_products if search.matches(p)]

    return {
        "search_params": {
            "q": search.q,
            "min_price": search.min_price,
            "max_price": search.max_price,
            "category": search.category
        },
        "results": filtered_products,
        "count": len(filtered_products)
    }
```

---

## 4. 嵌套依赖

### 4.1 依赖链

```python
from fastapi import Header, HTTPException

# 第一层依赖：从请求头获取 token
def get_token(authorization: str = Header(...)):
    """从请求头提取 token"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return authorization.replace("Bearer ", "")

# 第二层依赖：验证 token 并获取用户
def get_current_user(token: str = Depends(get_token)):
    """根据 token 获取当前用户"""
    # 简化的验证逻辑
    if token != "valid-token-123":
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"username": "john", "email": "john@example.com"}

# 第三层依赖：验证用户是否为管理员
def get_admin_user(user: dict = Depends(get_current_user)):
    """验证管理员权限"""
    if user.get("username") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# 使用嵌套依赖
@app.get("/profile/")
async def get_profile(user: dict = Depends(get_current_user)):
    """普通用户可以访问"""
    return {"user": user}

@app.get("/admin/dashboard/")
async def admin_dashboard(admin: dict = Depends(get_admin_user)):
    """只有管理员可以访问"""
    return {"message": "Welcome to admin dashboard", "admin": admin}
```

### 4.2 复杂依赖组合

```python
class DatabaseSession:
    """数据库会话类"""
    def __init__(self):
        self.connected = True
        print("DB session created")

    def close(self):
        self.connected = False
        print("DB session closed")

def get_db_session() -> Generator:
    """数据库会话依赖"""
    session = DatabaseSession()
    try:
        yield session
    finally:
        session.close()

class UserService:
    """用户服务类（依赖数据库会话）"""
    def __init__(self, db: DatabaseSession = Depends(get_db_session)):
        self.db = db

    def get_user(self, user_id: int):
        """获取用户"""
        if not self.db.connected:
            raise Exception("Database not connected")
        return {"id": user_id, "name": f"User {user_id}"}

class PermissionChecker:
    """权限检查类（依赖用户服务和当前用户）"""
    def __init__(
        self,
        current_user: dict = Depends(get_current_user),
        user_service: UserService = Depends()
    ):
        self.current_user = current_user
        self.user_service = user_service

    def can_access_resource(self, resource_id: int) -> bool:
        """检查用户是否可以访问资源"""
        # 简化的权限逻辑
        return True

@app.get("/resource/{resource_id}")
async def get_resource(
    resource_id: int,
    permission: PermissionChecker = Depends()
):
    """使用多层依赖的路由"""
    if not permission.can_access_resource(resource_id):
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "resource_id": resource_id,
        "user": permission.current_user,
        "message": "Access granted"
    }
```

---

## 5. 路径和全局依赖

### 5.1 路由器级别的依赖

```python
from fastapi import APIRouter, Depends

# 认证依赖
def verify_api_key(api_key: str = Header(...)):
    """验证 API Key"""
    if api_key != "secret-api-key":
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

# 创建路由器，应用依赖到所有端点
protected_router = APIRouter(
    prefix="/protected",
    tags=["protected"],
    dependencies=[Depends(verify_api_key)]  # 所有路由都需要 API Key
)

@protected_router.get("/data")
async def get_protected_data():
    """这个路由自动需要 API Key"""
    return {"data": "This is protected data"}

@protected_router.get("/info")
async def get_protected_info():
    """这个路由也自动需要 API Key"""
    return {"info": "This is protected info"}

app.include_router(protected_router)
```

### 5.2 应用级别的全局依赖

```python
from fastapi import FastAPI, Request
import time

# 全局依赖：记录请求时间
async def log_request(request: Request):
    """记录请求信息"""
    start_time = time.time()
    print(f"Request started: {request.method} {request.url.path}")
    # 这个依赖不返回值，只是执行副作用
    return None

# 创建应用，应用全局依赖
app = FastAPI(
    dependencies=[Depends(log_request)]  # 所有端点都会执行
)

@app.get("/items/")
async def get_items():
    """自动记录请求"""
    return {"items": []}

@app.get("/users/")
async def get_users():
    """也会自动记录请求"""
    return {"users": []}
```

---

## 6. 子依赖（Sub-dependencies）

### 6.1 使用 yield 的依赖

```python
from typing import Generator

# 使用 yield 的依赖可以在请求前后执行代码
def get_db_with_transaction() -> Generator:
    """
    带事务的数据库连接
    yield 之前：设置阶段
    yield 之后：清理阶段
    """
    db = FakeDB()
    db.connect()
    db.begin_transaction()  # 开始事务

    try:
        yield db
        db.commit()  # 成功则提交
    except Exception as e:
        db.rollback()  # 失败则回滚
        raise
    finally:
        db.disconnect()  # 总是断开连接

class FakeDB:
    def __init__(self):
        self.connected = False
        self.in_transaction = False

    def connect(self):
        self.connected = True

    def disconnect(self):
        self.connected = False

    def begin_transaction(self):
        self.in_transaction = True
        print("Transaction started")

    def commit(self):
        print("Transaction committed")
        self.in_transaction = False

    def rollback(self):
        print("Transaction rolled back")
        self.in_transaction = False

@app.post("/users/")
async def create_user(username: str, db: FakeDB = Depends(get_db_with_transaction)):
    """使用带事务的数据库连接"""
    # 如果这里抛出异常，事务会自动回滚
    if username == "error":
        raise HTTPException(status_code=400, detail="Invalid username")

    return {"username": username, "created": True}
```

### 6.2 依赖缓存

```python
from fastapi import Depends
import time

# 默认情况下，同一请求中的依赖会被缓存
def expensive_operation():
    """模拟耗时操作"""
    print("Executing expensive operation...")
    time.sleep(1)  # 模拟耗时
    return {"data": "expensive result"}

@app.get("/test-cache/")
async def test_cache(
    result1: dict = Depends(expensive_operation),
    result2: dict = Depends(expensive_operation),
    result3: dict = Depends(expensive_operation)
):
    """
    expensive_operation 只会执行一次
    后续调用会使用缓存结果
    """
    return {
        "result1": result1,
        "result2": result2,
        "result3": result3,
        "same_results": result1 == result2 == result3
    }

# 禁用依赖缓存
def no_cache_operation():
    """每次都会执行"""
    print("Executing no cache operation...")
    return {"timestamp": time.time()}

@app.get("/test-no-cache/")
async def test_no_cache(
    result1: dict = Depends(no_cache_operation, use_cache=False),
    result2: dict = Depends(no_cache_operation, use_cache=False)
):
    """
    每次都会执行 no_cache_operation
    """
    return {
        "result1": result1,
        "result2": result2,
        "different_results": result1 != result2
    }
```

---

## 7. 实战示例：完整的认证系统

```python
from fastapi import FastAPI, Depends, HTTPException, status, Header
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import hashlib

app = FastAPI()

# ==================== 数据模型 ====================

class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: bool = False

class UserInDB(User):
    password_hash: str

# ==================== 模拟数据库 ====================

fake_users_db = {
    "john": UserInDB(
        username="john",
        email="john@example.com",
        full_name="John Doe",
        password_hash=hashlib.md5("secret123".encode()).hexdigest(),
        disabled=False
    ),
    "admin": UserInDB(
        username="admin",
        email="admin@example.com",
        full_name="Admin User",
        password_hash=hashlib.md5("admin123".encode()).hexdigest(),
        disabled=False
    )
}

fake_tokens_db = {}  # 存储活动的 token

# ==================== 工具函数 ====================

def verify_password(plain_password: str, password_hash: str) -> bool:
    """验证密码"""
    return hashlib.md5(plain_password.encode()).hexdigest() == password_hash

def create_access_token(username: str) -> str:
    """创建访问 token"""
    token = f"{username}_token_{datetime.now().timestamp()}"
    fake_tokens_db[token] = {
        "username": username,
        "expires": datetime.now() + timedelta(hours=1)
    }
    return token

# ==================== 依赖函数 ====================

def get_token_from_header(authorization: str = Header(...)) -> str:
    """从请求头提取 token"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication header",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return authorization.replace("Bearer ", "")

def get_current_user(token: str = Depends(get_token_from_header)) -> User:
    """根据 token 获取当前用户"""
    # 验证 token 是否存在
    if token not in fake_tokens_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # 检查 token 是否过期
    token_data = fake_tokens_db[token]
    if datetime.now() > token_data["expires"]:
        del fake_tokens_db[token]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # 获取用户
    username = token_data["username"]
    if username not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")

    user = fake_users_db[username]

    # 检查用户是否被禁用
    if user.disabled:
        raise HTTPException(status_code=403, detail="User is disabled")

    return User(**user.model_dump())

def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """验证管理员权限"""
    if current_user.username != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

# ==================== 路由 ====================

@app.post("/login")
async def login(username: str, password: str):
    """用户登录"""
    # 验证用户
    user = fake_users_db.get(username)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # 验证密码
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # 创建 token
    access_token = create_access_token(username)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/users/me", response_model=User)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """获取当前用户信息（需要认证）"""
    return current_user

@app.get("/users/me/items")
async def get_my_items(current_user: User = Depends(get_current_user)):
    """获取当前用户的商品（需要认证）"""
    return {
        "owner": current_user.username,
        "items": [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]
    }

@app.get("/admin/users")
async def list_all_users(admin: User = Depends(get_admin_user)):
    """获取所有用户（需要管理员权限）"""
    return {
        "admin": admin.username,
        "users": [
            {"username": u.username, "email": u.email}
            for u in fake_users_db.values()
        ]
    }

@app.delete("/admin/users/{username}")
async def delete_user(username: str, admin: User = Depends(get_admin_user)):
    """删除用户（需要管理员权限）"""
    if username not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")

    if username == admin.username:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    del fake_users_db[username]
    return {"message": f"User {username} deleted"}
```

---

## 8. 依赖注入测试

### 8.1 依赖覆盖（Dependency Override）

```python
from fastapi.testclient import TestClient

# 原始依赖
def get_current_user_original():
    """原始的用户获取函数"""
    raise HTTPException(status_code=401, detail="Not authenticated")

app = FastAPI()

@app.get("/protected/")
async def protected_route(user: dict = Depends(get_current_user_original)):
    return {"user": user}

# 测试时覆盖依赖
def get_current_user_override():
    """测试用的模拟用户"""
    return {"username": "test-user"}

# 创建测试客户端
client = TestClient(app)

# 覆盖依赖
app.dependency_overrides[get_current_user_original] = get_current_user_override

# 现在可以无需认证访问受保护的路由
def test_protected_route():
    response = client.get("/protected/")
    assert response.status_code == 200
    assert response.json() == {"user": {"username": "test-user"}}

# 清除覆盖
app.dependency_overrides.clear()
```

---

## 9. 重点总结

### 今天你学到了：

1. **依赖注入基础**
   - 什么是依赖注入及其优势
   - 使用 `Depends()` 注入依赖
   - 函数依赖和类依赖

2. **高级依赖**
   - 嵌套依赖和依赖链
   - 使用 `yield` 的依赖
   - 依赖缓存机制

3. **作用域依赖**
   - 路径操作依赖
   - 路由器级别依赖
   - 全局应用依赖

4. **实战应用**
   - 认证和授权系统
   - 数据库连接管理
   - 依赖测试和覆盖

### 最佳实践：

- 将可复用的逻辑提取为依赖
- 使用类依赖组织复杂逻辑
- 使用 `yield` 确保资源正确清理
- 利用依赖缓存提高性能
- 测试时使用依赖覆盖

### 关键要点：

- **复用性**：同一个依赖可以在多处使用
- **可测试性**：依赖可以轻松替换和模拟
- **清晰性**：依赖明确表达了函数需要什么
- **安全性**：依赖链可以层层验证权限

---

## 10. 下一步

Day 6 我们将学习中间件和 CORS 配置！
