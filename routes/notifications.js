/*
* routes/notifications.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());


      const router = express.Router();
      const controller = require('../controllers/notifications');


      