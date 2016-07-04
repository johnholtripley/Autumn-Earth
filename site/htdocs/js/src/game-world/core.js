




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
