const http = require('http');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();
const axios = require('axios');

// SENSOR SERVICES
const { emitSensorUpdate, emitAlertCreated } = require('./websocket/socketHandler');
const { sendAlertEmail } = require('./email/emailService');
const { detectAnomaly, ANOMALY_THRESHOLD } = require('./anomaly/anomalyService');
// ================= DATABASE =================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Connected to Neon PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
// ============================================
// ================= LOGGER (INLINE) =================
async function logAction(user_id, action_type, description, ip) {
  try {
    await pool.query(
      'INSERT INTO logs (user_id, action_type, action_description, ip_address) VALUES ($1,$2,$3,$4)',
      [user_id, action_type, description, ip]
    );
  } catch (err) {
    console.error('Log error:', err);
  }
}
// ==================================================
// SERVICES (will inline later)
const { initializeSocket } = require('./websocket/socketHandler');
const { initializeEmailService } = require('./email/emailService');
const { setupSwagger } = require('./swagger/swaggerConfig');

// UTILS

const { generateToken } = require('./utils/auth');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: false
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// ================= SERVICES INIT =================

// Initialize WebSocket
try {
  initializeSocket(server);
  console.log('✓ WebSocket initialized');
} catch (error) {
  console.log('✗ WebSocket disabled');
}

// Initialize Email Service
try {
  initializeEmailService();
} catch (error) {
  console.log('✗ Email service disabled');
}

// Setup Swagger
try {
  setupSwagger(app);
} catch (error) {
  console.log('✗ Swagger disabled');
}

// =================================================

// ================= USERS ROUTES =================

// Add new user
app.post('/api/users/add', async (req, res) => {
  const { full_name, email, password, role, site_name, module_count } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (full_name, email, password, role, site_name, module_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [full_name, email, hashedPassword, role, site_name, module_count || 50]
    );

    await logAction(result.rows[0].id, 'ADD_USER', `User ${email} added`, clientIp);

    res.json({ success: true, message: 'User added successfully' });
  } catch (error) {
    console.error('Add user error:', error);
    if (error.code === '23505') {
      res.status(400).json({ success: false, message: 'Email already exists' });
    } else {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await logAction(user.id, 'LOGIN', `User ${email} logged in`, clientIp);

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        site_name: user.site_name,
        module_count: user.module_count || 50
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout user
app.post('/api/users/logout', async (req, res) => {
  const { user_id } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    await logAction(user_id, 'LOGOUT', 'User logged out', clientIp);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reset password
app.post('/api/users/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const userId = userResult.rows[0].id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

    await logAction(userId, 'PASSWORD_RESET', `Password reset for ${email}`, clientIp);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get module count
app.get('/api/users/modules/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT module_count FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      module_count: result.rows[0].module_count
    });
  } catch (error) {
    console.error('Module count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// ================= LOGS ROUTES =================

// Get logs with filtering
app.get('/api/logs', async (req, res) => {
  const { start_date, end_date, action_type, user_id } = req.query;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    let query = `
      SELECT l.*, u.full_name, u.email 
      FROM logs l 
      LEFT JOIN users u ON l.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (start_date) {
      paramCount++;
      query += ` AND l.created_at >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      query += ` AND l.created_at <= $${paramCount}`;
      params.push(end_date);
    }

    if (action_type) {
      paramCount++;
      query += ` AND l.action_type = $${paramCount}`;
      params.push(action_type);
    }

    if (user_id) {
      paramCount++;
      query += ` AND l.user_id = $${paramCount}`;
      params.push(user_id);
    }

    query += ' ORDER BY l.created_at DESC LIMIT 1000';

    const result = await pool.query(query, params);

    if (user_id) {
      await logAction(user_id, 'SEARCH', 'Viewed logs', clientIp);
    }

    res.json({ success: true, logs: result.rows });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Download logs as CSV
app.get('/api/logs/download', async (req, res) => {
  const { start_date, end_date, action_type, user_id } = req.query;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    let query = `
      SELECT l.id, l.action_type, l.action_description, l.ip_address, l.created_at,
             u.full_name, u.email, u.site_name
      FROM logs l 
      LEFT JOIN users u ON l.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (start_date) {
      paramCount++;
      query += ` AND l.created_at >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      query += ` AND l.created_at <= $${paramCount}`;
      params.push(end_date);
    }

    if (action_type) {
      paramCount++;
      query += ` AND l.action_type = $${paramCount}`;
      params.push(action_type);
    }

    query += ' ORDER BY l.created_at DESC';

    const result = await pool.query(query, params);

    if (user_id) {
      await logAction(user_id, 'DOWNLOAD', 'Downloaded logs CSV', clientIp);
    }

    const headers = ['ID', 'Action Type', 'Description', 'IP Address', 'Timestamp', 'User Name', 'Email', 'Site Name'];
    const csvRows = [headers.join(',')];

    result.rows.forEach(row => {
      const csvRow = [
        row.id,
        row.action_type,
        `"${row.action_description || ''}"`,
        row.ip_address || '',
        row.created_at,
        `"${row.full_name || ''}"`,
        row.email || '',
        `"${row.site_name || ''}"`
      ];
      csvRows.push(csvRow.join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=logs.csv');
    res.send(csv);
  } catch (error) {
    console.error('Download logs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// ================= SENSOR ROUTES =================

const THRESHOLDS = {
  TEMPERATURE_HIGH: 50,
  SMOKE_HIGH: 300,
  VOLTAGE_LOW: 3.0,
  VOLTAGE_HIGH: 5.5
};

async function checkAndCreateAlert(module_no, type, value, threshold, severity) {
  try {
    const message = `${type} alert: ${value} (threshold: ${threshold})`;

    const result = await pool.query(
      'INSERT INTO alerts (module_no, alert_type, severity, value, threshold, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [module_no, type, severity, value, threshold, message]
    );

    await pool.query(
      'UPDATE module_status SET alert_count = alert_count + 1 WHERE module_no = $1',
      [module_no]
    );

    const alert = result.rows[0];

    emitAlertCreated(alert);

    if (severity === 'HIGH' || severity === 'CRITICAL') {
      sendAlertEmail(alert);
    }

    return alert;
  } catch (error) {
    console.error('Alert creation error:', error);
  }
}

async function updateModuleStatus(module_no, temperature, smoke) {
  try {
    await pool.query(`
      INSERT INTO module_status (module_no, is_online, last_update, min_temperature, max_temperature, min_smoke, max_smoke)
      VALUES ($1, TRUE, CURRENT_TIMESTAMP, $2, $2, $3, $3)
      ON CONFLICT (module_no) DO UPDATE SET
        is_online = TRUE,
        last_update = CURRENT_TIMESTAMP,
        min_temperature = LEAST(module_status.min_temperature, $2),
        max_temperature = GREATEST(module_status.max_temperature, $2),
        min_smoke = LEAST(module_status.min_smoke, $3),
        max_smoke = GREATEST(module_status.max_smoke, $3)
    `, [module_no, temperature, smoke]);
  } catch (error) {
    console.error('Module status update error:', error);
  }
}

// TEST
app.get('/api/sensor/test', (req, res) => {
  res.json({ success: true, message: 'Sensor route working' });
});

// LATEST DATA
app.get('/api/sensor/latest', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (module_no)
        s.*,
        ms.is_online,
        ms.last_update
      FROM sensor_data s
      LEFT JOIN module_status ms ON s.module_no = ms.module_no
      ORDER BY s.module_no, s.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('GET latest error:', error);
    res.status(500).json({ success: false });
  }
});

// POST SENSOR DATA (ENHANCED)
app.post('/api/sensor', async (req, res) => {
  try {
    const {
      module_no = 1,
      voltage,
      current,
      temperature,
      humidity,
      smoke
    } = req.body;

    if (!voltage || !current || !temperature || !humidity || !smoke) {
      return res.status(400).json({ success: false });
    }

    let fireRisk = 'UNKNOWN';
    let mlConfidence = null;

    try {
      const mlResponse = await axios.post(
        'http://127.0.0.1:5001/predict',
        { voltage, current, temperature, humidity, smoke },
        { timeout: 2000 }
      );

      fireRisk = mlResponse.data.fire_risk;
      mlConfidence = mlResponse.data.confidence;
    } catch { }

    let anomalyScore = null;
    let isAnomaly = false;

    try {
      const anomaly = await detectAnomaly({ voltage, current, temperature, humidity, smoke });
      anomalyScore = anomaly.anomaly_score;
      isAnomaly = anomaly.is_anomaly;
    } catch { }

    const result = await pool.query(
      `INSERT INTO sensor_data
      (module_no, voltage, current, temperature, humidity, smoke_level, fire_risk, ml_confidence, anomaly_score, is_anomaly)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [module_no, voltage, current, temperature, humidity, smoke, fireRisk, mlConfidence, anomalyScore, isAnomaly]
    );

    const data = result.rows[0];

    emitSensorUpdate(data);

    await updateModuleStatus(module_no, temperature, smoke);

    if (temperature > THRESHOLDS.TEMPERATURE_HIGH) {
      await checkAndCreateAlert(module_no, 'HIGH_TEMPERATURE', temperature, THRESHOLDS.TEMPERATURE_HIGH, 'HIGH');
    }

    if (smoke > THRESHOLDS.SMOKE_HIGH) {
      await checkAndCreateAlert(module_no, 'HIGH_SMOKE', smoke, THRESHOLDS.SMOKE_HIGH, 'CRITICAL');
    }

    if (isAnomaly && anomalyScore > ANOMALY_THRESHOLD) {
      await checkAndCreateAlert(module_no, 'ANOMALY', anomalyScore, ANOMALY_THRESHOLD, 'MEDIUM');
    }

    res.json({ success: true, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// GRAPH
app.get('/api/sensor/graph/:module_no', async (req, res) => {
  const { module_no } = req.params;

  try {
    const result = await pool.query(`
      SELECT temperature, smoke_level as smoke, voltage, created_at
      FROM sensor_data
      WHERE module_no = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [module_no]);

    res.json({ success: true, data: result.rows.reverse() });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
// ================= ALERTS ROUTES =================

// Get all alerts with filtering
app.get('/api/alerts', async (req, res) => {
  const { module_no, start_date, end_date, is_cleared } = req.query;

  try {
    let query = 'SELECT * FROM alerts WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (module_no) {
      paramCount++;
      query += ` AND module_no = $${paramCount}`;
      params.push(module_no);
    }

    if (start_date) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      params.push(end_date);
    }

    if (is_cleared !== undefined) {
      paramCount++;
      query += ` AND is_cleared = $${paramCount}`;
      params.push(is_cleared === 'true');
    }

    query += ' ORDER BY created_at DESC LIMIT 500';

    const result = await pool.query(query, params);
    res.json({ success: true, alerts: result.rows });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get today's alert count
app.get('/api/alerts/today-count', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as count 
      FROM alerts 
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    res.json({
      success: true,
      count: parseInt(result.rows[0].count)
    });
  } catch (error) {
    console.error('Today count error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear alert
app.post('/api/alerts/clear/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    await pool.query(
      'UPDATE alerts SET is_cleared = TRUE, cleared_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    if (user_id) {
      await logAction(user_id, 'CLEAR_ALERT', `Cleared alert ${id}`, clientIp);
    }

    res.json({ success: true, message: 'Alert cleared' });
  } catch (error) {
    console.error('Clear alert error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get system health stats
app.get('/api/alerts/health', async (req, res) => {
  try {
    const [activeModules, todayAlerts, maxTemp, maxSmoke] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM module_status WHERE is_online = TRUE'),
      pool.query('SELECT COUNT(*) as count FROM alerts WHERE DATE(created_at) = CURRENT_DATE'),
      pool.query('SELECT MAX(temperature) as max FROM sensor_data WHERE created_at > NOW() - INTERVAL \'1 hour\''),
      pool.query('SELECT MAX(smoke) as max FROM sensor_data WHERE created_at > NOW() - INTERVAL \'1 hour\'')
    ]);

    res.json({
      success: true,
      activeModules: parseInt(activeModules.rows[0].count),
      todayAlerts: parseInt(todayAlerts.rows[0].count),
      maxTemperature: parseFloat(maxTemp.rows[0].max) || 0,
      maxSmoke: parseFloat(maxSmoke.rows[0].max) || 0
    });
  } catch (error) {
    console.error('Health stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// ================= COMMANDS ROUTES =================

// BASIC COMMAND INSERT
app.post('/api/commands', async (req, res) => {

  const { module_no = 1, command } = req.body;

  try {

    if (!command || !['START', 'STOP'].includes(command.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid command. Must be START or STOP'
      });
    }

    const result = await pool.query(
      'INSERT INTO device_commands (module_no, command) VALUES ($1,$2) RETURNING *',
      [module_no, command.toUpperCase()]
    );

    console.log("[COMMAND INSERTED] Module " + module_no + ": " + command);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {

    console.error("[COMMAND INSERT ERROR]: ", error);

    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });

  }

});


// LOG START
app.post('/api/commands/start', async (req, res) => {

  const { user_id, option, serial_numbers } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {

    let description;

    if (option === 'all') {
      description = 'Started all devices';
    } else {
      description = "Started device(s): " + serial_numbers;
    }

    await logAction(user_id, 'START_DEVICE', description, clientIp);

    res.json({
      success: true,
      message: 'Start command logged'
    });

  } catch (error) {

    console.error("Start command error:", error);

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });

  }

});


// LOG STOP
app.post('/api/commands/stop', async (req, res) => {

  const { user_id, option, serial_numbers } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {

    let description;

    if (option === 'all') {
      description = 'Rapid shutdown for all devices';
    } else {
      description = "Rapid shutdown for device(s): " + serial_numbers;
    }

    await logAction(user_id, 'STOP_DEVICE', description, clientIp);

    res.json({
      success: true,
      message: 'Stop command logged'
    });

  } catch (error) {

    console.error("Stop command error:", error);

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });

  }

});


// TEST DATABASE
app.post('/api/commands/test', async (req, res) => {

  try {

    const result = await pool.query(
      'INSERT INTO logs (user_id, action_type, action_description, ip_address) VALUES ($1,$2,$3,$4) RETURNING *',
      [1, 'START_DEVICE', 'Test insert', '127.0.0.1']
    );

    res.json({
      success: true,
      message: 'Test insert successful',
      inserted: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ================= IOT DEVICE COMMANDS =================

// INSERT DEVICE COMMAND
app.post('/api/commands/device-command', async (req, res) => {

  const { module_no = 1, command } = req.body;

  try {

    if (!command || !['START', 'STOP'].includes(command.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid command. Must be START or STOP'
      });
    }

    const result = await pool.query(
      "INSERT INTO device_commands (module_no, command, status) VALUES ($1,$2,'PENDING') RETURNING *",
      [module_no, command.toUpperCase()]
    );

    console.log("[DEVICE COMMAND INSERTED] Module " + module_no + ": " + command);

    res.json({
      success: true,
      message: 'Command inserted successfully',
      data: result.rows[0]
    });

  } catch (error) {

    console.error("Device command insert error:", error);

    res.status(500).json({
      success: false,
      message: 'Failed to insert command',
      error: error.message
    });

  }

});


// GET LATEST COMMAND
app.get('/api/commands/device-command/latest', async (req, res) => {

  const { module_no = 1 } = req.query;

  try {

    const result = await pool.query(
      "SELECT id,module_no,command,status,created_at FROM device_commands WHERE module_no=$1 AND status='PENDING' ORDER BY created_at DESC LIMIT 1",
      [module_no]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, data: null });
    }

    console.log("[DEVICE COMMAND FETCH] Module " + module_no + ": " + result.rows[0].command);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {

    console.error("Device command fetch error:", error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch command',
      error: error.message
    });

  }

});


// MARK COMMAND EXECUTED
app.post('/api/commands/device-command/executed', async (req, res) => {

  const { id } = req.body;

  try {

    await pool.query(
      "UPDATE device_commands SET status='EXECUTED' WHERE id=$1",
      [id]
    );

    console.log("Command " + id + " marked EXECUTED");

    res.json({
      success: true,
      message: 'Command marked executed'
    });

  } catch (error) {

    console.error("Command update error:", error);

    res.status(500).json({
      success: false,
      message: 'Failed to update command'
    });

  }

});

// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'advance.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access via http://localhost:${PORT}`);
});