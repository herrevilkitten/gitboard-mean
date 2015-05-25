class EditorController {

    /*@ngInject*/
    constructor($scope, $routeParams, $location, $log, BoardService, UserService) {
        const MODE_DRAWING_PENCIL = 0;
        const MODE_DRAWING_LINE = 1;
        const MODE_DRAWING_RECT = 2;
        const MODE_DRAWING_OVAL = 3;
        const MODE_DRAWING_TEXT = 4;

        this.$log = $log;
        this.$location = $location;

        $scope.closeBoard = () => {
            $location.path('board');
        };

        $scope.boardId = $routeParams.boardId;
        $scope.board = SVG('virtualBoard').size(2048, 2048);
        $scope.drawingMode = MODE_DRAWING_PENCIL;
        $scope.drawing = null;
        $scope.color = {
            foreground: 'rgba(0, 0, 0, 1)',
            fill: 'rgba(255, 255, 255, 1)',
            complementary: function(color) {
                return new SVG.Color(color).complementary();
            }
        };

        $scope.boardInfo = null;
        BoardService
            .get($scope.boardId)
            .then(result => {
                $scope.boardInfo = result.data;
            });

        $scope.me = null;
        UserService
            .me()
            .then(response => {
                $scope.me = response.data;
            });


        function beginDrawing(event) {
            $scope.$apply(function() {
                $log.info('Begin drawing:', event);
                var x = event.offsetX,
                    y = event.offsetY;

                switch ($scope.drawingMode) {
                case MODE_DRAWING_PENCIL:
                    $scope.drawing = $scope.board.path().attr({
                        fill: 'none',
                        stroke: $scope.color.foreground,
                        'stroke-width': 1
                    }).M(x, y);
                    break;
                case MODE_DRAWING_LINE:
                    $scope.drawing = $scope.board.line(x, y, x, y).attr({
                        fill: $scope.color.fill,
                        stroke: $scope.color.foreground,
                        x2: x,
                        y2: y,
                        originalX: x,
                        originalY: y
                    });
                    break;
                case MODE_DRAWING_RECT:
                    $scope.drawing = $scope.board.rect(1, 1).attr({
                        fill: $scope.color.fill,
                        stroke: $scope.color.foreground,
                        'stroke-width': 1,
                        originalX: x,
                        originalY: y
                    });
                    $scope.drawing.move(x, y);
                    break;
                case MODE_DRAWING_OVAL:
                    $scope.drawing = $scope.board.ellipse(1, 1).attr({
                        fill: $scope.color.fill,
                        stroke: $scope.color.foreground,
                        'stroke-width': 1,
                        originalX: x,
                        originalY: y
                    }).move(x, y);
                    break;
                }
            });
        }

        function endDrawing(event) {
            $scope.$apply(function() {
                $log.info('End drawing:', event);
                if ($scope.drawing === null) {
                    return;
                }
                $scope.drawing = null;
            });
        }

        function performDrawing(event) {
            $scope.$apply(function() {
                let x = event.offsetX,
                    y = event.offsetY;

                if ($scope.drawing) {
                    $log.info('Perform drawing:', event);
                    switch ($scope.drawingMode) {
                    case MODE_DRAWING_PENCIL:
                        $scope.drawing.attr({
                            fill: 'none',
                            stroke: $scope.color.foreground,
                            'stroke-width': 1
                        }).L(x, y);
                        break;
                    case MODE_DRAWING_LINE:
                        $scope.drawing.attr({
                            fill: $scope.color.fill,
                            stroke: $scope.color.foreground,
                            x2: x,
                            y2: y
                        });
                        break;
                    case MODE_DRAWING_RECT:
                    {
                        let attr = $scope.drawing.attr(),
                            originalX = attr.originalX,
                            originalY = attr.originalY,
                            width = Math.abs(originalX - x),
                            height = Math.abs(originalY - y),
                            newX = originalX,
                            newY = originalY;

                        if (originalX > x) {
                            newX = x;
                        }
                        if (originalY > y) {
                            newY = y;
                        }

                        if (event.shiftKey) {
                            height = width = Math.min(width, height);
                            if (newX === x) {
                                newX = originalX - width;
                            }

                            if (newY === y) {
                                newY = originalY - height;
                            }
                        }

                        if (newX !== originalX || newY !== originalY) {
                            $scope.drawing.move(newX, newY);
                        }

                        $scope.drawing.size(width, height);
                        $scope.drawing.attr({
                            fill: $scope.color.fill,
                            stroke: $scope.color.foreground
                        });
                        break;
                    }
                    case MODE_DRAWING_OVAL:
                    {
                        let attr = $scope.drawing.attr(),
                            originalX = attr.originalX,
                            originalY = attr.originalY,
                            width = Math.abs(originalX - x) * 2,
                            height = Math.abs(originalY - y) * 2;

                        if (event.shiftKey) {
                            let radius = Math.sqrt(Math.pow(originalX - x, 2) + Math.pow(originalY - y, 2));
                            $scope.drawing.radius(radius, radius);
                        } else {
                            $scope.drawing.size(width, height);
                        }

                        $scope.drawing.attr({
                            fill: $scope.color.fill,
                            stroke: $scope.color.foreground
                        });
                        break;
                    }
                    }
                }
            });
        }

        $scope.board.on('mousedown', beginDrawing);
        $scope.board.on('mouseup', endDrawing);
        $scope.board.on('mousemove', performDrawing);
    }
}