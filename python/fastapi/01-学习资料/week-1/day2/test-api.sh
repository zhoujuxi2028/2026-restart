#!/bin/bash

# FastAPI Day2 Exercises 测试脚本
# 使用方法: bash test-api.sh

echo "================================"
echo "FastAPI Day2 API 测试"
echo "================================"
echo ""

BASE_URL="http://localhost:8000"

# 检查服务是否运行
echo "1. 检查服务状态..."
if curl -s -f "$BASE_URL/docs" > /dev/null 2>&1; then
    echo "✅ 服务正常运行"
else
    echo "❌ 服务未运行，请先启动:"
    echo "   python3 day2/day2-exercises.py"
    exit 1
fi
echo ""

# 测试 1: 不包含邮箱
echo "2. 测试 GET /users/123 (不包含邮箱)"
echo "命令: curl \"$BASE_URL/users/123\""
echo "响应:"
curl -s "$BASE_URL/users/123" | jq 2>/dev/null || curl -s "$BASE_URL/users/123"
echo ""
echo ""

# 测试 2: 包含邮箱 (true)
echo "3. 测试 GET /users/123?include_email=true"
echo "命令: curl \"$BASE_URL/users/123?include_email=true\""
echo "响应:"
curl -s "$BASE_URL/users/123?include_email=true" | jq 2>/dev/null || curl -s "$BASE_URL/users/123?include_email=true"
echo ""
echo ""

# 测试 3: 包含邮箱 (false)
echo "4. 测试 GET /users/123?include_email=false"
echo "命令: curl \"$BASE_URL/users/123?include_email=false\""
echo "响应:"
curl -s "$BASE_URL/users/123?include_email=false" | jq 2>/dev/null || curl -s "$BASE_URL/users/123?include_email=false"
echo ""
echo ""

# 测试 4: 边界值测试
echo "5. 测试边界值 user_id=1"
echo "命令: curl \"$BASE_URL/users/1?include_email=true\""
echo "响应:"
curl -s "$BASE_URL/users/1?include_email=true" | jq 2>/dev/null || curl -s "$BASE_URL/users/1?include_email=true"
echo ""
echo ""

# 测试 5: 边界值测试
echo "6. 测试边界值 user_id=10000"
echo "命令: curl \"$BASE_URL/users/10000?include_email=true\""
echo "响应:"
curl -s "$BASE_URL/users/10000?include_email=true" | jq 2>/dev/null || curl -s "$BASE_URL/users/10000?include_email=true"
echo ""
echo ""

# 测试 6: 错误测试 - user_id 超出范围
echo "7. 测试错误情况 user_id=0 (应该返回 422 错误)"
echo "命令: curl \"$BASE_URL/users/0\""
echo "响应:"
curl -s "$BASE_URL/users/0" | jq 2>/dev/null || curl -s "$BASE_URL/users/0"
echo ""
echo ""

# 测试 7: 错误测试 - user_id 超出范围
echo "8. 测试错误情况 user_id=10001 (应该返回 422 错误)"
echo "命令: curl \"$BASE_URL/users/10001\""
echo "响应:"
curl -s "$BASE_URL/users/10001" | jq 2>/dev/null || curl -s "$BASE_URL/users/10001"
echo ""
echo ""

# 测试 8: 布尔值的不同表示
echo "9. 测试布尔值的不同表示"
echo ""
echo "9.1 include_email=1"
curl -s "$BASE_URL/users/123?include_email=1" | jq '.email' 2>/dev/null || curl -s "$BASE_URL/users/123?include_email=1"
echo ""
echo "9.2 include_email=True"
curl -s "$BASE_URL/users/123?include_email=True" | jq '.email' 2>/dev/null || curl -s "$BASE_URL/users/123?include_email=True"
echo ""
echo "9.3 include_email=yes"
curl -s "$BASE_URL/users/123?include_email=yes" | jq '.email' 2>/dev/null || curl -s "$BASE_URL/users/123?include_email=yes"
echo ""
echo ""

echo "================================"
echo "测试完成！"
echo "================================"
echo ""
echo "提示："
echo "- 如果看到 email 字段，说明 include_email 参数生效了"
echo "- 如果没有 email 字段，说明 include_email=false 或未传递"
echo "- 如果安装了 jq (brew install jq)，输出会更美观"
