'use strict';

var passport = require('passport'),
  LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  User = require('../models/user'),
  Account = require('../models/account'),
  Message = require('../models/message'),
  Search = require('../models/search'),
  providers = require('../config/providers');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new LinkedInStrategy({
  clientID: providers.linkedin.key,
  clientSecret: providers.linkedin.secret,
  callbackURL: process.HOST + providers.linkedin.callbackURL,
  scope: ['r_emailaddress', 'r_basicprofile']
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.use(new GoogleStrategy({
    clientID: providers.google.clientID,
    clientSecret: providers.google.secret,
    callbackURL: process.HOST + providers.google.redirectURL
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

var user = function (server) {
  // Redirect to generic oauth provider
  server.get('/user/oauth', function (req, res) {
    res.redirect('/user/oauth/' + req.query.provider);
  });

  // Redirect user to LinkedIn
  server.get('/user/oauth/linkedin', passport.authenticate('linkedin', {
    state: 'hello'
  }), function (req, res) {
    // The request will be redirected to Linkedin for authentication, so this
    // function will not be called.
  });

  // LinkedIn oAuth Callback
  server.get('/user/oauth_callback/linkedin', passport.authenticate('linkedin', {
    failureRedirect: '/login'
  }), function (req, res) {
    if (req.session.user) {
      req.session.user.addLinkedInAccount(req.session.passport.user);
      res.redirect('/#/home');
    } else {
      var account = Account.createWithOAuthProfile(req.session.passport.user);
      User.findByAccount(account, function (user) {
        if (user !== null) {
          req.session.userID = user._id;
          res.redirect('/#/home');
        } else {
          User.createWithOAuthProfile(req.session.passport, function (
            user) {
            user.addLinkedInAccount(req.session.passport.user);
            req.session.userID = user._id;
            // add things in req.session here for adding our own stuff to the session
            res.redirect('/#/home');
          });
        }
      });
    }
  });

  server.get('/user_login/:id/', function (req, res) {
    req.session.userID = req.params.id;
    res.redirect('/#/home');
  });

  // Redirect user to Google
  server.get('/user/oauth/google', passport.authenticate('google', {
    scope: providers.google.scope
  }), function (req, res) {
    // The request will be redirected to Linkedin for authentication, so this
    // function will not be called.
  });

  // Google oAuth Callback
  server.get('/user/oauth_callback/google', passport.authenticate('google', {
    failureRedirect: '/login'
  }), function (req, res) {
    if (req.session.user) {
      req.session.user.addGoogleAccount(req.session.passport.user);
    } else {
      var account = Account.createWithOAuthProfile(req.session.passport.user);
      User.findByAccount(account, function (user) {
        console.log('FBA: ' + user);
        if (user !== null) {
          req.session.userID = user._id;
          console.log('SET SESS');
          res.redirect('/#/profile');
        } else {
          User.createWithOAuthProfile(req.session.passport, function (
            user) {
            user.addGoogleAccount(req.session.passport.user);
            req.session.userID = user._id;
            res.redirect('/#/profile');
          });
        }
      });
    }
  });

  server.get('/user/:id/profile', function (req, res) {
    User.findOne({
      shortID: req.params.id
    }, function (err, user) {
      var userResult = user.profileData(),
        starredUserIDs = req.session.user.getStarredUserIDs();

      userResult.shortID = req.params.id;
      userResult.starred = (starredUserIDs.indexOf(user._id) !== -1);
      res.json(userResult);
    });
  });

  // Edit Fields
  server.get('/user/edit', function (req, res) {
    res.json(req.session.user.editFields());
  });

  server.put('/user/profile', function (req, res) {
    console.log(req.body);
    if (req.body.opportunityTypes && req.body.opportunityTypes.length > 0) {
      req.body.isSearchable = true;
    }
    req.session.user.updateFields(req.body, req.session.user.fieldsForEdit());
    res.json(req.session.user.editFields());
  });

  server.get('/user/profile', function (req, res) {
    res.json(req.session.user);
  });

  server.get('/user/:id/short', function (req, res) {
    User.findById(req.params.id, function (err, user) {
      res.json({
        shortID: user.shortID,
        name: user.name
      });
    });
  });

  server.get('/user/short', function (req, res) {
    res.json({
      shortID: req.session.user.shortID,
      name: req.session.user.name
    });
  });

  server.get('/user/affiliation', function (req, res) {
    res.json(req.session.user.brownAffiliations);
  });

  server.put('/user/affiliation', function (req, res) {
    var affiliations = JSON.parse(req.body.json).brownAffiliations;
    req.session.user.updateAffiliations(affiliations);
    res.json(affiliations);
  });

  // Group Searches
  server.get('/user/searches', function (req, res) {
    Search.where('userID', req.session.userID).exec(function (err, searches) {
      if (err) {
        res.json(500, {
          error: 'AN ERORR OCCURRED'
        });
        return;
      }
      res.json(searches);
    });
  });

  // Group Messages
  server.get('/messages', function (req, res) {
    req.session.user.getMessages(function (messages) {
      res.json(messages);
    });
  });

  server.get('/messages/:id', function (req, res) {
    Message.findById(req.params.id, function (err, msg) {
      res.json(msg);
    });
  });

  server.put('/messages/user/:id', function (req, res) {
    // had to move blocking logic here becaue things werent working with it in the model
    User.findOne({
      shortID: req.params.id
    }, function (err, messagedUser) {
      if (messagedUser.blocklist.indexOf(req.session.user._id) !== -1) {
        res.json(500, {
          error: 'Unable to contact user'
        });
      } else {
        Message.send(
          messagedUser, req.session.user, req.body.subject, req.body.body,
          function (message) {
            if (message === null) {
              res.json(500, {
                error: 'an error occured while sending message'
              });
            } else {
              res.json(message);
            }
          }
        );
      }
    });
  });

  server.post('/user/:id/block', function (req, res) {
    User.findOne({
      shortID: req.params.id
    }, function (err, user) {
      req.session.user.blockUser(user._id);
      res.json({
        success: true,
        blockedUserName: user.name
      });
    });
  });

  server.post('/user/:id/unblock', function (req, res) {
    User.findOne({
      shortID: req.params.id
    }, function (err, user) {
      req.session.user.unblockUser(user._id);
      res.json({
        success: true,
        unblockedUserName: user.name
      });
    });
  });

  server.put('/user/:shortID/star', function (req, res) {
    User.findOne({
      shortID: req.params.shortID
    }, function (err, user) {
      req.session.user.starUser(user._id);
      res.json({
        success: true,
        starredUserName: user.name
      });
    });
  });

  server.put('/user/:shortID/unstar', function (req, res) {
    User.findOne({
      shortID: req.params.shortID
    }, function (err, user) {
      req.session.user.unstarUser(user._id);
      res.json({
        success: true,
        unstarredUserName: user.name
      });
    });
  });
};


module.exports = user;
