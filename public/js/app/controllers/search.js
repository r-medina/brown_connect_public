'use strict';


define('controllers/search', [
  'controllers/controllers'
], function (mainControllers) {

  mainControllers.controller(
    'SearchCtrl', [
      '$scope', 'Tag', 'Search', 'User',
      function SearchCtrl($scope, Tag, Search, User) {
        $scope.search = {};
        $scope.search.opportunityTypes = ['mentorship', 'funding', 'employment',
          'networking'
        ];
        // tags to be searched
        $scope.search.tags = [];
        // suggestions from server
        $scope.search.tagSuggestions = [];
        // search results
        $scope.search.results = [];
        var promise;

        $scope.runSearch = function () {
          $scope.search.results = Search.search({
            tags: $scope.search.tags.map(function (tag) {
              return tag._id;
            }).join(','),
            opportunityTypes: $scope.search.opportunityTypes.filter(function (
              type) {
              return type != '';
            }).join(',')
          });
        };

        // function that gets the autocomplete suggestions
        $scope.tagComplete = function () {
          promise = Tag.autocomplete({
            tagString: $scope.search.tagString
          }).$promise;

          promise.then(function (tagSuggestions) {
            $scope.search.tagSuggestions = tagSuggestions.filter(function (tag) {
              return $scope.checkNew(tag._id);
            });
          });
        };

        // to check if an id is new
        $scope.checkNew = function (_id) {
          var isNew = true;

          for (var i = 0; i < $scope.search.tags.length; i++) {
            if ($scope.search.tags[i]._id == _id) {
              isNew = false;
              break;
            }
          }

          return isNew;
        };

        $scope.starUser = function (user) {
          User.star({
            id: user._id
          }).$promise.then(function (data) {
            user.starred = true;
          });
        };

        $scope.unstarUser = function (user) {
          User.unstar({
            id: user._id
          }).$promise.then(function (data) {
            user.starred = false;
          });
        };
      }
    ]
  );

});
