/*
* controllers/accounts.js
*/
'use strict';
const controller = module.exports = {};
const dbconn = require('../app/dbconn'),
      connection = dbconn.connection,
      uuidv4 = require('uuid/v4'),
      sgMail = require('@sendgrid/mail'),
      bcrypt = require('bcryptjs');

const models = require('../models').sequelize.models;
const Account = models.Account;
const Contact = models.Contact;
const Medient = models.Medient;
const auth = require('./auth');

controller.createAccount = (req,res) => {
    const account = req.body;
    const contact = {}; 
    contact.id = uuidv4();
    account.contact = contact.id;
    contact.first_name = account.firstName;
    contact.last_name = account.lastName;
    contact.email = account.email;
    Contact.create(contact);
    account.id = uuidv4
    ();
    account.password = '';
    account.isActivated = 0;
    account.createdBy = req.session.user.id;
    if(account.profile === 'medient'){
        Medient.create({
            id : uuidv4(),
            account : response.id,
            indication : response.indication.split('-')[2]+'-'+response.indication.split('-')[1]+'-'+response.indication.split('-')[0]
        });
    };
    connection.query(`SELECT * FROM Accounts WHERE username='${account.username}' OR email='${account.email}'`, (err,result) => {

        if(result.length > 0){ // result.length should be 0
            throw(`controller.createAccount : Username ${account.username} or email ${account.email} already exists`)
        }else{
            Account.create(account).then((response)=>{
        
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                  to: `${response.email}`,
                  from: `noreply@spectrumgoals.nl`,
                  subject: `Activeer je SpectrumGoals Leerdoelen Monitor Account`,
                  text: `Beste ${response.firstName},<br> ${req.session.user.firstName} ${req.session.user.lastName} heeft een account voor je aangemaakt met gebruikersnaam <b>${response.username}</b> op SpectrumGoals. Klik hieronder om je account te activeren en een wachtwoord te kiezen om je account te kunnen gebruiken.<br><br> <a href="${process.env.REF_HTTP_PROTOCOL}://${process.env.REF_URL}verify?uuid=${response.id}">Klik hier om je Account te activeren</a>`,
                  html: `<img src="${process.env.REF_HTTP_PROTOCOL}://${process.env.REF_ADR}/img/logo_lg.png"><br>Beste ${response.firstName},<br> ${req.session.user.firstName} ${req.session.user.lastName} heeft een account met gebruikersnaam <b>${response.username}</b>  voor je aangemaakt op SpectrumGoals. Klik hieronder om je account te activeren en een wachtwoord te kiezen om je account te kunnen gebruiken.<br><br> <a href="${process.env.REF_HTTP_PROTOCOL}://${process.env.REF_ADR}/verify?uuid=${response.id}">Klik hier om je Account te activeren</a>`,
                };
                sgMail.send(msg).then(() => {
                    console.log('\x1b[36m',`[controller.accounts]\x1b[0m E-mail sent to `+response.email);
                }).catch(error => {
                    console.error(error.toString());
                });
                res.json(response);
                return null;
            }).catch((err)=>{
                console.error(err);
            });
        }
    });
    

};
controller.verifyAccount = (req,res) => {

    const account_ = req.body;
    const saltRounds = 10;

    connection.query(`SELECT * FROM Accounts WHERE id='${account_.id}'`, (err,result) => {

        if(err){
            throw err;
        }
        const account = result;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(account_.password, salt, function(err, hash) {
                connection.query(`UPDATE Accounts SET password='${hash}',isActivated=1 WHERE id='${account_.id}'`, (err, result) => {

                    connection.query(`SELECT * FROM Accounts WHERE id='${account[0].createdBy}'`, (err,result) => {
                        const msg = {
                            to: `${result[0].email}`,
                            from: `noreply@spectrumgoals.nl`,
                            subject: `SpectrumGoals Account ${account[0].firstName} ${account[0].lastName} is geactiveerd `,
                            text: `Het account wat is aangemaakt voor ${account[0].firstName} ${account[0].lastName}(${account[0].email}, gebruikersnaam <b>${account[0].username}</b>) op ${account[0].createdAt} is geactiveerd en is klaar voor gebruik.`,
                            html: `<img src="${process.env.REF_HTTP_PROTOCOL}://${process.env.REF_ADR}/img/logo_lg.png"><br>Het account wat is aangemaakt voor <b>${account[0].firstName} ${account[0].lastName}</b>(${account[0].email}, gebruikersnaam <b>${account[0].username}</b>) op ${account[0].createdAt} is geactiveerd en is klaar voor gebruik. `,
                        };
                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        sgMail.send(msg);

                        res.json(account);
                    });

                });
                account_.password = hash;
            });
        });

    });

};
controller.updateAccount = (req,res,next) => {
    const account = req.body;
    let medient;
    if(account.indication){
        const indication = account.indication.split('-')[2]+'-'+account.indication.split('-')[1]+'-'+account.indication.split('-')[0]+' 03:00:00';
        medient = {
            indication : indication
        };
        delete account.indication;
    }
    Account.update(account,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        if(medient){
            Medient.update(medient,{where:{account : account.id}});
        }
        res.json(rowsUpdated);
        return null;
    })
    .catch(next);
};

controller.deleteAccount = (req,res) => {

    Account.destroy({
        where: {id :req.params.id}
    }).then(()=>{
        connection.query(`DELETE FROM Medients WHERE id='${req.params.id}'`);
        controller.getAll(req,res);
    });
};

controller.getAll = (req,res) => {
    Account.findAll({order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts);
    });
};

controller.getMedients = (req,res) => {
   connection.query('SELECT * FROM Medients LEFT JOIN Accounts ON Accounts.id = Medients.account;', (err, accounts) => {
       if(err){
            console.error(err);
       }else{
            res.json(accounts);
       }
    });
};

controller.getTeamMembers = (req,res) => {
    Account.findAll({where: {profile: 'teammember'}, order:[['id','DESC']]}).then((accounts) => {

        res.json(accounts);
    });
};

controller.getOne = (req,res) => {
    Account.findOne({ where: {id: req.params.account} }).then(account => {  
        res.json(account);
        return account.get({ plain: true });
    });
};

controller.isAuthenticated = auth.isAuthenticated;