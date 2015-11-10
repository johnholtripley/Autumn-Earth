var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    csslint = require('gulp-csslint'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    download = require('gulp-download'),
    uncss = require('gulp-uncss'),
    xml2js = require('gulp-xml2js'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean');

// css:
gulp.task('sass', function() {
    return gulp.src('htdocs/css/src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        //   .pipe(sourcemaps.write({
        //      includeContent: false,
        //      sourceRoot: 'htdocs/css/src/**/*.css'
        //  }))
        .pipe(gulp.dest('htdocs/css'));
});

// js:
gulp.task('scripts', ['alternateScripts'],function() {
    // make sure that init is compiled last after all modules are loaded:
    return gulp.src(['htdocs/js/src/**/!(init)*.js', 'htdocs/js/src/init.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('core.js'))
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: 'htdocs/js/src/**/*.js'
        }))
        .pipe(gulp.dest('htdocs/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/js'));
});

gulp.task('alternateScripts', function() {
    // make sure that init is compiled last after all modules are loaded:
    return gulp.src(['htdocs/serviceWorker.js'])
       
        .pipe(gulp.dest('htdocs/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/'));
});

// lints:
gulp.task('jshint', function() {
    return gulp.src(['htdocs/js/src/**/!(init)*.js', 'htdocs/js/src/init.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('csslint', function() {
    gulp.src('htdocs/css/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});


// download the sitemap locally:
gulp.task('getSitemap', function(callback) {
    return download('http://ae.dev/sitemap.xml')
        .pipe(gulp.dest("htdocs/gulp-processing/"));
});

// convert the xml to json:
gulp.task('createSitemap', ['getSitemap'], function() {
    return gulp.src('htdocs/gulp-processing/sitemap.xml')
        .pipe(xml2js())
        .pipe(rename('rss.json'))
        .pipe(gulp.dest("htdocs/gulp-processing/"));
});

// add any pages here that have unique styling and that aren't in in the sitemap:
filesToUncss = [];
gulp.task('removeUnusedCSS', ['createSitemap'], function() {
    var json = require('./htdocs/gulp-processing/rss.json');
    json.urlset.url.forEach(function(value) {
        link = value.loc[0];

        link = link.replace('http://www.autumnearth.com/', 'http://ae.dev/');
        gutil.log(link);
        filesToUncss.push(link);
    })
    return gulp.src('htdocs/css/base.css')
        .pipe(uncss({
            html: filesToUncss,
            ignore: [
                '/\@supports/',
                '/\.offCanvas/',
                '/\.js/',
                '/\.fontsLoaded/'
            ]
        }))
    .pipe(minify({
            compatibility: 'ie7',
            processImport: false
        }))
        .pipe(rename('base.css'))
        .pipe(gulp.dest('htdocs/css/'));
});


gulp.task('removeUnusedIE8CSS', ['removeUnusedCSS'], function() {

    return gulp.src('htdocs/css/IE8Support.css')
        .pipe(uncss({
            html: filesToUncss,
            ignore: [
                '/\@supports/',
                '/\.offCanvas/',
                '/\.js/',
                '/\.fontsLoaded/'
            ]
        }))
    .pipe(minify({
            compatibility: 'ie7',
            processImport: false
        }))
        .pipe(rename('IE8Support.css'))
        .pipe(gulp.dest('htdocs/css/'));
});

gulp.task('removeUnused', ['removeUnusedIE8CSS'], function() {
    // tidy up and remove working files
    return gulp.src('htdocs/gulp-processing/', {
            read: false
        })
        .pipe(clean());
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

// pre-go live task
// run getSitemap first
gulp.task('deploy', function() {
    gulp.start('removeUnused');
});