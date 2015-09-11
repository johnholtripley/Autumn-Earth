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
playerColours = ["#ffcc00","#ff00cc"];
 
    cardWidth = 84;
            cardHeight = 102;
            // player's cards:
            var player1Cards = [1,2,1,1,1];
             // NPC's cards:
            var player2Cards = [1,1,2,2,2];
            allCardsThisGame = player1Cards.concat(player2Cards);
            numberOfCardsInGame = allCardsThisGame.length;

// image loader -----------------------------------------------------------
// http://stackoverflow.com/questions/16560397/image-not-drawn-on-canvas-until-user-clicks
// http://jsfiddle.net/gfcarv/26AmY/


window.Loader = (function () {
    var imageCount = 0;
    var loading = false;
    var total = 0;

    // this object will hold all image references
    var images = {};

    // user defined callback, called each time an image is loaded (if it is not defined the empty function wil be called)
    function onProgressUpdate() {};
    // user defined callback, called when all images are loaded (if it is not defined the empty function wil be called)
    function onComplete() {};

    function onLoadImage(name) {        
        ++imageCount;
        // console.log(name + " loaded");
        
        // call the user defined callback when an image is loaded
        onProgressUpdate(getProgress());
        
        // check if all images are loaded
        if (imageCount == total) {
            loading = false;
          //  console.log("Load complete.");
            onComplete();
        }

    };

    function onImageError(e) {
        console.log("Error on loading the image: " + e.srcElement);
    }

    function loadImage(name, src) {
        try {
            images[name] = new Image();
            images[name].onload = function () {
                onLoadImage(name);
            };
            images[name].onerror = onImageError;
            images[name].src = src;
        } catch (e) {
            console.log(e.message);
        }
    }
    
    function getImage(name){
        if(images[name]){
            return (images[name]);
       }
        else{
            return undefined; 
        }
    }

    // pre-load all the images and call the onComplete callback when all images are loaded
    // optionaly set the onProgressUpdate callback to be called each time an image is loaded (useful for loading screens) 
    function preload( _images, _onComplete, _onProgressUpdate) {
        if (!loading) {

          //  console.log("Loading...");
            loading = true;

            try {
                total = _images.length;
                onProgressUpdate = _onProgressUpdate || (function(){});
                onComplete = _onComplete || (function(){});                

                for (var i = 0; i < _images.length; ++i) {
                    loadImage(_images[i].name, _images[i].src);                    
                }
            } catch (e) {
                console.log(e.message);
            }
        } else {
          //  throw new Error("Acess denied: Cannot call the load function while there are remaining images to load.");
        }
    }

    // percentage of progress
    function getProgress() {
        return (imageCount / total)*100;
    };

    // return only the public stuff to create our Loader object
    return {
        preload: preload,
        getProgress: getProgress,
        getImage: getImage,
        images: images
    };
})();







// -----------------------------------------------------------








if ((cutsTheMustard) && (supportsCanvas())) {

// find non-duplicate card types to load
// build imagesToLoad array dynamically for cards

// preload all images

var imagesToLoad = [{name: "board", src: "http://www.autumnearth.com/images/card-game/board.jpg"},{name: "card1", src: "http://www.autumnearth.com/images/card-game/cards/1.png"},{name: "card2", src: "http://www.autumnearth.com/images/card-game/cards/2.png"}];

Loader.preload(imagesToLoad,initCardGame, loadingProgress); 
}

function loadingProgress() {
    // make this graphical ####
    console.log("loading - "+Loader.getProgress());
}

function initCardGame() {
    
        gameCanvas = document.getElementById("cardGame");
        if (gameCanvas.getContext) {
            gameContext = gameCanvas.getContext('2d');
            canvasWidth = gameCanvas.width;
            canvasHeight = gameCanvas.height;
        
        }

        

cards = [];
for (var i = 0; i < numberOfCardsInGame; i++) {
    cards[i] = {
        x: (i*cardWidth),
        y: 20,
        originalOwner: 0,
        hasBeenPlaced: false,
        cardType: allCardsThisGame[i],
        currentOwner: (i>=(numberOfCardsInGame/2) ? 1 : 0),
        draw: function() {
            gameContext.fillStyle = playerColours[this.currentOwner];
            gameContext.fillRect(this.x, this.y, cardWidth, cardHeight);
            gameContext.drawImage(cardImages[this.cardType], this.x, this.y);
        }
    }
}






// set up image references:
var numberOfCardTypes = imagesToLoad.length;
cardImages = [];
for (var i = 1; i <= numberOfCardTypes; i++) {
cardImages[i] = Loader.getImage("card"+i);
}

   

        gameLoop();
     
    
}


function update() {
    //
}

function draw() {
    gameContext.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < numberOfCardsInGame; i++) {
  cards[i].draw();
    }
  
  
}

function gameLoop() {
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
        update();
        draw();
    }, (1000 / framesPerSecond));
}



