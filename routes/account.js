/*
* routes/account.js
*/
'use strict';
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());

const router = express.Router();
const controller = require('../controllers/account');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.get(req,res);
});
module.exports = router;
