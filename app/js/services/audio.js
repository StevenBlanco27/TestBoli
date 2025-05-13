angular.module('Frosch')
    .factory('audio', function ($filter) {

        var audioClass = function (audio, translate) {
            this.audio = new Audio();
            this.audio.src = translate ? $filter('translateAudio')(audio) : 'assets/sounds/' + audio;
            this.audio.preload = 'auto';
        };

        audioClass.prototype.doPlay = function () {
            try {
                this.audio.load(); // Solo load() y play() (sin pause)
                var playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => console.warn('Audio play() fallo:', error));
                }
            } catch (e) {
                console.error('Error en doPlay:', e);
            }
        };

        audioClass.prototype.play = function () {
            var me = this;
            try {
                if (typeof me.audio._ctx === 'object' && me.audio._ctx.state === 'suspended') {
                    me.audio._ctx.resume().then(() => me.doPlay());
                } else {
                    me.doPlay();
                }
            } catch (e) {
                console.error('Error en play:', e);
            }
        };

        audioClass.prototype.stop = function () {
            try {
                this.audio.pause();
                this.audio.currentTime = 0;
            } catch (e) {
                console.error('Error en stop:', e);
            }
        };

        return audioClass;
    });
