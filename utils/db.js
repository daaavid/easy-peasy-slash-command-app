"use strict";

const mysql = require("mysql");

// START MYSQL VERSION
let pool;

// If no connection is present OR if the connection encounters
// a connection lost error throw an error to halt the script and let forever
// restart it.
function mysqlConnect() {
  const p = mysql.createPool({
    connectionLimit: 5,
    debug: process.env.APP_DEBUG_SQL
      ? ["ComQueryPacket", "RowDataPacket"]
      : undefined,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: process.env.DB_RDS === "true" ? "Amazon RDS" : null
  });

  console.log("--------------->");

  console.log(
    "process.env.APP_DEBUG_SQL",
    process.env.APP_DEBUG_SQL,
    "process.env.DB_HOST",
    process.env.DB_HOST,
    "process.env.DB_USERNAME",
    process.env.DB_USERNAME,
    "process.env.DB_PASSWORD",
    process.env.DB_PASSWORD,
    "process.env.DB_DATABASE",
    process.env.DB_DATABASE,
    "process.env.DB_PORT",
    process.env.DB_PORT,
    "process.env.DB_RDS",
    process.env.DB_RDS
  );

  console.log("--------------->");

  p.getConnection((err, connection) => {
    if (err) {
      console.error("mysql connection error", err.stack);
      throw new Error("no db connection");
    }

    console.info("mysql connected as thread id %d", connection.threadId);
  });

  p.on("error", err => {
    console.log(err.code); // 'ER_BAD_DB_ERROR'
    // if lost connection, try every 5 seconds to connect again
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      throw new Error("no db connection");
    }
  });

  pool = p;
}

mysqlConnect();

function db() {
  return pool;
}

module.exports = db;
