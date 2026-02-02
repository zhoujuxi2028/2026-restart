"""
Day 2 练习参考答案
建议先自己完成练习后再查看此文件
"""

from fastapi import FastAPI, Path, Query, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import Annotated
from enum import Enum
from datetime import datetime

app = FastAPI(title="Day 2 Solutions", version="1.0.0")


# ==================== 练习 1: 用户信息查询 ====================

@app.get("/users/{user_id}")
async def get_user(
    user_id: Annotated[int, Path(
        title="User ID",
        description="The ID of the user to retrieve",
        ge=1,
        le=10000
    )],
    include_email: bool = False
):
    """获取用户信息"""
    user = {
        "user_id": user_id,
        "username": f"user_{user_id}",
        "full_name": "John Doe"
    }

    if include_email:
        user["email"] = f"user_{user_id}@example.com"

    return user


# ==================== 练习 2: 商品搜索 ====================

@app.get("/products/search")
async def search_products(
    keyword: Annotated[str, Query(
        title="Search keyword",
        description="Keyword to search for products",
        min_length=3,
        max_length=50
    )],
    min_price: Annotated[float | None, Query(ge=0)] = None,
    max_price: Annotated[float | None, Query(ge=0)] = None,
    category: Annotated[list[str] | None, Query()] = None,
    sort_by: Annotated[str, Query(
        pattern=r"^(price|name)$",
        description="Sort by price or name"
    )] = "name"
):
    """搜索商品"""
    # 模拟搜索结果
    results = {
        "keyword": keyword,
        "filters": {
            "min_price": min_price,
            "max_price": max_price,
            "categories": category or [],
            "sort_by": sort_by
        },
        "products": [
            {"id": 1, "name": f"Product matching {keyword}", "price": 99.99},
            {"id": 2, "name": f"Another {keyword}", "price": 149.99}
        ],
        "total": 2
    }

    return results


# ==================== 练习 3: 创建博客文章 ====================

class Post(BaseModel):
    """博客文章模型"""
    title: str = Field(
        ...,
        title="Post title",
        min_length=1,
        max_length=200
    )
    content: str = Field(
        ...,
        title="Post content",
        min_length=10,
        max_length=10000
    )
    author: str = Field(
        ...,
        title="Author name",
        min_length=1,
        max_length=100
    )
    tags: list[str] = Field(
        default=[],
        title="Post tags",
        max_length=10
    )
    published: bool = Field(
        default=False,
        title="Published status"
    )


class PostResponse(BaseModel):
    """博客文章响应模型"""
    id: int
    title: str
    author: str
    published: bool
    created_at: str


@app.post("/posts/", response_model=PostResponse, status_code=201)
async def create_post(post: Post):
    """创建博客文章"""
    # 模拟创建文章并返回
    return {
        "id": 1,
        "title": post.title,
        "author": post.author,
        "published": post.published,
        "created_at": datetime.now().isoformat()
    }


# ==================== 练习 4: 更新商品信息 ====================

class ItemUpdate(BaseModel):
    """商品更新模型（所有字段可选）"""
    name: str | None = Field(None, min_length=1, max_length=100)
    price: float | None = Field(None, gt=0)
    description: str | None = Field(None, max_length=500)
    stock: int | None = Field(None, ge=0)
    discount: float | None = Field(
        None,
        ge=0,
        le=100,
        description="Discount percentage (0-100)"
    )


@app.put("/items/{item_id}")
async def update_item(
    item_id: Annotated[int, Path(ge=1)],
    item: ItemUpdate,
    notify_users: bool = False
):
    """更新商品信息"""
    # 模拟原始商品数据
    original_item = {
        "id": item_id,
        "name": "Original Item",
        "price": 199.99,
        "description": "Original description",
        "stock": 100,
        "discount": 0
    }

    # 只更新提供的字段
    update_data = item.model_dump(exclude_unset=True)
    updated_item = {**original_item, **update_data}

    # 计算最终价格
    if updated_item["discount"] > 0:
        final_price = updated_item["price"] * (1 - updated_item["discount"] / 100)
        updated_item["final_price"] = round(final_price, 2)

    updated_item["notify_users"] = notify_users

    return updated_item


# ==================== 练习 5: 用户注册 ====================

class UserRegistration(BaseModel):
    """用户注册模型"""
    username: str = Field(
        ...,
        min_length=3,
        max_length=20,
        pattern=r"^[a-zA-Z0-9_]+$",
        description="Username (letters, numbers, underscore only)"
    )
    email: str = Field(
        ...,
        pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        description="Valid email address"
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=50,
        description="Password (8-50 characters)"
    )
    confirm_password: str = Field(
        ...,
        min_length=8,
        max_length=50
    )
    age: int = Field(
        ...,
        ge=18,
        le=120,
        description="Age (18-120)"
    )
    phone: str | None = Field(
        None,
        pattern=r"^(\d{3}-\d{4}-\d{4}|\d{11})$",
        description="Phone number (xxx-xxxx-xxxx or xxxxxxxxxxx)"
    )
    agree_terms: bool = Field(
        ...,
        description="Must agree to terms and conditions"
    )


class UserResponse(BaseModel):
    """用户响应模型（不包含密码）"""
    id: int
    username: str
    email: str
    age: int


@app.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserRegistration):
    """用户注册"""
    # 验证密码匹配
    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    # 验证条款同意
    if not user.agree_terms:
        raise HTTPException(
            status_code=400,
            detail="Must agree to terms and conditions"
        )

    # 模拟用户创建
    return {
        "id": 1,
        "username": user.username,
        "email": user.email,
        "age": user.age
    }


# ==================== 练习 6: 订单查询 ====================

@app.get("/orders/{order_id}/details")
async def get_order_details(
    order_id: Annotated[int, Path(ge=1)],
    include_items: bool = True,
    include_customer: bool = False,
    include_shipping: bool = False
):
    """获取订单详情"""
    # 基础订单信息
    order = {
        "order_id": order_id,
        "status": "processing",
        "total_amount": 299.99,
        "created_at": "2024-01-26T10:00:00"
    }

    # 根据参数添加额外信息
    if include_items:
        order["items"] = [
            {"product_id": 1, "name": "Product A", "quantity": 2, "price": 99.99},
            {"product_id": 2, "name": "Product B", "quantity": 1, "price": 100.00}
        ]

    if include_customer:
        order["customer"] = {
            "id": 101,
            "name": "John Doe",
            "email": "john@example.com"
        }

    if include_shipping:
        order["shipping"] = {
            "address": "123 Main St, City, Country",
            "method": "express",
            "tracking_number": "TRACK123456",
            "estimated_delivery": "2024-01-30"
        }

    return order


# ==================== 练习 7: 数据验证综合练习 ====================

class Category(str, Enum):
    """商品分类枚举"""
    electronics = "electronics"
    clothing = "clothing"
    food = "food"
    books = "books"


class Product(BaseModel):
    """商品模型"""
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Product name"
    )
    category: Category = Field(
        ...,
        description="Product category"
    )
    price: float = Field(
        ...,
        gt=0,
        description="Product price (must be positive)"
    )
    description: str | None = Field(
        None,
        max_length=1000,
        description="Product description"
    )
    sku: str = Field(
        ...,
        pattern=r"^[A-Z]{2}-\d{4}-\d{4}$",
        description="SKU format: XX-XXXX-XXXX"
    )
    stock: int = Field(
        ...,
        ge=0,
        description="Stock quantity"
    )
    weight: float | None = Field(
        None,
        gt=0,
        description="Weight in kg"
    )
    dimensions: str | None = Field(
        None,
        pattern=r"^\d+x\d+x\d+$",
        description="Dimensions in cm (format: LxWxH)"
    )
    images: list[str] = Field(
        default=[],
        max_length=5,
        description="Product image URLs (max 5)"
    )
    tags: list[str] = Field(
        default=[],
        description="Product tags"
    )

    @field_validator('price')
    @classmethod
    def validate_price_decimals(cls, v: float) -> float:
        """验证价格最多2位小数"""
        if round(v, 2) != v:
            raise ValueError('Price must have at most 2 decimal places')
        return v

    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v: list[str]) -> list[str]:
        """验证标签长度"""
        for tag in v:
            if len(tag) < 1 or len(tag) > 20:
                raise ValueError('Each tag must be 1-20 characters')
        return v


class ProductResponse(BaseModel):
    """商品响应模型"""
    id: int
    name: str
    category: str
    price: float
    sku: str
    stock: int
    created_at: str


@app.post("/api/v1/products", response_model=ProductResponse, status_code=201)
async def create_product(product: Product):
    """创建商品"""
    # 模拟商品创建
    return {
        "id": 1001,
        "name": product.name,
        "category": product.category.value,
        "price": product.price,
        "sku": product.sku,
        "stock": product.stock,
        "created_at": datetime.now().isoformat()
    }


# ==================== 挑战任务 1: 批量操作 ====================

class BatchItem(BaseModel):
    """批量商品项"""
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)


class BatchRequest(BaseModel):
    """批量请求模型"""
    items: list[BatchItem] = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Items to create (max 100)"
    )


@app.post("/batch/items")
async def batch_create_items(batch: BatchRequest):
    """批量创建商品"""
    created_items = []

    for idx, item in enumerate(batch.items, start=1):
        created_items.append({
            "id": 1000 + idx,
            "name": item.name,
            "price": item.price,
            "stock": item.stock
        })

    return {
        "success": True,
        "created_count": len(created_items),
        "items": created_items
    }


# ==================== 挑战任务 2: 复杂查询 ====================

@app.get("/advanced-search")
async def advanced_search(
    q: Annotated[str | None, Query(max_length=100)] = None,
    category: Annotated[list[str] | None, Query()] = None,
    min_price: Annotated[float | None, Query(ge=0)] = None,
    max_price: Annotated[float | None, Query(ge=0)] = None,
    min_date: Annotated[str | None, Query()] = None,
    max_date: Annotated[str | None, Query()] = None,
    sort_by: Annotated[list[str] | None, Query()] = None,
    order: Annotated[str, Query(pattern=r"^(asc|desc)$")] = "asc",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20
):
    """高级搜索功能"""
    # 模拟搜索结果
    results = {
        "query": {
            "search": q,
            "category": category,
            "price_range": {"min": min_price, "max": max_price},
            "date_range": {"min": min_date, "max": max_date},
            "sort": {"fields": sort_by or ["name"], "order": order}
        },
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_pages": 10,
            "total_items": 200
        },
        "items": [
            {"id": i, "name": f"Item {i}", "price": 50.0 + i}
            for i in range((page - 1) * page_size, page * page_size)
        ]
    }

    return results


# ==================== 挑战任务 3: 数据关系 ====================

class Address(BaseModel):
    """地址模型"""
    street: str = Field(..., min_length=1, max_length=200)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=1, max_length=100)
    postal_code: str = Field(..., min_length=1, max_length=20)


class Customer(BaseModel):
    """客户模型"""
    name: str = Field(..., min_length=1, max_length=100)
    email: str
    phone: str | None = None
    address: Address


class OrderItem(BaseModel):
    """订单项模型"""
    product_id: int = Field(..., ge=1)
    product_name: str
    quantity: int = Field(..., ge=1)
    unit_price: float = Field(..., gt=0)
    subtotal: float = Field(..., ge=0)


class Order(BaseModel):
    """订单模型"""
    customer: Customer
    items: list[OrderItem] = Field(..., min_length=1)
    shipping_address: Address
    payment_method: str = Field(..., pattern=r"^(credit_card|paypal|bank_transfer)$")
    notes: str | None = Field(None, max_length=500)


class OrderResponse(BaseModel):
    """订单响应模型"""
    order_id: int
    customer_name: str
    total_amount: float
    item_count: int
    status: str
    created_at: str


@app.post("/orders", response_model=OrderResponse, status_code=201)
async def create_order(order: Order):
    """创建订单"""
    # 计算总金额
    total_amount = sum(item.subtotal for item in order.items)
    item_count = sum(item.quantity for item in order.items)

    return {
        "order_id": 10001,
        "customer_name": order.customer.name,
        "total_amount": total_amount,
        "item_count": item_count,
        "status": "pending",
        "created_at": datetime.now().isoformat()
    }


# ==================== 根路由 ====================

@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "Day 2 Solutions API",
        "version": "1.0.0",
        "docs": "/docs",
        "exercises_completed": 7,
        "challenges_completed": 3
    }


# ==================== 启动服务器 ====================
"""
运行方式1 (学习推荐):
    python3 基础概念/day2-solutions.py

运行方式2 (开发推荐):
    uvicorn 基础概念.day2-solutions:app --reload --port 8001

区别:
- 方式1: 简单直接，适合学习，但修改代码后需手动重启
- 方式2: 支持热重载，修改代码自动生效，适合开发

注意: 此文件使用 8001 端口，避免与 exercises 文件冲突
访问: http://localhost:8001/docs 查看API文档
"""
if __name__ == "__main__":
    import uvicorn
    # 使用 reload=False 避免警告信息
    # 如需热重载功能，请使用上面的"运行方式2"
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)
