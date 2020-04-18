/*
* controllers/checklist.js
*/
'use strict';
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const Checklist = models.Checklist;
const auth = require('./auth');

controller.getAll = (req,res) => {
    Checklist.findAll({order:[['id','DESC']]}).then((checklists) => {
        res.json(checklists);
    });
};

controller.getOne = (req,res) => {
    Checklist.findOne({ where: {id: req.params.checklist} }).then(checklist => { 
        res.json(checklist);
        return checklist.get({ plain: true });
    });
};

controller.createChecklist = (req,res) => {
    const checklist = req.body,
    uuid = uuidv4();
    checklist.id = uuid;
    Checklist.create(checklist).then((checklist)=>{
        res.json(checklist);
    }).catch((err)=>{
        console.log(err);
    });
};

controller.updateChecklist = (req,res,next) => {
    Checklist.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated);
    })
    .catch(next);
};


controller.isAuthenticated = auth.isAuthenticated;