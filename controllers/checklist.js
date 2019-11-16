/*
* controllers/checklist.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Checklist = models.Checklist;
const auth = require('./auth')