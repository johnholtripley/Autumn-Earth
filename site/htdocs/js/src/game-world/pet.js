function movePet() {
    if (hasActivePet) {
        for (var p = 0; p < hero.activePets.length; p++) {
            if (hero.allPets[hero.activePets[p]].state == "moving") {
                var thisNPC, thisItem;
                var oldPetX = hero.allPets[hero.activePets[p]].x;
                var oldPetY = hero.allPets[hero.activePets[p]].y;
                hero.allPets[hero.activePets[p]].drawnFacing = hero.allPets[hero.activePets[p]].facing;
                switch (hero.allPets[hero.activePets[p]].facing) {
                    case 'n':
                        hero.allPets[hero.activePets[p]].y -= hero.allPets[hero.activePets[p]].speed;
                        // check for collisions:
                        if ((isATerrainCollision(hero.allPets[hero.activePets[p]].x - hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y - hero.allPets[hero.activePets[p]].height / 2)) || (isATerrainCollision(hero.allPets[hero.activePets[p]].x + hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y - hero.allPets[hero.activePets[p]].height / 2))) {
                            // find the tile's bottom edge
                            var tileCollidedWith = getTileY(hero.allPets[hero.activePets[p]].y - hero.allPets[hero.activePets[p]].height / 2);
                            var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                            // use the +1 to make sure it's just clear of the collision tile
                            hero.allPets[hero.activePets[p]].y = tileBottomEdge + hero.allPets[hero.activePets[p]].height / 2 + 1;
                        }
                        break;
                    case 's':
                        hero.allPets[hero.activePets[p]].y += hero.allPets[hero.activePets[p]].speed;
                        // check for collisions:
                        if ((isATerrainCollision(hero.allPets[hero.activePets[p]].x - hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y + hero.allPets[hero.activePets[p]].height / 2)) || (isATerrainCollision(hero.allPets[hero.activePets[p]].x + hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y + hero.allPets[hero.activePets[p]].height / 2))) {
                            var tileCollidedWith = getTileY(hero.allPets[hero.activePets[p]].y + hero.allPets[hero.activePets[p]].height / 2);
                            var tileTopEdge = (tileCollidedWith) * tileW;
                            hero.allPets[hero.activePets[p]].y = tileTopEdge - hero.allPets[hero.activePets[p]].height / 2 - 1;
                        }
                        break;
                    case 'w':
                        hero.allPets[hero.activePets[p]].x -= hero.allPets[hero.activePets[p]].speed;
                        // check for collisions:
                        if ((isATerrainCollision(hero.allPets[hero.activePets[p]].x - hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y + hero.allPets[hero.activePets[p]].height / 2)) || (isATerrainCollision(hero.allPets[hero.activePets[p]].x - hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y - hero.allPets[hero.activePets[p]].height / 2))) {
                            var tileCollidedWith = getTileX(hero.allPets[hero.activePets[p]].x - hero.allPets[hero.activePets[p]].width / 2);
                            var tileRightEdge = (tileCollidedWith + 1) * tileW;
                            hero.allPets[hero.activePets[p]].x = tileRightEdge + hero.allPets[hero.activePets[p]].width / 2 + 1;
                        }
                        break;
                    case 'e':
                        hero.allPets[hero.activePets[p]].x += hero.allPets[hero.activePets[p]].speed;
                        // check for collisions:
                        if ((isATerrainCollision(hero.allPets[hero.activePets[p]].x + hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y + hero.allPets[hero.activePets[p]].height / 2)) || (isATerrainCollision(hero.allPets[hero.activePets[p]].x + hero.allPets[hero.activePets[p]].width / 2, hero.allPets[hero.activePets[p]].y - hero.allPets[hero.activePets[p]].height / 2))) {
                            var tileCollidedWith = getTileX(hero.allPets[hero.activePets[p]].x + hero.allPets[hero.activePets[p]].width / 2);
                            var tileLeftEdge = (tileCollidedWith) * tileW;
                            hero.allPets[hero.activePets[p]].x = tileLeftEdge - hero.allPets[hero.activePets[p]].width / 2 - 1;
                        }
                        break;
                }

                // check for collisions against NPCs:
                for (var j = 0; j < thisMapData.npcs.length; j++) {
                    if (i != j) {
                        thisNPC = thisMapData.npcs[j];
                        if (thisNPC.isCollidable) {
                            if (isAnObjectCollision(hero.allPets[hero.activePets[p]].x, hero.allPets[hero.activePets[p]].y, hero.allPets[hero.activePets[p]].width, hero.allPets[hero.activePets[p]].height, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height)) {
                                hero.allPets[hero.activePets[p]].x = oldPetX;
                                hero.allPets[hero.activePets[p]].y = oldPetY;
                            }
                        }
                    }
                }

                // check for collisions against items:
                for (var j = 0; j < thisMapData.items.length; j++) {
                    thisItem = thisMapData.items[j];
                    if (isAnObjectCollision(hero.allPets[hero.activePets[p]].x, hero.allPets[hero.activePets[p]].y, hero.allPets[hero.activePets[p]].width, hero.allPets[hero.activePets[p]].height, thisItem.x, thisItem.y, thisItem.width, thisItem.height)) {
                        hero.allPets[hero.activePets[p]].x = oldPetX;
                        hero.allPets[hero.activePets[p]].y = oldPetY;
                    }
                }

                // find the difference for this movement:
                hero.allPets[hero.activePets[p]].dx += (hero.allPets[hero.activePets[p]].x - oldPetX);
                hero.allPets[hero.activePets[p]].dy += (hero.allPets[hero.activePets[p]].y - oldPetY);
                // see if it's at a new tile centre:
                var newTile = false;
                if (Math.abs(hero.allPets[hero.activePets[p]].dx) >= tileW) {
                    if (hero.allPets[hero.activePets[p]].dx > 0) {
                        hero.allPets[hero.activePets[p]].dx -= tileW;
                    } else {
                        hero.allPets[hero.activePets[p]].dx += tileW;
                    }
                    newTile = true;
                }
                if (Math.abs(hero.allPets[hero.activePets[p]].dy) >= tileW) {
                    if (hero.allPets[hero.activePets[p]].dy > 0) {
                        hero.allPets[hero.activePets[p]].dy -= tileW;
                    } else {
                        hero.allPets[hero.activePets[p]].dy += tileW;
                    }
                    newTile = true;
                }
            } else {
                if (hero.allPets[hero.activePets[p]].state != "findingPath") {
                    // check proximity to hero to see if pet should start moving:
                    if (!(isInRange(hero.x, hero.y, hero.allPets[hero.activePets[p]].x, hero.allPets[hero.activePets[p]].y, tileW * 2))) {
                        hero.allPets[hero.activePets[p]].state = "moving";
                    }
                }
            }

            if (newTile) {
                hero.allPets[hero.activePets[p]].tileX = getTileX(hero.allPets[hero.activePets[p]].x);
                hero.allPets[hero.activePets[p]].tileY = getTileY(hero.allPets[hero.activePets[p]].y);
                // check proximity to hero to see if pet should stop moving:
                if ((isInRange(hero.x, hero.y, hero.allPets[hero.activePets[p]].x, hero.allPets[hero.activePets[p]].y, tileW * 2))) {
                    hero.allPets[hero.activePets[p]].state = "wait";
                } else {
                    // check the breadcrumb for next direction:
                    var breadcrumbFound = false;
                    for (var i = 0; i < heroBreadcrumblength; i++) {
                        //   console.log(hero.allPets[hero.activePets[p]].tileX + "," + hero.allPets[hero.activePets[p]].tileY + " - " + heroBreadcrumb[i][0] + "," + heroBreadcrumb[i][1]);
                        if ((hero.allPets[hero.activePets[p]].tileY) == heroBreadcrumb[i][1]) {
                            if ((hero.allPets[hero.activePets[p]].tileX - 1) == heroBreadcrumb[i][0]) {
                                hero.allPets[hero.activePets[p]].facing = "w";
                                breadcrumbFound = true;
                                break;
                            } else if ((hero.allPets[hero.activePets[p]].tileX + 1) == heroBreadcrumb[i][0]) {
                                hero.allPets[hero.activePets[p]].facing = "e";
                                breadcrumbFound = true;
                                break;
                            }
                        } else if ((hero.allPets[hero.activePets[p]].tileX) == heroBreadcrumb[i][0]) {
                            if ((hero.allPets[hero.activePets[p]].tileY + 1) == heroBreadcrumb[i][1]) {
                                hero.allPets[hero.activePets[p]].facing = "s";
                                breadcrumbFound = true;
                                break;
                            } else if ((hero.allPets[hero.activePets[p]].tileY - 1) == heroBreadcrumb[i][1]) {
                                hero.allPets[hero.activePets[p]].facing = "n";
                                breadcrumbFound = true;
                                break;
                            }
                        }
                    }
                    if (breadcrumbFound) {
                        hero.allPets[hero.activePets[p]].state = "moving";
                        hero.allPets[hero.activePets[p]].foundPath = '';
                    } else {
                        if (hero.allPets[hero.activePets[p]].foundPath != '') {
                            // try for breadcrumbs first, but use path if not
                            hero.allPets[hero.activePets[p]].facing = hero.allPets[hero.activePets[p]].foundPath[hero.allPets[hero.activePets[p]].pathIndex];
                            hero.allPets[hero.activePets[p]].pathIndex++;
                            if (hero.allPets[hero.activePets[p]].pathIndex >= hero.allPets[hero.activePets[p]].foundPath.length) {
                                console.log("path ran out");
                                // come to end of the path, try and find a new one:
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, hero.tileX, hero.tileY, p]);
                                hero.allPets[hero.activePets[p]].state = "findingPath";
                                hero.allPets[hero.activePets[p]].foundPath = '';
                            }
                        } else {
                            if (hero.allPets[hero.activePets[p]].state != 'findingPath') {
                                // pathfind to hero
                                pathfindingWorker.postMessage(['petToHero', hero.allPets[hero.activePets[p]], thisMapData, hero.tileX, hero.tileY, p]);
                                hero.allPets[hero.activePets[p]].state = "findingPath";
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
