const { Pool } = require('pg');

const pool = new Pool({
  user: 'hezily',        // ✅ MUST match your owner
  host: 'localhost',
  database: 'baas',
  password: '',          // usually empty on Mac
  port: 5432,
});

module.exports = pool;