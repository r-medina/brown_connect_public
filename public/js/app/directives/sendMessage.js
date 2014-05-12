'use strict';


define('directives/sendMessage', [
  'directives/directives'
], function (mainDirectives) {

  mainDirectives.directive('sendMsg', function () {

    var link = function (scope, element) {
      console.log();

      element.find('#submit-message').on('click', function (e) {
        e.preventDefault();

        if (scope.messageForm.$valid) {
          scope.sendMessage().then(function () { // success callback
            scope.msg.success = true;
          }, function (err) { // error callback
            scope.msg.err = err.data['error'];
          });
        }
      });
    };

    return {
      link: link
    };

  });

});
