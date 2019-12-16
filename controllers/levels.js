/*
* controllers/levels.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Level = models.Level;
const auth = require('./auth');


controller.createLevel = (req,res) => {
    const level = req.body,
    uuid = uuidv4();
    level.id = uuid;
    Level.create(level).then((level)=>{
        res.json(level);
    }).catch((err)=>{
        console.log(err);
    });
}

controller.updateLevel = (req,res,next) => {
    Level.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated)
    })
    .catch(next);
}

controller.getAll = (req,res) => {
    Level.findAll({order:[['name','DESC']]}).then((items) => {
        res.json(items);
    });
}

controller.isAuthenticated = auth.isAuthenticated;