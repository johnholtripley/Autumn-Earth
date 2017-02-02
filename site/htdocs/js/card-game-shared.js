// core card game code shared between in-game world and standalone card game

// name space the card game code so it doesn't cause conflicts with the core game code:
cardGameNameSpace = {
    'cardWidth': 84,
    'cardHeight': 102,
    

    'board': [    ],

    compareZIndex: function(a, b) {
        if (a.zIndex < b.zIndex)
            return -1;
        if (a.zIndex > b.zIndex)
            return 1;
        return 0;
    },

    compareColours: function(hex1,hex2) {
        var r1 = parseInt(hex1.substring(1,3), 16);
        var g1 = parseInt(hex1.substring(3,5), 16);
        var b1 = parseInt(hex1.substring(5,7), 16);

          var r2 = parseInt(hex2.substring(1,3), 16);
        var g2 = parseInt(hex2.substring(3,5), 16);
        var b2 = parseInt(hex2.substring(5,7), 16);
  
return ((r1 - r2)*(r1 - r2)) + ((g1 - g2)*(g1 - g2)) + ((b1 - b2)*(b1 - b2));
    },

    initialiseCardGame: function() {

    // 'x' = void space
    // '#' = player 1 start position
    // '@' = player 2 start position
    cardGameNameSpace.board = [
        ['#', '#', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', 'x', 'x'],
        ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
        ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
        ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
        ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
        ['x', 'x', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', '@', '@']
    ];

cardGameNameSpace.boardWidth = cardGameNameSpace.board[0].length;
cardGameNameSpace.boardHeight = cardGameNameSpace.board.length;
cardGameNameSpace.maxCardAnimationFrames = 10;
cardGameNameSpace.playerColours= ["", "#36bbed", "#ff00cc"];


if (typeof playersCardBack !== "undefined") {
   cardGameNameSpace.playerColours[2] =  playersCardBack;
}
if (typeof cardGameNameSpace.NPCCardBackColour !== "undefined") {
   cardGameNameSpace.playerColours[1] =  cardGameNameSpace.NPCCardBackColour;
}

// check how similar the colours are:
// http://stackoverflow.com/questions/1633828/distance-between-colours-in-php/1634206#1634206


if (cardGameNameSpace.compareColours(cardGameNameSpace.playerColours[1], cardGameNameSpace.playerColours[2]) < 3500) {


    do {
        // https://www.paulirish.com/2009/random-hex-color-code-snippets/
    var randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16);
 
} while (cardGameNameSpace.compareColours(randomHex, cardGameNameSpace.playerColours[2]) < 3501); 
    // too similar - change NPC's value:
    cardGameNameSpace.playerColours[1] = randomHex;
    if (thisNPC) {
        // save this for future games:
        thisNPC.cardBackColour = cardGameNameSpace.playerColours[1];
    }

}


        cardGameNameSpace.allCardsThisGame = cardGameNameSpace.player1Cards.concat(cardGameNameSpace.player2Cards);
        cardGameNameSpace.numberOfCardsInGame = cardGameNameSpace.allCardsThisGame.length;
        // find non-duplicate card types to load:
        cardGameNameSpace.allCardsToLoadThisGame = uniqueValues(cardGameNameSpace.allCardsThisGame);
        cardGameNameSpace.numberOfCardTypes = cardGameNameSpace.allCardsToLoadThisGame.length;



        // isANetworkGameis defined in card-sockets.js so if not a network game, this won't be set:
        if (typeof isCardGameANetworkGame === "undefined") {
            isCardGameANetworkGame = false;
        }

        cardGameNameSpace.imagesToLoad = [{
            name: "board",
            src: "/images/card-game/board.jpg"
        }, {
            name: "selected",
            src: "/images/card-game/selected-card.png"
        }, {
            name: "current",
            src: "/images/card-game/current-player.png"
        }];
        // build cardGameNameSpace.imagesToLoad array dynamically for cards:
       
        for (var i = 0; i < cardGameNameSpace.numberOfCardTypes; i++) {
           
            cardGameNameSpace.imagesToLoad.push({
                name: "card" + cardGameNameSpace.allCardsToLoadThisGame[i],
                src: "/images/card-game/cards/" + cardGameNameSpace.allCardsToLoadThisGame[i] + ".png"
            });
        }
        // click handler:
        document.getElementById("cardGame").addEventListener("click",  cardGameNameSpace.canvasClick, false);

        cardGameNameSpace.gameMode = "loading";
        // gameLoop();
        // preload all images:
        Loader.preload(cardGameNameSpace.imagesToLoad, cardGameNameSpace.initCardGame, loadingProgress);
    },

    getCanvasPosition: function() {
        var canvasElemCoords = document.getElementById("cardGame").getBoundingClientRect();
        cardGameNameSpace.outerCanvasLeft = canvasElemCoords.left;
        cardGameNameSpace.outerCanvasTop = canvasElemCoords.top;
        cardGameNameSpace.outerCanvasWidth = canvasElemCoords.right - canvasElemCoords.left;
        cardGameNameSpace.outerCanvasHeight = canvasElemCoords.bottom - canvasElemCoords.top;
        cardGameNameSpace.pageLoadScroll = document.body.scrollTop + document.documentElement.scrollTop;
        // console.log("canvas at " + cardGameNameSpace.outerCanvasLeft + ", " + cardGameNameSpace.outerCanvasTop + " at " + cardGameNameSpace.pageLoadScroll + " - " + outercardGameNameSpace.canvasWidth + " x " + outercardGameNameSpace.canvasHeight);
    },

    placeCardOnBoard: function(cardRef, gridX, gridY, placedOnGameBoard) {
        cardGameNameSpace.board[gridY][gridX] = cardRef;
        cardGameNameSpace.cards[cardRef].x = gridX * cardGameNameSpace.cardWidth;
        cardGameNameSpace.cards[cardRef].y = gridY * cardGameNameSpace.cardHeight;
        cardGameNameSpace.cards[cardRef].hasBeenPlaced = placedOnGameBoard;
        //  cards[cardRef].boardX = gridX;
        //  cards[cardRef].boardY = gridY;
    },

    checkAttacksInAllDirections: function(checkX, checkY, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking) {
        cardGameNameSpace.checkAttack(checkX, checkY, -1, 0, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
        cardGameNameSpace.checkAttack(checkX, checkY, 1, 0, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
        cardGameNameSpace.checkAttack(checkX, checkY, 0, -1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
        cardGameNameSpace.checkAttack(checkX, checkY, 0, 1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
        cardGameNameSpace.checkAttack(checkX, checkY, -1, -1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
        cardGameNameSpace.checkAttack(checkX, checkY, 1, 1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
        cardGameNameSpace.checkAttack(checkX, checkY, -1, 1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
        cardGameNameSpace.checkAttack(checkX, checkY, 1, -1, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking);
    },

    checkAttack: function(placedTileX, placedTileY, xDir, yDir, whichBoard, whichCards, currentOpponent, currentPlayersTurn, isAIChecking) {
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
                            var defenseCardType = Math.abs(whichCards[thisCheckBoardRef].cardType);
                            defenceRunningTotal += parseInt(cardGameNameSpace.allCardData[defenseCardType][1]);
                            lineTracedX += xDir;
                            lineTracedY += yDir;
                        }
                    }
                }
            }
        } while (isAnOpponentCard);
        var attackCardType = Math.abs(whichCards[(whichBoard[placedTileY][placedTileX])].cardType);
        cardGameNameSpace.placedCardsAttack = parseInt(cardGameNameSpace.allCardData[attackCardType][0]);
        // then check card after is current player's card, not the board edge:
        if (lineTracedY >= 0) {
            if (lineTracedY < cardGameNameSpace.boardHeight) {
                // is numeric?
                if (!(isNaN(whichBoard[lineTracedY][lineTracedX]))) {
                    if (whichCards[(whichBoard[lineTracedY][lineTracedX])].currentOwner == currentPlayersTurn) {
                        var existingCardType = Math.abs(whichCards[(whichBoard[lineTracedY][lineTracedX])].cardType);
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
                                    cardGameNameSpace.flipCard(opponentsCardsFound[i], whichCards, currentPlayersTurn);
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    flipCard: function(cardRef, whichCards, currentPlayersTurn) {
        whichCards[cardRef].currentOwner = currentPlayersTurn;
        whichCards[cardRef].flippedAnimation = 10;
        whichCards[cardRef].zIndex = 1;
        if(currentPlayersTurn == 2) {
             hero.stats.numberOfcardsFlipped ++;
        }
    },

    canvasClick: function(e) {
           if (e) {
                e.preventDefault();
            }
        var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - cardGameNameSpace.outerCanvasLeft;
        var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - cardGameNameSpace.outerCanvasTop - cardGameNameSpace.pageLoadScroll;
        switch (gameMode) {
            case "play":
            case "cardGame":
                gridX = Math.floor((x / cardGameNameSpace.outerCanvasWidth) * cardGameNameSpace.boardWidth);
                gridY = Math.floor((y / cardGameNameSpace.outerCanvasHeight) * cardGameNameSpace.boardHeight);
                var thisBoardRef = cardGameNameSpace.board[gridY][gridX];
                if (thisBoardRef == "-") {
                    if (cardGameNameSpace.currentlySelectedCard != -1) {
                        if (cardGameNameSpace.isValidMove(gridX, gridY, cardGameNameSpace.board)) {
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
    },

    findBestMove: function(boardState, whichPlayerCurrently) {
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
                    if (cardGameNameSpace.isValidMove(j, k, boardState)) {
                        var cardTypesTriedInThisPosition = [];
                        // loop through remaining cards
                        for (var i = 0; i < cardGameNameSpace.numberOfCardsInGame; i++) {
                            // if is AI player's card (always player 1)
                            if (cardGameNameSpace.cards[i].currentOwner == 1) {
                                // if not placed
                                if (!cardGameNameSpace.cards[i].hasBeenPlaced) {
                                    // optimisation - don't try this card if a card of this type has already been tried at this position 
                                    if (cardTypesTriedInThisPosition.indexOf(Math.abs(cardGameNameSpace.cards[i].cardType)) == -1) {
                                        cardTypesTriedInThisPosition.push(Math.abs(cardGameNameSpace.cards[i].cardType));
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
                                        cardGameNameSpace.checkAttacksInAllDirections(j, k, tempBoard, cardState, whichOpponentCurrently, whichPlayerCurrently, true);
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
                                                    if (cardGameNameSpace.isValidMove(l, m, tempBoard)) {
                                                        var counterCardTypesTriedInThisPosition = [];
                                                        // loop through remaining cards
                                                        for (var o = 0; o < cardGameNameSpace.numberOfCardsInGame; o++) {
                                                            // if is not AI player's card (AI is always player 1)
                                                            if (cardState[o].currentOwner == 2) {
                                                                // if not placed
                                                                if (!cardState[o].hasBeenPlaced) {
                                                                    //  optimisation - don't try this card if a card of this type has already been tried at this position 
                                                                    if (counterCardTypesTriedInThisPosition.indexOf(Math.abs(cardState[o].cardType)) == -1) {
                                                                        counterCardTypesTriedInThisPosition.push(Math.abs(cardState[o].cardType));
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
                                                                        cardGameNameSpace.checkAttacksInAllDirections(l, m, counterTempBoard, counterCardState, whichCounterOpponentCurrently, whichCounterPlayerCurrently, true);
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
                                        listOfPossibleBestMoves = cardGameNameSpace.insertNewMove([thisMovesScore, i, j, k], listOfPossibleBestMoves);
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
        cardGameNameSpace.thisGroupsScore = [];
        indexesToRemove = [];
        do {
            //    console.log("checking: " + listOfPossibleBestMoves[indexToCheck]);
            // group cards together by move score:
            var thisCheckMovesScore = listOfPossibleBestMoves[indexToCheck][0];
            if (thisCheckMovesScore == previousMovesScore) {
                cardGameNameSpace.thisGroupsScore.push(indexToCheck);
            } else {
                cardGameNameSpace.findLowestScoreInGroup();
            }
            previousMovesScore = thisCheckMovesScore;
            indexToCheck++;
        }
        while (indexToCheck < listOfPossibleBestMoves.length);
        if (cardGameNameSpace.thisGroupsScore.length == listOfPossibleBestMoves.length) {
            // this won't have been called if all scores were the same
            cardGameNameSpace.findLowestScoreInGroup();
        }
        //  console.log("removing: "+indexesToRemove.join(", "));
        for (var ir = indexesToRemove.length - 1; ir >= 0; ir--) {
            listOfPossibleBestMoves.splice((indexesToRemove[ir]), 1);
        }
        //console.log(listOfPossibleBestMoves);
        // randomly pick a move based on AI's skill level:
        var pickMoveRange = cardGameNameSpace.player1Skill;
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
    },

    insertNewMove: function(element, array) {
        array.splice(cardGameNameSpace.locationOfBestScores(element, array) + 1, 0, element);
        return array;
    },

    locationOfBestScores: function(element, array, start, end) {
        start = start || 0;
        end = end || array.length;
        var pivot = parseInt(start + (end - start) / 2, 10);
        if (array[pivot][0] === element[0]) return pivot;
        if (end - start <= 1)
            return array[pivot][0] < element[0] ? pivot - 1 : pivot;
        if (array[pivot][0] > element[0]) {
            return cardGameNameSpace.locationOfBestScores(element, array, pivot, end);
        } else {
            return cardGameNameSpace.locationOfBestScores(element, array, start, pivot);
        }
    },

    findLowestScoreInGroup: function() {
        // run through the previous group and find the lowest power card that can be used for this score:
        var lowestGroupScore = 99999;
        for (var cg = 0; cg < cardGameNameSpace.thisGroupsScore.length; cg++) {
            var thisCardType = Math.abs(cardGameNameSpace.cards[(listOfPossibleBestMoves[(cardGameNameSpace.thisGroupsScore[cg])][1])].cardType);
            var thisCardsStrength = parseInt(cardGameNameSpace.allCardData[thisCardType][0]) + parseInt(cardGameNameSpace.allCardData[thisCardType][1]);
            if (thisCardsStrength < lowestGroupScore) {
                lowestGroupScore = thisCardsStrength;
            }
        }
        for (var cg = 0; cg < cardGameNameSpace.thisGroupsScore.length; cg++) {
            var thisCardType = Math.abs(cardGameNameSpace.cards[(listOfPossibleBestMoves[(cardGameNameSpace.thisGroupsScore[cg])][1])].cardType);
            var thisCardsStrength = parseInt(cardGameNameSpace.allCardData[thisCardType][0]) + parseInt(cardGameNameSpace.allCardData[thisCardType][1]);
            if (thisCardsStrength != lowestGroupScore) {
                indexesToRemove.push(cardGameNameSpace.thisGroupsScore[cg]);
            }
        }
        cardGameNameSpace.thisGroupsScore = [];
        cardGameNameSpace.thisGroupsScore.push(indexToCheck);
    },

    initCardGame: function() {
   
        cardGameNameSpace.getCanvasPosition();
        cardGameNameSpace.gameCanvas = document.getElementById("cardGame");
        if (cardGameNameSpace.gameCanvas.getContext) {
            cardGameNameSpace.gameContext = cardGameNameSpace.gameCanvas.getContext('2d');
            cardGameNameSpace.canvasWidth = cardGameNameSpace.gameCanvas.width;
            cardGameNameSpace.canvasHeight = cardGameNameSpace.gameCanvas.height;
        }
        cardGameNameSpace.cards = [];
        for (var i = 0; i < cardGameNameSpace.numberOfCardsInGame; i++) {
            cardGameNameSpace.cards[i] = {
                x: -100,
                y: -100,
                index: i,
                //   boardX: -1,
                //   boardY: -1,
                zIndex: 0,
                flippedAnimation: 0,
                animationSequence: 0,
                isMovingToBoard: false,
                originalOwner: (i >= (cardGameNameSpace.numberOfCardsInGame / 2) ? 2 : 1),
                hasBeenPlaced: false,
                cardType: cardGameNameSpace.allCardsThisGame[i],
                currentOwner: (i >= (cardGameNameSpace.numberOfCardsInGame / 2) ? 2 : 1),
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
                    cardGameNameSpace.gameContext.fillStyle = cardGameNameSpace.playerColours[this.currentOwner];
                    cardGameNameSpace.gameContext.fillRect(this.x + offsetX, this.y + offsetY, cardGameNameSpace.cardWidth, cardGameNameSpace.cardHeight);
                  if(this.cardType>0) {
                    cardGameNameSpace.gameContext.drawImage(cardGameNameSpace.cardImages[this.cardType], this.x + offsetX, this.y + offsetY);
                } else {
                    // sprite sheet:
                    cardGameNameSpace.gameContext.drawImage(cardGameNameSpace.cardImages[this.cardType], cardGameNameSpace.cardWidth * this.animationSequence, 0, cardGameNameSpace.cardWidth, cardGameNameSpace.cardHeight, this.x + offsetX, this.y + offsetY, cardGameNameSpace.cardWidth, cardGameNameSpace.cardHeight);
                    this.animationSequence ++;
                    if(this.animationSequence>cardGameNameSpace.maxCardAnimationFrames) {
this.animationSequence = 0;
                    }
                }
                }
            }
        }
        // set up image references:
        cardGameNameSpace.cardImages = [];
        for (var i = 0; i < cardGameNameSpace.numberOfCardTypes; i++) {
            cardGameNameSpace.cardImages[(cardGameNameSpace.allCardsToLoadThisGame[i])] = Loader.getImage("card" + (cardGameNameSpace.allCardsToLoadThisGame[i]));
        }
        cardGameNameSpace.boardImage = Loader.getImage("board");
        cardGameNameSpace.currentCardSelectedImage = Loader.getImage("selected");
        cardGameNameSpace.currentCardSelected = {
            draw: function() {
                if (cardGameNameSpace.currentlySelectedCard != -1) {
                    cardGameNameSpace.gameContext.drawImage(cardGameNameSpace.currentCardSelectedImage, cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].x - 20, cardGameNameSpace.cards[cardGameNameSpace.currentlySelectedCard].y - 20);
                }
            }
        }
        cardGameNameSpace.currentPlayerMarkerImage = Loader.getImage("current");
        cardGameNameSpace.currentPlayerMarker = {
            xScale: 1,
            increment: -0.05,
            draw: function() {
                // http://codetheory.in/canvas-rotating-and-scaling-images-around-a-particular-point/
                this.xScale += this.increment;
                if (Math.abs(this.xScale) > 1) {
                    this.increment *= -1;
                }
                cardGameNameSpace.gameContext.save();
                this.x = (cardGameNameSpace.currentPlayersTurn == 1 ? 84 : 925);
                cardGameNameSpace.gameContext.translate(this.x, 20);
                cardGameNameSpace.gameContext.scale(this.xScale, 1);
                cardGameNameSpace.gameContext.drawImage(cardGameNameSpace.currentPlayerMarkerImage, (0 - ((cardGameNameSpace.currentPlayerMarkerImage.width) / 2)), 0);
                cardGameNameSpace.gameContext.restore();
            }
        }

        cardGameNameSpace.placeCardOnBoard(0, (cardGameNameSpace.boardWidth / 2) - 1, (cardGameNameSpace.boardHeight / 2) - 1, true);
        cardGameNameSpace.placeCardOnBoard(1, (cardGameNameSpace.boardWidth / 2), (cardGameNameSpace.boardHeight / 2), true);
        cardGameNameSpace.placeCardOnBoard((cardGameNameSpace.numberOfCardsInGame / 2), (cardGameNameSpace.boardWidth / 2), (cardGameNameSpace.boardHeight / 2) - 1, true);
        cardGameNameSpace.placeCardOnBoard((cardGameNameSpace.numberOfCardsInGame / 2) + 1, (cardGameNameSpace.boardWidth / 2) - 1, (cardGameNameSpace.boardHeight / 2), true);
        cardGameNameSpace.player1CardIndexToPlace = 2;
        cardGameNameSpace.player2CardIndexToPlace = (cardGameNameSpace.numberOfCardsInGame / 2) + 2;
        for (var j = 0; j < cardGameNameSpace.boardWidth; j++) {
            for (var k = 0; k < cardGameNameSpace.boardHeight; k++) {
                if (cardGameNameSpace.board[k][j] == "#") {
                    // player 1 card
                    cardGameNameSpace.placeCardOnBoard(cardGameNameSpace.player1CardIndexToPlace, j, k, false);
                    cardGameNameSpace.player1CardIndexToPlace++;
                } else if (cardGameNameSpace.board[k][j] == "@") {
                    cardGameNameSpace.placeCardOnBoard(cardGameNameSpace.player2CardIndexToPlace, j, k, false);
                    cardGameNameSpace.player2CardIndexToPlace++;
                }
            }
        }
        cardGameNameSpace.placedCards = 4;

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




          cardGameNameSpace.placedCards = 4;
            cardGameNameSpace.currentPlayersTurn = 1;
            */
        // testing ----------------------------------


        cardGameNameSpace.currentlySelectedCard = -1;
        cardGameNameSpace.currentOpponent = 1;
        cardGameNameSpace.isPlayer1AI = true;
        cardGameNameSpace.aiIsWorking = -1;
        cardGameNameSpace.waitForDrawUpdate = false;
        if (isCardGameANetworkGame) {
            cardGameNameSpace.isPlayer1AI = false;
            // will get the play instruction from the socket when it's determined which player starts first
        } else {
            cardGameNameSpace.currentPlayersTurn = getRandomIntegerInclusive(1, 2);
            cardGameNameSpace.whoCanClick = cardGameNameSpace.currentPlayersTurn;
            cardGameNameSpace.gameMode = "play";
            gameMode = "cardGame";
            if (cardGameNameSpace.currentPlayersTurn == 1) {
                cardGameNameSpace.currentOpponent = 2;
                if (cardGameNameSpace.isPlayer1AI) {
                    cardGameNameSpace.doAIMove();
                }
            }

        }
      
    },

    draw: function() {
        //  cardGameNameSpace.gameContext.clearRect(0, 0, cardGameNameSpace.canvasWidth, cardGameNameSpace.canvasHeight);
        // place board:
       
        cardGameNameSpace.gameContext.drawImage(cardGameNameSpace.boardImage, 0, 0);
        // get card indexes sorted by zindex:
        var cardsCopyForSorting = cardGameNameSpace.cards.slice();
        var cardDrawOrder = cardsCopyForSorting.sort(cardGameNameSpace.compareZIndex);
        for (var i = 0; i < cardGameNameSpace.numberOfCardsInGame; i++) {
            cardGameNameSpace.cards[(cardDrawOrder[i].index)].draw();
        }
        cardGameNameSpace.currentCardSelected.draw();
        cardGameNameSpace.currentPlayerMarker.draw();
         
    },

    isValidMove: function(checkX, checkY, whichBoard) {
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
    },

    update: function() {
        if (cardGameNameSpace.waitForDrawUpdate) {
            // wait until after the last draw() has been called so the card is fully placed on the board:
            cardGameNameSpace.doAIMove();
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
                        cardGameNameSpace.checkAttacksInAllDirections(cardGameNameSpace.cards[i].gridX, cardGameNameSpace.cards[i].gridY, cardGameNameSpace.board, cardGameNameSpace.cards, cardGameNameSpace.currentOpponent, cardGameNameSpace.currentPlayersTurn, false);
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
                                cardGamePlayer2Wins();
                            } else if (player1CardsShown > player2CardsShown) {
                                cardGameNameSpace.playerColours[2] = "#660052";
                                cardGamePlayer1Wins();
                            } else {
                                cardGameIsDrawn();
                            }
                            cardGameNameSpace.draw();
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
    },

    doAIMove: function() {
       // console.log("AI thinking...");
        cardGameNameSpace.aiIsWorking = 1;
        cardGameNameSpace.findBestMove(cardGameNameSpace.board, cardGameNameSpace.currentPlayersTurn, cardGameNameSpace.cards);
    }
};






