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
    if (!isATerrainCollision(tileX, tileY)) {
        var isABlockingItem = false;
        for (var i = 0; i < thisMapData.items.length; i++) {
            if (thisMapData.items[i].tileX == tileX) {
                if (thisMapData.items[i].tileY == tileY) {
                    isABlockingItem = true;
                }
            }
        }
        if (!isABlockingItem) {
            if (typeof nodes[tileX + "-" + tileY] !== "undefined") {
                var cost = Math.abs(tileX - endX) + Math.abs(tileY - endY);
                nodes[tileX + "-" + tileY] = {
                    x: tileX,
                    y: tileY,
                    parentX: parentNode.x,
                    parentY: parentNode.y,
                    cost: cost
                }
                for (var i = 0; i < uncheckedTiles.length; i++) {
                    if (cost < uncheckedTiles[i].cost) {
                        uncheckedTiles.splice(i, 0, nodes[tileX + "-" + tileY]);
                        break;
                    }
                }
                if (i >= uncheckedTiles.length) {
                    // add to end of array:
                    uncheckedTiles.push(nodes[tileX + "-" + tileY]);
                }
            }
        }
    }
}


function findPath(startX, startY, endX, endY) {

    uncheckedTiles = [];
    var cost = Math.abs(startX - endX) + Math.abs(startY - endY);
    nodes = {};
    nodes[startX + "-" + startY] = {
        x: startX,
        y: startY,
        parentX: null,
        parentY: null,
        cost: cost
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
            // make path ########
        } else {
            addNode(thisNode, thisNode.x + 1, thisNode.y, endX, endY);
            addNode(thisNode, thisNode.x - 1, thisNode.y, endX, endY);
            addNode(thisNode, thisNode.x, thisNode.y + 1, endX, endY);
            addNode(thisNode, thisNode.x, thisNode.y - 1, endX, endY);
        }

    } while ((uncheckedTiles.length > 0) && !targetFound);

    // tidy up:
    delete uncheckedTiles;
    delete thisMapData;
    delete nodes;
    return ["n", "n", "e", "pathEnd"];
}


onmessage = function(e) {
    switch (e.data[0]) {
        case 'shop':
            console.log('web worker is looking for a shop');
            var thisNPC = e.data[1];
            thisMapData = e.data[2];

            mapTilesY = thisMapData.terrain.length;
            mapTilesX = thisMapData.terrain[0].length;

            var thisNPCsIndex = thisMapData.npcs.map(function(x) {
                return x.name;
            }).indexOf(thisNPC.name);
            var thisLoopNPC;
            var shopsFound = [];
            for (var i = 0; i < thisMapData.npcs.length; i++) {
                if (i != thisNPCsIndex) {
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
                var thisShopLocation, distanceToThisShop, chosenShop;
                var shortestDistance = 9999999;
                for (var i = 0; i < shopsFound.length; i++) {
                    thisShopLocation = thisMapData.npcs[(shopsFound[i])].tileX + "-" + thisMapData.npcs[(shopsFound[i])].tileY;
                    // make sure it's not the one just visited:
                    if (thisShopLocation != thisNPC.lastTargetDestination) {
                        distanceToThisShop = Math.sqrt(((thisNPC.tileX - thisMapData.npcs[(shopsFound[i])].tileX) * (thisNPC.tileX - thisMapData.npcs[(shopsFound[i])].tileX)) + ((thisNPC.tileY - thisMapData.npcs[(shopsFound[i])].tileY) * (thisNPC.tileY - thisMapData.npcs[(shopsFound[i])].tileY)));
                        if (distanceToThisShop < shortestDistance) {
                            chosenShop = i;
                        }
                    }
                }
                var chosenShopLocation = thisMapData.npcs[(shopsFound[chosenShop])].tileX + "-" + thisMapData.npcs[(shopsFound[chosenShop])].tileY;
                postMessage([thisNPC.name, findPath(thisNPC.tileX, thisNPC.tileY, thisMapData.npcs[(shopsFound[chosenShop])].tileX, thisMapData.npcs[(shopsFound[chosenShop])].tileY), chosenShopLocation]);
            } else {
                // stay still:
                postMessage([thisNPC.name, ["-", "pathEnd"], ""]);
            }
            break;
    }
}
