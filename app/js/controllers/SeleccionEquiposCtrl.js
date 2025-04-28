/**
 * Controlador de la pantalla “Escoge equipos”
 * Archivo: app/js/controllers/SeleccionEquiposCtrl.js
 */
(function () {
    'use strict';
  
    /* -----------------------------------------------------------
     *  Declaración del controlador con nombre (necesario para
     *  poder referirnos a él dentro del propio archivo).
     * --------------------------------------------------------- */
    function SeleccionEquposCtrl($scope, $state, config, audio) {
      /* ── Sonido: crea UNA sola instancia y reutilízala ── */
      const sonidoSeleccion =
        SeleccionEquposCtrl.snd ||
        (SeleccionEquposCtrl.snd = new audio('s_jugador.ogg', true));
      sonidoSeleccion.play();
  
      /* API expuesta a la plantilla ----------------------- */
      $scope.callback = {
        configurar(opcion) {
          config.setMaxPorEquipo(opcion);           // guarda 1-3 jugadores por equipo
          $state.go('jugar.chico.seleccionBlanqueada');
        },
      };
  
      $scope.config = config;                       // para bindings en la vista
    }
  
    /* Registro en el módulo principal -------------------- */
    angular
      .module('Frosch')
      .controller('SeleccionEquposCtrl', SeleccionEquposCtrl);
  })();
  