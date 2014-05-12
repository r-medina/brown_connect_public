'use strict';

define(['app'], function() {

  describe('version', function() {
    beforeEach(module('mainApp'));

    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));

  });

});
