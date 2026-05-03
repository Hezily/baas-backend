require('dotenv').config();

const express = require('express');
const pool = require('./db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// ✅ Middleware (ORDER MATTERS)
app.use(cors());              // 👈 MUST BE HERE
app.use(express.json());      // 👈 BEFORE routes

// ✅ Debug logs
console.log('AuthRoutes loaded:', typeof authRoutes);
console.log('UserRoutes loaded:', typeof userRoutes);
console.log('ProjectRoutes loaded:', typeof projectRoutes);

// ✅ DB connection test
pool.connect()
  .then(() => console.log('DB connected ✅'))
  .catch(err => console.error('DB connection error ❌', err));

// ✅ Root route
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'BaaS MVP running 🚀',
      time: result.rows[0]
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

// ❗ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found ❌' });
});

// ❗ Error handler
app.use((err, req, res, next) => {
  console.error("ERROR 👉", err);
  res.status(500).json({ error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});