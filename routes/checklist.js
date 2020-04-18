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
    controller.isAuthenticated(req, res,()=>{
        controller.getAll(req,res);
    });
});
router.get('/:category', controller.isAuthenticated, (req, res) => {
    controller.isAuthenticated(req, res,()=>{
        controller.getOne(req, res);
    });  
});

router.post('/', bodyParserJSON, (req, res) => {
    controller.isAuthenticated(req, res,()=>{
        controller.createChecklist(req, res);
    });
});

router.put('/', bodyParserJSON, (req, res, next)  => {
    controller.isAuthenticated(req, res,()=>{
        controller.updateChecklist(req, res, next);
    });
});

router.delete('/:id', bodyParserJSON, (req, res) => {
    controller.isAuthenticated(req, res,()=>{
        controller.deleteChecklist(req, res);
    });
});
module.exports = router;
