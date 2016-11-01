// config ----------------------------------------------------





var lastTime = 0;
var elapsed = 0;

var timeSinceLastFrameSwap = 0;
  var animationFramesPerSecond = 16;
   var animationUpdateTime = (1000 / animationFramesPerSecond);




cardGameNameSpace.allCardData = allCardData;
cardGameNameSpace.player1Cards = player1Cards;
cardGameNameSpace.player2Cards = player2Cards;
cardGameNameSpace.player1Skill = player1Skill;


var hero = {
stats: []
}
hero.stats.cardGamesWon = 0;
hero.stats.cardGamesLost = 0;
hero.stats.numberOfcardsFlipped = 0;


// -----------------------------------------------------------







if ((cutsTheMustard) && (supportsCanvas())) {
cardGameNameSpace.initialiseCardGame();

 gameLoop();
        // preload all images:
        Loader.preload(cardGameNameSpace.imagesToLoad, cardGameNameSpace.initCardGame, loadingProgress);


        // resize handler:
        canvasResizeHandler = debounce(function() {
            cardGameNameSpace.getCanvasPosition();
        }, 250);
        window.addEventListener('resize', canvasResizeHandler);
}






function loadingProgress() {
    // make this graphical ####
    console.log("loading - " + Loader.getProgress());
}





function cardGamePlayer2Wins() {

}

function cardGamePlayer1Wins() {
    
}


function cardGameIsDrawn() {
    
}













// AI -----------------------------------------








// -------------------------------------------




function gameLoop() {

    window.requestAnimationFrame(gameLoop);
    switch (cardGameNameSpace.gameMode) {
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

                cardGameNameSpace.update();
                cardGameNameSpace.draw();
                timeSinceLastFrameSwap = 0;
            }
            break;
        case "gameover":
            console.log("game over");
            break;
    }

}


