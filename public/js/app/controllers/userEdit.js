'use strict';


define('controllers/userEdit', [
    'controllers/controllers'
], function (mainControllers) {

    mainControllers.controller(
        'UserEditCtrl', [
            '$scope', '$location', 'Tag', 'User',
            function UserEditCtrl($scope, $location, Tag, User) {
                $scope.edit = {};
                $scope.edit.user = User.getEditable();
                $scope.edit.tagSuggestions = [];
                $scope.tagSuggestions = [];
                $scope.edit.opportunityObj = {};
                var promise;
                var oppTypes = [
                    'mentorship',
                    'funding',
                    'employment',
                    'networking'
                ];

                $scope.makeEdit = function () {
                    User.edit({
                        name: $scope.edit.user.name,
                        title: $scope.edit.user.title,
                        photoURL: $scope.edit.user.photoURL,
                        skills: $scope.edit.user.skills,
                        locations: $scope.edit.user.locations,
                        companies: $scope.edit.user.companies,
                        companyOptIn: $scope.edit.user.companyOptIn,
                        opportunityTypes: (function () {
                            var opportunityTypes = [];

                            for (var opp in $scope.edit.opportunityObj) {
                                if ($scope.edit.opportunityObj[opp]) {
                                    opportunityTypes.push(opp);
                                }
                            }

                            return opportunityTypes;
                        })(),
                        providerSummary: $scope.edit.user.providerSummary,
                        seekerSummary: $scope.edit.user.seekerSummary
                    }, function () {
                        $location.path('/profile');
                    }, function (err) {
                        console.log(err);
                    });
                };

                // COPIED FROM SEARCH
                // function that gets the autocomplete suggestions
                $scope.tagComplete = function (tagString, tagType, whichTags) {
                    promise = Tag.autocomplete({
                        tagString: tagString.$modelValue,
                        tagType: tagType
                    }).$promise;

                    promise.then(function (tagSuggestions) {
                        $scope.edit.tagSuggestions[whichTags] = tagSuggestions.filter(
                            function (tag) {
                                return $scope.checkNew(tag._id, whichTags);
                            });
                    });
                };

                $scope.tagPost = function (tagString, tagType, whichTags) {
                    promise = Tag.add({
                        tagString: tagString.$modelValue,
                        tagType: tagType
                    }).$promise;
                    promise.then(function (tag) {
                        var _id = tag._id;
                        if ($scope.checkNew(_id, whichTags)) {
                            $scope.edit.user[whichTags].push({
                                _id: _id,
                                displayText: tag.displayText
                            });
                        }
                    });

                    $scope.edit[tagType] = '';
                    $scope.edit.tagSuggestions[whichTags] = [];
                };

                $scope.edit.isProvider = function () {
                    if ($scope.edit.opportunityObj) {
                        for (var type in $scope.edit.opportunityObj) {
                            if ($scope.edit.opportunityObj[type]) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                $scope.$watch('edit.user.opportunityTypes', function () {
                    if ($scope.edit.user.opportunityTypes) {
                        for (var i = 0; i < oppTypes.length; i++) {
                            $scope.edit.opportunityObj[oppTypes[i]] =
                                ($scope.edit.user.opportunityTypes.indexOf(
                                oppTypes[i]) != -1);
                        }
                    }
                });

                // COPIED FROM SEARCH
                // to check if an id is new
                $scope.checkNew = function (_id, whichTags) {
                    var isNew = true;

                    for (var i = 0; i < $scope.edit.user[whichTags].length; i++) {
                        if ($scope.edit.user[whichTags][i]._id == _id) {
                            isNew = false;
                            break;
                        }
                    }

                    return isNew;
                };
            }
        ]
    );

});
