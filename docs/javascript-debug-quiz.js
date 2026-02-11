/**
 * JavaScript 调试技巧自测练习
 * 运行方式：node javascript-debug-quiz.js
 *
 * 说明：
 * 1. 每个练习都有一个问题需要解决
 * 2. 使用正确的调试方法来定位和修复问题
 * 3. 运行代码查看结果
 */

console.log('%c🎓 JavaScript 调试技巧自测开始！', 'color: blue; font-size: 20px; font-weight: bold');
console.log('\n');

// ============================================
// 练习 1: 基础日志输出
// 任务：找出数组中所有偶数，使用合适的日志方法输出过程和结果
// ============================================
console.log('=== 练习 1: 基础日志输出 ===\n');

function findEvenNumbers(numbers) {
  console.group('🔍 查找偶数');
  console.log('输入数组:', numbers);

  const evenNumbers = numbers.filter((num, index) => {
    const isEven = num % 2 === 0;
    console.log(`  检查 [${index}]: ${num} → ${isEven ? '✅ 偶数' : '❌ 奇数'}`);
    return isEven;
  });

  console.log('\n结果:', evenNumbers);
  console.groupEnd();

  return evenNumbers;
}

// 测试
findEvenNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log('\n');

// ============================================
// 练习 2: 使用 console.table 展示数据
// 任务：处理学生成绩数据，用表格形式展示
// ============================================
console.log('=== 练习 2: 表格展示数据 ===\n');

function calculateGrades(students) {
  console.log('📊 学生成绩统计\n');

  const results = students.map(student => {
    const average = (student.math + student.english + student.science) / 3;
    const grade = average >= 90 ? 'A' : average >= 80 ? 'B' : average >= 70 ? 'C' : 'D';

    return {
      姓名: student.name,
      数学: student.math,
      英语: student.english,
      科学: student.science,
      平均分: average.toFixed(2),
      等级: grade
    };
  });

  console.table(results);

  return results;
}

// 测试
const students = [
  { name: '张三', math: 85, english: 90, science: 88 },
  { name: '李四', math: 92, english: 88, science: 95 },
  { name: '王五', math: 78, english: 82, science: 80 }
];

calculateGrades(students);
console.log('\n');

// ============================================
// 练习 3: 性能分析
// 任务：对比不同排序算法的性能
// ============================================
console.log('=== 练习 3: 性能分析 ===\n');

// 冒泡排序
function bubbleSort(arr) {
  console.time('冒泡排序');
  const result = [...arr];
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  console.timeEnd('冒泡排序');
  return result;
}

// 原生排序
function nativeSort(arr) {
  console.time('原生排序');
  const result = [...arr].sort((a, b) => a - b);
  console.timeEnd('原生排序');
  return result;
}

// 测试
const testArray = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));

console.log('数组长度:', testArray.length);
console.log('\n性能对比:');
bubbleSort(testArray);
nativeSort(testArray);

console.log('\n');

// ============================================
// 练习 4: 调用堆栈追踪
// 任务：追踪购物车操作的调用链
// ============================================
console.log('=== 练习 4: 调用堆栈追踪 ===\n');

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    console.log(`➕ 添加商品: ${item.name}`);
    this.items.push(item);
    this.updateTotal();
  }

  removeItem(itemName) {
    console.log(`➖ 移除商品: ${itemName}`);
    this.items = this.items.filter(item => item.name !== itemName);
    this.updateTotal();
  }

  updateTotal() {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`💰 总价: ¥${total}`);

    if (total > 1000) {
      console.trace('⚠️  总价超过1000，查看调用路径');
    }
  }

  checkout() {
    console.group('🛒 结账流程');
    console.log('商品列表:');
    console.table(this.items);
    this.updateTotal();
    console.groupEnd();
  }
}

// 测试
const cart = new ShoppingCart();
cart.addItem({ name: '笔记本电脑', price: 5000 });
cart.addItem({ name: '鼠标', price: 100 });
cart.addItem({ name: '键盘', price: 300 });
cart.checkout();

console.log('\n');

// ============================================
// 练习 5: 调试异步操作
// 任务：调试异步数据获取流程
// ============================================
console.log('=== 练习 5: 调试异步操作 ===\n');

// 模拟 API 请求
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: `User${userId}`,
          email: `user${userId}@example.com`,
          role: 'member'
        });
      } else {
        reject(new Error('无效的用户ID'));
      }
    }, 100);
  });
}

async function getUserProfile(userId) {
  console.group(`🌐 获取用户 ${userId} 信息`);
  console.time(`fetchUser-${userId}`);

  try {
    console.log('1️⃣ 发送请求...');
    const userData = await fetchUserData(userId);

    console.log('2️⃣ 请求成功');
    console.table(userData);

    console.log('3️⃣ 数据验证...');
    console.assert(userData.id === userId, '用户ID不匹配');
    console.assert(userData.email, '邮箱字段缺失');

    console.timeEnd(`fetchUser-${userId}`);
    console.groupEnd();
    return userData;

  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    console.trace();
    console.timeEnd(`fetchUser-${userId}`);
    console.groupEnd();
    throw error;
  }
}

// 测试（使用 IIFE 处理异步）
(async () => {
  await getUserProfile(1001);
  console.log('\n');

  // 测试错误情况
  try {
    await getUserProfile(-1);
  } catch (error) {
    console.log('已捕获错误\n');
  }
})();

// ============================================
// 练习 6: 对象监控
// 任务：监控状态对象的变化
// ============================================
setTimeout(() => {
  console.log('=== 练习 6: 对象监控 ===\n');

  function createObservableState(initialState) {
    const handlers = {
      get(target, property) {
        console.log(`📖 读取: ${String(property)} = ${JSON.stringify(target[property])}`);
        return target[property];
      },

      set(target, property, value) {
        const oldValue = target[property];
        console.log(`✏️  修改: ${String(property)} = ${JSON.stringify(value)} (原值: ${JSON.stringify(oldValue)})`);
        target[property] = value;
        return true;
      }
    };

    return new Proxy(initialState, handlers);
  }

  // 测试
  console.log('创建可观察的状态对象:\n');
  const state = createObservableState({
    count: 0,
    user: null,
    isLoggedIn: false
  });

  console.group('🔍 状态变化监控');
  state.count++;
  state.user = { name: 'Alice', id: 1 };
  state.isLoggedIn = true;
  console.log('\n当前 count 值:', state.count);
  console.groupEnd();

  console.log('\n');
}, 300);

// ============================================
// 练习 7: 综合调试 - 购物车系统
// 任务：调试一个完整的购物车功能，找出并修复bug
// ============================================
setTimeout(() => {
  console.log('=== 练习 7: 综合调试 - 购物车系统 ===\n');

  class AdvancedCart {
    constructor() {
      this.items = [];
      this.discountRate = 0;
      console.log('✅ 购物车已创建');
    }

    addItem(product, quantity = 1) {
      console.group(`➕ 添加商品: ${product.name}`);
      console.log('商品信息:', product);
      console.log('数量:', quantity);

      const existingItem = this.items.find(item => item.product.id === product.id);

      if (existingItem) {
        console.log('商品已存在，增加数量');
        existingItem.quantity += quantity;
      } else {
        console.log('新商品，添加到购物车');
        this.items.push({ product, quantity });
      }

      console.log('当前商品数量:', this.items.length);
      console.groupEnd();

      this._logCartState();
    }

    setDiscount(rate) {
      console.assert(rate >= 0 && rate <= 1, '折扣率必须在 0-1 之间', { rate });
      this.discountRate = rate;
      console.log(`🎁 设置折扣: ${(rate * 100).toFixed(0)}%`);
    }

    calculateTotal() {
      console.group('💰 计算总价');
      console.time('计算耗时');

      let subtotal = 0;

      this.items.forEach((item, index) => {
        const itemTotal = item.product.price * item.quantity;
        console.log(`  [${index}] ${item.product.name}: ¥${item.product.price} × ${item.quantity} = ¥${itemTotal}`);
        subtotal += itemTotal;
      });

      console.log(`\n小计: ¥${subtotal}`);

      const discount = subtotal * this.discountRate;
      const total = subtotal - discount;

      if (discount > 0) {
        console.log(`折扣: -¥${discount.toFixed(2)}`);
      }

      console.log(`总计: ¥${total.toFixed(2)}`);
      console.timeEnd('计算耗时');
      console.groupEnd();

      return total;
    }

    _logCartState() {
      console.log('\n📦 当前购物车状态:');
      console.table(this.items.map(item => ({
        商品: item.product.name,
        单价: item.product.price,
        数量: item.quantity,
        小计: item.product.price * item.quantity
      })));
    }

    checkout() {
      console.log('\n');
      console.log('%c🛒 开始结账', 'color: green; font-size: 16px; font-weight: bold');
      console.log('='.repeat(50));

      this._logCartState();
      const total = this.calculateTotal();

      console.log('='.repeat(50));
      console.log('%c✅ 结账完成', 'color: green; font-size: 16px; font-weight: bold');

      return total;
    }
  }

  // 测试购物车系统
  const myCart = new AdvancedCart();

  myCart.addItem({ id: 1, name: '笔记本电脑', price: 5000 }, 1);
  myCart.addItem({ id: 2, name: '无线鼠标', price: 150 }, 2);
  myCart.addItem({ id: 3, name: '机械键盘', price: 500 }, 1);
  myCart.addItem({ id: 2, name: '无线鼠标', price: 150 }, 1); // 重复添加

  myCart.setDiscount(0.1); // 9折

  myCart.checkout();

  console.log('\n');
}, 600);

// ============================================
// 练习 8: 性能对比实战
// 任务：对比不同数据处理方法的性能
// ============================================
setTimeout(() => {
  console.log('=== 练习 8: 性能对比实战 ===\n');

  const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: Math.random() * 100,
    category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  }));

  console.log('📊 数据集大小:', largeDataset.length);
  console.log('\n');

  // 方法 1: filter + map
  console.group('方法 1: filter + map');
  console.time('执行时间');
  const result1 = largeDataset
    .filter(item => item.value > 50)
    .map(item => ({ ...item, doubled: item.value * 2 }));
  console.log('结果数量:', result1.length);
  console.timeEnd('执行时间');
  console.groupEnd();

  console.log('\n');

  // 方法 2: reduce (一次遍历)
  console.group('方法 2: reduce (一次遍历)');
  console.time('执行时间');
  const result2 = largeDataset.reduce((acc, item) => {
    if (item.value > 50) {
      acc.push({ ...item, doubled: item.value * 2 });
    }
    return acc;
  }, []);
  console.log('结果数量:', result2.length);
  console.timeEnd('执行时间');
  console.groupEnd();

  console.log('\n');

  // 方法 3: for 循环
  console.group('方法 3: for 循环');
  console.time('执行时间');
  const result3 = [];
  for (let i = 0; i < largeDataset.length; i++) {
    const item = largeDataset[i];
    if (item.value > 50) {
      result3.push({ ...item, doubled: item.value * 2 });
    }
  }
  console.log('结果数量:', result3.length);
  console.timeEnd('执行时间');
  console.groupEnd();

  console.log('\n💡 性能优化建议: for 循环通常比链式调用更快');
  console.log('\n');
}, 900);

// ============================================
// 练习 9: 错误调试
// 任务：使用日志定位并修复错误
// ============================================
setTimeout(() => {
  console.log('=== 练习 9: 错误调试 ===\n');

  function processUserInput(input) {
    console.group('🔍 处理用户输入');
    console.log('输入值:', input);
    console.log('类型:', typeof input);

    try {
      // 验证输入
      console.log('\n1️⃣ 验证输入...');
      console.assert(input !== null && input !== undefined, '输入不能为空');

      // 解析数据
      console.log('2️⃣ 解析数据...');
      let data;
      if (typeof input === 'string') {
        data = JSON.parse(input);
        console.log('✅ JSON 解析成功:', data);
      } else if (typeof input === 'object') {
        data = input;
        console.log('✅ 对象类型，直接使用');
      } else {
        throw new TypeError('输入必须是字符串或对象');
      }

      // 处理数据
      console.log('3️⃣ 处理数据...');
      console.assert(data.name, '缺少 name 字段');
      console.assert(data.age, '缺少 age 字段');

      console.log('✅ 处理成功!');
      console.table(data);
      console.groupEnd();
      return data;

    } catch (error) {
      console.error('❌ 处理失败:', error.message);
      console.log('错误类型:', error.constructor.name);
      console.trace();
      console.groupEnd();
      return null;
    }
  }

  // 测试不同的输入
  console.log('测试 1: 正确的 JSON 字符串');
  processUserInput('{"name":"张三","age":25}');

  console.log('\n测试 2: 对象输入');
  processUserInput({ name: '李四', age: 30 });

  console.log('\n测试 3: 无效的 JSON');
  processUserInput('{invalid json}');

  console.log('\n测试 4: 缺少字段');
  processUserInput({ name: '王五' });

  console.log('\n');
}, 1200);

// ============================================
// 练习 10: 自定义日志工具
// 任务：创建一个实用的日志工具类
// ============================================
setTimeout(() => {
  console.log('=== 练习 10: 自定义日志工具 ===\n');

  class Logger {
    constructor(moduleName) {
      this.moduleName = moduleName;
      this.logCount = 0;
    }

    _formatMessage(level, ...args) {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      const prefix = `[${timestamp}] [${this.moduleName}] [${level}]`;
      return [prefix, ...args];
    }

    log(...args) {
      console.log(...this._formatMessage('LOG', ...args));
      this.logCount++;
    }

    info(...args) {
      console.info(...this._formatMessage('INFO', ...args));
      this.logCount++;
    }

    warn(...args) {
      console.warn(...this._formatMessage('WARN', ...args));
      this.logCount++;
    }

    error(...args) {
      console.error(...this._formatMessage('ERROR', ...args));
      this.logCount++;
    }

    debug(...args) {
      if (process.env.DEBUG) {
        console.log(...this._formatMessage('DEBUG', ...args));
        this.logCount++;
      }
    }

    success(...args) {
      console.log(...this._formatMessage('SUCCESS ✅', ...args));
      this.logCount++;
    }

    group(label) {
      console.group(...this._formatMessage('GROUP', label));
    }

    groupEnd() {
      console.groupEnd();
    }

    getStats() {
      return {
        模块: this.moduleName,
        日志数量: this.logCount
      };
    }
  }

  // 测试自定义 Logger
  const userLogger = new Logger('UserModule');
  const dbLogger = new Logger('Database');

  console.log('📝 使用自定义 Logger:\n');

  userLogger.info('用户模块初始化');
  userLogger.log('加载用户配置');
  userLogger.success('用户登录成功');

  dbLogger.info('连接数据库');
  dbLogger.log('执行查询: SELECT * FROM users');
  dbLogger.success('查询完成，返回 150 条记录');

  userLogger.warn('会话即将过期');
  userLogger.error('权限验证失败');

  console.log('\n📊 日志统计:');
  console.table([userLogger.getStats(), dbLogger.getStats()]);

  console.log('\n');
}, 1500);

// ============================================
// 最终测试报告
// ============================================
setTimeout(() => {
  console.log('\n\n' + '='.repeat(70));
  console.log('%c🎉 自测完成！', 'color: green; font-size: 24px; font-weight: bold');
  console.log('='.repeat(70));

  console.log('\n📋 自测内容回顾:\n');

  const topics = [
    '✅ 练习 1: 基础日志输出 (console.log/group)',
    '✅ 练习 2: 表格展示数据 (console.table)',
    '✅ 练习 3: 性能分析 (console.time/timeEnd)',
    '✅ 练习 4: 调用堆栈追踪 (console.trace)',
    '✅ 练习 5: 调试异步操作 (async/await)',
    '✅ 练习 6: 对象监控 (Proxy)',
    '✅ 练习 7: 综合调试 - 购物车系统',
    '✅ 练习 8: 性能对比实战',
    '✅ 练习 9: 错误调试 (try/catch + console.assert)',
    '✅ 练习 10: 自定义日志工具类'
  ];

  topics.forEach(topic => console.log(topic));

  console.log('\n💡 学习建议:\n');
  console.log('1. 在实际项目中应用这些调试技巧');
  console.log('2. 根据不同场景选择合适的日志方法');
  console.log('3. 生产环境记得移除或禁用调试日志');
  console.log('4. 养成良好的调试习惯，提高开发效率');

  console.log('\n🔗 下一步:\n');
  console.log('- 打开浏览器查看 javascript-debug-demo.html');
  console.log('- 阅读 JavaScript调试学习指南.md');
  console.log('- 在自己的项目中实践这些技巧');

  console.log('\n' + '='.repeat(70));
}, 1800);
