// config ----------------------------------------------------

framesPerSecond = 24;
playerColours = ["", "#ffcc00", "#ff00cc"];

cardWidth = 84;
cardHeight = 102;

allCardsThisGame = player1Cards.concat(player2Cards);
numberOfCardsInGame = allCardsThisGame.length;


// 'x' = void space
// '#' = player 1 start position
// '@' = player 2 start position
board = [
   ['#', '#', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', 'x', 'x'],
    ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
    ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
    ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
    ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
    ['x', 'x', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', '@', '@']
];

boardWidth = board[0].length;
boardHeight = board.length;



// helper functions ----------------------------------------------------

// http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array#answer-9229821
function uniqueValues(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}


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





// image loader -----------------------------------------------------------
// http://stackoverflow.com/questions/16560397/image-not-drawn-on-canvas-until-user-clicks
// http://jsfiddle.net/gfcarv/26AmY/


window.Loader = (function() {
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
            images[name].onload = function() {
                onLoadImage(name);
            };
            images[name].onerror = onImageError;
            images[name].src = src;
        } catch (e) {
            console.log(e.message);
        }
    }

    function getImage(name) {
        if (images[name]) {
            return (images[name]);
        } else {
            return undefined;
        }
    }

    // pre-load all the images and call the onComplete callback when all images are loaded
    // optionaly set the onProgressUpdate callback to be called each time an image is loaded (useful for loading screens) 
    function preload(_images, _onComplete, _onProgressUpdate) {
        if (!loading) {

            //  console.log("Loading...");
            loading = true;

            try {
                total = _images.length;
                onProgressUpdate = _onProgressUpdate || (function() {});
                onComplete = _onComplete || (function() {});

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
        return (imageCount / total) * 100;
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

    // find non-duplicate card types to load:
    allCardsToLoadThisGame = uniqueValues(allCardsThisGame);
    var numberOfCardTypes = allCardsToLoadThisGame.length;


    var imagesToLoad = [
        {name: "board",        src: "http://www.autumnearth.com/images/card-game/board.jpg"},
        {name: "selected", src: "http://www.autumnearth.com/images/card-game/selected-card.png"},
        {name: "current", src: "http://www.autumnearth.com/images/card-game/current-player.png"}
    ];

    // build imagesToLoad array dynamically for cards:
    for (var i = 1; i <= numberOfCardTypes; i++) {

        imagesToLoad.push({
            name: "card" + i,
            src: "http://www.autumnearth.com/images/card-game/cards/" + i + ".png"
        });
    }



    // click handler:
    document.getElementById("cardGame").addEventListener("click", function(e) {
        canvasClick(e);
        if (e) {
            e.preventDefault();
        }
    }, false);



    // resize handler:
    canvasResizeHandler = debounce(function() {
        getCanvasPosition();
    }, 250);

    window.addEventListener('resize', canvasResizeHandler);

    /*
    window.addEventListener("orientationchange", function() {
      getCanvasPosition();
    }, false);
    */


    // preload all images:
    Loader.preload(imagesToLoad, initCardGame, loadingProgress);
}

function loadingProgress() {
    // make this graphical ####
    console.log("loading - " + Loader.getProgress());
}




function getCanvasPosition() {
    canvasElemCoords = document.getElementById("cardGame").getBoundingClientRect();
    outerCanvasLeft = canvasElemCoords.left;
    outerCanvasTop = canvasElemCoords.top;
    outerCanvasWidth = canvasElemCoords.right - canvasElemCoords.left;
    outerCanvasHeight = canvasElemCoords.bottom - canvasElemCoords.top;
    pageLoadScroll = document.body.scrollTop + document.documentElement.scrollTop;
   // console.log("canvas at " + outerCanvasLeft + ", " + outerCanvasTop + " at " + pageLoadScroll + " - " + outerCanvasWidth + " x " + outerCanvasHeight);
}





function initCardGame() {

    getCanvasPosition();
    gameCanvas = document.getElementById("cardGame");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        canvasWidth = gameCanvas.width;
        canvasHeight = gameCanvas.height;
    }
    cards = [];
    for (var i = 0; i < numberOfCardsInGame; i++) {
        cards[i] = {
            x: -100,
            y: -100,
            //   boardX: -1,
            //   boardY: -1,
            originalOwner: (i >= (numberOfCardsInGame / 2) ? 2 : 1),
            hasBeenPlaced: false,
            cardType: allCardsThisGame[i],
            attack: allCardData[(allCardsThisGame[i])][0],
            defense: allCardData[(allCardsThisGame[i])][1],
            currentOwner: (i >= (numberOfCardsInGame / 2) ? 2 : 1),
            draw: function() {
                gameContext.fillStyle = playerColours[this.currentOwner];
                gameContext.fillRect(this.x, this.y, cardWidth, cardHeight);
                gameContext.drawImage(cardImages[this.cardType], this.x, this.y);


            }
        }

    }






    // set up image references:

    cardImages = [];
    for (var i = 1; i <= numberOfCardTypes; i++) {
        cardImages[i] = Loader.getImage("card" + i);
    }
    boardImage = Loader.getImage("board");

currentCardSelectedImage = Loader.getImage("selected");

currentCardSelected = {
    draw: function() {
       if(currentlySelectedCard != -1) {
        gameContext.drawImage(currentCardSelectedImage, cards[currentlySelectedCard].x-20, cards[currentlySelectedCard].y-20);
       } 
    }
}

currentPlayerMarkerImage = Loader.getImage("current");

currentPlayerMarker = {
    draw: function() {
       

this.x = (currentPlayersTurn == 1 ? 35 : 875); 

        gameContext.drawImage(currentPlayerMarkerImage, this.x, 20);
       
    }
}


    placeCardOnBoard(0, (boardWidth / 2) - 1, (boardHeight / 2) - 1, true);
    placeCardOnBoard(1, (boardWidth / 2), (boardHeight / 2), true);


    placeCardOnBoard((numberOfCardsInGame / 2), (boardWidth / 2), (boardHeight / 2) - 1, true);
    placeCardOnBoard((numberOfCardsInGame / 2) + 1, (boardWidth / 2) - 1, (boardHeight / 2), true);



    var player1CardIndexToPlace = 2;
    var player2CardIndexToPlace = (numberOfCardsInGame / 2) + 2;

    for (var j = 0; j < boardWidth; j++) {
        for (var k = 0; k < boardHeight; k++) {
            if (board[k][j] == "#") {
                // player 1 card
                placeCardOnBoard(player1CardIndexToPlace, j, k, false);
                player1CardIndexToPlace++;
            } else if (board[k][j] == "@") {
                placeCardOnBoard(player2CardIndexToPlace, j, k, false);
                player2CardIndexToPlace++;
            }
        }
    }

    currentlySelectedCard = -1;
currentPlayersTurn = 2;
currentOpponent = 1;


    gameLoop();


}

function placeCardOnBoard(cardRef, gridX, gridY, placedOnGameBoard) {
    board[gridY][gridX] = cardRef;
    cards[cardRef].x = gridX * cardWidth;
    cards[cardRef].y = gridY * cardHeight;
    cards[cardRef].hasBeenPlaced = placedOnGameBoard;
    //  cards[cardRef].boardX = gridX;
    //  cards[cardRef].boardY = gridY;
}


function update() {
    //
}

function draw() {
    //  gameContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // place board:
    gameContext.drawImage(boardImage, 0, 0);


    for (var i = 0; i < numberOfCardsInGame; i++) {
        cards[i].draw();
    }

    currentCardSelected.draw();
    currentPlayerMarker.draw();


}

function isValidMove(checkX, checkY) {
    console.log("checking " + checkX + ", " + checkY);
    // check that it adjoins another card (ie. that the board has a number there and not X, - or undefined):
    var isValid = false;


    for (var i = checkX - 1; i <= checkX + 1; i++) {
        for (var j = checkY - 1; j <= checkY + 1; j++) {
            // x shouldn't go out of scope, but y might:
            if (j >= 0) {
                if (j < boardHeight) {
                    if (!isNaN(board[j][i])) {
                        isValid = true;
                    }
                }
            }
        }
    }



    return isValid;
}

function checkAttacks(checkX, checkY) {
    checkAttack(checkX, checkY, -1, 0);
    checkAttack(checkX, checkY, 1, 0);
    checkAttack(checkX, checkY, 0, -1);
    checkAttack(checkX, checkY, 0, 1);
    checkAttack(checkX, checkY, -1, -1);
    checkAttack(checkX, checkY, 1, 1);
    checkAttack(checkX, checkY, -1, 1);
    checkAttack(checkX, checkY, 1, -1);
}

function checkAttack(placedTileX, placedTileY, xDir, yDir) {
    var defenceRunningTotal = 0;
    var opponentsCardsFound = [];
        // trace a path from selected tile, in direction set until a card that isn't an opponent's is encountered:
    var lineTracedX = placedTileX+xDir;
    var lineTracedY = placedTileY+yDir;

    while (cards[(board[lineTracedY][lineTracedX])].currentOwner == currentOpponent) {
        opponentsCardsFound.push(board[lineTracedY][lineTracedX]);
        defenceRunningTotal += allCardData([board[lineTracedY][lineTracedX]][1]);
        lineTracedX += xDir;
        lineTracedY += yDir;
    }
var placedCardsAttack = allCardData([(board[placedTileY][placedTileX])][0]);
// then check card after is current player's card, not the board edge:
    if (cards[(board[lineTracedY][lineTracedX])].currentOwner == currentPlayersTurn) {
var existingCardsAttack = allCardData([board[lineTracedY][lineTracedX]][0]);
if (placedCardsAttack+existingCardsAttack>=defenceRunningTotal) {
            for (i=0; i<opponentsCardsFound.length; i++) {
                flipCard(opponentsCardsFound[i], currentPlayersTurn);
            }
        }
    }
}

function flipCard(cardRef, newOwner) {
cards[cardRef].currentOwner = newOwner;
}

function canvasClick(e) {
    var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - outerCanvasLeft;
    var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - outerCanvasTop - pageLoadScroll;
    gridX = Math.floor((x / outerCanvasWidth) * boardWidth);
    gridY = Math.floor((y / outerCanvasHeight) * boardHeight);

    var thisBoardRef = board[gridY][gridX];

    if (thisBoardRef == "-") {

        if (currentlySelectedCard != -1) {
            if (isValidMove(gridX, gridY)) {
                placeCardOnBoard(currentlySelectedCard, gridX, gridY, true);
               currentlySelectedCard = -1;
              //  checkAttacks(gridX,gridY);
                
                // swap whose go it is:
var oldCurrentPlayersTurn = currentPlayersTurn;
currentPlayersTurn = currentOpponent;
currentOpponent = oldCurrentPlayersTurn;


            }
        }
    } else if (thisBoardRef != "x") {

        if (!(cards[thisBoardRef].hasBeenPlaced)) {
            console.log(cards[thisBoardRef].currentOwner + ", "+currentPlayersTurn);
if(cards[thisBoardRef].currentOwner == currentPlayersTurn) {
            currentlySelectedCard = thisBoardRef;
        }
        }
    }
}



function gameLoop() {
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
        update();
        draw();
    }, (1000 / framesPerSecond));
}
