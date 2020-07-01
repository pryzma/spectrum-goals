/*
* routes/targets.js
*/
'use strict';
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/medients');
router.post('/target/add', bodyParserJSON, (req, res) => {
  controller.addTarget(req, res);
});
router.put('/', bodyParserJSON, (req, res, next) => {
  controller.updateMedient(req,res, next);
});
router.get('/pdf/:medient', controller.isAuthenticated, (req, res) => {
  controller.MedientPDFExport(req,res);
});
module.exports = router;
