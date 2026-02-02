# Day 5: 依赖注入系统

## 📚 学习内容
- 依赖注入基础概念和优势
- 函数依赖和类依赖
- 嵌套依赖和依赖链
- 使用 yield 管理资源
- 依赖缓存机制
- 路由器和全局依赖
- 完整认证系统实现

## 📁 文件说明

| 文件 | 说明 | 行数 | 用途 |
|------|------|------|------|
| `day5-学习文档.md` | 详细教程 | - | 系统学习 |
| `day5-练习题.md` | 7个练习 + 综合挑战 | - | 实战训练 |
| `day5-exercises.py` | 练习模板 | ~200 | 动手实现 |
| `day5-solutions.py` | 完整实现 | 700+ | 参考对照 |
| `day5-main.py` | 6个核心示例 | 400+ | 快速测试 |

## 🚀 快速开始

### 方式 1: Python 直接运行
```bash
python3 day5-main.py
python3 day5-exercises.py
```

### 方式 2: Uvicorn 运行（推荐）
```bash
uvicorn day5-main:app --reload
uvicorn day5-exercises:app --reload --port 8001
```

### 访问文档和测试
```bash
# Swagger UI
http://localhost:8000/docs

# 测试认证
curl -X POST "http://localhost:8000/demo5/login?username=john&password=secret123"
curl -H "Authorization: Bearer fake-token-john" http://localhost:8000/demo5/me
```

## 📖 学习路径
1. 阅读 `day5-学习文档.md` （重点：依赖注入概念）
2. 运行 `day5-main.py` 观察6个示例
3. 理解依赖注入的执行流程
4. 查看 `day5-练习题.md` 了解任务
5. 在 `day5-exercises.py` 完成练习
6. 对照 `day5-solutions.py` 学习最佳实践

## 🎯 练习内容（7个练习 + 1个综合挑战）

1. **查询参数依赖**（基础） - 分页参数复用
2. **认证依赖链**（中等） - 用户验证流程
3. **数据库会话依赖**（中等） - 资源管理
4. **权限系统 RBAC**（困难） - 角色权限控制
5. **多数据源依赖**（困难） - 多数据库管理
6. **依赖缓存控制**（挑战） - 性能优化
7. **路由器级别依赖**（挑战） - 批量应用
8. **综合：博客系统依赖架构** - 完整项目

## ⚡ 示例代码说明

`day5-main.py` 包含 6 个示例：
- **Demo 1**: 基础函数依赖 - 查询参数
- **Demo 2**: 嵌套依赖 - 依赖链
- **Demo 3**: 类依赖 - 可复用类
- **Demo 4**: Yield 依赖 - 资源管理
- **Demo 5**: 完整认证系统 - 登录/验证
- **Demo 6**: 依赖缓存 - 性能优化

## 🎯 学习重点
- ✅ 理解依赖注入的核心价值
- ✅ 掌握函数依赖和类依赖
- ✅ 学会使用 yield 管理资源
- ✅ 实现完整的认证流程
- ✅ 优化依赖注入性能

## 💡 关键概念
- **Depends()**: 声明依赖关系
- **yield**: 资源的获取和释放
- **use_cache**: 控制依赖缓存
- **依赖链**: 嵌套依赖的执行顺序
- **安全性**: OAuth2、JWT 令牌

## 🔗 相关资源
- [FastAPI 依赖注入文档](https://fastapi.tiangolo.com/tutorial/dependencies/)
- Day 4 路由组织: `../day4/`
- Day 6 中间件: `../day6/`
