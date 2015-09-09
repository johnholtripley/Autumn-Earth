// -----------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Moller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
// -----------------------------------------------------------





// config ----------------------------------------------------

framesPerSecond = 24;



// -----------------------------------------------------------


// http://www.html5rocks.com/en/tutorials/canvas/notearsgame/


function initCardGame() {
    if ((cutsTheMustard) && (supportsCanvas())) {
        gameCanvas = document.getElementById("cardGame");
        if (gameCanvas.getContext) {
            gameContext = gameCanvas.getContext('2d');
            canvasWidth = gameCanvas.width;
            canvasHeight = gameCanvas.height;
            gameContext.fillStyle = "rgb(255,255,128)";
            gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
            gameContext.fillStyle = "rgb(255,255,255)";
            gameContext.fillRect(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2);
        }
        card = {
            color: "#ff0000",
            x: 20,
            y: 20,
            width: 84,
            height: 102,
            speed: 4,
            xdir: 1,
            ydir: 1,
            draw: function() {
                gameContext.drawImage(img, this.x, this.y);
            }
        };


        var img = new Image();
        img.onload = function() {
            gameContext.drawImage(img, card.x, card.y);
        };
        img.src = 'http://images-mediawiki-sites.thefullwiki.org/00/3/2/5/17135484186351126.jpg';

        //  $(window).load(function() {
        // start the animations:
        gameLoop();
        //  });
    }
}


function update() {
    card.x += (card.xdir*card.speed);
    card.y += (card.ydir*card.speed);
    if ((card.x + card.width) >= canvasWidth) {
        card.xdir = -1;
    }
    if (card.x <= 0) {
        card.xdir = 1;
    }
      if ((card.y + card.height) >= canvasHeight) {
        card.ydir = -1;
    }
    if (card.y <= 0) {
        card.ydir = 1;
    }
}

function draw() {
    gameContext.clearRect(0, 0, canvasWidth, canvasHeight);
    card.draw();
}

function gameLoop() {
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
        update();
        draw();
    }, (1000 / framesPerSecond));
}



// -----------------------------------------------------------

initCardGame();
