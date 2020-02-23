/*
* app/dev.js
*/
'use strict';
const morgan = require('morgan');
module.exports = (app)=>{ 
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ');
  });
  if(process.env.npm_lifecycle_event === 'dev') { app.use(morgan('dev')); }
};