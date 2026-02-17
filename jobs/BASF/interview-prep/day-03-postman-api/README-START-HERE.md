# 🎯 从这里开始！Day 3 Postman API 测试

## ⚡ 已简化 - 只需要这个文件！

```
BASF-Complete-API-Collection.json  ← 只需导入这一个文件！
```

不需要单独的 environment 文件，所有变量都在集合里！

---

## 🚀 3 步快速开始

### 步骤 1: 导入集合

```bash
# 打开 Postman
flatpak run com.getpostman.Postman

# 在 Postman 中:
# Import → 选择 BASF-Complete-API-Collection.json → Import
```

### 步骤 2: 学习认证流程

```
打开 "02B-Authentication-Flow" 文件夹
按顺序运行:
  1️⃣ Login - Valid Credentials  (获取token)
  2️⃣ Get User Profile            (使用token)
  3️⃣ 401 vs 403 Explained        (理解概念)
```

### 步骤 3: 用 Newman 自动化

```bash
# 运行测试
newman run BASF-Complete-API-Collection.json \
    --folder "02B-Authentication-Flow" \
    -r html \
    --reporter-html-export report.html

# 查看报告
xdg-open report.html
```

---

## 📚 核心概念：401 vs 403

### 401 Unauthorized
- **意思**: "你是谁？" (不知道你的身份)
- **原因**: 没有 token 或 token 无效
- **解决**: 登录获取 token

### 403 Forbidden
- **意思**: "我知道你是谁，但你不能做这个" (知道你的身份，但权限不足)
- **原因**: token 有效但权限不够
- **解决**: 需要更高权限

---

## 💼 面试回答模板

**Q: "你如何处理 API 认证测试？"**

**回答:**
> "I implement a complete authentication flow in Postman. First, I send a POST request to /login to get a JWT token. Then I save it to a collection variable using pm.collectionVariables.set(). All subsequent protected requests automatically include this token in the Authorization header using {{bearerToken}}.
>
> I test both positive scenarios (valid token works) and negative scenarios (missing token returns 401, valid token with insufficient permissions returns 403). This approach is scalable - I can run 100 requests with just one login."

---

## 📖 详细文档（可选阅读）

如果想深入学习，查看这些文件：

- **快速开始.md** - 中文详细使用指南
- **exercise-02-authentication-flow-samples.md** - 完整代码示例和解释
- **01-postman-restful-concepts.md** - RESTful API 概念
- **02-interview-questions.md** - 10个面试问题准备

---

## ✅ 学习检查清单

- [ ] 导入 BASF-Complete-API-Collection.json
- [ ] 运行认证流程所有请求
- [ ] 理解 401 vs 403 区别
- [ ] 能用英文解释认证流程（5分钟）
- [ ] 用 Newman 生成测试报告
- [ ] 准备在面试中演示

---

**开始学习吧！** 🚀

有问题？查看 `快速开始.md` 获取更多帮助。
