/*
* controllers/contacts.js
*/
const controller = module.exports = {}
const models = require('../models').sequelize.models
const Contact = models.Contact;
const auth = require('./auth')

controller.createContact = (req,res) => {
    const contact = req.body,
    uuid = uuidv4();
    contact.id = uuid
    Contact.create(contact).then((contact)=>{
        res.json(contact);
    }).catch((err)=>{
        console.log(err)
    })
}

controller.getAll = (req,res) => {
    Contact.findAll({order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts)
    });
}


controller.getOne = (req,res) => {
    Contact.findOne(req).then(contact => {
        res.json(contact)
        return contact.get({ plain: true })
       
    });
}

controller.updateContact = (req,res) => {

}

controller.isAuthenticated = auth.isAuthenticated;