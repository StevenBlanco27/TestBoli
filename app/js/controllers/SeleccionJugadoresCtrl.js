// -----------------------------------------------------------------------------
// SeleccionJugadoresCtrl.js  (versión final optimizada)
// -----------------------------------------------------------------------------
angular.module('Frosch')
  .controller('SeleccionJugadoresCtrl', function ($scope, $rootScope, $state, config, hotkeys, audio) {

    $scope.config = config;

    /* ─── Variables cacheadas ─── */
    $scope._numJugadores     = 0;
    $scope._creditosExactos  = false;   // botón «Iniciar» visible
    $scope._creditosFaltantes = 0;      // texto que indica cuántos faltan

    /** Recalcula métricas cuando cambian los créditos */
    $scope.recalcularCreditos = function () {
      $scope._numJugadores = Math.min($scope.creditos / config.creditosPorJugador(), 6);

      $scope._creditosExactos = $scope.creditos &&
        Math.round($scope._numJugadores) === $scope._numJugadores &&
        $scope._numJugadores >= 1;

      $scope._creditosFaltantes = ($scope._numJugadores === 6)
        ? false
        : config.creditosPorJugador() - ($scope.creditos % config.creditosPorJugador());
    };

    /* ─── Getters ligeros ─── */
    $scope.numJugadores      = () => $scope._numJugadores;
    $scope.creditosExactos   = () => $scope._creditosExactos;
    $scope.creditosFaltantes = () => $scope._creditosFaltantes;
    $scope.creditosJugador   = n => Math.max($scope.numJugadores() - (n - 1), 0);

    /* Iniciar juego */
    $scope.iniciar = function () {
      if ($scope.creditosExactos()) {
        config.setNumJugadores($scope.numJugadores());
        $rootScope.restarCreditos($scope.numJugadores() * config.creditosPorJugador());
        $state.go('jugar.chico.principal');
      }
    };

    /* Selecciona sonido correcto */
    $scope.sonido = function () {
      return 'moneda.ogg';
    };

    /* Instancia del audio para reproducir */
    const monedaAudio = new audio('moneda.ogg', false);

    /* ─── Hotkeys ─── */
    const k = config.configuracion.keymap;
    hotkeys.bindTo($scope)
      .add({ combo: k.enter, callback: $scope.iniciar })
      .add({ combo: `${k.arriba} ${k.abajo} ${k.arriba} ${k.abajo} ${k.arriba} ${k.abajo} ${k.enter}`, callback: () => $state.go('inicio') })
      .add({
        combo: k.arriba,
        callback: () => {
          const maxCreditos = config.creditosPorJugador() * 6;
          if ($rootScope.creditos < maxCreditos) {
            $rootScope.creditos++;
            $rootScope.guardarCreditos();
            $scope.recalcularCreditos();
            monedaAudio.play();  // 🎵 reproducir sonido al presionar ↑
          }
        }
      })
      .add({
        combo: k.abajo,
        callback: () => {
          if ($rootScope.creditos > 0) {
            $rootScope.creditos--;
            $rootScope.guardarCreditos();
            $scope.recalcularCreditos();
            monedaAudio.play();  // 🎵 reproducir sonido al presionar ↓
          }
        }
      });

    /* Inicial */
    $scope.recalcularCreditos();

    /* ↻ Sincroniza cuando los créditos cambian desde otras hotkeys */
    $scope.$watch(() => $rootScope.creditos, () => $scope.recalcularCreditos());

  });
