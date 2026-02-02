"""
Day 2 示例代码 - 完整的演示应用
包含所有重要概念的实际示例
"""

from fastapi import FastAPI, Path, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Annotated
from datetime import datetime

# 创建 FastAPI 应用实例
app = FastAPI(
    title="FastAPI Day 2 Demo",
    description="学习路径参数、查询参数、请求体和响应模型",
    version="1.0.0"
)

# ==================== 数据模型定义 ====================

class Item(BaseModel):
    """商品模型"""
    name: str = Field(
        ...,
        title="Item name",
        description="The name of the item",
        min_length=1,
        max_length=100,
        examples=["Laptop"]
    )
    description: str | None = Field(
        None,
        title="Item description",
        max_length=500,
        examples=["A powerful laptop for developers"]
    )
    price: float = Field(
        ...,
        title="Item price",
        description="Price must be greater than zero",
        gt=0,
        examples=[999.99]
    )
    tax: float | None = Field(
        None,
        title="Tax amount",
        ge=0,
        le=100,
        examples=[99.99]
    )
    tags: list[str] = Field(
        default=[],
        title="Item tags",
        max_length=5,
        examples=[["electronics", "computers"]]
    )


class ItemResponse(BaseModel):
    """商品响应模型"""
    id: int
    name: str
    price: float
    total_price: float
    created_at: str


class User(BaseModel):
    """用户模型"""
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    full_name: str | None = None
    age: int = Field(..., ge=0, le=150)


class UserResponse(BaseModel):
    """用户响应模型（排除敏感信息）"""
    id: int
    username: str
    email: str
    full_name: str | None = None


# ==================== API 端点 ====================

@app.get("/")
async def root():
    """根路径 - API 信息"""
    return {
        "message": "Welcome to FastAPI Day 2 Demo",
        "learning_topics": [
            "Path Parameters with validation",
            "Query Parameters with constraints",
            "Request Body with Pydantic models",
            "Response Models"
        ],
        "docs": "/docs",
        "redoc": "/redoc"
    }


# ==================== 路径参数示例 ====================

@app.get("/items/{item_id}")
async def read_item(
    item_id: Annotated[int, Path(
        title="Item ID",
        description="The unique identifier of the item",
        ge=1,
        le=1000,
        examples=[42]
    )]
):
    """
    获取单个商品信息
    - 路径参数验证：item_id 必须在 1-1000 之间
    """
    return {
        "item_id": item_id,
        "name": f"Sample Item {item_id}",
        "price": 29.99
    }


@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: Annotated[int, Path(ge=1)],
    item_id: Annotated[int, Path(ge=1)]
):
    """
    获取用户的特定商品
    - 演示多个路径参数的使用
    """
    return {
        "user_id": user_id,
        "item_id": item_id,
        "message": f"User {user_id}'s item {item_id}"
    }


# ==================== 查询参数示例 ====================

@app.get("/search/")
async def search_items(
    q: Annotated[str, Query(
        title="Search query",
        description="Query string to search for items",
        min_length=3,
        max_length=50,
        examples=["laptop"]
    )],
    skip: Annotated[int, Query(
        title="Skip",
        description="Number of items to skip",
        ge=0,
        examples=[0]
    )] = 0,
    limit: Annotated[int, Query(
        title="Limit",
        description="Maximum number of items to return",
        ge=1,
        le=100,
        examples=[10]
    )] = 10,
    sort_by: Annotated[str, Query(
        pattern=r"^(name|price|date)$",
        description="Sort field"
    )] = "name"
):
    """
    搜索商品
    - 必需参数：q（搜索关键词）
    - 可选参数：skip, limit（分页）, sort_by（排序）
    """
    return {
        "query": q,
        "skip": skip,
        "limit": limit,
        "sort_by": sort_by,
        "results": [
            {"id": 1, "name": f"Item matching {q}", "price": 99.99},
            {"id": 2, "name": f"Another {q}", "price": 149.99}
        ]
    }


@app.get("/products/")
async def list_products(
    category: Annotated[list[str] | None, Query(
        title="Categories",
        description="Filter by categories"
    )] = None,
    min_price: Annotated[float | None, Query(ge=0)] = None,
    max_price: Annotated[float | None, Query(ge=0)] = None,
    in_stock: bool = True
):
    """
    列出商品
    - 演示列表查询参数和多种过滤条件
    - 访问示例: /products/?category=electronics&category=books&min_price=10&max_price=100
    """
    filters = {
        "categories": category or [],
        "price_range": {
            "min": min_price,
            "max": max_price
        },
        "in_stock_only": in_stock
    }

    return {
        "filters": filters,
        "products": [
            {"id": 1, "name": "Product A", "price": 50.0, "in_stock": True},
            {"id": 2, "name": "Product B", "price": 75.0, "in_stock": True}
        ]
    }


# ==================== 请求体示例 ====================

@app.post("/items/", response_model=ItemResponse, status_code=201)
async def create_item(item: Item):
    """
    创建新商品
    - 使用 Pydantic 模型验证请求体
    - 返回 ItemResponse 模型（自动过滤字段）
    - 返回状态码 201（Created）
    """
    total_price = item.price + (item.tax or 0)

    return {
        "id": 1,
        "name": item.name,
        "price": item.price,
        "total_price": total_price,
        "created_at": datetime.now().isoformat()
    }


@app.put("/items/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: Annotated[int, Path(ge=1)],
    item: Item,
    update_timestamp: bool = True
):
    """
    更新商品
    - 组合路径参数、请求体和查询参数
    """
    total_price = item.price + (item.tax or 0)

    response = {
        "id": item_id,
        "name": item.name,
        "price": item.price,
        "total_price": total_price,
        "created_at": datetime.now().isoformat()
    }

    if update_timestamp:
        response["updated_at"] = datetime.now().isoformat()

    return response


# ==================== 响应模型示例 ====================

@app.post("/users/", response_model=UserResponse, status_code=201)
async def create_user(user: User):
    """
    创建用户
    - 演示响应模型如何保护敏感数据
    - 即使返回更多字段，也只会返回 UserResponse 中定义的字段
    """
    # 模拟保存用户（包括敏感数据）
    user_in_db = {
        "id": 1,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": "fake-hashed-password",  # 不会在响应中出现
        "is_active": True,  # 不会在响应中出现
        "created_at": datetime.now().isoformat()  # 不会在响应中出现
    }

    return user_in_db


# ==================== 错误处理示例 ====================

@app.get("/items-by-name/{item_name}")
async def get_item_by_name(
    item_name: Annotated[str, Path(min_length=3, max_length=50)]
):
    """
    按名称查找商品
    - 演示手动抛出 HTTPException
    """
    # 模拟数据库查询
    items_db = {
        "laptop": {"id": 1, "name": "Laptop", "price": 999.99},
        "mouse": {"id": 2, "name": "Mouse", "price": 29.99}
    }

    if item_name.lower() not in items_db:
        raise HTTPException(
            status_code=404,
            detail=f"Item '{item_name}' not found"
        )

    return items_db[item_name.lower()]


# ==================== 综合示例 ====================

class OrderItem(BaseModel):
    """订单项"""
    item_id: int = Field(..., ge=1)
    quantity: int = Field(..., ge=1, le=100)


class Order(BaseModel):
    """订单模型"""
    customer_id: int = Field(..., ge=1)
    items: list[OrderItem] = Field(..., min_length=1, max_length=50)
    notes: str | None = Field(None, max_length=500)


class OrderResponse(BaseModel):
    """订单响应"""
    order_id: int
    customer_id: int
    total_items: int
    status: str
    created_at: str


@app.post("/orders/", response_model=OrderResponse, status_code=201)
async def create_order(
    order: Order,
    apply_discount: bool = False,
    discount_code: Annotated[str | None, Query(max_length=20)] = None
):
    """
    创建订单
    - 综合示例：嵌套模型 + 查询参数
    """
    total_items = sum(item.quantity for item in order.items)

    order_response = {
        "order_id": 10001,
        "customer_id": order.customer_id,
        "total_items": total_items,
        "status": "pending",
        "created_at": datetime.now().isoformat()
    }

    if apply_discount and discount_code:
        order_response["discount_applied"] = discount_code

    return order_response


# ==================== 测试辅助端点 ====================

@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }


@app.get("/examples")
async def get_examples():
    """获取所有示例的使用说明"""
    return {
        "message": "API Usage Examples",
        "endpoints": {
            "path_parameters": {
                "url": "/items/42",
                "description": "Path parameter with validation (1-1000)"
            },
            "query_parameters": {
                "url": "/search/?q=laptop&skip=0&limit=10",
                "description": "Query parameters with constraints"
            },
            "query_lists": {
                "url": "/products/?category=electronics&category=books",
                "description": "Multiple values for same parameter"
            },
            "post_request": {
                "url": "/items/",
                "method": "POST",
                "body": {
                    "name": "Laptop",
                    "price": 999.99,
                    "tax": 99.99,
                    "tags": ["electronics"]
                }
            },
            "complex_request": {
                "url": "/orders/?apply_discount=true&discount_code=SAVE10",
                "method": "POST",
                "body": {
                    "customer_id": 1,
                    "items": [
                        {"item_id": 1, "quantity": 2},
                        {"item_id": 2, "quantity": 1}
                    ]
                }
            }
        }
    }


# ==================== 启动服务器 ====================

if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting FastAPI Day 2 Demo Server...")
    print("📚 Documentation: http://localhost:8000/docs")
    print("📖 ReDoc: http://localhost:8000/redoc")
    print("🔍 Examples: http://localhost:8000/examples")
    print("\n💡 提示: 如需热重载功能，请使用命令:")
    print("   uvicorn day2-main:app --reload --port 8000\n")

    # 使用 reload=False 避免警告信息
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )
