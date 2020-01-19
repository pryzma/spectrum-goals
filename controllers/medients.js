/*
* controllers/medients.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models;
const Medient = models.Medient;
const MedientTarget = models.MedientTarget;
const targetController = require('./targets')
const uuidv4 = require('uuid/v4')

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
    MedientTarget.findAll({where: {medient : req.params.medient},order:[['id','DESC']]}).then((items) => {
        const medientTargets = []
        for(const medientTarget of items){
            //medientTargets.push(targetController.getOneById(medientTarget.target,res))
        }
        res.json(items);
    });
}