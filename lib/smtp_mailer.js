'use strict';

var nodemailer = require('nodemailer'),
  providers = require('../config/providers'),
  smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: providers.gmail
  });

var smtpMailer = function () {
  this.send = function (email, subject, body, replyTo) {
    smtpTransport.sendMail({
      from: 'Brown Connect <' + providers.gmail.user + '@gmail.com>', // sender address
      to: email, // comma separated list of receivers
      subject: subject, // Subject line
      text: body, // plaintext body
      replyTo: replyTo
      // add reply to
    }, function (err, response) {
      if (err) console.log('error sending message');
    });
  };
};

module.exports = new smtpMailer();
