'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    passport = require('passport'),
    db = require('./lib/database'),
    userLoader = require('./lib/user_loader'),
    app = {};



app.configure = function configure(nconf, next) {
    // Fired when an app configures itself

    this.settings = {};

    // configure the database
    db.config(nconf.get('databaseConfig'));

    var liveReloadPort = nconf.get('liveReloadPort'),
        port = nconf.get('port');

    // global hostname
    process.HOST = 'http://' + nconf.get('host') + (port ? ':' + port : '');

    if (liveReloadPort) {
        this.settings.liveReloadPort = liveReloadPort;
    }

    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.

    // for live reloading shit on the front-end
    server.configure('development', function () {
        server.use(require('connect-livereload')({
            port: app.settings.liveReloadPort
        }));
    });

    server.use(express.logger('dev'));
    server.use(express.methodOverride());
    server.use(express.bodyParser());
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(express.cookieParser());
    server.use(userLoader());
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
