'use strict';


define('directives/edit', [
  'directives/directives'
], function (mainDirectives) {

  mainDirectives.directive('edit', function () {

    var link = function (scope, element) {
      element.find('#submit-edit').on('click', function (e) {
        e.preventDefault();
        scope.makeEdit();
      });
    };

    return {
      link: link
    };

  });

});
