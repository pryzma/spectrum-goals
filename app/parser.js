/*
* app/dev.js
*/
'use strict';
const cookieParser = require('cookie-parser'),
bodyParser = require('body-parser');
module.exports = (app)=>{
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
};
