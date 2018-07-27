"use strict";

const mysql = require("mysql");
const log = require("./logging-util");

// START MYSQL VERSION
let connection;

// If no connection is present OR if the connection encounters
// a connection lost error throw an error to halt the script and let forever
// restart it.
mysqlConnect = () => {
  const c = mysql.createConnection({
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

  c.connect(err => {
    if (err) {
      log.error("mysql connection error", err.stack);
      throw new Error("no db connection");
      return false;
    }

    log.info("mysql connected as thread id %d", c.threadId);
  });

  c.on("error", err => {
    console.log(err.code); // 'ER_BAD_DB_ERROR'
    // if lost connection, try every 5 seconds to connect again
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      throw new Error("no db connection");
    }
  });

  connection = c;
};

mysqlConnect();

function db() {
  return connection;
}

module.exports = db;
