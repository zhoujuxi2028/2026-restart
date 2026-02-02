"""
Day 4: 路由组织与错误处理 - 练习题模板
请在标记 TODO 的地方完成代码
"""

from fastapi import FastAPI, APIRouter, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Day 4 Exercises")

# ==================== 练习 1: 商品管理路由器 (基础) ====================

# TODO: 定义 Product 模型
class Product(BaseModel):
    pass  # 你的代码


# TODO: 创建模拟数据库和计数器
products_db = {}
product_id_counter = 1


# TODO: 创建 ProductRouter
products_router = APIRouter()


# TODO: 实现 GET /products/ - 获取所有商品
@products_router.get("/")
async def list_products():
    pass  # 你的代码


# TODO: 实现 GET /products/{product_id} - 获取单个商品
@products_router.get("/{product_id}")
async def get_product(product_id: int):
    pass  # 你的代码


# TODO: 实现 POST /products/ - 创建商品
@products_router.post("/")
async def create_product(product: Product):
    pass  # 你的代码


# TODO: 实现 DELETE /products/{product_id} - 删除商品
@products_router.delete("/{product_id}")
async def delete_product(product_id: int):
    pass  # 你的代码


# TODO: 注册路由器到主应用
# app.include_router(...)


# ==================== 练习 2: 自定义异常处理 (中等) ====================

# TODO: 定义自定义异常 - ProductNotFoundError
class ProductNotFoundError(Exception):
    pass  # 你的代码


# TODO: 定义自定义异常 - InsufficientStockError
class InsufficientStockError(Exception):
    pass  # 你的代码


# TODO: 注册 ProductNotFoundError 异常处理器
@app.exception_handler(ProductNotFoundError)
async def product_not_found_handler(request: Request, exc: ProductNotFoundError):
    pass  # 你的代码


# TODO: 注册 InsufficientStockError 异常处理器
@app.exception_handler(InsufficientStockError)
async def insufficient_stock_handler(request: Request, exc: InsufficientStockError):
    pass  # 你的代码


# TODO: 实现 POST /products/{product_id}/purchase - 购买商品
@products_router.post("/{product_id}/purchase")
async def purchase_product(product_id: int, quantity: int = 1):
    pass  # 你的代码


# ==================== 练习 3: 用户认证路由 (中等) ====================

# TODO: 定义 UserLogin 模型
class UserLogin(BaseModel):
    pass  # 你的代码


# TODO: 定义 Token 模型
class Token(BaseModel):
    pass  # 你的代码


# TODO: 创建用户数据库
users_db = {}


# TODO: 定义自定义异常 - UsernameExistsError
class UsernameExistsError(Exception):
    pass  # 你的代码


# TODO: 定义自定义异常 - InvalidCredentialsError
class InvalidCredentialsError(Exception):
    pass  # 你的代码


# TODO: 注册 UsernameExistsError 异常处理器
@app.exception_handler(UsernameExistsError)
async def username_exists_handler(request: Request, exc: UsernameExistsError):
    pass  # 你的代码


# TODO: 注册 InvalidCredentialsError 异常处理器
@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    pass  # 你的代码


# TODO: 创建 AuthRouter
auth_router = APIRouter()


# TODO: 实现 POST /auth/register - 用户注册
@auth_router.post("/register")
async def register(user: UserLogin):
    pass  # 你的代码


# TODO: 实现 POST /auth/login - 用户登录
@auth_router.post("/login")
async def login(user: UserLogin):
    pass  # 你的代码


# TODO: 注册 auth_router
# app.include_router(...)


# ==================== 练习 4: 订单管理系统 (困难) ====================

# TODO: 定义 OrderItem 模型
class OrderItem(BaseModel):
    pass  # 你的代码


# TODO: 定义 OrderCreate 模型
class OrderCreate(BaseModel):
    pass  # 你的代码


# TODO: 定义 OrderResponse 模型
class OrderResponse(BaseModel):
    pass  # 你的代码


# TODO: 创建订单数据库和计数器
orders_db = {}
order_id_counter = 1


# TODO: 定义自定义异常 - OrderNotFoundError
class OrderNotFoundError(Exception):
    pass  # 你的代码


# TODO: 定义自定义异常 - OrderAlreadyCancelledError
class OrderAlreadyCancelledError(Exception):
    pass  # 你的代码


# TODO: 注册异常处理器


# TODO: 创建 OrderRouter
orders_router = APIRouter()


# TODO: 实现 POST /orders/ - 创建订单
@orders_router.post("/")
async def create_order(order: OrderCreate):
    """
    创建订单逻辑：
    1. 验证所有商品是否存在
    2. 验证库存是否充足
    3. 计算总金额
    4. 减少商品库存
    5. 创建订单
    """
    pass  # 你的代码


# TODO: 实现 GET /orders/ - 获取所有订单
@orders_router.get("/")
async def list_orders():
    pass  # 你的代码


# TODO: 实现 GET /orders/{order_id} - 获取单个订单
@orders_router.get("/{order_id}")
async def get_order(order_id: int):
    pass  # 你的代码


# TODO: 实现 PATCH /orders/{order_id}/cancel - 取消订单
@orders_router.patch("/{order_id}/cancel")
async def cancel_order(order_id: int):
    """
    取消订单逻辑：
    1. 验证订单是否存在
    2. 验证订单是否已被取消
    3. 恢复商品库存
    4. 更新订单状态
    """
    pass  # 你的代码


# TODO: 注册 orders_router
# app.include_router(...)


# ==================== 练习 5: API 版本控制 (挑战) ====================

# TODO: 定义 UserV1Response 模型


# TODO: 定义 UserV2Response 模型


# TODO: 创建用户数据库（可以和前面的共享）


# TODO: 创建 API v1 路由器


# TODO: 实现 v1 端点


# TODO: 创建 API v2 路由器


# TODO: 实现 v2 端点


# TODO: 注册版本路由器


# ==================== 练习 6: 全局错误处理 (挑战) ====================

# TODO: 实现统一的错误响应模型
class ErrorResponse(BaseModel):
    pass  # 你的代码


# TODO: 实现 HTTPException 处理器


# TODO: 实现 RequestValidationError 处理器


# TODO: 实现通用 Exception 处理器


# ==================== 测试根路由 ====================

@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "Day 4 Exercises API",
        "endpoints": {
            "products": "/products",
            "auth": "/auth",
            "orders": "/orders",
            "docs": "/docs"
        }
    }


# ==================== 运行说明 ====================
"""
运行方式：
uvicorn day4-exercises:app --reload

测试方式：
1. 浏览器访问 http://localhost:8000/docs
2. 使用 curl 命令测试（见练习题.md）
3. 使用 Postman 或其他 API 测试工具

提示：
- 按顺序完成练习
- 先完成数据模型定义
- 再实现路由处理函数
- 最后实现异常处理
- 每完成一个练习就测试一次

运行方式1 (学习推荐):
    python3 路由处理/day4-exercises.py

运行方式2 (开发推荐):
    uvicorn 路由处理.day4-exercises:app --reload --port 8000

访问: http://localhost:8000/docs 查看API文档
"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
