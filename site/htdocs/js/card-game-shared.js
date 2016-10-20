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

        cardGameNameSpace.allCardsThisGame = player1Cards.concat(player2Cards);
        cardGameNameSpace.numberOfCardsInGame = cardGameNameSpace.allCardsThisGame.length;

        // find non-duplicate card types to load:
        cardGameNameSpace.allCardsToLoadThisGame = uniqueValues(cardGameNameSpace.allCardsThisGame);
        numberOfCardTypes = cardGameNameSpace.allCardsToLoadThisGame.length;

        // isANetworkGameis defined in card-sockets.js so if not a network game, this won't be set:
        if (typeof isANetworkGame === "undefined") {
            isANetworkGame = false;
        }

        imagesToLoad = [{
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

        cardGameNameSpace.gameMode = "loading";
        gameLoop();
        // preload all images:
        Loader.preload(imagesToLoad, initCardGame, loadingProgress);
    }

};

cardGameNameSpace.boardWidth = cardGameNameSpace.board[0].length;
cardGameNameSpace.boardHeight = cardGameNameSpace.board.length;
