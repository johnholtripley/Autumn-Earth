// config ----------------------------------------------------




framesPerSecond = 24;




allCardsThisGame = player1Cards.concat(player2Cards);
numberOfCardsInGame = allCardsThisGame.length;





// isANetworkGameis defined in card-sockets.js so if not a network game, this won't be set:
if (typeof isANetworkGame === "undefined") {
    isANetworkGame = false;
}




// -----------------------------------------------------------







if ((cutsTheMustard) && (supportsCanvas())) {
    // find non-duplicate card types to load:
    allCardsToLoadThisGame = uniqueValues(allCardsThisGame);
    var numberOfCardTypes = allCardsToLoadThisGame.length;
    var imagesToLoad = [{
        name: "board",
        src: "/images/card-game/board.jpg"
    }, {
        name: "selected",
        src: "/images/card-game/selected-card.png"
    }, {
        name: "current",
        src: "/images/card-game/current-player.png"
    }];
    // build imagesToLoad array dynamically for cards:
    for (var i = 1; i <= numberOfCardTypes; i++) {
        imagesToLoad.push({
            name: "card" + i,
            src: "/images/card-game/cards/" + i + ".png"
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
            currentOwner: (i >= (numberOfCardsInGame / 2) ? 2 : 1),
            draw: function() {
                offsetX = 0;
                offsetY = 0;
                if (this.flippedAnimation > 0) {
                    randomAmount = this.flippedAnimation * 4;
                    offsetX = getRandomIntegerInclusive(0, randomAmount);
                    offsetY = getRandomIntegerInclusive(0, randomAmount);
                    this.flippedAnimation--;
                    if (this.flippedAnimation == 0) {
                        // now finished moving:
                        this.zIndex = 0;
                    }
                }
                gameContext.fillStyle = cardGameNameSpace.playerColours[this.currentOwner];
                gameContext.fillRect(this.x + offsetX, this.y + offsetY, cardGameNameSpace.cardWidth, cardGameNameSpace.cardHeight);
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





    placeCardOnBoard(0, (cardGameNameSpace.boardWidth / 2) - 1, (cardGameNameSpace.boardHeight / 2) - 1, true);
    placeCardOnBoard(1, (cardGameNameSpace.boardWidth / 2), (cardGameNameSpace.boardHeight / 2), true);
    placeCardOnBoard((numberOfCardsInGame / 2), (cardGameNameSpace.boardWidth / 2), (cardGameNameSpace.boardHeight / 2) - 1, true);
    placeCardOnBoard((numberOfCardsInGame / 2) + 1, (cardGameNameSpace.boardWidth / 2) - 1, (cardGameNameSpace.boardHeight / 2), true);
    var player1CardIndexToPlace = 2;
    var player2CardIndexToPlace = (numberOfCardsInGame / 2) + 2;
    for (var j = 0; j < cardGameNameSpace.boardWidth; j++) {
        for (var k = 0; k < cardGameNameSpace.boardHeight; k++) {
            if (cardGameNameSpace.board[k][j] == "#") {
                // player 1 card
                placeCardOnBoard(player1CardIndexToPlace, j, k, false);
                player1CardIndexToPlace++;
            } else if (cardGameNameSpace.board[k][j] == "@") {
                placeCardOnBoard(player2CardIndexToPlace, j, k, false);
                player2CardIndexToPlace++;
            }
        }
    }
    placedCards = 4;







    // for testing ----------------------------------
    /*
    board = [
        ['x', 'x', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', 'x', 'x'],
        ['x', 'x', 'x', 'x', '-', '-', '-', '-', 'x', 'x', 'x', 'x'],
        ['x', 'x', 'x', '-', '-', '-', '-', '-', '-', 'x', 'x', 'x'],
        ['x', 'x', 'x', '-', '-', '-', '-', '-', '-', 'x', 'x', 'x'],
        ['x', 'x', 'x', 'x', '-', '-', '-', '-', 'x', 'x', 'x', 'x'],
        ['x', 'x', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', 'x', 'x']
    ];

       placeCardOnBoard(0, 5, 2, true);
        placeCardOnBoard(1, 6, 2, true);
        placeCardOnBoard(2, 7, 2, true);
        placeCardOnBoard(3, 6, 1, true);
        placeCardOnBoard(4, 7, 3, true);
        placeCardOnBoard(5, 6, 3, true);
        placeCardOnBoard(6, 6, 4, true);
        placeCardOnBoard(7, 7, 4, true);
        placeCardOnBoard(8, 5, 4, true);
       placeCardOnBoard(9, 1, 1, false);
       placeCardOnBoard(10, 6, 0, true);

    placeCardOnBoard(11, 1, 3, false);
    placeCardOnBoard(12, 5, 3, true);
    placeCardOnBoard(13, 4, 4, true);
    placeCardOnBoard(14, 7, 1, true);

    placeCardOnBoard(15, 11, 2, false);
    placeCardOnBoard(16, 11, 3, false);
    placeCardOnBoard(17, 11, 4, false);
    placeCardOnBoard(18, 11, 5, false);
    placeCardOnBoard(19, 10, 2, false);
    placeCardOnBoard(20, 10, 3, false);
    placeCardOnBoard(21, 10, 4, false);
    placeCardOnBoard(22, 10, 1, false);
    placeCardOnBoard(23, 11, 1, false);




      placedCards = 4;
        currentPlayersTurn = 1;
        */
    // testing ----------------------------------


    currentlySelectedCard = -1;
    currentOpponent = 1;
    isPlayer1AI = true;
     aiIsWorking = -1;
        waitForDrawUpdate = false;
    if (isANetworkGame) {
        isPlayer1AI = false;
        // will get the play instruction from the socket when it's determined which player starts first
    } else {
        currentPlayersTurn = getRandomIntegerInclusive(1, 2);
        whoCanClick = currentPlayersTurn;
        gameMode = "play";
       
        if (currentPlayersTurn == 1) {
            currentOpponent = 2;
            if (isPlayer1AI) {
                doAIMove();
            }
        }
    }
}


function placeCardOnBoard(cardRef, gridX, gridY, placedOnGameBoard) {
    cardGameNameSpace.board[gridY][gridX] = cardRef;
    cards[cardRef].x = gridX * cardGameNameSpace.cardWidth;
    cards[cardRef].y = gridY * cardGameNameSpace.cardHeight;
    cards[cardRef].hasBeenPlaced = placedOnGameBoard;
    //  cards[cardRef].boardX = gridX;
    //  cards[cardRef].boardY = gridY;
}


function update() {
    if (waitForDrawUpdate) {
        // wait until after the last draw() has been called so the card is fully placed on the board:
        doAIMove();
        waitForDrawUpdate = false;
    }
    for (var i = 0; i < numberOfCardsInGame; i++) {
        if (cards[i].isMovingToBoard) {
            var targetX = cards[i].gridX * cardGameNameSpace.cardWidth;
            var targetY = cards[i].gridY * cardGameNameSpace.cardHeight;
            cards[i].x -= (cards[i].x - targetX) * 0.3;
            cards[i].y -= (cards[i].y - targetY) * 0.3;
            if (Math.abs(cards[i].x - targetX) < 10) {
                if (Math.abs(cards[i].y - targetY) < 10) {
                    // snap in position:
                    cards[i].isMovingToBoard = false;
                    cards[i].x = cards[i].gridX * cardGameNameSpace.cardWidth;
                    cards[i].y = cards[i].gridY * cardGameNameSpace.cardHeight;
                    cards[i].hasBeenPlaced = true;
                    cards[i].zIndex = 0;
                    checkAttacksInAllDirections(cards[i].gridX, cards[i].gridY, cardGameNameSpace.board, cards, currentOpponent, currentPlayersTurn, false);
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
                            cardGameNameSpace.playerColours[1] = "#665200";
                        } else if (player1CardsShown > player2CardsShown) {
                            cardGameNameSpace.playerColours[2] = "#660052";
                        }
                        draw();
                    }
                    // swap whose go it is:
                    var oldCurrentPlayersTurn = currentPlayersTurn;
                    currentPlayersTurn = currentOpponent;
                    currentOpponent = oldCurrentPlayersTurn;
                    if (currentPlayersTurn == 1) {
                        if (isPlayer1AI) {
                            waitForDrawUpdate = true;

                        }
                    }

                }
            }
        }
    }
    if (aiIsWorking > 0) {
        aiIsWorking++;
        // simulate a delay while the AI thinks:
        if (aiIsWorking > 36) {
            // make move:
            aiIsWorking = -1;
            currentlySelectedCard = whichMoveToMake[1];
            cards[currentlySelectedCard].isMovingToBoard = true;
            cards[currentlySelectedCard].gridX = whichMoveToMake[2];
            cards[currentlySelectedCard].gridY = whichMoveToMake[3];
            cardGameNameSpace.board[(whichMoveToMake[3])][(whichMoveToMake[2])] = currentlySelectedCard;
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
    var cardDrawOrder = cardsCopyForSorting.sort(cardGameNameSpace.compareZIndex);
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
                if (j < cardGameNameSpace.boardHeight) {
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
            if (lineTracedY < cardGameNameSpace.boardHeight) {
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
        if (lineTracedY < cardGameNameSpace.boardHeight) {
            // is numeric?
            if (!(isNaN(whichBoard[lineTracedY][lineTracedX]))) {
                if (whichCards[(whichBoard[lineTracedY][lineTracedX])].currentOwner == whichCurrentPlayersTurn) {
                    var existingCardType = whichCards[(whichBoard[lineTracedY][lineTracedX])].cardType;
                    var existingCardsAttack = parseInt(allCardData[existingCardType][0]);
                    if (placedCardsAttack + existingCardsAttack >= defenceRunningTotal) {
                        if (isAIChecking) {
                            thisMovesScore += opponentsCardsFound.length;
                         //   console.log("ai test flipping "+opponentsCardsFound.length);
                            for (var i = 0; i < opponentsCardsFound.length; i++) {
                                whichCards[(opponentsCardsFound[i])].currentOwner = whichCurrentPlayersTurn;
                            }
                        } else {
                         
                            for (var i = 0; i < opponentsCardsFound.length; i++) {
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

function findLowestScoreInGroup() {
    // run through the previous group and find the lowest power card that can be used for this score:
    var lowestGroupScore = 99999;
    for (var cg = 0; cg < thisGroupsScore.length; cg++) {
        var thisCardType = cards[(listOfPossibleBestMoves[(thisGroupsScore[cg])][1])].cardType;
        var thisCardsStrength = parseInt(allCardData[thisCardType][0]) + parseInt(allCardData[thisCardType][1]);
        if (thisCardsStrength < lowestGroupScore) {
            lowestGroupScore = thisCardsStrength;
        }
    }
    for (var cg = 0; cg < thisGroupsScore.length; cg++) {
        var thisCardType = cards[(listOfPossibleBestMoves[(thisGroupsScore[cg])][1])].cardType;
        var thisCardsStrength = parseInt(allCardData[thisCardType][0]) + parseInt(allCardData[thisCardType][1]);
        if (thisCardsStrength != lowestGroupScore) {
            indexesToRemove.push(thisGroupsScore[cg]);
        }
    }
    thisGroupsScore = [];
    thisGroupsScore.push(indexToCheck);
}

function doAIMove() {
    console.log("AI thinking...");
    aiIsWorking = 1;
    findBestMove(cardGameNameSpace.board, currentPlayersTurn, cards);
}
function findBestMove(boardState, whichPlayerCurrently) {
    whichOpponentCurrently = (whichPlayerCurrently == 1) ? 2 : 1;
    // [best score, card ref, gridx, gridy]:
    listOfPossibleBestMoves = [
        [-999999, -1, -1, -1]
    ];
    var bestImmediatePlayerMove = [];
    // these values might change if the board is vertical - but use them to not include starting grid positions
    var horizInset = 2;
    var vertInset = 0;
    // loop through all board tiles:
    for (var j = horizInset; j < (cardGameNameSpace.boardWidth - horizInset); j++) {
        for (var k = vertInset; k < (cardGameNameSpace.boardHeight - vertInset); k++) {
            // if is valid:
            if (boardState[k][j] == "-") {
                if (isValidMove(j, k, boardState)) {
                    var cardTypesTriedInThisPosition = [];
                    // loop through remaining cards
                    for (var i = 0; i < numberOfCardsInGame; i++) {
                        // if is AI player's card (always player 1)
                        if (cards[i].currentOwner == 1) {
                            // if not placed
                            if (!cards[i].hasBeenPlaced) {
                                // optimisation - don't try this card if a card of this type has already been tried at this position 
                                if (cardTypesTriedInThisPosition.indexOf(cards[i].cardType) == -1) {
                                    cardTypesTriedInThisPosition.push(cards[i].cardType);
                                    // copy arrays so original data isn't changed:
                                    // copy an array of objects: http://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript#answer-23481096
                                    var cardState = [];
                                    for (var p = 0; p < numberOfCardsInGame; p++) {
                                        cardState[p] = {
                                            index: cards[p].index,
                                            originalOwner: cards[p].originalOwner,
                                            hasBeenPlaced: cards[p].hasBeenPlaced,
                                            cardType: cards[p].cardType,
                                            currentOwner: cards[p].currentOwner
                                        }
                                    }
                                    var tempBoard = [];
                                    for (var m = 0; m < boardState.length; m++) {
                                        tempBoard[m] = boardState[m].slice();
                                    }
                                    // try card in position:
                                    tempBoard[k][j] = i;
                                    cardState[i].hasBeenPlaced = true;
                                    thisMovesScore = 0;
                                    //  console.log("placing " + i + " at " + j + ", " + k);
                                    checkAttacksInAllDirections(j, k, tempBoard, cardState, whichOpponentCurrently, whichPlayerCurrently, true);
                                    // count AI flips *1.01 so it favours more aggressive moves         
                                    AIScore = thisMovesScore * 1.01;
                                    // -----------------------------
                                    // - try opponent's counter move:
                                    bestCounterMove = 0;
                                    // keep track of the best player positions so blocking moves can be favoured:
                                    bestCounterMovePositions = [];
                                    // swap whose go it is:
                                    whichCounterPlayerCurrently = whichOpponentCurrently;
                                    whichCounterOpponentCurrently = whichPlayerCurrently;
                                    for (var l = horizInset; l < (cardGameNameSpace.boardWidth - horizInset); l++) {
                                        for (var m = vertInset; m < (cardGameNameSpace.boardHeight - vertInset); m++) {
                                            // if is valid:
                                            if (tempBoard[m][l] == "-") {
                                                if (isValidMove(l, m, tempBoard)) {
                                                    var counterCardTypesTriedInThisPosition = [];
                                                    // loop through remaining cards
                                                    for (var o = 0; o < numberOfCardsInGame; o++) {
                                                        // if is not AI player's card (AI is always player 1)
                                                        if (cardState[o].currentOwner == 2) {
                                                            // if not placed
                                                            if (!cardState[o].hasBeenPlaced) {
                                                                //  optimisation - don't try this card if a card of this type has already been tried at this position 
                                                                if (counterCardTypesTriedInThisPosition.indexOf(cardState[o].cardType) == -1) {
                                                                    counterCardTypesTriedInThisPosition.push(cardState[o].cardType);
                                                                    // copy board and cards:
                                                                    var counterCardState = [];
                                                                    for (var p = 0; p < numberOfCardsInGame; p++) {
                                                                        counterCardState[p] = {
                                                                            index: cardState[p].index,
                                                                            originalOwner: cardState[p].originalOwner,
                                                                            hasBeenPlaced: cardState[p].hasBeenPlaced,
                                                                            cardType: cardState[p].cardType,
                                                                            currentOwner: cardState[p].currentOwner
                                                                        }
                                                                    }
                                                                    var counterTempBoard = [];
                                                                    for (var p = 0; p < tempBoard.length; p++) {
                                                                        counterTempBoard[p] = tempBoard[p].slice();
                                                                    }
                                                                    // try card in position:
                                                                    counterTempBoard[m][l] = o;
                                                                    counterCardState[o].hasBeenPlaced = true;
                                                                    thisMovesScore = 0;
                                                                    checkAttacksInAllDirections(l, m, counterTempBoard, counterCardState, whichCounterOpponentCurrently, whichCounterPlayerCurrently, true);
                                                                    if (thisMovesScore > bestCounterMove) {
                                                                        bestCounterMove = thisMovesScore;
                                                                        bestCounterMovePositions = [l + "," + m];
                                                                    } else if (thisMovesScore == bestCounterMove) {
                                                                        bestCounterMovePositions.push(l + "," + m);
                                                                    }
                                                                    // console.log("this counter card at "+l+","+m+" can flip "+thisMovesScore+" cards");
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    // ... of end counter move analysis
                                    // -----------------------------
                                    thisMovesScore = AIScore - bestCounterMove;
                                    //   console.log("ai this round is " + AIScore + " with player countering with " + bestCounterMove + " (=" + (AIScore - bestCounterMove) + ")");
                                    // insert this into the array in order:
                                    listOfPossibleBestMoves = insertNewMove([thisMovesScore, i, j, k], listOfPossibleBestMoves);
                                    // just keep track of the 10 best moves:
                                    if (listOfPossibleBestMoves.length > 10) {
                                        listOfPossibleBestMoves.pop();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // remove the false entry if it's still in the list:
    if (listOfPossibleBestMoves[(listOfPossibleBestMoves.length - 1)][0] == -999999) {
        listOfPossibleBestMoves.pop();
    }
    // loop through the results and if any moves correspond to good blocking positions, then increase the score slightly for those:
    for (var blockMoveCheck = 0; blockMoveCheck < listOfPossibleBestMoves.length; blockMoveCheck++) {
        var thisMovesPosition = listOfPossibleBestMoves[blockMoveCheck][2] + "," + listOfPossibleBestMoves[blockMoveCheck][3];
        if (bestCounterMovePositions.indexOf(thisMovesPosition) != -1) {
            // is a blocking move:
            listOfPossibleBestMoves[blockMoveCheck][0] += 0.001;
        }
    }
    // resort the array now based on the move's score:
    listOfPossibleBestMoves.sort(sortByHighestValue);
    // look through the results to make sure a powerful card isn't used when a less powerful one will achieve the same result:
    // [best score, card ref, gridx, gridy]:
    indexToCheck = 0;
    var previousMovesScore = listOfPossibleBestMoves[indexToCheck][0];
    thisGroupsScore = [];
    indexesToRemove = [];
    do {
        //    console.log("checking: " + listOfPossibleBestMoves[indexToCheck]);
        // group cards together by move score:
        var thisCheckMovesScore = listOfPossibleBestMoves[indexToCheck][0];
        if (thisCheckMovesScore == previousMovesScore) {
            thisGroupsScore.push(indexToCheck);
        } else {
            findLowestScoreInGroup();
        }
        previousMovesScore = thisCheckMovesScore;
        indexToCheck++;
    }
    while (indexToCheck < listOfPossibleBestMoves.length);
    if (thisGroupsScore.length == listOfPossibleBestMoves.length) {
        // this won't have been called if all scores were the same
        findLowestScoreInGroup();
    }
    //  console.log("removing: "+indexesToRemove.join(", "));
    for (var ir = indexesToRemove.length - 1; ir >= 0; ir--) {
        listOfPossibleBestMoves.splice((indexesToRemove[ir]), 1);
    }
    console.log(listOfPossibleBestMoves);
    // randomly pick a move based on AI's skill level:
    var pickMoveRange = player2Skill;
    // check to see if any moves have the same score as the best move - and use these as well so the higher skill AI doesn't just pick the same move every time:
    var indexToUse = 0;
    do {
        indexToUse++;
        if (indexToUse == listOfPossibleBestMoves.length) {
            break;
        }
    } while (listOfPossibleBestMoves[indexToUse][0] == listOfPossibleBestMoves[0][0]);
    if (indexToUse > pickMoveRange) {
        pickMoveRange = indexToUse;
    }
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
            gridX = Math.floor((x / outerCanvasWidth) * cardGameNameSpace.boardWidth);
            gridY = Math.floor((y / outerCanvasHeight) * cardGameNameSpace.boardHeight);
            var thisBoardRef = cardGameNameSpace.board[gridY][gridX];
            if (thisBoardRef == "-") {
                if (currentlySelectedCard != -1) {
                    if (isValidMove(gridX, gridY, cardGameNameSpace.board)) {
                        cards[currentlySelectedCard].isMovingToBoard = true;
                        cards[currentlySelectedCard].gridX = gridX;
                        cards[currentlySelectedCard].gridY = gridY;
                        cardGameNameSpace.board[gridY][gridX] = currentlySelectedCard;
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

