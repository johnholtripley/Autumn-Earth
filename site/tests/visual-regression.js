/*
    Require and initialise PhantomCSS module
    Paths are relative to CasperJs directory
*/


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
    /*
        The test scenario
    */
    casper.start('http://ae.dev/');

    casper.viewport(1024, 768);

    casper.then(function() {
        phantomcss.screenshot('#wrapper', 'desktop 1024');
    });

    casper.then(function now_check_the_screenshots() {
        // compare screenshots
        phantomcss.compareAll();
    });

    /*
    Casper runs tests
    */
    casper.run(function() {
        console.log('\nTHE END.');
        // phantomcss.getExitStatus() // pass or fail?
        casper.test.done();
    });
});
