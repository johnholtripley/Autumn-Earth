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
     webpagetest = require('webpagetest'),
   exec = require('child_process').exec,
    fs = require("fs"),
    access = require('gulp-accessibility'),
    psi = require('psi'),
    critical = require('critical').stream,
    php2html = require("gulp-php2html"),
     http = require('http'),
     mkdirp = require('mkdirp'),
     del = require('del'),
     blc = require("broken-link-checker"),
     postcss = require('gulp-postcss'),
 doiuse = require('doiuse');


// css:
gulp.task('sass', ['gameWorldCss'],function() {
    return gulp.src(['htdocs/css/src/**/*.scss', '!htdocs/css/src/game-world/game-world.scss'])
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

gulp.task('gameWorldCss', function() {
    return gulp.src('htdocs/css/src/game-world/game-world.scss')
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
    return gulp.src(['htdocs/js/src/**/!(init)*.js', 'htdocs/js/src/**/!(card-game)*.js', '!htdocs/js/src/game-world/**/*.js', 'htdocs/js/src/init.js'])
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

gulp.task('alternateScripts', ['gameScripts'], function() {
    // minify predefined list of unique scripts:
    return gulp.src(['htdocs/**/*(serviceWorker.js|card-game.js|card-game-shared.js|worker-pathfinding.js)'])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/'));
});

gulp.task('gameScripts',function() {
    // make sure that core is compiled last after all modules are loaded:
    return gulp.src(['htdocs/js/src/game-world/**/!(core)*.js', 'htdocs/js/src/game-world/core.js'])
        .pipe(concat('game-world.js'))
        .pipe(gulp.dest('htdocs/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('htdocs/js'));
});


// lints:
gulp.task('jshint', function() {
    return gulp.src(['htdocs/js/src/**/!(init)*.js', 'htdocs/js/src/init.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});


/*
gulp.task('csslint', function() {
    gulp.src('htdocs/css/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});
*/

gulp.task('csslint', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('htdocs/css/base.css')
    .pipe(gulpStylelint({
        reportOutputDir: 'reports/lint',
      reporters: [
        {formatter: 'verbose', save: 'report.txt'}
      ]
    }));
});




// tests
gulp.task('regressionTest', function() {
    var child = exec('casperjs test tests/visual-regression.js', function(err, stdout, stderr) {
        console.log(stdout);
    });
})






gulp.task('canIUse', function() {
    fs.stat('tests/canIUse.txt', function(err, stat) {
        if (err == null) {
            // file exists:
            fs.unlinkSync('tests/canIUse.txt');
        }
    });
    gulp.src('htdocs/css/base.css', { cwd: process.cwd() })
        .pipe(postcss([
            doiuse({
                browsers: [
                    'ie >= 9',
                    '> 1%'
                ],
                ignore: ['rem'],
                onFeatureUsage: function(usageInfo) {
                    // console.log(usageInfo.message);
                    fs.open('tests/canIUse.txt', 'a', 666, function(e, id) {
                        fs.write(id, usageInfo.featureData.title + " - " + usageInfo.message + "\n", null, 'utf8', function() {
                            fs.close(id, function() {});
                        });
                    });
                }
            })
        ]))
})











// download the sitemap locally:
gulp.task('getSitemap', function(callback) {

    mkdirp('./htdocs/gulp-processing', function(err) {
        // path was created unless there was error
    });

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
        htmlUrlChecker.enqueue(link);
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
            opengraph: false, // Create Facebook OpenGraph image. 'boolean'
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
     // same again for the game-world version:
      fs.readFile('htdocs/game-world/serviceWorker.js', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/v::\d+::/, function(fullMatch, n) {
            return "v::" + newVersionNumber + "::";
        });
        fs.writeFile('htdocs/game-world/serviceWorker.js', result, 'utf8', function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
    fs.readFile('htdocs/game-world/serviceWorker.min.js', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/v::\d+::/, function(fullMatch, n) {
            return "v::" + newVersionNumber + "::";
        });
        fs.writeFile('htdocs/game-world/serviceWorker.min.js', result, 'utf8', function(err) {
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




gulp.task('webpagetest', function() {
  var parameters, testSpecs, wpt;
  wpt = new webpagetest('www.webpagetest.org', 'A.32d53e293dd240a6a9c1e41d0f4a0d85');
  parameters = {
    disableHTTPHeaders: true,
    "private": true,
    notifyEmail: "john.holtripley@gmail.com",
    location: 'ec2-eu-west-1:Chrome'
  };
  testSpecs = {
    runs: {
      1: {
        firstView: {
          SpeedIndex: 1500
        }
      }
    },
    median: {
      firstView: {
        bytesIn: 1000000,
        visualComplete: 4000
      }
    }
  };
  return wpt.runTest("http://www.autumnearth.com", parameters, function(err, data) {
    var checkStatus, testID;
    var lastStatusMessage = "";
    testID = data.data.testId;
    checkStatus = function() {
      return wpt.getTestStatus(testID, function(err, data) {
        if(data.data.statusText != lastStatusMessage) {
            // only show updates
        console.log("Status for " + testID + ": " + data.data.statusText);
lastStatusMessage = data.data.statusText;
    }
        if (!data.data.completeTime) {
          return setTimeout(checkStatus, 5000);
        } else {
          return wpt.getTestResults(testID, {
            specs: testSpecs
          }, function(err, data) {
            console.log("http://www.webpagetest.org/result/" + testID + "/");
            if (err > 0) {
              return process.exit(1);
            }
          });
        }
      });
    };
    return checkStatus();
  });
});






// generate critical css -------------------------------------------

var FSDownload = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb); // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        console.log("error getting file");
        if (cb) cb(err.message);
    });
};

gulp.task('critical', function() {

    mkdirp('./htdocs/static', function(err) {
        // path was created unless there was error
    });

    FSDownload('http://ae.dev/index.php?useInline=false', './htdocs/static/index.html', doCritical);
});

function doCritical() {
    gulp.start('minifyCritical');
}

gulp.task('generateCritical', function() {
    return gulp.src('htdocs/static/index.html')
        .pipe(critical({
            base: 'htdocs/',
            inline: false,
            dimensions: [{
                height: 200,
                width: 500
            }, {
                height: 900,
                width: 1200
            }],
            css: ['htdocs/css/base.css'],
            dest: 'htdocs/css/critical.css',
            ignore: ['@font-face', '/url\(/'],
            minify: 'false',
        }))
        .pipe(gulp.dest('htdocs'));

});


gulp.task('minifyCritical', ['tidyUpCritical'], function() {
    return gulp.src('htdocs/css/critical.css')
        .pipe(minify({
            compatibility: 'ie7',
            processImport: false
        }))
        .pipe(gulp.dest('htdocs/css/'));
});

gulp.task('tidyUpCritical', ['generateCritical'], function() {
    del(['./htdocs/static/**']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
    del(['./htdocs/index.css']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
    // for some reason, when the 'ignore' parameter is on, then the css isn't minified, so minify it now
});



// ------------------------------------------

 var htmlUrlChecker = new blc.HtmlUrlChecker("http://www.autumnearth.com/card-game/", {
     link: function(result) {
         //    console.log(result.html.index, result.broken, result.html.text, result.url.resolved);
         if (result.broken) {
             console.log('broken link on ' + result.base.original + ' - ' + result.html.tag + ' - ' + result.html.text);
         }

     },
     //   junk: function(result){},
     //   item: function(error, htmlUrl){},
     end: function() {
         console.log("ended broken link checks");
     }
 });






// ------------------------------------------


// Watch
gulp.task('watch', function() {
    gulp.watch('htdocs/css/src/**/*.scss', ['sass']);
    gulp.watch(['htdocs/js/src/**/*.js','htdocs/js/worker-pathfinding.js','htdocs/js/card-game-shared.js'], ['scripts']);
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
gulp.task('deploy', ['critical','removeUnused','favicons','cacheBusting','pageSpeed','webpagetest','canIUse'], function() {
    gulp.start('regressionTest');
});



