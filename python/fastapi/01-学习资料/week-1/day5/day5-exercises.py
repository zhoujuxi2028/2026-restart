"""
Day 5: 依赖注入系统 - 练习题模板
请在标记 TODO 的地方完成代码
"""

from fastapi import FastAPI, Depends, HTTPException, Header, Query, APIRouter
from typing import Optional
from enum import Enum
import time

app = FastAPI(title="Day 5 Exercises")

# ==================== 练习 1: 查询参数依赖 (基础) ====================

# TODO: 定义 PaginationParams 类
class PaginationParams:
    def __init__(self, skip: int = 0, limit: int = 10):
        pass  # 你的代码 - 添加验证


# TODO: 定义 SortParams 类
class SortParams:
    def __init__(self, sort_by: str = "id", order: str = "asc"):
        pass  # 你的代码 - 验证 order 只能是 "asc" 或 "desc"


# TODO: 创建端点 GET /users/ 使用分页和排序依赖
@app.get("/users/")
async def list_users(
    # 使用依赖
):
    pass  # 你的代码


# TODO: 创建端点 GET /products/ 使用相同的依赖
@app.get("/products/")
async def list_products():
    pass  # 你的代码


# ==================== 练习 2: 认证依赖链 (中等) ====================

# 模拟用户数据库
fake_users = {
    "token123": {"username": "john", "active": True},
    "token456": {"username": "jane", "active": False}
}


# TODO: 第一层 - 提取 Token
def get_token_header(authorization: str = Header(...)):
    pass  # 你的代码 - 从 "Bearer <token>" 提取 token


# TODO: 第二层 - 验证 Token 并获取用户
def get_current_user(token: str = Depends(get_token_header)):
    pass  # 你的代码 - 验证 token 并返回用户


# TODO: 第三层 - 验证用户状态
def get_active_user(user: dict = Depends(get_current_user)):
    pass  # 你的代码 - 检查用户是否激活


# TODO: 创建端点 GET /profile
@app.get("/profile")
async def get_profile():
    pass  # 你的代码 - 使用 get_active_user 依赖


# TODO: 创建端点 GET /settings
@app.get("/settings")
async def get_settings():
    pass  # 你的代码


# ==================== 练习 3: 数据库会话依赖 (中等) ====================

# TODO: 定义 Database 类
class Database:
    def __init__(self):
        pass  # 你的代码

    def connect(self):
        pass  # 你的代码

    def disconnect(self):
        pass  # 你的代码

    def execute(self, query: str):
        pass  # 你的代码


# TODO: 创建数据库会话依赖（使用 yield）
def get_db():
    pass  # 你的代码 - 连接、yield、断开


# TODO: 创建端点使用数据库依赖
@app.get("/db-users/{user_id}")
async def get_db_user(user_id: int):
    pass  # 你的代码 - 使用 get_db 依赖


# ==================== 练习 4: 权限系统 (困难) ====================

# TODO: 定义角色枚举
class Role(str, Enum):
    pass  # 你的代码


# TODO: 定义权限映射
PERMISSIONS = {
    # 你的代码
}


# TODO: 定义用户数据库
users_db = {
    # 你的代码
}


# TODO: 获取当前用户（从请求头）
def get_current_user_by_header(username: str = Header(..., alias="X-User")):
    pass  # 你的代码


# TODO: 创建权限检查类
class PermissionChecker:
    def __init__(self, required_permission: str):
        pass  # 你的代码

    def __call__(self, current_user: dict = Depends(get_current_user_by_header)):
        pass  # 你的代码 - 检查权限


# TODO: 创建端点使用权限检查
@app.get("/articles/")
async def list_articles():
    pass  # 你的代码 - 需要 "read" 权限


@app.post("/articles/")
async def create_article():
    pass  # 你的代码 - 需要 "write" 权限


@app.delete("/articles/{article_id}")
async def delete_article(article_id: int):
    pass  # 你的代码 - 需要 "delete" 权限


# ==================== 练习 5: 多数据源依赖 (困难) ====================

# TODO: 定义数据源接口和实现
class DataSource:
    pass  # 你的代码


class MySQLDataSource(DataSource):
    pass  # 你的代码


class PostgresDataSource(DataSource):
    pass  # 你的代码


# TODO: 数据源工厂
def get_data_source(source_type: str = Query("mysql")):
    pass  # 你的代码


# TODO: 用户服务类
class UserService:
    pass  # 你的代码


# TODO: 创建端点
@app.get("/query/users/{user_id}")
async def query_user(user_id: int):
    pass  # 你的代码


# ==================== 练习 6: 依赖缓存控制 (挑战) ====================

# TODO: 创建带时间戳的依赖
def get_timestamp():
    pass  # 你的代码


# TODO: 测试缓存
@app.get("/test-cache")
async def test_cache():
    pass  # 你的代码


# TODO: 测试无缓存
@app.get("/test-no-cache")
async def test_no_cache():
    pass  # 你的代码


# ==================== 练习 7: 路由器级别依赖 (挑战) ====================

# TODO: 创建管理员检查依赖
def require_admin():
    pass  # 你的代码


# TODO: 创建管理路由器（应用依赖到所有路由）
admin_router = APIRouter()


# TODO: 添加管理端点（不需要单独指定依赖）


# TODO: 注册管理路由器
# app.include_router(...)


# ==================== 根路由 ====================

@app.get("/")
async def root():
    return {
        "message": "Day 5 Exercises API",
        "exercises": {
            "1": "/users, /products",
            "2": "/profile, /settings",
            "3": "/db-users/{id}",
            "4": "/articles",
            "5": "/query/users/{id}",
            "6": "/test-cache, /test-no-cache",
            "7": "/admin/*"
        }
    }


"""
运行方式1 (学习推荐):
    python3 依赖注入/day5-exercises.py

运行方式2 (开发推荐):
    uvicorn 依赖注入.day5-exercises:app --reload --port 8000

访问: http://localhost:8000/docs 查看API文档
"""
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
