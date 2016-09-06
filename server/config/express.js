/* global _config */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
require('../config/express');
module.exports = function(app) {

    // Express Configuration
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");
        res.header('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');

        next();
    });

    app.use(morgan(' :method :url :response-time :status ')); // loging api response time
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        limit: '5mb',
        extended: true
    }));


};