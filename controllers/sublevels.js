/*
* controllers/sublevels.js
*/
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const SubLevel = models.SubLevel;
const auth = require('./auth');
const uuidv4 = require('uuid/v4');


controller.createSubLevel = (req,res) => {
    const sublevel = req.body,
    uuid = uuidv4();
    sublevel.id = uuid;
    SUbLevel.create(sublevel).then((sublevel)=>{
        res.json(sublevel);
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

controller.deleteTarget = (req,res) => {
    Target.destroy({
        where: {id : req.params.id}
    }).then(()=>{
        controller.getAll(req,res);
    });
}

controller.isAuthenticated = auth.isAuthenticated;