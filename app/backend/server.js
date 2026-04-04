const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Shipments table
    db.run(`CREATE TABLE IF NOT EXISTS shipments (
      id TEXT PRIMARY KEY,
      tracking_number TEXT UNIQUE NOT NULL,
      sender_name TEXT NOT NULL,
      sender_address TEXT NOT NULL,
      sender_email TEXT,
      sender_phone TEXT,
      receiver_name TEXT NOT NULL,
      receiver_address TEXT NOT NULL,
      receiver_email TEXT,
      receiver_phone TEXT,
      status TEXT DEFAULT 'pending',
      weight REAL,
      length REAL,
      width REAL,
      height REAL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      estimated_delivery DATETIME,
      actual_delivery DATETIME,
      notes TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )`);

    // Tracking history table
    db.run(`CREATE TABLE IF NOT EXISTS tracking_history (
      id TEXT PRIMARY KEY,
      shipment_id TEXT NOT NULL,
      status TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (shipment_id) REFERENCES shipments(id)
    )`);

    // Contact messages table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create default admin user
    const adminId = uuidv4();
    const adminPassword = bcrypt.hashSync('admin123', 10);
    
    db.get('SELECT * FROM users WHERE email = ?', ['admin@cashsupportshipment.com'], (err, row) => {
      if (!row) {
        db.run(
          `INSERT INTO users (id, username, email, password, name, role) VALUES (?, ?, ?, ?, ?, ?)`,
          [adminId, 'admin', 'admin@cashsupportshipment.com', adminPassword, 'Admin User', 'admin'],
          (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Default admin user created');
            }
          }
        );
      }
    });

    console.log('Database tables initialized');
  });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, name } = req.body;

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Create user
      db.run(
        `INSERT INTO users (id, username, email, password, name) VALUES (?, ?, ?, ?, ?)`,
        [userId, username, email, hashedPassword, name || username],
        function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Error creating user' });
          }

          // Generate token
          const token = jwt.sign(
            { id: userId, username, email, role: 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: userId, username, email, name: name || username, role: 'user' }
          });
        }
      );
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      db.run('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      // Generate token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, name, role, avatar, status, created_at FROM users WHERE id = ?', 
    [req.user.id], 
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    }
  );
});

// ==================== USER ROUTES ====================

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT id, username, email, name, role, status, avatar, created_at FROM users ORDER BY created_at DESC', 
    [], 
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching users' });
      }
      res.json({ users });
    }
  );
});

// Get user by ID
app.get('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // Users can only view their own profile unless they're admin
  if (req.user.id !== id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.get('SELECT id, username, email, name, role, status, avatar, created_at FROM users WHERE id = ?', 
    [id], 
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    }
  );
});

// Update user
app.put('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, email, avatar } = req.body;

  if (req.user.id !== id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.run(
    'UPDATE users SET name = ?, email = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, avatar, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating user' });
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// ==================== SHIPMENT ROUTES ====================

// Generate tracking number
function generateTrackingNumber() {
  const prefix = 'CSS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// Create shipment
app.post('/api/shipments', authenticateToken, (req, res) => {
  const {
    sender_name,
    sender_address,
    sender_email,
    sender_phone,
    receiver_name,
    receiver_address,
    receiver_email,
    receiver_phone,
    weight,
    length,
    width,
    height,
    origin,
    destination,
    estimated_delivery,
    notes
  } = req.body;

  const shipmentId = uuidv4();
  const trackingNumber = generateTrackingNumber();

  db.run(
    `INSERT INTO shipments (
      id, tracking_number, sender_name, sender_address, sender_email, sender_phone,
      receiver_name, receiver_address, receiver_email, receiver_phone,
      weight, length, width, height, origin, destination, estimated_delivery, notes, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      shipmentId, trackingNumber, sender_name, sender_address, sender_email, sender_phone,
      receiver_name, receiver_address, receiver_email, receiver_phone,
      weight, length, width, height, origin, destination, estimated_delivery, notes, req.user.id
    ],
    function(err) {
      if (err) {
        console.error('Error creating shipment:', err);
        return res.status(500).json({ error: 'Error creating shipment' });
      }

      // Add initial tracking history
      const historyId = uuidv4();
      db.run(
        `INSERT INTO tracking_history (id, shipment_id, status, location, description) VALUES (?, ?, ?, ?, ?)`,
        [historyId, shipmentId, 'pending', origin, 'Shipment created'],
        (err) => {
          if (err) {
            console.error('Error creating tracking history:', err);
          }
        }
      );

      res.status(201).json({
        message: 'Shipment created successfully',
        shipment: {
          id: shipmentId,
          tracking_number: trackingNumber,
          status: 'pending'
        }
      });
    }
  );
});

// Get all shipments
app.get('/api/shipments', authenticateToken, (req, res) => {
  const { status, search, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM shipments';
  let params = [];
  let conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (search) {
    conditions.push('(tracking_number LIKE ? OR sender_name LIKE ? OR receiver_name LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (req.user.role !== 'admin') {
    conditions.push('created_by = ?');
    params.push(req.user.id);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, shipments) => {
    if (err) {
      console.error('Error fetching shipments:', err);
      return res.status(500).json({ error: 'Error fetching shipments' });
    }
    res.json({ shipments });
  });
});

// Get shipment by tracking number (public)
app.get('/api/shipments/track/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;

  db.get('SELECT * FROM shipments WHERE tracking_number = ?', [trackingNumber], (err, shipment) => {
    if (err || !shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Get tracking history
    db.all(
      'SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY timestamp DESC',
      [shipment.id],
      (err, history) => {
        if (err) {
          console.error('Error fetching tracking history:', err);
        }
        res.json({ 
          shipment: {
            ...shipment,
            tracking_history: history || []
          }
        });
      }
    );
  });
});

// Get shipment by ID
app.get('/api/shipments/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM shipments WHERE id = ?', [id], (err, shipment) => {
    if (err || !shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && shipment.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get tracking history
    db.all(
      'SELECT * FROM tracking_history WHERE shipment_id = ? ORDER BY timestamp DESC',
      [id],
      (err, history) => {
        res.json({ 
          shipment: {
            ...shipment,
            tracking_history: history || []
          }
        });
      }
    );
  });
});

// Update shipment status
app.put('/api/shipments/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, location, description } = req.body;

  const validStatuses = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    'UPDATE shipments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating shipment' });
      }

      // Add tracking history entry
      const historyId = uuidv4();
      db.run(
        `INSERT INTO tracking_history (id, shipment_id, status, location, description) VALUES (?, ?, ?, ?, ?)`,
        [historyId, id, status, location || 'Unknown', description || `Status updated to ${status}`],
        (err) => {
          if (err) {
            console.error('Error creating tracking history:', err);
          }
        }
      );

      res.json({ message: 'Shipment status updated successfully' });
    }
  );
});

// Delete shipment (admin only)
app.delete('/api/shipments/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tracking_history WHERE shipment_id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting tracking history:', err);
    }

    db.run('DELETE FROM shipments WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error deleting shipment' });
      }
      res.json({ message: 'Shipment deleted successfully' });
    });
  });
});

// ==================== CONTACT ROUTES ====================

// Submit contact form (public)
app.post('/api/contact', [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('subject').notEmpty().withMessage('Subject required'),
  body('message').notEmpty().withMessage('Message required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;
  const messageId = uuidv4();

  db.run(
    `INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)`,
    [messageId, name, email, subject, message],
    function(err) {
      if (err) {
        console.error('Error saving contact message:', err);
        return res.status(500).json({ error: 'Error sending message' });
      }
      res.status(201).json({ message: 'Message sent successfully' });
    }
  );
});

// Get all contact messages (admin only)
app.get('/api/contact', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', [], (err, messages) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching messages' });
    }
    res.json({ messages });
  });
});

// Update message status (admin only)
app.put('/api/contact/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run(
    'UPDATE contact_messages SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating message' });
      }
      res.json({ message: 'Message status updated' });
    }
  );
});

// ==================== SETTINGS ROUTES ====================

// Get all settings (admin only)
app.get('/api/settings', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM settings', [], (err, settings) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching settings' });
    }
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json({ settings: settingsObj });
  });
});

// Update setting (admin only)
app.put('/api/settings/:key', authenticateToken, requireAdmin, (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  db.run(
    `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [key, value],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating setting' });
      }
      res.json({ message: 'Setting updated successfully' });
    }
  );
});

// ==================== STATS ROUTES ====================

// Get dashboard stats (admin only)
app.get('/api/stats', authenticateToken, requireAdmin, (req, res) => {
  const stats = {};

  // Total users
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    stats.totalUsers = row ? row.count : 0;

    // Total shipments
    db.get('SELECT COUNT(*) as count FROM shipments', [], (err, row) => {
      stats.totalShipments = row ? row.count : 0;

      // Shipments by status
      db.all('SELECT status, COUNT(*) as count FROM shipments GROUP BY status', [], (err, rows) => {
        stats.shipmentsByStatus = rows || [];

        // Recent shipments
        db.all('SELECT * FROM shipments ORDER BY created_at DESC LIMIT 5', [], (err, rows) => {
          stats.recentShipments = rows || [];

          // Recent users
          db.all('SELECT id, username, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5', [], (err, rows) => {
            stats.recentUsers = rows || [];

            res.json({ stats });
          });
        });
      });
    });
  });
});

// ==================== STATIC FILES ====================

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
