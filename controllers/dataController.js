const pool = require('../db');

const createData = async (req, res) => {
  const { json } = req.body;

  const result = await pool.query(
    "INSERT INTO data (project_id, json_data) VALUES ($1, $2) RETURNING *",
    [req.project.project_id, json]
  );

  res.json(result.rows[0]);
};

const getData = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM data WHERE project_id = $1",
    [req.project.project_id]
  );

  res.json(result.rows);
};

module.exports = { createData, getData };