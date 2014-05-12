'use strict';


define('directives/push', [
  'directives/directives'
], function (mainDirectives) {

  // this directive controls the hiding side bar nav
  mainDirectives.directive('push', [
    '$document', '$location',
    function ($document, $location) {

      var link = function (scope, element) {
        var container = $document.find('.push-container'),
          body = $document.find('body'),
          menu = element.find('.push-menu'),
          btn = element.find('.push-menu-btn'),
          overlay = element.find('.push-site-overlay'),
          state = false;

        var togglePush = function () {
          menu.toggleClass('push-menu-open');
          btn.toggleClass('push-menu-btn-push');
          overlay.toggleClass('push-menu-open');
          // causes problems with picture location and name
          // container.toggleClass('push-container-push');
          state = !state;
        };

        // for closing when a user clicks a location
        scope.location = $location;
        scope.$watch('location.path()', function () {
          if (state) {
            togglePush();
            $document.scrollTop(0);
          }
        });

        btn.on('click', function (e) {
          togglePush();
        });

        overlay.on('click', function (e) {
          togglePush();
        });
      };

      return {
        link: link,
        templateUrl: 'html/push.html'
      };

    }
  ]);

});
