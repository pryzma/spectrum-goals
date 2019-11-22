/*
* controllers/targets.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Target = models.Target;
const auth = require('./auth');


controller.getAll = (req,res) => {
    Target.findAll({order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts);
    });
}
controller.isAuthenticated = auth.isAuthenticated;