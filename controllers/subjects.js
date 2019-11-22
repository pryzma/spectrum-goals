/*
* controllers/subjects.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Subject = models.Subject;
const auth = require('./auth');

controller.getAll = (req,res) => {
    Subject.findAll({order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts);
    });
}
controller.isAuthenticated = auth.isAuthenticated;