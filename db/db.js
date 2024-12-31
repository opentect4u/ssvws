// const mysql = require("mysql");
const mysql = require("mysql2");
require('dotenv').config()

// LOCAL //
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
});

// const db = mysql.createPool({
//   connectionLimit: 10,
//   host: "202.21.38.178",
//   user: "root",
//   password: "root",
//   database: "ssvws",
// });

db.getConnection((err, connection) => {
  if (err) console.log(err);
  connection.release();
  return;
});

module.exports = db;
