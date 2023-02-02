const express = require('express');

// START EXPRESS APP
const app = express();

require('./startup/routes')(app);

module.exports = app;
