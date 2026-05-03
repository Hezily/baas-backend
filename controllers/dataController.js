const pool = require('../db');

// ➕ CREATE DATA
const createData = async (req, res) => {
  try {
    const { collection } = req.params;
    const { json } = req.body;

    if (!json) {
      return res.status(400).json({ error: "JSON data is required" });
    }

    const result = await pool.query(
      "INSERT INTO data (project_id, collection, json_data) VALUES ($1, $2, $3) RETURNING *",
      [req.project.project_id, collection, json]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 GET DATA (with optional filter)
const getData = async (req, res) => {
  try {
    const { collection } = req.params;
    const { field, value } = req.query;

    let query = "SELECT * FROM data WHERE project_id = $1 AND collection = $2";
    let params = [req.project.project_id, collection];

    // 🔍 FILTER SUPPORT
    if (field && value) {
      query += ` AND json_data->>$3 = $4`;
      params.push(field, value);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE DATA
const updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { json } = req.body;

    const result = await pool.query(
      "UPDATE data SET json_data = $1 WHERE id = $2 RETURNING *",
      [json, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE DATA
const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM data WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createData,
  getData,
  updateData,
  deleteData
};