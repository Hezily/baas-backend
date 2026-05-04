const express = require('express');
const router = express.Router();
const pool = require('../db');

const authMiddleware = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects
} = require('../controllers/projectController');

// 🟢 Create project
router.post('/create', authMiddleware, createProject);

// 🟢 Get all projects
router.get('/', authMiddleware, getProjects);

// 🟢 Get usage for all projects 🔥
router.get('/usage/all', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT id, name, usage_count FROM projects WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get single project
router.get('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      ...result.rows[0],
      usage: result.rows[0].usage_count
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Update project
router.put('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE projects SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated ✅',
      project: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted ✅' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;