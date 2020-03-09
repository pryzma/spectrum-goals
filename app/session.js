/*
* app/session.js
*/
'use strict';
const session  = require('express-session'),
BetterMemoryStore = require('session-memory-store')(session),
store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
module.exports = (app) => {
    // session setup
  app.use(session({
    name: 'JSESSION',
    secret: 'MYSECRETISVERYSECRET',
    store:  store,
    resave: true,
    saveUninitialized: true,
    config : undefined
 }));
};
