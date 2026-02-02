"""
Day 4: 路由组织与错误处理 - 参考答案
完整实现所有练习
"""

from fastapi import FastAPI, APIRouter, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

app = FastAPI(
    title="Day 4 Solutions API",
    description="完整的练习参考答案",
    version="1.0.0"
)

# ==================== 练习 1: 商品管理路由器 (基础) ====================

class Product(BaseModel):
    """商品模型"""
    name: str = Field(..., min_length=1, max_length=100, description="商品名称")
    price: float = Field(..., gt=0, description="商品价格")
    stock: int = Field(..., ge=0, description="库存数量")


class ProductResponse(BaseModel):
    """商品响应模型（包含 ID）"""
    id: int
    name: str
    price: float
    stock: int


# 模拟数据库
products_db: dict[int, ProductResponse] = {}
product_id_counter = 1


# 创建商品路由器
products_router = APIRouter(
    prefix="/products",
    tags=["products"],
    responses={404: {"description": "Product not found"}}
)


@products_router.get("/", response_model=List[ProductResponse])
async def list_products():
    """获取所有商品"""
    return list(products_db.values())


@products_router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    """获取单个商品"""
    if product_id not in products_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )
    return products_db[product_id]


@products_router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: Product):
    """创建商品"""
    global product_id_counter

    product_response = ProductResponse(
        id=product_id_counter,
        name=product.name,
        price=product.price,
        stock=product.stock
    )

    products_db[product_id_counter] = product_response
    product_id_counter += 1

    return product_response


@products_router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int):
    """删除商品"""
    if product_id not in products_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )

    del products_db[product_id]
    return None


# ==================== 练习 2: 自定义异常处理 (中等) ====================

class ProductNotFoundError(Exception):
    """商品未找到异常"""
    def __init__(self, product_id: int):
        self.product_id = product_id
        super().__init__(f"Product {product_id} not found")


class InsufficientStockError(Exception):
    """库存不足异常"""
    def __init__(self, product_id: int, available: int, requested: int):
        self.product_id = product_id
        self.available = available
        self.requested = requested
        super().__init__(
            f"Insufficient stock for product {product_id}. "
            f"Available: {available}, Requested: {requested}"
        )


@app.exception_handler(ProductNotFoundError)
async def product_not_found_handler(request: Request, exc: ProductNotFoundError):
    """商品未找到异常处理器"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "product_not_found",
            "message": f"Product {exc.product_id} not found",
            "product_id": exc.product_id
        }
    )


@app.exception_handler(InsufficientStockError)
async def insufficient_stock_handler(request: Request, exc: InsufficientStockError):
    """库存不足异常处理器"""
    return JSONResponse(
        status_code=400,
        content={
            "error": "insufficient_stock",
            "message": f"Not enough stock for product {exc.product_id}",
            "product_id": exc.product_id,
            "available": exc.available,
            "requested": exc.requested
        }
    )


class PurchaseResponse(BaseModel):
    """购买响应模型"""
    success: bool
    product_id: int
    quantity_purchased: int
    remaining_stock: int
    total_price: float


@products_router.post("/{product_id}/purchase", response_model=PurchaseResponse)
async def purchase_product(product_id: int, quantity: int = Field(1, gt=0)):
    """购买商品"""
    # 检查商品是否存在
    if product_id not in products_db:
        raise ProductNotFoundError(product_id)

    product = products_db[product_id]

    # 检查库存是否充足
    if product.stock < quantity:
        raise InsufficientStockError(product_id, product.stock, quantity)

    # 减少库存
    product.stock -= quantity
    total_price = product.price * quantity

    return PurchaseResponse(
        success=True,
        product_id=product_id,
        quantity_purchased=quantity,
        remaining_stock=product.stock,
        total_price=round(total_price, 2)
    )


# ==================== 练习 3: 用户认证路由 (中等) ====================

class UserLogin(BaseModel):
    """用户登录模型"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserInDB(BaseModel):
    """数据库用户模型"""
    username: str
    password: str  # 实际应该存储哈希值


class Token(BaseModel):
    """Token 响应模型"""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """用户响应模型"""
    username: str
    message: str


# 用户数据库
users_db: dict[str, UserInDB] = {}


class UsernameExistsError(Exception):
    """用户名已存在异常"""
    def __init__(self, username: str):
        self.username = username
        super().__init__(f"Username '{username}' already exists")


class InvalidCredentialsError(Exception):
    """无效凭证异常"""
    def __init__(self):
        super().__init__("Invalid username or password")


@app.exception_handler(UsernameExistsError)
async def username_exists_handler(request: Request, exc: UsernameExistsError):
    """用户名已存在异常处理器"""
    return JSONResponse(
        status_code=409,
        content={
            "error": "username_exists",
            "message": f"Username '{exc.username}' already exists",
            "username": exc.username
        }
    )


@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    """无效凭证异常处理器"""
    return JSONResponse(
        status_code=401,
        content={
            "error": "invalid_credentials",
            "message": "Invalid username or password"
        },
        headers={"WWW-Authenticate": "Bearer"}
    )


# 创建认证路由器
auth_router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)


@auth_router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserLogin):
    """用户注册"""
    # 检查用户名是否已存在
    if user.username in users_db:
        raise UsernameExistsError(user.username)

    # 保存用户（实际应该加密密码）
    users_db[user.username] = UserInDB(
        username=user.username,
        password=user.password  # 实际应该是 hash(password)
    )

    return UserResponse(
        username=user.username,
        message="User registered successfully"
    )


@auth_router.post("/login", response_model=Token)
async def login(user: UserLogin):
    """用户登录"""
    # 验证用户是否存在
    if user.username not in users_db:
        raise InvalidCredentialsError()

    # 验证密码
    db_user = users_db[user.username]
    if db_user.password != user.password:  # 实际应该比较哈希值
        raise InvalidCredentialsError()

    # 生成 token（这里简化处理）
    access_token = f"{user.username}_token_{datetime.now().timestamp()}"

    return Token(
        access_token=access_token,
        token_type="bearer"
    )


# ==================== 练习 4: 订单管理系统 (困难) ====================

class OrderItem(BaseModel):
    """订单项模型"""
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    """创建订单模型"""
    customer_name: str = Field(..., min_length=1, max_length=100)
    items: List[OrderItem] = Field(..., min_length=1)


class OrderResponse(BaseModel):
    """订单响应模型"""
    id: int
    customer_name: str
    items: List[OrderItem]
    total_amount: float
    status: str  # "pending", "completed", "cancelled"
    created_at: str


# 订单数据库
orders_db: dict[int, OrderResponse] = {}
order_id_counter = 1


class OrderNotFoundError(Exception):
    """订单未找到异常"""
    def __init__(self, order_id: int):
        self.order_id = order_id
        super().__init__(f"Order {order_id} not found")


class OrderAlreadyCancelledError(Exception):
    """订单已取消异常"""
    def __init__(self, order_id: int):
        self.order_id = order_id
        super().__init__(f"Order {order_id} is already cancelled")


@app.exception_handler(OrderNotFoundError)
async def order_not_found_handler(request: Request, exc: OrderNotFoundError):
    """订单未找到异常处理器"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "order_not_found",
            "message": f"Order {exc.order_id} not found",
            "order_id": exc.order_id
        }
    )


@app.exception_handler(OrderAlreadyCancelledError)
async def order_cancelled_handler(request: Request, exc: OrderAlreadyCancelledError):
    """订单已取消异常处理器"""
    return JSONResponse(
        status_code=400,
        content={
            "error": "order_already_cancelled",
            "message": f"Order {exc.order_id} is already cancelled",
            "order_id": exc.order_id
        }
    )


# 创建订单路由器
orders_router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)


@orders_router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate):
    """创建订单"""
    global order_id_counter

    # 1. 验证所有商品是否存在
    for item in order.items:
        if item.product_id not in products_db:
            raise ProductNotFoundError(item.product_id)

    # 2. 验证库存是否充足
    for item in order.items:
        product = products_db[item.product_id]
        if product.stock < item.quantity:
            raise InsufficientStockError(
                item.product_id,
                product.stock,
                item.quantity
            )

    # 3. 计算总金额
    total_amount = 0.0
    for item in order.items:
        product = products_db[item.product_id]
        total_amount += product.price * item.quantity

    # 4. 减少商品库存
    for item in order.items:
        product = products_db[item.product_id]
        product.stock -= item.quantity

    # 5. 创建订单
    order_response = OrderResponse(
        id=order_id_counter,
        customer_name=order.customer_name,
        items=order.items,
        total_amount=round(total_amount, 2),
        status="pending",
        created_at=datetime.now().isoformat()
    )

    orders_db[order_id_counter] = order_response
    order_id_counter += 1

    return order_response


@orders_router.get("/", response_model=List[OrderResponse])
async def list_orders():
    """获取所有订单"""
    return list(orders_db.values())


@orders_router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int):
    """获取单个订单"""
    if order_id not in orders_db:
        raise OrderNotFoundError(order_id)
    return orders_db[order_id]


@orders_router.patch("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(order_id: int):
    """取消订单"""
    # 1. 验证订单是否存在
    if order_id not in orders_db:
        raise OrderNotFoundError(order_id)

    order = orders_db[order_id]

    # 2. 验证订单是否已被取消
    if order.status == "cancelled":
        raise OrderAlreadyCancelledError(order_id)

    # 3. 恢复商品库存
    for item in order.items:
        if item.product_id in products_db:
            product = products_db[item.product_id]
            product.stock += item.quantity

    # 4. 更新订单状态
    order.status = "cancelled"

    return order


# ==================== 练习 5: API 版本控制 (挑战) ====================

class UserV1Create(BaseModel):
    """V1 用户创建模型"""
    username: str = Field(..., min_length=3)
    email: str


class UserV1Response(BaseModel):
    """V1 用户响应模型"""
    id: int
    username: str
    email: str


class UserV2Create(BaseModel):
    """V2 用户创建模型（扩展字段）"""
    username: str = Field(..., min_length=3)
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserV2Response(BaseModel):
    """V2 用户响应模型（扩展字段）"""
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserInDBFull(BaseModel):
    """完整的数据库用户模型"""
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


# 共享的用户数据库
versioned_users_db: dict[int, UserInDBFull] = {}
versioned_user_id_counter = 1


# API V1 路由器
api_v1_router = APIRouter(prefix="/api/v1", tags=["v1"])
users_v1_router = APIRouter(prefix="/users", tags=["v1-users"])


@users_v1_router.post("/", response_model=UserV1Response, status_code=status.HTTP_201_CREATED)
async def create_user_v1(user: UserV1Create):
    """V1 创建用户（只支持基础字段）"""
    global versioned_user_id_counter

    user_in_db = UserInDBFull(
        id=versioned_user_id_counter,
        username=user.username,
        email=user.email
    )

    versioned_users_db[versioned_user_id_counter] = user_in_db
    versioned_user_id_counter += 1

    # 只返回 V1 字段
    return UserV1Response(
        id=user_in_db.id,
        username=user_in_db.username,
        email=user_in_db.email
    )


@users_v1_router.get("/{user_id}", response_model=UserV1Response)
async def get_user_v1(user_id: int):
    """V1 获取用户（只返回基础字段）"""
    if user_id not in versioned_users_db:
        raise HTTPException(status_code=404, detail="User not found")

    user = versioned_users_db[user_id]

    # 只返回 V1 字段
    return UserV1Response(
        id=user.id,
        username=user.username,
        email=user.email
    )


# API V2 路由器
api_v2_router = APIRouter(prefix="/api/v2", tags=["v2"])
users_v2_router = APIRouter(prefix="/users", tags=["v2-users"])


@users_v2_router.post("/", response_model=UserV2Response, status_code=status.HTTP_201_CREATED)
async def create_user_v2(user: UserV2Create):
    """V2 创建用户（支持扩展字段）"""
    global versioned_user_id_counter

    user_in_db = UserInDBFull(
        id=versioned_user_id_counter,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url
    )

    versioned_users_db[versioned_user_id_counter] = user_in_db
    versioned_user_id_counter += 1

    return UserV2Response(**user_in_db.model_dump())


@users_v2_router.get("/{user_id}", response_model=UserV2Response)
async def get_user_v2(user_id: int):
    """V2 获取用户（返回所有字段）"""
    if user_id not in versioned_users_db:
        raise HTTPException(status_code=404, detail="User not found")

    user = versioned_users_db[user_id]
    return UserV2Response(**user.model_dump())


# 注册 v1 和 v2 路由
api_v1_router.include_router(users_v1_router)
api_v2_router.include_router(users_v2_router)


# ==================== 练习 6: 全局错误处理 (挑战) ====================

class ErrorDetail(BaseModel):
    """错误详情模型"""
    code: str
    message: str
    details: Optional[dict] = None


class ErrorResponse(BaseModel):
    """统一错误响应模型"""
    success: bool = False
    error: ErrorDetail
    timestamp: str
    path: str


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """HTTP 异常处理器"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=ErrorDetail(
                code=f"HTTP_{exc.status_code}",
                message=exc.detail,
                details={"status_code": exc.status_code}
            ),
            timestamp=datetime.now().isoformat(),
            path=str(request.url.path)
        ).model_dump()
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """验证错误处理器"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })

    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            error=ErrorDetail(
                code="VALIDATION_ERROR",
                message="Request validation failed",
                details={"errors": errors}
            ),
            timestamp=datetime.now().isoformat(),
            path=str(request.url.path)
        ).model_dump()
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """通用异常处理器"""
    import traceback
    import logging

    # 记录详细错误信息
    logging.error(f"Unhandled exception: {exc}")
    logging.error(traceback.format_exc())

    # 生产环境应该隐藏详细错误信息
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error=ErrorDetail(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected error occurred",
                details={"type": type(exc).__name__}  # 生产环境移除此行
            ),
            timestamp=datetime.now().isoformat(),
            path=str(request.url.path)
        ).model_dump()
    )


# ==================== 注册所有路由器 ====================

app.include_router(products_router)
app.include_router(auth_router)
app.include_router(orders_router)
app.include_router(api_v1_router)
app.include_router(api_v2_router)


# ==================== 根路由 ====================

@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "Day 4 Solutions API",
        "version": "1.0.0",
        "endpoints": {
            "products": "/products",
            "auth": "/auth",
            "orders": "/orders",
            "api_v1": "/api/v1",
            "api_v2": "/api/v2",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }


# ==================== 健康检查 ====================

@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "stats": {
            "products": len(products_db),
            "users": len(users_db),
            "orders": len(orders_db)
        }
    }


# ==================== 运行说明 ====================
"""
运行方式：
uvicorn day4-solutions:app --reload

测试示例：

1. 商品管理：
   curl -X POST "http://localhost:8000/products/" \
     -H "Content-Type: application/json" \
     -d '{"name": "Laptop", "price": 999.99, "stock": 10}'

2. 用户认证：
   curl -X POST "http://localhost:8000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "john", "password": "Password123"}'

3. 订单管理：
   curl -X POST "http://localhost:8000/orders/" \
     -H "Content-Type: application/json" \
     -d '{
       "customer_name": "John Doe",
       "items": [{"product_id": 1, "quantity": 2}]
     }'

4. API 版本控制：
   curl -X POST "http://localhost:8000/api/v1/users/" \
     -H "Content-Type: application/json" \
     -d '{"username": "jane", "email": "jane@example.com"}'

访问文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

运行方式1 (学习推荐):
    python3 路由处理/day4-solutions.py

运行方式2 (开发推荐):
    uvicorn 路由处理.day4-solutions:app --reload --port 8000
"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
