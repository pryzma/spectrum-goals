/*
* controllers/subjects.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Subject = models.Subject;
const auth = require('./auth')