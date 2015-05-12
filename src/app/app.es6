var app = angular.module('app', ['ng', 'ngRoute']);

app.constant('config', {
    apiUrl: '../api/'
});

app.config(($routeProvider, $locationProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: 'app/main/main.tpl.html',
            controller: 'MainController'
        })
        .when('/boards', {
            templateUrl: 'app/boards/dashboard.tpl.html',
            controller: 'DashboardController'
        })
        .when('/board/:boardId', {
            templateUrl: 'app/boards/editor.tpl.html',
            controller: 'EditorController'
        });
    $locationProvider.html5Mode(true);
});

register('app')
    .controller('DashboardController', DashboardController)
    .controller('EditorController', EditorController)
    .controller('MainController', MainController)
    .controller('NavbarController', NavbarController)
    .service('UserService', UserService);