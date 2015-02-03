'use strict';

var mongoose = require('mongoose'),
    Search = require('../models/search'),
    User = require('../models/user');

module.exports = function (server) {

    // Given params tagString and tagType return a list of potential tags
    server.get('/search', function (req, res) {
        var opps = req.query.opportunityTypes.split(','),
            tags = req.query.tags.split(','),
            results = [],
            starredUserIDs = req.session.user.getStarredUserIDs(),
            search = new Search({
                opps: opps,
                tags: tags,
                userID: req.session.userID
            });

        User
            .where('isSearchable', true)
            .where('opportunityTypes', {
                $in: opps
            }).or([{
                'skills._id': {
                    $in: tags
                }
            }, {
                'locations._id': {
                    $in: tags
                }
            }, {
                'companies._id': {
                    $in: tags
                }
            }])
            .exec(function (err, users) {
                console.log(users);
                for (var u in users) {
                    var tagMatches = [],
                        oppMatches = [],
                        user = users[u],
                        userResult;

                    for (var j = 0; j < user.skills.length; j++) {
                        var tag = user.skills[j];
                        if (tags.indexOf(tag._id.toString()) !== -1) {
                            tagMatches.push(tag.displayText);
                        }
                    }

                    for (var o in user.opportunityTypes) {
                        var opp = user.opportunityTypes[o];
                        if (opps.indexOf(opp) !== -1) {
                            oppMatches.push(opp);
                        }
                    }

                    userResult = user.searchFields();
                    userResult.tagMatches = tagMatches;
                    userResult.oppMatches = oppMatches;
                    userResult.starred = (starredUserIDs.indexOf(user._id) !== -1);
                    userResult.score = 0.5 * tagMatches.length + oppMatches.length;
                    results.push(userResult);
                }

                search.save();
                res.json(results.sort(function (a, b) {
                    return b.score - a.score;
                }));
            });
    });

    server.get('/search/:id/star', function (req, res) {
        Search.findById(req.params.id, function (err, search) {
            if (!err) {
                search.starred = true;
                search.save();
                res.json({
                    message: 'Search starred'
                });
            }
        });
    });
};
