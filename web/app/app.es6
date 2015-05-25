var app = angular.module('app', ['ng', 'ngRoute', 'ui.bootstrap', 'colorpicker.module']);

app.constant('config', {
    apiUrl: '../api/'
});

app.config(($routeProvider, $locationProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: 'app/main/main.tpl.html',
            controller: 'MainController'
        })
        .when('/board', {
            templateUrl: 'app/board/dashboard.tpl.html',
            controller: 'DashboardController'
        })
        .when('/board/:boardId', {
            templateUrl: 'app/board/editor.tpl.html',
            controller: 'EditorController'
        });
    $locationProvider.html5Mode(true);
});

register('app')
    .controller('DashboardController', DashboardController)
    .controller('EditorController', EditorController)
    .controller('MainController', MainController)
    .controller('NavbarController', NavbarController)
    .controller('CreateBoardModal', CreateBoardModal)
    .service('BoardService', BoardService)
    .service('UserService', UserService);