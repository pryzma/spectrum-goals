/*
* app/dbconn.js
*/
'use strict';
  const mysql = require('mysql'),
        env = process.env.NODE_ENV || "development",
        config = require("../config/config")()[env],
        connection = mysql.createConnection({
          host: config.host,
          user: config.username,
          password: config.password,
          database: config.database
        });
module.exports = {
  connection : connection,
  query : (query,fields,callback)=>{
    if(typeof fields === 'object'){
      connection.query(query,fields,(err,res)=>{
        if(err){
          console.error(err);
        }else{
          if(typeof callback === 'function'){
            callback(err,res);
          }else{
            console.error('\x1b[32m',`[dbconn]\x1b[0m callback is not a function`);
          }
        }
      });
    }else{
      callback = fields;
      connection.query(query,(err,res)=>{
        if(err){
          console.error(err);
        }else{
          if(typeof callback === 'function'){
            callback(err,res);
          }else{
            console.error('\x1b[32m',`[dbconn]\x1b[0m callback is not a function`);
          }
        }
        connection.end();
      });
    }
  }
};
