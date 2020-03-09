'use strict';
const connection = require('../app/dbconn').connection,
      express = require('express'),
      bodyParser = require('body-parser'),
      flash = require('connect-flash'),
      controller = require('../controllers/accounts'),
      app = express();
      app.use(bodyParser.urlencoded({extended : true}));
      const bodyParserJSON = app.use(bodyParser.json());
      const router = express.Router();
app.use(flash());
app.set('view engine', 'ejs');
router.get('/',(req,res)=>{
    const uuid = req.query.uuid;

    connection.query(`SELECT * FROM Accounts WHERE id='${uuid}'`, (err, account) => {
        console.log(account[0].firstName);
        if(account.length > 0){ 
            res.render('activate',{
                name : 'SpectrumGoals', 
                uuid : uuid,
                firstName : account[0].firstName,
                lastName : account[0].lastName,
                createdBy : account[0].createdBy,
                username : account[0].username
            });
        }else { // uuid is not found in database
            res.end('Account niet gevonden!');
        }
    });

});

function getAccount(id){
    const account = controller.getOne(id);
    console.log(`getAccount('${id}') : ${account}`);
    return account;
}

router.post('/', bodyParserJSON, (req, res) => controller.verifyAccount(req,res));

module.exports = router;
