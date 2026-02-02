# Day 2: FastAPI 基础概念深入

## 学习目标
- 掌握路径参数的高级用法
- 理解查询参数的验证机制
- 学会使用 Pydantic 模型定义请求体
- 了解响应模型的定义和使用

---

## 1. 路径参数 (Path Parameters) 进阶

### 1.1 基础路径参数
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

### 1.2 路径参数验证
使用 `Path` 进行更详细的验证：

```python
from fastapi import FastAPI, Path
from typing import Annotated

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(
    item_id: Annotated[int, Path(
        title="The ID of the item to get",
        description="This is the item identifier",
        ge=1,  # greater than or equal to 1
        le=1000  # less than or equal to 1000
    )]
):
    return {"item_id": item_id}
```

**常用验证参数：**
- `ge`: greater than or equal (>=)
- `gt`: greater than (>)
- `le`: less than or equal (<=)
- `lt`: less than (<)
- `min_length`: 最小长度
- `max_length`: 最大长度
- `regex`: 正则表达式验证

### 1.3 多个路径参数
```python
@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
    user_id: int,
    item_id: str
):
    return {"user_id": user_id, "item_id": item_id}
```

---

## 2. 查询参数 (Query Parameters) 验证

### 2.1 基础查询参数
```python
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}
```

### 2.2 查询参数验证
```python
from fastapi import Query

@app.get("/items/")
async def read_items(
    q: Annotated[str | None, Query(
        title="Query string",
        description="Query string for the items to search",
        min_length=3,
        max_length=50,
        regex="^[a-zA-Z0-9]+$"
    )] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

### 2.3 必需的查询参数
```python
# 方式1：不提供默认值
@app.get("/items/")
async def read_items(q: str):
    return {"q": q}

# 方式2：使用 ... (Ellipsis)
@app.get("/items/")
async def read_items(
    q: Annotated[str, Query(min_length=3)] = ...
):
    return {"q": q}
```

### 2.4 查询参数列表
```python
@app.get("/items/")
async def read_items(
    q: Annotated[list[str] | None, Query()] = None
):
    return {"q": q}

# 访问: /items/?q=foo&q=bar
# 返回: {"q": ["foo", "bar"]}
```

---

## 3. 请求体 (Request Body) - Pydantic 模型

### 3.1 创建 Pydantic 模型
```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    return item
```

### 3.2 带验证的 Pydantic 模型
```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(
        ...,
        title="Item name",
        min_length=1,
        max_length=100
    )
    description: str | None = Field(
        None,
        title="Item description",
        max_length=500
    )
    price: float = Field(
        ...,
        gt=0,
        description="Price must be greater than zero"
    )
    tax: float | None = Field(
        None,
        ge=0,
        le=100
    )
    tags: list[str] = Field(
        default=[],
        max_length=5
    )

@app.post("/items/")
async def create_item(item: Item):
    item_dict = item.model_dump()
    if item.tax:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    return item_dict
```

### 3.3 请求体 + 路径参数 + 查询参数
```python
@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item,
    q: str | None = None
):
    result = {"item_id": item_id, **item.model_dump()}
    if q:
        result.update({"q": q})
    return result
```

---

## 4. 响应模型 (Response Model)

### 4.1 基础响应模型
```python
class ItemResponse(BaseModel):
    name: str
    price: float

@app.post("/items/", response_model=ItemResponse)
async def create_item(item: Item):
    # 即使返回更多字段，也只会返回 response_model 定义的字段
    return item
```

### 4.2 响应模型的高级用法
```python
class UserIn(BaseModel):
    username: str
    password: str
    email: str
    full_name: str | None = None

class UserOut(BaseModel):
    username: str
    email: str
    full_name: str | None = None

@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn):
    # password 不会在响应中返回
    return user
```

### 4.3 响应模型配置
```python
@app.get(
    "/items/{item_id}",
    response_model=Item,
    response_model_exclude_unset=True  # 排除未设置的字段
)
async def read_item(item_id: int):
    return {"name": "Foo", "price": 50.0}
    # tax 字段不会出现在响应中

# 其他配置选项：
# response_model_exclude_none=True  # 排除 None 值
# response_model_include={"name", "price"}  # 只包含指定字段
# response_model_exclude={"tax"}  # 排除指定字段
```

---

## 5. 完整示例

```python
from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field
from typing import Annotated

app = FastAPI()

# 模型定义
class Item(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    tax: float | None = Field(None, ge=0, le=100)
    tags: list[str] = []

class ItemResponse(BaseModel):
    id: int
    name: str
    price: float
    total_price: float

# API 端点
@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Day 2"}

@app.get("/items/{item_id}", response_model=ItemResponse)
async def read_item(
    item_id: Annotated[int, Path(ge=1, le=1000)],
    q: Annotated[str | None, Query(max_length=50)] = None
):
    base_item = {
        "id": item_id,
        "name": "Sample Item",
        "price": 29.99,
        "total_price": 29.99
    }
    if q:
        base_item["name"] = q
    return base_item

@app.post("/items/", response_model=ItemResponse, status_code=201)
async def create_item(item: Item):
    total_price = item.price + (item.tax or 0)
    return {
        "id": 1,
        "name": item.name,
        "price": item.price,
        "total_price": total_price
    }

@app.get("/search/")
async def search_items(
    q: Annotated[str, Query(min_length=3, max_length=50)],
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    tags: Annotated[list[str] | None, Query()] = None
):
    results = {
        "q": q,
        "skip": skip,
        "limit": limit,
        "tags": tags or []
    }
    return results
```

---

## 6. 重点总结

### ✅ 今天你学到了：
1. **路径参数验证**：使用 `Path` 添加约束条件
2. **查询参数验证**：使用 `Query` 进行复杂验证
3. **Pydantic 模型**：定义结构化的请求体和响应
4. **Field 验证**：为模型字段添加详细的验证规则
5. **响应模型**：控制 API 的输出格式和内容

### 📝 最佳实践：
- 总是为路径参数添加类型注解
- 使用 Pydantic 模型而不是字典来处理复杂数据
- 为 API 参数添加验证规则，提高数据质量
- 使用响应模型保护敏感数据（如密码）
- 使用 `Field` 添加描述信息，自动生成更好的 API 文档

### 🎯 下一步：
明天我们将学习 **Pydantic 模型的进阶用法**，包括嵌套模型、自定义验证器等。

---

## 7. 测试你的 API

启动服务器：
```bash
uvicorn main:app --reload
```

访问交互式文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

使用 curl 测试：
```bash
# GET 请求
curl http://localhost:8000/items/42?q=test

# POST 请求
curl -X POST http://localhost:8000/items/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "tax": 99.99}'

# 搜索
curl "http://localhost:8000/search/?q=phone&skip=0&limit=20&tags=electronics&tags=mobile"
```
