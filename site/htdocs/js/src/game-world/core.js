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
    // determine tile offset to centre the hero in the centre
    worldOffsetX = getTileCentreCoordX(hero.tileX, hero.tileY) - (canvasWidth / 2);
    worldOffsetY = getTileCentreCoordY(hero.tileX, hero.tileY) - (canvasHeight / 2) - (tileH / 2);
    // hero needs to be at the canvas centre:
    hero.x = canvasWidth / 2 - hero.feetOffsetX;
    hero.y = canvasHeight / 2 - hero.feetOffsetY;

    

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
        worldOffsetX += hero.speed;
        worldOffsetY -= hero.speed / 2;
    } else if (key[3]) {
        hero.isMoving = true;
        hero.facing = 'down';
        worldOffsetX -= hero.speed;
        worldOffsetY += hero.speed / 2;
    } else if (key[0]) {
        hero.isMoving = true;
        hero.facing = 'left';
        worldOffsetX -= hero.speed;
        worldOffsetY -= hero.speed / 2;
    } else if (key[1]) {
        hero.isMoving = true;
        hero.facing = 'right';
        worldOffsetX += hero.speed;
        worldOffsetY += hero.speed / 2;
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

function sortByIsoDepth(a, b) {
    if (a[3] < b[3])
        return -1;
    if (a[3] > b[3])
        return 1;
    return 0;
}

function findIsoDepth(x, y) {
    
    return x*tileW + y*(mapTilesX+1)*tileW;
}

// ##########
// need to fix findIsoDepth equation
// need to pass in object centre, not draw coords
// need a better way to reference items so they can be drawn quickly -  if (assetsToDraw[i][0] == "hero") { is not good...
// ##########


function draw() {
    //  drawBackground();
    //  gameContext.drawImage(heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);
    // get all objects to be drawn in a list:
    var assetsToDraw = [];
    assetsToDraw.push(["hero", hero.x, hero.y, findIsoDepth(hero.x- worldOffsetX, hero.y- worldOffsetY)]);

    var map = thisMapData.terrain;
    var thisGraphicCentreX, thisGraphicCentreY;
    for (var i = 0; i < mapTilesY; i++) {
        for (var j = 0; j < mapTilesX; j++) {
            if (map[i][j] != "*") {
                thisX = (mapTilesY - i + j) * tileW / 2;
                thisY = (i + j) * tileH / 2;
                thisGraphicCentreX = thisMapData.graphics[(map[i][j])].centreX;
                thisGraphicCentreY = thisMapData.graphics[(map[i][j])].centreY;
          
                //    gameContext.drawImage(tileImages[(map[i][j])], thisX - worldOffsetX - thisGraphicCentreX, thisY - worldOffsetY - thisGraphicCentreY);
                assetsToDraw.push([tileImages[(map[i][j])], thisX - worldOffsetX - thisGraphicCentreX, thisY - worldOffsetY - thisGraphicCentreY, findIsoDepth(thisX - worldOffsetX, thisY - worldOffsetY)]);
            }
        }
    }
    assetsToDraw.sort(sortByIsoDepth);
    gameContext.drawImage(backgroundImg, 0, 0);
    for (var i = 0; i < assetsToDraw.length; i++) {
        if (assetsToDraw[i][0] == "hero") {
            gameContext.drawImage(heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);
        } else {
            gameContext.drawImage(assetsToDraw[i][0], assetsToDraw[i][1], assetsToDraw[i][2]);
        }
    }

}





// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback?
}
