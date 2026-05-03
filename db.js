const { Pool } = require('pg');

const isProduction = process.env.DATABASE_URL;

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: 'hezily',
        host: 'localhost',
        database: 'baas',
        password: '',
        port: 5432,
      }
);

module.exports = pool;