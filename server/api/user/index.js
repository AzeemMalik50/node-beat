// 'use strict';

var express = require('express');
var controller = require('./user.controller');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var Auth = require('../auth/auth.controller');
passport.use(new BearerStrategy(Auth.verifyUserByToken));
var tokenAuth = passport.authenticate('bearer', {
    session: false
});

//create user and get user list
router.route('/users')
    .post( controller.upsertUser)
    .get( controller.index);

//update , get and delete user by Id    
router.route('/users/:userId')
    .put( controller.upsertUser)
    .patch( controller.upsertUser)
    .get( controller.findUserById)
    .delete( controller.deleteUser);

module.exports = router;