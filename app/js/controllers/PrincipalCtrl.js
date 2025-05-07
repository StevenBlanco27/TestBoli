angular.module('Frosch')
    .controller('PrincipalCtrl', function ($scope, $state, chico, config, hotkeys, audio, $timeout) {

        // Detener audio de configuración si existe
        if ($scope.configurarAudio) {
            $scope.configurarAudio.stop();
        }

        const lanzamientoAudio = new audio("lanzamiento.ogg", false);
        const cambioJugadorAudio = new audio("c_jugador.ogg", true);
        const ranaAudio = new audio("rana.ogg", true);
        const ranitaAudio = new audio("ranita.ogg", true);
        
        const keymap = config.configuracion.keymap;
        $scope.jugadores = chico.getJugadores();
        $scope.config = config;
        $scope.chico = chico;

        // Modal de confirmación
        $scope.mostrarModal = false;
        $scope.opcionSeleccionada = 'si'; // por defecto

        if ($scope.jugadores.length > 0) {
            $scope.jugadores[0].activar();
        }

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

        $scope.sumarPuntos = function (orificio) {
            if (!chico.jugadorActual.terminoTurno) {
                rotar(orificio);
                chico.jugadorActual.sumarPuntos(config.configuracion.orificios[orificio - 1]);

                if (orificio === config.configuracion.orificioRana) {
                    $scope.mostrarRana = true;
                    ranaAudio.play();
                    $timeout(() => { $scope.mostrarRana = false; }, 2000);
                } else if (orificio === config.configuracion.orificioRanita) {
                    $scope.mostrarRanita = true;
                    ranitaAudio.play();
                    $timeout(() => { $scope.mostrarRanita = false; }, 2000);
                } else if (chico.jugadorActual.monona) {
                    $state.go('jugar.chico.principal.monona');
                } else if (chico.jugadorActual.gano) {
                    $state.go('jugar.chico.principal.ganaste');
                }
        
                chico.verificarTurno();
        
                // 🚀 NUEVO: Cambio de turno automático si terminó el turno
                if (chico.jugadorActual.terminoTurno) {
                    $timeout(() => {
                        // 👀 Aquí usamos la MISMA lógica del manual (sonidos, animaciones incluidas)
                        $scope.cambiarTurno(true);
                    }, 3000);  // Pequeño retardo para que se vea bien (ajustable)
                }
            }
        };
        

        // Función para cambiar turno
        $scope.cambiarTurno = function (turno) {
            if ($state.current.name !== 'jugar.chico.principal') {
                return;
            }

            try {
                chico.cambiarTurno(turno);
                // ✅ Mostrar mensaje visual
                $scope.mostrarCambioJugador = true;

                // Reproducir sonido (si quieres también sonido aquí)
                if (!chico.termino) {
                    cambioJugadorAudio.play();
                }

                // Ocultar mensaje después de 1 segundo (o más si necesitas)
                $timeout(() => {
                    $scope.mostrarCambioJugador = false;
                }, 1000);

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

        // Modal: abrir
        $scope.abrirModalConfirmacion = function () {
            $scope.mostrarModal = true;
            $scope.opcionSeleccionada = 'si';
        };

        // Modal: confirmar selección
        $scope.confirmarModal = function () {
            if ($scope.opcionSeleccionada === 'si') {
                $scope.mostrarModal = false;
                $state.go('inicio');
            } else {
                $scope.mostrarModal = false;
            }
        };

        // Modal: cambiar selección con flechas
        $scope.cambiarSeleccion = function (direccion) {
            if (direccion === 'up' || direccion === 'down') {
                $scope.opcionSeleccionada = ($scope.opcionSeleccionada === 'si') ? 'no' : 'si';
            }
        };

        // --- Configuración de Hotkeys ---
        const hotkeysBound = hotkeys.bindTo($scope);

        // Hotkeys para orificios
        angular.forEach(config.configuracion.orificios, function (valor, indice) {
            const numOrificio = indice + 1;
            hotkeysBound.add({
                combo: keymap['orificio' + numOrificio],
                callback: function () {
                    if (!$scope.mostrarModal) {
                        $scope.sumarPuntos(numOrificio);
                    }
                }
            });
        });

        // Cambiar jugador
        hotkeysBound.add({
            combo: keymap.cambiarJugador,
            callback: function () {
                if (!$scope.mostrarModal) {
                    $scope.cambiarTurno(true);
                }
            }
        });

        // Menu (M)
        hotkeysBound.add({
            combo: keymap.menu,
            callback: function () {
                if (!$scope.mostrarModal) {
                    $state.go('inicio');
                }
            }
        });

        // Enter: abrir modal o confirmar selección
        hotkeysBound.add({
            combo: keymap.enter,
            callback: function () {
                if ($scope.mostrarModal) {
                    $scope.confirmarModal();
                } else {
                    $scope.abrirModalConfirmacion();
                }
            }
        });

        // Flechas para moverse en el modal
        hotkeysBound.add({
            combo: keymap.arriba,
            callback: function () {
                if ($scope.mostrarModal) {
                    $scope.cambiarSeleccion('up');
                }
            }
        });

        hotkeysBound.add({
            combo: keymap.abajo,
            callback: function () {
                if ($scope.mostrarModal) {
                    $scope.cambiarSeleccion('down');
                }
            }
        });

    });
