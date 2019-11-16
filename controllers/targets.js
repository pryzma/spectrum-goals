/*
* controllers/targets.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Target = models.Target;
const auth = require('./auth')