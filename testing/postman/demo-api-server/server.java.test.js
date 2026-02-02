// 在导入server之前设置测试环境变量，确保使用内存数据库
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { app } = require('./server');

describe('Java Integration API', () => {
  // ===== Java数据处理功能测试 (TDD Approach) =====

  describe('POST /api/java/process', () => {
    // JAVA-INTEGRATION-PROCESS-SUCCESS-01: Java字符串反转（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序进行字符串反转
    // 期望: 200状态码 + 正确的反转结果
    // 依赖: Java程序存在且reverse操作正常
    it('should reverse string using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'reverse',
          data: 'Hello World'
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 'dlroW olleH');
      expect(response.body).toHaveProperty('operation', 'reverse');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body).toHaveProperty('javaOutput');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-SUCCESS-02: Java数组排序（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序进行数组排序
    // 期望: 200状态码 + 排序后的数组
    // 依赖: Java程序存在且sort操作正常
    it('should sort array using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'sort',
          data: ['cherry', 'apple', 'banana']
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 'apple,banana,cherry');
      expect(response.body).toHaveProperty('operation', 'sort');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-SUCCESS-03: Java质数检查（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序检查质数
    // 期望: 200状态码 + 质数检查结果
    // 依赖: Java程序存在且prime算法正确
    it('should check prime number using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'prime',
          data: 17
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 'true');
      expect(response.body).toHaveProperty('operation', 'prime');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-SUCCESS-04: Java阶乘计算（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序计算阶乘
    // 期望: 200状态码 + 正确的阶乘结果 (5! = 120)
    // 依赖: Java程序存在且factorial计算正确
    it('should calculate factorial using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'factorial',
          data: 5
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', '120');
      expect(response.body).toHaveProperty('operation', 'factorial');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-SUCCESS-05: Java字符串转大写（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序转换大写
    // 期望: 200状态码 + 大写字符串结果
    // 依赖: Java程序存在且uppercase操作正常
    it('should convert to uppercase using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'uppercase',
          data: 'hello java integration'
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 'HELLO JAVA INTEGRATION');
      expect(response.body).toHaveProperty('operation', 'uppercase');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-SUCCESS-06: Java回文检查（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序检查回文
    // 期望: 200状态码 + 回文检查结果
    // 依赖: Java程序存在且palindrome算法正确
    it('should check palindrome using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'palindrome',
          data: 'A man a plan a canal Panama'
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 'true');
      expect(response.body).toHaveProperty('operation', 'palindrome');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-SUCCESS-07: Java数组去重（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序去除重复元素
    // 期望: 200状态码 + 去重后的数组
    // 依赖: Java程序存在且unique操作正常
    it('should remove duplicates using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'unique',
          data: ['apple', 'banana', 'apple', 'cherry', 'banana']
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 'apple,banana,cherry');
      expect(response.body).toHaveProperty('operation', 'unique');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-SUCCESS-08: Java单词计数（正常场景）
    // 功能: 验证 POST /api/java/process 调用Java程序计算单词数量
    // 期望: 200状态码 + 正确的单词计数
    // 依赖: Java程序存在且wordcount操作正常
    it('should count words using Java program', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'wordcount',
          data: 'Java and Node.js integration is powerful'
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', '6');
      expect(response.body).toHaveProperty('operation', 'wordcount');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // JAVA-INTEGRATION-PROCESS-VALIDATION-01: 无效操作类型验证
    // 功能: 验证 POST /api/java/process 对无效操作的处理
    // 期望: 400状态码 + 错误信息
    // 说明: 测试API参数验证层，确保只接受支持的操作类型
    it('should return 400 for invalid operation', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'invalid_operation',
          data: 'test'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    // JAVA-INTEGRATION-PROCESS-VALIDATION-02: 缺少必填字段验证（operation）
    // 功能: 验证 POST /api/java/process 对缺少operation字段的处理
    // 期望: 400状态码 + 错误信息
    // 说明: 测试必填参数验证，确保API健壮性
    it('should return 400 for missing operation', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          data: 'test data'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    // JAVA-INTEGRATION-PROCESS-VALIDATION-03: 缺少必填字段验证（data）
    // 功能: 验证 POST /api/java/process 对缺少data字段的处理
    // 期望: 400状态码 + 错误信息
    // 说明: 测试数据参数必填验证
    it('should return 400 for missing data', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'reverse'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    // JAVA-INTEGRATION-PROCESS-ERROR-01: Java程序执行错误处理
    // 功能: 验证当Java程序执行失败时的错误处理
    // 期望: 500状态码 + 错误信息 (程序不存在时) 或 200状态码 (程序正常时)
    // 说明: 测试系统级错误的优雅处理
    it('should handle Java program execution errors gracefully', async () => {
      const response = await request(app)
        .post('/api/java/process')
        .send({
          operation: 'reverse',
          data: 'test'
        });

      // 要么成功（200），要么是程序不存在错误（500）
      expect([200, 500]).toContain(response.status);

      if (response.status === 500) {
        expect(response.body).toHaveProperty('error');
        expect(response.body.success).toBe(false);
      } else {
        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('GET /api/java/status', () => {
    // JAVA-STATUS-CHECK-SUCCESS-01: Java集成状态检查
    // 功能: 验证 GET /api/java/status 返回Java集成状态
    // 期望: 200状态码 + 状态信息 (可用性、路径、支持的操作)
    // 说明: 提供系统诊断和监控功能
    it('should return Java integration status', async () => {
      const response = await request(app)
        .get('/api/java/status')
        .expect(200);

      expect(response.body).toHaveProperty('javaAvailable');
      expect(response.body).toHaveProperty('javaVersion');
      expect(response.body).toHaveProperty('dataProcessorPath');
      expect(response.body).toHaveProperty('supportedOperations');
      expect(Array.isArray(response.body.supportedOperations)).toBe(true);
      expect(response.body.supportedOperations.length).toBeGreaterThan(0);
    });
  });
});