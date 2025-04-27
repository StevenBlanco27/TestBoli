angular.module('Frosch')
    .controller('PrincipalCtrl', function ($scope, $state, chico, config, hotkeys, audio, $timeout) {

        // Detener audio de configuración si existe
        if ($scope.configurarAudio) {
            $scope.configurarAudio.stop();
        }

        const lanzamientoAudio = new audio("lanzamiento.ogg", false);
        const cambioJugadorAudio = new audio("c_jugador.ogg", true);

        const keymap = config.configuracion.keymap;
        $scope.jugadores = chico.getJugadores();
        $scope.config = config;
        $scope.chico = chico;

        // Activar primer jugador
        if ($scope.jugadores.length > 0) {
            $scope.jugadores[0].activar();
        }

        // Animar orificio y reproducir sonido de lanzamiento
        function rotar(orificio) {
            const idx = orificio - 1;
            const $element = angular.element(document.querySelectorAll('.orificios .argolla')[idx]);
            if ($element.length) {
                $element.addClass('rotar');
                $element.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    $element.removeClass('rotar');
                });
            }
            lanzamientoAudio.play();
        }

        // Función para sumar puntos al jugador actual
        $scope.sumarPuntos = function (orificio) {
            if (!chico.jugadorActual.terminoTurno) {
                rotar(orificio);
                chico.jugadorActual.sumarPuntos(config.configuracion.orificios[orificio - 1]);

                if (orificio === config.configuracion.orificioRana) {
                    $state.go('jugar.chico.principal.rana');
                } else if (orificio === config.configuracion.orificioRanita) {
                    $state.go('jugar.chico.principal.ranita');
                } else if (chico.jugadorActual.monona) {
                    $state.go('jugar.chico.principal.monona');
                } else if (chico.jugadorActual.gano) {
                    $state.go('jugar.chico.principal.ganaste');
                }

                chico.verificarTurno();
            }
        };

        // Función para cambiar de turno
        $scope.cambiarTurno = function (turno) {
            if ($state.current.name !== 'jugar.chico.principal') {
                return; // No cambiar turno si estamos en notificaciones
            }

            try {
                chico.cambiarTurno(turno);
                $timeout(function () {
                    if (!chico.termino) {
                        cambioJugadorAudio.play();
                    }
                }, chico.jugadorAnterior.blanqueado ? 3000 : 0);

                if (chico.jugadorAnterior.blanqueado) {
                    $state.go('jugar.chico.principal.blanqueado');
                }
            } catch (e) {
                console.error('Error al cambiar de turno:', e);
            }
        };

        // --- Configuración de Hotkeys ---

        const hotkeysBound = hotkeys.bindTo($scope);

        // Hotkeys para cada orificio (dinámico)
        angular.forEach(config.configuracion.orificios, function (valor, indice) {
            const numOrificio = indice + 1;
            hotkeysBound.add({
                combo: keymap['orificio' + numOrificio],
                callback: function () {
                    $scope.sumarPuntos(numOrificio);
                }
            });
        });

        // Hotkey para cambiar de jugador
        hotkeysBound.add({
            combo: keymap.cambiarJugador,
            callback: function () {
                $scope.cambiarTurno(true); // Cambio automático de jugador
            }
        });

        // Hotkey para regresar al menú
        hotkeysBound.add({
            combo: keymap.menu,
            callback: function () {
                $state.go('inicio');
            }
        });

    });
