/*
* controllers/accounts.js
*/
const controller = module.exports = {}
const connection = require('../app/dbconn'),
      uuidv4 = require('uuid/v4'),
      sgMail = require('@sendgrid/mail'),
      crypto = require('crypto');
      
const models = require('../models').sequelize.models;
const Account = models.account;
const Contact = models.Contact;

const auth = require('./auth')
controller.createAccount = (req,res) => {
    
    const account = req.body
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
          from: `noreply@agendamanager.nl`,
          subject: `Registration at agendamanager.nl`,
          text: `Someone has invited you to join Agenda Manager. Visit agendamanager.nl/verify and paste the following code: ${account.id}`,
          html: `<div><img src="https://dev.agendamanager.nl/img/logo_sm_300.png" style="margin:auto;" /></div>${req.session.user.firstName} ${req.session.user.lastName} has invited you to join Agenda Manager. Visit <a href="${process.env.REF_HTTP_PROTOCOL}://${process.env.REF_URL}verify?uuid=${account.id}">agendamanager.nl/verify</a> and paste the following code: <br><strong>${account.id}</strong>`,
        }
        sgMail.send(msg);
        res.json(account);
    
    }).catch((err)=>{
        console.log(err)
    });

}
controller.verifyAccount = (req,res) => {

    const account_ = req.body;
    account_.salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6'+account_.password;
    account_.password = crypto.createHash('sha1').update(account_.salt).digest('hex');

    connection.query(`SELECT * FROM accounts WHERE id='${account_.id}'`, (err,result) => {
        //console.log(result)
        if(err){
            throw err
        }
        const account = result
        console.log(account)
        connection.query(`UPDATE accounts SET password='${account_.password}',isActivated=1 WHERE id='${account_.id}'`, (err, result) => {
            //console.log(account[0])
            const accountCreatedBy = connection.query(`SELECT * FROM accounts WHERE id='${account[0].createdBy}'`, (err,result) => {
                const msg = {
                    to: `${result[0].email}`,
                    from: `noreply@agendamanager.nl`,
                    subject: `Agendamanager account ${account[0].firstName} ${account[0].lastName} has been activated `,
                    text: `The account you created for ${account[0].firstName} ${account[0].lastName}(${account[0].email}) on ${account[0].createdAt} has been activated`,
                    html: `The account you created for ${account[0].firstName} ${account[0].lastName}(${account[0].email}) on ${account[0].createdAt} has been activated `,
                }
                console.log(msg)
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(msg);
                
                res.json(account)
            });
            //console.log(accountCreatedBy)

        });
    });
    
    
    
    /*Account.findOne({ where: {id: account_.id} }).then(account => {
        //console.log(account.dataValues)
        account = account.dataValues;
        Account.update(
            {password : account_.password,isActivated : 1},
            {
                returning : true,
                plain : true,
                where: { id: account.id } 
            }
        ).then(function(updatedAccount) {
            //callback(account);
            console.log(updatedAccount)
        });

        /*
        controller.updateAccount(account.id,{
            password : account_.password,
            isActivated : 1
        },(account) => {
            Account.findOne({ where: {id: account.createdBy} }).then(accountCreatedBy => {
                accountCreatedBy = accountCreatedBy.get({ plain: true })
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send({
                    to: `${accountCreatedBy.email}`,
                    from: `noreply@agendamanager.nl`,
                    subject: `Agendamanager account ${account.firstName} ${account.lastName} has been activated `,
                    text: ``,
                    html: `The account you created for ${account.firstName} ${account.lastName}(${account.email}) on ${account.createdAt} has been activated `,
                });
            });
        },(account) =>{
            res.json(account)
        })
        */
    /*});
    
    connection.query(`UPDATE accounts SET firstName='${account.firstName}',lastName='${account.lastName}',password='${account.password}',isActivated=1 WHERE id='${account.id}'`, (err, result) => {
       
        if (!err) {
       
            const accountCreatedBy = controller.getOne(account.createdBy)
            //console.log(`getAccount(req.body.createdBy) : ${JSON.stringify(accountCreatedBy)}`)
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: `${accountCreatedBy.email}`,
                from: `noreply@agendamanager.nl`,
                subject: `Agendamanager account ${account.firstName} ${account.lastName} has been activated `,
                text: ``,
                html: `The account you created for ${account.firstName} ${account.lastName}(${account.email}) on ${account.createdAt} has been activated `,
            }
            sgMail.send(msg);
            res.end(JSON.stringify(account));
        }
    });
    */
}
controller.updateAccount = (id,update,callback) => {
    Account.update(update,{returning : true,where: { id: id } })
    .then(function([rowsUpdate,[account]]) {
        callback(account);
    });
}

controller.deleteAccount = (req,res) => {
    Account.destroy({
        where: req.body
    }).then(()=>{
        controller.getAll(req,res);
    });
}

controller.getAll = (req,res) => {
    Account.findAll({order:[['id','DESC']]}).then((accounts) => {
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