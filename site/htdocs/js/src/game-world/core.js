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
