/*
* app/config.js
*/
const _config = require('../config/app.json');
function config(package,app){
  //console.log('\x1b[36m',`[route]\x1b[0m \x1b[37mhttp://127.0.0.1:3000/config\x1b[0m\x1b[36m \x1b[0m`)
  _config.ref_adr = process.env.REF_ADR;
  _config.version = require('../package.json').version;
  _config.npm_lifecycle_event = process.env.npm_lifecycle_event;
  _config.ref_ws_port = process.env.REF_WS_PORT;
  //console.log(process.env.REF_WS_PORT);
  const models = require('../models');


    _config.models ={}
    for(let model of Object.getOwnPropertyNames(models.sequelize.models)){
      _config.models[model] = models[model].rawAttributes
    }


  return _config;
}
module.exports = config;
