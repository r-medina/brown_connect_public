/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert');


describe('index', function () {

    var mock;


    beforeEach(function (done) {
        kraken.create(app).listen(function (err, server) {
            mock = server;
            done(err);
        });
    });


    afterEach(function (done) {
        mock.close(done);
    });


    // doesn't run any javascript--just checking if template is loaded (which should
    // contain `ng-view`)
    it('should say "ng-view"', function (done) {
        request(mock)
            .get('/')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/ng-view/)
            .end(function(err, res){
                done(err);
            });
    });

});
