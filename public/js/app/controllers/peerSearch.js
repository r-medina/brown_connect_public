'use strict';

define('controllers/peerSearch', [
    'controllers/controllers'
], function (mainControllers) {

    mainControllers.controller(
        'PeerSearchCtrl', [
            '$scope', 'Tag', 'Peers', 'User',
            function PeerSearchCtrl($scope, Tag, Peers, User) {
                $scope.search = {};
                $scope.search.company = [];
                // suggestions from server
                $scope.search.tagSuggestions = [];
                // search results
                $scope.search.results = [];
                var promise;

                $scope.runSearch = function () {
                    $scope.search.results = Peers.search({
                        id: $scope.search.company[0]._id
                    });
                };

                // function that gets the autocomplete suggestions
                $scope.tagComplete = function () {
                    promise = Tag.autocomplete({
                        tagString: $scope.search.tagString,
                        tagType: 'company'
                    }).$promise;

                    promise.then(function (tagSuggestions) {
                        $scope.search.tagSuggestions = tagSuggestions;
                    });
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
