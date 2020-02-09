/*
* controllers/levels.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models;
const connection = require('../app/dbconn');
const Level = models.Level;
const SubLevel = models.SubLevel;
const auth = require('./auth');
const uuidv4 = require('uuid/v4');

controller.createLevel = (req,res) => {
    const level = req.body,
    uuid = uuidv4();
    level.id = uuid;
    Level.create(level).then((level)=>{
        res.json(level);
    }).catch((err)=>{
        console.log(err);
    });
}

controller.updateLevel = (req,res,next) => {
    /*Level.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated)
    })
    .catch(next);*/
    if(!Array.isArray(req.body)) {
        console.log(req.body)
        connection.query(`UPDATE Levels SET name = '${req.body.name}', sortOrder = ${req.body.sortOrder} WHERE id = '${req.body.id}';`,(err,result)=>{
            if (err) {
                console.log(err)
            } else {
                res.json(result)
            }
        })
    }else{
        const response = []
        for(const item of req.body){
            connection.query(`UPDATE Levels SET name = '${item.name}', sortOrder = ${item.sortOrder} WHERE id = '${item.id}';`,(err,result)=>{
                if (err) {
                    console.log(err)
                }else{
                    response.push(result)
                }
            })
        }
        res.json(response);
    }
}

controller.getAll = (req,res) => {
    Level.findAll({order:[['name','DESC']]}).then((items) => {
        res.json(items);
    });
}
controller.getTargetLevels = (req,res) => {
    Level.findAll({where: { target: req.params.target },order:[['sortOrder','ASC']]}).then((items) => {
        res.json(items);
    });
}

controller.deleteLevel = (req,res) => {
    Level.destroy({
        where: {id : req.params.id}
    }).then(()=>{
        SubLevel.destroy({
          where: {level : req.params.id}
        });
        controller.getAll(req,res);
    });
}

controller.isAuthenticated = auth.isAuthenticated;