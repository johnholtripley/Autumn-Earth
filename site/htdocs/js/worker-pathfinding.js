'use strict';

var thisMapData, mapTilesY, mapTilesX, thisAgentsIndex, uncheckedTiles, nodes;

function isATerrainCollision(tileX, tileY) {
    if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
        // is out of the bounds of the current map:
        return 1;
    } else {
        switch (thisMapData.collisions[tileY][tileX]) {
            case 1:
                // is a collision:
                return 1;
                break;
            default:
                // not a collsiion (might be stairs or a door)
                return 0;
        }
    }
}

function addNode(parentNode, tileX, tileY, endX, endY) {
    // console.log(tileX+", "+tileY);
    if (!isATerrainCollision(tileX, tileY)) {
        var isBlocked = false;
        for (var i = 0; i < thisMapData.items.length; i++) {
            if (thisMapData.items[i].tileX == tileX) {
                if (thisMapData.items[i].tileY == tileY) {
                    isBlocked = true;
                }
            }
        }
        for (var i = 0; i < thisMapData.npcs.length; i++) {
            // make sure other NPCs don't block - except for the any in the destination tile:
            if (i != thisAgentsIndex) {
                // only include stationary NPCS:
                if (thisMapData.npcs[i].movement[thisMapData.npcs[i].movementIndex] == '-') {
                    if (!((tileX == endX) && (tileY == endY))) {
                        if (parseInt(thisMapData.npcs[i].tileX) == parseInt(tileX)) {
                            if (parseInt(thisMapData.npcs[i].tileY) == parseInt(tileY)) {
                                isBlocked = true;
                            }
                        }
                    }
                }
            }
        }
        if (!isBlocked) {
            var heuristic = Math.abs(tileX - endX) + Math.abs(tileY - endY);
            var thisCost = parentNode.cost + 1;
            var thisSummedCost = thisCost + heuristic;
            if (typeof nodes[tileX + "-" + tileY] === "undefined") {
                nodes[tileX + "-" + tileY] = {
                    x: tileX,
                    y: tileY,
                    parentX: parentNode.x,
                    parentY: parentNode.y,
                    cost: thisCost,
                    summedCost: thisSummedCost
                }
                for (var i = 0; i < uncheckedTiles.length; i++) {
                    if (thisSummedCost < uncheckedTiles[i].summedCost) {
                        uncheckedTiles.splice(i, 0, nodes[tileX + "-" + tileY]);
                        break;
                    }
                }
                if (i >= uncheckedTiles.length) {
                    // add to end of array:
                    uncheckedTiles.push(nodes[tileX + "-" + tileY]);
                }
            } else {
                // check cost and change parent if this is faster
                if (thisCost < nodes[tileX + "-" + tileY].cost) {
                    nodes[tileX + "-" + tileY].cost = thisSummedCost;
                    nodes[tileX + "-" + tileY].summedCost = thisCost;
                    nodes[tileX + "-" + tileY].parentX = parentNode.x;
                    nodes[tileX + "-" + tileY].parentY = parentNode.y;
                }
            }
        }
    }
}


function findPath(startX, startY, endX, endY) {
    uncheckedTiles = [];
    var heuristic = Math.abs(startX - endX) + Math.abs(startY - endY);
    nodes = {};
    nodes[startX + "-" + startY] = {
        x: startX,
        y: startY,
        parentX: undefined,
        parentY: undefined,
        cost: 0,
        summedCost: heuristic
    }
    uncheckedTiles.push(nodes[startX + "-" + startY]);
    var thisNode;
    var targetFound = false;
    do {
        // get the next node:
        thisNode = uncheckedTiles.shift();
        // check if this is the target:
        if ((thisNode.x == endX) && (thisNode.y == endY)) {
            targetFound = true;
            var foundPath = [];
            while (typeof thisNode.parentX !== "undefined") {

                foundPath.unshift([thisNode.parentX, thisNode.parentY])
                thisNode = nodes[thisNode.parentX + "-" + thisNode.parentY];
            }

            var builtPath = [];
            for (var i = 1; i < foundPath.length; i++) {
                if (foundPath[i][0] == foundPath[i - 1][0]) {
                    // x values are the same
                    if (foundPath[i][1] > foundPath[i - 1][1]) {
                        builtPath.push('s');
                    } else {
                        builtPath.push('n');
                    }
                } else {
                    if (foundPath[i][0] > foundPath[i - 1][0]) {
                        builtPath.push('e');
                    } else {
                        builtPath.push('w');
                    }
                }
            }
            builtPath.push('pathEnd');
            // console.log(builtPath.join(", "));
        } else {
            addNode(thisNode, thisNode.x + 1, thisNode.y, endX, endY);
            addNode(thisNode, thisNode.x - 1, thisNode.y, endX, endY);
            addNode(thisNode, thisNode.x, thisNode.y + 1, endX, endY);
            addNode(thisNode, thisNode.x, thisNode.y - 1, endX, endY);
        }
    } while ((uncheckedTiles.length > 0) && !targetFound);

    // tidy up:
    uncheckedTiles = null;
    thisMapData = null;
    nodes = null;
    thisAgentsIndex = null;
    if (!targetFound) {
        return ["-", "pathEnd"];
    } else {
        return builtPath;
    }
}


onmessage = function(e) {
    switch (e.data[0]) {
        case 'shop':
            var thisAgent = e.data[1];
            thisMapData = e.data[2];
            mapTilesY = thisMapData.terrain.length;
            mapTilesX = thisMapData.terrain[0].length;
            thisAgentsIndex = thisMapData.npcs.map(function(x) {
                return x.name;
            }).indexOf(thisAgent.name);
            var thisLoopNPC;
            var shopsFound = [];
            for (var i = 0; i < thisMapData.npcs.length; i++) {
                if (i != thisAgentsIndex) {
                    // just make sure it's not checking its own shop (...just in case)
                    thisLoopNPC = thisMapData.npcs[i];
                    if (thisLoopNPC.speech) {
                        if (thisLoopNPC.speech[thisLoopNPC.speechIndex][1] == "shop") {
                            shopsFound.push(i);
                        }
                    }
                }
            }
            if (shopsFound.length > 0) {
                var chosenShopLocation, chosenShop;
                do {
                    chosenShop = Math.floor(Math.random() * shopsFound.length);
                    chosenShopLocation = thisMapData.npcs[(shopsFound[chosenShop])].tileX + "-" + thisMapData.npcs[(shopsFound[chosenShop])].tileY;
                } while (chosenShopLocation == thisAgent.lastTargetDestination);
                postMessage([thisAgent.name, findPath(thisAgent.tileX, thisAgent.tileY, thisMapData.npcs[(shopsFound[chosenShop])].tileX, thisMapData.npcs[(shopsFound[chosenShop])].tileY), chosenShopLocation]);
            } else {
                // stay still:
                postMessage([thisAgent.name, ["-", "pathEnd"], ""]);
            }
            break;
        case 'petToHero':
            var thisAgent = e.data[1];
            thisMapData = e.data[2];
            // pet isn't an NPC:
            thisAgentsIndex = -1;
            mapTilesY = thisMapData.terrain.length;
            mapTilesX = thisMapData.terrain[0].length;
            postMessage(['pet', findPath(thisAgent.tileX, thisAgent.tileY, e.data[3], e.data[4])]);
            break;
    }
}
