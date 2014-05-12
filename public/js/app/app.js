'use strict';


define('app/app', [
  'controllers/userEdit',
  'controllers/search',
  'controllers/peerSearch',
  'controllers/profile',
  'controllers/messages',
  'controllers/sendMessage',
  'directives/push',
  'directives/index',
  'directives/search',
  'directives/acTags',
  'directives/sendMessage',
  'directives/peerSearch',
  'directives/edit',
  'app/services'
], function () {

  var mainApp = angular.module('mainApp', [
    'ngRoute',
    'ngResource',
    'mainControllers',
    'mainDirectives',
    'mainServices'
  ]);

  mainApp.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider.
      when('/', {
        templateUrl: 'html/index.html',
        title: 'Index'
      }).
      when('/home', {
        templateUrl: 'html/home.html',
        title: 'Home'
      }).
      when('/messages', {
        templateUrl: 'html/message_list.html',
        controller: 'MsgsCtrl',
        title: 'Messages'
      }).
      when('/message/user/:id', {
        templateUrl: 'html/message_form.html',
        controller: 'SendMsgCtrl',
        title: 'Message'
      }).
      when('/message/:id', {
        templateUrl: 'html/message.html',
        title: 'Message'
      }).
      when('/search', {
        templateUrl: 'html/search.html',
        controller: 'SearchCtrl',
        title: 'Search'
      }).
      when('/peer_search', {
        templateUrl: 'html/peer_search.html',
        controller: 'PeerSearchCtrl',
        title: 'Peer Search'
      }).
      when('/:id?/profile', {
        templateUrl: 'html/profile.html',
        controller: 'ProfileCtrl',
        title: 'Profile'
      }).
      when('/profile/edit', {
        templateUrl: 'html/profile_edit.html',
        controller: 'UserEditCtrl',
        title: 'Edit'
      }).
      otherwise({
        redirectTo: '/'
      });
    }
  ]);

  mainApp.run(['$rootScope',
    function ($rootScope) {
      $rootScope.$on('$routeChangeSuccess', function (e, currentRoute,
        previousRoute) {
        $rootScope.title = currentRoute.title;
      });
    }
  ]);

  return mainApp;

});
