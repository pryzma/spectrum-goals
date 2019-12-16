/** 
* controllers/categories.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Category = models.Category;
const auth = require('./auth');

controller.createCategory = (req,res) => {
    const category = req.body,
    uuid = uuidv4();
    category.id = uuid;
    Category.create(category).then((category)=>{
        res.json(category);
    }).catch((err)=>{
        console.log(err);
    });
}

controller.updateCategory = (req,res,next) => {
    Category.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated)
    })
    .catch(next);
}

controller.getAll = (req,res) => {
    Category.findAll({order:[['name','DESC']]}).then((items) => {
        res.json(items);
    });
}
controller.isAuthenticated = auth.isAuthenticated;