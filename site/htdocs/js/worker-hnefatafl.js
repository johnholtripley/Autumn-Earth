'use strict';

self.importScripts('shared-hnefatafl-worker-functions.min.js');

var hnefataflNameSpace = {};

function findBestAIMove() {
    // find random piece:
    var directionsToCheck = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];
    var destX, destY, moveX, moveY, checkY, checkX;
    for (var i = 0; i < hnefataflNameSpace.board.length; i++) {
        for (var j = 0; j < hnefataflNameSpace.board[0].length; j++) {
            if (hnefataflNameSpace.board[i][j].toLowerCase() == hnefataflNameSpace.player1) {
                for (var k = 0; k < directionsToCheck.length; k++) {
                    checkY = i + (directionsToCheck[k][0]);
                    checkX = j + (directionsToCheck[k][1]);
                    if (checkX >= 0 && checkY >= 0 && checkX < hnefataflNameSpace.board.length && checkY < hnefataflNameSpace.board.length) {
                        if (hnefataflNameSpace.board[checkY][checkX] == '0') {
                            destX = checkX;
                            destY = checkY;
                            moveX = j;
                            moveY = i;
                        }
                    }
                }
            }
        }
    }
    return [moveX, moveY, destX, destY];
}


onmessage = function(e) {
    hnefataflNameSpace.board = e.data[0];
    hnefataflNameSpace.player1 = e.data[1];
    postMessage(findBestAIMove());
}