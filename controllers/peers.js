'use strict';

var User = require('../models/user');

module.exports = function (server) {

    // Given params tagString and tagType return a list of potential tags
    server.get('/peers/company/:id', function (req, res) {
        User
            .where('isBrownAffiliate', true)
            .where('companies._id', req.params.id)
            .exec(function (err, peers) {
                console.log(peers);
                res.json(peers.map(function (user) {
                    return user.peerSearchFields();
                }));
            });
    });
};
