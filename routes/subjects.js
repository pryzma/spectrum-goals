/*
* routes/subjects.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
const router = express.Router();
const controller = require('../controllers/subjects');

router.get('/', controller.isAuthenticated, (req, res) => {
    controller.getAll(req,res);
});


router.post('/', bodyParserJSON, (req, res) => {
  controller.createSubject(req, res);
});

router.put('/', bodyParserJSON, (req, res, next)  => {
  controller.updateSubject(req, res, next);
});

router.delete('/:id', bodyParserJSON, (req, res) => {
  controller.deleteSubject(req, res);
});

module.exports = router;