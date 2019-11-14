/*
* routes/accounts.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/accounts');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.getAll(req,res);
});

router.post('/', bodyParserJSON, (req, res) => {
  controller.createAccount(req,res);
});

router.delete('/',bodyParserJSON, (req,res) => {
 
  controller.deleteAccount(req,res);
});

module.exports = router;
