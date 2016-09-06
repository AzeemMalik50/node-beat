// 'use strict';

var express = require('express');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var Auth = require('./auth.controller');
passport.use(new BearerStrategy(Auth.verifyUserByToken));
var tokenAuth = passport.authenticate('bearer', {
    session: false
});

//CHANGE PASSWORD
router.route('/account/changePassword')
    .put(tokenAuth, Auth.ChangePassword);

// login end point    
router.route('/account/login')
    .post(Auth.login);
module.exports = router;