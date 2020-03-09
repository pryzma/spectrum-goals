'use strict';
module.exports = (config) => {
    const app = require('express')();
    require('./app')(app,config);
    return app;
};
