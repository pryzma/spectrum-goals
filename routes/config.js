const config = require('../app/config'),
      express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
router.get('/', controller.isAuthenticated, (req, res) => {
    
    const _config = config(),
    obj = _config.client;
    //console.log(_config)
    obj.models = _config.models;
    obj.user = req.session.user;
    obj.name = _config.name;
    obj.version = _config.version;
    res.json(obj)
});
module.exports = router;