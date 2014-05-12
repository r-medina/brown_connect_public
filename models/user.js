'use strict';

var mongoose = require('mongoose'),
  md5 = require('MD5'),
  shortId = require('shortid'),
  Account = require('./account'),
  Tag = require('./tag'),
  Message = require('./message');

var userModel = function () {

  // only used by the users
  var userTagSchema = mongoose.Schema({
    displayText: String,
    tagID: mongoose.Schema.Types.ObjectId // id of the tag
  });

  var affiliateSchema = mongoose.Schema({
    affiliationType: String,
    year: Number
  });

  // defining user schema
  var userSchema = mongoose.Schema({
    name: String,
    shortID: String,
    title: String,
    email: String,
    locations: [userTagSchema],
    skills: [userTagSchema],
    companies: [userTagSchema],
    companyOptIn: {
      type: Boolean,
      'default': false
    }, // Indicates whether User shows up on company search
    accounts: [Account.schema],
    photoURL: String, // taken from gravatar using Email
    opportunityTypes: [String], // ["mentorship", "grants", "employment", "networking"]
    providerSummary: String,
    seekerSummary: String,
    isSearchable: {
      type: Boolean,
      'default': false
    }, // Prevent searches until profile complete
    blocklist: [mongoose.Schema.Types.ObjectId], // List of user IDs blocked
    isBrownAffiliate: {
      type: Boolean,
      'default': false
    }, // Indicates whether can be seeker
    brownAffiliations: [affiliateSchema],
    brownAffiliateString: String,
    updated: {
      type: Date,
      'default': Date.now
    },
    created: {
      type: Date,
      'default': Date.now
    },
    starredUsers: [mongoose.Schema.Types.ObjectId]
  });

  // Get user by id
  userSchema.statics.findByAccount = function (account, cb) {
    this.findOne({
      'accounts.provider': account.provider,
      'accounts.id': account.id
    }, function (err, user) {
      if (!err && user) {
        cb(user);
      } else {
        cb(null);
      }
    });
  };

  // Initialize with basic info from oAuth
  userSchema.statics.createWithOAuthProfile = function (profile, cb) {
    profile = profile.user;

    var account = Account.createWithOAuthProfile(profile),
      getPreferredEmail = function (emails) {
        var result = emails[0].value.toLowerCase();
        for (var e in emails) {
          var email = emails[e].value.toLowerCase();
          if (email.indexOf('brown.edu') !== -1) {
            return email;
          }
        }
        return result;
      };
    var email = getPreferredEmail(profile.emails);
    console.log('OAUTH PROFILE');
    console.log(profile);
    this.createWithBasicInfo(profile.displayName, email, account, cb);
  };

  userSchema.statics.createWithBasicInfo = function (name, email, account, cb) {
    email = email.toLowerCase();
    this.create({
      shortID: shortId.generate(),
      name: name,
      email: email,
      locations: [],
      skills: [],
      companies: [],
      accounts: [account],
      photoURL: 'http://www.gravatar.com/avatar/' + md5(email),
      opportunityTypes: [],
      blocklist: [],
      isBrownAffiliate: (email.indexOf('brown.edu') !== -1) ? true : false,
      brownAffiliations: [],
      starredUsers: []
    }, function (err, user) {
      if (!err) {
        cb(user);
      }
    });
  };

  // Save and update timestamps
  userSchema.methods.doSave = function () {
    this.updated = Date.now();
    this.save();
  };

  // Check if user has account
  userSchema.methods.hasAccount = function (account) {
    for (var a in this.accounts) {
      if (this.accounts[a].provider === account.provider && this.accounts[a].id ===
        account.id) {
        return true;
      }
    }
    return false;
  };

  userSchema.methods.addLinkedInAccount = function (profile) {
    var account = Account.createWithOAuthProfile(profile);
    if (!this.hasAccount(account)) {
      this.accounts.push(account);
    }
    this.photoURL = profile._json.pictureURL;
    this.title = profile._json.headline;
    this.doSave();
  };

  userSchema.methods.addGoogleAccount = function (profile) {
    var account = Account.createWithOAuthProfile(profile);
    console.log(account);
    if (!this.hasAccount(account)) {
      this.accounts.push(account);
    }
    this.photoURL = profile._json.picture;
    if (profile._json.hd.indexOf('brown.edu') !== -1) {
      this.isBrownAffiliate = true;
    }
    this.doSave();
  };

  // Get Messages
  userSchema.methods.getMessages = function (cb) {
    Message.find({
      messagedUserID: this._id
    }).or({
      senderUserID: this._id
    }).exec(function (err, results) {
      if (!err) {
        cb(results);
      }
    });
  };

  // Brown Affiliate String 
  userSchema.methods.getAffiliateString = function () {
    var typeOrder = ['AB', 'ScB', 'ScM', 'AM', 'GS', 'P'],
      result = '';

    if (!this.brownAffiliations) return '';

    for (var i in typeOrder) {
      for (var j in this.brownAffiliations) {
        if (this.brownAffiliations[j].affiliationType === typeOrder[i]) {
          result += (typeOrder[i] + ' \'' + this.brownAffiliations[j].year.toString());
        }
      }
    }

    return result;
  };

  // Different JSON Serialization Options
  userSchema.methods.profileData = function () {
    var fields = ['name', 'title', 'locations', 'opportunityTypes', 'skills',
      'providerSummary', 'seekerSummary', 'photoURL'
    ];

    return {
      name: this.name,
      title: this.title,
      locations: this.locations,
      opportunityTypes: this.opportunityTypes,
      skills: this.skills,
      providerSummary: this.providerSummary || null,
      seekerSummary: this.seekerSummary || null,
      photoURL: this.photoURL || null
    };
  };

  userSchema.methods.fieldsForEdit = function () {
    return [
      'name', 'title', 'email', 'photoURL', 'locations',
      'companies', 'companyOptIn', 'opportunityTypes', 'skills',
      'providerSummary', 'seekerSummary', 'isSearchable'
    ];
  };

  userSchema.methods.editFields = function () {
    var fields = this.fieldsForEdit();
    return this.serializeFields(fields);
  };

  userSchema.methods.peerSearchFields = function () {
    var fields = ['shortID', 'email', 'name', 'title'];
    return {
      name: this.name,
      email: this.email,
      _id: this.shortID,
      title: this.title
    };
  };

  userSchema.methods.searchFields = function () {
    var fields = [
        'shortID', 'name', 'title', 'locations', 'companies', 'skills',
        'providerSummary', 'brownAffiliateString', 'isBrownAffiliate',
        'providerSummary'
      ],
      result = this.serializeFields(fields);
    return result;
  };

  userSchema.methods.serializeFields = function (fields) {
    var result = {};
    for (var f in fields) {
      var display = ((fields[f] === 'shortID') ? '_id' : fields[f]);
      result[display] = this[fields[f]];
    }

    return result;
  };

  userSchema.methods.updateFields = function (json, allowedFields) {
    for (var k in json) {
      if (allowedFields === undefined || allowedFields.indexOf(k) !== -1) {
        console.log(k);
        if (['locations', 'skills', 'companies'].indexOf(k) !== -1) {
          this[k] = [];
          for (var i in json[k]) {
            if (json[k][i] && json[k][i]._id && json[k][i].displayText) {
              if (this[k].map(function (x) {
                return x.displayText;
              }).indexOf(json[k][i].displayText) === -1) {
                this[k].push(json[k][i]);
              }
            } else {
              console.log('ERROR ' + json[k][i]);
            }
          }
        } else {
          this[k] = json[k];
        }
      } else {
        console.log('DISALLOWED: ' + k);
      }
    }
    this.doSave();
  };

  userSchema.methods.updateAffiliations = function (affiliations) {
    this.brownAffiliations = affiliations;
    this.brownAffiliateString = this.getAffiliateString();
    this.doSave();
  };

  userSchema.methods.blockUser = function (userID) {
    this.blocklist = (!this.blocklist) ? [] : this.blocklist;
    this.blocklist.push(userID);
    this.doSave();
  };

  userSchema.methods.unblockUser = function (userID) {
    this.blocklist = (!this.blocklist) ? [] : this.blocklist;
    this.blocklist.remove({
      _id: userID
    });
    this.doSave();
  };

  userSchema.methods.starUser = function (userID) {
    this.starredUsers = (!this.starredUsers) ? [] : this.starredUsers;
    this.starredUsers.push(userID);
    this.doSave();
  };

  userSchema.methods.unstarUser = function (userID) {
    this.starredUsers = (!this.starredUsers) ? [] : this.starredUsers;
    console.log(this.starredUsers);
    this.starredUsers.remove({
      _id: userID
    });
    console.log(this.starredUsers);
    this.doSave();
  };

  userSchema.methods.getStarredUserIDs = function () {
    return this.starredUsers || [];
  };

  return mongoose.model('User', userSchema);

};

module.exports = new userModel();
