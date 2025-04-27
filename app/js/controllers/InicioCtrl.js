angular.module('Frosch')
    .controller('InicioCtrl', function ($scope, $state, hotkeys, config, $http, $interval) {
        $scope.cargado = false;
        $scope.imagenFondoBase64 = '';

        // 👉 Precargar la imagen como Base64
        function precargarImagen(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                var reader = new FileReader();
                reader.onloadend = function() {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        }

        precargarImagen('assets/img/ranas-esquina.png', function(base64) {
            $scope.$apply(function() {
                $scope.imagenFondoBase64 = base64;
                $scope.cargado = true;
            });
        });

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

        function cargarVideo(numero) {
            let videoURL = 'assets/videos/video' + numero + '.webm';
            let promise = $http.head(videoURL);
            if (promise)
                promise.then(function () {
                    $scope.videos.push([{
                        src: videoURL,
                        type: "video/webm"
                    }]);
                    cargarVideo(numero + 1);
                });
        }

        cargarVideo(1);

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
