const morgan = require('morgan');
const pool = require('../db');

// Створення власного формату для логів
const streamToDb = async (tokens, req, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = parseInt(tokens.status(req, res));
    const contentLength = parseInt(tokens.res(req, res, 'content-length')) || 0;
    const responseTime = parseFloat(tokens['response-time'](req, res)); // <== ось він!
  
    try {
      await pool.query(
        `INSERT INTO logs (method, path, status, content_length, response_time)
         VALUES ($1, $2, $3, $4, $5)`,
        [method, url, status, contentLength, responseTime]
      );
    } catch (err) {
      console.error('Error logging to DB:', err.message);
    }
  };
  
  // обгортка в morgan
  const morganToDbMiddleware = morgan((tokens, req, res) => {
    streamToDb(tokens, req, res);
});

// Повертаємо мідлвар для використання в додатку
module.exports = morganToDbMiddleware;
