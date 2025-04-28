angular.module('Frosch')
    .controller('SeleccionEquposCtrl',
    function ($scope, $state, config,audio) {
        const sonidoSeleccion = new audio('s_jugador.ogg', true);
        sonidoSeleccion.play();
        $scope.callback = {
            configurar: function configurar(opcion) {
                config.setMaxPorEquipo(opcion);
                $state.go('jugar.chico.seleccionBlanqueada')
            }
        };

        $scope.config = config;

    });