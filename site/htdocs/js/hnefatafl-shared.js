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
    'board': [    ],



    initialisehnefataflGame: function() {

    // '0' = void space
    // '1' = player 1 (black) start position
    // 'K' = player 2 king start position
    // '2' = player 2 (white) start position
    hnefataflNameSpace.board = [
        ['0', '0', '0', '1', '1', '1', '0', '0', '0'],
        ['0', '0', '0', '0', '1', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '2', '0', '0', '0', '0'],
        ['1', '0', '0', '0', '2', '0', '0', '0', '1'],
        ['1', '1', '2', '2', 'K', '2', '2', '1', '1'],
        ['1', '0', '0', '0', '2', '0', '0', '0', '1'],
        ['0', '0', '0', '0', '2', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '1', '0', '0', '0', '0'],
        ['0', '0', '0', '1', '1', '1', '0', '0', '0']
      
    ];

    hnefataflNameSpace.boardWidth = hnefataflNameSpace.board[0].length;
    hnefataflNameSpace.boardHeight = hnefataflNameSpace.board.length;



        hnefataflNameSpace.imagesToLoad = [{
            name: "board",
            src: "/images/hnefatafl/board.jpg"
        },
        {
             name: "white-piece",
            src: "/images/hnefatafl/white-piece.png"
        },  {
             name: "black-piece",
            src: "/images/hnefatafl/black-piece.png"
        },
          {
             name: "king",
            src: "/images/hnefatafl/king.png"
        }


        ];
    
        // click handler:
        document.getElementById("hnefataflGame").addEventListener("click",  hnefataflNameSpace.canvasClick, false);

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
        hnefataflNameSpace.outerCanvasHeight = canvasElemCoords.bottom - canvasElemCoords.top;
        hnefataflNameSpace.pageLoadScroll = document.body.scrollTop + document.documentElement.scrollTop;
        // console.log("canvas at " + hnefataflNameSpace.outerCanvasLeft + ", " + hnefataflNameSpace.outerCanvasTop + " at " + hnefataflNameSpace.pageLoadScroll + " - " + outerhnefataflNameSpace.canvasWidth + " x " + outerhnefataflNameSpace.canvasHeight);
    },


    canvasClick: function(e) {
           if (e) {
                e.preventDefault();
            }
        var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - hnefataflNameSpace.outerCanvasLeft;
        var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - hnefataflNameSpace.outerCanvasTop - hnefataflNameSpace.pageLoadScroll;
        switch (hnefataflNameSpace.gameMode) {
            case "play":
            case "hnefataflGame":
              
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
        var thisPiece;
        for (var i = 0; i < hnefataflNameSpace.board.length; i++) {
            for (var j = 0; j < hnefataflNameSpace.board[0].length; j++) {
                switch (hnefataflNameSpace.board[i][j]) {
                    case '1':
                        thisPiece = hnefataflNameSpace.blackPieceImage;
                        break;
                    case '2':
                        thisPiece = hnefataflNameSpace.whitePieceImage;
                        break;
                    case 'K':
                        thisPiece = hnefataflNameSpace.kingImage;
                        break;
                    default:
                        thisPiece = ''
                }

                if (thisPiece != '') {
                    hnefataflNameSpace.gameContext.drawImage(thisPiece, (i * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset - hnefataflNameSpace.pieceGraphicalOffset, (j * hnefataflNameSpace.squareSize) + hnefataflNameSpace.boardInset - hnefataflNameSpace.pieceGraphicalOffset);
                }

            }
        }

    },

  

    update: function() {

    }

  
};






