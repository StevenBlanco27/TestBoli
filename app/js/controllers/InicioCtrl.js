angular.module('Frosch')
    .controller('InicioCtrl', function ($scope, $state, hotkeys, config, $http, $interval) {
        $scope.cargado = false;
        $scope.imagenFondoBase64 = 'assets/img/ranas-esquina.webp';   // imagen optimizada
        $scope.cargado = true;

        $scope.iniciar = function () {
            $state.go('jugar.seleccionEquipos');
        };

        hotkeys.bindTo($scope)
            .add({
                combo: 'enter',
                description: 'Iniciar',
                callback: $scope.iniciar
            });

        $scope.videos = [];
        angular.forEach(config.listaVideos, function (fname) {
            $scope.videos.push([
              { src: 'assets/videos/' + fname, type: 'video/webm' }
            ]);
          });

        var timerVideo = $interval(function () {
            if ($scope.videos.length > 0) {
                $scope.mostrandoVideo = true;
                $scope.numVideo = Math.floor(Math.random() * ($scope.videos.length));
            }
        }, config.configuracion.minutosEntreVideos * 60 * 1000);

        $scope.quitarVideo = function () {
            $scope.mostrandoVideo = false;
        };

        $scope.$on('$destroy', function () {
            $interval.cancel(timerVideo);
        });
    });
