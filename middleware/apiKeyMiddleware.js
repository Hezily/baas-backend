const pool = require('../db');

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers.authorization?.split(" ")[1];

    if (!apiKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    // 🔍 Get API key + project
    const result = await pool.query(
      "SELECT * FROM api_keys WHERE api_key = $1",
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    const keyData = result.rows[0];

    // ✅ Attach project info
    req.project = {
      project_id: keyData.project_id,
      api_key_id: keyData.id
    };

    // 🔥 INCREMENT USAGE
    await pool.query(
      "UPDATE projects SET usage_count = usage_count + 1 WHERE id = $1",
      [keyData.project_id]
    );

    next();
  } catch (err) {
    console.error("API KEY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = apiKeyMiddleware;