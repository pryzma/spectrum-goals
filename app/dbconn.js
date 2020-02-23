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


module.exports = connection;
