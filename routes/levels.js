/*
* routes/levels.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/levels');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.getAll(req,res);
});

router.get('/:target', controller.isAuthenticated, (req, res) => {
  controller.getTargetLevels(req,res);
});

router.post('/', bodyParserJSON, (req, res) => {
  controller.createLevel(req, res);
});

router.put('/', bodyParserJSON, (req, res, next)  => {
  controller.updateLevel(req, res, next);
});

router.delete('/:id', bodyParserJSON, (req, res) => {
  controller.deleteLevel(req, res);
});

module.exports = router;