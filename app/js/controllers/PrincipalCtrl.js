/**
 * Servicio “audio” con Web Audio API y caché en memoria.
 * Mantiene el mismo nombre que la factoría antigua para que
 * los controladores no requieran cambios.
 */

angular.module('Frosch')
  .service('audio', function ($q, $filter) {

    // Contexto de audio único para toda la aplicación
    const ctx   = new (window.AudioContext || window.webkitAudioContext)();
    // Caché: URL → AudioBuffer ya decodificado
    const cache = {};

    /** Descarga y decodifica sólo la primera vez. */
    function loadBuffer(nombre, traducir) {
      const url = traducir
        ? $filter('translateAudio')(nombre).replace('.ogg', '.opus') // usa .opus si convertiste
        : `assets/sounds/${nombre.replace('.ogg', '.opus')}`;

      // ¿Ya está en memoria?
      if (cache[url]) {
        return $q.when(cache[url]);
      }

      // Fetch + decode una sola vez
      return fetch(url)
        .then(r => r.arrayBuffer())
        .then(buf => ctx.decodeAudioData(buf))
        .then(decoded => (cache[url] = decoded));
    }

    /**
     * Constructor compatible con el antiguo:
     *    var snd = new audio('lanzamiento.ogg', false);
     *    snd.play();   snd.stop();
     */
    function AudioWrapper(nombre, traducir = true) {
      this.nombre   = nombre;
      this.traducir = traducir;
      this._source  = null;   // BufferSource activo
    }

    /** Reproduce el clip (crea nuevo BufferSource cada vez). */
    AudioWrapper.prototype.play = function () {
      const self = this;
      return loadBuffer(self.nombre, self.traducir).then(buffer => {
        self.stop();                       // evita solapar
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(ctx.destination);
        src.start(0);
        self._source = src;
      });
    };

    /** Detiene la reproducción inmediatamente. */
    AudioWrapper.prototype.stop = function () {
      if (this._source) {
        try { this._source.stop(); } finally { this._source = null; }
      }
    };

    // El servicio devuelve el constructor como antes hacía la factoría
    return AudioWrapper;
  });
