/* global _constants */
require('../../config/autoload');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
var passwordHash = require('password-hash');

var user = new Schema({
    firstName: {
        type: 'String'
    },
    lastName: {
        type: 'String'
    },
    primaryContact: {
        type: 'String'
    },
    email: {
        type: 'String',
        unique: true,
        allowNull: false,
        required: [true, 'Email is required!'],
        email: [true, 'Invalid email!']
    },
    skype: {
        type: 'String'
    },
    role: {
        type: 'String',
        lowercase: true,
        default: null
    },
    type: {
        type: 'String',
        required: true,
        enum: [_constants.user.roles.USER, _constants.user.roles.CLIENT],
        default: _constants.user.roles.USER
    },
    note: {
        type: 'String'
    },
    password: {
        type: 'String'
    },
    active: {
        type: 'Boolean',
        default: true
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

user.index({
    firstName: 'text',
    lastName: 'text'

});

user.path('password').set(function(newVal) {
    return passwordHash.generate(newVal, _constants.HASH_OPTIONS);
});
user.path('email').validate(function(value) {
    return _constants.EMAIL_REGEX.test(value);
}, 'Invalid email');
user.plugin(timestamps);

user.methods.hashPassword = function(password) {
    return passwordHash.generate(password, _constants.HASH_OPTIONS);
};
/*user.post('findOneAndUpdate', function(object, next) {
    var user = object;
    // if (!user.isModified('password')) return next();
    user.password = passwordHash.generate(user.password, _constants.HASH_OPTIONS);
    user.save();
    return next();

});*/
user.methods.validatePassword = function(userPass, password) {
    return passwordHash.verify(userPass, password);
};

user.virtual('name')
    .get(function() {
        return this.firstName + " " + this.lastName;
    });
module.exports = mongoose.model('User', user);