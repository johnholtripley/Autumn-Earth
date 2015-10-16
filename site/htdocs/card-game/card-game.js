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



function compareZIndex(a,b) {
  if (a.zIndex < b.zIndex)
    return -1;
  if (a.zIndex > b.zIndex)
    return 1;
  return 0;
}


function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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
    var imagesToLoad = [{
        name: "board",
        src: "http://www.autumnearth.com/images/card-game/board.jpg"
    }, {
        name: "selected",
        src: "http://www.autumnearth.com/images/card-game/selected-card.png"
    }, {
        name: "current",
        src: "http://www.autumnearth.com/images/card-game/current-player.png"
    }];
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
    gameMode = "loading";
    gameLoop();
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
            index: i,
            //   boardX: -1,
            //   boardY: -1,
            zIndex: 0,
            flippedAnimation: 0,
            isMovingToBoard: false,
            originalOwner: (i >= (numberOfCardsInGame / 2) ? 2 : 1),
            hasBeenPlaced: false,
            cardType: allCardsThisGame[i],
            attack: allCardData[(allCardsThisGame[i])][0],
            defense: allCardData[(allCardsThisGame[i])][1],
            currentOwner: (i >= (numberOfCardsInGame / 2) ? 2 : 1),
            draw: function() {
                offsetX = 0;
                offsetY = 0;
                if (this.flippedAnimation > 0) {
                    randomAmount = this.flippedAnimation * 4;
                    offsetX = getRandomInteger(0, randomAmount);
                    offsetY = getRandomInteger(0, randomAmount);
                    this.flippedAnimation--;
                    if (this.flippedAnimation == 0) {
                        // now finished moving:
                        this.zIndex = 0;
                    }
                }
                gameContext.fillStyle = playerColours[this.currentOwner];
                gameContext.fillRect(this.x + offsetX, this.y + offsetY, cardWidth, cardHeight);
                gameContext.drawImage(cardImages[this.cardType], this.x + offsetX, this.y + offsetY);
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
            if (currentlySelectedCard != -1) {
                gameContext.drawImage(currentCardSelectedImage, cards[currentlySelectedCard].x - 20, cards[currentlySelectedCard].y - 20);
            }
        }
    }
    currentPlayerMarkerImage = Loader.getImage("current");
    currentPlayerMarker = {
        xScale: 1,
        increment: -0.05,
        draw: function() {
            // http://codetheory.in/canvas-rotating-and-scaling-images-around-a-particular-point/
            this.xScale += this.increment;
            if (Math.abs(this.xScale) > 1) {
                this.increment *= -1;
            }
            gameContext.save();
            this.x = (currentPlayersTurn == 1 ? 84 : 925);
            gameContext.translate(this.x, 20);
            gameContext.scale(this.xScale, 1);
            gameContext.drawImage(currentPlayerMarkerImage, (0 - ((currentPlayerMarkerImage.width) / 2)), 0);
            gameContext.restore();
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
    placedCards = 4;
    currentlySelectedCard = -1;
    currentPlayersTurn = 2;
    currentOpponent = 1;
    isPlayer1AI = true;
    whoCanClick = 2;
    gameMode = "play";
    aiIsWorking = -1;
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
    for (var i = 0; i < numberOfCardsInGame; i++) {
        if (cards[i].isMovingToBoard) {
            var targetX = cards[i].gridX * cardWidth;
            var targetY = cards[i].gridY * cardHeight;
            cards[i].x -= (cards[i].x - targetX) * 0.3;
            cards[i].y -= (cards[i].y - targetY) * 0.3;
            if (Math.abs(cards[i].x - targetX) < 10) {
                if (Math.abs(cards[i].y - targetY) < 10) {
                    // snap in position:
                    cards[i].isMovingToBoard = false;
                    cards[i].x = cards[i].gridX * cardWidth;
                    cards[i].y = cards[i].gridY * cardHeight;
                    cards[i].hasBeenPlaced = true;
                    cards[i].zIndex = 0;
                    checkAttacksInAllDirections(cards[i].gridX, cards[i].gridY, board, cards, currentOpponent, currentPlayersTurn, false);
                    placedCards++;
                    if (placedCards == numberOfCardsInGame) {
                        gameMode = "gameover";
                        var player1CardsShown = 0;
                        var player2CardsShown = 0;
                        for (var j = 0; j < numberOfCardsInGame; j++) {
                            if (cards[j].currentOwner == 1) {
                                player1CardsShown++;
                            } else {
                                player2CardsShown++;
                            }
                        }
                        if (player2CardsShown > player1CardsShown) {
                            playerColours[1] = "#665200";
                        } else if (player1CardsShown > player2CardsShown) {
                            playerColours[2] = "#660052";
                        }
                        draw();
                    }
                    // swap whose go it is:
                    var oldCurrentPlayersTurn = currentPlayersTurn;
                    currentPlayersTurn = currentOpponent;
                    currentOpponent = oldCurrentPlayersTurn;

                    if (currentPlayersTurn == 1) {
                        if (isPlayer1AI) {
                            doAIMove();
                        }
                    }

                }
            }
        }
    }
    if (aiIsWorking > 0) {
        aiIsWorking++;
        if (aiIsWorking > 36) {
            // make move:
            aiIsWorking = -1;
            currentlySelectedCard = whichMoveToMake[1];
            cards[currentlySelectedCard].isMovingToBoard = true;
            cards[currentlySelectedCard].gridX = whichMoveToMake[2];
            cards[currentlySelectedCard].gridY = whichMoveToMake[3];
            board[(whichMoveToMake[3])][(whichMoveToMake[2])] = currentlySelectedCard;
            cards[currentlySelectedCard].zIndex = 1;
            currentlySelectedCard = -1;
            // player's turn now:
            whoCanClick = 2;
        }
    }
}


function draw() {
    //  gameContext.clearRect(0, 0, canvasWidth, canvasHeight);
    // place board:
    gameContext.drawImage(boardImage, 0, 0);
    // get card indexes sorted by zindex:
    var cardsCopyForSorting = cards.slice();
    var cardDrawOrder = cardsCopyForSorting.sort(compareZIndex);
    for (var i = 0; i < numberOfCardsInGame; i++) {
        cards[(cardDrawOrder[i].index)].draw();
    }
    currentCardSelected.draw();
    currentPlayerMarker.draw();
}




function isValidMove(checkX, checkY, whichBoard) {
    // check that it adjoins another card (ie. that the board has a number there and not X, - or undefined):
    var isValid = false;
    for (var i = checkX - 1; i <= checkX + 1; i++) {
        for (var j = checkY - 1; j <= checkY + 1; j++) {
            // x shouldn't go out of scope, but y might:
            if (j >= 0) {
                if (j < boardHeight) {
              //      console.log(i+","+j+" = "+whichBoard[j][i]);
                    if (!isNaN(whichBoard[j][i])) {
                        isValid = true;
                    }
                }
            }
        }
    }
    return isValid;
}

function checkAttacksInAllDirections(checkX, checkY, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking) {
    checkAttack(checkX, checkY, -1, 0, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 1, 0, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 0, -1, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 0, 1, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, -1, -1, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 1, 1, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, -1, 1, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 1, -1, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking);
}

function checkAttack(placedTileX, placedTileY, xDir, yDir, whichBoard, whichCards, whichCurrentOpponent, whichCurrentPlayersTurn, isAIChecking) {
    var defenceRunningTotal = 0;
    var opponentsCardsFound = [];
    // trace a path from selected tile, in direction set until a card that isn't an opponent's is encountered:
    var lineTracedX = placedTileX + xDir;
    var lineTracedY = placedTileY + yDir;
    do {
        var isAnOpponentCard = false;
        // is in bounds:
        if (lineTracedY >= 0) {
            if (lineTracedY < boardHeight) {
                var thisCheckBoardRef = whichBoard[lineTracedY][lineTracedX];
                // is numeric?
                if (!(isNaN(thisCheckBoardRef))) {
                    if (whichCards[thisCheckBoardRef].currentOwner == whichCurrentOpponent) {
                        isAnOpponentCard = true;
                        opponentsCardsFound.push(thisCheckBoardRef);
                        var defenseCardType = whichCards[thisCheckBoardRef].cardType;
                        defenceRunningTotal += parseInt(allCardData[defenseCardType][1]);
                        lineTracedX += xDir;
                        lineTracedY += yDir;
                    }
                }
            }
        }
    } while (isAnOpponentCard);
    var attackCardType = whichCards[(whichBoard[placedTileY][placedTileX])].cardType;
    var placedCardsAttack = parseInt(allCardData[attackCardType][0]);
    // then check card after is current player's card, not the board edge:
    if (lineTracedY >= 0) {
        if (lineTracedY < boardHeight) {
            // is numeric?
            if (!(isNaN(whichBoard[lineTracedY][lineTracedX]))) {
                if (whichCards[(whichBoard[lineTracedY][lineTracedX])].currentOwner == whichCurrentPlayersTurn) {
                    var existingCardType = whichCards[(whichBoard[lineTracedY][lineTracedX])].cardType;
                    var existingCardsAttack = parseInt(allCardData[existingCardType][0]);
                    if (placedCardsAttack + existingCardsAttack >= defenceRunningTotal) {
                        if (isAIChecking) {
                            thisMovesScore += opponentsCardsFound.length;
                        } else {
                            for (i = 0; i < opponentsCardsFound.length; i++) {
                                flipCard(opponentsCardsFound[i], whichCards, whichCurrentPlayersTurn);
                            }
                        }
                    }
                }
            }
        }
    }
}




function flipCard(cardRef,whichCards,whichCurrentPlayersTurn) {
    whichCards[cardRef].currentOwner = whichCurrentPlayersTurn;
    whichCards[cardRef].flippedAnimation = 10;
    whichCards[cardRef].zIndex = 1;
}


// AI -----------------------------------------


function insertNewMove(element, array) {
  array.splice(locationOfBestScores(element, array) + 1, 0, element);
  return array;
}

function locationOfBestScores(element, array, start, end) {
  start = start || 0;
  end = end || array.length;
  var pivot = parseInt(start + (end - start) / 2, 10);
  if (array[pivot][0] === element[0]) return pivot;
  if (end - start <= 1)
    return array[pivot][0] < element[0] ? pivot - 1 : pivot;
  if (array[pivot][0] > element[0]) {
    return locationOfBestScores(element, array, pivot, end);
  } else {
    return locationOfBestScores(element, array, start, pivot);
  }
}

function doAIMove() {
    console.log("AI thinking...");
    aiIsWorking = 1;
    findBestMove(board, currentPlayersTurn, cards);
}

function findBestMove(boardState, whichPlayerCurrently, cardState) {
    whichOpponentCurrently = (whichPlayerCurrently == 1) ? 2 : 1;
    // copy arrays so original data isn't changed:
    var cardState = cardState.slice();
    var tempBoard = [];
    for (var i = 0; i < boardState.length; i++) {
        tempBoard[i] = boardState[i].slice();
    }
    var bestMoveFound = [];
    // [best score, card ref, gridx, gridy]:
    var listOfPossibleBestMoves = [
        [-999999, -1, -1, -1]
    ];
    var bestImmediatePlayerMove = [];
    // these values might change if the board is vertical - but use them to not include starting grid positions
    var horizInset = 2;
    var vertInset = 0;
    // loop through all board tiles:
    for (var j = horizInset; j < (boardWidth - horizInset); j++) {
        for (var k = vertInset; k < (boardHeight - vertInset); k++) {
            // if is valid:
            if (tempBoard[k][j] == "-") {
                if (isValidMove(j, k, tempBoard)) {
                    // loop through remaining cards
                    for (var i = 0; i < numberOfCardsInGame; i++) {
                        // if is AI player's card (always player 1)
                        if (cardState[i].currentOwner == 1) {
                            // if not placed
                            if (!cardState[i].hasBeenPlaced) {
                                // ### optimisation - don't try this card if a card of this type has already been tried at this position #######################
                                // try card in position:
                                tempBoard[k][j] = i;
                                thisMovesScore = 0;
                                checkAttacksInAllDirections(j, k, tempBoard, cardState, whichOpponentCurrently, whichPlayerCurrently, true);
                                // count flips *1.01 so it favours more aggressive moves
                                thisMovesScore *= 1.01;
                                // insert this into the array in order:
                                listOfPossibleBestMoves = insertNewMove([thisMovesScore, i, j, k], listOfPossibleBestMoves);
                                // just keep track of the 10 best moves:
                                if (listOfPossibleBestMoves.length > 10) {
                                    listOfPossibleBestMoves.pop();
                                }

                                // - try opponent's counter move:
                                // - copy board and cards
                                // - loop through all board tiles
                                // - if is valid
                                // - loop through remaining cards
                                // - try card in position
                                // - count flips *1.0
                                // - return single highest flip score


                                // remove card from this position now it's been tested:
                                tempBoard[k][j] = "-";
                            }
                        }
                    }
                }
            }
        }
    }
    // randomly pick a move based on AI's skill level:
    var pickMoveRange = player2Skill;
    if (pickMoveRange > listOfPossibleBestMoves.length) {
        pickMoveRange = listOfPossibleBestMoves.length - 1;
    }
  
    whichMoveToMake = listOfPossibleBestMoves[Math.floor(Math.random() * pickMoveRange)];
  
}



// -------------------------------------------


function canvasClick(e) {
    var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - outerCanvasLeft;
    var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - outerCanvasTop - pageLoadScroll;
    switch (gameMode) {
        case "play":
            gridX = Math.floor((x / outerCanvasWidth) * boardWidth);
            gridY = Math.floor((y / outerCanvasHeight) * boardHeight);
            var thisBoardRef = board[gridY][gridX];
            if (thisBoardRef == "-") {
                if (currentlySelectedCard != -1) {
                    if (isValidMove(gridX, gridY, board)) {
                        cards[currentlySelectedCard].isMovingToBoard = true;
                        cards[currentlySelectedCard].gridX = gridX;
                        cards[currentlySelectedCard].gridY = gridY;
                        board[gridY][gridX] = currentlySelectedCard;
                        cards[currentlySelectedCard].zIndex = 1;
                        currentlySelectedCard = -1;
                        whoCanClick = currentOpponent;
                    }
                }
            } else if (thisBoardRef != "x") {
                var isValidClick = false;
                if (!(cards[thisBoardRef].hasBeenPlaced)) {
                    if (cards[thisBoardRef].currentOwner == whoCanClick) {
                        isValidClick = true;
                    }
                }
                // stop player clicking if it's the AI's turn:
                if (isPlayer1AI) {
                    if (whoCanClick == 1) {
                        isValidClick = false;
                    }
                }
                if (isValidClick) {
                    currentlySelectedCard = thisBoardRef;
                }

            }
    }
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
            case "gameover":
                console.log("game over");
                break;
        }
    }, (1000 / framesPerSecond));
}

