/*
* routes/sublevels.js
*/
'use strict';
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());

const router = express.Router();
const controller = require('../controllers/sublevels');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.getAll(req,res);
});

router.get('/:level', controller.isAuthenticated, (req, res) => {
  controller.getLevelSubLevels(req,res);
});

router.post('/', bodyParserJSON, (req, res) => {
  controller.createSubLevel(req, res);
});

router.put('/', bodyParserJSON, (req, res, next)  => {
  controller.updateSubLevel(req, res, next);
});

router.delete('/:id', bodyParserJSON, (req, res) => {
  controller.deleteSubLevel(req, res);
});

module.exports = router;
