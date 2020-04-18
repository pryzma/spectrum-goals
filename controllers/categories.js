/**
* controllers/categories.js
*/
'use strict';
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const Category = models.Category;
const auth = require('./auth');
const uuidv4 = require('uuid/v4');

controller.getAll = (req,res) => {
    Category.findAll({order:[['name','DESC']]}).then((categories) => {
        res.json(categories);
    });
};

controller.getOne = (req,res) => {
    Category.findOne({ where: {id: req.params.category} }).then(category => { 
        res.json(category);
        return category.get({ plain: true });
    });
};

controller.createCategory = (req,res) => {
    const category = req.body,
    uuid = uuidv4();
    category.id = uuid;
    Category.create(category).then((category)=>{
        res.json(category);
    }).catch((err)=>{
        console.log(err);
    });
};

controller.updateCategory = (req,res,next) => {
    Category.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated);
    })
    .catch(next);
};

controller.deleteCategory = (req,res) => {
    Category.destroy({
        where: {id : req.params.id}
    }).then(()=>{
        controller.getAll(req,res);
    });
};

controller.isAuthenticated = auth.isAuthenticated;
