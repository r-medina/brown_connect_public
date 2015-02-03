'use strict';


define('directives/peerSearch', [
    'directives/directives'
], function (mainDirectives) {

    mainDirectives.directive('peerSearch', function () {

        var link = function (scope, element) {
            // removes tags when they're clicked
            scope.removeTag = function (e) {
                e.preventDefault();

                var elm = angular.element(e.target),
                    _id = elm.attr('_id');

                scope.search.company = [];
            };

            // adds a suggested tag from the autocomplete list when clicked
            scope.addSuggestedTag = function (e) {
                e.preventDefault();

                var elm = angular.element(e.target),
                    _id = elm.attr('_id');

                scope.search.company = [{
                    _id: _id,
                    displayText: elm.attr('displayText')
                }];

                scope.search.tagString = '';
                scope.search.tagSuggestions = [];
                scope.searchForm.tagString.$setValidity('notFound', true);
            };

            element.find('#run-search').on('click', function (e) {
                e.preventDefault();

                scope.runSearch();
            });

            // listens for key events and does several things
            scope.searchKeyEvent = function (e) {
                scope.searchForm.tagString.$setValidity('notFound', true);
                if (e.keyCode === 13) {
                    if (scope.search.tagSuggestions) {
                        angular.element(element.find('ul.f-dropdown li').get(
                            1)).find('a').focus();
                    } else {
                        scope.searchForm.tagString.$setValidity('notFound',
                            false);
                    }
                } else if (scope.searchForm.tagString.$valid) {
                    scope.tagComplete();
                } else if (!scope.searchForm.tagString.$valid) {
                    scope.search.tagSuggestions = [];
                }
            };

            element.find('form[name="searchForm"]').on('submit', function (e) {
                e.preventDefault();
            });
        };

        return {
            link: link
        };

    });

});
