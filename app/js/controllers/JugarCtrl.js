angular.module('Frosch')
    .controller('JugarCtrl',
    function ($scope, $state, config, audio, $timeout) {

        $scope.configurarAudio = new audio("configurar.ogg", false);
        $scope.configurarAudio.audio.loop = true;

        function reproducirAudioSeguro(sonido) {
            if (typeof sonido.audio._ctx === 'object' && sonido.audio._ctx.state === 'suspended') {
                sonido.audio._ctx.resume();
            }
            sonido.audio.load();
            var playPromise = sonido.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.warn('Audio play() fallo en JugarCtrl:', error));
            }
        }

        $timeout(() => { reproducirAudioSeguro($scope.configurarAudio); }, 100);

        $scope.$on('$destroy', function () {
            $scope.configurarAudio.stop();
        });
    });
