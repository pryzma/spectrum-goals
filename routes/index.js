
const express = require('express');
const router = express.Router();
const render = require('../app/render');
  router.get('/', isAuthenticated, function(req, res, next) {
    const config = require('../config/app.json')
    const cdns = require('../app/cdns')(config.client.cdns)
   
    /* GET user information after login */
    const username   = req.session.user.username;
    const full_name  = `${req.session.user.firstName} ${req.session.user.lastName}`;
  
    render(res,'index', { 
      username: username, 
      full_name: full_name, 
      js : cdns.js, 
      css : cdns.css 
    });
  
  });




function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
  res.redirect('/signin');
}

module.exports = router;
