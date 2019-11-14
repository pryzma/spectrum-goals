const express = require('express'),
      router = express.Router();
    

router.get('/', isAuthenticated, function(req, res, next) {
    res.end(JSON.stringify({status:true}));
});

function isAuthenticated(req, res, next) {
    if (req.session.user)
        return next();
    res.status(403).end();
}
  
module.exports = router;