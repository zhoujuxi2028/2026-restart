const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://testuser:testpass@localhost:5432/testdb'
});

// Redis connection
let redisClient;
(async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.log('⚠️  Redis connection failed:', err.message);
  }
})();

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('⚠️  Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL');
  }
});

// ============================================
// Routes
// ============================================

// Health check endpoint (for Docker health checks)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'basf-test-app'
  });
});

// Home page
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BASF Test Application',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      user: '/api/users/:id',
      cache: '/api/cache/:key'
    }
  });
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users ORDER BY id');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
      [name, email]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Redis cache endpoints
app.get('/api/cache/:key', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({
        success: false,
        error: 'Redis not connected'
      });
    }

    const { key } = req.params;
    const value = await redisClient.get(key);

    if (value === null) {
      return res.status(404).json({
        success: false,
        error: 'Key not found'
      });
    }

    res.json({
      success: true,
      key,
      value
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post('/api/cache', async (req, res) => {
  try {
    if (!redisClient) {
      return res.status(503).json({
        success: false,
        error: 'Redis not connected'
      });
    }

    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required'
      });
    }

    await redisClient.set(key, value);

    res.status(201).json({
      success: true,
      message: 'Cache set successfully',
      key,
      value
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API docs: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await pool.end();
  if (redisClient) await redisClient.quit();
  process.exit(0);
});
