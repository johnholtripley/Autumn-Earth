// -----------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Moller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
// -----------------------------------------------------------





// config ----------------------------------------------------

framesPerSecond = 24;



// -----------------------------------------------------------





function initCardGame() {
    if ((cutsTheMustard) && (supportsCanvas())) {


var gameCanvas = document.getElementById("cardGame");
if(gameCanvas.getContext) {
var gameContext = gameCanvas.getContext('2d');
gameContext.fillStyle = "rgb(255,255,128)";
gameContext.fillRect(40,140,150,50);

}

      //  $(window).load(function() {
            // start the animations:
            gameLoop();
      //  });




    
}
}

function gameLoop() {
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
        // loop code here ####




    }, (1000 / framesPerSecond));
}



// -----------------------------------------------------------

initCardGame();
