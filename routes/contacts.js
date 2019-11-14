/*
* routes/contacts.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/contacts');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.getAll(req,res);
});

router.get('/:id', controller.isAuthenticated, (req, res) => {
  controller.getOne(req.id);
});
router.post('/', bodyParserJSON, (req, res) => {
  controller.createContact(req,res);
});

module.exports = router;
