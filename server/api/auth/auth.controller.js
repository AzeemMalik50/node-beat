/* global _Promise */
/* global _constants */
/* global _config */
/* global _config */
/* global _ */
// 'use strict';

/* global _constant */
require('../../config/autoload');
var User = require('../user/user.model');
var jwt = require("jsonwebtoken");

module.exports = {
    login: function(req, res, next) {

        if (!_constants.EMAIL_REGEX.test(req.body.email)) {
            return res.status(400).json({
                message: "Invalid User Email!"
            });
        }
        var tokenExpireTime = _config.accesTokenExpirsIn;
        if (req.body.rememberMe) {
            tokenExpireTime = _config.accesTokenExpirsIn * 180;
        }
        User.findOne({
            email: req.body.email,
            active: true,
        }, function(err, user) {
            if (err) return next(err);
            if (!user || (user.role !== _constants.user.roles.ADMIN) && (user.role !== _constants.user.roles.MANAGER)) {
                return res.status(401).json({
                    message: 'Authentication failed. Invalid User!.'
                });
            } else if (user) {
                // check if password matches
                if (!(user.validatePassword(req.body.password, user.password))) {
                    res.status(401).json({
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        id: user._id,
                        email: user.email,
                        role: user.role,
                        iat: _moment(),
                       // _moment(decoded.iat).add(tokenExpireTime / _config.accesTokenExpirsIn, 'day')
                    }, _config.secrets.JWT_SECRET, {
                        expiresIn: tokenExpireTime
                    });
                    user = _.omit(user.toObject(), ["password", "project", "createdAt", "updatedAt", "__v"]);
                    jwt.verify(token, _config.secrets.JWT_SECRET, function(err, decoded) {
                        return res.json({
                            loginTime: _moment(decoded.iat),
                            loginExpireTime: _moment(decoded.iat).add(tokenExpireTime / _config.accesTokenExpirsIn, 'day'),
                            accessToken: token,
                            user: user
                        });
                    });
                }
            }
        });
    },
    verifyUserByToken: function(token, done) {

        jwt.verify(token, _config.secrets.JWT_SECRET, function(err, decoded) {
            if (err && !decoded) {
                return done(err);
            } else {
                User.findOne({
                    _id: decoded.id,
                    email: decoded.email
                }, {
                    password: 0
                }, function(err, user) {
                    if (!user) {
                        return done("Invalid User or User does not exist!");
                    }
                    if (err)
                        return done(err);
                    else {
                        user.accesToken = token;
                        return done(null, user);
                    }
                });
            }
        });
    },
    ChangePassword: function(req, res, next) {
        var body = req.body;
        if (!(body.oldPassword && body.newPassword && body.newConfirmPassword)) {
            return next({
                message: 'old , new and confirm passwords are missing '
            });
        } else if (body.newPassword !== body.newConfirmPassword) {
            return next({
                message: 'passwords are not matching'
            });
        } else {
            User.findOne({
                _id: req.user._id
            }, function(err, user) {
                if (err)
                    return next(err);
                else if (user && user.validatePassword(body.oldPassword, user.password)) {
                    user.update({
                        password: user.hashPassword(body.newPassword)
                    }, function(err) {
                        if (err)
                            return next(err);
                        else {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    return next({
                        message: 'wrong old password'
                    });
                }

            });
        }
    },
    isAdmin: function(req, res, next) {
        if (req.user && req.user.role && req.user.role === _constants.user.roles.ADMIN) {
            return next();
        } else {
            return res.json({
                status: 403,
                message: "UnAuthorized"
            });
        }
    }
};