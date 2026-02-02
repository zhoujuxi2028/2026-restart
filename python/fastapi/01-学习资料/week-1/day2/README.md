# Day 2: FastAPI 核心概念

## 📚 学习内容
- FastAPI 应用结构
- 路径参数和查询参数
- 请求体处理
- Pydantic 数据验证
- 响应模型

## 📁 文件说明

| 文件 | 说明 | 用途 |
|------|------|------|
| `day2-学习文档.md` | 理论教程 | 系统学习核心概念 |
| `day2-练习题.md` | 练习任务 | 实战训练 |
| `day2-exercises.py` | 练习模板 | 动手实现 |
| `day2-solutions.py` | 参考答案 | 检查对照 |
| `day2-main.py` | 演示代码 | 快速测试 |
| `README-DAY2.md` | 详细说明 | 完整指南 |

## 🚀 快速开始

### 方式 1: Python 直接运行
```bash
python3 day2-main.py
python3 day2-exercises.py
```

### 方式 2: Uvicorn 运行
```bash
uvicorn day2-main:app --reload
uvicorn day2-exercises:app --reload --port 8001
```

### 访问文档
```bash
# 启动后访问
http://localhost:8000/docs      # Swagger UI
http://localhost:8000/redoc     # ReDoc
```

## 📖 学习路径
1. 阅读 `day2-学习文档.md` 理解概念
2. 运行 `day2-main.py` 查看示例
3. 完成 `day2-练习题.md` 中的任务
4. 在 `day2-exercises.py` 编写代码
5. 对照 `day2-solutions.py` 检查答案

## ⚡ 测试示例
```bash
# 启动服务
python3 day2-main.py

# 测试 API
curl http://localhost:8000/
curl http://localhost:8000/items/1
curl http://localhost:8000/items/?skip=0&limit=10
```

## 🎯 学习重点
- ✅ 理解路径参数 vs 查询参数
- ✅ 掌握 Pydantic 模型定义
- ✅ 学会请求体数据验证
- ✅ 了解响应模型使用
