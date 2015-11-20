var phantomcss = require('../node_modules/phantomcss');

casper.test.begin('AE visual tests', function(test) {

    phantomcss.init({
        rebase: casper.cli.get("rebase"),
        // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
        casper: casper,
        libraryRoot: './node_modules/phantomcss',
        screenshotRoot: './tests/screenshots',
        failedComparisonsRoot: './tests/failures',
        addLabelToFailedImage: false
    });

    casper.on('remote.message', function(msg) {
        this.echo(msg);
    })

    casper.on('error', function(err) {
        this.die("PhantomJS has errored: " + err);
    });

    casper.on('resource.error', function(err) {
        casper.log('Resource load error: ' + err, 'warning');
    });

    // start tests:

    casper.start('http://ae.dev/');

    casper.viewport(1920, 1200);
    casper.then(function() {
        phantomcss.screenshot('html', 'desktop 1920');
    });

    casper.then(function() {
        casper.viewport(768, 1024);
    });
    casper.then(function() {
        phantomcss.screenshot('html', 'tablet 768');
    });

    casper.then(function() {
        casper.viewport(320, 468);
    });
    casper.then(function() {
        phantomcss.screenshot('html', 'mobile 320');
    });




    casper.then( function () {
        casper.click( '#menuToggle' );


 this.wait(500, function() {
       phantomcss.screenshot( 'html', 'mobile 320 - nav open' );
    });

       
    } );





    casper.then(function now_check_the_screenshots() {
        // compare screenshots
        phantomcss.compareAll();
    });

    casper.run(function() {
        phantomcss.getExitStatus();
        casper.test.done();
    });
});
