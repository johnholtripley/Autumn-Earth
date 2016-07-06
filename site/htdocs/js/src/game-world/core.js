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

    gameMode = "loading";
    // show loading screen while getting assets:
    gameLoop();
    // get assets:
    hero.img = new Image();
    hero.img.src = '/images/game-world/core/TEMP-link.png';
    backgroundImg = new Image();
    backgroundImg.src = '/images/game-world/maps/1/bg.png';
    // detect and set up input methods:
    Input.init();
    gameMode = "play";

}

function checkCollisions() {

    var collisionArray = world.collisions;
  
    // due to his sprite _apparently_ being 17px wide, this causes problems with entrances which are two tiles, or 16px wide.
    // So let’s ignore a whole pixel when calculating tile-based collisions.
    var collisionWidth = hero.width - 2;

  

    // tile collisions
    if( key[2] ) { // up
        var topLeftCol  = Math.floor(hero.x / 8);
        var topRightCol = Math.floor((hero.x+collisionWidth) / 8);
        var row         = Math.floor((hero.y+9) / 8); // same for topleft and topright
        
        var tlCell      = (row * NUM_TILES_WIDE) + topLeftCol;
        var trCell      = (row * NUM_TILES_WIDE) + topRightCol;

        // now get the cells for each corner and check 'em!
        if( collisionArray[tlCell] == 1 || collisionArray[trCell] == 1 ) {
            hero.y = (row * 8);
        }
    }
    if( key[3]) { // down
        var bottomLeftCol   = Math.floor(hero.x / 8);
        var bottomRightCol  = Math.floor((hero.x+hero.width-1) / 8);
        var row             = Math.floor((hero.y+hero.height) / 8);

        var blCell      = (row * NUM_TILES_WIDE) + bottomLeftCol;
        var brCell      = (row * NUM_TILES_WIDE) + bottomRightCol;

        if( collisionArray[blCell] == 1 || collisionArray[brCell] == 1 ) {
            hero.y = (row * 8) - hero.height;
        }
    }
    if( key[0]) { // left
        var col             = Math.floor(hero.x / 8);
        var topLeftRow      = Math.floor((hero.y+9) / 8);
        var bottomLeftRow   = Math.floor((hero.y+hero.height-1) / 8);

        var tlCell      = (topLeftRow * NUM_TILES_WIDE) + col;
        var blCell      = (bottomLeftRow * NUM_TILES_WIDE) + col;

        if( collisionArray[tlCell] == 1 || collisionArray[blCell] == 1 ) {
            hero.x = (col * 8) + 8;
        }
    }
    if( key[1]) { //right
        var col             = Math.floor((hero.x+hero.width) / 8);
        var topRightRow     = Math.floor((hero.y+9) / 8);
        var bottomRightRow  = Math.floor((hero.y+hero.height-1) / 8);

        var trCell      = (topRightRow * NUM_TILES_WIDE) + col;
        var brCell      = (bottomRightRow * NUM_TILES_WIDE) + col;

        if( collisionArray[trCell] == 1 || collisionArray[brCell] == 1 ) {
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
    // gameContext.clearRect(0, 0, 256, 224);
    gameContext.drawImage(backgroundImg, 0, 0);
    gameContext.drawImage(hero.img, hero.offsetX, hero.offsetY, hero.width, hero.height, hero.x, hero.y, hero.width, hero.height);
}

// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback?
}
