/* jshint node: true, esversion: 6 */
"use strict";

const mysql = require('mysql');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")()[env];
const sgMail = require('@sendgrid/mail');
const authController = require("../controllers/auth")

const connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database
});

function dateTime() {
  let now = new Date();
  let hour = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours());
  let minutes = (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes());
  let seconds = (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
  let month = (now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1));
  return `${now.getDate()}-${month}-${now.getFullYear()} (${hour}:${minutes}:${seconds}): `;
}



function notifIndication(){

        connection.query('SELECT indication, username FROM Medients LEFT JOIN Accounts ON Accounts.id = Medients.account;', (err, indications) => {
            let date = new Date();
            const today = new Date();
            let three = new Date(date.setMonth(date.getMonth() + 3));
            if (!err) {
              for (let indication of indications) {
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
                        console.log(` Indicatie van ${indication.username} verloopt op `);
                        sgMail.send(msg).then(() => {
                          console.log('E-mail sent to Bart');
                          connection.query(`INSERT INTO Notifications (account) VALUES ('${indication.account}')`)
                        }).catch(error => {
                          //Log friendly error
                          console.error(error.toString());
                          //Extract error msg
                          const {message, code, response} = error;
                          //Extract response msg
                          const {headers, body} = response;
                        });
                      }
                    })
                    
                  } else {
                    console.log(indication.username + "'s indicatie gaat verlopen op " + indication.indication);
                    sgMail.setApiKey(config.sendgrid);
                    const msg = {
                      to: `ccolombijn@gmail.com`,
                      from: `noreply@spectrumgoals.nl`,
                      subject: `Indicatie voor Medient ${indication.username} gaat verlopen op ${indication.indication}`,
                      text: `Beste Bart,<br> De indicatie van Medient ${indication.username} gaat verlopen op ${indication.indication}.`,
                      html: `<img src="https://dev.emerald-dust.org/img/logo_lg.png"><br>Beste Bart,<br> De indicatie van Medient ${indication.username} gaat verlopen op ${indication.indication}.`,
                    };
                    sgMail.send(msg).then(() => {
                      console.log('\x1b[1m\x1b[36m[notifs] \x1b[0m \x1b[3m ',`Notification mail sent for ${indication.username} ${indication.account} \x1b[0m`)
                    }).catch(error => {
                      
                      console.error('\x1b[1m\x1b[36m[notifs] \x1b[0m \x1b[3m Error : ',error.toString() + '\x1b[0m');
                     
                    });
                  }
                } else {
                  console.log(indication.username + "'s indicatie is geldig.");
                }
              }
            } else {
              throw err;
            }
            connection.end();
          });
    
    
}
function dayCheck(){
  console.log('\x1b[1m\x1b[36m',`[notifs] \x1b[0m \x1b[3m notifs. \x1b[0m`)
  setTimeout(notifIndication,86400000) // fire notifIndication once in 24 hrs
}
module.exports = dayCheck