/*
* controllers/subjects.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Subject = models.Subject;
const Target = models.Target;
const Level = models.Level;
const SubLevel = models.SubLevel;
const auth = require('./auth');
const uuidv4 = require('uuid/v4');

controller.createSubject = (req,res) => {
    const subject = req.body
  
    if(!subject.id) subject.id = uuidv4();
    Subject.create(subject).then((subject)=>{
        console.log(subject.dataValues)
        res.json(subject.dataValues);
    }).catch((err)=>{
        console.log(err);
    });
}

controller.updateSubject = (req,res,next) => {
    Subject.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated)
    })
    .catch(next);
}

controller.getAll = (req,res) => {
    Subject.findAll({order:[['name','DESC']]}).then((items) => {
        res.json(items);
    });
}

controller.deleteSubject = (req,res) => {
    Subject.destroy({
        where: {id : req.params.id}
        
    }).then(()=>{
        Target.destroy({
            where: {subject : req.params.id}
        }).then(()=>{
            Level.destroy({
                where: {target : req.params.id}
            }).then(()=>{
                SubLevel.destroy({
                    where: {level : req.params.id}
                })
            })
            
        })
        
        controller.getAll(req,res);
    });
}

controller.isAuthenticated = auth.isAuthenticated;