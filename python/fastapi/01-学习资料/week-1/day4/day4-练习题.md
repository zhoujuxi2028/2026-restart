# Day 4: 实践练习 - 路由与错误处理

## 练习说明
- 请在 `day4-exercises.py` 文件中完成以下练习
- 每个练习都是独立的功能模块
- 完成后可以运行服务器并使用 `/docs` 测试
- 参考答案在 `day4-solutions.py` 文件中

---

## 练习 1: 商品管理路由器 (基础) ⭐

**需求：**
创建一个商品管理模块，要求：

1. 创建 `ProductRouter`，使用前缀 `/products` 和标签 `["products"]`
2. 实现以下端点：
   - `GET /products/` - 获取所有商品（返回列表）
   - `GET /products/{product_id}` - 获取单个商品
   - `POST /products/` - 创建商品（返回 201）
   - `DELETE /products/{product_id}` - 删除商品（返回 204）

3. 如果商品不存在，抛出 404 错误

**数据模型：**
```python
class Product(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
```

**提示：**
- 使用字典模拟数据库：`products_db = {}`
- 使用全局计数器生成 ID
- 使用 `HTTPException` 抛出错误

**测试命令：**
```bash
# 创建商品
curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "stock": 10}'

# 获取所有商品
curl "http://localhost:8000/products/"

# 获取单个商品
curl "http://localhost:8000/products/1"

# 删除商品
curl -X DELETE "http://localhost:8000/products/1"

# 获取不存在的商品（应该返回 404）
curl "http://localhost:8000/products/999"
```

---

## 练习 2: 自定义异常处理 (中等) ⭐⭐

**需求：**
为练习 1 添加自定义异常处理：

1. 定义自定义异常类：
   - `ProductNotFoundError(product_id)` - 商品未找到
   - `InsufficientStockError(product_id, available, requested)` - 库存不足

2. 注册异常处理器，返回友好的错误信息：
   ```json
   {
     "error": "product_not_found",
     "message": "Product 123 not found",
     "product_id": 123
   }
   ```

3. 添加 `POST /products/{product_id}/purchase` 端点：
   - 购买商品，减少库存
   - 如果库存不足，抛出 `InsufficientStockError`

**测试场景：**
```bash
# 创建商品（库存 5）
curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse", "price": 29.99, "stock": 5}'

# 购买 3 个（应该成功）
curl -X POST "http://localhost:8000/products/1/purchase?quantity=3"

# 再购买 5 个（应该失败 - 库存不足）
curl -X POST "http://localhost:8000/products/1/purchase?quantity=5"
```

---

## 练习 3: 用户认证路由 (中等) ⭐⭐

**需求：**
创建简单的用户认证系统：

1. 定义数据模型：
   ```python
   class UserLogin(BaseModel):
       username: str
       password: str

   class Token(BaseModel):
       access_token: str
       token_type: str = "bearer"
   ```

2. 创建 `AuthRouter`（前缀 `/auth`）：
   - `POST /auth/register` - 用户注册
     - 检查用户名是否已存在
     - 如果存在，抛出 409 Conflict 错误
   - `POST /auth/login` - 用户登录
     - 验证用户名和密码
     - 成功返回模拟 token（可以用 `username_token` 作为 token）
     - 失败返回 401 Unauthorized

3. 定义自定义异常：
   - `UsernameExistsError(username)`
   - `InvalidCredentialsError()`

**提示：**
- 实际项目中应该加密密码，这里为了简化直接存储明文
- Token 可以简单地使用 f"{username}_token_12345" 格式

**测试：**
```bash
# 注册用户
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "password123"}'

# 重复注册（应该失败）
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "password123"}'

# 登录成功
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "password123"}'

# 登录失败（错误密码）
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "wrong"}'
```

---

## 练习 4: 订单管理系统 (困难) ⭐⭐⭐

**需求：**
创建一个完整的订单管理系统，整合商品和订单：

1. **数据模型：**
   ```python
   class OrderItem(BaseModel):
       product_id: int
       quantity: int = Field(..., gt=0)

   class OrderCreate(BaseModel):
       customer_name: str = Field(..., min_length=1)
       items: List[OrderItem] = Field(..., min_length=1)

   class OrderResponse(BaseModel):
       id: int
       customer_name: str
       items: List[OrderItem]
       total_amount: float
       status: str  # "pending", "completed", "cancelled"
       created_at: str
   ```

2. **创建 `OrderRouter`（前缀 `/orders`）：**
   - `POST /orders/` - 创建订单
     - 验证所有商品是否存在
     - 验证库存是否充足
     - 计算总金额
     - 减少商品库存
     - 返回 201 Created
   - `GET /orders/` - 获取所有订单
   - `GET /orders/{order_id}` - 获取单个订单
   - `PATCH /orders/{order_id}/cancel` - 取消订单
     - 恢复商品库存
     - 状态改为 "cancelled"

3. **自定义异常：**
   - `OrderNotFoundError(order_id)`
   - `OrderAlreadyCancelledError(order_id)`

4. **业务逻辑验证：**
   - 订单中的商品必须存在
   - 库存必须充足
   - 已取消的订单不能再次取消

**测试流程：**
```bash
# 1. 创建商品
curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "stock": 10}'

curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse", "price": 29.99, "stock": 20}'

# 2. 创建订单
curl -X POST "http://localhost:8000/orders/" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 2, "quantity": 3}
    ]
  }'

# 3. 查看订单
curl "http://localhost:8000/orders/1"

# 4. 取消订单
curl -X PATCH "http://localhost:8000/orders/1/cancel"

# 5. 再次取消（应该失败）
curl -X PATCH "http://localhost:8000/orders/1/cancel"
```

---

## 练习 5: API 版本控制 (挑战) ⭐⭐⭐⭐

**需求：**
实现 API 版本控制：

1. **创建两个版本的 API：**
   - v1: 简单的用户信息（username, email）
   - v2: 扩展的用户信息（username, email, full_name, avatar_url）

2. **路由结构：**
   ```
   /api/v1/users/
   /api/v2/users/
   ```

3. **实现要求：**
   - 创建 `api_v1_router` 和 `api_v2_router`
   - v1 和 v2 使用不同的响应模型
   - 两个版本的数据可以共享同一个数据库

4. **数据模型：**
   ```python
   # V1 模型
   class UserV1Response(BaseModel):
       id: int
       username: str
       email: str

   # V2 模型
   class UserV2Response(BaseModel):
       id: int
       username: str
       email: str
       full_name: str | None = None
       avatar_url: str | None = None
   ```

**测试：**
```bash
# V1 API - 创建用户
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@example.com"}'

# V2 API - 创建用户（包含更多字段）
curl -X POST "http://localhost:8000/api/v2/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane",
    "email": "jane@example.com",
    "full_name": "Jane Smith",
    "avatar_url": "https://example.com/avatar.jpg"
  }'

# V1 获取用户（只返回基础字段）
curl "http://localhost:8000/api/v1/users/1"

# V2 获取用户（返回所有字段）
curl "http://localhost:8000/api/v2/users/1"
```

---

## 练习 6: 全局错误处理 (挑战) ⭐⭐⭐⭐

**需求：**
实现统一的错误响应格式：

1. **标准错误响应格式：**
   ```json
   {
     "success": false,
     "error": {
       "code": "PRODUCT_NOT_FOUND",
       "message": "Product 123 not found",
       "details": {
         "product_id": 123
       }
     },
     "timestamp": "2024-01-26T10:30:00",
     "path": "/products/123"
   }
   ```

2. **实现全局异常处理器：**
   - HTTPException 处理器
   - RequestValidationError 处理器（422 错误）
   - 通用 Exception 处理器（500 错误）

3. **要求：**
   - 所有错误都返回统一格式
   - 包含时间戳和请求路径
   - 验证错误提供详细的字段信息
   - 生产环境隐藏详细的系统错误信息

**提示：**
```python
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from datetime import datetime

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # 实现统一的验证错误响应
    pass
```

---

## 挑战任务：博客 API (综合) 🏆

**需求：**
创建一个完整的博客 API，整合所有今天学到的知识：

1. **功能模块：**
   - 用户管理（注册、登录）
   - 文章管理（CRUD）
   - 评论管理（CRUD）
   - 分类管理（CRUD）

2. **路由组织：**
   ```
   /api/v1/
     /auth/register
     /auth/login
     /posts/
     /posts/{post_id}
     /posts/{post_id}/comments
     /categories/
   ```

3. **要求：**
   - 使用 APIRouter 组织路由
   - 实现自定义异常处理
   - 使用正确的 HTTP 状态码
   - 设计合理的响应模型
   - 实现基本的业务逻辑验证

4. **业务规则：**
   - 只有文章作者可以编辑/删除文章
   - 评论必须关联到存在的文章
   - 文章必须属于一个分类
   - 分类下有文章时不能删除

---

## 评分标准

### 基础分（60分）
- [ ] 完成练习 1-3
- [ ] 正确使用 APIRouter
- [ ] 正确使用 HTTP 状态码
- [ ] 基本的错误处理

### 进阶分（80分）
- [ ] 完成练习 4-5
- [ ] 自定义异常处理
- [ ] 合理的数据模型设计
- [ ] 业务逻辑验证

### 高级分（100分）
- [ ] 完成练习 6
- [ ] 统一错误响应格式
- [ ] 完整的 API 文档
- [ ] 代码组织清晰

### 挑战分（120分）
- [ ] 完成挑战任务
- [ ] 项目结构合理
- [ ] 完整的业务逻辑
- [ ] 良好的代码质量

---

## 学习建议

1. **循序渐进**：先完成基础练习，再挑战困难题目
2. **测试驱动**：每完成一个功能就测试
3. **查阅文档**：遇到问题查看 FastAPI 官方文档
4. **代码复用**：后面的练习可以复用前面的代码
5. **思考设计**：不只是实现功能，更要思考为什么这样设计

---

## 下一步

完成练习后：
1. 对照参考答案检查你的实现
2. 思考是否有更好的实现方式
3. 尝试添加更多功能
4. 准备学习 Day 5 的依赖注入系统

加油！💪
