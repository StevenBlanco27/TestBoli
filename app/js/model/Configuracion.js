/**
 * Created by ivan on 10/5/14.
 */
angular.module('Frosch')
    .factory('ConfiguracionService', function ($http, $translate) {

        var clase = function () {
            var me = this;
            this.puntos = 800;
            this.numJugadores = 8;
            this.blanqueada = -10;

            var httpPromise = $http.get('config/config.json');
            return httpPromise.then(function (httpResponse) {
                me.configuracion = httpResponse.data;
                return $translate.use(me.configuracion.idioma).then(function(){
                    return me;
                }); //el cambio de idioma es promise

            });
        };


        clase.prototype.creditosPorJugador = function () {
            return this.configuracion.creditosPorPuntaje[this.puntos] ;
        };

        clase.prototype.setNumJugadores = function (numJugadores) {
            if (numJugadores !== Math.round(numJugadores))
                throw new Error("El número de jugadores debe ser exacto");

            this.numJugadores = numJugadores;
        };

        return new clase();
    });