require('../config/autoload');
var multer = require('multer');
var path = require('path');
var uuid = require('node-uuid');
var moment = require('moment');
var attachment = multer.diskStorage({

    destination:_constants.ATTACHMENT.DESTINATION_NOTE,
    filename: function(req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});

module.exports = {
    uploadAttachment: multer({
        /* fileFilter: function(req, file, cb) {
             if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
                 return cb({
                     message: 'Only image files are allowed!'
                 });
             }
             // To accept the file pass `true`, like so:
             return cb(null, true);
         },*/
        storage: attachment
    })
};