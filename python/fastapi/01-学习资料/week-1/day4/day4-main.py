"""
Day 4: 路由组织与错误处理 - 完整演示
这个文件展示了所有学习文档中的示例代码
"""

from fastapi import FastAPI, APIRouter, HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List, Optional
from datetime import datetime
from enum import Enum
from contextlib import asynccontextmanager
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== 创建应用 ====================

app = FastAPI(
    title="FastAPI Day 4 Demo",
    description="路由组织与错误处理完整示例",
    version="1.1.0"
)

# ==================== 示例 1: 基础 APIRouter ====================

print("\n" + "="*50)
print("示例 1: 基础 APIRouter")
print("="*50)

basic_router = APIRouter(prefix="/basic", tags=["basic"])


@basic_router.get("/items/")
async def get_items():
    """基础路由示例"""
    return {"message": "Get all items"}


@basic_router.get("/items/{item_id}")
async def get_item(item_id: int):
    """带参数的路由"""
    return {"item_id": item_id}


# ==================== 示例 2: 模块化路由 ====================

print("\n" + "="*50)
print("示例 2: 模块化路由组织")
print("="*50)

# 用户路由模块
users_router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "User not found"}}
)

users_db = {
    1: {"username": "john", "email": "john@example.com"},
    2: {"username": "jane", "email": "jane@example.com"}
}


@users_router.get("/")
async def list_users():
    """列出所有用户"""
    return {"users": list(users_db.values())}


@users_router.get("/{user_id}")
async def get_user(user_id: int):
    """获取单个用户"""
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    return users_db[user_id]


# 商品路由模块
products_router = APIRouter(
    prefix="/products",
    tags=["products"]
)

products_db = {
    1: {"name": "Laptop", "price": 999.99},
    2: {"name": "Mouse", "price": 29.99}
}


@products_router.get("/")
async def list_products():
    """列出所有商品"""
    return {"products": list(products_db.values())}


@products_router.get("/{product_id}")
async def get_product(product_id: int):
    """获取单个商品"""
    if product_id not in products_db:
        raise HTTPException(status_code=404, detail="Product not found")
    return products_db[product_id]


# ==================== 示例 3: HTTP 状态码 ====================

print("\n" + "="*50)
print("示例 3: HTTP 状态码使用")
print("="*50)

status_router = APIRouter(prefix="/status-demo", tags=["status-codes"])


class Item(BaseModel):
    name: str
    description: Optional[str] = None


items_store = {}


@status_router.get("/items/", status_code=status.HTTP_200_OK)
async def get_items_status():
    """GET 请求 - 200 OK"""
    return {"items": list(items_store.values())}


@status_router.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item_status(item: Item):
    """POST 请求 - 201 Created"""
    item_id = len(items_store) + 1
    items_store[item_id] = {"id": item_id, **item.model_dump()}
    return items_store[item_id]


@status_router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item_status(item_id: int):
    """DELETE 请求 - 204 No Content"""
    if item_id in items_store:
        del items_store[item_id]
    return None


# ==================== 示例 4: 自定义异常 ====================

print("\n" + "="*50)
print("示例 4: 自定义异常处理")
print("="*50)


class ItemNotFoundError(Exception):
    """商品未找到异常"""
    def __init__(self, item_id: int):
        self.item_id = item_id


class InsufficientBalanceError(Exception):
    """余额不足异常"""
    def __init__(self, balance: float, required: float):
        self.balance = balance
        self.required = required


class InvalidCredentialsError(Exception):
    """无效凭证异常"""
    pass


# 注册异常处理器
@app.exception_handler(ItemNotFoundError)
async def item_not_found_handler(request: Request, exc: ItemNotFoundError):
    logger.error(f"Item not found: {exc.item_id}")
    return JSONResponse(
        status_code=404,
        content={
            "error": "item_not_found",
            "message": f"Item {exc.item_id} not found",
            "item_id": exc.item_id
        }
    )


@app.exception_handler(InsufficientBalanceError)
async def insufficient_balance_handler(request: Request, exc: InsufficientBalanceError):
    logger.warning(f"Insufficient balance: {exc.balance} < {exc.required}")
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
        },
        headers={"WWW-Authenticate": "Bearer"}
    )


# 使用自定义异常的路由
exception_router = APIRouter(prefix="/exception-demo", tags=["exceptions"])

wallet_db = {
    1: {"user": "john", "balance": 100.0},
    2: {"user": "jane", "balance": 50.0}
}


@exception_router.get("/items/{item_id}")
async def get_item_with_exception(item_id: int):
    """演示 ItemNotFoundError"""
    if item_id not in items_store:
        raise ItemNotFoundError(item_id)
    return items_store[item_id]


@exception_router.post("/purchase/")
async def purchase_item(user_id: int, amount: float):
    """演示 InsufficientBalanceError"""
    if user_id not in wallet_db:
        raise HTTPException(status_code=404, detail="User not found")

    wallet = wallet_db[user_id]
    if wallet["balance"] < amount:
        raise InsufficientBalanceError(wallet["balance"], amount)

    wallet["balance"] -= amount
    return {
        "success": True,
        "user": wallet["user"],
        "new_balance": wallet["balance"],
        "amount_spent": amount
    }


@exception_router.post("/login/")
async def login(username: str, password: str):
    """演示 InvalidCredentialsError"""
    # 简化的验证逻辑
    if username != "admin" or password != "secret":
        raise InvalidCredentialsError()

    return {"access_token": "fake-token", "token_type": "bearer"}


# ==================== 示例 5: 响应模型 ====================

print("\n" + "="*50)
print("示例 5: 响应模型")
print("="*50)


class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"


class UserInDB(BaseModel):
    """数据库中的用户（包含密码）"""
    id: int
    username: str
    email: str
    password: str
    role: Role
    is_active: bool


class UserResponse(BaseModel):
    """API 响应（不包含密码）"""
    id: int
    username: str
    email: str
    is_active: bool


class UserPublicResponse(BaseModel):
    """公开信息（最少字段）"""
    id: int
    username: str


response_router = APIRouter(prefix="/response-demo", tags=["responses"])

full_users_db = {
    1: UserInDB(
        id=1,
        username="john",
        email="john@example.com",
        password="secret123",
        role=Role.ADMIN,
        is_active=True
    )
}


@response_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_safe(user_id: int):
    """自动过滤敏感字段（密码、角色）"""
    if user_id not in full_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return full_users_db[user_id]


@response_router.get("/users/{user_id}/public", response_model=UserPublicResponse)
async def get_user_public(user_id: int):
    """只返回公开信息"""
    if user_id not in full_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return full_users_db[user_id]


class ItemWithOptionals(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None


@response_router.post(
    "/items/",
    response_model=ItemWithOptionals,
    response_model_exclude_unset=True
)
async def create_item_exclude_unset(item: ItemWithOptionals):
    """只返回设置过的字段"""
    return item


# ==================== 示例 6: 完整的资源管理示例 ====================

print("\n" + "="*50)
print("示例 6: 完整的资源管理")
print("="*50)


class BookBase(BaseModel):
    """图书基础模型"""
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=100)
    isbn: str = Field(..., pattern=r"^\d{13}$")
    price: float = Field(..., gt=0)


class BookCreate(BookBase):
    """创建图书模型"""
    stock: int = Field(..., ge=0)


class BookUpdate(BaseModel):
    """更新图书模型（所有字段可选）"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    author: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)


class BookResponse(BookBase):
    """图书响应模型"""
    id: int
    stock: int
    created_at: str
    updated_at: str


class BookNotFoundError(Exception):
    def __init__(self, book_id: int):
        self.book_id = book_id


class ISBNExistsError(Exception):
    def __init__(self, isbn: str):
        self.isbn = isbn


@app.exception_handler(BookNotFoundError)
async def book_not_found_handler(request: Request, exc: BookNotFoundError):
    return JSONResponse(
        status_code=404,
        content={
            "error": "book_not_found",
            "message": f"Book {exc.book_id} not found"
        }
    )


@app.exception_handler(ISBNExistsError)
async def isbn_exists_handler(request: Request, exc: ISBNExistsError):
    return JSONResponse(
        status_code=409,
        content={
            "error": "isbn_exists",
            "message": f"Book with ISBN {exc.isbn} already exists"
        }
    )


books_router = APIRouter(prefix="/books", tags=["books"])

books_db: dict[int, BookResponse] = {}
book_id_counter = 1


@books_router.post("/", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(book: BookCreate):
    """创建图书"""
    global book_id_counter

    # 检查 ISBN 是否已存在
    if any(b.isbn == book.isbn for b in books_db.values()):
        raise ISBNExistsError(book.isbn)

    now = datetime.now().isoformat()
    book_response = BookResponse(
        id=book_id_counter,
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        price=book.price,
        stock=book.stock,
        created_at=now,
        updated_at=now
    )

    books_db[book_id_counter] = book_response
    book_id_counter += 1

    logger.info(f"Created book: {book_response.title}")
    return book_response


@books_router.get("/", response_model=List[BookResponse])
async def list_books(
    skip: int = 0,
    limit: int = 10,
    author: Optional[str] = None
):
    """获取图书列表"""
    books_list = list(books_db.values())

    # 按作者过滤
    if author:
        books_list = [b for b in books_list if author.lower() in b.author.lower()]

    return books_list[skip:skip + limit]


@books_router.get("/{book_id}", response_model=BookResponse)
async def get_book(book_id: int):
    """获取单本图书"""
    if book_id not in books_db:
        raise BookNotFoundError(book_id)
    return books_db[book_id]


@books_router.patch("/{book_id}", response_model=BookResponse)
async def update_book(book_id: int, book_update: BookUpdate):
    """更新图书信息"""
    if book_id not in books_db:
        raise BookNotFoundError(book_id)

    book = books_db[book_id]
    update_data = book_update.model_dump(exclude_unset=True)

    # 更新字段
    for field, value in update_data.items():
        setattr(book, field, value)

    book.updated_at = datetime.now().isoformat()

    logger.info(f"Updated book {book_id}: {update_data}")
    return book


@books_router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int):
    """删除图书"""
    if book_id not in books_db:
        raise BookNotFoundError(book_id)

    del books_db[book_id]
    logger.info(f"Deleted book {book_id}")
    return None


# ==================== 示例 7: 全局异常处理 ====================

print("\n" + "="*50)
print("示例 7: 全局异常处理")
print("="*50)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """处理验证错误"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })

    logger.error(f"Validation error: {errors}")

    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "message": "Request validation failed",
            "details": errors,
            "timestamp": datetime.now().isoformat(),
            "path": str(request.url.path)
        }
    )


# ==================== 注册所有路由器 ====================

app.include_router(basic_router)
app.include_router(users_router)
app.include_router(products_router)
app.include_router(status_router)
app.include_router(exception_router)
app.include_router(response_router)
app.include_router(books_router)

# ==================== 根路由 ====================


@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "FastAPI Day 4 完整演示",
        "version": "1.0.0",
        "examples": {
            "基础路由": "/basic",
            "用户管理": "/users",
            "商品管理": "/products",
            "状态码演示": "/status-demo",
            "异常处理": "/exception-demo",
            "响应模型": "/response-demo",
            "图书管理": "/books"
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json"
        }
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "stats": {
            "users": len(users_db),
            "products": len(products_db),
            "books": len(books_db),
            "items": len(items_store)
        }
    }


# ==================== 测试数据初始化 ====================

def initialize_test_data():
    """初始化测试数据"""
    logger.info("Initializing test data...")

    # 初始化一些图书数据
    global book_id_counter

    test_books = [
        BookCreate(
            title="Python 编程：从入门到实践",
            author="Eric Matthes",
            isbn="9787115428028",
            price=89.0,
            stock=50
        ),
        BookCreate(
            title="流畅的 Python",
            author="Luciano Ramalho",
            isbn="9787115454157",
            price=139.0,
            stock=30
        ),
        BookCreate(
            title="FastAPI 实战",
            author="张三",
            isbn="9781234567890",
            price=79.0,
            stock=100
        )
    ]

    for book in test_books:
        now = datetime.now().isoformat()
        book_response = BookResponse(
            id=book_id_counter,
            title=book.title,
            author=book.author,
            isbn=book.isbn,
            price=book.price,
            stock=book.stock,
            created_at=now,
            updated_at=now
        )
        books_db[book_id_counter] = book_response
        book_id_counter += 1

    logger.info(f"Initialized {len(books_db)} books")

# 应用启动时初始化数据
@app.on_event("startup")
async def startup_event():
    """应用启动事件"""
    initialize_test_data()

@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭事件"""
    logger.info("Application shutting down...")


# ==================== 运行说明 ====================
"""
运行方式：
uvicorn day4-main:app --reload

测试命令：

1. 基础路由：
   curl http://localhost:8000/basic/items/
   curl http://localhost:8000/basic/items/123

2. 用户管理：
   curl http://localhost:8000/users/
   curl http://localhost:8000/users/1
   curl http://localhost:8000/users/999  # 404 错误

3. 状态码示例：
   curl -X POST http://localhost:8000/status-demo/items/ \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Item"}'

4. 异常处理：
   curl http://localhost:8000/exception-demo/items/999  # ItemNotFoundError
   curl -X POST "http://localhost:8000/exception-demo/purchase/?user_id=1&amount=200"  # InsufficientBalanceError
   curl -X POST "http://localhost:8000/exception-demo/login/?username=wrong&password=wrong"  # InvalidCredentialsError

5. 响应模型：
   curl http://localhost:8000/response-demo/users/1  # 不包含密码
   curl http://localhost:8000/response-demo/users/1/public  # 只有公开信息

6. 图书管理（完整 CRUD）：
   # 获取所有图书
   curl http://localhost:8000/books/

   # 创建图书
   curl -X POST http://localhost:8000/books/ \
     -H "Content-Type: application/json" \
     -d '{
       "title": "新书",
       "author": "作者",
       "isbn": "1234567890123",
       "price": 59.99,
       "stock": 20
     }'

   # 获取单本图书
   curl http://localhost:8000/books/1

   # 更新图书
   curl -X PATCH http://localhost:8000/books/1 \
     -H "Content-Type: application/json" \
     -d '{"price": 69.99, "stock": 15}'

   # 删除图书
   curl -X DELETE http://localhost:8000/books/1

7. 验证错误测试：
   curl -X POST http://localhost:8000/books/ \
     -H "Content-Type: application/json" \
     -d '{"title": "", "author": "Test"}'  # 验证错误

访问文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json
"""

"""
运行方式1 (学习推荐):
    python3 路由处理/day4-main.py

运行方式2 (开发推荐):
    uvicorn 路由处理.day4-main:app --reload --port 8000
"""

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("启动 FastAPI Day 4 演示服务器")
    print("="*50)
    print("访问 http://localhost:8000/docs 查看交互式文档")
    print("💡 提示: 如需热重载，使用 uvicorn 命令")
    print("="*50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
