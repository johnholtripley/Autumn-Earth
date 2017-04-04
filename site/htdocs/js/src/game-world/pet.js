function movePet() {
    if (hasActivePet) {
        var thisNPC, thisItem, thisPetsTarget, thisOtherPet, oldPetX, oldPetY, thisPet;
        for (var p = 0; p < hero.activePets.length; p++) {
            thisPet = hero.allPets[hero.activePets[p]];
            thisPetsTarget = thisPet.following;
            if (thisPet.state == "moving") {
                oldPetX = thisPet.x;
                oldPetY = thisPet.y;
                thisPet.drawnFacing = thisPet.facing;
                switch (thisPet.facing) {
                    case 'n':
                        thisPet.y -= thisPet.speed;
                        // check for collisions:
                        if ((isATerrainCollision(thisPet.x - thisPet.width / 2, thisPet.y - thisPet.height / 2)) || (isATerrainCollision(thisPet.x + thisPet.width / 2, thisPet.y - thisPet.height / 2))) {
                            // find the tile's bottom edge
                            var tileCollidedWith = getTileY(thisPet.y - thisPet.height / 2);
                            var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                            // use the +1 to make sure it's just clear of the collision tile
                            thisPet.y = tileBottomEdge + thisPet.height / 2 + 1;
                        }
                        break;
                    case 's':
                        thisPet.y += thisPet.speed;
                        // check for collisions:
                        if ((isATerrainCollision(thisPet.x - thisPet.width / 2, thisPet.y + thisPet.height / 2)) || (isATerrainCollision(thisPet.x + thisPet.width / 2, thisPet.y + thisPet.height / 2))) {
                            var tileCollidedWith = getTileY(thisPet.y + thisPet.height / 2);
                            var tileTopEdge = (tileCollidedWith) * tileW;
                            thisPet.y = tileTopEdge - thisPet.height / 2 - 1;
                        }
                        break;
                    case 'w':
                        thisPet.x -= thisPet.speed;
                        // check for collisions:
                        if ((isATerrainCollision(thisPet.x - thisPet.width / 2, thisPet.y + thisPet.height / 2)) || (isATerrainCollision(thisPet.x - thisPet.width / 2, thisPet.y - thisPet.height / 2))) {
                            var tileCollidedWith = getTileX(thisPet.x - thisPet.width / 2);
                            var tileRightEdge = (tileCollidedWith + 1) * tileW;
                            thisPet.x = tileRightEdge + thisPet.width / 2 + 1;
                        }
                        break;
                    case 'e':
                        thisPet.x += thisPet.speed;
                        // check for collisions:
                        if ((isATerrainCollision(thisPet.x + thisPet.width / 2, thisPet.y + thisPet.height / 2)) || (isATerrainCollision(thisPet.x + thisPet.width / 2, thisPet.y - thisPet.height / 2))) {
                            var tileCollidedWith = getTileX(thisPet.x + thisPet.width / 2);
                            var tileLeftEdge = (tileCollidedWith) * tileW;
                            thisPet.x = tileLeftEdge - thisPet.width / 2 - 1;
                        }
                        break;
                }

                // check for collisions against NPCs:
                for (var j = 0; j < thisMapData.npcs.length; j++) {
                    thisNPC = thisMapData.npcs[j];
                    if (thisNPC.isCollidable) {
                        if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.height, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height)) {
                            thisPet.x = oldPetX;
                            thisPet.y = oldPetY;
                        }
                    }
                }

                // check for collisions against other pets:
                for (var j = 0; j < hero.activePets.length; j++) {
                    if (p != j) {
                        thisOtherPet = hero.allPets[hero.activePets[j]];
                        if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.height, thisOtherPet.x, thisOtherPet.y, thisOtherPet.width, thisOtherPet.height)) {
                            thisPet.x = oldPetX;
                            thisPet.y = oldPetY;
                        }
                    }
                }

                // check for collisions against items:
                for (var j = 0; j < thisMapData.items.length; j++) {
                    thisItem = thisMapData.items[j];
                    if (isAnObjectCollision(thisPet.x, thisPet.y, thisPet.width, thisPet.height, thisItem.x, thisItem.y, thisItem.width, thisItem.height)) {
                        thisPet.x = oldPetX;
                        thisPet.y = oldPetY;
                    }
                }

                // find the difference for this movement:
                thisPet.dx += (thisPet.x - oldPetX);
                thisPet.dy += (thisPet.y - oldPetY);
                // see if it's at a new tile centre:
                var newTile = false;
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
            } else {
                if (thisPet.state != "findingPath") {
                    // check proximity to hero to see if pet should start moving:
                    if (!(isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 2))) {
                        thisPet.state = "moving";
                    }
                }
            }

            if (newTile) {
                thisPet.tileX = getTileX(thisPet.x);
                thisPet.tileY = getTileY(thisPet.y);
                if (p != (hero.activePets.length - 1)) {
                    // it's not the last one, so need to update its breadcrumb:
                    thisPet.breadcrumb.pop();
                    thisPet.breadcrumb.unshift([thisPet.tileX, thisPet.tileY]);
                }
                
                // check proximity to target to see if pet should stop moving:
            
                if ((isInRange(thisPetsTarget.x, thisPetsTarget.y, thisPet.x, thisPet.y, tileW * 2))) { 
                    thisPet.state = "wait";
                } else {
                    // check the breadcrumb for next direction:
                    var breadcrumbFound = false;
                    for (var i = 0; i < thisPetsTarget.breadcrumb.length; i++) {
                        //   console.log(thisPet.tileX + "," + thisPet.tileY + " - " + heroBreadcrumb[i][0] + "," + heroBreadcrumb[i][1]);
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
                                console.log("path ran out");
                                // come to end of the path, try and find a new one:
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p]);
                                thisPet.state = "findingPath";
                                thisPet.foundPath = '';
                            }
                        } else {
                            if (thisPet.state != 'findingPath') {
                                // pathfind to hero
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, thisPetsTarget.tileX, thisPetsTarget.tileY, p]);
                                thisPet.state = "findingPath";
                            }
                        }
                    }
                }
            }
        }
    }
}

function pushPetAway(whichPet) {
    // hero has collided with the pet, move the pet away so they don't block the hero in:
    hero.allPets[hero.activePets[whichPet]].state = "moving";
    hero.allPets[hero.activePets[whichPet]].facing = hero.facing;
}
