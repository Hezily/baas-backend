const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

//
// 🔐 AUTH (REQUIRED)
//

// ✅ Signup
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );

    res.json({
      message: 'User created ✅',
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login successful ✅',
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//
// 🔑 API KEY FEATURES (PROJECT BASED)
//

// ➤ Create API key
exports.createApiKey = async (req, res) => {
  const userId = req.user.id;
  const { project_id } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: 'project_id is required' });
  }

  try {
    const project = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [project_id, userId]
    );

    if (project.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid project' });
    }

    const apiKey = crypto.randomBytes(32).toString('hex');

    const result = await pool.query(
      'INSERT INTO api_keys (user_id, project_id, api_key) VALUES ($1, $2, $3) RETURNING id, project_id, api_key, created_at',
      [userId, project_id, apiKey]
    );

    res.json({
      message: 'API key created for project ✅',
      apiKey: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get API keys
exports.getApiKeys = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT api_keys.id, api_keys.api_key, api_keys.created_at, projects.name AS project_name
       FROM api_keys
       JOIN projects ON api_keys.project_id = projects.id
       WHERE api_keys.user_id = $1
       ORDER BY api_keys.id DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Delete API key
exports.deleteApiKey = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM api_keys WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key deleted ✅' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};