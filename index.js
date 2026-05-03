require('dotenv').config();

const express = require('express');
const pool = require('./db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const dataRoutes = require('./routes/dataRoutes'); // 🆕 ADD THIS

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: "OK ✅",
      message: 'BaaS MVP running 🚀',
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Test route
app.get('/test', (req, res) => {
  res.send('Test route working ✅');
});

// 🔐 Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/data', dataRoutes); // 🆕 ADD THIS

// ❗ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found ❌' });
});

// ❗ Error handler
app.use((err, req, res, next) => {
  console.error("ERROR 👉", err.stack);
  res.status(500).json({ error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} 🚀`);
});