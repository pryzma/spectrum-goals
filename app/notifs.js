/* jshint node: true, esversion: 6 */
'use strict';
const mysql = require('mysql'),
      env = process.env.NODE_ENV,
      config = require("../config/config")()[env],
      sgMail = require('@sendgrid/mail'),
      dbconn = require('./dbconn'),
      connection = dbconn.connection;

function notifIndication(){

        connection.query('SELECT indication, username FROM Medients LEFT JOIN Accounts ON Accounts.id = Medients.account;', (err, indications) => {
            let date = new Date();
            const today = new Date();
            let three = new Date(date.setMonth(date.getMonth() + 3));
            if (!err) {
              indications.forEach ((indication) => {
                if (three > indication.indication) {
                  if (today >= indication.indication) {
                    
                    sgMail.setApiKey(config.sendgrid);
                    const msg = {
                      to: `ccolombijn@gmail.com`,
                      from: `noreply@spectrumgoals.nl`,
                      subject: `Verlopen indicatie voor Medient ${indication.username}`,
                      text: `Beste Bart,<br> De indicatie van Medient ${indication.username} is verlopen.`,
                      html: `<img src="https://dev.emerald-dust.org/img/logo_lg.png"><br>Beste Bart,<br> De indicatie van Medient ${indication.username} is verlopen.`,
                    };
                    connection.query(`SELECT account,action,date FROM Notifications WHERE account= ${indication.username};`, (err, notifs) => {
                      if(notifs.length===0){
                        
                        sgMail.send(msg).then(() => {
                          console.log('E-mail sent to Bart');
                          connection.query(`INSERT INTO Notifications (account) VALUES ('${indication.account}')`);
                        }).catch(error => {
                          
                          console.error(error.toString());
                          const {message, code, response} = error;
                          const {headers, body} = response;
                        });
                      }
                    });
                    
                  } else {
                    console.log('\x1b[1m\x1b[36m[notifs] \x1b[0m \x1b[3m ',indication.username + "'s indicatie gaat verlopen op " + indication.indication);
                    sgMail.setApiKey(config.sendgrid);
                    const msg = {
                      to: `ccolombijn@gmail.com`,
                      from: `noreply@spectrumgoals.nl`,
                      subject: `Indicatie voor Medient ${indication.username} gaat verlopen op ${indication.indication}`,
                      text: `Beste Bart,<br> De indicatie van Medient ${indication.username} gaat verlopen op ${indication.indication}.`,
                      html: `<img src="https://dev.emerald-dust.org/img/logo_lg.png"><br>Indicatie van Medient ${indication.username} gaat verlopen op ${indication.indication}.`,
                    };
                    sgMail.send(msg).then(() => {
                      console.log('\x1b[1m\x1b[36m[notifs] \x1b[0m \x1b[3m ',`Notification mail sent for ${indication.username} ${indication.account} \x1b[0m`);
                    }).catch(error => {
                      
                      console.error('\x1b[1m\x1b[36m[notifs] \x1b[0m \x1b[3m Error : ',error.toString() + '\x1b[0m');
                     
                    });
                  }
                } else {
                  
                }
              });
            } else {
              throw err;
            }
            //connection.end();
          });
    
    
}
function dayCheck(){
  console.log('\x1b[1m\x1b[36m',`[notifs] \x1b[0m \x1b[3m dayCheck notifIndication  \x1b[0m`);
  setTimeout(notifIndication,86400000); // fire notifIndication once in 24 hrs
}
module.exports = dayCheck;
