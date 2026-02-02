# Day 2 快速开始指南

## 📚 学习资料概览

今天的学习内容分为以下几个文件：

```
week-1/
├── README-DAY2.md                    # 👈 你正在看的快速开始指南
├── day2-main.py                      # 完整的示例代码（可直接运行）
└── 基础概念/
    ├── day2-学习文档.md              # 详细的理论知识和讲解
    ├── day2-练习题.md                # 7个练习题 + 3个挑战任务
    ├── day2-exercises.py             # 练习题代码框架
    └── day2-solutions.py             # 练习题参考答案
```

---

## 🎯 学习目标

今天你将掌握：
- ✅ 路径参数的高级验证
- ✅ 查询参数的约束条件
- ✅ 使用 Pydantic 模型定义请求体
- ✅ 响应模型的使用和数据保护

---

## 🚀 快速开始

### 步骤 1: 运行示例代码

```bash
# 进入 week-1 目录
cd /Users/michael_zhou/Documents/GitHub/2026-restart/fastapi-learning/01-学习资料/week-1

# 运行 Day 2 示例服务器
python day2-main.py
```

服务器启动后，访问：
- 🔗 **交互式文档**: http://localhost:8000/docs
- 🔗 **ReDoc 文档**: http://localhost:8000/redoc
- 🔗 **示例说明**: http://localhost:8000/examples

### 步骤 2: 阅读学习文档

打开 `基础概念/day2-学习文档.md`，按顺序学习以下内容：

1. **路径参数进阶** - 了解如何验证路径参数
2. **查询参数验证** - 学习各种查询参数约束
3. **请求体模型** - 使用 Pydantic 定义数据结构
4. **响应模型** - 控制 API 响应格式

每个章节都有详细的代码示例和说明。

### 步骤 3: 动手实践

打开 `基础概念/day2-练习题.md` 查看练习要求，然后在 `基础概念/day2-exercises.py` 中完成练习：

```bash
# 运行你的练习代码
python 基础概念/day2-exercises.py
```

**练习建议：**
- 从练习 1 开始，逐个完成
- 完成一个就测试一个（访问 http://localhost:8000/docs）
- 测试正常输入和错误输入
- 遇到困难时参考学习文档
- 实在不会再看参考答案

### 步骤 4: 查看参考答案

完成练习后，对比 `基础概念/day2-solutions.py` 中的参考答案：

```bash
# 运行参考答案（使用不同端口避免冲突）
python 基础概念/day2-solutions.py
# 访问 http://localhost:8001/docs
```

---

## 📝 快速测试示例

### 使用浏览器

访问 http://localhost:8000/docs，在交互式文档中测试所有端点。

### 使用 curl

```bash
# 1. 测试路径参数验证
curl http://localhost:8000/items/42

# 2. 测试查询参数
curl "http://localhost:8000/search/?q=laptop&skip=0&limit=10&sort_by=price"

# 3. 测试列表查询参数
curl "http://localhost:8000/products/?category=electronics&category=books&min_price=10&max_price=100"

# 4. 测试 POST 请求（创建商品）
curl -X POST http://localhost:8000/items/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "A powerful laptop",
    "price": 999.99,
    "tax": 99.99,
    "tags": ["electronics", "computers"]
  }'

# 5. 测试 PUT 请求（更新商品）
curl -X PUT http://localhost:8000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "price": 1499.99,
    "tax": 150.00,
    "tags": ["gaming", "electronics"]
  }'

# 6. 测试用户创建（查看响应模型效果）
curl -X POST http://localhost:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "age": 30
  }'

# 7. 测试错误处理
curl http://localhost:8000/items/0  # 验证失败（< 1）
curl http://localhost:8000/items/9999  # 验证失败（> 1000）
curl http://localhost:8000/items-by-name/xyz  # 404 错误
```

### 使用 Python requests

```python
import requests

# 基础 URL
base_url = "http://localhost:8000"

# GET 请求
response = requests.get(f"{base_url}/items/42")
print(response.json())

# POST 请求
item_data = {
    "name": "Laptop",
    "price": 999.99,
    "tax": 99.99,
    "tags": ["electronics"]
}
response = requests.post(f"{base_url}/items/", json=item_data)
print(response.json())

# 查询参数
params = {
    "q": "laptop",
    "skip": 0,
    "limit": 10,
    "sort_by": "price"
}
response = requests.get(f"{base_url}/search/", params=params)
print(response.json())
```

---

## 💡 学习技巧

### 1. 边学边做
不要只是看代码，要亲手写一遍。即使是复制粘贴，也要理解每一行的作用。

### 2. 利用自动文档
FastAPI 的自动生成文档是最好的学习工具：
- 查看参数的验证规则
- 直接在浏览器中测试 API
- 查看请求/响应的数据结构

### 3. 故意制造错误
测试验证规则是否生效：
- 传入超出范围的数值
- 传入错误类型的数据
- 省略必需参数
- 查看错误消息如何提示

### 4. 对比示例和答案
- 先看 `day2-main.py` 理解概念
- 再做 `day2-exercises.py` 中的练习
- 最后对比 `day2-solutions.py` 找差距

### 5. 做笔记
在学习过程中记录：
- 常用的验证参数（ge, le, min_length 等）
- Pydantic Field 的常用配置
- 遇到的问题和解决方法

---

## 🎓 今天的重点概念

### 1. Path 参数验证
```python
from fastapi import Path
from typing import Annotated

@app.get("/items/{item_id}")
async def read_item(
    item_id: Annotated[int, Path(ge=1, le=1000)]
):
    return {"item_id": item_id}
```

### 2. Query 参数验证
```python
from fastapi import Query

@app.get("/search/")
async def search(
    q: Annotated[str, Query(min_length=3, max_length=50)]
):
    return {"q": q}
```

### 3. Pydantic 模型
```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
```

### 4. 响应模型
```python
@app.post("/items/", response_model=ItemResponse)
async def create_item(item: Item):
    return item
```

---

## 🐛 常见问题

### Q1: 为什么要使用 Annotated？
**A:** `Annotated` 是 Python 3.9+ 的类型注解方式，让代码更清晰。如果你使用的是旧版 Python，可以直接用：
```python
# 新方式（推荐）
item_id: Annotated[int, Path(ge=1)]

# 旧方式
item_id: int = Path(ge=1)
```

### Q2: `...` (Ellipsis) 是什么意思？
**A:** 表示该字段是必需的，没有默认值。等同于不提供默认值。

### Q3: 为什么有时用 `|` 有时用 `Union`？
**A:**
- `str | None` 是 Python 3.10+ 的新语法
- `Union[str, None]` 或 `Optional[str]` 是旧语法
- 两者功能相同

### Q4: response_model 和 return 类型注解有什么区别？
**A:**
- `response_model` 会验证和过滤响应数据
- 类型注解只是给 IDE 看的提示
- 推荐使用 `response_model`

### Q5: 如何测试验证规则？
**A:**
1. 在 Swagger UI (/docs) 中直接测试
2. 故意传入错误的值，查看错误消息
3. 查看返回的 422 状态码和详细错误信息

---

## 📊 练习进度追踪

完成后打勾：

- [ ] 阅读完 `day2-学习文档.md`
- [ ] 运行并测试 `day2-main.py` 的所有端点
- [ ] 完成练习 1: 用户信息查询
- [ ] 完成练习 2: 商品搜索
- [ ] 完成练习 3: 创建博客文章
- [ ] 完成练习 4: 更新商品信息
- [ ] 完成练习 5: 用户注册
- [ ] 完成练习 6: 订单查询
- [ ] 完成练习 7: 数据验证综合练习
- [ ] (可选) 完成挑战任务 1: 批量操作
- [ ] (可选) 完成挑战任务 2: 复杂查询
- [ ] (可选) 完成挑战任务 3: 数据关系

---

## 🎯 今日目标

**基础目标（必须完成）：**
- 理解路径参数和查询参数的验证机制
- 掌握 Pydantic 模型的基本用法
- 了解响应模型的作用
- 完成前 4 个练习

**进阶目标（推荐完成）：**
- 完成所有 7 个练习
- 理解字段验证的各种参数
- 掌握嵌套模型的使用

**挑战目标（可选）：**
- 完成所有挑战任务
- 设计自己的 API（如博客系统、商城系统）
- 尝试结合数据库（SQLite）

---

## 📚 参考资源

- **FastAPI 官方文档**: https://fastapi.tiangolo.com
- **Pydantic 文档**: https://docs.pydantic.dev
- **Python 类型提示**: https://docs.python.org/3/library/typing.html

---

## ⏭️ 明天预告：Day 3

明天我们将学习：
- **Pydantic 模型进阶**
  - 嵌套模型
  - 自定义验证器
  - 数据类型转换
  - 复杂的验证规则

准备好了就开始今天的学习吧！加油！ 💪

---

## 🆘 需要帮助？

如果遇到问题：
1. 查看错误消息（FastAPI 的错误提示很详细）
2. 参考 `day2-学习文档.md`
3. 查看 `day2-solutions.py` 中的实现
4. 访问 FastAPI 官方文档
5. 在交互式文档中测试和调试

记住：**犯错是学习的一部分！** 不要害怕出错，勇于尝试！🚀
