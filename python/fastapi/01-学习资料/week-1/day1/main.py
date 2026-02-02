"""
Day 1: FastAPI 基础 - 优化版本
展示最佳实践：类型注解、文档、错误处理、日志记录
"""

from fastapi import FastAPI, HTTPException, Query
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
import logging
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# 创建应用实例，添加元数据
app = FastAPI(
    title="FastAPI Day 1 - 基础API",
    description="学习 FastAPI 基础概念：路径参数、查询参数、响应模型",
    version="1.1.0",
    contact={
        "name": "FastAPI 学习",
        "email": "learning@example.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# 响应模型
class ItemResponse(BaseModel):
    """商品响应模型"""
    item_id: int = Field(..., description="商品ID", example=42)
    name: str = Field(..., description="商品名称", example="Laptop")
    price: float = Field(..., description="价格", example=999.99)
    description: Optional[str] = Field(None, description="商品描述")
    query_param: Optional[str] = Field(None, description="查询参数")
    timestamp: str = Field(..., description="响应时间戳")

class HealthResponse(BaseModel):
    """健康检查响应模型"""
    status: str = Field(..., description="服务状态", example="healthy")
    timestamp: str = Field(..., description="检查时间")
    version: str = Field(..., description="API版本")

# 模拟数据存储
ITEMS_DB: Dict[int, Dict[str, Any]] = {
    1: {"name": "Laptop", "price": 999.99, "description": "高性能笔记本电脑"},
    2: {"name": "Mouse", "price": 29.99, "description": "无线鼠标"},
    3: {"name": "Keyboard", "price": 79.99, "description": "机械键盘"},
}

@app.get("/",
         summary="API 根路径",
         description="获取 API 基本信息和可用端点",
         response_description="返回 API 信息")
async def root() -> Dict[str, Any]:
    """
    API 根路径 - 返回基本信息

    - 返回 API 基本信息
    - 提供可用端点列表
    - 包含文档链接
    """
    logger.info("Root endpoint accessed")
    return {
        "message": "Welcome to FastAPI Day 1 Demo!",
        "version": "1.1.0",
        "endpoints": {
            "items": "/items/{item_id} - 获取商品信息",
            "search": "/items/ - 搜索商品",
            "health": "/health - 健康检查"
        },
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_json": "/openapi.json"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/items/{item_id}",
         response_model=ItemResponse,
         summary="获取商品信息",
         description="根据商品ID获取详细信息",
         response_description="返回商品详细信息")
async def read_item(
    item_id: int = Field(..., description="商品ID", ge=1, le=1000, example=1),
    q: Optional[str] = Query(
        None,
        description="可选的查询参数",
        max_length=100,
        example="search_term"
    ),
    include_description: bool = Query(
        True,
        description="是否包含商品描述信息"
    )
) -> ItemResponse:
    """
    获取单个商品的详细信息

    - **item_id**: 商品的唯一标识符 (1-1000)
    - **q**: 可选的搜索查询参数
    - **include_description**: 是否包含详细描述

    返回商品的完整信息，包括名称、价格等。
    """
    logger.info(f"Accessing item {item_id} with query: {q}")

    # 检查商品是否存在
    if item_id not in ITEMS_DB:
        logger.warning(f"Item {item_id} not found")
        raise HTTPException(
            status_code=404,
            detail={
                "error": "item_not_found",
                "message": f"Item with ID {item_id} not found",
                "available_items": list(ITEMS_DB.keys())
            }
        )

    item_data = ITEMS_DB[item_id]

    return ItemResponse(
        item_id=item_id,
        name=item_data["name"],
        price=item_data["price"],
        description=item_data["description"] if include_description else None,
        query_param=q,
        timestamp=datetime.now().isoformat()
    )

@app.get("/items/",
         summary="搜索商品",
         description="根据查询参数搜索商品")
async def search_items(
    q: Optional[str] = Query(
        None,
        description="搜索关键词",
        min_length=1,
        max_length=50
    ),
    min_price: Optional[float] = Query(
        None,
        description="最低价格",
        ge=0
    ),
    max_price: Optional[float] = Query(
        None,
        description="最高价格",
        ge=0
    ),
    limit: int = Query(
        10,
        description="返回结果数量限制",
        ge=1,
        le=100
    )
) -> Dict[str, Any]:
    """
    搜索商品列表

    - **q**: 搜索关键词（在商品名称中搜索）
    - **min_price**: 价格下限
    - **max_price**: 价格上限
    - **limit**: 最多返回的结果数量

    返回符合条件的商品列表。
    """
    logger.info(f"Searching items with query: {q}, price range: {min_price}-{max_price}")

    # 过滤商品
    filtered_items = []
    for item_id, item_data in ITEMS_DB.items():
        # 关键词过滤
        if q and q.lower() not in item_data["name"].lower():
            continue

        # 价格过滤
        if min_price and item_data["price"] < min_price:
            continue
        if max_price and item_data["price"] > max_price:
            continue

        filtered_items.append({
            "item_id": item_id,
            "name": item_data["name"],
            "price": item_data["price"]
        })

    # 应用限制
    filtered_items = filtered_items[:limit]

    return {
        "query": q,
        "filters": {
            "min_price": min_price,
            "max_price": max_price
        },
        "total_found": len(filtered_items),
        "limit": limit,
        "items": filtered_items,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health",
         response_model=HealthResponse,
         summary="健康检查",
         description="检查API服务状态")
async def health_check() -> HealthResponse:
    """
    健康检查端点

    返回服务的当前状态和统计信息。
    适用于监控系统和负载均衡器。
    """
    logger.info("Health check requested")

    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.1.0"
    )

# 应用启动事件
@app.on_event("startup")
async def startup_event():
    """应用启动时执行"""
    logger.info("FastAPI Day 1 application starting up...")
    logger.info(f"Available items: {len(ITEMS_DB)}")

@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时执行"""
    logger.info("FastAPI Day 1 application shutting down...")

# 异常处理器
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    logger.error(f"Value error: {exc}")
    return HTTPException(status_code=400, detail=str(exc))

"""
运行方式:
1. 学习模式: python3 main.py
2. 开发模式: uvicorn main:app --reload --port 8000

测试示例:
- 获取商品: curl "http://localhost:8000/items/1"
- 搜索商品: curl "http://localhost:8000/items/?q=laptop&min_price=500"
- 健康检查: curl "http://localhost:8000/health"

文档:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
"""

if __name__ == "__main__":
    import uvicorn

    logger.info("Starting FastAPI Day 1 Demo Server...")
    logger.info("Documentation available at: http://localhost:8000/docs")

    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=False,  # 避免在生产环境中使用热重载
            access_log=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
