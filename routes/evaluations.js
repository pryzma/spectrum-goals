/*
* routes/evaluations.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/evaluations');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.getAll(req,res);
});

router.get('/medient/:medient', controller.isAuthenticated, (req, res) => {
  controller.getMedientEvaluations(req,res);
});

router.get('/target/:target', controller.isAuthenticated, (req, res) => {
  controller.getMedientEvaluations(req,res);
});

router.post('/', bodyParserJSON, (req, res) => {
  controller.createEvaluation(req, res);
});

router.put('/', bodyParserJSON, (req, res, next)  => {
  controller.updateEvaluation(req, res, next);
});

router.delete('/:id', bodyParserJSON, (req, res) => {
  controller.deleteEvaluation(req, res);
});

module.exports = router;