/* global _config */
/* global process */
/**
 * Main application file
 */

// 'use strict';
require('./config/autoload');
var path = require('path');
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var connection = require('./config/connection');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var jwt = require("jsonwebtoken");
// Setup server

var app = express();

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);
app.use(cookieParser());
// Start server
server.listen(_config.port, _config.ip, function() {
    console.log('Express server listening on %d, in %s mode', _config.port, app.get('env'));
});
app.use('/private', validateCookieToken, function(req, res, next) {
    var stats;
    try {
        stats = fs.statSync('./' + req.originalUrl);
        next();
    } catch (e) {
        res.redirect('/not-found');
    }

});

app.use('/private', express.static(path.join(__dirname, '/../private')));

app.use(function(err, req, res, next) {
    console.error({
        message: err.message || err.name
    });
    return res.status(err.status || 400).json(err);

});
// Expose app
exports = module.exports = app;

function validateCookieToken(req, res, next) {

    if (req.cookies && req.cookies.accessToken) {
        jwt.verify(req.cookies.accessToken, _config.secrets.JWT_SECRET, function(err, decoded) {
            if (err && !decoded) {
                return next(err);
            } else {
                next();
            }
        });

    } else {
        return next(401);
    }
}