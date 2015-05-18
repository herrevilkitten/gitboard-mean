class NavbarController {
    /*@ngInject*/
    constructor($scope, UserService) {
        UserService
            .get()
            .then(function(response) {
                $scope.me = response.data;
            });
    }
}