# Day 4: 路由组织与错误处理

## 📚 学习内容
- APIRouter 的使用和路由模块化
- 路由分组和组织最佳实践
- HTTP 状态码的正确使用
- HTTPException 和自定义异常
- 全局异常处理器
- 响应模型进阶

## 📁 文件说明

| 文件 | 说明 | 行数 | 用途 |
|------|------|------|------|
| `day4-学习文档.md` | 理论教程 | - | 系统学习 |
| `day4-练习题.md` | 7个练习任务 | - | 实战训练 |
| `day4-exercises.py` | 练习模板 | ~200 | 动手实现 |
| `day4-solutions.py` | 完整答案 | 754 | 参考对照 |
| `day4-main.py` | 演示代码 | ~600 | 快速测试 |

## 🚀 快速开始

### 方式 1: Python 直接运行
```bash
python3 day4-main.py
python3 day4-exercises.py
```

### 方式 2: Uvicorn 运行（推荐）
```bash
uvicorn day4-main:app --reload
uvicorn day4-exercises:app --reload --port 8001
```

### 访问文档
```bash
http://localhost:8000/docs      # Swagger UI
http://localhost:8000/redoc     # ReDoc
```

## 📖 学习路径
1. 阅读 `day4-学习文档.md` （重点：APIRouter、异常处理）
2. 运行 `day4-main.py` 观察路由组织
3. 查看 `day4-练习题.md` 了解任务要求
4. 在 `day4-exercises.py` 完成练习
5. 对照 `day4-solutions.py` 检查实现

## 🎯 练习内容（7个练习 + 1个挑战）

1. **商品管理路由器**（基础） - APIRouter 基本使用
2. **自定义异常处理**（中等） - 错误处理机制
3. **用户认证路由**（中等） - 路由组织实践
4. **订单管理系统**（困难） - 复杂路由设计
5. **API 版本控制**（挑战） - 路由版本管理
6. **全局错误处理**（挑战） - 异常处理器
7. **挑战：博客 API** - 综合实战

## ⚡ 测试示例
```bash
# 启动服务
python3 day4-main.py

# 测试路由
curl http://localhost:8000/products
curl http://localhost:8000/users/me
curl http://localhost:8000/orders

# 测试错误处理
curl http://localhost:8000/products/999  # 404
curl http://localhost:8000/error-test    # 自定义异常
```

## 🎯 学习重点
- ✅ 使用 APIRouter 组织大型应用
- ✅ 理解路由前缀和标签
- ✅ 正确使用 HTTP 状态码
- ✅ 自定义异常和异常处理器
- ✅ 响应模型的高级用法

## 💡 关键概念
- **APIRouter**: 模块化路由管理
- **HTTPException**: FastAPI 异常类
- **状态码**: 200, 201, 204, 400, 401, 404, 500 等
- **exception_handler**: 全局异常处理
- **response_model**: 响应数据验证
