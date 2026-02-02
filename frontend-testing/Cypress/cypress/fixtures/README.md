# 💾 Fixtures - 测试数据

Fixtures 是用于测试的静态数据文件，通常以 JSON 格式存储。

## 📁 文件说明

### `users.json` - 用户测试数据
包含各种类型的测试用户账号。

**用途**:
- 登录测试
- 用户管理测试
- 权限测试

**示例**:
```javascript
cy.fixture('users').then((users) => {
  const testUser = users[0]
  cy.login(testUser.username, testUser.password)
})
```

---

### `products.json` - 产品测试数据
包含各种产品信息，适合电商测试场景。

**用途**:
- 商品列表测试
- 购物车测试
- 搜索功能测试

**示例**:
```javascript
cy.fixture('products').then((products) => {
  const laptop = products.find(p => p.category === '电子产品')
  cy.get('[data-cy="search"]').type(laptop.name)
})
```

---

### `api-responses.json` - API 响应模拟数据
包含各种 API 响应场景。

**用途**:
- API 测试
- 网络拦截测试
- 错误处理测试

**示例**:
```javascript
cy.fixture('api-responses').then((responses) => {
  cy.intercept('GET', '/api/users', responses.userList)
})
```

---

### `example.json` - Cypress 默认示例
Cypress 自动生成的示例文件。

---

## 🚀 使用方法

### 方法 1: 使用 `cy.fixture()`
```javascript
cy.fixture('users').then((users) => {
  // 使用数据
  const admin = users.find(u => u.role === 'admin')
  cy.login(admin.username, admin.password)
})
```

### 方法 2: 在 beforeEach 中加载
```javascript
describe('用户测试', () => {
  let users

  beforeEach(() => {
    cy.fixture('users').then((data) => {
      users = data
    })
  })

  it('测试登录', () => {
    cy.login(users[0].username, users[0].password)
  })
})
```

### 方法 3: 使用别名
```javascript
beforeEach(() => {
  cy.fixture('users').as('users')
})

it('测试', function() {
  const testUser = this.users[0]
  // 使用数据
})
```

### 方法 4: 使用自定义命令
```javascript
cy.useFixture('users', (users) => {
  cy.login(users[0].username, users[0].password)
})
```

---

## 🎯 最佳实践

### 1. 数据分类
```
fixtures/
├── users/           # 用户相关数据
│   ├── admins.json
│   ├── customers.json
│   └── guests.json
├── products/        # 产品相关数据
├── api/             # API 响应数据
└── forms/           # 表单测试数据
```

### 2. 命名规范
- 使用小写字母和连字符
- 名称要描述性强
- 示例：`user-profiles.json`, `product-catalog.json`

### 3. 数据结构
```json
{
  "testData": {
    "valid": [/* 有效数据 */],
    "invalid": [/* 无效数据 */],
    "edge": [/* 边界数据 */]
  }
}
```

### 4. 环境特定数据
```javascript
// 根据环境选择不同的 fixture
const env = Cypress.env('environment') || 'dev'
cy.fixture(`users-${env}`)
```

---

## 📚 使用场景

### 场景 1: 模拟 API 响应
```javascript
cy.intercept('GET', '/api/products', { fixture: 'products.json' })
```

### 场景 2: 填充表单
```javascript
cy.fixture('users').then((users) => {
  const user = users[0]
  cy.get('[name="firstName"]').type(user.firstName)
  cy.get('[name="lastName"]').type(user.lastName)
  cy.get('[name="email"]').type(user.email)
})
```

### 场景 3: 数据驱动测试
```javascript
describe('多用户登录测试', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data
    })
  })

  users.forEach((user) => {
    it(`${user.username} 应该能登录`, () => {
      cy.login(user.username, user.password)
      cy.url().should('include', '/dashboard')
    })
  })
})
```

### 场景 4: 测试不同数据
```javascript
const testCases = [
  { input: 'valid@email.com', expected: 'success' },
  { input: 'invalid', expected: 'error' }
]

testCases.forEach((test) => {
  it(`测试输入: ${test.input}`, () => {
    cy.get('input').type(test.input)
    cy.get('.result').should('contain', test.expected)
  })
})
```

---

## ⚠️ 注意事项

1. **不要存储真实密码**
   - 使用测试专用的密码
   - 不要提交包含敏感信息的 fixtures

2. **保持数据更新**
   - 定期检查数据的有效性
   - 确保数据符合当前的应用需求

3. **文件大小**
   - 避免创建过大的 fixture 文件
   - 大数据集考虑分割成多个文件

4. **版本控制**
   - Fixtures 应该提交到版本控制
   - 团队成员共享相同的测试数据

---

**使用 Fixtures 让你的测试更可维护、更易读！** 📊
