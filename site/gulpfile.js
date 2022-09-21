'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');

// https://raw.githubusercontent.com/johnholtripley/Autumn-Earth/5b16b74da98b6310cf22b2126503d2f1ca187506/site/gulpfile%20-%20Copy.js

// css:
function scss() {
  return gulp
    .src(['htdocs/css/src/**/*.scss', '!htdocs/css/src/game-world/game-world.scss'])
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('htdocs/css'))
    .pipe(cleancss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('htdocs/css'))
}

function gameWorldCss() {
  return gulp
    .src('htdocs/css/src/game-world/game-world.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('htdocs/css'))
    .pipe(cleancss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('htdocs/css'))
}

// js:
function siteScripts() {
    // make sure that init is compiled last after all modules are loaded:
  return gulp
      .src(['htdocs/js/src/**/!(init)*.js', 'htdocs/js/src/**/!(card-game)*.js', '!htdocs/js/src/game-world/**/*.js', 'htdocs/js/src/init.js'])
      .pipe(concat('core.js'))
      .pipe(gulp.dest('htdocs/js'))
           .pipe(minify({ext:{
           
            min:'.min.js'
        }
        }))
      .pipe(gulp.dest('htdocs/js'));
}

function alternateScripts() {
    // minify predefined list of unique scripts:
  return gulp
      .src(['htdocs/**/*(serviceWorker.js|card-game.js|card-game-shared.js|worker-pathfinding.js|worker-lightmap.js|hnefatafl.js|hnefatafl-shared.js|worker-hnefatafl.js)'])
        .pipe(minify({ext:{
           
            min:'.min.js'
        }
        }))
      .pipe(gulp.dest('htdocs/'));
}

function workerScripts() {
    // minify predefined list of unique scripts:
  return gulp
      .src(['htdocs/js/src/game-world/shared-worker-functions.js','htdocs/js/src/game-world/shared-hnefatafl-worker-functions.js'])
       .pipe(minify({ext:{
           
            min:'.min.js'
        }
        }))
      .pipe(gulp.dest('htdocs/'));
}

function gameScripts() {
    // make sure that core is compiled last after all modules are loaded, and strict is first:
  return gulp
      .src(['htdocs/js/src/game-world/_strict.js','htdocs/js/src/game-world/**/!(core|_strict)*.js', 'htdocs/js/src/game-world/core.js'])
      .pipe(concat('game-world.js'))
      .pipe(gulp.dest('htdocs/js'))

        .pipe(minify({ext:{
           
            min:'.min.js'
        }
        }))
      .pipe(gulp.dest('htdocs/js'));
}

// Watch files
function watchFiles() {
    gulp.watch('htdocs/css/src/**/*', css);
    gulp.watch('htdocs/js/src/**/*', js);
}

// define tasks:
const css = gulp.series(gameWorldCss, scss);
const js = gulp.parallel(siteScripts, alternateScripts, workerScripts, gameScripts);
const build = gulp.series(css, js);
const watch = gulp.parallel(watchFiles);
const buildAndWatch = gulp.series(build, watch);

// export tasks
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = buildAndWatch;