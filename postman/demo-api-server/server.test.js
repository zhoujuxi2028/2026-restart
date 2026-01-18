const request = require('supertest');
const app = require('./server'); // 假设server.js导出app
const sqlite3 = require('sqlite3').verbose();

describe('Items API', () => {
  let db;

  beforeAll((done) => {
    // 使用内存数据库进行测试
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error(err.message);
        done(err);
      } else {
        // 创建表
        db.run(`CREATE TABLE items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          createdAt TEXT NOT NULL
        )`, (err) => {
          if (err) {
            console.error(err.message);
            done(err);
          } else {
            // 插入测试数据
            const stmt = db.prepare("INSERT INTO items (name, createdAt) VALUES (?, ?)");
            stmt.run('Test Item 1', new Date().toISOString());
            stmt.run('Test Item 2', new Date().toISOString());
            stmt.finalize();
            done();
          }
        });
      }
    });
  });

  afterAll((done) => {
    db.close(done);
  });

  // 测试GET /items
  // 测试GET /items
  describe('GET /items', () => {
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

  // 测试GET /items/:id
  describe('GET /items/:id', () => {
    it('should return a specific item', async () => {
      const response = await request(app)
        .get('/items/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 404 for non-existent item', async () => {
      await request(app)
        .get('/items/999')
        .expect(404);
    });
  });

  // 测试POST /items
  describe('POST /items', () => {
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

    it('should return 400 if name is missing', async () => {
      await request(app)
        .post('/items')
        .send({})
        .expect(400);
    });
  });

  // 测试PUT /items/:id
  describe('PUT /items/:id', () => {
    it('should update an existing item', async () => {
      const response = await request(app)
        .put('/items/1')
        .send({ name: 'Updated Item 1' })
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Updated Item 1');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 404 for non-existent item', async () => {
      await request(app)
        .put('/items/999')
        .send({ name: 'Non-existent' })
        .expect(404);
    });

    it('should return 400 if name is missing', async () => {
      await request(app)
        .put('/items/1')
        .send({})
        .expect(400);
    });
  });

  // 测试DELETE /items/:id
  describe('DELETE /items/:id', () => {
    it('should delete an existing item', async () => {
      await request(app)
        .delete('/items/3')  // 使用存在的ID
        .expect(200);

      // 验证删除后无法获取
      await request(app)
        .get('/items/3')
        .expect(404);
    });

    it('should return 404 for non-existent item', async () => {
      await request(app)
        .delete('/items/999')
        .expect(404);
    });
  });
});