const gulp          = require('gulp');
const htmlmin       = require('gulp-htmlmin');
const templateCache = require('gulp-angular-templatecache');

gulp.task('templates', function () {
  return gulp.src('html/**/*.html')          // ← todas tus vistas
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(templateCache({
      filename : 'templates.js',
      module   : 'Frosch',        // ← tu módulo principal
      root     : 'html/'          // prefijo que usas en templateUrl
    }))
    .pipe(gulp.dest('js'));       // genera js/templates.js
});
