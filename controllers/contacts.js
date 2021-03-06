/*
* controllers/contacts.js
*/
'use strict';
const controller = module.exports = {};
const models = require('../models').sequelize.models;
const Contact = models.Contact;
const auth = require('./auth');
const uuidv4 = require('uuid');

controller.createContact = (req,res) => {
    const contact = req.body,
    uuid = uuidv4();
    contact.id = uuid;
    Contact.create(contact).then((contact)=>{
        res.json(contact);
    }).catch((err)=>{
        console.log(err);
    });
};

controller.getAll = (req,res) => {
    Contact.findAll({order:[['id','DESC']]}).then((contacts) => {
        res.json(contacts);
    });
};
controller.getMedientContacts = (req,res) => {
    Contact.findAll({where : {medient : req },order:[['id','DESC']]}).then((contacts) => {
        res.json(contacts);
    });
};

controller.getOne = (req,res) => {
    Contact.findOne(req).then(contact => {
        res.json(contact);
        return contact.get({ plain: true });
       
    });
};

controller.updateContact = (req,res,next) => {
    Contact.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated);
    })
    .catch(next);
};

controller.deleteContact = (req,res) => {
    Contact.destroy({
        where: {id : req.params.id}
    }).then(()=>{
        controller.getAll(req,res);
    });
};


controller.isAuthenticated = auth.isAuthenticated;