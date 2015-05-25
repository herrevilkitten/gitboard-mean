class NavbarController {
    /*@ngInject*/
    constructor($scope, $log, UserService) {
        $scope.me = null;
        UserService
            .me()
            .then(response => {
                $scope.me = response.data;
            });
    }
}