/*
* app/dev.js
*/

const morgan = require('morgan'),
dotenv = require('dotenv').config(),
jshint = require('jshint'),
dev = (app)=>{ 
  package = require('../package.json')
  config = require('./config')(package,app)
  
  morgan(function (tokens, req, res) {
      
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  })
  const env = process.env.NODE_ENV || "development";
  if(config.npm_lifecycle_event === 'dev') app.use(morgan('dev')); // log requests

}
module.exports = dev;