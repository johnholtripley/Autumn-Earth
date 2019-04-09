'use strict';

// core card game code shared between in-game world and standalone card game




//var thisMovesScore, indexToCheck, indexesToRemove, whichMoveToMake, listOfPossibleBestMoves;

// name space the card game code so it doesn't cause conflicts with the core game code:
var hnefataflNameSpace = {
    //  'cardWidth': 84,
    //  'cardHeight': 102,

    'squareSize': 62,
    'boardInset': 28,
    'pieceGraphicalOffset': 12,
    'originalWidth': 612,
    'highlightSquare': [],
    'board': [],



    initialisehnefataflGame: function() {

        // '0' = void space
        // 'b' = black start position
        // 'K' = (white) king start position
        // 'w' = white start position
        hnefataflNameSpace.board = [
            ['0', '0', '0', 'b', 'b', 'b', '0', '0', '0'],
            ['0', '0', '0', '0', 'b', '0', '0', '0', '0'],
            ['0', '0', '0', '0', 'w', '0', '0', '0', '0'],
            ['b', '0', '0', '0', 'w', '0', '0', '0', 'b'],
            ['b', 'b', 'w', 'w', 'k', 'w', 'w', 'b', 'b'],
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
        // gameLoop();
        // preload all images:
        Loader.preload(hnefataflNameSpace.imagesToLoad, hnefataflNameSpace.initCardGame, loadingProgress);
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
        // console.log("canvas at " + hnefataflNameSpace.outerCanvasLeft + ", " + hnefataflNameSpace.outerCanvasTop + " at " + hnefataflNameSpace.pageLoadScroll + " - " + outerhnefataflNameSpace.canvasWidth + " x " + outerhnefataflNameSpace.canvasHeight);
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

                //var tileX = Math.floor((x*hnefataflNameSpace.scale-hnefataflNameSpace.boardInset)/hnefataflNameSpace.squareSize);
                //var tileY = Math.floor((y*hnefataflNameSpace.scale-hnefataflNameSpace.boardInset)/hnefataflNameSpace.squareSize);

                var positionOnCanvasX = x - hnefataflNameSpace.outerCanvasLeft;
                var positionOnCanvasY = y - hnefataflNameSpace.outerCanvasTop;

                var tileX = Math.floor(((hnefataflNameSpace.scale * positionOnCanvasX) - hnefataflNameSpace.boardInset) / hnefataflNameSpace.squareSize);
                var tileY = Math.floor(((hnefataflNameSpace.scale * positionOnCanvasY) - hnefataflNameSpace.boardInset) / hnefataflNameSpace.squareSize);

                if (hnefataflNameSpace.board[tileY][tileX] != '0') {
                    hnefataflNameSpace.highlightSquare = [tileX, tileY];
                } else {
                    if (hnefataflNameSpace.highlightSquare.length > 0) {
                        // check it's a legal move:
                        var isALegalMove = false;
                        // it's in a straight line:
                        if (tileY == hnefataflNameSpace.highlightSquare[1]) {
                            // check it's not blocked
                            isALegalMove = true;
                            console.log("moving from " + hnefataflNameSpace.highlightSquare[0] + "," + hnefataflNameSpace.highlightSquare[1] + " to " + tileX + "," + tileY);
                            // needs to check the appropriate direction: ##########
                            for (var i = hnefataflNameSpace.highlightSquare[0] + 1; i < tileX; i++) {
                                console.log("checking " + i + "," + tileY + " : " + hnefataflNameSpace.board[tileY][i]);
                                if (hnefataflNameSpace.board[tileY][i] != '0') {
                                    isALegalMove = false;
                                }
                            }


                        } else if (tileX == hnefataflNameSpace.highlightSquare[0]) {
                            isALegalMove = true;
                        }



                        if (isALegalMove) {
                            // move to that slot:
                            hnefataflNameSpace.board[tileY][tileX] = hnefataflNameSpace.board[(hnefataflNameSpace.highlightSquare[1])][(hnefataflNameSpace.highlightSquare[0])];
                            hnefataflNameSpace.board[(hnefataflNameSpace.highlightSquare[1])][(hnefataflNameSpace.highlightSquare[0])] = '0';
                        }


                    }
                    // de-select:
                    hnefataflNameSpace.highlightSquare = [];

                }
                // console.log(tileX,tileY,hnefataflNameSpace.board[tileY][tileX]);

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
        hnefataflNameSpace.whitePieceImage = Loader.getImage("white-piece");
        hnefataflNameSpace.kingImage = Loader.getImage("king");
        hnefataflNameSpace.blackPieceImage = Loader.getImage("black-piece");


        hnefataflNameSpace.currentOpponent = 1;
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

        if (hnefataflNameSpace.highlightSquare.length > 0) {
            hnefataflNameSpace.gameContext.drawImage(hnefataflNameSpace.highlightImage, (hnefataflNameSpace.highlightSquare[0] * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset, (hnefataflNameSpace.highlightSquare[1] * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset);
        }

        var thisPiece;
        for (var i = 0; i < hnefataflNameSpace.board.length; i++) {
            for (var j = 0; j < hnefataflNameSpace.board[0].length; j++) {
                switch (hnefataflNameSpace.board[i][j]) {
                    case 'b':
                        thisPiece = hnefataflNameSpace.blackPieceImage;
                        break;
                    case 'w':
                        thisPiece = hnefataflNameSpace.whitePieceImage;
                        break;
                    case 'k':
                        thisPiece = hnefataflNameSpace.kingImage;
                        break;
                    default:
                        thisPiece = ''
                }

                if (thisPiece != '') {
                    hnefataflNameSpace.gameContext.drawImage(thisPiece, (j * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset - hnefataflNameSpace.pieceGraphicalOffset, (i * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset - hnefataflNameSpace.pieceGraphicalOffset);
                }

            }
        }

    },



    update: function() {

    }


};