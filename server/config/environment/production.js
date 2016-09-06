//'use strict';

// Production specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://localhost/nodebeat'
    },
    baseURL: process.env.BASE_URL,
};
