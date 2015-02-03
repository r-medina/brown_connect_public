'use strict';


define('directives/search', [
    'directives/directives'
], function (mainDirectives) {

    mainDirectives.directive('search', function () {

        var link = function (scope, element) {
            // removes tags when they're clicked
            scope.removeTag = function (e) {
                e.preventDefault();

                var elm = angular.element(e.target),
                    _id = elm.attr('_id');

                scope.search.tags = scope.search.tags.filter(function (tag) {
                    return tag._id != _id;
                });
            };

            // adds a suggested tag from the autocomplete list when clicked
            scope.addSuggestedTag = function (e) {
                e.preventDefault();

                var elm = angular.element(e.target),
                    _id = elm.attr('_id');

                var isNew = scope.checkNew(_id);

                if (isNew) {
                    scope.search.tags.push({
                        _id: _id,
                        displayText: elm.attr('displayText')
                    });
                }

                scope.search.tagString = '';
                scope.search.tagSuggestions = [];
                angular.element('#tagIn').focus();
                scope.searchForm.tagString.$setPristine();
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
