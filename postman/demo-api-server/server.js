const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 数据库文件路径 - 测试环境使用内存数据库
const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : './items.db';

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

// 引入子进程模块用于调用C++程序
const { spawn, exec } = require('child_process');
const path = require('path');

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

// ===== C++集成API =====

// POST /api/cpp/calculate - 调用C++程序进行数学计算
app.post('/api/cpp/calculate', (req, res) => {
  const { operation, numbers } = req.body;

  console.log(`[${new Date().toISOString()}] C++ Calculate request: ${operation} with numbers: ${numbers}`);

  // 参数验证
  if (!operation) {
    return res.status(400).json({
      success: false,
      error: 'Missing operation parameter',
      message: 'operation field is required'
    });
  }

  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid numbers parameter',
      message: 'numbers field is required and must be a non-empty array'
    });
  }

  // 操作特定验证
  const validOperations = ['add', 'multiply', 'fibonacci', 'squares'];
  if (!validOperations.includes(operation)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid operation',
      message: `operation must be one of: ${validOperations.join(', ')}`
    });
  }

  // 数字数量验证
  if (operation === 'add' && numbers.length !== 2) {
    return res.status(400).json({
      success: false,
      error: 'Invalid number count for add operation',
      message: 'add operation requires exactly 2 numbers'
    });
  }

  if (operation === 'multiply' && numbers.length !== 2) {
    return res.status(400).json({
      success: false,
      error: 'Invalid number count for multiply operation',
      message: 'multiply operation requires exactly 2 numbers'
    });
  }

  if (operation === 'fibonacci' && numbers.length !== 1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid number count for fibonacci operation',
      message: 'fibonacci operation requires exactly 1 number'
    });
  }

  // C++程序路径
  const calculatorPath = path.join(__dirname, 'cpp', 'calculator');

  // 构建命令参数
  const args = [operation, ...numbers.map(n => n.toString())];

  const startTime = Date.now();

  console.log(`[${new Date().toISOString()}] Executing C++ program: ${calculatorPath} ${args.join(' ')}`);

  // 执行C++程序
  const cppProcess = spawn(calculatorPath, args);

  let stdout = '';
  let stderr = '';

  cppProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  cppProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  cppProcess.on('close', (code) => {
    const executionTime = Date.now() - startTime;

    console.log(`[${new Date().toISOString()}] C++ program finished with code: ${code}, time: ${executionTime}ms`);

    if (code !== 0) {
      console.error(`[${new Date().toISOString()}] C++ program error: ${stderr}`);
      return res.status(500).json({
        success: false,
        error: 'C++ program execution failed',
        message: stderr || 'Unknown error occurred',
        exitCode: code
      });
    }

    // 解析C++程序输出
    const lines = stdout.trim().split('\n');
    const resultLine = lines.find(line => line.startsWith('RESULT: '));

    if (!resultLine) {
      console.error(`[${new Date().toISOString()}] Could not parse C++ output: ${stdout}`);
      return res.status(500).json({
        success: false,
        error: 'Could not parse C++ program result',
        message: 'Invalid output format'
      });
    }

    const result = parseInt(resultLine.replace('RESULT: ', ''));

    console.log(`[${new Date().toISOString()}] C++ calculation result: ${result}`);

    res.status(200).json({
      success: true,
      operation: operation,
      numbers: numbers,
      result: result,
      executionTime: `${executionTime}ms`,
      cppOutput: stdout.trim()
    });
  });

  cppProcess.on('error', (err) => {
    const executionTime = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] C++ program spawn error: ${err.message}`);

    res.status(500).json({
      success: false,
      error: 'Failed to execute C++ program',
      message: err.message,
      executionTime: `${executionTime}ms`
    });
  });
});

// GET /api/cpp/status - 检查C++集成状态
app.get('/api/cpp/status', (req, res) => {
  const calculatorPath = path.join(__dirname, 'cpp', 'calculator');
  console.log(`[${new Date().toISOString()}] Checking C++ integration status`);

  // 检查C++可执行文件是否存在
  const fs = require('fs');

  try {
    const stats = fs.statSync(calculatorPath);
    const isExecutable = stats.isFile() && (stats.mode & parseInt('111', 8)) !== 0;

    res.status(200).json({
      cppAvailable: isExecutable,
      calculatorPath: calculatorPath,
      supportedOperations: ['add', 'multiply', 'fibonacci', 'squares'],
      lastChecked: new Date().toISOString()
    });

  } catch (error) {
    res.status(200).json({
      cppAvailable: false,
      calculatorPath: calculatorPath,
      error: error.message,
      supportedOperations: ['add', 'multiply', 'fibonacci', 'squares'],
      lastChecked: new Date().toISOString()
    });
  }
});

// 导出app和数据库实例用于测试
module.exports = { app, db };

// 只有直接运行时才启动HTTP服务器（避免测试时端口冲突）
if (require.main === module) {
  app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] Demo API server is running at http://localhost:${port}`);
  });
}

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
