const mysql = require("mysql2");//must be installed with npm

// Create a pool of database connections
const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'gritacademy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  // Export a function to execute SQL queries
module.exports = {
    query: (sql, values) => {
      return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      });
    }
  };