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
    }

};

cardGameNameSpace.boardWidth = cardGameNameSpace.board[0].length;
cardGameNameSpace.boardHeight = cardGameNameSpace.board.length;
