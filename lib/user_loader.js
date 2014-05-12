'use strict';

var mongoose = require('mongoose'),
  User = require('../models/user'),
  Account = require('../models/account');

module.exports = function () {
  return function (req, res, next) {
    if (req.session.userID) {
      User.findById(req.session.userID, function (err, user) {
        if (!err) {
          req.session.user = user;
        }
        next();
      });
    } else {
      next();
    }
  };
};
