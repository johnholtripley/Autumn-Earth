// config:
var animationFramesPerSecond = 16;
var lastTime = 0;

var elapsed = 0;
var tileWidth = 40;
var key = [0, 0, 0, 0, 0];

var hero = {
    x: 100,
    y: 100,
    width: 17,
    height: 25,
    speed: 2,
    sequenceIdx: 0,
    timeSinceLastFrameSwap: 0,
    animationUpdateTime: (1000 / animationFramesPerSecond),
    isMoving: false,
    facing: 'down',
    sequences: {
        'stand-down': [3],
        'stand-up': [10],
        'stand-right': [17],
        'stand-left': [24],
        'walk-down': [3, 4, 5, 6, 5, 4, 3, 2, 1, 0, 1, 2],
        'walk-up': [10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 8, 9],
        'walk-right': [17, 18, 19, 20, 19, 18, 17, 16, 15, 14, 15, 16],
        'walk-left': [24, 25, 26, 27, 26, 25, 24, 23, 22, 21, 22, 23]
    }

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
        document.addEventListener('keyup', function(e) { Input.changeKey(e.keyCode, 0) });
    },

    // called on key up and key down events
    changeKey: function(which, to) {
        switch (which) {
            case 37:
                // left
                key[0] = to;
                break;
            case 38:
                // up
                key[2] = to;
                break;
            case 39:
                // right
                key[1] = to;
                break;
            case 40:
                // down
                key[3] = to;
                break;
            case 32:
                // space bar
                key[4] = to;
                break;
        }
    }
}

// service worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/game-world/serviceWorker.min.js', {
    scope: '/game-world/'
  });
}


function init() {
    gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        canvasWidth = gameCanvas.width;
        canvasHeight = gameCanvas.height;
    }

    lastAnimationUpdateTime = window.performance.now();
    gameMode = "loading";
    // show loading screen while getting assets:
    gameLoop();
    // get assets:
    hero.img = new Image();
    hero.img.src = '/images/game-world/core/TEMP-link.png';
    // detect and set up input methods:
    Input.init();
    gameMode = "play";

}



function gameLoop() {
    switch (gameMode) {
        case "loading":
            //
            break;
        case "paused":
            //
            break;
        case "play":
            update();
            draw();
            break;
    }
    window.requestAnimationFrame(gameLoop);
}

function update() {
    var now = window.performance.now();
    var elapsed = (now - lastTime);
    lastTime = now;
    hero.moving = false;
    // Handle the Input
    if (key[2]) {
        hero.moving = true;
        hero.facing = 'up';
        hero.y -= hero.speed;
    }
    if (key[3]) {
        hero.moving = true;
        hero.facing = 'down';
        hero.y += hero.speed;
    }
    if (key[0]) {
        hero.moving = true;
        hero.facing = 'left';
        hero.x -= hero.speed;
    }
    if (key[1]) {
        hero.moving = true;
        hero.facing = 'right';
        hero.x += hero.speed;
    }

    hero.timeSinceLastFrameSwap += elapsed;
    if (hero.timeSinceLastFrameSwap > hero.animationUpdateTime) {
        var seq = (hero.moving ? 'walk-' : 'stand-') + hero.facing;
        var currentSequence = hero.sequences[seq];
        if (hero.sequenceIdx < currentSequence.length - 1) {
            hero.sequenceIdx += 1;
        } else {
            hero.sequenceIdx = 0;
        }
        var col = currentSequence[hero.sequenceIdx] % 7;
        var row = Math.floor(currentSequence[hero.sequenceIdx] / 7);
        hero.offsetX = col * hero.width;
        hero.offsetY = row * hero.height;
        hero.timeSinceLastFrameSwap = 0;
    }
}

function draw() {
    gameContext.clearRect(0, 0, 256, 224);
    gameContext.drawImage(hero.img, hero.offsetX, hero.offsetY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);
}

// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback?
}
