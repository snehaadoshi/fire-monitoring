-- Create database (run this first)
-- CREATE DATABASE fire_major;

-- Connect to fire_major database and run the following:

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    module_count INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('LOGIN', 'LOGOUT', 'ADD_USER', 'DOWNLOAD', 'SEARCH', 'PASSWORD_RESET', 'VIEW_ALERTS', 'CLEAR_ALERT')),
    action_description TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor data table
CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL PRIMARY KEY,
    module_no INTEGER DEFAULT 1,
    voltage DECIMAL(10,2),
    current DECIMAL(10,3),
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    smoke_level DECIMAL(10,2),
    gas_level DECIMAL(10,2) DEFAULT 0,
    water_detected BOOLEAN DEFAULT FALSE,
    fire_risk DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    module_no INTEGER NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    value DECIMAL(10,2),
    threshold DECIMAL(10,2),
    message TEXT,
    is_cleared BOOLEAN DEFAULT FALSE,
    cleared_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module status tracking
CREATE TABLE IF NOT EXISTS module_status (
    module_no INTEGER PRIMARY KEY,
    is_online BOOLEAN DEFAULT TRUE,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    min_temperature DECIMAL(5,2),
    max_temperature DECIMAL(5,2),
    min_smoke DECIMAL(10,2),
    max_smoke DECIMAL(10,2),
    alert_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_action_type ON logs(action_type);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sensor_data_module_created ON sensor_data(module_no, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_module_created ON alerts(module_no, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_cleared ON alerts(is_cleared);