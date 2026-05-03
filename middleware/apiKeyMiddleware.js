const pool = require('../db');

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers.authorization?.split(" ")[1];

    if (!apiKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    const result = await pool.query(
      "SELECT * FROM api_keys WHERE api_key = $1",
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    req.project = result.rows[0];
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = apiKeyMiddleware;