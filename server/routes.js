/* global _constants */
/* global _config */
/**
 * Main application routes
 */

// "use strict";

require('./config/autoload');

var errors = require('./utils/errors');

// load routes
var users = require('./' + _constants.APIFolder + '/user');


module.exports = function(app) {

    // include route component in below array
    app.use(_constants.APIPath, [users]);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
};