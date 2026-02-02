# FastAPI 查询参数使用指南

## 问题：为什么 `include_email` 没有触发？

### 原因分析

当您访问 `GET /users/1` 时，`include_email` 参数默认值是 `False`，所以不会返回邮箱信息。

要触发 `include_email=True`，您需要在 URL 中**显式传递查询参数**。

---

## 如何传递查询参数

### 方法 1: 通过浏览器（推荐）

```
http://localhost:8000/users/1?include_email=true
```

### 方法 2: 通过 Swagger UI

1. 访问 http://localhost:8000/docs
2. 找到 `GET /users/{user_id}` 接口
3. 点击 "Try it out"
4. 填写参数：
   - `user_id`: 1
   - `include_email`: true（勾选复选框或填写 true）
5. 点击 "Execute"

### 方法 3: 通过 curl 命令

```bash
# 包含邮箱
curl "http://localhost:8000/users/1?include_email=true"

# 不包含邮箱（默认）
curl "http://localhost:8000/users/1"
curl "http://localhost:8000/users/1?include_email=false"
```

### 方法 4: 通过 Python requests

```python
import requests

# 包含邮箱
response = requests.get("http://localhost:8000/users/1", params={"include_email": True})
print(response.json())

# 不包含邮箱
response = requests.get("http://localhost:8000/users/1", params={"include_email": False})
print(response.json())
```

---

## 查询参数的定义方式

### 方式 1: 简单定义（原代码）

```python
@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    include_email: bool = False  # 简单的查询参数
):
    ...
```

**特点**：
- ✅ 简单快捷
- ❌ 没有文档说明
- ❌ 在 Swagger UI 中没有描述信息

### 方式 2: 使用 Query（推荐，已修复）

```python
from typing import Annotated
from fastapi import Query

@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    include_email: Annotated[bool, Query(
        description="是否包含用户邮箱信息"
    )] = False
):
    ...
```

**特点**：
- ✅ 有详细的文档说明
- ✅ 在 Swagger UI 中有描述
- ✅ 可以添加更多验证规则
- ✅ 符合 FastAPI 最佳实践

### 方式 3: 使用旧式 Query（Pydantic V1 风格）

```python
from fastapi import Query

@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    include_email: bool = Query(
        default=False,
        description="是否包含用户邮箱信息"
    )
):
    ...
```

---

## 测试示例

### 启动服务器

```bash
# 方式 1
python3 day2/day2-exercises.py

# 方式 2
uvicorn day2.day2-exercises:app --reload --port 8000
```

### 测试不同场景

#### 场景 1: 默认情况（不包含邮箱）

```bash
curl http://localhost:8000/users/1
```

**预期输出**：
```json
{
  "user_id": 1,
  "username": "user_1",
  "full_name": "John Doe"
}
```

#### 场景 2: 包含邮箱

```bash
curl "http://localhost:8000/users/1?include_email=true"
```

**预期输出**：
```json
{
  "user_id": 1,
  "username": "user_1",
  "full_name": "John Doe",
  "email": "user_1@example.com"
}
```

#### 场景 3: 显式设置为 false

```bash
curl "http://localhost:8000/users/1?include_email=false"
```

**预期输出**：
```json
{
  "user_id": 1,
  "username": "user_1",
  "full_name": "John Doe"
}
```

---

## 常见问题

### Q1: 为什么我访问 `/users/1` 看不到邮箱？

**A**: 因为 `include_email` 的默认值是 `False`。您需要显式传递 `?include_email=true`。

### Q2: 查询参数区分大小写吗？

**A**: 是的，参数名区分大小写。
- ✅ `?include_email=true` - 正确
- ❌ `?Include_Email=true` - 错误（找不到参数）

### Q3: 布尔值怎么传递？

**A**: FastAPI 支持多种格式：

```bash
# 所有这些都表示 true
?include_email=true
?include_email=True
?include_email=1
?include_email=yes
?include_email=on

# 所有这些都表示 false
?include_email=false
?include_email=False
?include_email=0
?include_email=no
?include_email=off
```

### Q4: 可以省略参数名吗？

**A**: 不可以。查询参数必须使用 `key=value` 格式。

```bash
# ✅ 正确
?include_email=true

# ❌ 错误
?true
```

### Q5: 多个查询参数怎么传递？

**A**: 使用 `&` 连接：

```bash
curl "http://localhost:8000/users/1?include_email=true&format=json"
```

---

## 查询参数 vs 路径参数

### 路径参数（Path Parameter）

```python
@app.get("/users/{user_id}")  # user_id 是路径参数
async def get_user(user_id: int):
    ...
```

**特点**：
- 在 URL 路径中：`/users/123`
- **必需**，不能省略
- 通常用于资源标识

### 查询参数（Query Parameter）

```python
@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    include_email: bool = False  # 查询参数
):
    ...
```

**特点**：
- 在 URL 问号后：`/users/123?include_email=true`
- **可选**，有默认值
- 通常用于过滤、排序、分页等

### 对比表格

| 特性 | 路径参数 | 查询参数 |
|------|---------|---------|
| **位置** | URL 路径中 | URL `?` 后 |
| **语法** | `/users/{id}` | `?key=value` |
| **是否必需** | 必需 | 可选（可设默认值）|
| **典型用途** | 资源标识 | 过滤、配置 |
| **示例** | `/users/123` | `?include_email=true` |

---

## 高级用法

### 1. 必需的查询参数

```python
@app.get("/search")
async def search(
    q: Annotated[str, Query(
        description="搜索关键词",
        min_length=1
    )]  # 没有默认值 = 必需
):
    return {"query": q}
```

访问：
```bash
curl "http://localhost:8000/search?q=hello"  # ✅
curl "http://localhost:8000/search"          # ❌ 422 错误
```

### 2. 查询参数验证

```python
@app.get("/items")
async def list_items(
    page: Annotated[int, Query(ge=1, le=100)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10
):
    return {"page": page, "page_size": page_size}
```

### 3. 列表查询参数

```python
@app.get("/filter")
async def filter_items(
    tags: Annotated[list[str] | None, Query()] = None
):
    return {"tags": tags}
```

访问：
```bash
curl "http://localhost:8000/filter?tags=python&tags=fastapi&tags=api"
# 结果: {"tags": ["python", "fastapi", "api"]}
```

### 4. 正则表达式验证

```python
@app.get("/products")
async def get_products(
    sort: Annotated[str, Query(
        pattern=r"^(price|name|date)$"
    )] = "name"
):
    return {"sort_by": sort}
```

---

## 调试技巧

### 1. 检查请求日志

启动服务器时会显示请求日志：

```
INFO:     127.0.0.1:52345 - "GET /users/1?include_email=true HTTP/1.1" 200 OK
```

### 2. 使用 Swagger UI

访问 http://localhost:8000/docs 可以：
- 查看所有参数
- 交互式测试
- 查看请求/响应示例

### 3. 打印参数值

```python
@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    include_email: bool = False
):
    print(f"收到请求: user_id={user_id}, include_email={include_email}")  # 调试
    ...
```

---

## 最佳实践

### ✅ 推荐做法

1. **使用 Query() 定义查询参数**
   ```python
   include_email: Annotated[bool, Query(description="...")] = False
   ```

2. **提供清晰的描述**
   ```python
   Query(description="是否包含用户邮箱信息")
   ```

3. **设置合理的默认值**
   ```python
   = False  # 默认不包含敏感信息
   ```

4. **添加验证规则**
   ```python
   page: Annotated[int, Query(ge=1, le=100)] = 1
   ```

5. **在文档中提供示例**
   ```python
   """
   示例：
   - GET /users/1?include_email=true
   """
   ```

### ❌ 避免的做法

1. **不要省略类型注解**
   ```python
   # ❌ 错误
   async def get_user(include_email = False):

   # ✅ 正确
   async def get_user(include_email: bool = False):
   ```

2. **不要使用不明确的参数名**
   ```python
   # ❌ 不清楚
   ?flag=true

   # ✅ 清晰
   ?include_email=true
   ```

3. **不要在路径参数中传递可选信息**
   ```python
   # ❌ 不推荐
   @app.get("/users/{user_id}/{include_email}")

   # ✅ 推荐
   @app.get("/users/{user_id}")
   async def get_user(..., include_email: bool = False):
   ```

---

## 总结

### 关键要点

1. **查询参数在 URL `?` 后面传递**
   - 格式：`?key=value`
   - 多个参数：`?key1=value1&key2=value2`

2. **默认值是 `False` 不会自动触发**
   - 需要显式传递：`?include_email=true`

3. **使用 `Query()` 提供更好的文档**
   ```python
   Annotated[bool, Query(description="...")]
   ```

4. **在 Swagger UI 中测试最方便**
   - 访问：http://localhost:8000/docs

5. **布尔值支持多种格式**
   - true: `true`, `True`, `1`, `yes`, `on`
   - false: `false`, `False`, `0`, `no`, `off`

---

**修复日期**：2026-01-26
**文件**：day2/day2-exercises.py
**改进**：添加 Query() 定义和文档说明
**状态**：✅ 已优化
