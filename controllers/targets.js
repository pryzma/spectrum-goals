/*
* controllers/targets.js
*/
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const Target = models.Target;
const auth = require('./auth');
const uuidv4 = require('uuid/v4');
const connection = require('../app/dbconn');


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

controller.getOne = (req,res) => {
   Target.findOne({ where: {id: req.params.id} }).then(target => {
        res.json(target)
        return target.get({ plain: true })
       
    });
  
}
controller.getOneById = (req,res) => {
    Target.findOne({ where: {id: req} }).then(target => {
         res.json(target)
         return target.get({ plain: true })
        
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