/*
* routes/auth.js
*/
'use strict';
const render = require('../app/render');
const controller = require('../controllers/auth');
const passportStrategy = 'local';
function auth(){
    app.get('/signin', controller.signin);
    
    app.post("/signin", passport.authenticate(passportStrategy, {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    }), function(req, res){
        render(res,'signin',{'message' :req.flash('message')});
    });

    app.get('/logout', controller.logout);
}

module.exports = auth;
