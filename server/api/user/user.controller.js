/* global _Promise */
/* global _constants */
/* global _config */
/* global _config */
/* global _ */
// 'use strict';
/* global _constant */
require('../../config/autoload');
var User = require('./user.model');var jwt = require("jsonwebtoken");
var passwordHash = require('password-hash');
var Errors = require('../../config/error');

module.exports = {
    //user listing by
    index: function(req, res, next) {
        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 10;
        var role = req.query.role;
        var type = req.query.type;
        var order = req.query.order;
        var query = {};
        var sort = {};
        if (order) {
            if (order.indexOf('-') > -1) {
                var s = order.substring(1);
                sort[s] = -1;
            } else {
                sort[order] = 1;

            }
        } else {
            sort = {
                updatedAt: -1
            };
        }
        if (req.query.search) {
            var search = new RegExp(req.query.search, 'i');
            query = {
                $or: [{
                    firstName: search
                }, {
                    email: search
                }]
            };
        }
        if (role) {
            query.role = role;
        }
        if (type) {
            query.type = type;
        }
        _Promise.all([User.find(query, {
                password: 0
            })
            .populate('account')
            .limit(limit)
            .skip((page - 1) * limit)
            .sort(sort),
            User.count(query)
        ]).spread(function(users, count) {
            return res.json({
                totalCount: count,
                page: page,
                size: limit,
                items: users
            });

        }).catch(next);

    },
    // upsert user
    upsertUser: function(req, res, next) {


        var body = req.body;
        // return res.json(req.body);
        var newAccounts = [];
        var clientAccounts = [];
        newAccounts = _.filter(body.accounts, function(o) {
            return !o._id;
        });
        clientAccounts = _.filter(body.accounts, function(o) {
            return o._id;
        });
        body.accounts = clientAccounts;
        var userId = req.params.userId;

        createUser(body, userId)
            .then(function(user) {
                if (body.type === _constants.user.roles.CLIENT) {
                    if (newAccounts.length > 0) {
                        newAccounts = _.map(newAccounts, function(o) {
                            return {
                                title: o.title,
                                clients: [user._id]
                            };
                        });
                        return Account.insertMany(newAccounts)
                            .then(function(accounts) {
                                return User.findOneAndUpdate({
                                    _id: user._id
                                }, {
                                    $addToSet: {
                                        accounts: {
                                            $each: accounts
                                        }
                                    }
                                }, {
                                    new: true
                                }).then(function(result) {
                                    return res.json(result);
                                });
                            });
                    }
                }
                return res.json(user);
            }).catch(next);

    },

    findUserById: function(req, res, next) {
        User.findOne({
                _id: req.params.userId
            }, {
                password: 0
            })
            .populate('account')
            .then(function(user) {
                if (!user)
                    return res.status(404).json(Errors.notFound);
                return res.json(user);
            }).catch(next);
    },
    deleteUser: function(req, res, next) {
        User.findOne({
                _id: req.params.userId
            }, {
                password: 0
            })
            .then(function(user) {
                if (!user) {
                    return res.status(404).json(Errors.notFound);
                }
                return user.remove().then(function(result) {
                    return res.json(result);
                });
            }).catch(next);
    }
};

function addClientsToAccount(accounts, clientId) {
    return Account.update(accounts, {
        $push: {
            clients: clientId
        }
    });
}

function createUser(userObject, id) {
    if (id) {
        userObject = _.omit(userObject, ['password','email']);

        return User.findOneAndUpdate({
            _id: id
        }, userObject, {
            new: true
        }).then(function(user) {
            user = _.omit(user.toObject(), ["password"]);
            return user;
        });
    } else {
        if (!userObject.password) {
            userObject.password = _constants.user.defaultPassword;
        }
        var newUser = new User(userObject);
        return newUser.save()
            .then(function(user) {
                user = _.omit(user.toObject(), ["password"]);
                return user;
            });
    }
}