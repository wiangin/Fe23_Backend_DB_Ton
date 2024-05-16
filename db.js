// const mysql = require("mysql2");//must be installed with npm

import mysql from "mysql2/promise.js";

// Create a pool of database connections
const pool = mysql.createPool({
    host: 'localhost',
    port: '3308',
    user: 'root',
    password: '',
    database: 'skoldatabas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    rowsAsArray: true
  });

// Export a function to execute SQL queries
// module.exports = {
//     query: (sql, values) => {
//       return new Promise((resolve, reject) => {
//         pool.query(sql, values, (err, results) => {
//           if (err) {
//             return reject(err);
//           }
//           return resolve(results);
//         });
//       });
//     }
//   };

export default pool;