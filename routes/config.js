'use strict';
const config = require('../app/config'),
      dotenv = require('dotenv').config(),
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
    obj.ref_adr = process.env.REF_ADR;
    obj.ref_ws_protocol = process.env.REF_WS_PROTOCOL;
    obj.ref_ws_port = process.env.REF_WS_PORT;
    res.json(obj);
});
module.exports = router;
