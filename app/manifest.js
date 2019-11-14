/*
* app/manifest.js
*/
const package = require('../package.json'),
manifest = (app)=>{
    const config = require('./config')(package,app)
    console.log('\x1b[36m',`[route]\x1b[0m \x1b[37mhttp://127.0.0.1:3000/manifest.json\x1b[0m\x1b[36m \x1b[0m`)
    app.get('/manifest.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          manifest_version : '0.0.1',
          version : config.version,
          name : config.name
        }));
      });
}
module.exports = manifest;