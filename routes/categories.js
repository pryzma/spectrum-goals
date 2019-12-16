/**
* routes/categories.js
*/
const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();
      app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());

const router = express.Router();
const controller = require('../controllers/categories');

router.get('/', controller.isAuthenticated, (req, res) => {
  controller.getAll(req, res);
});

router.post('/', bodyParserJSON, (req, res) => {
  controller.createCategory(req, res);
});

router.put('/', bodyParserJSON, (req, res, next)  => {
  controller.updateCategory(req, res, next);
});

router.delete('/:id', bodyParserJSON, (req, res) => {
  controller.deleteCategory(req, res);
});

module.exports = router;
