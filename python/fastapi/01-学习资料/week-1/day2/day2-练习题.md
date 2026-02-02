# Day 2: 实践练习

## 练习说明
- 请在 `day2-exercises.py` 文件中完成以下练习
- 每个练习都是独立的 API 端点
- 完成后可以运行服务器并在浏览器中测试
- 参考答案在 `day2-solutions.py` 文件中

---

## 练习 1: 用户信息查询 (基础)

**需求：**
创建一个 GET 端点 `/users/{user_id}`，要求：
- `user_id` 必须是整数，范围在 1-10000 之间
- 可选的查询参数 `include_email`（布尔值，默认 False）
- 返回用户信息（模拟数据即可）

**提示：**
- 使用 `Path` 验证路径参数
- 使用类型注解定义查询参数

**测试：**
```bash
# 应该成功
GET /users/123
GET /users/123?include_email=true

# 应该失败（验证错误）
GET /users/0
GET /users/10001
```

---

## 练习 2: 商品搜索 (中等)

**需求：**
创建一个 GET 端点 `/products/search`，要求：
- 必需的查询参数 `keyword`（字符串，3-50 字符）
- 可选参数 `min_price`（浮点数，>= 0）
- 可选参数 `max_price`（浮点数，>= 0）
- 可选参数 `category`（字符串列表）
- 可选参数 `sort_by`（字符串，只能是 "price" 或 "name"，默认 "name"）

**提示：**
- 使用 `Query` 添加验证规则
- 注意必需参数和可选参数的区别
- 列表参数使用 `list[str]`

**测试：**
```bash
# 基础搜索
GET /products/search?keyword=phone

# 复杂搜索
GET /products/search?keyword=laptop&min_price=500&max_price=2000&category=electronics&category=computers&sort_by=price

# 应该失败
GET /products/search?keyword=ab  # 太短
GET /products/search  # 缺少必需参数
```

---

## 练习 3: 创建博客文章 (中等)

**需求：**
创建一个 POST 端点 `/posts/`，要求：
1. 定义 `Post` Pydantic 模型，包含：
   - `title`: 字符串，1-200 字符，必需
   - `content`: 字符串，10-10000 字符，必需
   - `author`: 字符串，1-100 字符，必需
   - `tags`: 字符串列表，可选，最多 10 个标签
   - `published`: 布尔值，默认 False

2. 定义 `PostResponse` 模型，包含：
   - `id`: 整数
   - `title`: 字符串
   - `author`: 字符串
   - `published`: 布尔值
   - `created_at`: 字符串（模拟时间戳）

3. 端点返回 `PostResponse` 模型

**提示：**
- 使用 `Field` 添加验证规则
- 使用 `response_model` 参数
- 可以使用 `datetime.now()` 生成时间戳

**测试数据：**
```json
{
  "title": "FastAPI 学习笔记",
  "content": "今天学习了 FastAPI 的路径参数和查询参数验证...",
  "author": "张三",
  "tags": ["FastAPI", "Python", "Web开发"],
  "published": true
}
```

---

## 练习 4: 更新商品信息 (中等)

**需求：**
创建一个 PUT 端点 `/items/{item_id}`，要求：
1. 路径参数 `item_id`（整数，>= 1）
2. 定义 `ItemUpdate` 模型：
   - `name`: 可选，1-100 字符
   - `price`: 可选，> 0
   - `description`: 可选，最多 500 字符
   - `stock`: 可选，>= 0
   - `discount`: 可选，0-100 的浮点数（折扣百分比）

3. 查询参数 `notify_users`（布尔值，默认 False）

4. 返回更新后的完整商品信息

**提示：**
- 所有字段都应该是可选的（部分更新）
- 使用 `Optional` 或 `| None`

**测试数据：**
```json
PUT /items/123?notify_users=true
{
  "price": 99.99,
  "discount": 10
}
```

---

## 练习 5: 用户注册 (困难)

**需求：**
创建一个 POST 端点 `/register`，要求：
1. 定义 `UserRegistration` 模型：
   - `username`: 3-20 字符，只能包含字母、数字、下划线
   - `email`: 有效的邮箱格式
   - `password`: 8-50 字符
   - `confirm_password`: 必须与 password 相同
   - `age`: 整数，18-120
   - `phone`: 可选，格式：xxx-xxxx-xxxx 或 xxxxxxxxxxx
   - `agree_terms`: 布尔值，必须为 True

2. 定义 `UserResponse` 模型：
   - `id`: 整数
   - `username`: 字符串
   - `email`: 字符串
   - `age`: 整数
   - 注意：不包含密码信息！

3. 验证逻辑（在端点函数中实现）：
   - password 和 confirm_password 必须相同
   - agree_terms 必须为 True

**提示：**
- 使用正则表达式验证格式：`regex="^[a-zA-Z0-9_]+$"`
- 电话号码正则：`regex="^(\d{3}-\d{4}-\d{4}|\d{11})$"`
- 在函数中手动检查密码匹配和条款同意

**测试数据：**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123",
  "age": 25,
  "phone": "138-1234-5678",
  "agree_terms": true
}
```

---

## 练习 6: 订单查询（综合）

**需求：**
创建一个 GET 端点 `/orders/{order_id}/details`，要求：
1. 路径参数：
   - `order_id`: 整数，>= 1

2. 查询参数：
   - `include_items`: 布尔值，默认 True（是否包含订单项）
   - `include_customer`: 布尔值，默认 False（是否包含客户信息）
   - `include_shipping`: 布尔值，默认 False（是否包含物流信息）

3. 定义响应模型（根据查询参数动态返回不同内容）

**挑战：**
思考如何根据查询参数动态构建响应内容

**提示：**
- 可以返回字典，根据参数决定包含哪些字段
- 或者定义多个响应模型

---

## 练习 7: 数据验证综合练习（困难）

**需求：**
创建一个 POST 端点 `/api/v1/products`，实现完整的商品创建功能：

1. 定义 `Category` 枚举：
```python
from enum import Enum

class Category(str, Enum):
    electronics = "electronics"
    clothing = "clothing"
    food = "food"
    books = "books"
```

2. 定义 `Product` 模型：
   - `name`: 必需，1-100 字符
   - `category`: 必需，使用 Category 枚举
   - `price`: 必需，> 0，最多 2 位小数
   - `description`: 可选，最多 1000 字符
   - `sku`: 必需，格式：XX-XXXX-XXXX（字母和数字）
   - `stock`: 必需，>= 0
   - `weight`: 可选，> 0（单位：kg）
   - `dimensions`: 可选，格式："长x宽x高"（如 "10x20x30"）
   - `images`: 可选，URL 列表，最多 5 个
   - `tags`: 可选，字符串列表，每个标签 1-20 字符

3. 返回状态码 201，包含创建的商品信息和生成的 ID

**提示：**
- SKU 正则：`regex="^[A-Z]{2}-\d{4}-\d{4}$"`
- Dimensions 正则：`regex="^\d+x\d+x\d+$"`
- 使用 `status_code=201`

---

## 挑战任务（可选）

### 挑战 1: 批量操作
创建一个 POST 端点 `/batch/items`，接受商品列表（最多 100 个），批量创建商品。

### 挑战 2: 复杂查询
创建一个 GET 端点 `/advanced-search`，支持：
- 多字段搜索
- 范围过滤（价格、日期等）
- 排序（多字段）
- 分页

### 挑战 3: 数据关系
设计订单系统的数据模型：
- Order（订单）
- OrderItem（订单项）
- Customer（客户）
- Address（地址）

实现嵌套的 Pydantic 模型。

---

## 完成标准

- [ ] 完成练习 1-4（基础和中等难度）
- [ ] 完成练习 5-7（困难）
- [ ] 所有端点可以正常运行
- [ ] 在 Swagger UI 中测试所有端点
- [ ] 验证规则正确工作（测试边界情况）
- [ ] 理解每个验证参数的作用

---

## 学习建议

1. **逐个完成**：不要跳过，每个练习都有其重点
2. **先思考再编码**：理解需求后再动手
3. **测试边界情况**：不仅测试正常输入，也要测试错误输入
4. **查看文档**：访问 `/docs` 查看自动生成的 API 文档
5. **参考学习文档**：遇到问题时查看 `day2-学习文档.md`
6. **最后看答案**：尝试自己解决后再看参考答案

祝学习愉快！ 🚀
