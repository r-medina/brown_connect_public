'use strict';

define('controllers/profile', [
    'controllers/controllers'
], function (mainControllers) {

    mainControllers.controller(
        'ProfileCtrl', ['$rootScope', '$scope', '$routeParams', 'Tag', 'User',
            // do something to check if user is on their own page
            function IndexCtrl($rootScope, $scope, $routeParams, Tag, User) {
                $scope.profile = {};

                $scope.user = User.get();
                $scope.user.$promise.then(function (user) {
                    if ($routeParams.id && $routeParams.id != user.shortID) { // ask ben about this
                        $scope.profile.user = User.get({
                            id: $routeParams.id
                        });
                        $scope.profile.user.$promise.then(function (user) {
                            $scope.profile.user._id = $routeParams.id;
                            $rootScope.title = user.name;
                        });
                        $scope.additionalURL = 'html/profile_other.html';
                    } else {
                        $scope.profile.user = user;
                        $rootScope.title = user.name;
                        $scope.additionalURL = 'html/profile_own.html';
                    }
                });

                $scope.starUser = function () {
                    User.star({
                        id: $scope.profile.user.shortID
                    }).$promise.then(function (data) {
                        $scope.profile.user.starred = true;
                    });
                };

                $scope.unstarUser = function () {
                    User.unstar({
                        id: $scope.profile.user.shortID
                    }).$promise.then(function (data) {
                        $scope.profile.user.starred = false;
                    });

                };

                $scope.blockUser = function () {
                    User.block({
                        id: $scope.profile.user.shortID
                    });
                };
            }
        ]
    );

});
