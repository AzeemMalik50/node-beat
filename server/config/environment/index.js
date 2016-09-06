/* global process */
// 'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV || 'development',

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),
    // Server port
    port: process.env.PORT || 1337,
    
    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: process.env.SESSION_SECRET || 'nodebeat-secret',
        JWT_SECRET: process.env.SESSION_SECRET || 'nodebeat-jwt-secret'
    },
    accesTokenExpirsIn:86400 // 24 hours



};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./' + all.env + '.js') || {});