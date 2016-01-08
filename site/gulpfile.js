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
    clean = require('gulp-clean'),
    favicons = require('gulp-favicons'),
    run = require('gulp-run'),
    fs = require("fs"),
    access = require('gulp-accessibility'),
    psi = require('psi');


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
    return gulp.src(['htdocs/js/src/**/!(init)*.js', 'htdocs/js/src/**/!(card-game)*.js', 'htdocs/js/src/init.js'])
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
    // minify predefined list of unique scripts:
    return gulp.src(['htdocs/**/*(serviceWorker.js|card-game.js)'])
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




// tests
gulp.task('regressionTest', function () {
  run('casperjs test tests/visual-regression.js').exec()
})



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

        link = link.replace('https://www.autumnearth.com/', 'http://ae.dev/');
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

gulp.task('removeUnused', ['accessibility'], function() {
    // tidy up and remove working files
    return gulp.src('htdocs/gulp-processing/', {
            read: false
        })
        .pipe(clean());
});


// accessibility checker:
gulp.task('accessibilityRemoveOld', ['removeUnusedIE8CSS'], function() {
    // tidy up and remove working files
    return gulp.src('./reports/*', {
            read: false
        })
        .pipe(clean());
});


gulp.task('accessibility', ['accessibilityRemoveOld'], function() {
return access({
    urls: filesToUncss,
    force: true,
    accessibilityLevel: 'WCAG2A',
            reportType: 'txt',
            verbose: false,
            reportLocation: './reports',
            reportLevels: {
                notice: false,
                warning: true,
                error: true
            }
  });



});


// ----------------------------------
// create favicons:
gulp.task('favicons', function() {
    gulp.src('./htdocs/images/favicon-source.png').pipe(favicons({
        appName: "Autumn Earth", // Your application's name. 'string'
        appDescription: "Community site", // Your application's description. 'string'
        developerName: null, // Your (or your developer's) name. 'string'
        developerURL: null, // Your (or your developer's) URL. 'string'
        background: "#212121", // Background colour for flattened icons. 'string'
        path: "https://www.autumnearth.com/images/icons/", // Path for overriding default icons path. 'string'
        url: "https://www.autumnearth.com/", // Absolute URL for OpenGraph image. 'string'
        display: "browser", // Android display: "browser" or "standalone". 'string'
        orientation: "portrait", // Android orientation: "portrait" or "landscape". 'string'
        version: "1.0", // Your application's version number. 'number'
        logging: true, // Print logs to console? 'boolean'
        online: true, // Use RealFaviconGenerator to create favicons? 'boolean'
        icons: {
            android: true, // Create Android homescreen icon. 'boolean'
            appleIcon: true, // Create Apple touch icons. 'boolean'
            appleStartup: true, // Create Apple startup images. 'boolean'
            coast: true, // Create Opera Coast icon. 'boolean'
            favicons: true, // Create regular favicons. 'boolean'
            firefox: true, // Create Firefox OS icons. 'boolean'
            opengraph: true, // Create Facebook OpenGraph image. 'boolean'
            twitter: false, // Create Twitter Summary Card image. 'boolean'
            windows: true, // Create Windows 8 tile icons. 'boolean'
            yandex: true // Create Yandex browser icon. 'boolean'
        },
        html: "./htdocs/includes/favicons.html"         // HTML files to modify. 'string' or 'array' 
    })).pipe(gulp.dest('./htdocs/images/icons/'))
});
// ----------------------------------



// read cache version number and increment it:
gulp.task('cacheBusting', function() {
    fs.readFile('htdocs/includes/siteVersion.txt', 'utf8', function(err, data) {
        if (err) throw err;
        var oldVersionNumber = parseInt(data);
        newVersionNumber = oldVersionNumber + 1;
        fs.writeFile('htdocs/includes/siteVersion.txt', newVersionNumber, function(err) {
            if (err) throw err;
            console.log('cache version updated to ' + newVersionNumber);
        });
    });
    fs.readFile('htdocs/serviceWorker.js', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/v::\d+::/, function(fullMatch, n) {
            return "v::" + newVersionNumber + "::";
        });
        fs.writeFile('htdocs/serviceWorker.js', result, 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
    // same again for the minified version:
    fs.readFile('htdocs/serviceWorker.min.js', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/v::\d+::/, function(fullMatch, n) {
            return "v::" + newVersionNumber + "::";
        });
        fs.writeFile('htdocs/serviceWorker.min.js', result, 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
});



gulp.task('pageSpeed', function() {
    APIkey = 'AIzaSyBnze17k0mkUPk9xzWfJ987BSjQfocetSA';
    psi('http://www.autumnearth.com', {
        key: APIkey,
        strategy: 'mobile'
    }).then(function(data) {
        console.log('Mobile speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Mobile usability score: ' + data.ruleGroups.USABILITY.score);
    });
    psi('http://www.autumnearth.com', {
        key: APIkey,
        strategy: 'desktop'
    }).then(function(data) {
        console.log('Desktop speed score: ' + data.ruleGroups.SPEED.score);
    });
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
// then visual regression tests
gulp.task('deploy', ['removeUnused','favicons','cacheBusting','pageSpeed'], function() {
    gulp.start('regressionTest');
});



