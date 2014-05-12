'use strict';

var mainServices = angular.module('mainServices', []);

// for getting profiles/sending messages
mainServices.factory('User', ['$resource',
  function ($resource) {
    return $resource('/user/:id/:service', {}, {
      get: {
        method: 'GET',
        params: {
          service: 'profile'
        }
      },
      edit: {
        method: 'PUT',
        params: {
          service: 'profile'
        }
      },
      getEditable: {
        method: 'GET',
        params: {
          service: 'edit'
        }
      },
      block: {
        method: 'POST',
        params: {
          service: 'block'
        }
      },
      star: {
        method: 'PUT',
        params: {
          service: 'star',
          id: '@id'
        }
      },
      unstar: {
        method: 'PUT',
        params: {
          service: 'unstar',
          id: '@id'
        }
      },
      getShort: {
        method: 'GET',
        params: {
          service: 'short',
          id: '@id'
        }
      }
    });
  }
]);

mainServices.factory('Message', ['$resource',
  function ($resource) {
    return $resource('/messages/:user/:id/', {}, {
      getAll: {
        method: 'GET',
        isArray: true
      },
      getOne: {
        method: 'GET'
      },
      send: {
        method: 'PUT',
        header: {
          json: true
        },
        params: {
          user: 'user',
          id: '@id'
        }
      }
    });
  }
]);

// for getting and editing one's brown affilitation
mainServices.factory('UserAffiliation', ['$resource',
  function ($resource) {
    return $resource('/user/affiliation');
  }
]);

// for the tag autocomplete
mainServices.factory('Tag', ['$resource',
  function ($resource) {
    return $resource('/tags/:service', {}, {
      autocomplete: {
        method: 'GET',
        params: {
          service: 'autocomplete'
        },
        isArray: true
      },
      add: {
        method: 'POST',
        headers: {
          json: true
        }
      }
    });
  }
]);

mainServices.factory('Search', ['$resource',
  function ($resource) {
    return $resource('/search', {}, {
      search: {
        method: 'GET',
        isArray: true
      }
    });
  }
]);

mainServices.factory('Peers', ['$resource',
  function ($resource) {
    return $resource('/peers/company/:id', {}, {
      search: {
        method: 'GET',
        params: {
          id: '@id'
        },
        isArray: true
      }
    });
  }
]);
