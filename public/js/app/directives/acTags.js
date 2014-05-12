'use strict';


define('directives/acTags', [
  'directives/directives'
], function (mainDirectives) {

  mainDirectives.directive('acTags', function () {

    var link = function (scope, element) {
      var tagType = element.attr('tagType'),
        whichTags = element.attr('whichTags');

      scope.edit.user[whichTags] = [];

      scope.removeTag = function (e, tagType, whichTags) {
        e.preventDefault();

        var elm = angular.element(e.target),
          _id = elm.attr('_id');

        scope.edit.user[whichTags] = scope.edit.user[whichTags].filter(
          function (tag) {
            return tag._id != _id;
          });
      };

      scope.acKeyEvent = function (e, tagType, whichTags) {
        if (e.keyCode === 13 && scope.editForm[tagType].$valid) {
          scope.tagPost(scope.editForm[tagType], tagType, whichTags);
        } else if (scope.editForm[tagType].$valid) {
          scope.tagComplete(scope.editForm[tagType], tagType, whichTags);
        } else if (!scope.editForm[tagType].$valid) {
          scope.tagSuggestions[whichTags] = [];
        }
      };

      // adds a suggested tag from the autocomplete list when clicked
      scope.addSuggestedTag = function (e, tagType, whichTags) {
        e.preventDefault();

        var elm = angular.element(e.target),
          _id = elm.attr('_id');

        var isNew = scope.checkNew(_id, whichTags);

        if (isNew) {
          scope.edit.user[whichTags].push({
            _id: _id,
            displayText: elm.attr('displayText')
          });
        }

        scope.edit[tagType] = '';
        scope.edit.tagSuggestions = {};
        angular.element('#' + tagType + 'In').focus();
      };
    };

    return {
      link: link
    };

  });

});
