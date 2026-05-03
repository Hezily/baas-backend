const pool = require('../db');

// ➕ CREATE DATA (with collection)
const createData = async (req, res) => {
  const { collection } = req.params;
  const { json } = req.body;

  const result = await pool.query(
    "INSERT INTO data (project_id, collection, json_data) VALUES ($1, $2, $3) RETURNING *",
    [req.project.project_id, collection, json]
  );

  res.json(result.rows[0]);
};

// 📥 GET DATA (by collection)
const getData = async (req, res) => {
  const { collection } = req.params;

  const result = await pool.query(
    "SELECT * FROM data WHERE project_id = $1 AND collection = $2",
    [req.project.project_id, collection]
  );

  res.json(result.rows);
};

module.exports = { createData, getData };