// core card game code shared between in-game world and standalone card game

// name space the card game code so it doesn't cause conflicts with the core game code:
cardGameNameSpace = {
    'cardWidth': 84,
    'cardHeight': 102,
    'playerColours': ["", "#ffcc00", "#ff00cc"],
    // 'x' = void space
    // '#' = player 1 start position
    // '@' = player 2 start position
    'board': [
        ['#', '#', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', 'x', 'x'],
        ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
        ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
        ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
        ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
        ['x', 'x', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', '@', '@']
    ],

    compareZIndex: function(a, b) {
        if (a.zIndex < b.zIndex)
            return -1;
        if (a.zIndex > b.zIndex)
            return 1;
        return 0;
    },


    initialiseCardGame: function() {

        cardGameNameSpace.allCardsThisGame = cardGameNameSpace.player1Cards.concat(cardGameNameSpace.player2Cards);
        cardGameNameSpace.numberOfCardsInGame = cardGameNameSpace.allCardsThisGame.length;

        // find non-duplicate card types to load:
        cardGameNameSpace.allCardsToLoadThisGame = uniqueValues(cardGameNameSpace.allCardsThisGame);
        cardGameNameSpace.cardGameNameSpace = cardGameNameSpace.allCardsToLoadThisGame.length;

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
        for (var i = 1; i <= cardGameNameSpace.cardGameNameSpace; i++) {
            cardGameNameSpace.imagesToLoad.push({
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
                    cardGameNameSpace.gameContext.drawImage(cardGameNameSpace.cardImages[this.cardType], this.x + offsetX, this.y + offsetY);
                }
            }
        }
        // set up image references:
        cardGameNameSpace.cardImages = [];
        for (var i = 1; i <= cardGameNameSpace.cardGameNameSpace; i++) {
            cardGameNameSpace.cardImages[i] = Loader.getImage("card" + i);
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
                    doAIMove();
                }
            }
        }





    },

    draw:function() {
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
}






};

cardGameNameSpace.boardWidth = cardGameNameSpace.board[0].length;
cardGameNameSpace.boardHeight = cardGameNameSpace.board.length;
