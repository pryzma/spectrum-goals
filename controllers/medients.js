/*
* controllers/medients.js
*/
'use strict';
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const Medient = models.Medient;
const MedientTarget = models.MedientTarget;
const uuidv4 = require('uuid/v4');
const connection = require('../app/dbconn').connection;
const auth = require('./auth');

controller.getOne = (req,res) => {
    Medient.findOne({ where: {account: req} }).then(medient => {
        res.json(medient);
        return medient.get({ plain: true });
    });
};

controller.addTarget = (req,res) => {
    const medientTarget = req.body;    
    medientTarget.id = uuidv4();
    MedientTarget.create(medientTarget).then((medientTarget)=>{
        res.json(medientTarget);
    }).catch((err)=>{
        console.error(err);
    });
};
controller.updateMedient = (req,res,next) => {
    
    Medient.update(req.body,{where: { account: req.body.id } })
    .then(function(rowsUpdated) {
        
        res.json(rowsUpdated);
    })
    .catch((err =>{
        console.error(err);
    }));
};
controller.getTargets = (req,res) => {
    
    connection.query('SELECT MedientTargets.target, Targets.name, Subjects.name FROM MedientTargets LEFT JOIN Targets ON Targets.id=MedientTargets.target LEFT JOIN Subjects ON Subjects.id=MedientTargets.subject WHERE MedientTargets.medient="'+req.params.medient+'";',(err, items)=>{
        if (!err) {
            res.json(items);
        } else {
            console.log(err);
        }
    });
    /*
    MedientTarget.belongsTo(Targets, {targetKey:'target',foreignKey: 'target'});
    Target.findAll({
        include: [{
            model: MedientTarget,
            where: {
                medient: req.params.medient
            }
        }]
    }).then((targets)=>{
        res.json(targets);
    });
    
    MedientTarget.findAll({where: {medient : req.params.medient},order:[['id','DESC']]}).then((items) => {
        const medientTargets = []
        for(const medientTarget of items){
            
        }
        res.json(items);
    });*/
};
controller.MedientPDFExport = (req,res) =>{
    const medient = controller.getOne(req,res);
    res.json(medient);
};
controller.isAuthenticated = auth.isAuthenticated;