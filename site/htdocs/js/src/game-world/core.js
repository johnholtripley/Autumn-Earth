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
    gameMode = "mapLoading";
        // detect and set up input methods:
    Input.init();
    loadCoreAssets();
    // show loading screen while getting assets:
    gameLoop();
}





function prepareGame() {
    // get map image references:
    tileImages = [];
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[i] = Loader.getImage("tile" + i);
    }
    backgroundImg = Loader.getImage("backgroundImg");
    // determine tile offset to centre the hero in the centre
    hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);
    mapIsTransitioningOut = false;
    mapTransitionCurrentFrames = 1;
    mapIsTransitioningIn = true;
    gameMode = "play";
}


function loadMap() {  
    getJSON('/data/' + characterId + '/map' + currentMap + '.json', function(data) {
        thisMapData = data.map;
        mapTilesY = thisMapData.terrain.length;
        mapTilesX = thisMapData.terrain[0].length;
        loadMapAssets();
    }, function(status) {
        alert('Error loading data for map #'+currentMap);
    });
}

function prepareCoreAssets() {
    heroImg = Loader.getImage("heroImg");
    loadMap();
}

function loadCoreAssets() {
    coreImagesToLoad = [];
    coreImagesToLoad.push({
        name: "heroImg",
        src: '/images/game-world/core/test-iso-hero.png'
    });
    Loader.preload(coreImagesToLoad, prepareCoreAssets, loadingProgress);
}

function removeMapAssets() {
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
      //  tileImages[i].src = '';
        tileImages[i] = null;
    }
    //backgroundImg.src = '';
    backgroundImg = null;
}


function loadMapAssets() {
    imagesToLoad = [];
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

function changeMaps(doorX, doorY) {

 
        gameMode = "mapLoading";
        console.log("chaning maps");
        var doorData = thisMapData.doors;
        var whichDoor = getTileX(doorX) + "," + getTileX(doorY);
        hero.tileX = doorData[whichDoor].startX;
        hero.tileY = doorData[whichDoor].startY;
        currentMap = doorData[whichDoor].map;
        //removeMapAssets();
        // need to remove previous map's assets *after* the new is fully loaded so it can all be drawn through the transition
        // append asset name ewith map number? ######################
        loadMap();
    
}




function isATerrainCollision(x, y) {
    switch (thisMapData.collisions[getTileY(y)][getTileX(x)]) {
        case 1:
            // is a collision:
            return 1;
            break;
        case "d":
            // is a door:
            activeDoorX = x;
            activeDoorY = y;
   if (!mapIsTransitioningOut) {
    mapTransitionCurrentFrames = 1;
        mapIsTransitioningOut = true;
    }

            //changeMaps(x,y);
            return 0;
            break;
        default:
            // not a collsiion:
            return 0;
    }
}






function checkHeroCollisions() {
    // tile collisions:
    if (key[2]) {
        // up
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            // find the tile's bottom edge
            var tileCollidedWith = getTileY(hero.y - hero.height / 2);
            var tileBottomEdge = (tileCollidedWith + 1) * tileW;
            // use the +1 to make sure it's just clear of the collision tile
            hero.y = tileBottomEdge + hero.height / 2 + 1;

        }
    }
    if (key[3]) {
        // down
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2))) {
            var tileCollidedWith = getTileY(hero.y + hero.height / 2);
            var tileTopEdge = (tileCollidedWith) * tileW;
            hero.y = tileTopEdge - hero.height / 2 - 1;
        }
    }
    if (key[0]) {
        // left


        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x - hero.width / 2);
            var tileRightEdge = (tileCollidedWith + 1) * tileW;
            hero.x = tileRightEdge + hero.width / 2 + 1;
        }
    }
    if (key[1]) {
        //right
        if ((isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x + hero.width / 2);
            var tileLeftEdge = (tileCollidedWith) * tileW;
            hero.x = tileLeftEdge - hero.width / 2 - 1;
        }
    }

}


function gameLoop() {
    switch (gameMode) {
        case "mapLoading":
            console.log("loading map assets...");
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
    if (!mapIsTransitioningOut) {
    // Handle the Input
    if (key[2]) {
        hero.isMoving = true;
        hero.facing = 'up';

    hero.y -= hero.speed;
    } else if (key[3]) {
        hero.isMoving = true;
        hero.facing = 'down';

   
      hero.y += hero.speed;
    } else if (key[0]) {
        hero.isMoving = true;
        hero.facing = 'left';

  
      hero.x -= hero.speed;
    } else if (key[1]) {
        hero.isMoving = true;
        hero.facing = 'right';

   
      hero.x += hero.speed;
    }

hero.tileX = getTileX(hero.x);
hero.tileY = getTileY(hero.y);
/*


if(oldHeroX != hero.tileX || oldHeroY != hero.tileY) {
  //  console.log(hero.x+","+hero.y+"  --> "+findIsoCoordsX(hero.x,hero.y)+", "+findIsoCoordsY(hero.x,hero.y));
console.log(hero.tileX+","+hero.tileY);
oldHeroX = hero.tileX;
oldHeroY = hero.tileY;
}
*/

    checkHeroCollisions();
} else {
    hero.isMoving = true;
// continue the hero moving:
switch(hero.facing) {
    case 'up':
        hero.y -= hero.speed;
        break;
        case 'down':
        hero.y += hero.speed;
        break;
           case 'left':
        hero.x -= hero.speed;
        break;
        case 'right':
        hero.x += hero.speed;
        break;

} 
    mapTransitionCurrentFrames++;
    if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
        mapIsTransitioningOut = false;
        changeMaps(activeDoorX, activeDoorY);
    }
}
if(mapIsTransitioningIn) {


// make it transition in twice as fast:
    mapTransitionCurrentFrames+=2;
      if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
        mapIsTransitioningIn = false;
       
    }
}


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
          [findIsoDepth(findIsoCoordsX(hero.x, hero.y),findIsoCoordsY(hero.x, hero.y)), heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, canvasWidth / 2 - hero.feetOffsetX, canvasHeight / 2 - hero.feetOffsetY, hero.width, hero.height]
      ];
      */

    var assetsToDraw = [
        [findIsoDepth(findIsoCoordsX(hero.x, hero.y), findIsoCoordsY(hero.x, hero.y)), heroImg, (canvasWidth / 2 - hero.feetOffsetX), (canvasHeight / 2 - hero.feetOffsetY)]
    ];

    var map = thisMapData.terrain;
    var thisGraphicCentreX, thisGraphicCentreY;
    hero.isox = findIsoCoordsX(hero.x, hero.y);
    hero.isoy = findIsoCoordsY(hero.x, hero.y);
    for (var i = 0; i < mapTilesX; i++) {
        for (var j = 0; j < mapTilesY; j++) {
            // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
            // this makes the map array more readable when editing
            if (map[j][i] != "*") {
                thisX = getTileIsoCentreCoordX(i, j);
                thisY = getTileIsoCentreCoordY(i, j);
                thisGraphicCentreX = thisMapData.graphics[(map[j][i])].centreX;
                thisGraphicCentreY = thisMapData.graphics[(map[j][i])].centreY;

                assetsToDraw.push([findIsoDepth(thisX, thisY), tileImages[(map[j][i])], thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2), thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2)]);
            }
        }
    }
    assetsToDraw.sort(sortByIsoDepth);

    gameContext.clearRect(0, 0, canvasWidth, canvasHeight);
    // scroll background to match the top tip and left tip of the tile grid:
    gameContext.drawImage(backgroundImg, getTileIsoCentreCoordX(0, mapTilesX - 1) - hero.isox + (canvasWidth / 2) - tileW / 2, getTileIsoCentreCoordY(0, 0) - hero.isoy + (canvasHeight / 2) - tileH / 2);
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
    // draw the map transition if it's needed:
    if (mapIsTransitioningOut) {
       
        var gradientSize = (1-(mapTransitionCurrentFrames/mapTransitionMaxFrames));
        //console.log(gradientSize);
        var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        gameContext.fillStyle = gradient;
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
    }
        if (mapIsTransitioningIn) {
            
        var gradientSize = ((mapTransitionCurrentFrames/mapTransitionMaxFrames));
        //console.log(gradientSize);
        var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        gameContext.fillStyle = gradient;
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
    }
}








// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback? #####
}
