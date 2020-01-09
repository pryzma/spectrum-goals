/*
* controllers/medients.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models;
const Medient = models.Medient;
const MedientTarget = models.MedientTarget;

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