var tests = Object.keys(window.__karma__.files).filter(RegExp.prototype.test.bind(/-test\.js$/));


window.requirejs.config({

  // Karma serves files from '/base'
  baseUrl: '/base/public/js',

  shim: {
    'app/controllers': {
      exports: 'mainControllers'
    },
    'app/directives': {
      exports: 'mainDirectives'
    },
    'app/app': {
      deps: ['app/controllers', 'app/directives']
    },
    'app': {
      deps: ['app/app'],
      exports: 'app'
    }
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start tests, once Require.js is done
  callback: function () {
    window.__karma__.start();
  }
});
