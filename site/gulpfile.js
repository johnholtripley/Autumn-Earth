
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps  = require('gulp-sourcemaps'),
    csslint = require('gulp-csslint'),
    concat = require('gulp-concat'),
    combine = require('gulp-combine-media-queries'),
    minify = require('gulp-minify-css');
    
// css:
gulp.task('sass', function() {
    return gulp.src('htdocs/css/src/**/*.scss')
        .pipe(sass())
        .pipe(combine())
        .pipe(minify({compatibility: 'ie7'}))
        .pipe(gulp.dest('htdocs/css'));
});

// js:
gulp.task('scripts', function() {
    // make sure that init is compiled last after all modules are loaded:
  return gulp.src(['htdocs/js/src/**/!(init)*.js','htdocs/js/src/init.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('core.js'))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: 'htdocs/js/src/**/*.js'}))
    .pipe(gulp.dest('htdocs/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('htdocs/js'));
});

// lints:
gulp.task('jshint', function() {
  return gulp.src(['htdocs/js/src/**/!(init)*.js','htdocs/js/src/init.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('csslint', function() {
  gulp.src('htdocs/css/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter());
});






// Watch
gulp.task('watch', function() {
  gulp.watch('htdocs/css/src/**/*.scss', ['sass']);
  gulp.watch('htdocs/js/src/**/*.js', ['scripts']);
});


// testing task
gulp.task('test', function() {
    gulp.start('scripts', 'jshint', 'sass', 'csslint');
});

// Default task
gulp.task('default', function() {
    gulp.start('sass', 'scripts', 'watch');
});

