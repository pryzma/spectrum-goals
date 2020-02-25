/*
* controllers/checklist.js
*/
'use strict';
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const Checklist = models.Checklist;
const auth = require('./auth');

controller.getAll = (req,res) => {
    Checklist.findAll({order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts);
    });
};
controller.isAuthenticated = auth.isAuthenticated;