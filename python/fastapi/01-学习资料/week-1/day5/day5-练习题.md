# Day 5: 实践练习 - 依赖注入

## 练习说明
- 请在 `day5-exercises.py` 文件中完成以下练习
- 理解并掌握依赖注入的各种应用场景
- 完成后可以运行并测试
- 参考答案在 `day5-solutions.py` 文件中

---

## 练习 1: 查询参数依赖 (基础) ⭐

**需求：**
创建一个可复用的分页和排序依赖：

1. 定义 `PaginationParams` 类作为依赖：
   - `skip`: 跳过的记录数（默认 0，最小 0）
   - `limit`: 返回的记录数（默认 10，范围 1-100）

2. 定义 `SortParams` 类作为依赖：
   - `sort_by`: 排序字段（可选，默认 "id"）
   - `order`: 排序方向（"asc" 或 "desc"，默认 "asc"）

3. 创建两个端点使用这些依赖：
   - `GET /users/` - 返回用户列表
   - `GET /products/` - 返回商品列表

**提示：**
```python
class PaginationParams:
    def __init__(self, skip: int = 0, limit: int = 10):
        # 添加验证逻辑
        pass
```

**测试：**
```bash
# 基础分页
curl "http://localhost:8000/users/?skip=0&limit=10"

# 带排序
curl "http://localhost:8000/users/?skip=0&limit=5&sort_by=name&order=desc"

# 参数验证
curl "http://localhost:8000/users/?limit=200"  # 应该报错
```

---

## 练习 2: 认证依赖链 (中等) ⭐⭐

**需求：**
实现一个三层认证依赖链：

1. **第一层 - 提取 Token**:
   ```python
   def get_token_header(authorization: str = Header(...)) -> str:
       # 从 "Bearer <token>" 中提取 token
       pass
   ```

2. **第二层 - 验证 Token 并获取用户**:
   ```python
   def get_current_user(token: str = Depends(get_token_header)) -> dict:
       # 验证 token，返回用户信息
       pass
   ```

3. **第三层 - 验证用户状态**:
   ```python
   def get_active_user(user: dict = Depends(get_current_user)) -> dict:
       # 检查用户是否激活
       pass
   ```

4. **创建端点**:
   - `GET /profile` - 使用 `get_active_user` 依赖
   - `GET /settings` - 使用 `get_active_user` 依赖

**数据：**
```python
fake_users = {
    "token123": {"username": "john", "active": True},
    "token456": {"username": "jane", "active": False}
}
```

**测试：**
```bash
# 有效 token
curl -H "Authorization: Bearer token123" http://localhost:8000/profile

# 无效 token
curl -H "Authorization: Bearer invalid" http://localhost:8000/profile

# 未激活用户
curl -H "Authorization: Bearer token456" http://localhost:8000/profile
```

---

## 练习 3: 数据库会话依赖 (中等) ⭐⭐

**需求：**
创建一个使用 `yield` 的数据库会话依赖：

1. **定义数据库类**:
   ```python
   class Database:
       def __init__(self):
           self.connected = False

       def connect(self):
           self.connected = True
           print("Database connected")

       def disconnect(self):
           self.connected = False
           print("Database disconnected")

       def execute(self, query: str):
           if not self.connected:
               raise Exception("Not connected")
           return f"Executed: {query}"
   ```

2. **创建数据库会话依赖**:
   ```python
   def get_db():
       db = Database()
       db.connect()
       try:
           yield db
       finally:
           db.disconnect()
   ```

3. **创建端点使用数据库**:
   - `GET /users/{user_id}` - 查询用户
   - `POST /users/` - 创建用户
   - `DELETE /users/{user_id}` - 删除用户

**要求：**
- 每个请求都应该打印连接和断开消息
- 即使发生错误，也要确保数据库连接被关闭

**测试：**
```bash
# 观察控制台输出，应该看到连接和断开消息
curl http://localhost:8000/users/1
curl -X POST http://localhost:8000/users/ -d '{"name": "John"}'
```

---

## 练习 4: 权限系统 (困难) ⭐⭐⭐

**需求：**
实现一个基于角色的权限系统（RBAC）：

1. **定义角色和权限**:
   ```python
   from enum import Enum

   class Role(str, Enum):
       ADMIN = "admin"
       EDITOR = "editor"
       VIEWER = "viewer"

   PERMISSIONS = {
       "admin": ["read", "write", "delete"],
       "editor": ["read", "write"],
       "viewer": ["read"]
   }
   ```

2. **创建用户和认证依赖**:
   ```python
   users_db = {
       "alice": {"username": "alice", "role": Role.ADMIN},
       "bob": {"username": "bob", "role": Role.EDITOR},
       "charlie": {"username": "charlie", "role": Role.VIEWER}
   }
   ```

3. **创建权限检查类**:
   ```python
   class PermissionChecker:
       def __init__(self, required_permission: str):
           self.required_permission = required_permission

       def __call__(self, current_user: dict = Depends(get_current_user)):
           # 检查用户是否有所需权限
           pass
   ```

4. **创建端点**:
   - `GET /articles/` - 需要 "read" 权限
   - `POST /articles/` - 需要 "write" 权限
   - `DELETE /articles/{id}` - 需要 "delete" 权限

**测试：**
```bash
# Viewer 可以读取
curl -H "X-User: charlie" http://localhost:8000/articles/

# Editor 可以读写
curl -H "X-User: bob" -X POST http://localhost:8000/articles/

# 只有 Admin 可以删除
curl -H "X-User: alice" -X DELETE http://localhost:8000/articles/1
curl -H "X-User: bob" -X DELETE http://localhost:8000/articles/1  # 应该失败
```

---

## 练习 5: 多数据源依赖 (困难) ⭐⭐⭐

**需求：**
创建一个系统，可以根据需要连接不同的数据源：

1. **定义数据源接口**:
   ```python
   class DataSource:
       def query(self, sql: str):
           raise NotImplementedError

   class MySQLDataSource(DataSource):
       def query(self, sql: str):
           return f"MySQL: {sql}"

   class PostgresDataSource(DataSource):
       def query(self, sql: str):
           return f"Postgres: {sql}"
   ```

2. **创建数据源工厂**:
   ```python
   def get_data_source(source_type: str = Query("mysql")):
       if source_type == "mysql":
           return MySQLDataSource()
       elif source_type == "postgres":
           return PostgresDataSource()
       else:
           raise HTTPException(400, "Invalid data source")
   ```

3. **创建服务类使用数据源**:
   ```python
   class UserService:
       def __init__(self, db: DataSource = Depends(get_data_source)):
           self.db = db

       def find_user(self, user_id: int):
           return self.db.query(f"SELECT * FROM users WHERE id = {user_id}")
   ```

4. **创建端点**:
   - `GET /query/users/{user_id}` - 可以指定数据源类型

**测试：**
```bash
# 使用 MySQL
curl "http://localhost:8000/query/users/1?source_type=mysql"

# 使用 Postgres
curl "http://localhost:8000/query/users/1?source_type=postgres"

# 无效数据源
curl "http://localhost:8000/query/users/1?source_type=invalid"
```

---

## 练习 6: 依赖缓存控制 (挑战) ⭐⭐⭐⭐

**需求：**
理解和控制依赖缓存行为：

1. **创建一个带时间戳的依赖**:
   ```python
   import time

   def get_timestamp():
       print(f"Getting timestamp at {time.time()}")
       return {"timestamp": time.time()}
   ```

2. **创建端点测试缓存**:
   ```python
   @app.get("/test-cache")
   async def test_cache(
       ts1: dict = Depends(get_timestamp),
       ts2: dict = Depends(get_timestamp),
       ts3: dict = Depends(get_timestamp)
   ):
       # 观察 get_timestamp 被调用了几次
       pass
   ```

3. **创建端点禁用缓存**:
   ```python
   @app.get("/test-no-cache")
   async def test_no_cache(
       ts1: dict = Depends(get_timestamp, use_cache=False),
       ts2: dict = Depends(get_timestamp, use_cache=False)
   ):
       # 每次都应该调用 get_timestamp
       pass
   ```

4. **解释行为**:
   - 在缓存启用时，打印了几次？为什么？
   - 在缓存禁用时，打印了几次？为什么？

---

## 练习 7: 路由器级别依赖 (挑战) ⭐⭐⭐⭐

**需求：**
创建一个管理后台，所有路由都需要管理员认证：

1. **创建管理员检查依赖**:
   ```python
   def require_admin(username: str = Header(..., alias="X-User")):
       if username != "admin":
           raise HTTPException(403, "Admin only")
       return username
   ```

2. **创建管理路由器**:
   ```python
   admin_router = APIRouter(
       prefix="/admin",
       tags=["admin"],
       dependencies=[Depends(require_admin)]  # 应用到所有路由
   )
   ```

3. **添加管理端点**:
   - `GET /admin/users` - 列出所有用户
   - `GET /admin/stats` - 查看统计信息
   - `POST /admin/broadcast` - 发送广播消息
   - `DELETE /admin/users/{user_id}` - 删除用户

4. **所有端点都不需要单独指定 `require_admin` 依赖**

**测试：**
```bash
# 普通用户访问（应该失败）
curl -H "X-User: bob" http://localhost:8000/admin/users

# 管理员访问（应该成功）
curl -H "X-User: admin" http://localhost:8000/admin/users
curl -H "X-User: admin" http://localhost:8000/admin/stats
```

---

## 挑战任务: 完整的博客系统依赖 (综合) 🏆

**需求：**
为博客系统设计完整的依赖注入架构：

1. **数据层依赖**:
   - 数据库连接依赖
   - 缓存连接依赖

2. **服务层依赖**:
   - `UserService` - 用户管理（依赖数据库）
   - `PostService` - 文章管理（依赖数据库和缓存）
   - `CommentService` - 评论管理（依赖数据库）

3. **认证层依赖**:
   - Token 提取
   - 用户认证
   - 权限检查

4. **路由层**:
   - 公开路由（无需认证）
   - 用户路由（需要认证）
   - 管理员路由（需要管理员权限）

5. **要求**:
   - 合理的依赖层次结构
   - 清晰的职责分离
   - 可复用的依赖组件
   - 易于测试

**架构示例**:
```
请求
  ↓
Token 提取 (get_token)
  ↓
用户认证 (get_current_user) → 数据库 (get_db)
  ↓
权限检查 (require_permission)
  ↓
服务层 (PostService) → 数据库 + 缓存
  ↓
业务逻辑
  ↓
响应
```

---

## 评分标准

### 基础分（60分）
- [ ] 完成练习 1-2
- [ ] 正确使用 `Depends()`
- [ ] 理解依赖注入基本概念
- [ ] 函数依赖和类依赖

### 进阶分（80分）
- [ ] 完成练习 3-5
- [ ] 嵌套依赖的使用
- [ ] 使用 `yield` 管理资源
- [ ] 理解依赖作用域

### 高级分（100分）
- [ ] 完成练习 6-7
- [ ] 依赖缓存控制
- [ ] 路由器级别依赖
- [ ] 合理的架构设计

### 挑战分（120分）
- [ ] 完成挑战任务
- [ ] 完整的依赖架构
- [ ] 清晰的职责分离
- [ ] 优秀的代码组织

---

## 学习建议

1. **理解概念**：先理解什么是依赖注入，为什么需要它
2. **动手实践**：从简单的依赖开始，逐步增加复杂度
3. **观察行为**：使用打印语句观察依赖的执行顺序
4. **测试覆盖**：尝试使用依赖覆盖进行测试
5. **架构思考**：思考如何用依赖注入改进现有代码

---

## 下一步

完成练习后：
1. 对照参考答案检查实现
2. 思考依赖注入的优势
3. 尝试重构之前的练习代码使用依赖注入
4. 准备学习 Day 6 的中间件和 CORS

加油！💪
