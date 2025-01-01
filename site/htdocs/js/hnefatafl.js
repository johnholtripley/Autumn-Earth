'use strict';

// config ----------------------------------------------------


/*
TO DO




*/


var lastTime = 0;
var elapsed = 0;

var timeSinceLastFrameSwap = 0;
var animationFramesPerSecond = 16;
var animationUpdateTime = (1000 / animationFramesPerSecond);


// -----------------------------------------------------------

if ((cutsTheMustard) && (supportsCanvas())) {
	hnefataflNameSpace.initialisehnefataflGame();
	gameLoop();
    // preload all images:
    Loader.preload(hnefataflNameSpace.imagesToLoad, hnefataflNameSpace.initGame, loadingProgress);

    // resize handler:
    const canvasResizeHandler = debounce(function() {
        hnefataflNameSpace.getCanvasPosition();
    }, 250);
    window.addEventListener('resize', canvasResizeHandler);
}





function loadingProgress() {
    // make this graphical ####
    // console.log("loading - " + Loader.getProgress());
}

function hnefataflPlayer1Wins() {
    console.log("Player 1 wins");
}

function hnefataflPlayer2Wins() {
    console.log("Player 2 wins");
}


function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    switch (hnefataflNameSpace.gameMode) {
        case "loading":
            console.log("loading...");
            //
            break;
        case "play":

            var now = window.performance.now();
            var elapsed = (now - lastTime);
            lastTime = now;
            timeSinceLastFrameSwap += elapsed;
            if (timeSinceLastFrameSwap > animationUpdateTime) {

                hnefataflNameSpace.update();
                hnefataflNameSpace.draw();
                timeSinceLastFrameSwap = 0;
            }
            break;
        case "gameover":
            console.log("game over");
            break;
    }
}