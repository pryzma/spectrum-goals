/*
* controllers/evaluations.js
*/
'use strict';
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const connection = require('../app/dbconn');
const uuidv4 = require('uuid/v4');
const auth = require('./auth');

const Evaluation = models.Evaluation;
controller.createEvaluation = (req,res) => {
  const evaluation = req.body,
  uuid = uuidv4();
  
  evaluation.id = uuid;
  evaluation.createdBy = req.session.user.id;
  evaluation.date = new Date();
  //evaluation.date = evaluation.date.split('-')[2]+'-'+evaluation.date.split('-')[1]+'-'+evaluation.date.split('-')[0]+' 03:00:00'
  Evaluation.create(evaluation).then((evaluation)=>{
      res.json(evaluation);
  }).catch((err)=>{
      console.log(err);
  });
};

controller.updateEvaluation = (req,res,next) => {
  /*Level.update(req.body,{where: { id: req.body.id } })
  .then(function(rowsUpdated) {
      res.json(rowsUpdated)
  })
  .catch(next);*/
  connection.query(`UPDATE Evaluations SET evaluation = '${req.body.evaluation}' WHERE id = '${req.body.id}'`,(err,result)=>{
      res.json(result);
  });
};

controller.getAll = (req,res) => {
  Evaluation.findAll({order:[['date','DESC']]}).then((items) => {
      res.json(items);
  });
};

controller.getMedientEvaluations = (req,res) => {
  Evaluation.findAll({where: { medient: req.params.medient },order:[['date','DESC']]}).then((items) => {
      res.json(items);
  });
};


controller.getTargetEvaluations = (req,res) => {
  Evaluation.findAll({where: { target: req.params.target },order:[['date','DESC']]}).then((items) => {
      res.json(items);
  });
};


controller.deleteEvaluation = (req,res) => {
  Evaluation.destroy({
      where: {id : req.params.id}
  }).then(()=>{
      controller.getAll(req,res);
  });
};

controller.isAuthenticated = auth.isAuthenticated;