const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 数据库文件路径
const dbPath = './items.db';

// 初始化数据库
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`[${new Date().toISOString()}] ERROR opening database: ${err.message}`);
  } else {
    console.log(`[${new Date().toISOString()}] Connected to SQLite database`);
    // 创建表
    db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error(`[${new Date().toISOString()}] ERROR creating table: ${err.message}`);
      } else {
        console.log(`[${new Date().toISOString()}] Table 'items' ready`);
        // 插入默认数据（如果表为空）
        db.get("SELECT COUNT(*) AS count FROM items", (err, row) => {
          if (err) {
            console.error(`[${new Date().toISOString()}] ERROR checking table: ${err.message}`);
          } else if (row.count === 0) {
            const defaultItems = [
              { name: 'Item 1', createdAt: new Date().toISOString() },
              { name: 'Item 2', createdAt: new Date().toISOString() }
            ];
            const stmt = db.prepare("INSERT INTO items (name, createdAt) VALUES (?, ?)");
            defaultItems.forEach(item => {
              stmt.run(item.name, item.createdAt);
            });
            stmt.finalize();
            console.log(`[${new Date().toISOString()}] Inserted default items`);
          }
        });
      }
    });
  }
});

// 允许解析 JSON 请求体
app.use(express.json());

// 日志中间件：记录每个请求
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - Request received`);
  next();
});

// GET /items - 获取列表
app.get('/items', (req, res) => {
  db.all("SELECT * FROM items", (err, rows) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] ERROR fetching items: ${err.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
    console.log(`[${new Date().toISOString()}] Fetching all items - Total: ${rows.length}`);
    res.status(200).json(rows);
  });
});

// POST /items - 创建 item
app.post('/items', (req, res) => {
  const { name } = req.body;

  if (!name) {
    console.log(`[${new Date().toISOString()}] ERROR: Missing 'name' in request body for POST /items`);
    return res.status(400).json({ message: 'name is required' });
  }

  const createdAt = new Date().toISOString();
  db.run("INSERT INTO items (name, createdAt) VALUES (?, ?)", [name, createdAt], function(err) {
    if (err) {
      console.error(`[${new Date().toISOString()}] ERROR inserting item: ${err.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const newItem = { id: this.lastID, name, createdAt };
    console.log(`[${new Date().toISOString()}] Created new item: ${JSON.stringify(newItem)}`);
    res.status(201).json(newItem);
  });
});

// GET /items/:id - 获取单个 item
app.get('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log(`[${new Date().toISOString()}] Fetching item with ID: ${id}`);
  db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] ERROR fetching item: ${err.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!row) {
      console.log(`[${new Date().toISOString()}] ERROR: Item with ID ${id} not found`);
      return res.status(404).json({ message: 'Item not found' });
    }
    console.log(`[${new Date().toISOString()}] Found item: ${JSON.stringify(row)}`);
    res.status(200).json(row);
  });
});

// PUT /items/:id - 更新 item
app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  if (!name) {
    console.log(`[${new Date().toISOString()}] ERROR: Missing 'name' in request body for PUT /items/${id}`);
    return res.status(400).json({ message: 'name is required' });
  }

  console.log(`[${new Date().toISOString()}] Updating item with ID: ${id}`);
  db.run("UPDATE items SET name = ? WHERE id = ?", [name, id], function(err) {
    if (err) {
      console.error(`[${new Date().toISOString()}] ERROR updating item: ${err.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (this.changes === 0) {
      console.log(`[${new Date().toISOString()}] ERROR: Item with ID ${id} not found for update`);
      return res.status(404).json({ message: 'Item not found' });
    }
    // 获取更新后的 item
    db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error(`[${new Date().toISOString()}] ERROR fetching updated item: ${err.message}`);
        return res.status(500).json({ message: 'Internal server error' });
      }
      console.log(`[${new Date().toISOString()}] Updated item: ${JSON.stringify(row)}`);
      res.status(200).json(row);
    });
  });
});

// DELETE /items/:id - 删除 item
app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log(`[${new Date().toISOString()}] Deleting item with ID: ${id}`);
  db.run("DELETE FROM items WHERE id = ?", [id], function(err) {
    if (err) {
      console.error(`[${new Date().toISOString()}] ERROR deleting item: ${err.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (this.changes === 0) {
      console.log(`[${new Date().toISOString()}] ERROR: Item with ID ${id} not found for deletion`);
      return res.status(404).json({ message: 'Item not found' });
    }
    console.log(`[${new Date().toISOString()}] Deleted item with ID: ${id}`);
    res.status(200).json({ message: 'Item deleted successfully' });
  });
});

// 启动服务
app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Demo API server is running at http://localhost:${port}`);
});

// 导出app用于测试
module.exports = app;

// 优雅关闭数据库连接
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] ERROR closing database: ${err.message}`);
    } else {
      console.log(`[${new Date().toISOString()}] Database connection closed`);
    }
    process.exit(0);
  });
});
