const express = require('express');
const router = express.Router();
const pool = require('../db');

const authMiddleware = require('../middleware/authMiddleware');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware'); // ✅ ADD THIS

const {
  createApiKey,
  getApiKeys,
  deleteApiKey
} = require('../controllers/authController');

// ✅ Debug route
router.get('/debug', (req, res) => {
  res.send('User routes working ✅');
});

// 🔒 Profile (JWT protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get users
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users ORDER BY id DESC'
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 API KEY MANAGEMENT (JWT required)
router.post('/create-api-key', authMiddleware, createApiKey);
router.get('/api-keys', authMiddleware, getApiKeys);
router.delete('/api-key/:id', authMiddleware, deleteApiKey);

// 🚀 API KEY USAGE (THIS WAS MISSING)
router.get('/data', apiKeyMiddleware, async (req, res) => {
  res.json({
    message: 'Access via API key 🚀',
    user_id: req.apiUser.user_id
  });
});

module.exports = router;