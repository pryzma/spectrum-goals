/*
* app/view.js
*/
'use strict';
const expressLayouts = require('express-ejs-layouts'),
flash    = require('connect-flash'),
path = require('path');
module.exports = (app) =>{
  app.use(expressLayouts);
  app.set('../views', path.join(__dirname, '..','views'));
  app.set('view engine', 'ejs');
  app.use(flash());
  return app;
};