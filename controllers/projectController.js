const pool = require('../db');

// ➤ Create project
exports.createProject = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO projects (user_id, name, usage_count) VALUES ($1, $2, 0) RETURNING *',
      [userId, name]
    );

    res.json({
      message: 'Project created ✅',
      project: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get all projects (with usage)
exports.getProjects = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
        id,
        name,
        usage_count,
        created_at
       FROM projects 
       WHERE user_id = $1 
       ORDER BY id DESC`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};