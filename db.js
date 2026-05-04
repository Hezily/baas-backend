const { Pool } = require('pg');

const isProduction = !!process.env.DATABASE_URL;

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 20, // max connections
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    : {
        user: 'hezily',
        host: 'localhost',
        database: 'baas',
        password: '',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

// 🔥 Global error handler (VERY IMPORTANT)
pool.on('error', (err) => {
  console.error('Unexpected DB error:', err);
  process.exit(1);
});

module.exports = pool;