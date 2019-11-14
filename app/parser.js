/*
* app/dev.js
*/
const cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
parser = (app)=>{
  // bodyparser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // cookieparser
  app.use(cookieParser());
}
module.exports = parser;