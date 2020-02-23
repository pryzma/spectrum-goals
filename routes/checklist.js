/*
* routes/checklist.js
*/
'use strict';
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/checklist');
router.get('/', controller.isAuthenticated, (req, res) => {
    controller.getAll(req,res);
});
module.exports = router;
