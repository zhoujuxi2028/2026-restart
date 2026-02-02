"""
Day 2 练习文件
请在此文件中完成所有练习题
"""

from fastapi import FastAPI, Path, Query, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import Annotated
from enum import Enum
from datetime import datetime, timedelta

app = FastAPI(title="Day 2 Exercises", version="1.0.0")


# ==================== 练习 1: 用户信息查询 ====================
# TODO: 实现 GET /users/{user_id}

@app.get("/users/{user_id}")
async def get_user(
    user_id: Annotated[int, Path(
        title="User ID",
        description="The ID of the user to retrieve",
        ge=1,
        le=10000
    )],
    include_email: Annotated[bool, Query(
        description="是否包含用户邮箱信息"
    )] = False
):
    """
    获取用户信息

    示例：
    - GET /users/1 - 不包含邮箱
    - GET /users/1?include_email=true - 包含邮箱
    - GET /users/1?include_email=false - 不包含邮箱
    """
    user = {
        "user_id": user_id,
        "username": f"user_{user_id}",
        "full_name": "John Doe"
    }

    if include_email:
        user["email"] = f"user_{user_id}@example.com"

    return user



# ==================== 练习 2: 商品搜索 ====================
# TODO: 实现 GET /products/search
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

class PostTag(str, Enum):
    """博客文章标签枚举"""
    TECH = "tech"
    TUTORIAL = "tutorial"
    NEWS = "news"
    REVIEW = "review"

class Post(BaseModel):
    """博客文章创建模型"""
    title: str = Field(..., min_length=5, max_length=200, description="文章标题")
    content: str = Field(..., min_length=20, description="文章内容")
    author: str = Field(..., min_length=2, max_length=50, description="作者姓名")
    tags: list[PostTag] = Field(default=[], max_length=5, description="文章标签")
    is_published: bool = Field(default=False, description="是否发布")

class PostResponse(BaseModel):
    """博客文章响应模型"""
    id: int = Field(..., description="文章ID")
    title: str = Field(..., description="文章标题")
    content: str = Field(..., description="文章内容")
    author: str = Field(..., description="作者")
    tags: list[PostTag] = Field(..., description="标签")
    is_published: bool = Field(..., description="发布状态")
    created_at: str = Field(..., description="创建时间")
    word_count: int = Field(..., description="字数统计")

# 模拟博客文章数据库
posts_db = {}
post_id_counter = 1

@app.post("/posts/", response_model=PostResponse, status_code=201)
async def create_post(post: Post):
    """
    创建新的博客文章

    示例请求:
    ```json
    {
        "title": "FastAPI 学习指南",
        "content": "这是一篇关于 FastAPI 学习的文章...",
        "author": "张三",
        "tags": ["tech", "tutorial"],
        "is_published": true
    }
    ```
    """
    global post_id_counter

    # 计算字数（简单的字符计数）
    word_count = len(post.content.replace(" ", ""))

    post_response = PostResponse(
        id=post_id_counter,
        title=post.title,
        content=post.content,
        author=post.author,
        tags=post.tags,
        is_published=post.is_published,
        created_at=datetime.now().isoformat(),
        word_count=word_count
    )

    posts_db[post_id_counter] = post_response
    post_id_counter += 1

    return post_response


# ==================== 练习 4: 更新商品信息 ====================

class ItemUpdate(BaseModel):
    """商品更新模型 - 所有字段都是可选的"""
    name: Annotated[str | None, Field(None, min_length=1, max_length=100)] = None
    price: Annotated[float | None, Field(None, gt=0)] = None
    description: Annotated[str | None, Field(None, max_length=500)] = None
    category: Annotated[str | None, Field(None, max_length=50)] = None
    in_stock: bool | None = None

class ItemFullResponse(BaseModel):
    """完整的商品响应模型"""
    id: int
    name: str
    price: float
    description: str | None = None
    category: str | None = None
    in_stock: bool
    updated_at: str

# 模拟商品数据库
items_db = {
    1: ItemFullResponse(
        id=1,
        name="笔记本电脑",
        price=8999.99,
        description="高性能游戏本",
        category="电子产品",
        in_stock=True,
        updated_at=datetime.now().isoformat()
    ),
    2: ItemFullResponse(
        id=2,
        name="无线鼠标",
        price=199.99,
        description="人体工学设计",
        category="电脑配件",
        in_stock=True,
        updated_at=datetime.now().isoformat()
    )
}

@app.put("/items/{item_id}", response_model=ItemFullResponse)
async def update_item_full(
    item_id: Annotated[int, Path(..., ge=1, description="商品ID")],
    item_update: ItemUpdate
):
    """
    更新商品信息

    - 支持部分更新，只更新提供的字段
    - 未提供的字段保持原值不变
    - 自动更新时间戳

    示例请求:
    ```json
    {
        "price": 7999.99,
        "in_stock": false
    }
    ```
    """
    if item_id not in items_db:
        raise HTTPException(
            status_code=404,
            detail=f"Item {item_id} not found"
        )

    item = items_db[item_id]
    update_data = item_update.model_dump(exclude_unset=True)

    # 更新字段
    for field, value in update_data.items():
        setattr(item, field, value)

    # 更新时间戳
    item.updated_at = datetime.now().isoformat()

    return item


# ==================== 练习 5: 用户注册 ====================

class UserRegistration(BaseModel):
    """用户注册模型"""
    username: str = Field(..., min_length=3, max_length=50, pattern="^[a-zA-Z0-9_]+$")
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=13, le=120, description="年龄必须在 13-120 之间")
    terms_accepted: bool = Field(..., description="必须接受用户协议")

    @field_validator('terms_accepted')
    @classmethod
    def validate_terms(cls, v):
        if not v:
            raise ValueError('必须接受用户协议才能注册')
        return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('密码必须包含至少一个大写字母')
        if not any(c.islower() for c in v):
            raise ValueError('密码必须包含至少一个小写字母')
        if not any(c.isdigit() for c in v):
            raise ValueError('密码必须包含至少一个数字')
        return v

class UserResponse(BaseModel):
    """用户响应模型（不包含敏感信息）"""
    id: int
    username: str
    email: str
    full_name: str
    age: int
    registration_date: str
    is_active: bool

# 模拟用户数据库
users_db = {}
user_id_counter = 1

@app.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user_registration: UserRegistration):
    """
    用户注册端点

    - 验证用户名唯一性
    - 验证邮箱唯一性
    - 密码强度验证
    - 必须接受用户协议

    示例请求:
    ```json
    {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "SecurePass123",
        "full_name": "John Doe",
        "age": 25,
        "terms_accepted": true
    }
    ```
    """
    global user_id_counter

    # 检查用户名是否已存在
    if any(user.username == user_registration.username for user in users_db.values()):
        raise HTTPException(
            status_code=400,
            detail="用户名已被使用"
        )

    # 检查邮箱是否已存在
    if any(user.email == user_registration.email for user in users_db.values()):
        raise HTTPException(
            status_code=400,
            detail="邮箱已被注册"
        )

    user_response = UserResponse(
        id=user_id_counter,
        username=user_registration.username,
        email=user_registration.email,
        full_name=user_registration.full_name,
        age=user_registration.age,
        registration_date=datetime.now().isoformat(),
        is_active=True
    )

    users_db[user_id_counter] = user_response
    user_id_counter += 1

    return user_response


# ==================== 练习 6: 订单查询 ====================

class OrderItem(BaseModel):
    """订单商品"""
    item_id: int
    item_name: str
    quantity: int
    unit_price: float
    subtotal: float

class OrderDetails(BaseModel):
    """订单详情响应模型"""
    order_id: int
    customer_id: int
    customer_name: str
    items: list[OrderItem]
    total_amount: float
    discount: float
    final_amount: float
    status: str
    order_date: str
    delivery_address: str | None = None

# 模拟订单数据库
orders_db = {
    1: OrderDetails(
        order_id=1,
        customer_id=1,
        customer_name="张三",
        items=[
            OrderItem(item_id=1, item_name="笔记本电脑", quantity=1, unit_price=8999.99, subtotal=8999.99),
            OrderItem(item_id=2, item_name="无线鼠标", quantity=2, unit_price=199.99, subtotal=399.98)
        ],
        total_amount=9399.97,
        discount=100.0,
        final_amount=9299.97,
        status="已发货",
        order_date=(datetime.now() - timedelta(days=2)).isoformat(),
        delivery_address="北京市朝阳区xxx街道"
    ),
    2: OrderDetails(
        order_id=2,
        customer_id=2,
        customer_name="李四",
        items=[
            OrderItem(item_id=3, item_name="机械键盘", quantity=1, unit_price=599.99, subtotal=599.99)
        ],
        total_amount=599.99,
        discount=0.0,
        final_amount=599.99,
        status="处理中",
        order_date=datetime.now().isoformat(),
        delivery_address="上海市浦东新区xxx路"
    )
}

@app.get("/orders/{order_id}/details", response_model=OrderDetails)
async def get_order_details(
    order_id: Annotated[int, Path(..., ge=1, description="订单ID")]
):
    """
    获取订单详细信息

    - 包含订单中所有商品详情
    - 显示价格计算明细
    - 显示订单状态和配送信息

    示例: GET /orders/1/details
    """
    if order_id not in orders_db:
        raise HTTPException(
            status_code=404,
            detail=f"Order {order_id} not found"
        )

    return orders_db[order_id]


# ==================== 练习 7: 数据验证综合练习 ====================

class Category(str, Enum):
    """商品分类枚举"""
    ELECTRONICS = "electronics"
    CLOTHING = "clothing"
    BOOKS = "books"
    HOME_GARDEN = "home_garden"
    SPORTS = "sports"
    TOYS = "toys"

class Product(BaseModel):
    """完整的商品模型 - 综合验证示例"""
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="商品名称",
        examples=["iPhone 14 Pro"]
    )
    description: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="商品描述"
    )
    price: float = Field(
        ...,
        gt=0,
        le=999999.99,
        description="商品价格",
        examples=[999.99]
    )
    category: Category = Field(
        ...,
        description="商品分类"
    )
    sku: str = Field(
        ...,
        pattern=r'^[A-Z]{3}\d{6}$',
        description="商品SKU，格式：3个大写字母+6位数字",
        examples=["ABC123456"]
    )
    weight: float = Field(
        ...,
        gt=0,
        le=1000,
        description="商品重量（千克）"
    )
    dimensions: dict[str, float] = Field(
        ...,
        description="商品尺寸 (length, width, height in cm)"
    )
    tags: list[str] = Field(
        default=[],
        max_length=10,
        description="商品标签"
    )
    in_stock: bool = Field(
        default=True,
        description="是否有库存"
    )
    stock_quantity: int = Field(
        default=0,
        ge=0,
        le=10000,
        description="库存数量"
    )

    @field_validator('dimensions')
    @classmethod
    def validate_dimensions(cls, v):
        required_keys = {'length', 'width', 'height'}
        if not isinstance(v, dict):
            raise ValueError('dimensions must be a dictionary')
        if not required_keys.issubset(v.keys()):
            raise ValueError(f'dimensions must contain keys: {required_keys}')
        for key, value in v.items():
            if key in required_keys and (not isinstance(value, (int, float)) or value <= 0):
                raise ValueError(f'{key} must be a positive number')
        return v

    @field_validator('stock_quantity')
    @classmethod
    def validate_stock_consistency(cls, v, info):
        # 注意：在 Pydantic v2 中，我们需要从 info.data 获取其他字段的值
        if hasattr(info, 'data') and 'in_stock' in info.data:
            in_stock = info.data['in_stock']
            if in_stock and v == 0:
                raise ValueError('如果商品有库存，库存数量必须大于0')
            if not in_stock and v > 0:
                raise ValueError('如果商品无库存，库存数量应该为0')
        return v

class ProductResponse(BaseModel):
    """商品创建响应模型"""
    id: int
    name: str
    description: str
    price: float
    category: Category
    sku: str
    weight: float
    dimensions: dict[str, float]
    tags: list[str]
    in_stock: bool
    stock_quantity: int
    created_at: str
    estimated_shipping_cost: float

# 模拟商品数据库
products_db = {}
product_id_counter = 1

@app.post("/api/v1/products", response_model=ProductResponse, status_code=201)
async def create_product_v1(product: Product):
    """
    创建商品 - V1 API（综合验证示例）

    - SKU 格式验证：3个大写字母 + 6位数字
    - 尺寸验证：必须包含长宽高
    - 库存一致性验证
    - 自动计算预估运费

    示例请求:
    ```json
    {
        "name": "iPhone 14 Pro",
        "description": "最新的 iPhone 14 Pro，配备 A16 仿生芯片",
        "price": 7999.99,
        "category": "electronics",
        "sku": "IPH123456",
        "weight": 0.206,
        "dimensions": {
            "length": 15.7,
            "width": 7.65,
            "height": 0.79
        },
        "tags": ["smartphone", "apple", "premium"],
        "in_stock": true,
        "stock_quantity": 50
    }
    ```
    """
    global product_id_counter

    # 检查 SKU 是否已存在
    if any(p.sku == product.sku for p in products_db.values()):
        raise HTTPException(
            status_code=400,
            detail=f"SKU '{product.sku}' already exists"
        )

    # 计算预估运费（基于重量和尺寸的简单算法）
    volume = product.dimensions['length'] * product.dimensions['width'] * product.dimensions['height']
    estimated_shipping_cost = round(max(product.weight * 10, volume * 0.001, 5.0), 2)

    product_response = ProductResponse(
        id=product_id_counter,
        name=product.name,
        description=product.description,
        price=product.price,
        category=product.category,
        sku=product.sku,
        weight=product.weight,
        dimensions=product.dimensions,
        tags=product.tags,
        in_stock=product.in_stock,
        stock_quantity=product.stock_quantity,
        created_at=datetime.now().isoformat(),
        estimated_shipping_cost=estimated_shipping_cost
    )

    products_db[product_id_counter] = product_response
    product_id_counter += 1

    return product_response


# ==================== 启动服务器 ====================
"""
运行方式1 (学习推荐):
    python3 基础概念/day2-exercises.py

运行方式2 (开发推荐):
    uvicorn 基础概念.day2-exercises:app --reload --port 8000

区别:
- 方式1: 简单直接，适合学习，但修改代码后需手动重启
- 方式2: 支持热重载，修改代码自动生效，适合开发

访问: http://localhost:8000/docs 查看API文档
"""
if __name__ == "__main__":
    import uvicorn
    # 使用 reload=False 避免警告信息
    # 如需热重载功能，请使用上面的"运行方式2"
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
