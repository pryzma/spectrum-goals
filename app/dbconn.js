/*
* app/dbconn.js
*/
'use strict';
  const mysql = require('mysql'),
        env = process.env.NODE_ENV || "development",
        config = require("../config/config")()[env];

  const connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
  });
  connection.connect((err) => {
    if (err) {
      throw err;
    }
    else {
      //console.log('\x1b[1m\x1b[32m',`db ${config.database} mysql.createConnection() OK\x1b[0m`)
    }
  });


module.exports = connection;
