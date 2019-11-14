/*
* app/routes.js
*/
module.exports = (app)=>{
  
   const routes = require('../config/app.json').server.routes;
   console.log(`\x1b[36m[config.server.routes]\x1b[0m \x1b[3mconfig/app.json\x1b[0m`)
   for(const route in routes){
       app.use(route,require(`../routes/${routes[route]}`));
       console.log('\x1b[36m',`[route]\x1b[0m \x1b[37mhttp://127.0.0.1:3000${route}\x1b[0m\x1b[36m : \x1b[3mroutes/${routes[route]}.js\x1b[0m`)
    
    }
    
}