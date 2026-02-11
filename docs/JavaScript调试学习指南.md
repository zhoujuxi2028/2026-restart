# JavaScript 调试日志学习指南

## 📚 学习资源

本目录包含 JavaScript 调试日志的完整学习资源：

### 1. **javascript-debug-examples.js** - Node.js 环境示例
完整的 JavaScript 调试代码示例，包含 14 个实战场景。

**运行方式：**
```bash
cd /home/michael/repos/2026-restart/docs
node javascript-debug-examples.js
```

**包含内容：**
- ✅ 基础日志输出方法
- ✅ 结构化数据输出（表格、对象展开）
- ✅ 分组输出
- ✅ 性能分析（计时、计数）
- ✅ 断言和条件日志
- ✅ 调用堆栈追踪
- ✅ 数组操作调试
- ✅ 异步操作调试
- ✅ 对象变化监控
- ✅ 函数执行调试
- ✅ 错误处理和日志
- ✅ 自定义日志工具类
- ✅ 性能对比测试
- ✅ 调试技巧总结

### 2. **javascript-debug-demo.html** - 浏览器交互式演示
可视化的交互式调试演示页面，支持点击按钮查看效果。

**运行方式：**
```bash
# 方式 1: 直接用浏览器打开
firefox javascript-debug-demo.html
# 或
google-chrome javascript-debug-demo.html

# 方式 2: 使用简单的 HTTP 服务器
python3 -m http.server 8000
# 然后访问: http://localhost:8000/javascript-debug-demo.html
```

**特点：**
- 🎨 精美的界面设计
- 🖱️ 点击按钮运行各个演示
- 🌈 浏览器控制台的彩色输出
- 📱 响应式布局
- 💡 内置调试技巧速查表

---

## 🎯 学习路径

### 第一步：基础概念（10分钟）
运行 Node.js 示例，了解基本的日志输出方法：
```bash
node javascript-debug-examples.js
```

重点关注：
- `console.log/info/warn/error` 的区别
- `console.table()` 表格输出
- `console.group()` 分组管理

### 第二步：浏览器实战（20分钟）
打开 HTML 演示页面，在浏览器控制台中体验：

1. **打开浏览器控制台**
   - Windows/Linux: `F12` 或 `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

2. **逐个运行演示**
   - 点击每个演示按钮
   - 观察控制台输出
   - 理解每种技巧的应用场景

3. **重点体验**
   - 样式化日志（浏览器独有）
   - 表格展示的可交互性
   - 分组的折叠/展开功能

### 第三步：实战练习（30分钟）
在自己的项目中应用学到的技巧：

**练习 1: 调试数组处理**
```javascript
const products = [
  { name: '笔记本', price: 5000, stock: 10 },
  { name: '鼠标', price: 100, stock: 50 },
  { name: '键盘', price: 300, stock: 30 }
];

// 任务：找出价格大于200且有库存的产品
console.group('🔍 产品筛选过程');
const result = products
  .filter(p => {
    const valid = p.price > 200 && p.stock > 0;
    console.log(`${p.name}: 价格=${p.price}, 库存=${p.stock} → ${valid ? '✅' : '❌'}`);
    return valid;
  });
console.table(result);
console.groupEnd();
```

**练习 2: 调试异步请求**
```javascript
async function getUserProfile(userId) {
  console.group(`🌐 获取用户 ${userId} 资料`);
  console.time('请求耗时');

  try {
    console.log('1️⃣ 发送请求...');
    const response = await fetch(`/api/users/${userId}`);

    console.log('2️⃣ 解析数据...');
    const data = await response.json();
    console.table(data);

    console.timeEnd('请求耗时');
    console.groupEnd();
    return data;
  } catch (error) {
    console.error('❌ 请求失败:', error);
    console.trace();
    console.groupEnd();
  }
}
```

**练习 3: 监控对象变化**
```javascript
const state = {
  count: 0,
  user: null
};

const stateProxy = new Proxy(state, {
  set(target, prop, value) {
    console.log(`状态更新: ${prop} = ${value} (原值: ${target[prop]})`);
    target[prop] = value;
    return true;
  }
});

// 测试
stateProxy.count = 1;
stateProxy.user = { name: 'Alice' };
```

---

## 📖 Console API 速查表

### 基础输出
| 方法 | 说明 | 使用场景 |
|------|------|----------|
| `console.log()` | 普通日志 | 一般信息输出 |
| `console.info()` | 信息日志 | 提示性信息 |
| `console.warn()` | 警告日志 | 潜在问题警告 |
| `console.error()` | 错误日志 | 错误信息 |
| `console.debug()` | 调试日志 | 开发调试 |

### 结构化输出
| 方法 | 说明 | 使用场景 |
|------|------|----------|
| `console.table(data)` | 表格形式 | 数组、对象列表 |
| `console.dir(obj, options)` | 对象详情 | 深层对象结构 |

### 分组管理
| 方法 | 说明 |
|------|------|
| `console.group(label)` | 开始分组（展开） |
| `console.groupCollapsed(label)` | 开始分组（折叠） |
| `console.groupEnd()` | 结束分组 |

### 性能分析
| 方法 | 说明 |
|------|------|
| `console.time(label)` | 开始计时 |
| `console.timeEnd(label)` | 结束计时 |
| `console.timeLog(label)` | 中间计时 |
| `console.count(label)` | 调用计数 |
| `console.countReset(label)` | 重置计数 |

### 调试辅助
| 方法 | 说明 |
|------|------|
| `console.trace()` | 输出调用栈 |
| `console.assert(condition, msg)` | 断言测试 |
| `console.clear()` | 清空控制台 |

### 浏览器专用
| 方法 | 说明 | 示例 |
|------|------|------|
| `%c` 样式 | CSS 样式化 | `console.log('%c成功', 'color: green')` |
| `%s` | 字符串占位符 | `console.log('Hello %s', 'World')` |
| `%d` / `%i` | 整数占位符 | `console.log('数量: %d', 42)` |
| `%f` | 浮点数占位符 | `console.log('价格: %f', 99.99)` |
| `%o` / `%O` | 对象占位符 | `console.log('对象: %o', obj)` |

---

## 💡 最佳实践

### ✅ 推荐做法

1. **使用语义化的日志级别**
   ```javascript
   console.log('用户登录');        // 普通流程
   console.info('配置已加载');     // 提示信息
   console.warn('API即将弃用');    // 警告
   console.error('登录失败');      // 错误
   ```

2. **使用分组组织相关日志**
   ```javascript
   console.group('📦 初始化流程');
   console.log('1. 加载配置');
   console.log('2. 连接数据库');
   console.log('3. 启动服务器');
   console.groupEnd();
   ```

3. **添加表情符号提高可读性**
   ```javascript
   console.log('✅ 操作成功');
   console.log('❌ 操作失败');
   console.log('⚠️  需要注意');
   console.log('🔍 正在检查');
   ```

4. **输出关键变量的类型和值**
   ```javascript
   console.log('userId:', userId, typeof userId);
   console.log('response:', { status: res.status, data: res.data });
   ```

5. **异步操作记录开始和结束**
   ```javascript
   async function fetchData() {
     console.time('fetchData');
     const data = await api.get('/data');
     console.timeEnd('fetchData');
     return data;
   }
   ```

### ❌ 避免的做法

1. **不要在生产环境保留调试日志**
   ```javascript
   // ❌ 错误
   console.log('API Key:', apiKey);

   // ✅ 正确：使用环境变量控制
   if (process.env.NODE_ENV === 'development') {
     console.log('Debug info');
   }
   ```

2. **不要输出敏感信息**
   ```javascript
   // ❌ 错误
   console.log('用户密码:', password);
   console.log('信用卡号:', cardNumber);

   // ✅ 正确
   console.log('用户ID:', userId);
   ```

3. **不要过度使用日志**
   ```javascript
   // ❌ 错误：每次循环都输出
   for (let i = 0; i < 10000; i++) {
     console.log('处理:', i);
   }

   // ✅ 正确：只输出关键节点
   console.log('开始处理 10000 条数据');
   // ... 处理逻辑
   console.log('处理完成');
   ```

---

## 🔧 进阶技巧

### 1. 自定义 Logger 类
```javascript
class Logger {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  log(...args) {
    console.log(`[${this.timestamp}] ${this.prefix}`, ...args);
  }

  get timestamp() {
    return new Date().toISOString().split('T')[1].split('.')[0];
  }
}

const logger = new Logger('[MyApp]');
logger.log('应用启动');
```

### 2. 条件调试
```javascript
const DEBUG = process.env.DEBUG === 'true';

const debug = DEBUG ? console.log.bind(console, '🐛') : () => {};

debug('这条日志只在 DEBUG 模式显示');
```

### 3. 性能监控装饰器
```javascript
function measurePerformance(fn) {
  return function(...args) {
    console.time(fn.name);
    const result = fn.apply(this, args);
    console.timeEnd(fn.name);
    return result;
  };
}

const slowFunction = measurePerformance(function slowFunction() {
  // 耗时操作
});
```

### 4. 调试特定模块
```javascript
// 使用 debug 库（需要安装: npm install debug）
const debug = require('debug');

const dbDebug = debug('app:db');
const apiDebug = debug('app:api');

dbDebug('数据库查询: %O', query);
apiDebug('API请求: %s', url);

// 运行时设置: DEBUG=app:* node script.js
```

---

## 🎓 学习检查清单

完成以下任务，确保掌握 JavaScript 调试技巧：

- [ ] 理解 `console.log/info/warn/error` 的区别
- [ ] 会使用 `console.table()` 展示表格数据
- [ ] 会使用 `console.group()` 组织日志
- [ ] 会使用 `console.time()` 测量性能
- [ ] 会使用 `console.trace()` 追踪调用栈
- [ ] 会使用 `console.assert()` 进行断言测试
- [ ] 理解如何调试数组操作（map/filter/reduce）
- [ ] 理解如何调试异步操作（Promise/async-await）
- [ ] 会使用 Proxy 监控对象变化
- [ ] 知道如何在生产环境禁用调试日志
- [ ] 能够创建自定义的 Logger 工具类

---

## 🔗 相关资源

- [MDN: Console API](https://developer.mozilla.org/zh-CN/docs/Web/API/Console)
- [Chrome DevTools 官方文档](https://developer.chrome.com/docs/devtools/)
- [Node.js Console 文档](https://nodejs.org/api/console.html)

---

## 📝 学习笔记

在这里记录你的学习心得和常用技巧：

```
示例：
1. 调试接口请求时，使用 console.group() 包裹请求流程
2. 表格数据优先使用 console.table()
3. 性能敏感的代码段使用 console.time/timeEnd
...
```

---

**最后更新:** 2026-02-11
**适用版本:** ES6+ / Node.js 14+ / 现代浏览器
