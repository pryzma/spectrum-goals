const connection = require('../app/dbconn'),
      config = require('../app/config'),
      dotenv = require('dotenv').config(),
      express = require('express'),
      bodyParser = require('body-parser'),
      uuidv4 = require('uuid/v4'),
      sgMail = require('@sendgrid/mail'),
      app = express();
      const  bodyParserJSON = app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());

const router = express.Router();
const models = require('../models').sequelize.models
const api = () => {

}