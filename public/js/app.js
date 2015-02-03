'use strict';


require.config({
    paths: {
        lib: './lib',
        app: './app',
        directives: './app/directives',
        controllers: './app/controllers',
        components: './components'
    }
});

require(['app/app'], function () {
    // bootstrap angular
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['mainApp']);
    });
});
