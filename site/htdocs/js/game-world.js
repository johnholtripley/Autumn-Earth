// config:
var framesPerSecond = 24;
var tileWidth = 40;
var heroSprite    = new Image();
var key     = [0,0,0,0,0];
var hero  = {
    x: 100,
    y: 100,
    speed: 4
};
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

var Input = {



init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e.keyCode, 1) });
        document.addEventListener('keyup',    function(e) { Input.changeKey(e.keyCode, 0) });

      
    },

    // called on key up and key down events
    changeKey: function(which, to) {
        switch (which){
            case 37: key[0]=to; break; // left
            case 38: key[2]=to; break; // up
            case 39: key[1]=to; break; // right
            case 40: key[3]=to; break;// down
            case 32: key[4]=to; break; // attack (space bar)
            case 91: key[5]=to; break; // use item (cmd)
            case 88: key[6]=to; break; // start (x)
            case 90: key[7]=to; break; // select (z)
        }
    }

  

}





function init() {
    gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        canvasWidth = gameCanvas.width;
        canvasHeight = gameCanvas.height;
    }


heroSprite.src = '/images/game-world/core/TEMP-link.png';

 Input.init();

    gameMode = "play";
    gameLoop();
}



function gameLoop() {
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
        switch (gameMode) {
            case "loading":
            console.log("loading...");
            //
            break;
            case "play":
                update();
                draw();
                break;
        }
    }, (1000 / framesPerSecond));
}

function update() {
if (key[2]) // up
    hero.y -= 4;
if( key[3]) // down
    hero.y += 4;
if( key[0]) // left
    hero.x -= 4;
if( key[1]) // right
    hero.x += 4;
}

function draw() {
	  gameContext.clearRect(0, 0, 256, 224);

    gameContext.drawImage(heroSprite, hero.x, hero.y);
}








// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {


    init();
   

} else {
    // sorry message / fallback?
}
