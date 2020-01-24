/*
* controllers/medients.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models;
const Medient = models.Medient;
const MedientTarget = models.MedientTarget;
const Target = models.Target;
const targetController = require('./targets')
const uuidv4 = require('uuid/v4')
const connection = require('../app/dbconn')

controller.getOne = (req,res) => {
    //console.log(`controller.getOne(${req})`)
    //return connection.query(`SELECT * FROM accounts WHERE id='${req}'`, (err,result) => result);
    Medient.findOne({ where: {account: req} }).then(medient => {
        return medient.get({ plain: true })
       
    })
}

controller.addTarget = (req,res) => {
    const medientTarget = req.body;
          
    medientTarget.id = uuidv4();
    MedientTarget.create(medientTarget).then((medientTarget)=>{
        res.json(medientTarget);
    }).catch((err)=>{
        console.log(err);
    });
}

controller.getTargets = (req,res) => {
    
    connection.query('SELECT * FROM MedientTargets LEFT JOIN Targets ON Targets.id=MedientTargets.target WHERE MedientTargets.medient = "'+req.params.medient+'";',(items)=>{
        res.json(items);
    });
    
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
    /*
    MedientTarget.findAll({where: {medient : req.params.medient},order:[['id','DESC']]}).then((items) => {
        const medientTargets = []
        for(const medientTarget of items){
            
        }
        res.json(items);
    });*/
}