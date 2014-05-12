'use strict';

var mongoose = require('mongoose');

/* Provides a model for credentials from 3rd party oAuth and Shib providers */
var accountModel = function () {

  var accountSchema = mongoose.Schema({
    provider: String, // LINKEDIN or GOOGLE
    id: String // The internal ID# on the provider
  });

  accountSchema.statics.createWithOAuthProfile = function (profile) {
    return this.createAccount(profile.provider, profile._json.id);
  }

  accountSchema.statics.createAccount = function (provider, id) {
    return new this({
      provider: provider,
      id: id
    });
  }

  return mongoose.model('Account', accountSchema);
};

module.exports = new accountModel();
