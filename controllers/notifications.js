'use strict';
const controller = module.exports = {},
      connection = require('../app/dbconn').connection,
      env = process.env.NODE_ENV || "development",
      sgMail = require('@sendgrid/mail'),
      config = require("../config/config")()[env];


function dateTime() {
        let now = new Date();
        let hour = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours());
        let minutes = (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes());
        let seconds = (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
        let month = (now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1));
        let day = (now.getDate() < 10 ? "0" + (now.getDate()) : (now.getDate()));
        return `${now.getFullYear()}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

controller.indicationNotification = function(){
    /** E-mail adres waar notificatie naar toe verzonden wordt */
    const indicationNotificationEmail = 'bart@spectrummultimedia.nl';
    connection.query('SELECT indication,username,account FROM Medients LEFT JOIN Accounts ON Accounts.id = Medients.account;', (err, indications) => {
        let date = new Date();
        const today = new Date();
        /** Datum over 3 maanden; wordt gematched met datum indicatie */
        const indicationNotificationDate = new Date(date.setMonth(date.getMonth() + 3));
        if (!err) {
          indications.forEach( (indication) => {
            if (indicationNotificationDate > indication.indication ) {
              if (today >= indication.indication) {
                //console.log(indication.username + "'s indicatie is verlopen!");
                sgMail.setApiKey(config.sendgrid);
                const msg = {
                  to: indicationNotificationEmail,
                  from: `noreply@spectrumgoals.nl`,
                  subject: `Verlopen indicatie voor Medient ${indication.username}`,
                  text: `De indicatie van Medient ${indication.username} is verlopen.`,
                  html: `<img src="https://dev.emerald-dust.org/img/logo_lg.png">Indicatie van Medient ${indication.username} is verlopen.`,
                };
                connection.query(`SELECT account FROM Notifications WHERE account='${indication.account}';`, (err, notifs) => {
                  if(err){
                    throw err;
                  }
                  if(notifs.length===0){

                    sgMail.send(msg).then(() => {
                      console.log(` Indicatie van ${indication.username} verloopt op ${indicationNotificationDate}; Bericht verzonden naar ${indicationNotificationEmail} `);
                      connection.query(`INSERT INTO Notifications (id,account,createdAt,updatedAt) VALUES ('${require('uuid/v4')()}','${indication.account}','${dateTime()}','${dateTime()}')`);
                    }).catch(error => {
                      //Log friendly error
                      console.error(error.toString());
                      //Extract error msg
                      const {message, code, response} = error;
                      //Extract response msg
                      const {headers, body} = response;
                    });
                  }
                });
                
              } else {
                console.log(indication.username + "'s indicatie gaat verlopen op " + indication.indication);
                sgMail.setApiKey(config.sendgrid);
                const msg = {
                  to: indicationNotificationEmail,
                  from: `noreply@spectrumgoals.nl`,
                  subject: `Indicatie ${indication.username} gaat verlopen op ${indication.indication}`,
                  text: `Beste Bart,<br> De indicatie van Medient ${indication.username} gaat verlopen op ${indication.indication}.`,
                  html: `<img src="https://dev.emerald-dust.org/img/logo_lg.png"><h3>Indicatie ${indication.username} verloopt op ${indication.indication}</h3><p>Indicatie van <b>${indication.username}</b> verloopt op ${indication.indication}</p>`,
                };
                sgMail.send(msg).then(() => {
                  console.log('\x1b[1m\x1b[36m[controller.indicationNotification] \x1b[0m \x1b[3m ',`Notification mail sent for ${indication.username} ${indication.account} \x1b[0m`);
                }).catch(error => {
                  
                  console.error('\x1b[1m\x1b[36m[controller.indicationNotification] \x1b[0m \x1b[3m Error : ',error.toString() + '\x1b[0m');
                 
                });
              }
            } else {
              console.log(indication.username + "'s indicatie is geldig.");
            }
          });
        } else {
          throw err;
        }
        //connection.end();
      });

};


controller.indicationNotificationCheck = (()=>{
    setTimeout(controller.indicationNotification,86400000); // fires indicationNotification once in 24h (86400000 ms)
})();
