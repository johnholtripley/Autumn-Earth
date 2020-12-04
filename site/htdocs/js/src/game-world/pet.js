function isAPetTerrainCollision(object, x, y) {
    // check map bounds first:



    var thisMap;
    var globalTileX = getTileX(x);
    var globalTileY = getTileY(y);
    var tileX = getLocalCoordinatesX(globalTileX);
    var tileY = getLocalCoordinatesX(globalTileY);
    if(isOverWorldMap && !currentMapIsAGlobalPlatform) {
        thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);
    } else {
        thisMap = currentMap;
    }
    



    if (typeof thisMapData[thisMap].collisions[tileY] === "undefined") {
        return 1;
    }
    if (typeof thisMapData[thisMap].collisions[tileY][tileX] === "undefined") {
        return 1;
    }

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
            if (mapTransition != "") {
                // if the hero is going off the map:
                object.state = "door";
            }
            return 0;
            break;
        default:
            // not a collsiion:
            return 0;
    }

}


function movePet() {
    if (hasActivePet) {
        var thisNPC, thisItem, thisPetsTarget, thisOtherPet, oldPetX, oldPetY, thisPet, newTile, thisInnerDoor;
        for (var p = 0; p < hero.activePets.length; p++) {
            thisPet = hero.allPets[hero.activePets[p]];
            thisPetsTarget = thisPet.following;
            newTile = false;
            switch (thisPet.state) {
                case 'door':
                    // just keep moving:
                    switch (thisPet.facing) {
                        case 'n':
                            thisPet.y -= thisPet.speed;
                            break;
                        case 's':
                            thisPet.y += thisPet.speed;
                            break;
                        case 'w':
                            thisPet.x -= thisPet.speed;
                            break;
                        case 'e':
                            thisPet.x += thisPet.speed;
                            break;
                    }
                    break;
                case 'moving':
                    oldPetX = thisPet.x;
                    oldPetY = thisPet.y;
                    thisPet.drawnFacing = thisPet.facing;
                    switch (thisPet.facing) {
                        case 'n':
                            thisPet.y -= thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y - thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y - thisPet.length / 2))) {
                                // find the tile's bottom edge
                                var tileCollidedWith = getTileY(thisPet.y - thisPet.length / 2);
                                var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                                // use the +1 to make sure it's just clear of the collision tile
                                thisPet.y = tileBottomEdge + thisPet.heilengthght / 2 + 1;
                            }
                            break;
                        case 's':
                            thisPet.y += thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y + thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y + thisPet.length / 2))) {
                                var tileCollidedWith = getTileY(thisPet.y + thisPet.length / 2);
                                var tileTopEdge = (tileCollidedWith) * tileW;
                                thisPet.y = tileTopEdge - thisPet.length / 2 - 1;
                            }
                            break;
                        case 'w':
                            thisPet.x -= thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y + thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x - thisPet.width / 2, thisPet.y - thisPet.length / 2))) {
                                var tileCollidedWith = getTileX(thisPet.x - thisPet.width / 2);
                                var tileRightEdge = (tileCollidedWith + 1) * tileW;
                                thisPet.x = tileRightEdge + thisPet.width / 2 + 1;
                            }
                            break;
                        case 'e':
                            thisPet.x += thisPet.speed;
                            // check for collisions:
                            if ((isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y + thisPet.length / 2)) || (isAPetTerrainCollision(thisPet, thisPet.x + thisPet.width / 2, thisPet.y - thisPet.length / 2))) {
                                var tileCollidedWith = getTileX(thisPet.x + thisPet.width / 2);
                                var tileLeftEdge = (tileCollidedWith) * tileW;
                                thisPet.x = tileLeftEdge - thisPet.width / 2 - 1;
                            }
                            break;
                    }



                    // check for collisions against other pets:
                    for (var j = 0; j < hero.activePets.length; j++) {
                        if (p != j) {
                            thisOtherPet = hero.allPets[hero.activePets[j]];
                            if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisOtherPet.x, thisOtherPet.y, thisOtherPet.width, thisOtherPet.length)) {
                                thisPet.x = oldPetX;
                                thisPet.y = oldPetY;
                                // push the other pet:
                                thisOtherPet.state = "moving";
                                thisOtherPet.facing = thisPet.facing;
                            }
                        }
                    }


                    for (var m = 0; m < visibleMaps.length; m++) {
                        // check for collisions against NPCs:

                        for (var j = 0; j < thisMapData[visibleMaps[m]].npcs.length; j++) {
                            thisNPC = thisMapData[visibleMaps[m]].npcs[j];
                            if (thisNPC.isCollidable) {
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                }
                            }
                        }



                        // check for inner doors:
                        if (typeof thisMapData[visibleMaps[m]].innerDoors !== "undefined") {
                            for (var i in thisMapData[visibleMaps[m]].innerDoors) {
                                thisInnerDoor = thisMapData[visibleMaps[m]].innerDoors[i];
                                if (!thisInnerDoor.isOpen) {
                                    if (isAnObjectCollision(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW, thisPet.x, thisPet.y, thisPet.width, thisPet.length)) {
                                        thisPet.x = oldPetX;
                                        thisPet.y = oldPetY;
                                    }
                                }
                            }
                        }


                        // check for collisions against items:
                        for (var j = 0; j < thisMapData[visibleMaps[m]].items.length; j++) {
                            thisItem = thisMapData[visibleMaps[m]].items[j];
                            if (thisItem.isCollidable) {
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                }
                            }
                        }

                    }

                    // find the difference for this movement:
                    thisPet.dx += (thisPet.x - oldPetX);
                    thisPet.dy += (thisPet.y - oldPetY);
                    // see if it's at a new tile centre:

                    if (Math.abs(thisPet.dx) >= tileW) {
                        if (thisPet.dx > 0) {
                            thisPet.dx -= tileW;
                        } else {
                            thisPet.dx += tileW;
                        }
                        newTile = true;
                    }
                    if (Math.abs(thisPet.dy) >= tileW) {
                        if (thisPet.dy > 0) {
                            thisPet.dy -= tileW;
                        } else {
                            thisPet.dy += tileW;
                        }
                        newTile = true;
                    }



                    break;
                case 'findingPath':
                    // wait
                    break;
                case 'queuing':
                    // move onto the normal map grid after transitioning in:
                    if (!(isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 2))) {
                        oldPetX = thisPet.x;
                        oldPetY = thisPet.y;
                        thisPet.drawnFacing = thisPet.facing;
                        switch (thisPet.facing) {
                            case 'n':
                                thisPet.y -= thisPet.speed;
                                break;
                            case 's':
                                thisPet.y += thisPet.speed;
                                break;
                            case 'w':
                                thisPet.x -= thisPet.speed;
                                break;
                            case 'e':
                                thisPet.x += thisPet.speed;
                                break;
                        }



                        // check for collisions against other pets:
                        for (var j = 0; j < hero.activePets.length; j++) {
                            if (p != j) {
                                thisOtherPet = hero.allPets[hero.activePets[j]];
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisOtherPet.x, thisOtherPet.y, thisOtherPet.width, thisOtherPet.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                    /*
                                    // push the other pet:
                                    thisOtherPet.state = "moving";
                                    thisOtherPet.facing = thisPet.facing;
                                    */
                                }
                            }
                        }

                        for (var m = 0; m < visibleMaps.length; m++) {
                            // check for collisions against NPCs:
                            for (var j = 0; j < thisMapData[visibleMaps[m]].npcs.length; j++) {
                                thisNPC = thisMapData[visibleMaps[m]].npcs[j];
                                if (thisNPC.isCollidable) {
                                    if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                        thisPet.x = oldPetX;
                                        thisPet.y = oldPetY;
                                    }
                                }
                            }


                            // check for collisions against items:
                            for (var j = 0; j < thisMapData[visibleMaps[m]].items.length; j++) {
                                thisItem = thisMapData[visibleMaps[m]].items[j];
                                if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                                    thisPet.x = oldPetX;
                                    thisPet.y = oldPetY;
                                }
                            }
                        }

                        // find the difference for this movement:
                        thisPet.dx += (thisPet.x - oldPetX);
                        thisPet.dy += (thisPet.y - oldPetY);
                        // see if it's at a new tile centre:
                        if (Math.abs(thisPet.dx) >= tileW) {
                            if (thisPet.dx > 0) {
                                thisPet.dx -= tileW;
                            } else {
                                thisPet.dx += tileW;
                            }
                            newTile = true;
                        }
                        if (Math.abs(thisPet.dy) >= tileW) {
                            if (thisPet.dy > 0) {
                                thisPet.dy -= tileW;
                            } else {
                                thisPet.dy += tileW;
                            }
                            newTile = true;
                        }
                        if (newTile) {
                            thisPet.tileX = getTileX(thisPet.x);
                            thisPet.tileY = getTileY(thisPet.y);
                            if ((thisPet.tileX < 0) || (thisPet.tileY < 0) || (thisPet.tileX >= mapTilesX) || (thisPet.tileY >= mapTilesY)) {
                                //not on a valid tile yet:
                                newTile = false;
                            }
                        }
                    }
                    break;
                default:
                    // not finding a path so check proximity to the hero (or pet that this pet is following) to see if pet should start moving:
                    if (!(isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 4))) {
                        thisPet.state = "moving";
                    }
                    break;
            }
            if (newTile) {
                thisPet.tileX = getTileX(thisPet.x);
                thisPet.tileY = getTileY(thisPet.y);
                //  if (p != (hero.activePets.length - 1)) {
                // even the last one should drop a breadcrumb in case an escort quest NPC needs it
                thisPet.breadcrumb.pop();
                thisPet.breadcrumb.unshift([thisPet.tileX, thisPet.tileY]);
                //  }



                // check proximity to target to see if pet should stop moving:        
                if ((isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 2))) {
                    thisPet.state = "wait";
                } else {
                    // check the breadcrumb for next direction:
                    var breadcrumbFound = false;
                    for (var i = 0; i < thisPetsTarget.breadcrumb.length; i++) {
                        if ((thisPet.tileY) == thisPetsTarget.breadcrumb[i][1]) {
                            if ((thisPet.tileX - 1) == thisPetsTarget.breadcrumb[i][0]) {
                                thisPet.facing = "w";
                                breadcrumbFound = true;
                                break;
                            } else if ((thisPet.tileX + 1) == thisPetsTarget.breadcrumb[i][0]) {
                                thisPet.facing = "e";
                                breadcrumbFound = true;
                                break;
                            }
                        } else if ((thisPet.tileX) == thisPetsTarget.breadcrumb[i][0]) {
                            if ((thisPet.tileY + 1) == thisPetsTarget.breadcrumb[i][1]) {
                                thisPet.facing = "s";
                                breadcrumbFound = true;
                                break;
                            } else if ((thisPet.tileY - 1) == thisPetsTarget.breadcrumb[i][1]) {
                                thisPet.facing = "n";
                                breadcrumbFound = true;
                                break;
                            }
                        }
                    }

                    if (breadcrumbFound) {
                        thisPet.state = "moving";
                        thisPet.foundPath = '';
                    } else {
                        if (thisPet.foundPath != '') {
                            // try for breadcrumbs first, but use path if not
                            thisPet.facing = thisPet.foundPath[thisPet.pathIndex];
                            thisPet.pathIndex++;
                            if (thisPet.pathIndex >= thisPet.foundPath.length) {
                                // come to end of the path, try and find a new one:
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p, visibleMaps, isOverWorldMap]);
                                thisPet.state = "findingPath";
                                thisPet.foundPath = '';
                            }
                        } else {
                            if (thisPet.state != 'findingPath') {
                                // pathfind to hero
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p, visibleMaps, isOverWorldMap]);
                                thisPet.state = "findingPath";
                            }
                        }
                    }
                }
            }
          //  if (isOverWorldMap) {
                checkForSlopes(thisPet);
            /*
            } else {
                // make sure it's on the map, and not moving in from behind the hero:
                if ((thisPet.tileX >= 0) && (thisPet.tileY >= 0) && (thisPet.tileX < mapTilesX) && (thisPet.tileY < mapTilesY)) {
                    checkForSlopes(thisPet);
                }
            }
            */
        }
    }
}

function isPetBlocked(whichPet, whichFacing) {
    var isBlocked = false;
    switch (whichFacing) {
        case 'n':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX), getTileCentreCoordY(whichPet.tileY - 1))) {
                isBlocked = true;
            }
            break;

        case 's':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX), getTileCentreCoordY(whichPet.tileY + 1))) {
                isBlocked = true;
            }
            break;

        case 'e':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX + 1), getTileCentreCoordY(whichPet.tileY))) {
                isBlocked = true;
            }
            break;

        case 'w':
            if (isAPetTerrainCollision(whichPet, getTileCentreCoordX(whichPet.tileX - 1), getTileCentreCoordY(whichPet.tileY))) {
                isBlocked = true;
            }
            break;

    }
    return isBlocked;
}

function pushPetAway(whichPet) {
    // hero has collided with the pet, move the pet away so they don't block the hero in:
    var thisPet = hero.allPets[hero.activePets[whichPet]];
    if (!isPetBlocked(thisPet, hero.facing)) {
        thisPet.state = "moving";
        thisPet.facing = hero.facing;
    } else {
        // try a side:
        var possibleSidewaysMoves = [];
        switch (hero.facing) {
            case 'n':
            case 's':
                possibleSidewaysMoves = ['e', 'w'];
                break;
            case 'w':
            case 'e':
                possibleSidewaysMoves = ['n', 's'];
                break;
        }
        if (!isPetBlocked(thisPet, possibleSidewaysMoves[0])) {
            thisPet.state = "moving";
            thisPet.facing = possibleSidewaysMoves[0];
        } else if (!isPetBlocked(thisPet, possibleSidewaysMoves[1])) {
            thisPet.state = "moving";
            thisPet.facing = possibleSidewaysMoves[1];
        } else {
            thisPet.state = "wait";
        }
    }
}