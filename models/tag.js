'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  natural = require('natural'),

  tokenizer = new natural.WordTokenizer(),
  useless = require('../lib/useless_words');

/* Provides a model for storing auto-complete tags, 
including Skills/Areas of Interest, Companies, and Locations */
var tagModel = function () {

  var tagSchema = Schema({
    tagType: String, // skill, company, location
    tokens: [String], // Array of tokens
    displayText: String,
    numberProfiles: {
      type: Number,
      'default': 0
    } // The number of profiles using this tag
  });

  // Create a tag given a tagString and tagType
  tagSchema.statics.createTag = function (tagString, tagType, callback) {
    var tokens = this.tokenize(tagString),
      tag = new this({
        tagType: tagType,
        tokens: tokens,
        displayText: tagString
      });

    this.findOne({
      tagType: tagType,
      tokens: tokens
    }, function (err, identical) {
      if (identical) {
        callback(identical);
      } else {
        tag.save(function (err, tag) {
          callback(tag);
        });
      }
    });
  };

  // returns list of matching tags
  tagSchema.statics.findTagsWithString = function (tagString, tagType,
    callback) {
    var tokens = this.tokenize(tagString),
      query;

    if (tagType) {
      query = this.where('tagType', tagType).where('tokens').in(tokens);
    } else {
      query = this.where('tokens').in(tokens);
    }

    query.exec(callback);
  };

  // Returns tokens for a given tagString, stripping out useless words, downcasing and stemming
  tagSchema.statics.tokenize = function (tagString) {
    var results = [],
      words = tokenizer.tokenize(tagString);

    for (var w in words) {
      var word = words[w].toLowerCase();

      if (useless[word] === undefined) {
        results.push(natural.PorterStemmer.stem(word));
      }
    }

    return results;
  };

  // Add a tagString as synonyms to an existing tag
  tagSchema.methods.addStringToTag = function (tagString) {
    var words = this.model.tokenize(tagString);
    for (var w in words) {
      this.tokens.$push(words[w]);
    }
    this.save();
    return this;
  };

  return mongoose.model('Tag', tagSchema);
};

module.exports = new tagModel();
