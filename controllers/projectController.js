const pool = require('../db');

// ➤ Create project
exports.createProject = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO projects (user_id, name) VALUES ($1, $2) RETURNING *',
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

// ➤ Get all projects
exports.getProjects = async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    'SELECT * FROM projects WHERE user_id = $1 ORDER BY id DESC',
    [userId]
  );

  res.json(result.rows);
};