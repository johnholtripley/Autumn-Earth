// config ----------------------------------------------------





var lastTime = 0;
var elapsed = 0;

var timeSinceLastFrameSwap = 0;
  var animationFramesPerSecond = 16;
   var animationUpdateTime = (1000 / animationFramesPerSecond);




cardGameNameSpace.allCardData = allCardData;
cardGameNameSpace.player1Cards = player1Cards;
cardGameNameSpace.player2Cards = player2Cards;
cardGameNameSpace.player2Skill = player2Skill;






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







function update() {





    if (cardGameNameSpace.waitForDrawUpdate) {
        // wait until after the last draw() has been called so the card is fully placed on the board:
        doAIMove();
        cardGameNameSpace.waitForDrawUpdate = false;
    }
    for (var i = 0; i < cardGameNameSpace.numberOfCardsInGame; i++) {
        if (cardGameNameSpace.cards[i].isMovingToBoard) {
            var targetX = cardGameNameSpace.cards[i].gridX * cardGameNameSpace.cardWidth;
            var targetY = cardGameNameSpace.cards[i].gridY * cardGameNameSpace.cardHeight;
            cardGameNameSpace.cards[i].x -= (cardGameNameSpace.cards[i].x - targetX) * 0.3;
            cardGameNameSpace.cards[i].y -= (cardGameNameSpace.cards[i].y - targetY) * 0.3;
            if (Math.abs(cardGameNameSpace.cards[i].x - targetX) < 10) {
                if (Math.abs(cardGameNameSpace.cards[i].y - targetY) < 10) {
                    // snap in position:
                    cardGameNameSpace.cards[i].isMovingToBoard = false;
                    cardGameNameSpace.cards[i].x = cardGameNameSpace.cards[i].gridX * cardGameNameSpace.cardWidth;
                    cardGameNameSpace.cards[i].y = cardGameNameSpace.cards[i].gridY * cardGameNameSpace.cardHeight;
                    cardGameNameSpace.cards[i].hasBeenPlaced = true;
                    cardGameNameSpace.cards[i].zIndex = 0;
                    checkAttacksInAllDirections(cardGameNameSpace.cards[i].gridX, cardGameNameSpace.cards[i].gridY, cardGameNameSpace.board, cardGameNameSpace.cards, cardGameNameSpace.currentOpponent, cardGameNameSpace.currentPlayersTurn, false);
                    cardGameNameSpace.placedCards++;
                    if (cardGameNameSpace.placedCards == cardGameNameSpace.numberOfCardsInGame) {
                        cardGameNameSpace.gameMode = "gameover";
                        var player1CardsShown = 0;
                        var player2CardsShown = 0;
                        for (var j = 0; j < cardGameNameSpace.numberOfCardsInGame; j++) {
                            if (cardGameNameSpace.cards[j].currentOwner == 1) {
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
                     cardGameNameSpace.oldCurrentPlayersTurn = cardGameNameSpace.currentPlayersTurn;
                    cardGameNameSpace.currentPlayersTurn = cardGameNameSpace.currentOpponent;
                    cardGameNameSpace.currentOpponent = cardGameNameSpace.oldCurrentPlayersTurn;
                    if (cardGameNameSpace.currentPlayersTurn == 1) {
                        if (cardGameNameSpace.isPlayer1AI) {
                            cardGameNameSpace.waitForDrawUpdate = true;

                        }
                    }

                }
            }
        }
    }
    if (cardGameNameSpace.aiIsWorking > 0) {
        cardGameNameSpace.aiIsWorking++;
        // simulate a delay while the AI thinks:
        if (cardGameNameSpace.aiIsWorking > 36) {
            // make move:
            cardGameNameSpace.aiIsWorking = -1;
            cardGameNameSpace.currentlySelectedCard = whichMoveToMake[1];
            cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].isMovingToBoard = true;
            cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].gridX = whichMoveToMake[2];
            cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].gridY = whichMoveToMake[3];
            cardGameNameSpace.board[(whichMoveToMake[3])][(whichMoveToMake[2])] = cardGameNameSpace.currentlySelectedCard;
            cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].zIndex = 1;
            cardGameNameSpace.currentlySelectedCard = -1;
            // player's turn now:
            cardGameNameSpace.whoCanClick = 2;
        }
    }
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

function checkAttacksInAllDirections(checkX, checkY, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking) {
    checkAttack(checkX, checkY, -1, 0, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 1, 0, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 0, -1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 0, 1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, -1, -1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 1, 1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, -1, 1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    checkAttack(checkX, checkY, 1, -1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
}

function checkAttack(placedTileX, placedTileY, xDir, yDir, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking) {
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
                    if (whichCards[thisCheckBoardRef].currentOwner == currentOpponent) {
                        isAnOpponentCard = true;
                        opponentsCardsFound.push(thisCheckBoardRef);
                        var defenseCardType = whichCards[thisCheckBoardRef].cardType;
                        defenceRunningTotal += parseInt(cardGameNameSpace.allCardData[defenseCardType][1]);
                        lineTracedX += xDir;
                        lineTracedY += yDir;
                    }
                }
            }
        }
    } while (isAnOpponentCard);
    var attackCardType = whichCards[(whichBoard[placedTileY][placedTileX])].cardType;
     cardGameNameSpace.placedCardsAttack = parseInt(cardGameNameSpace.allCardData[attackCardType][0]);
    // then check card after is current player's card, not the board edge:
    if (lineTracedY >= 0) {
        if (lineTracedY < cardGameNameSpace.boardHeight) {
            // is numeric?
            if (!(isNaN(whichBoard[lineTracedY][lineTracedX]))) {
                if (whichCards[(whichBoard[lineTracedY][lineTracedX])].currentOwner == currentPlayersTurn) {
                    var existingCardType = whichCards[(whichBoard[lineTracedY][lineTracedX])].cardType;
                    var existingCardsAttack = parseInt(cardGameNameSpace.allCardData[existingCardType][0]);
                    if (cardGameNameSpace.placedCardsAttack + existingCardsAttack >= defenceRunningTotal) {
                        if (isAIChecking) {
                            thisMovesScore += opponentsCardsFound.length;
                         //   console.log("ai test flipping "+opponentsCardsFound.length);
                            for (var i = 0; i < opponentsCardsFound.length; i++) {
                                whichCards[(opponentsCardsFound[i])].currentOwner = currentPlayersTurn;
                            }
                        } else {
                         
                            for (var i = 0; i < opponentsCardsFound.length; i++) {
                                flipCard(opponentsCardsFound[i], whichCards, currentPlayersTurn);
                            }
                        }
                    }
                }
            }
        }
    }
}


function flipCard(cardRef,whichCards,currentPlayersTurn) {
    whichCards[cardRef].currentOwner = currentPlayersTurn;
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
        var thisCardType = cardGameNameSpace.cards[(listOfPossibleBestMoves[(thisGroupsScore[cg])][1])].cardType;
        var thisCardsStrength = parseInt(cardGameNameSpace.allCardData[thisCardType][0]) + parseInt(cardGameNameSpace.allCardData[thisCardType][1]);
        if (thisCardsStrength < lowestGroupScore) {
            lowestGroupScore = thisCardsStrength;
        }
    }
    for (var cg = 0; cg < thisGroupsScore.length; cg++) {
        var thisCardType = cardGameNameSpace.cards[(listOfPossibleBestMoves[(thisGroupsScore[cg])][1])].cardType;
        var thisCardsStrength = parseInt(cardGameNameSpace.allCardData[thisCardType][0]) + parseInt(cardGameNameSpace.allCardData[thisCardType][1]);
        if (thisCardsStrength != lowestGroupScore) {
            indexesToRemove.push(thisGroupsScore[cg]);
        }
    }
    thisGroupsScore = [];
    thisGroupsScore.push(indexToCheck);
}

function doAIMove() {
    console.log("AI thinking...");
    cardGameNameSpace.aiIsWorking = 1;
    findBestMove(cardGameNameSpace.board, cardGameNameSpace.currentPlayersTurn, cardGameNameSpace.cards);
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
                    for (var i = 0; i < cardGameNameSpace.numberOfCardsInGame; i++) {
                        // if is AI player's card (always player 1)
                        if (cardGameNameSpace.cards[i].currentOwner == 1) {
                            // if not placed
                            if (!cardGameNameSpace.cards[i].hasBeenPlaced) {
                                // optimisation - don't try this card if a card of this type has already been tried at this position 
                                if (cardTypesTriedInThisPosition.indexOf(cardGameNameSpace.cards[i].cardType) == -1) {
                                    cardTypesTriedInThisPosition.push(cardGameNameSpace.cards[i].cardType);
                                    // copy arrays so original data isn't changed:
                                    // copy an array of objects: http://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript#answer-23481096
                                    var cardState = [];
                                    for (var p = 0; p < cardGameNameSpace.numberOfCardsInGame; p++) {
                                        cardState[p] = {
                                            index: cardGameNameSpace.cards[p].index,
                                            originalOwner: cardGameNameSpace.cards[p].originalOwner,
                                            hasBeenPlaced: cardGameNameSpace.cards[p].hasBeenPlaced,
                                            cardType: cardGameNameSpace.cards[p].cardType,
                                            currentOwner: cardGameNameSpace.cards[p].currentOwner
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
                                                    for (var o = 0; o < cardGameNameSpace.numberOfCardsInGame; o++) {
                                                        // if is not AI player's card (AI is always player 1)
                                                        if (cardState[o].currentOwner == 2) {
                                                            // if not placed
                                                            if (!cardState[o].hasBeenPlaced) {
                                                                //  optimisation - don't try this card if a card of this type has already been tried at this position 
                                                                if (counterCardTypesTriedInThisPosition.indexOf(cardState[o].cardType) == -1) {
                                                                    counterCardTypesTriedInThisPosition.push(cardState[o].cardType);
                                                                    // copy board and cards:
                                                                    var counterCardState = [];
                                                                    for (var p = 0; p < cardGameNameSpace.numberOfCardsInGame; p++) {
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
    var pickMoveRange = cardGameNameSpace.player2Skill;
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
    var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - cardGameNameSpace.outerCanvasLeft;
    var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - cardGameNameSpace.outerCanvasTop - cardGameNameSpace.pageLoadScroll;
    switch (cardGameNameSpace.gameMode) {
        case "play":
            gridX = Math.floor((x / cardGameNameSpace.outerCanvasWidth) * cardGameNameSpace.boardWidth);
            gridY = Math.floor((y / cardGameNameSpace.outerCanvasHeight) * cardGameNameSpace.boardHeight);
            var thisBoardRef = cardGameNameSpace.board[gridY][gridX];
            if (thisBoardRef == "-") {
                if (cardGameNameSpace.currentlySelectedCard != -1) {
                    if (isValidMove(gridX, gridY, cardGameNameSpace.board)) {
                        cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].isMovingToBoard = true;
                        cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].gridX = gridX;
                        cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].gridY = gridY;
                        cardGameNameSpace.board[gridY][gridX] = cardGameNameSpace.currentlySelectedCard;
                        cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].zIndex = 1;
                        cardGameNameSpace.currentlySelectedCard = -1;
                        cardGameNameSpace.whoCanClick = cardGameNameSpace.currentOpponent;
                    }
                }
            } else if (thisBoardRef != "x") {
                var isValidClick = false;
                if (!(cardGameNameSpace.cards[thisBoardRef].hasBeenPlaced)) {
                    if (cardGameNameSpace.cards[thisBoardRef].currentOwner == cardGameNameSpace.whoCanClick) {
                        isValidClick = true;
                    }
                }
                // stop player clicking if it's the AI's turn:
                if (cardGameNameSpace.isPlayer1AI) {
                    if (cardGameNameSpace.whoCanClick == 1) {
                        isValidClick = false;
                    }
                }
                if (isValidClick) {
                    cardGameNameSpace.currentlySelectedCard = thisBoardRef;
                }

            }
    }
}

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

                update();
                cardGameNameSpace.draw();
                timeSinceLastFrameSwap = 0;
            }
            break;
        case "gameover":
            console.log("game over");
            break;
    }

}


