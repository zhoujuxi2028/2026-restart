-- ============================================
-- Database Initialization Script
-- ============================================
-- This script creates the database schema and
-- seeds initial test data for the BASF test app

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed test data
INSERT INTO users (name, email) VALUES
    ('John Doe', 'john.doe@example.com'),
    ('Jane Smith', 'jane.smith@example.com'),
    ('Bob Johnson', 'bob.johnson@example.com'),
    ('Alice Williams', 'alice.williams@example.com'),
    ('Charlie Brown', 'charlie.brown@example.com')
ON CONFLICT (email) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Display confirmation
SELECT 'Database initialized successfully!' as message;
SELECT COUNT(*) as user_count FROM users;
