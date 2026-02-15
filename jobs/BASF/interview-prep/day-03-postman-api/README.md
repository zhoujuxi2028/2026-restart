# Day 3: Postman + RESTful API Testing Mastery

## 学习目标 (Learning Objectives)

### 技术目标 (Technical Goals)
- ✅ 掌握Postman Collection Runner和Newman CLI
- ✅ 熟练使用环境变量和全局变量
- ✅ 编写Pre-request Scripts和Test Scripts
- ✅ 实现数据驱动测试（CSV/JSON）
- ✅ 掌握RESTful API测试策略
- ✅ 理解HTTP状态码和schema验证

### 英文表达目标 (English Communication Goals)
- ✅ 能用英文流利解释API测试策略
- ✅ 掌握关键术语：schema validation, bearer token, rate limiting
- ✅ 准备5分钟"API Testing Best Practices"演讲
- ✅ 录制Newman CI/CD集成讲解视频

## 今日学习时间分配 (Time Allocation: 3-4 hours)

| 时间段 | 任务 | 时长 |
|--------|------|------|
| 09:00-10:30 | 学习Postman高级功能 + RESTful概念 | 1.5h |
| 10:30-12:00 | 创建完整Postman Collection (20+请求) | 1.5h |
| 14:00-15:00 | 整理10个API测试面试题英文回答 | 1h |
| 15:00-15:45 | 编写Newman脚本 + 录制讲解 | 0.75h |

## 学习材料清单 (Learning Materials)

### 1. Postman核心概念文档
📄 **01-postman-restful-concepts.md**
- Postman架构和核心功能（英文版）
- RESTful API设计原则
- HTTP methods深度解析
- 认证机制详解

### 2. 实战Collection示例
💻 **03-postman-collection-examples.json**
- 完整的20+请求Collection
- 涵盖CRUD操作
- 认证流程测试
- 错误处理场景
- Schema validation示例

### 3. Newman CI/CD脚本
🔧 **03-newman-scripts/**
- Newman CLI命令示例
- 环境变量配置
- HTML报告生成
- CI/CD集成脚本

### 4. 面试问题集
📝 **02-interview-questions.md**
- 10个高频API测试面试题
- STAR格式英文回答
- Postman vs 其他工具对比

### 5. 英文表达模板
🗣️ **04-english-templates.md**
- API测试项目描述模板
- 技术难点讲解框架
- CI/CD集成经验表达
- 常用API测试术语

### 6. 每日检查清单
✅ **05-daily-checklist.md**
- 今日学习任务追踪
- 自我评估问卷
- 明日准备事项

## 实战练习要求 (Practice Requirements)

### 编码任务
1. 创建一个完整的Postman Collection（至少20个请求）
2. 使用真实的公共API（JSONPlaceholder, ReqRes, etc.）
3. 编写Test Scripts验证response
4. 使用环境变量实现多环境切换
5. 用Newman本地运行并生成HTML报告

### 英文表达任务
1. 准备5分钟"RESTful API Testing Strategy"英文演讲
2. 录制Newman CLI使用讲解（2-3分钟）
3. 整理10个面试问题的完整英文回答
4. 练习用英文描述一个API测试项目

## 评估标准 (Success Criteria)

今日学习成功标准：
- [ ] 能用英文解释RESTful API的6个设计原则
- [ ] 创建并运行一个完整的Postman Collection
- [ ] 用Newman CLI成功生成测试报告
- [ ] 能流利说出5种HTTP认证方式
- [ ] 录制至少1段Newman集成讲解视频
- [ ] 整理10个API测试面试题的完整英文回答

## 重点词汇表 (Key Vocabulary)

| 英文术语 | 中文 | 示例句 |
|---------|------|--------|
| Schema validation | 模式验证 | "We validate API response schemas using JSON Schema" |
| Bearer token | 持有者令牌 | "Our API uses Bearer token authentication" |
| Rate limiting | 速率限制 | "We test rate limiting by sending concurrent requests" |
| Idempotency | 幂等性 | "PUT and DELETE should be idempotent operations" |
| Collection runner | 集合运行器 | "We use Collection Runner for automated test execution" |
| Pre-request script | 预请求脚本 | "Pre-request scripts generate dynamic tokens" |
| Environment variable | 环境变量 | "We manage multiple environments using variables" |
| Newman CLI | Newman命令行 | "Newman integrates Postman tests into CI/CD pipelines" |
| Data-driven testing | 数据驱动测试 | "We use CSV files for data-driven API testing" |
| Status code | 状态码 | "We assert both status codes and response body" |

## 今日重点技术 (Key Technical Focus)

### Postman核心功能
```javascript
// Pre-request Script: Generate dynamic timestamp
pm.environment.set("timestamp", new Date().getTime());

// Test Script: Validate response
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has correct schema", function () {
    const schema = {
        type: "object",
        required: ["id", "name", "email"],
        properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" }
        }
    };
    pm.response.to.have.jsonSchema(schema);
});
```

### Newman CLI命令
```bash
# Basic test execution
newman run collection.json -e environment.json

# Generate HTML report
newman run collection.json -r html --reporter-html-export report.html

# Data-driven testing
newman run collection.json -d test-data.csv

# CI/CD integration with timeout
newman run collection.json --timeout-request 10000 --bail
```

## 实战API推荐 (Practice APIs)

### 1. JSONPlaceholder (免费测试API)
- URL: https://jsonplaceholder.typicode.com
- Features: CRUD operations, no auth required
- Perfect for: Learning and practice

### 2. ReqRes (真实响应API)
- URL: https://reqres.in
- Features: User management, delayed responses
- Perfect for: Authentication testing

### 3. OpenWeatherMap (真实API)
- URL: https://openweathermap.org/api
- Features: Requires API key, rate limiting
- Perfect for: Authentication and error handling

## 学习资源 (Learning Resources)

### 官方文档
- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)
- [RESTful API Design Best Practices](https://restfulapi.net/)

### 视频教程（英文）
- YouTube: "Postman Beginner's Course - API Testing"
- YouTube: "Newman - Command Line Collection Runner"
- Udemy: "Postman: The Complete Guide - REST API Testing"

### 练习资源
- [Public APIs List](https://github.com/public-apis/public-apis)
- [Postman Examples](https://www.postman.com/postman/workspace/published-postman-templates/overview)

## 明日预告 (Tomorrow's Preview)

**Day 4 将继续深化：**
- CI/CD Pipeline深度集成
- Jenkins/GitLab CI/GitHub Actions实战
- Docker容器化测试环境
- DevOps最佳实践
- 完整的CI/CD + 测试自动化流程

---

## 开始学习吧！ (Let's Get Started!)

按照文件顺序学习：
1. 📖 阅读 `GETTING-STARTED.md` （15分钟）
2. 📄 学习 `01-postman-restful-concepts.md` （45分钟）
3. 💻 创建 `03-postman-collection-examples.json` （90分钟）
4. 📝 回答 `02-interview-questions.md` （60分钟）
5. 🗣️ 练习 `04-english-templates.md` （30分钟）
6. ✅ 完成 `05-daily-checklist.md` （10分钟）

**记住**：API测试的核心是理解业务逻辑和数据流。不仅要测试成功路径，更要测试边界条件和错误场景！

Good luck! 🚀
