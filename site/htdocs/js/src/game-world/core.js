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