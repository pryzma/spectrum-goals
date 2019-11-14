const connection = require('../app/dbconn'),
      dotenv = require('dotenv').config(),
      express = require('express'),
      bodyParser = require('body-parser'),
      uuidv4 = require('uuid/v4'),
      sgMail = require('@sendgrid/mail'),
      flash = require('connect-flash'),
      crypto = require('crypto'),
      controller = require('../controllers/accounts')
      app = express();
      app.use(bodyParser.urlencoded({extended : true}));
      const bodyParserJSON = app.use(bodyParser.json());
      const router = express.Router();
app.use(flash());
app.set('view engine', 'ejs');
router.get('/',(req,res)=>{
    const uuid = req.query.uuid;

    connection.query(`SELECT * FROM accounts WHERE id='${uuid}'`, (err, account) => {
        console.log(account)
        if(account.length > 0){ 
            res.render('activate',{
                name : 'Agenda Manager', 
                uuid : uuid,
                firstName : account[0].firstName,
                lastName : account[0].lastName,
                createdBy : account[0].createdBy
            });
        }else { // uuid is not found in database
            
            res.end('Account not found!');
        }
    });

});

function getAccount(id){
    const account = controller.getOne(id)
    console.log(`getAccount('${id}') : ${account}`)
    return account
       
 
}
router.post('/', bodyParserJSON, (req, res) => controller.verifyAccount(req,res))
/*
router.post('/', bodyParserJSON, (req, res) => {// save data from form to database 
    const account = req.body;
    
    account.salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6'+account.password;
    account.password = crypto.createHash('sha1').update(account.salt).digest('hex');
    connection.query(`UPDATE accounts SET firstName='${account.firstName}',lastName='${account.lastName}',password='${account.password}',isActivated=1 WHERE id='${account.id}'`, (err, result) => {
       
        if (!err) {
            
            
            const accountCreatedBy = getAccount(account.createdBy)
            console.log(`getAccount(req.body.createdBy) : ${JSON.stringify(accountCreatedBy)}`)
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
          } else {
           throw err;
          }
    });
    
});
*/
module.exports = router


