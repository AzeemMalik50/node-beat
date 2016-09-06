/* global _config */
/* global _mongoose */

require('./autoload');
var mongoose = require('mongoose');

// db connection from config
mongoose.connect(_config.mongo.uri);
 mongoose.set('debug', true);

var db = mongoose.connection;
// connection error 
db.on('error', console.error.bind(console, 'connection error:'));

// connection success
db.once('open', function () {
    console.log('MongoDB connection established');
});