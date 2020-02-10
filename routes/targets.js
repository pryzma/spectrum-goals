/*
* routes/targets.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/targets');
const medientTargetsController = require('../controllers/medients');
router.get('/', controller.isAuthenticated, (req, res) => {
  controller.getAll(req,res);
});
router.get('/medient/:medient', controller.isAuthenticated, (req, res) => {
  medientTargetsController.getTargets(req,res);
});
router.get('/:id', controller.isAuthenticated, (req, res) => {
  controller.getOne(req,res);
});

router.post('/', bodyParserJSON, (req, res) => {
  controller.createTarget(req, res);
});

router.put('/', bodyParserJSON, (req, res, next)  => {
  controller.updateTarget(req, res, next);
});

router.delete('/:id', bodyParserJSON, (req, res) => {
  controller.deleteTarget(req, res);
});

module.exports = router;