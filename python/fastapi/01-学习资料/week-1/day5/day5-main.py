"""
Day 5: 依赖注入系统 - 完整演示
这个文件展示了学习文档中的所有核心示例
"""

from fastapi import FastAPI, Depends, HTTPException, Header, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Generator, Annotated
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import hashlib
import time
import secrets
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# 安全性配置
security = HTTPBearer()
SECRET_KEY = secrets.token_urlsafe(32)  # 生产环境中应该从环境变量读取

app = FastAPI(title="FastAPI Day 5 Demo - Dependency Injection", version="1.0.0")

print("\n" + "="*60)
print("Day 5: Dependency Injection System Demo")
print("="*60 + "\n")

# ==================== 示例 1: 基础依赖注入 ====================

print("示例 1: 基础依赖注入")

def common_parameters(q: Optional[str] = None, skip: int = 0, limit: int = 10):
    """通用查询参数依赖"""
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/demo1/items/")
async def demo1_items(commons: dict = Depends(common_parameters)):
    """使用依赖注入"""
    return {"message": "Items endpoint", "params": commons}

@app.get("/demo1/users/")
async def demo1_users(commons: dict = Depends(common_parameters)):
    """复用相同的依赖"""
    return {"message": "Users endpoint", "params": commons}

# ==================== 示例 2: 类作为依赖 ====================

print("示例 2: 类作为依赖")

class Pagination:
    """分页类依赖"""
    def __init__(self, skip: int = 0, limit: int = 10):
        self.skip = skip
        self.limit = limit
    
    def apply(self, items: list):
        """应用分页"""
        return items[self.skip:self.skip + self.limit]

@app.get("/demo2/items/")
async def demo2_items(pagination: Pagination = Depends()):
    """使用类依赖"""
    all_items = [f"item_{i}" for i in range(50)]
    paginated_items = pagination.apply(all_items)
    return {
        "skip": pagination.skip,
        "limit": pagination.limit,
        "items": paginated_items,
        "total": len(all_items)
    }

# ==================== 示例 3: 嵌套依赖 ====================

print("示例 3: 嵌套依赖链")

fake_token_db = {
    "valid-token": {"username": "john", "email": "john@example.com"}
}

def get_token(authorization: str = Header(...)) -> str:
    """第一层：提取 token"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid header")
    return authorization.replace("Bearer ", "")

def get_current_user(token: str = Depends(get_token)) -> dict:
    """第二层：验证 token"""
    if token not in fake_token_db:
        raise HTTPException(status_code=401, detail="Invalid token")
    return fake_token_db[token]

def get_admin_user(user: dict = Depends(get_current_user)) -> dict:
    """第三层：验证管理员"""
    if user.get("username") != "admin":
        # 为演示目的，让 john 也能访问
        pass
    return user

@app.get("/demo3/profile")
async def demo3_profile(user: dict = Depends(get_current_user)):
    """需要认证"""
    return {"message": "Your profile", "user": user}

@app.get("/demo3/admin")
async def demo3_admin(admin: dict = Depends(get_admin_user)):
    """需要管理员权限"""
    return {"message": "Admin area", "admin": admin}

# ==================== 示例 4: 使用 yield 的依赖 ====================

print("示例 4: 使用 yield 管理资源")

class FakeDB:
    """模拟数据库"""
    def __init__(self):
        self.connected = False
    
    def connect(self):
        self.connected = True
        print("  ✓ Database connected")
    
    def disconnect(self):
        self.connected = False
        print("  ✗ Database disconnected")
    
    def query(self, sql: str):
        if not self.connected:
            raise Exception("Not connected")
        return f"Result: {sql}"

def get_db() -> Generator:
    """数据库依赖（确保连接被关闭）"""
    db = FakeDB()
    db.connect()
    try:
        yield db
    finally:
        db.disconnect()

@app.get("/demo4/query/")
async def demo4_query(db: FakeDB = Depends(get_db)):
    """使用数据库（自动管理连接）"""
    result = db.query("SELECT * FROM users")
    return {"result": result}

# ==================== 示例 5: 完整认证系统 ====================

print("示例 5: 完整认证系统")

from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: bool = False

class UserInDB(User):
    password_hash: str

# 密码哈希函数
def hash_password(password: str) -> str:
    """哈希密码 - 生产环境应使用 bcrypt 或 argon2"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, password_hash: str) -> bool:
    """验证密码 - 生产环境应使用 bcrypt 或 argon2"""
    return hashlib.sha256(plain_password.encode()).hexdigest() == password_hash

# 模拟数据库
users_auth_db = {
    "john": UserInDB(
        username="john",
        email="john@example.com",
        full_name="John Doe",
        password_hash=hash_password("secret123"),  # 使用改进的哈希函数
        disabled=False
    )
}

tokens_db = {}

def create_access_token(username: str) -> str:
    """创建访问令牌"""
    token = secrets.token_urlsafe(32)  # 使用更安全的随机令牌
    tokens_db[token] = {
        "username": username,
        "expires": datetime.now() + timedelta(hours=1),
        "created_at": datetime.now()
    }
    logger.info(f"Created token for user: {username}")
    return token

def get_token_from_credentials(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """从 HTTP Bearer token 中提取令牌"""
    if credentials.scheme != "Bearer":
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication scheme",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return credentials.credentials

def get_current_user_demo5(token: str = Depends(get_token_from_credentials)) -> User:
    if token not in tokens_db:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    token_data = tokens_db[token]
    if datetime.now() > token_data["expires"]:
        del tokens_db[token]
        raise HTTPException(status_code=401, detail="Token expired")
    
    username = token_data["username"]
    if username not in users_auth_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_auth_db[username]
    if user.disabled:
        raise HTTPException(status_code=403, detail="User disabled")
    
    return User(**user.model_dump())

@app.post("/demo5/login")
async def demo5_login(username: str, password: str):
    """用户登录"""
    user = users_auth_db.get(username)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token(username)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/demo5/me", response_model=User)
async def demo5_me(current_user: User = Depends(get_current_user_demo5)):
    """获取当前用户信息"""
    return current_user

@app.get("/demo5/items")
async def demo5_my_items(current_user: User = Depends(get_current_user_demo5)):
    """获取我的物品"""
    return {
        "owner": current_user.username,
        "items": [
            {"id": 1, "name": "Item 1"},
            {"id": 2, "name": "Item 2"}
        ]
    }

# ==================== 示例 6: 依赖缓存 ====================

print("示例 6: 依赖缓存机制")

call_counter = {"count": 0}

def expensive_dependency():
    """模拟耗时操作"""
    call_counter["count"] += 1
    print(f"  Expensive operation called (count: {call_counter['count']})")
    time.sleep(0.1)
    return {"result": "expensive", "call_number": call_counter["count"]}

@app.get("/demo6/cached")
async def demo6_cached(
    dep1: dict = Depends(expensive_dependency),
    dep2: dict = Depends(expensive_dependency),
    dep3: dict = Depends(expensive_dependency)
):
    """缓存启用：只执行一次"""
    return {
        "message": "Dependency called 3 times but executed only once",
        "dep1": dep1,
        "dep2": dep2,
        "dep3": dep3,
        "all_same": dep1 == dep2 == dep3
    }

# ==================== 根路由 ====================

@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "FastAPI Day 5 Demo - Dependency Injection",
        "demos": {
            "1": "/demo1/* - Basic dependency injection",
            "2": "/demo2/* - Class as dependency",
            "3": "/demo3/* - Nested dependencies",
            "4": "/demo4/* - Dependencies with yield",
            "5": "/demo5/* - Complete auth system",
            "6": "/demo6/* - Dependency caching"
        },
        "test_instructions": {
            "demo1": "curl http://localhost:8000/demo1/items/?q=test&skip=0&limit=5",
            "demo2": "curl http://localhost:8000/demo2/items/?skip=10&limit=5",
            "demo3": "curl -H 'Authorization: Bearer valid-token' http://localhost:8000/demo3/profile",
            "demo4": "curl http://localhost:8000/demo4/query/",
            "demo5_login": "curl -X POST 'http://localhost:8000/demo5/login?username=john&password=secret123'",
            "demo5_me": "curl -H 'Authorization: Bearer <token>' http://localhost:8000/demo5/me",
            "demo6": "curl http://localhost:8000/demo6/cached"
        },
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "stats": {
            "users": len(users_auth_db),
            "active_tokens": len(tokens_db),
            "dependency_calls": call_counter["count"]
        }
    }

# ==================== 运行说明 ====================
"""
运行方式：
uvicorn day5-main:app --reload

测试命令：

1. 基础依赖：
curl "http://localhost:8000/demo1/items/?q=phone&skip=0&limit=10"

2. 类依赖：
curl "http://localhost:8000/demo2/items/?skip=20&limit=5"

3. 嵌套依赖：
curl -H "Authorization: Bearer valid-token" http://localhost:8000/demo3/profile

4. yield 依赖（观察控制台输出）：
curl http://localhost:8000/demo4/query/

5. 完整认证：
# 登录获取 token
TOKEN=$(curl -X POST "http://localhost:8000/demo5/login?username=john&password=secret123" | jq -r .access_token)
# 使用 token 访问
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/demo5/me

6. 缓存测试（观察控制台输出）：
curl http://localhost:8000/demo6/cached

访问文档：http://localhost:8000/docs
"""

"""
运行方式1 (学习推荐):
    python3 依赖注入/day5-main.py

运行方式2 (开发推荐):
    uvicorn 依赖注入.day5-main:app --reload --port 8000
"""
if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("Starting FastAPI Day 5 Demo Server")
    print("="*60)
    print("Documentation: http://localhost:8000/docs")
    print("💡 提示: 如需热重载，使用 uvicorn 命令")
    print("="*60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
