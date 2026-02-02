// 在导入server之前设置测试环境变量，确保使用内存数据库
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { app, db } = require('./server'); // 获取app和数据库实例

describe('Items API', () => {
  beforeAll((done) => {
    // 使用server.js的内存数据库实例，插入测试数据
    // 等待数据库初始化完成，然后插入测试数据
    setTimeout(() => {
      const stmt = db.prepare("INSERT INTO items (name, createdAt) VALUES (?, ?)");
      stmt.run('Test Item 1', new Date().toISOString());
      stmt.run('Test Item 2', new Date().toISOString());
      stmt.finalize();
      done();
    }, 100); // 短暂延迟确保数据库初始化完成
  });

  // ===== 数据获取类测试 (Retrieve) =====

  describe('GET /items', () => {
    // DB-CRUD-GET-SUCCESS-01: 获取所有项目列表
    // 功能: 验证 GET /items 返回所有项目
    // 期望: 200状态码 + 项目数组格式数据
    // 依赖: 数据库已初始化且包含测试数据
    it('should return all items', async () => {
      const response = await request(app)
        .get('/items')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('createdAt');
    });
  });

  describe('GET /items/:id', () => {
    // DB-CRUD-GET-SUCCESS-02: 获取指定项目（正常场景）
    // 功能: 验证 GET /items/1 返回特定项目
    // 期望: 200状态码 + 完整项目对象 (包含id, name, createdAt)
    // 依赖: ID=1的项目存在于数据库中
    it('should return a specific item', async () => {
      const response = await request(app)
        .get('/items/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('createdAt');
    });

    // DB-CRUD-GET-ERROR-01: 获取不存在项目
    // 功能: 验证 GET /items/999 处理不存在项目的错误情况
    // 期望: 404状态码 + 错误信息
    // 说明: 测试资源不存在的标准HTTP错误处理
    it('should return 404 for non-existent item', async () => {
      await request(app)
        .get('/items/999')
        .expect(404);
    });
  });

  // ===== 数据创建类测试 (Create) =====

  describe('POST /items', () => {
    // DB-CRUD-POST-SUCCESS-01: 创建新项目（正常场景）
    // 功能: 验证 POST /items 创建新项目
    // 期望: 201状态码 + 新项目对象 (包含自动生成的id和时间戳)
    // 说明: 执行后将创建新项目，为后续DELETE测试提供数据
    it('should create a new item', async () => {
      const newItem = { name: 'New Test Item' };
      const response = await request(app)
        .post('/items')
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New Test Item');
      expect(response.body).toHaveProperty('createdAt');
    });

    // DB-CRUD-POST-VALIDATION-01: 创建项目缺少必填字段验证
    // 功能: 验证 POST /items 数据验证（缺少name）
    // 期望: 400状态码 + 错误信息
    // 说明: 测试业务规则验证，确保数据完整性
    it('should return 400 if name is missing', async () => {
      await request(app)
        .post('/items')
        .send({})
        .expect(400);
    });
  });

  // ===== 数据更新类测试 (Update) =====

  describe('PUT /items/:id', () => {
    // DB-CRUD-PUT-SUCCESS-01: 更新已存在项目
    // 功能: 验证 PUT /items/1 更新项目信息
    // 期望: 200状态码 + 更新后对象 (保持原id和createdAt)
    // 依赖: ID=1的项目存在于数据库中
    it('should update an existing item', async () => {
      const response = await request(app)
        .put('/items/1')
        .send({ name: 'Updated Item 1' })
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Updated Item 1');
      expect(response.body).toHaveProperty('createdAt');
    });

    // DB-CRUD-PUT-ERROR-01: 更新不存在项目
    // 功能: 验证 PUT /items/999 处理不存在项目的错误情况
    // 期望: 404状态码 + 错误信息
    // 说明: 测试更新操作的资源存在性检查
    it('should return 404 for non-existent item', async () => {
      await request(app)
        .put('/items/999')
        .send({ name: 'Non-existent' })
        .expect(404);
    });

    // DB-CRUD-PUT-VALIDATION-01: 更新项目缺少必填字段验证
    // 功能: 验证 PUT /items/1 数据验证（缺少name）
    // 期望: 400状态码 + 错误信息
    // 说明: 测试更新操作的数据完整性验证
    it('should return 400 if name is missing', async () => {
      await request(app)
        .put('/items/1')
        .send({})
        .expect(400);
    });
  });

  // ===== 数据删除类测试 (Delete) =====

  describe('DELETE /items/:id', () => {
    // DB-CRUD-DELETE-SUCCESS-01: 删除已存在项目 ✅ **已修复测试**
    // 功能: 验证 DELETE /items/3 删除项目
    // 期望: 200状态码 + 成功删除确认
    // 修复: 通过环境隔离解决数据库同步问题
    // 依赖: DB-CRUD-POST-SUCCESS-01执行后创建的项目
    it('should delete an existing item', async () => {
      await request(app)
        .delete('/items/3')  // 使用存在的ID
        .expect(200);

      // 验证删除后无法获取
      await request(app)
        .get('/items/3')
        .expect(404);
    });

    // DB-CRUD-DELETE-ERROR-01: 删除不存在项目
    // 功能: 验证 DELETE /items/999 处理不存在项目的错误情况
    // 期望: 404状态码 + 错误信息
    // 说明: 测试删除操作的资源存在性检查
    it('should return 404 for non-existent item', async () => {
      await request(app)
        .delete('/items/999')
        .expect(404);
    });
  });
});