'use strict';
require('dotenv').config();
module.exports =  function(){
    return {
        development : {
            host: process.env.DB_HOST_development,
            username: process.env.DB_USER_development,
            password: process.env.DB_PASSWORD_development,
            database: process.env.DB_NAME_development,
            dialect : process.env.DB_DIALECT_development,
            sendgrid : process.env.SENDGRID_API_KEY,
            logging : false
        }
    };
};
