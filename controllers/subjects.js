/*
* controllers/subjects.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Subject = models.Subject;
const auth = require('./auth');
const uuidv4 = require('uuid/v4');

controller.createSubject = (req,res) => {
    const subject = req.body,
    uuid = uuidv4();
    subject.id = uuid;
    Subject.create(subject).then((subject)=>{
        res.json(subject);
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
        controller.getAll(req,res);
    });
}

controller.isAuthenticated = auth.isAuthenticated;