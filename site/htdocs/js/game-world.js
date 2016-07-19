// frame rate:
var animationFramesPerSecond = 16;
var lastTime = 0;
var elapsed = 0;

var characterId = 'chr-html5';
var currentMap = 1;
var thisMapData = '';
var mapTilesX = 0;
var mapTilesY = 0;

var tileGraphics = [];
var tileW = 48;
var tileH = tileW/2;
var tileGraphicsToLoad = 0;
var canvasWidth = 256;
var canvasHeight = 176;
var worldOffsetX = 0;
var worldOffsety = 0;

// key bindings
var key = [0, 0, 0, 0, 0];

var hero = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    tileX: 1,
    tileY: 1,
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


// find tile from coords:
function getTileX(x, y) {
    return Math.floor(x/tileW);
}

function getTileY(x, y) {
    return Math.floor(y/tileW);
}


// find Iso coords from 2d coords:
function findIsoCoordsX(x, y) {
  return x/2 + y/2;

}

function findIsoCoordsY(x, y) {
 return (mapTilesY * tileH/2) -x/4 + y/4;

}


// find non-iso coords for a tile
function getTileCentreCoordX(tileX) {
    return tileX*tileW;
}

function getTileCentreCoordY(tileY) {
    return tileY*tileW;
}


// find iso coords for a tile
function getTileIsoCentreCoordX(tileX, tileY) {
    return tileW / 2 * (mapTilesY - tileY + tileX);
}

function getTileIsoCentreCoordY(tileX, tileY) {
    return tileH / 2 * (tileY + tileX);
}


// find current tile based on non-iso coords
function getCurrentTileX(x) {
    return Math.floor(x/tileW);
}
function getCurrentTileY(y) {
    return Math.floor(y/tileW);
}


function sortByIsoDepth(a, b) {
    if (a[0] < b[0])
        return -1;
    if (a[0] > b[0])
        return 1;
    return 0;
}

function findIsoDepth(x, y) {
    return x*tileW + y*(mapTilesX+1)*tileW;
}













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

// -----------------------------------------------------------

// image loader 
// http://stackoverflow.com/questions/16560397/image-not-drawn-on-canvas-until-user-clicks
// http://jsfiddle.net/gfcarv/26AmY/
window.Loader = (function() {
    var imageCount = 0;
    var loading = false;
    var total = 0;

    // this object will hold all image references
    var images = {};

    // user defined callback, called each time an image is loaded (if it is not defined the empty function wil be called)
    function onProgressUpdate() {};
    // user defined callback, called when all images are loaded (if it is not defined the empty function wil be called)
    function onComplete() {};

    function onLoadImage(name) {
        ++imageCount;
        // console.log(name + " loaded");

        // call the user defined callback when an image is loaded
        onProgressUpdate(getProgress());

        // check if all images are loaded
        if (imageCount == total) {
            loading = false;
            //  console.log("Load complete.");
            onComplete();
        }

    };

    function onImageError(e) {
        console.log("Error on loading the image: " + e.srcElement);
    }

    function loadImage(name, src) {
        try {
            images[name] = new Image();
            images[name].onload = function() {
                onLoadImage(name);
            };
            images[name].onerror = onImageError;
            images[name].src = src;
        } catch (e) {
            console.log(e.message);
        }
    }

    function getImage(name) {
        if (images[name]) {
            return (images[name]);
        } else {
            return undefined;
        }
    }

    // pre-load all the images and call the onComplete callback when all images are loaded
    // optionaly set the onProgressUpdate callback to be called each time an image is loaded (useful for loading screens) 
    function preload(_images, _onComplete, _onProgressUpdate) {
        if (!loading) {

            //  console.log("Loading...");
            loading = true;

            try {
                total = _images.length;
                onProgressUpdate = _onProgressUpdate || (function() {});
                onComplete = _onComplete || (function() {});

                for (var i = 0; i < _images.length; ++i) {
                    loadImage(_images[i].name, _images[i].src);
                }
            } catch (e) {
                console.log(e.message);
            }
        } else {
            //  throw new Error("Acess denied: Cannot call the load function while there are remaining images to load.");
        }
    }

    // percentage of progress
    function getProgress() {
        return (imageCount / total) * 100;
    };

    // return only the public stuff to create our Loader object
    return {
        preload: preload,
        getProgress: getProgress,
        getImage: getImage,
        images: images
    };
})();

// -----------------------------------------------------------


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
        canvasWidth = gameCanvas.width;
        canvasHeight = gameCanvas.height;
    }
    getJSON('/data/' + characterId + '/map' + currentMap + '.json', function(data) {
        thisMapData = data.map;
        mapTilesY = thisMapData.terrain.length;
        mapTilesX = thisMapData.terrain[0].length;
        console.log("map dimensions: "+mapTilesX+", "+mapTilesY);
        loadAssets();
    }, function(status) {
        alert('Error loading map data');
    });
    gameMode = "loading";
    // show loading screen while getting assets:
    gameLoop();
}




function prepareGame() {
    // get image references:
    tileImages = [];
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[i] = Loader.getImage("tile" + i);
    }
    heroImg = Loader.getImage("heroImg");
    backgroundImg = Loader.getImage("backgroundImg");
    // detect and set up input methods:
    Input.init();
    // determine tile offset to centre the hero in the centre


    hero.x = getTileIsoCentreCoordX(hero.tileX, hero.tileY);
    hero.y = getTileIsoCentreCoordY(hero.tileX, hero.tileY);


   hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);

    console.log("hero: "+hero.x + ", " + hero.y);

/*
console.log("0,0 ==>"+findIsoCoordsX(0,0)+", "+findIsoCoordsY(0,0));
console.log("48,0 ==>"+findIsoCoordsX(48,0)+", "+findIsoCoordsY(48,0));
console.log("0,24 ==>"+findIsoCoordsX(0,24)+", "+findIsoCoordsY(0,24));
console.log(hero.x+","+hero.y+" ==>"+findIsoCoordsX(hero.x,hero.y)+", "+findIsoCoordsY(hero.x,hero.y)+" - hero");

hero.isox = hero.x;
hero.isoy = hero.y;
*/


oldHeroX = hero.x;
oldHeroY = hero.y;

    gameMode = "play";
}






function loadAssets() {
    imagesToLoad = [];
    imagesToLoad.push({
        name: "heroImg",
        src: '/images/game-world/core/TEMP-link.png'
    });
    imagesToLoad.push({
        name: "backgroundImg",
        src: '/images/game-world/maps/' + currentMap + '/bg.png'
    });
    tileGraphicsToLoad = thisMapData.graphics;
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        imagesToLoad.push({
            name: "tile" + i,
            src: "/images/game-world/maps/" + currentMap + "/" + tileGraphicsToLoad[i].src
        });
    }
    Loader.preload(imagesToLoad, prepareGame, loadingProgress);
}

function loadingProgress() {
    // make this graphical ####
    console.log("loading - " + Loader.getProgress());
}

function checkCollisions() {
    var collisionArray = thisMapData.collisions;
    // tile collisions
    if (key[2]) {
        // up
    }
    if (key[3]) {
        // down
    }
    if (key[0]) {
        // left
    }
    if (key[1]) {
        //right
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
// adjusting the hero's coord as iso ################
// need to move on cartesinan, but then adjust to iso for graphics offset
     //   hero.isox += hero.speed;
     //   hero.isoy -= hero.speed / 2;
    hero.y -= hero.speed;
    } else if (key[3]) {
        hero.isMoving = true;
        hero.facing = 'down';

   //     hero.isox -= hero.speed;
   //     hero.isoy += hero.speed / 2;
      hero.y += hero.speed;
    } else if (key[0]) {
        hero.isMoving = true;
        hero.facing = 'left';

   //    hero.isox -= hero.speed;
   //     hero.isoy -= hero.speed / 2;
      hero.x -= hero.speed;
    } else if (key[1]) {
        hero.isMoving = true;
        hero.facing = 'right';

     //   hero.isox += hero.speed;
     //   hero.isoy += hero.speed / 2;
      hero.x += hero.speed;
    }




if(oldHeroX != hero.x || oldHeroY != hero.y) {
    console.log(hero.x+","+hero.y+"  --> "+getCurrentTileX(hero.x)+", "+getCurrentTileY(hero.y));
oldHeroX = hero.x;
oldHeroY = hero.y;
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
    // get all assets to be drawn in a list - start with the hero:
 /*
    var assetsToDraw = [
        [findIsoDepth(hero.x, hero.y), heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, canvasWidth / 2 - hero.feetOffsetX, canvasHeight / 2 - hero.feetOffsetY, hero.width, hero.height]
    ];
    */

 var assetsToDraw = [
        [findIsoDepth(hero.x, hero.y), heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, hero.x - hero.feetOffsetX, hero.y - hero.feetOffsetY, hero.width, hero.height]
    ];



    var map = thisMapData.terrain;
    var thisGraphicCentreX, thisGraphicCentreY;
    for (var i = 0; i < mapTilesX; i++) {
        for (var j = 0; j < mapTilesY; j++) {
         // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
         // this makes the map array more readable when editing
                   if (map[j][i] != "*") {
                thisX = getTileIsoCentreCoordX(i, j);
                thisY = getTileIsoCentreCoordY(i, j);
                thisGraphicCentreX = thisMapData.graphics[(map[j][i])].centreX;
                thisGraphicCentreY = thisMapData.graphics[(map[j][i])].centreY;
                


                hero.isox = 0;
                hero.isoy = 0;



            //    assetsToDraw.push([findIsoDepth(thisX, thisY), tileImages[(map[j][i])], thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2), thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2)]);
                assetsToDraw.push([findIsoDepth(thisX, thisY), tileImages[(map[j][i])], thisX - hero.isox - thisGraphicCentreX, thisY - hero.isoy - thisGraphicCentreY]);
            
            }
        }
    }
    assetsToDraw.sort(sortByIsoDepth);
    gameContext.drawImage(backgroundImg, 0, 0);
    // draw the sorted assets:
    for (var i = 0; i < assetsToDraw.length; i++) {
        if (assetsToDraw[i].length == 10) {
            // sprite image (needs slicing parameters):
            gameContext.drawImage(assetsToDraw[i][1], assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4], assetsToDraw[i][5], assetsToDraw[i][6], assetsToDraw[i][7], assetsToDraw[i][8], assetsToDraw[i][9]);
        } else {
            // standard image:
            gameContext.drawImage(assetsToDraw[i][1], assetsToDraw[i][2], assetsToDraw[i][3]);
        }
    }
}







// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback? #####
}
