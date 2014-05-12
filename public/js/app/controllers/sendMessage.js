'use strict';

define('controllers/sendMessage', [
  'controllers/controllers'
], function (mainControllers) {

  mainControllers.controller('SendMsgCtrl', [
    '$scope', '$routeParams', 'User', 'Message',
    function SndMsgCtrl($scope, $routeParams, User, Message) {
      $scope.msg = {};
      $scope.msg.user = User.get({
        id: $routeParams.id
      });

      $scope.sendMessage = function () {
        return Message.send({
          id: $routeParams.id,
          subject: $scope.message.subject,
          body: $scope.message.body
        }).$promise;
      };
    }
  ]);

});
