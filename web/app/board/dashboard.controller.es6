class DashboardController {
    /*@ngInject*/
    constructor($scope, UserService, BoardService, $modal) {
        $scope.me = null;
        UserService
            .me()
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
                animation: false,
                templateUrl: 'createBoardModal.html',
                controller: 'CreateBoardModal',
                size: 'sm'
            });

            modalInstance
                .result
                .then(function(data) {
                    BoardService
                        .create(data);
                });
        };
    }
}

class CreateBoardModal {
    constructor($scope, $modalInstance) {
        $scope.name = '';

        $scope.ok = function() {
            $modalInstance.close({
                name: $scope.name
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
}