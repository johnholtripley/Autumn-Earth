'use strict';

// config ----------------------------------------------------





var lastTime = 0;
var elapsed = 0;

var timeSinceLastFrameSwap = 0;
  var animationFramesPerSecond = 16;
   var animationUpdateTime = (1000 / animationFramesPerSecond);



var hero = {
stats: []
}



// -----------------------------------------------------------


if ((cutsTheMustard) && (supportsCanvas())) {
hnefataflNameSpace.initialisehnefataflGame();

 gameLoop();
        // preload all images:
        Loader.preload(hnefataflNameSpace.imagesToLoad, hnefataflNameSpace.initCardGame, loadingProgress);


        // resize handler:
        const canvasResizeHandler = debounce(function() {
            hnefataflNameSpace.getCanvasPosition();
        }, 250);
        window.addEventListener('resize', canvasResizeHandler);
}






function loadingProgress() {
    // make this graphical ####
    console.log("loading - " + Loader.getProgress());
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


