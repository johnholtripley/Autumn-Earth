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
        mapTilesY = thisMapData.terrain.length;
        mapTilesX = thisMapData.terrain[0].length;
        loadAssets();
    }, function(status) {
        alert('Error loading map data');
    });
    gameMode = "loading";
    // show loading screen while getting assets:
    gameLoop();
}


function getTileCentreCoordX(tileX, tileY) {
    return tileW / 2 * (mapTilesY - tileY + tileX);
}

function getTileCentreCoordY(tileX, tileY) {
    return tileH / 2 * (1 + tileY + tileX);
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
    // determine hero's start position:
    hero.x = getTileCentreCoordX(hero.tileX, hero.tileY) - hero.feetOffsetX;
    hero.y = getTileCentreCoordY(hero.tileX, hero.tileY) - hero.feetOffsetY;
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
    gameContext.drawImage(heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);
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
            if(map[i][j] != "*") {
            thisX = (map.length - i + j) * tileW / 2;
            thisY = (i + j) * tileH / 2;
            thisGraphicCentreX = thisMapData.graphics[(map[i][j])].centreX;
            thisGraphicCentreY = thisMapData.graphics[(map[i][j])].centreY;
            gameContext.drawImage(tileImages[(map[i][j])], thisX + mapX - thisGraphicCentreX, thisY + mapY - thisGraphicCentreY);
        }
        }
    }
}

// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback?
}
