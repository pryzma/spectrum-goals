/*
* controllers/targets.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Target = models.Target;
const auth = require('./auth');


controller.createTarget = (req,res) => {
    const target = req.body,
    uuid = uuidv4();
    target.id = uuid;
    Target.create(target).then((target)=>{
        res.json(target);
    }).catch((err)=>{
        console.log(err);
    });
}

controller.updateTarget = (req,res,next) => {
    Target.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated)
    })
    .catch(next);
}

controller.getAll = (req,res) => {
    Target.findAll({order:[['name','DESC']]}).then((items) => {
        res.json(items);
    });
}



controller.isAuthenticated = auth.isAuthenticated;