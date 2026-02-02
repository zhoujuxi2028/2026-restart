"""
Day 5: 依赖注入系统 - 参考答案
完整实现所有练习
"""

from fastapi import FastAPI, Depends, HTTPException, Header, Query, APIRouter, status
from typing import Optional, Generator
from enum import Enum
import time

app = FastAPI(title="Day 5 Solutions API", version="1.0.0")

# ==================== 练习 1: 查询参数依赖 (基础) ====================

class PaginationParams:
    """分页参数依赖"""
    def __init__(self, skip: int = 0, limit: int = 10):
        if skip < 0:
            raise HTTPException(status_code=400, detail="skip must be >= 0")
        if limit < 1 or limit > 100:
            raise HTTPException(status_code=400, detail="limit must be between 1 and 100")
        self.skip = skip
        self.limit = limit


class SortParams:
    """排序参数依赖"""
    def __init__(self, sort_by: str = "id", order: str = "asc"):
        if order not in ["asc", "desc"]:
            raise HTTPException(status_code=400, detail="order must be 'asc' or 'desc'")
        self.sort_by = sort_by
        self.order = order


# 模拟数据
users_data = [{"id": i, "name": f"User{i}", "email": f"user{i}@example.com"} for i in range(1, 51)]
products_data = [{"id": i, "name": f"Product{i}", "price": i * 10.0} for i in range(1, 51)]


@app.get("/users/")
async def list_users(
    pagination: PaginationParams = Depends(),
    sort: SortParams = Depends()
):
    """用户列表（带分页和排序）"""
    # 排序
    sorted_users = sorted(
        users_data,
        key=lambda x: x.get(sort.sort_by, x["id"]),
        reverse=(sort.order == "desc")
    )
    
    # 分页
    paginated = sorted_users[pagination.skip:pagination.skip + pagination.limit]
    
    return {
        "pagination": {"skip": pagination.skip, "limit": pagination.limit},
        "sort": {"sort_by": sort.sort_by, "order": sort.order},
        "total": len(users_data),
        "users": paginated
    }


@app.get("/products/")
async def list_products(
    pagination: PaginationParams = Depends(),
    sort: SortParams = Depends()
):
    """商品列表（使用相同依赖）"""
    sorted_products = sorted(
        products_data,
        key=lambda x: x.get(sort.sort_by, x["id"]),
        reverse=(sort.order == "desc")
    )
    
    paginated = sorted_products[pagination.skip:pagination.skip + pagination.limit]
    
    return {
        "pagination": {"skip": pagination.skip, "limit": pagination.limit},
        "sort": {"sort_by": sort.sort_by, "order": sort.order},
        "total": len(products_data),
        "products": paginated
    }


# ==================== 练习 2: 认证依赖链 (中等) ====================

fake_users = {
    "token123": {"username": "john", "email": "john@example.com", "active": True},
    "token456": {"username": "jane", "email": "jane@example.com", "active": False}
}


def get_token_header(authorization: str = Header(...)) -> str:
    """第一层：提取 Token"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Use 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"}
        )
    token = authorization.replace("Bearer ", "")
    return token


def get_current_user(token: str = Depends(get_token_header)) -> dict:
    """第二层：验证 Token 并获取用户"""
    if token not in fake_users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return fake_users[token]


def get_active_user(user: dict = Depends(get_current_user)) -> dict:
    """第三层：验证用户状态"""
    if not user.get("active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is not active"
        )
    return user


@app.get("/profile")
async def get_profile(current_user: dict = Depends(get_active_user)):
    """获取用户资料（需要激活用户）"""
    return {
        "profile": current_user,
        "message": "Welcome to your profile"
    }


@app.get("/settings")
async def get_settings(current_user: dict = Depends(get_active_user)):
    """获取用户设置（需要激活用户）"""
    return {
        "user": current_user["username"],
        "settings": {
            "theme": "dark",
            "language": "en",
            "notifications": True
        }
    }


# ==================== 练习 3: 数据库会话依赖 (中等) ====================

class Database:
    """模拟数据库类"""
    def __init__(self):
        self.connected = False

    def connect(self):
        self.connected = True
        print("✓ Database connected")

    def disconnect(self):
        self.connected = False
        print("✗ Database disconnected")

    def execute(self, query: str):
        if not self.connected:
            raise Exception("Database not connected")
        print(f"  Executing: {query}")
        return f"Result of: {query}"


def get_db() -> Generator:
    """数据库会话依赖（使用 yield）"""
    db = Database()
    db.connect()
    try:
        yield db
    finally:
        db.disconnect()


db_users = {
    1: {"id": 1, "name": "Alice", "email": "alice@example.com"},
    2: {"id": 2, "name": "Bob", "email": "bob@example.com"}
}


@app.get("/db-users/{user_id}")
async def get_db_user(user_id: int, db: Database = Depends(get_db)):
    """查询用户（使用数据库）"""
    result = db.execute(f"SELECT * FROM users WHERE id = {user_id}")
    
    if user_id not in db_users:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"query": result, "user": db_users[user_id]}


@app.post("/db-users/")
async def create_db_user(name: str, email: str, db: Database = Depends(get_db)):
    """创建用户（使用数据库）"""
    new_id = max(db_users.keys()) + 1 if db_users else 1
    result = db.execute(f"INSERT INTO users (name, email) VALUES ('{name}', '{email}')")
    
    new_user = {"id": new_id, "name": name, "email": email}
    db_users[new_id] = new_user
    
    return {"query": result, "user": new_user}


@app.delete("/db-users/{user_id}")
async def delete_db_user(user_id: int, db: Database = Depends(get_db)):
    """删除用户（使用数据库）"""
    if user_id not in db_users:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = db.execute(f"DELETE FROM users WHERE id = {user_id}")
    del db_users[user_id]
    
    return {"query": result, "message": f"User {user_id} deleted"}


# ==================== 练习 4: 权限系统 (困难) ====================

class Role(str, Enum):
    """用户角色"""
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


PERMISSIONS = {
    Role.ADMIN: ["read", "write", "delete"],
    Role.EDITOR: ["read", "write"],
    Role.VIEWER: ["read"]
}


rbac_users_db = {
    "alice": {"username": "alice", "email": "alice@example.com", "role": Role.ADMIN},
    "bob": {"username": "bob", "email": "bob@example.com", "role": Role.EDITOR},
    "charlie": {"username": "charlie", "email": "charlie@example.com", "role": Role.VIEWER}
}


def get_current_user_by_header(username: str = Header(..., alias="X-User")) -> dict:
    """从请求头获取当前用户"""
    if username not in rbac_users_db:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found")
    return rbac_users_db[username]


class PermissionChecker:
    """权限检查类"""
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    def __call__(self, current_user: dict = Depends(get_current_user_by_header)) -> dict:
        """检查用户是否有所需权限"""
        user_role = current_user.get("role")
        user_permissions = PERMISSIONS.get(user_role, [])
        
        if self.required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{self.required_permission}' required. Your role: {user_role}"
            )
        
        return current_user


articles_db = {
    1: {"id": 1, "title": "First Article", "content": "Content 1"},
    2: {"id": 2, "title": "Second Article", "content": "Content 2"}
}


@app.get("/articles/", dependencies=[Depends(PermissionChecker("read"))])
async def list_articles(current_user: dict = Depends(get_current_user_by_header)):
    """列出文章（需要 read 权限）"""
    return {
        "user": current_user["username"],
        "role": current_user["role"],
        "articles": list(articles_db.values())
    }


@app.post("/articles/", dependencies=[Depends(PermissionChecker("write"))])
async def create_article(
    title: str,
    content: str,
    current_user: dict = Depends(get_current_user_by_header)
):
    """创建文章（需要 write 权限）"""
    new_id = max(articles_db.keys()) + 1 if articles_db else 1
    new_article = {"id": new_id, "title": title, "content": content}
    articles_db[new_id] = new_article
    
    return {
        "message": "Article created",
        "created_by": current_user["username"],
        "article": new_article
    }


@app.delete("/articles/{article_id}", dependencies=[Depends(PermissionChecker("delete"))])
async def delete_article(
    article_id: int,
    current_user: dict = Depends(get_current_user_by_header)
):
    """删除文章（需要 delete 权限 - 只有 ADMIN）"""
    if article_id not in articles_db:
        raise HTTPException(status_code=404, detail="Article not found")
    
    del articles_db[article_id]
    
    return {
        "message": f"Article {article_id} deleted",
        "deleted_by": current_user["username"]
    }


# ==================== 练习 5: 多数据源依赖 (困难) ====================

class DataSource:
    """数据源接口"""
    def query(self, sql: str) -> str:
        raise NotImplementedError


class MySQLDataSource(DataSource):
    """MySQL 数据源"""
    def query(self, sql: str) -> str:
        return f"[MySQL] {sql}"


class PostgresDataSource(DataSource):
    """Postgres 数据源"""
    def query(self, sql: str) -> str:
        return f"[Postgres] {sql}"


class MongoDataSource(DataSource):
    """MongoDB 数据源"""
    def query(self, sql: str) -> str:
        return f"[MongoDB] {sql}"


def get_data_source(source_type: str = Query("mysql")) -> DataSource:
    """数据源工厂依赖"""
    sources = {
        "mysql": MySQLDataSource,
        "postgres": PostgresDataSource,
        "mongodb": MongoDataSource
    }
    
    if source_type not in sources:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid data source. Available: {list(sources.keys())}"
        )
    
    return sources[source_type]()


class UserServiceMultiDB:
    """用户服务（支持多数据源）"""
    def __init__(self, db: DataSource = Depends(get_data_source)):
        self.db = db

    def find_user(self, user_id: int):
        query_result = self.db.query(f"SELECT * FROM users WHERE id = {user_id}")
        # 模拟返回结果
        return {
            "query": query_result,
            "user": {"id": user_id, "name": f"User {user_id}"}
        }

    def find_all_users(self):
        query_result = self.db.query("SELECT * FROM users")
        return {
            "query": query_result,
            "users": [{"id": i, "name": f"User {i}"} for i in range(1, 4)]
        }


@app.get("/query/users/{user_id}")
async def query_user(user_id: int, service: UserServiceMultiDB = Depends()):
    """查询用户（可指定数据源）"""
    return service.find_user(user_id)


@app.get("/query/users/")
async def query_all_users(service: UserServiceMultiDB = Depends()):
    """查询所有用户（可指定数据源）"""
    return service.find_all_users()


# ==================== 练习 6: 依赖缓存控制 (挑战) ====================

call_count = {"cached": 0, "uncached": 0}


def get_timestamp_cached():
    """带缓存的时间戳依赖"""
    call_count["cached"] += 1
    print(f"[CACHED] get_timestamp called (count: {call_count['cached']})")
    return {"timestamp": time.time(), "call_count": call_count["cached"]}


def get_timestamp_uncached():
    """不带缓存的时间戳依赖"""
    call_count["uncached"] += 1
    print(f"[UNCACHED] get_timestamp called (count: {call_count['uncached']})")
    return {"timestamp": time.time(), "call_count": call_count["uncached"]}


@app.get("/test-cache")
async def test_cache(
    ts1: dict = Depends(get_timestamp_cached),
    ts2: dict = Depends(get_timestamp_cached),
    ts3: dict = Depends(get_timestamp_cached)
):
    """
    测试缓存行为
    get_timestamp_cached 只会被调用一次，结果被缓存
    """
    return {
        "explanation": "Same dependency called 3 times, but executed only once (cached)",
        "ts1": ts1,
        "ts2": ts2,
        "ts3": ts3,
        "all_same": ts1 == ts2 == ts3
    }


@app.get("/test-no-cache")
async def test_no_cache(
    ts1: dict = Depends(get_timestamp_uncached, use_cache=False),
    ts2: dict = Depends(get_timestamp_uncached, use_cache=False),
    ts3: dict = Depends(get_timestamp_uncached, use_cache=False)
):
    """
    测试无缓存行为
    get_timestamp_uncached 每次都会被调用
    """
    return {
        "explanation": "Same dependency called 3 times with use_cache=False, executed 3 times",
        "ts1": ts1,
        "ts2": ts2,
        "ts3": ts3,
        "all_different": len(set([ts1["timestamp"], ts2["timestamp"], ts3["timestamp"]])) == 3
    }


@app.get("/cache-stats")
async def cache_stats():
    """查看调用统计"""
    return {
        "cached_calls": call_count["cached"],
        "uncached_calls": call_count["uncached"]
    }


# ==================== 练习 7: 路由器级别依赖 (挑战) ====================

def require_admin(username: str = Header(..., alias="X-User")):
    """管理员认证依赖"""
    if username != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return username


# 创建管理路由器，应用依赖到所有路由
admin_router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin)]  # 所有路由都需要管理员权限
)


@admin_router.get("/users")
async def admin_list_users():
    """列出所有用户（自动需要管理员权限）"""
    return {
        "message": "Admin: List all users",
        "users": list(rbac_users_db.values())
    }


@admin_router.get("/stats")
async def admin_stats():
    """查看统计信息（自动需要管理员权限）"""
    return {
        "message": "Admin: System statistics",
        "stats": {
            "total_users": len(rbac_users_db),
            "total_articles": len(articles_db),
            "cache_calls": call_count
        }
    }


@admin_router.post("/broadcast")
async def admin_broadcast(message: str):
    """发送广播消息（自动需要管理员权限）"""
    return {
        "message": "Admin: Broadcast message sent",
        "broadcast": message,
        "sent_to": len(rbac_users_db)
    }


@admin_router.delete("/users/{username}")
async def admin_delete_user(username: str):
    """删除用户（自动需要管理员权限）"""
    if username not in rbac_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    if username == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin user")
    
    del rbac_users_db[username]
    return {"message": f"User {username} deleted"}


# 注册管理路由器
app.include_router(admin_router)


# ==================== 根路由和健康检查 ====================

@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "Day 5 Solutions API - Dependency Injection",
        "version": "1.0.0",
        "exercises": {
            "1": "GET /users, /products (pagination & sort)",
            "2": "GET /profile, /settings (auth chain)",
            "3": "GET/POST/DELETE /db-users (database with yield)",
            "4": "GET/POST/DELETE /articles (RBAC permissions)",
            "5": "GET /query/users?source_type=mysql (multi-datasource)",
            "6": "GET /test-cache, /test-no-cache (dependency caching)",
            "7": "GET /admin/* (router-level dependencies)"
        },
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "stats": {
            "users": len(rbac_users_db),
            "articles": len(articles_db),
            "db_users": len(db_users)
        }
    }


# ==================== 运行说明 ====================
"""
运行方式：
uvicorn day5-solutions:app --reload

测试命令：

练习 1: 分页和排序
curl "http://localhost:8000/users/?skip=0&limit=5&sort_by=name&order=asc"
curl "http://localhost:8000/products/?skip=10&limit=10&sort_by=price&order=desc"

练习 2: 认证依赖链
curl -H "Authorization: Bearer token123" http://localhost:8000/profile
curl -H "Authorization: Bearer token456" http://localhost:8000/profile  # 未激活
curl -H "Authorization: Bearer invalid" http://localhost:8000/profile    # 无效token

练习 3: 数据库会话
curl http://localhost:8000/db-users/1
curl -X POST "http://localhost:8000/db-users/?name=Charlie&email=charlie@example.com"

练习 4: 权限系统
curl -H "X-User: charlie" http://localhost:8000/articles/              # Viewer可读
curl -H "X-User: bob" -X POST "http://localhost:8000/articles/?title=Test&content=Content"  # Editor可写
curl -H "X-User: alice" -X DELETE http://localhost:8000/articles/1    # Admin可删
curl -H "X-User: bob" -X DELETE http://localhost:8000/articles/1      # Editor无删除权限

练习 5: 多数据源
curl "http://localhost:8000/query/users/1?source_type=mysql"
curl "http://localhost:8000/query/users/1?source_type=postgres"
curl "http://localhost:8000/query/users/?source_type=mongodb"

练习 6: 缓存控制
curl http://localhost:8000/test-cache       # 观察控制台，只打印一次
curl http://localhost:8000/test-no-cache    # 观察控制台，打印三次
curl http://localhost:8000/cache-stats

练习 7: 路由器级别依赖
curl -H "X-User: admin" http://localhost:8000/admin/users     # 成功
curl -H "X-User: bob" http://localhost:8000/admin/users       # 失败
curl -H "X-User: admin" http://localhost:8000/admin/stats
curl -H "X-User: admin" -X POST "http://localhost:8000/admin/broadcast?message=Hello"

访问文档：http://localhost:8000/docs

运行方式1 (学习推荐):
    python3 依赖注入/day5-solutions.py

运行方式2 (开发推荐):
    uvicorn 依赖注入.day5-solutions:app --reload --port 8000
"""

if __name__ == "__main__":
    import uvicorn
    print("="*60)
    print("Day 5 Solutions API - Dependency Injection")
    print("="*60)
    print("Documentation: http://localhost:8000/docs")
    print("💡 提示: 如需热重载，使用 uvicorn 命令")
    print("="*60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
