'use strict';

// core card game code shared between in-game world and standalone card game




var thisMovesScore, indexToCheck, indexesToRemove, whichMoveToMake, listOfPossibleBestMoves;

// name space the card game code so it doesn't cause conflicts with the core game code:
var hnefataflNameSpace = {
    'cardWidth': 84,
    'cardHeight': 102,
    

    'board': [    ],



    initialiseCardGame: function() {

    // 'x' = void space
    // '#' = player 1 start position
    // '@' = player 2 start position
    hnefataflNameSpace.board = [
        ['#', '#', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', 'x', 'x'],
        ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
        ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
        ['#', '#', 'x', '-', '-', '-', '-', '-', '-', 'x', '@', '@'],
        ['#', '#', 'x', 'x', '-', '-', '-', '-', 'x', 'x', '@', '@'],
        ['x', 'x', 'x', 'x', 'x', '-', '-', 'x', 'x', 'x', '@', '@']
    ];

    hnefataflNameSpace.boardWidth = hnefataflNameSpace.board[0].length;
    hnefataflNameSpace.boardHeight = hnefataflNameSpace.board.length;



        hnefataflNameSpace.imagesToLoad = [{
            name: "board",
            src: "/images/hnefatafl/board.jpg"
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
            case "cardGame":
              
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
     

      
        hnefataflNameSpace.currentOpponent = 1;
        hnefataflNameSpace.isPlayer1AI = true;
        hnefataflNameSpace.aiIsWorking = -1;
        hnefataflNameSpace.waitForDrawUpdate = false;

          
            hnefataflNameSpace.whoCanClick = hnefataflNameSpace.currentPlayersTurn;
            hnefataflNameSpace.gameMode = "play";
            if (typeof gameMode !== "undefined") {
                gameMode = "cardGame";
            }
            
                
      
    },

    draw: function() {
        //  hnefataflNameSpace.gameContext.clearRect(0, 0, hnefataflNameSpace.canvasWidth, hnefataflNameSpace.canvasHeight);
        // place board:
       
        hnefataflNameSpace.gameContext.drawImage(hnefataflNameSpace.boardImage, 0, 0);
   
         
    },

  

    update: function() {

    }

  
};






