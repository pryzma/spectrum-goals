const bcrypt = require("bcrypt");
const passport = function(passport,account){
    const Account = account;
    const LocalStrategy = require("passport-local").Strategy;
    const LocalStrategyObj = {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }
    const LocalStrategySignup = function(req, email, password, done) { 
        Account.findOne({where:{email:email}}).then(createAccount(account,email,password));
    }
    const generateHash = function(password) { // hash password
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
    const createAccount = function(account,email,password){
        if(account){ // account with given email already exists
            return done(null, false, {message: "That email is already taken"});
        }else{ // create new account
            password = generateHash(password);
            Account.create({
                email: email,
                password: password,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }).then(function(newAccount, created) {
                if (!newAccount) {
                  return done(null, false);
                }
  
                if (newAccount) {
                  return done(null, newAccount);
                }
            })
        }
    }

    //  local-signup strategy setup
    passport.use("local-signup",new LocalStrategy(LocalStrategyObj, 
        LocalStrategySignup(req, email, password, done)
    ));

    // serialize
    passport.serializeUser(function(account, done) {
        done(null, account.id);
    });

    // deserialize user
    passport.deserializeUser(function(id, done) {
        Account.findById(id).then(function(account) {
            account ? done(null, account.get()) : done(account.errors, null);
        });
    });


}
module.exports = passport;