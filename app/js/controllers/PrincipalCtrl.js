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

        if ($scope.jugadores.length > 0) {
            $scope.jugadores[0].activar();
        }

        // Función para encontrar y animar un orificio sin jQuery
        function rotar(orificio) {
            const elements = document.querySelectorAll('.orificios .argolla');
            if (elements && elements[orificio - 1]) {
                const el = elements[orificio - 1];
                el.classList.add('rotar');
                const removeRotation = () => el.classList.remove('rotar');
                el.addEventListener('transitionend', removeRotation, { once: true });
                el.addEventListener('webkitTransitionEnd', removeRotation, { once: true });
            }
            lanzamientoAudio.play();
        }

        // Función para sumar puntos
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

        // Función para cambiar turno
        $scope.cambiarTurno = function (turno) {
            if ($state.current.name !== 'jugar.chico.principal') {
                return;
            }

            try {
                chico.cambiarTurno(turno);
                $timeout(() => {
                    if (!chico.termino) {
                        cambioJugadorAudio.play();
                    }
                }, chico.jugadorAnterior.blanqueado ? 3000 : 0);

                if (chico.jugadorAnterior.blanqueado) {
                    $state.go('jugar.chico.principal.blanqueado');
                }
            } catch (e) {
                console.error('Error cambiando turno:', e);
            }
        };

        // --- Configuración de Hotkeys ---
        const hotkeysBound = hotkeys.bindTo($scope);

        // Hotkeys para orificios (dinámico)
        angular.forEach(config.configuracion.orificios, function (valor, indice) {
            const numOrificio = indice + 1;
            hotkeysBound.add({
                combo: keymap['orificio' + numOrificio],
                callback: function () {
                    $scope.sumarPuntos(numOrificio);
                }
            });
        });

        // Hotkey para cambiar jugador
        hotkeysBound.add({
            combo: keymap.cambiarJugador,
            callback: function () {
                $scope.cambiarTurno(true);
            }
        });

        // Hotkey para volver al menú
        hotkeysBound.add({
            combo: keymap.menu,
            callback: function () {
                $state.go('inicio');
            }
        });

    });
