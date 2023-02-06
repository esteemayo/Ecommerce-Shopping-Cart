const express = require('express');

// start express app
const app = express();

require('./startup/routes')(app);

module.exports = app;
