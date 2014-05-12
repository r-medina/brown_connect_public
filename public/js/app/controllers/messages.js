'use strict';

define('controllers/messages', [
  'controllers/controllers'
], function (mainControllers) {

  mainControllers.controller('MsgsCtrl', [
    '$scope', 'Message', 'User',
    function MsgsCtrl($scope, Message, User) {
      var messagedUsers = [];
      $scope.messages = Message.getAll();

      $scope.messages.$promise.then(function (messages) {
        messages.map(function (msg) {
          if (messagedUsers[msg.messagedUserID]) {
            msg.messagedUser = messagedUsers[msg.messagedUserID];
          } else {
            msg.messagedUser = User.getShort({
              id: msg.messagedUserID
            });
          }
        });
      });
    }
  ]);

});
