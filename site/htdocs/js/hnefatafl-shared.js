'use strict';
// core game code shared between in-game world and standalone game

// name space the game code so it doesn't cause conflicts with the game code:
var hnefataflNameSpace = {
    'squareSize': 62,
    'boardInset': 28,
    'pieceGraphicalOffset': 12,
    'originalWidth': 612,
    'highlightSquare': [],
    'board': [],
    'animatingPieces': {},
    'pieceSpeed': 28,

    initialisehnefataflGame: function() {

        // '0' = empty space
        // 'b' = black start position
        // 'W' = (white) king start position
        // 'w' = white start position
        hnefataflNameSpace.board = [
            ['0', '0', '0', 'b', 'b', 'b', '0', '0', '0'],
            ['0', '0', '0', '0', 'b', '0', '0', '0', '0'],
            ['0', '0', '0', '0', 'w', '0', '0', '0', '0'],
            ['b', '0', '0', '0', 'w', '0', '0', '0', 'b'],
            ['b', 'b', 'w', 'w', 'W', 'w', 'w', 'b', 'b'],
            ['b', '0', '0', '0', 'w', '0', '0', '0', 'b'],
            ['0', '0', '0', '0', 'w', '0', '0', '0', '0'],
            ['0', '0', '0', '0', 'b', '0', '0', '0', '0'],
            ['0', '0', '0', 'b', 'b', 'b', '0', '0', '0']

        ];

        hnefataflNameSpace.boardWidth = hnefataflNameSpace.board[0].length;
        hnefataflNameSpace.boardHeight = hnefataflNameSpace.board.length;

        hnefataflNameSpace.imagesToLoad = [{
                name: "board",
                src: "/images/hnefatafl/board.jpg"
            }, {
                name: "highlight",
                src: "/images/hnefatafl/highlight.png"
            },
            {
                name: "active-white",
                src: "/images/hnefatafl/active-player-white.png"
            },
            {
                name: "active-black",
                src: "/images/hnefatafl/active-player-black.png"
            },
            {
                name: "white-piece",
                src: "/images/hnefatafl/white-piece.png"
            }, {
                name: "black-piece",
                src: "/images/hnefatafl/black-piece.png"
            },
            {
                name: "king",
                src: "/images/hnefatafl/king.png"
            }
        ];

        // click handler:
        document.getElementById("hnefataflGame").addEventListener("click", hnefataflNameSpace.canvasClick, false);

        hnefataflNameSpace.gameMode = "loading";
        // preload all images:
        Loader.preload(hnefataflNameSpace.imagesToLoad, hnefataflNameSpace.initCardGame, loadingProgress);
    },

    getTilePosition: function(tilePosition) {
        return (tilePosition * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset;
    },

    getCanvasPosition: function() {
        var canvasElemCoords = document.getElementById("hnefataflGame").getBoundingClientRect();
        hnefataflNameSpace.outerCanvasLeft = canvasElemCoords.left;
        hnefataflNameSpace.outerCanvasTop = canvasElemCoords.top;
        hnefataflNameSpace.outerCanvasWidth = canvasElemCoords.right - canvasElemCoords.left;
        hnefataflNameSpace.scale = hnefataflNameSpace.originalWidth / hnefataflNameSpace.outerCanvasWidth;
        // hnefataflNameSpace.outerCanvasHeight = canvasElemCoords.bottom - canvasElemCoords.top;
        hnefataflNameSpace.outerCanvasHeight = hnefataflNameSpace.outerCanvasWidth;
        hnefataflNameSpace.pageLoadScroll = document.body.scrollTop + document.documentElement.scrollTop;
    },

    canvasClick: function(e) {
        if (e) {
            e.preventDefault();
        }
        var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - hnefataflNameSpace.pageLoadScroll;
        switch (hnefataflNameSpace.gameMode) {
            case "play":
            case "hnefataflGame":

                var positionOnCanvasX = x - hnefataflNameSpace.outerCanvasLeft;
                var positionOnCanvasY = y - hnefataflNameSpace.outerCanvasTop;

                var tileX = Math.floor(((hnefataflNameSpace.scale * positionOnCanvasX) - hnefataflNameSpace.boardInset) / hnefataflNameSpace.squareSize);
                var tileY = Math.floor(((hnefataflNameSpace.scale * positionOnCanvasY) - hnefataflNameSpace.boardInset) / hnefataflNameSpace.squareSize);

                if (hnefataflNameSpace.board[tileY][tileX].toLowerCase() == hnefataflNameSpace.currentPlayer) {
                    //check who's go it is:


                    hnefataflNameSpace.highlightSquare = [tileX, tileY];

                } else {
                    if (hnefataflNameSpace.highlightSquare.length > 0) {
                        // check it's a legal move:
                        var isALegalMove = false;
                        var movingFromX = hnefataflNameSpace.highlightSquare[0];
                        var movingFromY = hnefataflNameSpace.highlightSquare[1];
                        console.log("moving from " + movingFromX + "," + movingFromY + " to " + tileX + "," + tileY);
                        // it's in a straight line:
                        if (tileY == hnefataflNameSpace.highlightSquare[1]) {
                            // check it's not blocked
                            isALegalMove = true;
                            // needs to check the appropriate direction:
                            if (tileX > movingFromX) {

                                for (var i = movingFromX + 1; i <= tileX; i++) {
                                    console.log("checking " + i + "," + tileY + " : " + hnefataflNameSpace.board[tileY][i]);
                                    if (hnefataflNameSpace.board[tileY][i] != '0') {
                                        isALegalMove = false;
                                    }
                                }
                            } else {

                                for (var i = tileX; i < movingFromX; i++) {
                                    console.log("checking " + i + "," + tileY + " : " + hnefataflNameSpace.board[tileY][i]);
                                    if (hnefataflNameSpace.board[tileY][i] != '0') {
                                        isALegalMove = false;
                                    }
                                }
                            }
                        } else if (tileX == hnefataflNameSpace.highlightSquare[0]) {
                            isALegalMove = true;
                            // needs to check the appropriate direction:
                            if (tileY > movingFromY) {
                                for (var i = movingFromY + 1; i <= tileY; i++) {
                                    console.log("checking " + tileX + "," + i + " : " + hnefataflNameSpace.board[i][tileX]);
                                    if (hnefataflNameSpace.board[i][tileX] != '0') {
                                        isALegalMove = false;
                                    }
                                }
                            } else {
                                for (var i = tileY; i < movingFromY; i++) {
                                    console.log("checking " + tileX + "," + i + " : " + hnefataflNameSpace.board[i][tileX]);
                                    if (hnefataflNameSpace.board[i][tileX] != '0') {
                                        isALegalMove = false;
                                    }
                                }
                            }
                        }

                        if (isALegalMove) {
                            // move to that slot:
                            hnefataflNameSpace.board[tileY][tileX] = hnefataflNameSpace.board[(hnefataflNameSpace.highlightSquare[1])][(hnefataflNameSpace.highlightSquare[0])];
                            hnefataflNameSpace.board[(hnefataflNameSpace.highlightSquare[1])][(hnefataflNameSpace.highlightSquare[0])] = '0';
                            // [currentPosX, currentPosY, destinationPosX, destinationPosY]:
                            hnefataflNameSpace.animatingPieces[tileX + "_" + tileY] = [hnefataflNameSpace.getTilePosition(movingFromX), hnefataflNameSpace.getTilePosition(movingFromY), hnefataflNameSpace.getTilePosition(tileX), hnefataflNameSpace.getTilePosition(tileY)];

                            hnefataflNameSpace.checkForCapturedPieces(tileX, tileY, hnefataflNameSpace.currentPlayer);

                            // swap who's go it is:
                            if (hnefataflNameSpace.currentPlayer == "w") {
                                hnefataflNameSpace.currentPlayer = "b";
                            } else {
                                hnefataflNameSpace.currentPlayer = "w";
                            }

                        }
                    }
                    // de-select:
                    hnefataflNameSpace.highlightSquare = [];

                }
                // console.log(tileX,tileY,hnefataflNameSpace.board[tileY][tileX]);
        }
    },

    checkForCapturedPieces: function(whichTileX, whichTileY, whichPlayerMoved) {

        var opposingPlayer;
        if (whichPlayerMoved == "w") {
            opposingPlayer = "b";
        } else {
            opposingPlayer = "w";
        }

        var directionsToCheck = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        ];

        var checkX, checkY, checkX2, checkY2;

        for (var i = 0; i < directionsToCheck.length; i++) {
            checkY = whichTileY + (directionsToCheck[i][0]);
            checkX = whichTileX + (directionsToCheck[i][1]);

            if (checkX > 0 && checkY > 0 && checkX < hnefataflNameSpace.board.length && checkY < hnefataflNameSpace.board.length) {
                if (hnefataflNameSpace.board[checkY][checkX].toLowerCase() == opposingPlayer) {
                    checkY2 = whichTileY + (directionsToCheck[i][0] * 2);
                    checkX2 = whichTileX + (directionsToCheck[i][1] * 2);
                    if (checkX2 > 0 && checkY2 > 0 && checkX2 < hnefataflNameSpace.board.length && checkY2 < hnefataflNameSpace.board.length) {
                        if (hnefataflNameSpace.board[checkY2][checkX2].toLowerCase() == whichPlayerMoved) {
                            // remove piece:
                            hnefataflNameSpace.board[checkY][checkX] = '0';
                        }
                    }
                }
            }
        }


    },

    initCardGame: function() {
        hnefataflNameSpace.getCanvasPosition();
        hnefataflNameSpace.gameCanvas = document.getElementById("hnefataflGame");
        if (hnefataflNameSpace.gameCanvas.getContext) {
            hnefataflNameSpace.gameContext = hnefataflNameSpace.gameCanvas.getContext('2d');
            hnefataflNameSpace.canvasWidth = hnefataflNameSpace.gameCanvas.width;
            hnefataflNameSpace.canvasHeight = hnefataflNameSpace.gameCanvas.height;
        }

        // set up image references:
        hnefataflNameSpace.boardImage = Loader.getImage("board");
        hnefataflNameSpace.highlightImage = Loader.getImage("highlight");
        hnefataflNameSpace.activeWhiteImage = Loader.getImage("active-white");
        hnefataflNameSpace.activeBlackImage = Loader.getImage("active-black");
        hnefataflNameSpace.whitePieceImage = Loader.getImage("white-piece");
        hnefataflNameSpace.kingImage = Loader.getImage("king");
        hnefataflNameSpace.blackPieceImage = Loader.getImage("black-piece");

        hnefataflNameSpace.currentPlayer = "w";
        // needs to be player's choice: ##########
        hnefataflNameSpace.player1 = "w";
        hnefataflNameSpace.player2 = "d";
        hnefataflNameSpace.isPlayer1AI = true;
        hnefataflNameSpace.aiIsWorking = -1;
        hnefataflNameSpace.waitForDrawUpdate = false;

        hnefataflNameSpace.whoCanClick = hnefataflNameSpace.currentPlayersTurn;
        hnefataflNameSpace.gameMode = "play";
        if (typeof gameMode !== "undefined") {
            gameMode = "hnefataflGame";
        }
    },

    draw: function() {
        // place board:
        hnefataflNameSpace.gameContext.drawImage(hnefataflNameSpace.boardImage, 0, 0);
        if (hnefataflNameSpace.currentPlayer == "w") {
            hnefataflNameSpace.gameContext.drawImage(hnefataflNameSpace.activeWhiteImage, 0, 0);
        } else {
            hnefataflNameSpace.gameContext.drawImage(hnefataflNameSpace.activeBlackImage, 0, 0);
        }

        if (hnefataflNameSpace.highlightSquare.length > 0) {
            hnefataflNameSpace.gameContext.drawImage(hnefataflNameSpace.highlightImage, (hnefataflNameSpace.highlightSquare[0] * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset, (hnefataflNameSpace.highlightSquare[1] * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset);
        }

        var thisPiece, thisPositionX, thisPositionY;
        for (var i = 0; i < hnefataflNameSpace.board.length; i++) {
            for (var j = 0; j < hnefataflNameSpace.board[0].length; j++) {
                switch (hnefataflNameSpace.board[i][j]) {
                    case 'b':
                        thisPiece = hnefataflNameSpace.blackPieceImage;
                        break;
                    case 'w':
                        thisPiece = hnefataflNameSpace.whitePieceImage;
                        break;
                    case 'W':
                        thisPiece = hnefataflNameSpace.kingImage;
                        break;
                    default:
                        thisPiece = ''
                }





                if (thisPiece != '') {


                    // see if it's moving:
                    if (j + "_" + i in hnefataflNameSpace.animatingPieces) {
                        // [currentPosX, currentPosY, destinationPosX, destinationPosY]:


                        //    thisPositionX = (hnefataflNameSpace.animatingPieces[j + "_" + i][0] + hnefataflNameSpace.animatingPieces[j + "_" + i][2]) / 2;
                        //    thisPositionY = (hnefataflNameSpace.animatingPieces[j + "_" + i][1] + hnefataflNameSpace.animatingPieces[j + "_" + i][3]) / 2;

                        if ((hnefataflNameSpace.animatingPieces[j + "_" + i][0] > hnefataflNameSpace.animatingPieces[j + "_" + i][2])) {
                            hnefataflNameSpace.animatingPieces[j + "_" + i][0] -= hnefataflNameSpace.pieceSpeed;
                        } else if ((hnefataflNameSpace.animatingPieces[j + "_" + i][0] < hnefataflNameSpace.animatingPieces[j + "_" + i][2])) {
                            hnefataflNameSpace.animatingPieces[j + "_" + i][0] += hnefataflNameSpace.pieceSpeed;
                        }

                        if ((hnefataflNameSpace.animatingPieces[j + "_" + i][1] - hnefataflNameSpace.animatingPieces[j + "_" + i][3]) >= hnefataflNameSpace.pieceSpeed) {
                            hnefataflNameSpace.animatingPieces[j + "_" + i][1] -= hnefataflNameSpace.pieceSpeed;
                        } else if ((hnefataflNameSpace.animatingPieces[j + "_" + i][1] - hnefataflNameSpace.animatingPieces[j + "_" + i][3]) <= -hnefataflNameSpace.pieceSpeed) {
                            hnefataflNameSpace.animatingPieces[j + "_" + i][1] += hnefataflNameSpace.pieceSpeed;
                        }

                        hnefataflNameSpace.gameContext.drawImage(thisPiece, hnefataflNameSpace.animatingPieces[j + "_" + i][0] - hnefataflNameSpace.pieceGraphicalOffset, hnefataflNameSpace.animatingPieces[j + "_" + i][1] - hnefataflNameSpace.pieceGraphicalOffset);
                        //   hnefataflNameSpace.animatingPieces[j + "_" + i][0] = thisPositionX;
                        //   hnefataflNameSpace.animatingPieces[j + "_" + i][1] = thisPositionY;
                        if (hnefataflNameSpace.animatingPieces[j + "_" + i][1] == hnefataflNameSpace.animatingPieces[j + "_" + i][3]) {
                            if (Math.abs(hnefataflNameSpace.animatingPieces[j + "_" + i][0] - hnefataflNameSpace.animatingPieces[j + "_" + i][2]) < hnefataflNameSpace.pieceSpeed) {
                                delete hnefataflNameSpace.animatingPieces[j + "_" + i];
                            }
                        }
                        if (j + "_" + i in hnefataflNameSpace.animatingPieces) {
                            if (hnefataflNameSpace.animatingPieces[j + "_" + i][0] == hnefataflNameSpace.animatingPieces[j + "_" + i][2]) {
                                if (Math.abs(hnefataflNameSpace.animatingPieces[j + "_" + i][1] - hnefataflNameSpace.animatingPieces[j + "_" + i][3]) < hnefataflNameSpace.pieceSpeed) {
                                    delete hnefataflNameSpace.animatingPieces[j + "_" + i];
                                }
                            }
                        }
                    } else {

                        hnefataflNameSpace.gameContext.drawImage(thisPiece, hnefataflNameSpace.getTilePosition(j) - hnefataflNameSpace.pieceGraphicalOffset, hnefataflNameSpace.getTilePosition(i) - hnefataflNameSpace.pieceGraphicalOffset);
                    }
                }
            }
        }
    },

    update: function() {

    }
};