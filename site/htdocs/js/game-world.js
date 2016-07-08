// frame rate:
var animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;

var characterId = 'chr-html5';
var currentMap = 1;
var thisMapData = '';

var tileGraphics = [];
    var tileH = 24;
    var tileW = 48;

// dimensions:
var width   = 256;
var ROOM_HEIGHT = 176;
//var NUM_TILES_WIDE = width / TILE_WIDTH;
var NUM_TILES_WIDE = 1;
//var NUM_TILES_HIGH = ROOM_HEIGHT / TILE_WIDTH; 
var NUM_TILES_HIGH = 1; 




// key bindings
var key = [0, 0, 0, 0, 0];

var hero = {
    x: 100,
    y: 100,
    tileX: 1,
    tileY: 0,
    width: 17,
    height: 25,
    feetOffsetX: 8,
    feetOffsetY: 21,
    speed: 2,
    animationFrameIndex: 0,
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













// https://mathiasbynens.be/notes/xhr-responsetype-json

var getJSON = function(url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            if (status == 200) {
                data = JSON.parse(xhr.responseText);
                successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};
var Input = {
    init: function() {
        // Set up the keyboard events
        document.addEventListener('keydown', function(e) { Input.changeKey(e.keyCode, 1) });
        document.addEventListener('keyup', function(e) { Input.changeKey(e.keyCode, 0) });
    },

    // called on key up and key down events
    changeKey: function(which, to) {
        switch (which) {
            case KeyBindings.left:
                key[0] = to;
                break;
            case KeyBindings.up:
                key[2] = to;
                break;
            case KeyBindings.right:
                key[1] = to;
                break;
            case KeyBindings.down:
                key[3] = to;
                break;
            case KeyBindings.action:
                key[4] = to;
                break;
        }
    }
}

var KeyBindings = {
    'left': 37,
    'right': 39,
    'up': 38,
    'down': 40,
    'action': 32,
    'pause': 80
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
        //canvasWidth = gameCanvas.width;
        //canvasHeight = gameCanvas.height;
    }
    getJSON('/data/' + characterId + '/map' + currentMap + '.json', function(data) {
        thisMapData = data.map;
        loadAssets();
    }, function(status) {
        alert('Error loading map data');
    });
    gameMode = "loading";
    // show loading screen while getting assets:
    gameLoop();
}


function getTileCentreCoordX(tileX,tileY) {
    return tileW/2*(thisMapData.terrain.length-tileY+tileX);
}

function getTileCentreCoordY(tileX,tileY) {
    return tileH/2*(1+tileY+tileX);
}

function loadAssets() {
    hero.img = new Image();
    hero.img.src = '/images/game-world/core/TEMP-link.png';
    backgroundImg = new Image();
    backgroundImg.src = '/images/game-world/maps/1/bg.png';
    tileGraphicsLoaded = 0;
    tileGraphicsToLoad = thisMapData.graphics;
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileGraphics[i] = new Image();
        tileGraphics[i].src = "/images/game-world/maps/" + currentMap + "/" + tileGraphicsToLoad[i].src;
        tileGraphics[i].onload = function() {
            // Once the image is loaded increment the loaded graphics count and check if all images are ready.
            tileGraphicsLoaded++;
            if (tileGraphicsLoaded === tileGraphicsToLoad.length) {
                // detect and set up input methods:
                Input.init();


// determine hero's start position:
                  hero.x = getTileCentreCoordX(hero.tileX,hero.tileY)  - hero.feetOffsetX;
            hero.y =  getTileCentreCoordY(hero.tileX,hero.tileY) - hero.feetOffsetY;


                gameMode = "play";
            }
        }
    }
}


function checkCollisions() {
    var collisionArray = thisMapData.collisions;
    // due to his sprite _apparently_ being 17px wide, this causes problems with entrances which are two tiles, or 16px wide.
    // So let’s ignore a whole pixel when calculating tile-based collisions.
    var collisionWidth = hero.width - 2;
    // tile collisions
    if (key[2]) { // up
        var topLeftCol = Math.floor(hero.x / 8);
        var topRightCol = Math.floor((hero.x + collisionWidth) / 8);
        var row = Math.floor((hero.y + 9) / 8); // same for topleft and topright
        var tlCell = (row * NUM_TILES_WIDE) + topLeftCol;
        var trCell = (row * NUM_TILES_WIDE) + topRightCol;
        // now get the cells for each corner and check 'em!
        if (collisionArray[tlCell] == 1 || collisionArray[trCell] == 1) {
            hero.y = (row * 8);
        }
    }
    if (key[3]) { // down
        var bottomLeftCol = Math.floor(hero.x / 8);
        var bottomRightCol = Math.floor((hero.x + hero.width - 1) / 8);
        var row = Math.floor((hero.y + hero.height) / 8);
        var blCell = (row * NUM_TILES_WIDE) + bottomLeftCol;
        var brCell = (row * NUM_TILES_WIDE) + bottomRightCol;
        if (collisionArray[blCell] == 1 || collisionArray[brCell] == 1) {
            hero.y = (row * 8) - hero.height;
        }
    }
    if (key[0]) { // left
        var col = Math.floor(hero.x / 8);
        var topLeftRow = Math.floor((hero.y + 9) / 8);
        var bottomLeftRow = Math.floor((hero.y + hero.height - 1) / 8);
        var tlCell = (topLeftRow * NUM_TILES_WIDE) + col;
        var blCell = (bottomLeftRow * NUM_TILES_WIDE) + col;
        if (collisionArray[tlCell] == 1 || collisionArray[blCell] == 1) {
            hero.x = (col * 8) + 8;
        }
    }
    if (key[1]) { //right
        var col = Math.floor((hero.x + hero.width) / 8);
        var topRightRow = Math.floor((hero.y + 9) / 8);
        var bottomRightRow = Math.floor((hero.y + hero.height - 1) / 8);
        var trCell = (topRightRow * NUM_TILES_WIDE) + col;
        var brCell = (bottomRightRow * NUM_TILES_WIDE) + col;
        if (collisionArray[trCell] == 1 || collisionArray[brCell] == 1) {
            hero.x = (col * 8) - hero.width;
        }
    }

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
    hero.isMoving = false;
    // Handle the Input
    if (key[2]) {
        hero.isMoving = true;
        hero.facing = 'up';
        hero.y -= hero.speed;
    }
    if (key[3]) {
        hero.isMoving = true;
        hero.facing = 'down';
        hero.y += hero.speed;
    }
    if (key[0]) {
        hero.isMoving = true;
        hero.facing = 'left';
        hero.x -= hero.speed;
    }
    if (key[1]) {
        hero.isMoving = true;
        hero.facing = 'right';
        hero.x += hero.speed;
    }

    checkCollisions();

    hero.timeSinceLastFrameSwap += elapsed;
    if (hero.timeSinceLastFrameSwap > hero.animationUpdateTime) {
        var seq = (hero.isMoving ? 'walk-' : 'stand-') + hero.facing;
        var currentSequence = hero.sequences[seq];
        if (hero.animationFrameIndex < currentSequence.length - 1) {
            hero.animationFrameIndex += 1;
        } else {
            hero.animationFrameIndex = 0;
        }
        var col = currentSequence[hero.animationFrameIndex] % 7;
        var row = Math.floor(currentSequence[hero.animationFrameIndex] / 7);
        hero.offsetX = col * hero.width;
        hero.offsetY = row * hero.height;
        hero.timeSinceLastFrameSwap = 0;
    }
}

function draw() {
    drawBackground();
    gameContext.drawImage(hero.img, hero.offsetX, hero.offsetY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);
}

function drawBackground() {
    // gameContext.clearRect(0, 0, 256, 224);
    gameContext.drawImage(backgroundImg, 0, 0);
    var map = thisMapData.terrain;
    var thisGraphicCentreX, thisGraphicCentreY;
    var mapX = 0;
    var mapY = tileH / 2;
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            //thisX = ((map.length)-i)*tileW/2 + j*tileW/2;
            thisX = (map.length - i + j) * tileW / 2;
            thisY = (i + j) * tileH / 2;
            thisGraphicCentreX = thisMapData.graphics[(map[i][j])].centreX;
            thisGraphicCentreY = thisMapData.graphics[(map[i][j])].centreY;
            gameContext.drawImage(tileGraphics[(map[i][j])], thisX + mapX - thisGraphicCentreX, thisY + mapY - thisGraphicCentreY);
        }
    }
}




// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback?
}
