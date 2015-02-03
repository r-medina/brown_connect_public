'use strict';

var mongoose = require('mongoose'),
    SMTPMailer = require('../lib/smtp_mailer'),
    User = require('./user');

/* Provides a model for messages between opportunity seekers and providers */
var messageModel = function () {

    var messageSchema = mongoose.Schema({
        messagedUserID: mongoose.Schema.Types.ObjectId,
        senderUserID: mongoose.Schema.Types.ObjectId,
        subject: String,
        date: {
            type: Date,
            'default': Date.now
        },
        body: String,
        replied: {
            type: Boolean,
            'default': false
        } // Not currently in use until we setup tracking
    });

    messageSchema.statics.send = function (messagedUser, senderUser, subject, body,
        cb) {
        // TODO move blocking logic back into here
        // Find messagedUser
        this.create({
            messagedUserID: messagedUser._id,
            senderUserID: senderUser._id,
            subject: subject,
            body: body
        }, function (err, msg) {
            if (!err) {
                // Send actual message
                SMTPMailer.send(messagedUser.email, subject, body, senderUser.email);
                cb(msg);
            }
        });
    };

    return mongoose.model('Message', messageSchema);
};

module.exports = new messageModel();
