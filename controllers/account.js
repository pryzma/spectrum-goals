/*
* controllers/account.js
*/
'use strict';
const controller = module.exports = {};
const auth = require('./auth');
controller.get = (req,res) => res.json(req.session.user);
controller.isAuthenticated = auth.isAuthenticated;