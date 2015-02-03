'use strict';

var mongoose = require('mongoose'),
    User = require('./user');

/* Provides a model to save searches in */
var searchModel = function () {

    var searchSchema = mongoose.Schema({
        opps: [String],
        tags: [String],
        starred: {
            type: Boolean,
            'default': false
        },
        userID: mongoose.Schema.Types.ObjectId,
        created: {
            type: Date,
            'default': Date.now
        }
    });

    return mongoose.model('Search', searchSchema);
};

module.exports = new searchModel();
