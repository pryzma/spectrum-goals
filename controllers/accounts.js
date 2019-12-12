/*
* controllers/accounts.js
*/
const controller = module.exports = {}
const connection = require('../app/dbconn'),
      uuidv4 = require('uuid/v4'),
      sgMail = require('@sendgrid/mail'),
      bcrypt = require('bcrypt');
      
const models = require('../models').sequelize.models;
const Account = models.Account;
const Contact = models.Contact;

const auth = require('./auth')
controller.createAccount = (req,res) => {
    
    const account = req.body
    console.log(req.body)
    const contact = {} // create contact
    contact.id = uuidv4();
    account.contact = contact.id;
    contact.first_name = account.firstName;
    contact.last_name = account.lastName;
    contact.email = account.email;
    Contact.create(contact);
    account.id = uuidv4();
    account.password = '';
    account.isActivated = 0;
    account.createdBy = req.session.user.id;
    
    Account.create(account).then((account)=>{
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: `${account.email}`,
          from: `noreply@spectrumgoals.nl`,
          subject: `Activeer je SpectrumGoals Leerdoelen Monitor Account`,
          text: `Beste ${account.firstName},<br> ${req.session.user.firstName} ${req.session.user.lastName} heeft een account voor je aangemaakt op SpectrumGoals. Klik hieronder om je account te activeren en een wachtwoord te kiezen om je account te kunnen gebruiken.<br><br> <a href="${process.env.REF_HTTP_PROTOCOL}://${process.env.REF_URL}verify?uuid=${account.id}">Klik hier om je Account te activeren</a>`,
          html: `Beste ${account.firstName},<br> ${req.session.user.firstName} ${req.session.user.lastName} heeft een account voor je aangemaakt op SpectrumGoals. Klik hieronder om je account te activeren en een wachtwoord te kiezen om je account te kunnen gebruiken.<br><br> <a href="${process.env.REF_HTTP_PROTOCOL}://${process.env.REF_URL}verify?uuid=${account.id}">Klik hier om je Account te activeren</a>`,
        }
        sgMail.send(msg).then(() => {
            console.log('E-mail sent to '+account.email);
        }).catch(error => {

            //Log friendly error
            console.error(error.toString());
        
            //Extract error msg
            const {message, code, response} = error;
        
            //Extract response msg
            const {headers, body} = response;
        });
        res.json(account);
    
    }).catch((err)=>{
        console.log(err);
    });

}
controller.verifyAccount = (req,res) => {

    const account_ = req.body;
    const saltRounds = 10;
    const myPlaintextPassword = 'kmfHz2FU3B2dSPrC';
    const someOtherPlaintextPassword = 'not_bacon';

    connection.query(`SELECT * FROM Accounts WHERE id='${account_.id}'`, (err,result) => {
        
        if(err){
            throw err
        }
        const account = result
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
                connection.query(`UPDATE Accounts SET password='${hash}',isActivated=1 WHERE id='${account_.id}'`, (err, result) => {
                    
                    const accountCreatedBy = connection.query(`SELECT * FROM Accounts WHERE id='${account[0].createdBy}'`, (err,result) => {
                        const msg = {
                            to: `${result[0].email}`,
                            from: `noreply@spectrumgoals.nl`,
                            subject: `SpectrumGoals Account ${account[0].firstName} ${account[0].lastName} is geactiveerd `,
                            text: `Het account wat is aangemaakt voor ${account[0].firstName} ${account[0].lastName}(${account[0].email}) op ${account[0].createdAt} is geactiveerd en is klaar voor gebruik.`,
                            html: `Het account wat is aangemaakt voor <b>${account[0].firstName} ${account[0].lastName}</b>(${account[0].email}) op ${account[0].createdAt} is geactiveerd en is klaar voor gebruik. `,
                        }
                        console.log()
                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        sgMail.send(msg);
                        
                        res.json(account)
                    });
                   
        
                });
                account_.password = hash
            });
        });
        
    });
    
}
controller.updateAccount = (req,res,next) => {
   
    Account.update(req.body,{where: { id: req.body.id } })
    .then(function(rowsUpdated) {
        res.json(rowsUpdated)
    })
    .catch(next);
}

controller.deleteAccount = (req,res) => {
   
    Account.destroy({
        where: {id :req.params.id}
    }).then(()=>{
        controller.getAll(req,res);
    });
}

controller.getAll = (req,res) => {
    Account.findAll({order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts)
    });
}

controller.getMedients = (req,res) => {
    Account.findAll({where: {profile: 'medient'}, order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts)
    });
}

controller.getTeamMembers = (req,res) => {
    Account.findAll({where: {profile: 'teammember'}, order:[['id','DESC']]}).then((accounts) => {
        res.json(accounts)
    });
}

controller.getOne = (req,res) => {
    console.log(`controller.getOne(${req})`)
    //return connection.query(`SELECT * FROM accounts WHERE id='${req}'`, (err,result) => result);
    Account.findOne({ where: {id: req} }).then(account => {
        return account.get({ plain: true })
       
    })
}

controller.isAuthenticated = auth.isAuthenticated;