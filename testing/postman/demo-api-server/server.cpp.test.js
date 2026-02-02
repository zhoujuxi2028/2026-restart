// 在导入server之前设置测试环境变量，确保使用内存数据库
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { app } = require('./server');

describe('C++ Integration API', () => {
  // ===== C++计算功能测试 (TDD Approach) =====

  describe('POST /api/cpp/calculate', () => {
    // CPP-INTEGRATION-CALC-SUCCESS-01: C++加法运算（正常场景）
    // 功能: 验证 POST /api/cpp/calculate 调用C++程序进行加法计算
    // 期望: 200状态码 + 正确的计算结果
    // 依赖: C++可执行文件存在且功能正常
    it('should perform addition using C++ program', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'add',
          numbers: [15, 25]
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 40);
      expect(response.body).toHaveProperty('operation', 'add');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body).toHaveProperty('cppOutput');
      expect(response.body.success).toBe(true);
    });

    // CPP-INTEGRATION-CALC-SUCCESS-02: C++乘法运算（正常场景）
    // 功能: 验证 POST /api/cpp/calculate 调用C++程序进行乘法计算
    // 期望: 200状态码 + 正确的乘法结果
    // 依赖: C++可执行文件存在且multiply操作正常
    it('should perform multiplication using C++ program', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'multiply',
          numbers: [7, 8]
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 56);
      expect(response.body).toHaveProperty('operation', 'multiply');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // CPP-INTEGRATION-CALC-SUCCESS-03: C++斐波那契计算（正常场景）
    // 功能: 验证 POST /api/cpp/calculate 调用C++程序计算斐波那契数列
    // 期望: 200状态码 + 正确的斐波那契数值 (fibonacci(10) = 55)
    // 依赖: C++可执行文件存在且fibonacci算法正确
    it('should calculate fibonacci using C++ program', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'fibonacci',
          numbers: [10]
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 55); // fibonacci(10) = 55
      expect(response.body).toHaveProperty('operation', 'fibonacci');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // CPP-INTEGRATION-CALC-SUCCESS-04: C++平方和计算（正常场景）
    // 功能: 验证 POST /api/cpp/calculate 调用C++程序计算平方和
    // 期望: 200状态码 + 正确的平方和结果 (3² + 4² + 5² = 50)
    // 依赖: C++可执行文件存在且squares计算正确
    it('should calculate sum of squares using C++ program', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'squares',
          numbers: [3, 4, 5] // 3² + 4² + 5² = 9 + 16 + 25 = 50
        })
        .expect(200);

      expect(response.body).toHaveProperty('result', 50);
      expect(response.body).toHaveProperty('operation', 'squares');
      expect(response.body).toHaveProperty('executionTime');
      expect(response.body.success).toBe(true);
    });

    // CPP-INTEGRATION-CALC-VALIDATION-01: 无效操作类型验证
    // 功能: 验证 POST /api/cpp/calculate 对无效操作的处理
    // 期望: 400状态码 + 错误信息
    // 说明: 测试API参数验证层，确保只接受支持的操作类型
    it('should return 400 for invalid operation', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'invalid_op',
          numbers: [1, 2]
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    // CPP-INTEGRATION-CALC-VALIDATION-02: 缺少必填字段验证（operation）
    // 功能: 验证 POST /api/cpp/calculate 对缺少operation字段的处理
    // 期望: 400状态码 + 错误信息
    // 说明: 测试必填参数验证，确保API健壮性
    it('should return 400 for missing operation', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          numbers: [1, 2]
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    // CPP-INTEGRATION-CALC-VALIDATION-03: 缺少必填字段验证（numbers）
    // 功能: 验证 POST /api/cpp/calculate 对缺少numbers字段的处理
    // 期望: 400状态码 + 错误信息
    // 说明: 测试数字参数必填验证
    it('should return 400 for missing numbers', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'add'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(false);
    });

    // CPP-INTEGRATION-CALC-VALIDATION-04: 数字参数数量验证
    // 功能: 验证 POST /api/cpp/calculate 对add操作缺少足够数字的处理
    // 期望: 400状态码 + 错误信息
    // 说明: 测试特定操作的参数数量要求 (add需要2个数字)
    it('should return 400 when add operation has insufficient numbers', async () => {
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'add',
          numbers: [5] // add需要2个数字
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });

    // CPP-INTEGRATION-CALC-ERROR-01: C++程序执行错误处理
    // 功能: 验证当C++可执行文件不存在时的错误处理
    // 期望: 500状态码 + 错误信息 (程序不存在时) 或 200状态码 (程序正常时)
    // 说明: 测试系统级错误的优雅处理
    it('should handle C++ program execution errors gracefully', async () => {
      // 这个测试在C++程序编译前会失败，编译后应该通过
      const response = await request(app)
        .post('/api/cpp/calculate')
        .send({
          operation: 'add',
          numbers: [1, 2]
        });

      // 要么成功（200），要么是程序不存在错误（500）
      expect([200, 500]).toContain(response.status);

      if (response.status === 500) {
        expect(response.body).toHaveProperty('error');
        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('GET /api/cpp/status', () => {
    // CPP-STATUS-CHECK-SUCCESS-01: C++集成状态检查
    // 功能: 验证 GET /api/cpp/status 返回C++集成状态
    // 期望: 200状态码 + 状态信息 (可用性、路径、支持的操作)
    // 说明: 提供系统诊断和监控功能
    it('should return C++ integration status', async () => {
      const response = await request(app)
        .get('/api/cpp/status')
        .expect(200);

      expect(response.body).toHaveProperty('cppAvailable');
      expect(response.body).toHaveProperty('calculatorPath');
      expect(response.body).toHaveProperty('supportedOperations');
      expect(Array.isArray(response.body.supportedOperations)).toBe(true);
    });
  });
});