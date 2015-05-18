class DashboardController {
    /*@ngInject*/
    constructor($scope, UserService, BoardService, $modal) {
        $scope.me = null;
        UserService
            .get()
            .then(function(response) {
                $scope.me = response.data;
            });


        $scope.boards = [];
        BoardService
            .list()
            .then(function(response) {
                $scope.boards = response.data;
            });

        $scope.createBoard = function() {
            var modalInstance = $modal.open({

            });
        };
    }
}