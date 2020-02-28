'use strict';
const  passport = require('passport'),  
       LocalStrategy  = require('passport-local').Strategy,
       dbconn = require('./dbconn'),
       connection = dbconn.connection,
       bcrypt = require('bcryptjs');
module.exports =(app)=>{
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true 
  } , function (req, username, password, done){
        if(!username || !password ) { return done(null, false, req.flash('message','All velden zijn verplicht!')); }
        dbconn.query("select * from Accounts where username = ?", [username], function(err, rows){
          if (err) { return done(req.flash('message',err)); }
          if(!rows.length){ return done(null, false, req.flash('message','Ongeldige gebruikersnaam en/of wachtwoord')); }
          bcrypt.compare(password, rows[0].password, function(err, res) {
            if(res){
              console.log('\x1b[1m\x1b[32m',`${username} ${rows[0].id} passport.authenticate() OK\x1b[0m`);
              req.session.user = rows[0];
              app.user = rows[0];
              return done(null, rows[0]);
            }else{
              console.log('\x1b[1m\x1b[31m',`${username} passport.authenticate() FAILED ${err}\x1b[0m`);
              return done(null, false, req.flash('message','Ongeldige gebruikersnaam en/of wachtwoord'));
            }
          });
        });
      }
  ));

  passport.serializeUser(function(user, done){
      console.log(`passport.serializeUser : ${JSON.stringify(user)}`);
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
      connection.query(`select * from Accounts where id ='${id}'`, function (err, rows){
        console.log(`passport.deserializeUser : ${id}`);
        done(err, rows[0]);
      });
  });

  app.get('/signin', function(req, res){
    const config = require('../config/app.json');
    res.render('signin',{'name' : config.name, 'message' :req.flash('message')});
  });

  app.post("/signin",
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true
  }), function(req, res){
      res.render('signin',{'message' :req.flash('message')});
  });

  app.get('/logout', function(req, res){
      req.session.destroy();
      req.logout();
      res.redirect('/signin');
  });
  return app;
};

