'use strict';


var IndexModel = require('../models/index');


module.exports = function (server) {

    var model = new IndexModel();

    server.get('/', function (req, res) {
        res.render('index', model);
    });

};
