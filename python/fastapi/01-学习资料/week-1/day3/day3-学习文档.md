# Day 3: Pydantic 数据验证与类型系统进阶

## 学习目标
- 掌握 Pydantic 模型的高级特性
- 学会使用嵌套模型处理复杂数据
- 理解自定义验证器的使用
- 掌握数据类型转换和序列化

---

## 1. Pydantic 模型进阶

### 1.1 模型配置

```python
from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,  # 自动去除字符串空白
        str_min_length=1,           # 字符串最小长度
        validate_assignment=True,    # 赋值时也进行验证
        from_attributes=True,        # 允许从 ORM 对象创建
        json_schema_extra={          # 添加 JSON Schema 示例
            "examples": [
                {
                    "name": "John Doe",
                    "email": "john@example.com"
                }
            ]
        }
    )

    name: str
    email: str
```

### 1.2 字段别名

```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(..., alias="item_name")
    price: float = Field(..., alias="item_price")

    model_config = ConfigDict(populate_by_name=True)  # 允许使用原名或别名

# 使用别名
item = Item(item_name="Laptop", item_price=999.99)
print(item.name)  # "Laptop"

# 如果设置了 populate_by_name=True，也可以使用原名
item2 = Item(name="Mouse", price=29.99)
```

### 1.3 排除和包含字段

```python
class User(BaseModel):
    username: str
    password: str
    email: str
    full_name: str | None = None

user = User(
    username="johndoe",
    password="secret",
    email="john@example.com"
)

# 排除密码字段
print(user.model_dump(exclude={"password"}))
# {'username': 'johndoe', 'email': 'john@example.com', 'full_name': None}

# 只包含特定字段
print(user.model_dump(include={"username", "email"}))
# {'username': 'johndoe', 'email': 'john@example.com'}

# 排除未设置的字段
print(user.model_dump(exclude_unset=True))
# {'username': 'johndoe', 'password': 'secret', 'email': 'john@example.com'}

# 排除 None 值
print(user.model_dump(exclude_none=True))
# {'username': 'johndoe', 'password': 'secret', 'email': 'john@example.com'}
```

---

## 2. 嵌套模型

### 2.1 基础嵌套

```python
from pydantic import BaseModel

class Address(BaseModel):
    street: str
    city: str
    country: str
    postal_code: str

class User(BaseModel):
    name: str
    email: str
    address: Address  # 嵌套模型

# 使用
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "country": "USA",
        "postal_code": "10001"
    }
}

user = User(**user_data)
print(user.address.city)  # "New York"
```

### 2.2 嵌套列表

```python
class Item(BaseModel):
    name: str
    price: float

class Order(BaseModel):
    order_id: int
    customer_name: str
    items: list[Item]  # 模型列表

# 使用
order_data = {
    "order_id": 1,
    "customer_name": "John",
    "items": [
        {"name": "Laptop", "price": 999.99},
        {"name": "Mouse", "price": 29.99}
    ]
}

order = Order(**order_data)
for item in order.items:
    print(f"{item.name}: ${item.price}")
```

### 2.3 深层嵌套

```python
class Tag(BaseModel):
    name: str
    color: str

class Image(BaseModel):
    url: str
    width: int
    height: int

class Product(BaseModel):
    name: str
    price: float
    tags: list[Tag]
    images: list[Image]

class OrderItem(BaseModel):
    product: Product
    quantity: int
    subtotal: float

class Order(BaseModel):
    order_id: int
    items: list[OrderItem]
    total: float
```

---

## 3. 自定义验证器

### 3.1 字段验证器 (field_validator)

```python
from pydantic import BaseModel, field_validator, ValidationError

class User(BaseModel):
    username: str
    password: str
    age: int

    @field_validator('username')
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        """用户名必须是字母数字"""
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        """密码强度检查"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v

    @field_validator('age')
    @classmethod
    def check_age(cls, v: int) -> int:
        """年龄检查"""
        if v < 0:
            raise ValueError('Age cannot be negative')
        if v > 150:
            raise ValueError('Age seems unrealistic')
        return v

# 测试
try:
    user = User(username="john_doe", password="weak", age=25)
except ValidationError as e:
    print(e)
```

### 3.2 模型验证器 (model_validator)

```python
from pydantic import BaseModel, model_validator

class DateRange(BaseModel):
    start_date: str
    end_date: str

    @model_validator(mode='after')
    def check_dates(self) -> 'DateRange':
        """验证结束日期必须大于开始日期"""
        if self.end_date < self.start_date:
            raise ValueError('end_date must be after start_date')
        return self

class User(BaseModel):
    password: str
    confirm_password: str

    @model_validator(mode='after')
    def passwords_match(self) -> 'User':
        """验证两次密码输入一致"""
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        return self
```

### 3.3 验证多个字段

```python
class Discount(BaseModel):
    percentage: float | None = None
    fixed_amount: float | None = None

    @model_validator(mode='after')
    def check_discount_type(self) -> 'Discount':
        """必须提供百分比或固定金额之一（但不能同时）"""
        if self.percentage is None and self.fixed_amount is None:
            raise ValueError('Must provide either percentage or fixed_amount')
        if self.percentage is not None and self.fixed_amount is not None:
            raise ValueError('Cannot provide both percentage and fixed_amount')
        return self
```

---

## 4. 数据类型转换

### 4.1 自动类型转换

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    quantity: int
    is_available: bool

# Pydantic 会自动转换类型
item = Item(
    name="Laptop",
    price="999.99",      # 字符串转浮点数
    quantity="5",        # 字符串转整数
    is_available="true"  # 字符串转布尔值
)

print(item.price)      # 999.99 (float)
print(item.quantity)   # 5 (int)
print(item.is_available)  # True (bool)
```

### 4.2 日期时间处理

```python
from datetime import datetime, date
from pydantic import BaseModel

class Event(BaseModel):
    title: str
    event_date: date
    created_at: datetime

# 多种格式都可以解析
event = Event(
    title="Conference",
    event_date="2024-12-25",
    created_at="2024-01-26T10:30:00"
)

print(type(event.event_date))   # <class 'datetime.date'>
print(type(event.created_at))   # <class 'datetime.datetime'>
```

### 4.3 枚举类型

```python
from enum import Enum
from pydantic import BaseModel

class Status(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Application(BaseModel):
    id: int
    status: Status

# 使用
app1 = Application(id=1, status="pending")      # 字符串自动转换
app2 = Application(id=2, status=Status.APPROVED)  # 直接使用枚举

print(app1.status)        # Status.PENDING
print(app1.status.value)  # "pending"
```

---

## 5. 序列化与反序列化

### 5.1 导出为字典/JSON

```python
from pydantic import BaseModel
from datetime import datetime

class User(BaseModel):
    id: int
    username: str
    created_at: datetime

user = User(id=1, username="john", created_at=datetime.now())

# 导出为字典
user_dict = user.model_dump()
print(user_dict)

# 导出为 JSON
user_json = user.model_dump_json()
print(user_json)

# 导出为 JSON（格式化）
user_json_pretty = user.model_dump_json(indent=2)
print(user_json_pretty)
```

### 5.2 从字典/JSON 创建

```python
# 从字典创建
user_data = {"id": 1, "username": "john", "created_at": "2024-01-26T10:00:00"}
user = User(**user_data)

# 从 JSON 字符串创建
json_str = '{"id": 1, "username": "john", "created_at": "2024-01-26T10:00:00"}'
user = User.model_validate_json(json_str)
```

### 5.3 自定义序列化

```python
from pydantic import BaseModel, field_serializer

class User(BaseModel):
    username: str
    email: str
    password: str

    @field_serializer('password')
    def hide_password(self, password: str) -> str:
        """序列化时隐藏密码"""
        return "***HIDDEN***"

user = User(username="john", email="john@example.com", password="secret123")
print(user.model_dump())
# {'username': 'john', 'email': 'john@example.com', 'password': '***HIDDEN***'}
```

---

## 6. 实战示例：完整的用户系统

```python
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Annotated
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class Address(BaseModel):
    street: str = Field(..., min_length=1, max_length=200)
    city: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=2, max_length=100)
    postal_code: str = Field(..., regex="^\d{5}(-\d{4})?$")

class UserProfile(BaseModel):
    bio: str | None = Field(None, max_length=500)
    avatar_url: str | None = None
    website: str | None = None

class UserCreate(BaseModel):
    """用户创建模型"""
    model_config = ConfigDict(str_strip_whitespace=True)

    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
        regex="^[a-zA-Z0-9_]+$"
    )
    email: str = Field(..., regex="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str
    full_name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=13, le=120)
    role: Role = Role.USER
    address: Address
    profile: UserProfile | None = None

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.lower()

    def model_post_init(self, __context) -> None:
        """模型创建后验证"""
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')

class UserResponse(BaseModel):
    """用户响应模型（不包含密码）"""
    id: int
    username: str
    email: str
    full_name: str
    age: int
    role: Role
    address: Address
    profile: UserProfile | None
    created_at: datetime
    is_active: bool

class UserUpdate(BaseModel):
    """用户更新模型（所有字段可选）"""
    full_name: str | None = Field(None, min_length=1, max_length=100)
    age: int | None = Field(None, ge=13, le=120)
    address: Address | None = None
    profile: UserProfile | None = None
```

---

## 7. FastAPI 集成示例

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

# 模拟数据库
users_db = {}
user_id_counter = 1

@app.post("/users/", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    """创建用户"""
    global user_id_counter

    # 检查用户名是否已存在
    if any(u["username"] == user.username for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Username already exists")

    # 创建用户
    user_data = user.model_dump(exclude={"confirm_password"})
    user_data["id"] = user_id_counter
    user_data["created_at"] = datetime.now()
    user_data["is_active"] = True

    users_db[user_id_counter] = user_data
    user_id_counter += 1

    return user_data

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """获取用户信息"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_update: UserUpdate):
    """更新用户信息"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    # 只更新提供的字段
    update_data = user_update.model_dump(exclude_unset=True)
    users_db[user_id].update(update_data)

    return users_db[user_id]
```

---

## 8. 重点总结

### ✅ 今天你学到了：

1. **Pydantic 模型配置**：使用 `model_config` 自定义行为
2. **嵌套模型**：处理复杂的数据结构
3. **自定义验证器**：`field_validator` 和 `model_validator`
4. **类型转换**：Pydantic 的自动类型转换机制
5. **序列化控制**：导出时控制字段的包含/排除
6. **实战应用**：构建完整的用户系统

### 📝 最佳实践：

- 使用嵌套模型而不是深层字典
- 为复杂验证编写自定义验证器
- 使用枚举类型限制可选值
- 响应模型排除敏感信息
- 利用 Pydantic 的自动类型转换
- 使用 `model_dump(exclude_unset=True)` 进行部分更新

### 🎯 关键概念：

- **验证 vs 序列化**：验证发生在输入时，序列化发生在输出时
- **模式继承**：可以继承基础模型来复用验证逻辑
- **类型安全**：Pydantic 提供完整的类型检查支持

---

## 9. 练习预告

在练习文件中，你将：
- 设计复杂的嵌套模型
- 编写自定义验证器
- 处理数据转换和序列化
- 构建完整的数据模型系统

准备好了吗？让我们开始练习！ 💪
