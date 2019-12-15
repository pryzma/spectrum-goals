/*
* app/dev.js
*/

const morgan = require('morgan');
dev = (app)=>{ 
  
  const config = require('./config');
  
  morgan(function (tokens, req, res) {
      
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  })
  if(config.npm_lifecycle_event === 'dev') { app.use(morgan('dev')); } 

}
module.exports = dev;