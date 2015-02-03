'use strict';

var Tag = require('../models/tag'),
    defaultTagType = '';

module.exports = function (server) {

    // Given params tagString and tagType return a list of potential tags
    server.get('/tags/autocomplete', function (req, res) {
        Tag.findTagsWithString(
            req.query.tagString || '', req.query.tagType || defaultTagType,
            function (err, tags) {
                var result = {
                    error: 'Unable to query tags'
                };

                if (!err) result = tags;

                res.json(result);
            });
    });

    // Given tagString and tagType create a new Tag and return it
    server.post('/tags', function (req, res) {
        Tag.createTag(req.body.tagString || '', req.body.tagType ||
            defaultTagType, function (tag) {
                res.json(tag);
            });
    });

};
