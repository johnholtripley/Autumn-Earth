'use strict';
self.importScripts('shared-worker-functions.min.js');


function loadGlobalMapData() {
    getJSON("/data/world-map.json", function(data) {
        worldMap = data.worldMap;
    }, function(status) {
        // error - try again:
        loadGlobalMapData();
    });
}


var worldMap = '';
loadGlobalMapData();




var thisMapData, visibleMaps, mapTilesY, mapTilesX, thisAgentsIndex, uncheckedTiles, nodes, firstKey, isOverWorldMap;


// ideally load these in from a shared resource: ##
const tileW = 48;
const worldMapTileLength = 50;


/*
function isATerrainCollision(tileX, tileY) {
    if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
        // is out of the bounds of the current map:
        return 1;
    } else {
        switch (thisMapData[(visibleMaps[m])].collisions[tileY][tileX]) {
            case 1:
                // is a collision:
                return 1;
                break;
            default:
                // not a collision (might be stairs or a door)
                return 0;
        }
    }
}
*/





function isATerrainCollision(globalTileX, globalTileY) {
    var tileX = getLocalCoordinatesX(globalTileX);
    var tileY = getLocalCoordinatesX(globalTileY);

    if (isOverWorldMap) {

        if ((globalTileX < 0) || (globalTileY < 0) || (globalTileX >= (worldMapTileLength * worldMap[0].length)) || (globalTileY >= (worldMapTileLength * worldMap.length))) {
            return 1;
        }
    } else {
        if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
            return 1;
        }
    }
    var thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);

    // check if defined rather than boundaries as could be moving into an adjoining map:
    /*
    if (typeof thisMapData[thisMap].collisions[tileY] === "undefined") {
        return 1;
    }
    if (typeof thisMapData[thisMap].collisions[tileY][tileX] === "undefined") {
        return 1;
    }
    */
    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
        case 1:
            // is a collision:
            return 1;
            break;
        case "<":
        case ">":
        case "^":
        case "v":
            // stairs
            // #####
            return 0;
            break;
        case "d":
            // is a door:
            return 0;
            break;
        default:
            // not a collsiion:
            return 0;
    }
}





function addNode(parentNode, tileX, tileY, endX, endY) {
    // console.log(tileX+", "+tileY);
    if (!isATerrainCollision(tileX, tileY)) {
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
    var localTileX, localTileY;
    // prepare map - mark any items, static NPCs or closed inner doors as blocked tiles:
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {

            // make sure other NPCs don't block - except for the any in the destination tile:
            if (thisMapData[(visibleMaps[m])].npcs.name != thisAgentsIndex) {
                // only include stationary NPCS:
                if (thisMapData[(visibleMaps[m])].npcs[i].movement[thisMapData[(visibleMaps[m])].npcs[i].movementIndex] == '-') {
                    if (thisMapData[(visibleMaps[m])].npcs[i].isCollidable) {
                        if (!((thisMapData[(visibleMaps[m])].npcs[i].tileX == endX) && (thisMapData[(visibleMaps[m])].npcs[i].tileY == endY))) {
                            localTileX = getLocalCoordinatesX(thisMapData[(visibleMaps[m])].npcs[i].tileX);
                            localTileY = getLocalCoordinatesY(thisMapData[(visibleMaps[m])].npcs[i].tileY);
                            thisMapData[(visibleMaps[m])].collisions[localTileY][localTileX] = 1;
                        }
                    }
                }
            }
        }

        // check for items:
        for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
            localTileX = getLocalCoordinatesX(thisMapData[(visibleMaps[m])].items[i].tileX);
            localTileY = getLocalCoordinatesY(thisMapData[(visibleMaps[m])].items[i].tileY);
            // allow item at the destination:
            if (!((thisMapData[(visibleMaps[m])].items[i].tileX == endX) && (thisMapData[(visibleMaps[m])].items[i].tileY == endY))) {
            thisMapData[(visibleMaps[m])].collisions[localTileY][localTileX] = 1;
        }
            // needs to also see if the item is wider than a single tile:
            // needs debugging ##############
            if (thisMapData[(visibleMaps[m])].items[i].width > tileW) {
                for (var j = 1; j < thisMapData[(visibleMaps[m])].items[i].width / tileW; j++) {
                    thisMapData[(visibleMaps[m])].collisions[localTileY][localTileX + j] = 1;
                    thisMapData[(visibleMaps[m])].collisions[localTileY][localTileX - j] = 1;
                }
            }
            if (thisMapData[(visibleMaps[m])].items[i].height > tileW) {
                for (var j = 1; j < thisMapData[(visibleMaps[m])].items[i].height / tileW; j++) {
                    thisMapData[(visibleMaps[m])].collisions[localTileY + j][localTileX] = 1;
                    thisMapData[(visibleMaps[m])].collisions[localTileY - j][localTileX] = 1;
                }
            }


        }

        // check for inner doors:
        if (typeof thisMapData[(visibleMaps[m])].innerDoors !== "undefined") {
            for (var i in thisMapData[(visibleMaps[m])].innerDoors) {
                if (!thisMapData[(visibleMaps[m])].innerDoors[i].isOpen) {
                    localTileX = getLocalCoordinatesX(thisMapData[(visibleMaps[m])].innerDoors[i].tileX);
                    localTileY = getLocalCoordinatesY(thisMapData[(visibleMaps[m])].innerDoors[i].tileY);
                    thisMapData[(visibleMaps[m])].collisions[localTileY][localTileX] = 1;
                }
            }
        }
    }

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
    visibleMaps = null;
    nodes = null;
    thisAgentsIndex = null;
    if (!targetFound) {
        return ["-", "pathEnd"];
    } else {
        return builtPath;
    }
}


onmessage = function(e) {

    var findType = e.data[0];
    if (Array.isArray(findType)) {
        findType = e.data[0][0];
    }

    if (worldMap != '') {
        switch (findType) {
            case 'tile':
                var destinationX = e.data[1];
                var destinationY = e.data[2];
                var thisAgent = e.data[3];
                thisMapData = e.data[4];
                visibleMaps = e.data[5];
                isOverWorldMap = e.data[6];

                // get first item in the thisMapData object:
                for (firstKey in thisMapData) break;

                mapTilesY = thisMapData[firstKey].terrain.length;
                mapTilesX = thisMapData[firstKey].terrain[0].length;



                postMessage([thisAgent.name, findPath(thisAgent.tileX, thisAgent.tileY, destinationX, destinationY), destinationX + "-" + destinationY]);


                break;
            case 'shop':
                var thisAgent = e.data[1];
                thisMapData = e.data[2];

                visibleMaps = e.data[3];
                isOverWorldMap = e.data[4];
                for (firstKey in thisMapData) break;

                mapTilesY = thisMapData[firstKey].terrain.length;
                mapTilesX = thisMapData[firstKey].terrain[0].length;
                thisAgentsIndex = thisAgent.name;
                var thisLoopNPC;
                var shopsFound = [];
                var shopsFoundOnWhichMap = [];
                for (var m = 0; m < visibleMaps.length; m++) {

                    for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {

                        if (thisMapData[(visibleMaps[m])].npcs[i].name != thisAgentsIndex) {
                            // just make sure it's not checking its own shop (...just in case)
                            thisLoopNPC = thisMapData[(visibleMaps[m])].npcs[i];
                            if (thisLoopNPC.speech) {
                                if (thisLoopNPC.speech[thisLoopNPC.speechIndex][1] == "shop") {
                                    shopsFound.push(i);
                                    shopsFoundOnWhichMap.push(visibleMaps[m]);
                                }
                            }
                        }
                    }
                }
                //     console.log(shopsFound);
                //     console.log(shopsFoundOnWhichMap);
                //     console.log("-----------");
                if (shopsFound.length > 0) {
                    var chosenShopLocation, chosenShop;
                    do {
                        chosenShop = Math.floor(Math.random() * shopsFound.length);
                        chosenShopLocation = thisMapData[(shopsFoundOnWhichMap[chosenShop])].npcs[(shopsFound[chosenShop])].tileX + "-" + thisMapData[(shopsFoundOnWhichMap[chosenShop])].npcs[(shopsFound[chosenShop])].tileY;
                    } while (chosenShopLocation == thisAgent.lastTargetDestination);
                    postMessage([thisAgent.name, findPath(thisAgent.tileX, thisAgent.tileY, thisMapData[(shopsFoundOnWhichMap[chosenShop])].npcs[(shopsFound[chosenShop])].tileX, thisMapData[(shopsFoundOnWhichMap[chosenShop])].npcs[(shopsFound[chosenShop])].tileY), chosenShopLocation]);
                } else {
                    // stay still:
                    postMessage([thisAgent.name, ["-", "pathEnd"], ""]);
                }
                break;
            case 'item':
                // find the nearest item that matches the required type(s)
                var thisAgent = e.data[1];
                thisMapData = e.data[2];
                visibleMaps = e.data[3];
                isOverWorldMap = e.data[4];
                for (firstKey in thisMapData) break;

                mapTilesY = thisMapData[firstKey].terrain.length;
                mapTilesX = thisMapData[firstKey].terrain[0].length;
                var closesMatchingItemSoFar, thisDistance;
                var closestDistanceSoFar = Infinity;
                for (var m = 0; m < visibleMaps.length; m++) {
                    for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
                        if (e.data[0][1].indexOf(thisMapData[(visibleMaps[m])].items[i].type) != -1) {
                            thisDistance = getPythagorasDistance(thisMapData[(visibleMaps[m])].items[i].tileX, thisMapData[(visibleMaps[m])].items[i].tileY, thisAgent.tileX, thisAgent.tileY)
                            if (thisDistance < closestDistanceSoFar) {
                                closestDistanceSoFar = thisDistance;
                                closesMatchingItemSoFar = [m, i];
                            }
                        }
                    }
                }
                if (closestDistanceSoFar < Infinity) {
                    var whichMap = thisMapData[visibleMaps[(closesMatchingItemSoFar[0])]];  
                     postMessage([thisAgent.name, findPath(thisAgent.tileX, thisAgent.tileY, whichMap.items[(closesMatchingItemSoFar[1])].tileX, whichMap.items[(closesMatchingItemSoFar[1])].tileY)]);
                } else {
                    // stay still:
                    postMessage([thisAgent.name, ["-", "pathEnd"], ""]);
                }
                break;
            case 'petToHero':
                var thisAgent = e.data[1];
                thisMapData = e.data[2];
                visibleMaps = e.data[6];
                isOverWorldMap = e.data[7];
                // pet isn't an NPC:
                thisAgentsIndex = -1;
                for (firstKey in thisMapData) break;
                mapTilesY = thisMapData[firstKey].terrain.length;
                mapTilesX = thisMapData[firstKey].terrain[0].length;
                // e.data[5] is the pets index:
                postMessage(['pet', e.data[5], findPath(thisAgent.tileX, thisAgent.tileY, e.data[3], e.data[4])]);
                break;
            case 'npcFindFollowing':
                var thisAgent = e.data[1];
                thisMapData = e.data[2];
                visibleMaps = e.data[3];
                isOverWorldMap = e.data[4];
                for (firstKey in thisMapData) break;
                mapTilesY = thisMapData[firstKey].terrain.length;
                mapTilesX = thisMapData[firstKey].terrain[0].length;
                thisAgentsIndex = thisAgent.name;
                postMessage([thisAgent.name, findPath(thisAgent.tileX, thisAgent.tileY, thisAgent.following.tileX, thisAgent.following.tileY)]);
                break;
        }
    }
}