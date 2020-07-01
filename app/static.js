/*
* app/static.js
*/
'use strict';
module.exports = (app) => {
  const express = require('express'),
  path = require('path');
    // static directory setup
  app.use(express.static(path.join(__dirname, '..','assets')));
};
