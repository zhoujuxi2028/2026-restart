/**
 * JavaScript 调试日志实战示例
 * 运行方式：node javascript-debug-examples.js
 * 或在浏览器控制台中复制运行
 */

// ============================================
// 1. 基础日志输出
// ============================================
console.log('=== 1. 基础日志输出 ===\n');

// 普通日志
console.log('这是普通日志');
console.info('这是信息日志');
console.warn('这是警告日志');
console.error('这是错误日志');

// 多参数输出
const name = 'Alice';
const age = 25;
console.log('用户:', name, '年龄:', age);

// 模板字符串
console.log(`用户 ${name} 的年龄是 ${age}`);

// 对象输出
const user = { name: 'Bob', age: 30, city: '北京' };
console.log('用户对象:', user);

console.log('\n');

// ============================================
// 2. 结构化数据输出
// ============================================
console.log('=== 2. 结构化数据输出 ===\n');

// 表格形式输出数组
const users = [
  { id: 1, name: 'Alice', age: 25, role: 'Developer' },
  { id: 2, name: 'Bob', age: 30, role: 'Designer' },
  { id: 3, name: 'Charlie', age: 28, role: 'Manager' }
];
console.table(users);

// 表格形式输出对象
const userInfo = {
  姓名: '张三',
  年龄: 28,
  职位: '前端工程师',
  技能: 'JavaScript'
};
console.table(userInfo);

// 深度展开对象
const nestedObj = {
  level1: {
    level2: {
      level3: {
        value: '深层数据'
      }
    }
  }
};
console.dir(nestedObj, { depth: null });

console.log('\n');

// ============================================
// 3. 分组输出
// ============================================
console.log('=== 3. 分组输出 ===\n');

console.group('👤 用户信息');
console.log('姓名: 李四');
console.log('邮箱: lisi@example.com');
console.group('📞 联系方式');
console.log('手机: 13800138000');
console.log('微信: lisi_wx');
console.groupEnd();
console.groupEnd();

// 折叠分组
console.groupCollapsed('🔧 系统配置');
console.log('版本: 1.0.0');
console.log('环境: development');
console.groupEnd();

console.log('\n');

// ============================================
// 4. 性能分析 - 计时器
// ============================================
console.log('=== 4. 性能分析 ===\n');

// 简单计时
console.time('数组操作耗时');
const largeArray = Array.from({ length: 100000 }, (_, i) => i);
const doubled = largeArray.map(n => n * 2);
console.timeEnd('数组操作耗时');

// 多个计时器
console.time('循环1');
for (let i = 0; i < 100000; i++) {}
console.timeEnd('循环1');

console.time('循环2');
let sum = 0;
for (let i = 0; i < 100000; i++) {
  sum += i;
}
console.timeEnd('循环2');

// 统计调用次数
function processOrder(orderId) {
  console.count(`处理订单`);
  console.log(`订单 ${orderId} 处理完成`);
}

processOrder(101);
processOrder(102);
processOrder(103);
console.countReset('处理订单'); // 重置计数

console.log('\n');

// ============================================
// 5. 断言和条件日志
// ============================================
console.log('=== 5. 断言和条件日志 ===\n');

// 断言测试
function divide(a, b) {
  console.assert(b !== 0, '除数不能为0!', { a, b });
  return a / b;
}

console.log('10 / 2 =', divide(10, 2));
console.log('尝试 10 / 0:');
divide(10, 0); // 断言失败，输出错误

// 条件日志
function debugIf(condition, ...args) {
  if (condition) {
    console.log('[DEBUG]', ...args);
  }
}

const DEBUG_MODE = true;
debugIf(DEBUG_MODE, '这是调试信息');
debugIf(!DEBUG_MODE, '这条不会输出');

console.log('\n');

// ============================================
// 6. 追踪调用栈
// ============================================
console.log('=== 6. 追踪调用栈 ===\n');

function functionA() {
  functionB();
}

function functionB() {
  functionC();
}

function functionC() {
  console.trace('📍 调用栈追踪');
}

functionA();

console.log('\n');

// ============================================
// 7. 实战：调试数组操作
// ============================================
console.log('=== 7. 实战：调试数组操作 ===\n');

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('原始数组:', numbers);

console.group('🔍 数组处理过程');

const result = numbers
  .map((n, index) => {
    const newValue = n * 2;
    console.log(`  map[${index}]: ${n} -> ${newValue}`);
    return newValue;
  })
  .filter((n, index) => {
    const keep = n > 10;
    console.log(`  filter[${index}]: ${n} -> ${keep ? '保留' : '过滤'}`);
    return keep;
  })
  .reduce((sum, n, index) => {
    const newSum = sum + n;
    console.log(`  reduce[${index}]: ${sum} + ${n} = ${newSum}`);
    return newSum;
  }, 0);

console.groupEnd();
console.log('最终结果:', result);

console.log('\n');

// ============================================
// 8. 实战：调试异步操作
// ============================================
console.log('=== 8. 实战：调试异步操作 ===\n');

// 模拟异步操作
function simulateAsyncOperation(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: `User${userId}`, status: 'active' });
    }, 100);
  });
}

async function fetchUserData(userId) {
  console.group(`🌐 获取用户 ${userId} 数据`);
  console.time(`fetchUser-${userId}`);

  try {
    console.log('1️⃣ 开始请求...');
    const userData = await simulateAsyncOperation(userId);

    console.log('2️⃣ 请求成功，数据:');
    console.table(userData);

    console.timeEnd(`fetchUser-${userId}`);
    console.groupEnd();
    return userData;

  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    console.trace();
    console.groupEnd();
    throw error;
  }
}

// 执行异步调试
(async () => {
  await fetchUserData(1001);
  console.log('\n');
})();

// ============================================
// 9. 实战：调试对象变化
// ============================================
setTimeout(() => {
  console.log('=== 9. 实战：调试对象变化 ===\n');

  // 监控对象属性访问
  const targetObj = {
    count: 0,
    name: 'Counter'
  };

  const proxyObj = new Proxy(targetObj, {
    get(target, property) {
      console.log(`📖 读取属性: ${String(property)} = ${target[property]}`);
      return target[property];
    },
    set(target, property, value) {
      console.log(`✏️  设置属性: ${String(property)} = ${value} (原值: ${target[property]})`);
      target[property] = value;
      return true;
    }
  });

  console.log('开始操作代理对象:');
  proxyObj.count;           // 读取
  proxyObj.count = 1;       // 修改
  proxyObj.count++;         // 自增（读取+设置）
  console.log('当前值:', proxyObj.count);

  console.log('\n');
}, 200);

// ============================================
// 10. 实战：函数执行调试
// ============================================
setTimeout(() => {
  console.log('=== 10. 实战：函数执行调试 ===\n');

  // 装饰器模式：自动记录函数执行
  function logExecutionTime(fn) {
    return function(...args) {
      const fnName = fn.name || '匿名函数';
      console.group(`⏱️  执行 ${fnName}`);
      console.log('参数:', args);
      console.time(fnName);

      try {
        const result = fn.apply(this, args);
        console.log('返回值:', result);
        console.timeEnd(fnName);
        console.groupEnd();
        return result;
      } catch (error) {
        console.error('执行错误:', error);
        console.timeEnd(fnName);
        console.groupEnd();
        throw error;
      }
    };
  }

  // 使用装饰器
  const calculate = logExecutionTime(function calculate(a, b, operation) {
    switch(operation) {
      case 'add': return a + b;
      case 'multiply': return a * b;
      default: throw new Error('未知操作');
    }
  });

  calculate(5, 3, 'add');
  calculate(5, 3, 'multiply');

  console.log('\n');
}, 300);

// ============================================
// 11. 实战：错误堆栈美化
// ============================================
setTimeout(() => {
  console.log('=== 11. 实战：错误处理和日志 ===\n');

  function processData(data) {
    try {
      console.log('处理数据:', data);

      if (!data) {
        throw new Error('数据不能为空');
      }

      if (typeof data !== 'object') {
        throw new TypeError('数据必须是对象类型');
      }

      console.log('✅ 数据处理成功');
      return true;

    } catch (error) {
      console.group('❌ 错误详情');
      console.error('错误类型:', error.constructor.name);
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
      console.groupEnd();
      return false;
    }
  }

  processData(null);
  processData('string');
  processData({ name: 'test' });

  console.log('\n');
}, 400);

// ============================================
// 12. 高级技巧：自定义日志工具
// ============================================
setTimeout(() => {
  console.log('=== 12. 高级技巧：自定义日志工具 ===\n');

  // 自定义Logger类
  class Logger {
    constructor(prefix = '') {
      this.prefix = prefix;
    }

    _formatMessage(...args) {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      return [`[${timestamp}]`, this.prefix, ...args];
    }

    log(...args) {
      console.log(...this._formatMessage('📝', ...args));
    }

    info(...args) {
      console.info(...this._formatMessage('ℹ️', ...args));
    }

    warn(...args) {
      console.warn(...this._formatMessage('⚠️', ...args));
    }

    error(...args) {
      console.error(...this._formatMessage('❌', ...args));
    }

    debug(...args) {
      if (process.env.DEBUG) {
        console.log(...this._formatMessage('🐛', ...args));
      }
    }

    success(...args) {
      console.log(...this._formatMessage('✅', ...args));
    }
  }

  // 使用自定义Logger
  const logger = new Logger('[MyApp]');

  logger.log('应用启动');
  logger.info('加载配置文件');
  logger.warn('内存使用率较高: 85%');
  logger.success('数据库连接成功');
  logger.error('无法连接到外部API');

  console.log('\n');
}, 500);

// ============================================
// 13. 性能对比测试
// ============================================
setTimeout(() => {
  console.log('=== 13. 性能对比测试 ===\n');

  function performanceTest(name, fn, iterations = 1000) {
    console.time(name);
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    console.timeEnd(name);
  }

  // 测试不同数组方法的性能
  const testArray = Array.from({ length: 1000 }, (_, i) => i);

  console.group('数组方法性能对比');

  performanceTest('for循环', () => {
    let sum = 0;
    for (let i = 0; i < testArray.length; i++) {
      sum += testArray[i];
    }
  });

  performanceTest('forEach', () => {
    let sum = 0;
    testArray.forEach(n => sum += n);
  });

  performanceTest('reduce', () => {
    testArray.reduce((sum, n) => sum + n, 0);
  });

  console.groupEnd();

  console.log('\n');
}, 600);

// ============================================
// 14. 调试技巧总结
// ============================================
setTimeout(() => {
  console.log('=== 14. 调试技巧总结 ===\n');

  console.log(`
📚 JavaScript 调试技巧速查：

基础输出：
  • console.log()    - 普通日志
  • console.table()  - 表格形式
  • console.dir()    - 对象详情

分组管理：
  • console.group()  - 开始分组
  • console.groupEnd() - 结束分组

性能分析：
  • console.time()   - 开始计时
  • console.timeEnd() - 结束计时
  • console.count()  - 调用计数

调试辅助：
  • console.trace()  - 调用堆栈
  • console.assert() - 断言测试
  • console.clear()  - 清空控制台

生产环境建议：
  1. 使用环境变量控制日志级别
  2. 生产环境禁用 debug 日志
  3. 敏感信息不要输出到日志
  4. 使用专业日志库（如 winston、pino）

调试最佳实践：
  ✅ 在关键节点添加日志
  ✅ 使用分组组织相关日志
  ✅ 输出关键变量的类型和值
  ✅ 异步操作记录开始和结束
  ✅ 错误处理时输出完整上下文
  `);
}, 700);

// 最终提示
setTimeout(() => {
  console.log('\n\n' + '='.repeat(50));
  console.log('✨ 示例运行完成！');
  console.log('💡 提示：可以在浏览器控制台中查看更丰富的样式效果');
  console.log('='.repeat(50));
}, 800);
