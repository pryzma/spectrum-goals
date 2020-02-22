/*
* controllers/sublevels.js
*/
'use strict';
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const SubLevel = models.SubLevel;
const auth = require('./auth');
const uuidv4 = require('uuid/v4');


controller.createSubLevel = (req,res) => {
    const sublevel = req.body,
    uuid = uuidv4();
    sublevel.id = uuid;
    SubLevel.create(sublevel).then((sublevel)=>{
        res.json(sublevel);
    }).catch((err)=>{
        console.log(err);
    });
};

controller.updateSubLevel = (req,res,next) => {
    SubLevel.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated);
    })
    .catch(next);
};

controller.getAll = (req,res) => {
    SubLevel.findAll({order:[['name','DESC']]}).then((items) => {
        res.json(items);
    });
};
controller.getLevelSubLevels = (req,res) => {
    SubLevel.findAll({where: {level: req.params.level },order:[['name','DESC']]}).then((items) => {
        res.json(items);
    });
};

controller.deleteSubLevel = (req,res) => {
    SubLevel.destroy({
        where: {id : req.params.id}
    }).then(()=>{
        controller.getAll(req,res);
    });
};

controller.isAuthenticated = auth.isAuthenticated;