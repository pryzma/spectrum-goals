/**
* routes/categories.js
*/
'use strict';
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());

const router = express.Router();
const controller = require('../controllers/categories');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.isAuthenticated(req, res,()=>{
    controller.getAll(req, res);
  });
});

router.get('/:category', controller.isAuthenticated, (req, res) => {
  controller.isAuthenticated(req, res,()=>{
    controller.getOne(req, res);
  });
});

router.post('/', bodyParserJSON, (req, res) => {
  controller.isAuthenticated(req, res,()=>{
    controller.createCategory(req, res);
  })
});

router.put('/', bodyParserJSON, (req, res, next)  => {
  controller.isAuthenticated(req, res,()=>{
    controller.updateCategory(req, res, next);
  });
});

router.delete('/:id', bodyParserJSON, (req, res) => {
  controller.isAuthenticated(req, res,()=>{
    controller.deleteCategory(req, res);
  });
});

module.exports = router;
