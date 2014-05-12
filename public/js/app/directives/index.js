'use strict';


define('directives/index', [
  'directives/directives'
], function (mainDirectives) {

  mainDirectives.directive('index', [
    '$window', '$document',
    function ($window, $document) {

      var link = function ($scope, $element) {
        // this is available because of foundation.js
        if (matchMedia(Foundation.media_queries.small).matches === false) {
          var window = angular.element($window),
            document = angular.element($document),
            banner = angular.element('#index-1-content #name-container'),
            nav = angular.element('.top-bar');

          // declaring a bunch of variables i'll need
          var windHeight,
            docHeight,
            bannerOrigTop,
            frac;

          var config = function () {
            windHeight = window.height();
            docHeight = document.height();
            frac = window.width() > 640 ? .67 : 1;
            bannerOrigTop = (windHeight * frac / 2) - (banner.height() / 2);
            banner.offset({
              top: bannerOrigTop
            });
          };

          var scroll = function () {
            var scrolled = window.scrollTop(),
              scrollFrac = scrolled / windHeight;

            // how much to blur the background
            var filterVal = 'blur(' + scrollFrac * 20 + 'px)';

            // to move the banner up
            banner.offset({
              top: bannerOrigTop + (scrolled / 2)
            });

            // actually blur background
            angular.element('#index-1-background')
              .css('filter', filterVal)
              .css('webkitFilter', filterVal);

            angular.element('#index-1-content')
              .css(
                'background-color', 'rgba(0, 0, 0,' + (scrollFrac / 4 + .5) + ')'
            );

            if (scrolled >= windHeight * frac - 45) {
              nav.css('top', 0);
            } else {
              nav.css('top', '-45px');
            }
          };

          config();

          window.on('resize', function (e) {
            config();
            scroll();
          });

          window.on('scroll', function (e) {
            scroll();
          });
        }
      };

      return {
        link: link
      };

    }
  ]);

});
