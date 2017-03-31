function movePet() {
    if (hasActivePet) {
        if (hero.activePet.state == "moving") {
            var thisNPC, thisItem;
            var oldPetX = hero.activePet.x;
            var oldPetY = hero.activePet.y;
            hero.activePet.drawnFacing = hero.activePet.facing;
            switch (hero.activePet.facing) {
                case 'n':
                    hero.activePet.y -= hero.activePet.speed;
                    // check for collisions:
                    if ((isATerrainCollision(hero.activePet.x - hero.activePet.width / 2, hero.activePet.y - hero.activePet.height / 2)) || (isATerrainCollision(hero.activePet.x + hero.activePet.width / 2, hero.activePet.y - hero.activePet.height / 2))) {
                        // find the tile's bottom edge
                        var tileCollidedWith = getTileY(hero.activePet.y - hero.activePet.height / 2);
                        var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                        // use the +1 to make sure it's just clear of the collision tile
                        hero.activePet.y = tileBottomEdge + hero.activePet.height / 2 + 1;
                    }
                    break;
                case 's':
                    hero.activePet.y += hero.activePet.speed;
                    // check for collisions:
                    if ((isATerrainCollision(hero.activePet.x - hero.activePet.width / 2, hero.activePet.y + hero.activePet.height / 2)) || (isATerrainCollision(hero.activePet.x + hero.activePet.width / 2, hero.activePet.y + hero.activePet.height / 2))) {
                        var tileCollidedWith = getTileY(hero.activePet.y + hero.activePet.height / 2);
                        var tileTopEdge = (tileCollidedWith) * tileW;
                        hero.activePet.y = tileTopEdge - hero.activePet.height / 2 - 1;
                    }
                    break;
                case 'w':
                    hero.activePet.x -= hero.activePet.speed;
                    // check for collisions:
                    if ((isATerrainCollision(hero.activePet.x - hero.activePet.width / 2, hero.activePet.y + hero.activePet.height / 2)) || (isATerrainCollision(hero.activePet.x - hero.activePet.width / 2, hero.activePet.y - hero.activePet.height / 2))) {
                        var tileCollidedWith = getTileX(hero.activePet.x - hero.activePet.width / 2);
                        var tileRightEdge = (tileCollidedWith + 1) * tileW;
                        hero.activePet.x = tileRightEdge + hero.activePet.width / 2 + 1;
                    }
                    break;
                case 'e':
                    hero.activePet.x += hero.activePet.speed;
                    // check for collisions:
                    if ((isATerrainCollision(hero.activePet.x + hero.activePet.width / 2, hero.activePet.y + hero.activePet.height / 2)) || (isATerrainCollision(hero.activePet.x + hero.activePet.width / 2, hero.activePet.y - hero.activePet.height / 2))) {
                        var tileCollidedWith = getTileX(hero.activePet.x + hero.activePet.width / 2);
                        var tileLeftEdge = (tileCollidedWith) * tileW;
                        hero.activePet.x = tileLeftEdge - hero.activePet.width / 2 - 1;
                    }
                    break;
            }

            // check for collisions against NPCs:
            for (var j = 0; j < thisMapData.npcs.length; j++) {
                if (i != j) {
                    thisNPC = thisMapData.npcs[j];
                    if (thisNPC.isCollidable) {
                        if (isAnObjectCollision(hero.activePet.x, hero.activePet.y, hero.activePet.width, hero.activePet.height, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height)) {
                            hero.activePet.x = oldPetX;
                            hero.activePet.y = oldPetY;
                        }
                    }
                }
            }

            // check for collisions against items:
            for (var j = 0; j < thisMapData.items.length; j++) {
                thisItem = thisMapData.items[j];
                if (isAnObjectCollision(hero.activePet.x, hero.activePet.y, hero.activePet.width, hero.activePet.height, thisItem.x, thisItem.y, thisItem.width, thisItem.height)) {
                    hero.activePet.x = oldPetX;
                    hero.activePet.y = oldPetY;
                }
            }

            // find the difference for this movement:
            hero.activePet.dx += (hero.activePet.x - oldPetX);
            hero.activePet.dy += (hero.activePet.y - oldPetY);
            // see if it's at a new tile centre:
            var newTile = false;
            if (Math.abs(hero.activePet.dx) >= tileW) {
                if (hero.activePet.dx > 0) {
                    hero.activePet.dx -= tileW;
                } else {
                    hero.activePet.dx += tileW;
                }
                newTile = true;
            }
            if (Math.abs(hero.activePet.dy) >= tileW) {
                if (hero.activePet.dy > 0) {
                    hero.activePet.dy -= tileW;
                } else {
                    hero.activePet.dy += tileW;
                }
                newTile = true;
            }
        } else {
            if (hero.activePet.state != "findingPath") {
                // check proximity to hero to see if pet should start moving:
                if (!(isInRange(hero.x, hero.y, hero.activePet.x, hero.activePet.y, tileW * 2))) {
                    hero.activePet.state = "moving";
                }
            }
        }
        
        if (newTile) {
            hero.activePet.tileX = getTileX(hero.activePet.x);
            hero.activePet.tileY = getTileY(hero.activePet.y);
            // check proximity to hero to see if pet should stop moving:
            if ((isInRange(hero.x, hero.y, hero.activePet.x, hero.activePet.y, tileW * 2))) {
                hero.activePet.state = "wait";
            } else {
                // check the breadcrumb for next direction:
                var breadcrumbFound = false;
                for (var i = 0; i < heroBreadcrumblength; i++) {
                    //   console.log(hero.activePet.tileX + "," + hero.activePet.tileY + " - " + heroBreadcrumb[i][0] + "," + heroBreadcrumb[i][1]);
                    if ((hero.activePet.tileY) == heroBreadcrumb[i][1]) {
                        if ((hero.activePet.tileX - 1) == heroBreadcrumb[i][0]) {
                            hero.activePet.facing = "w";
                            breadcrumbFound = true;
                            break;
                        } else if ((hero.activePet.tileX + 1) == heroBreadcrumb[i][0]) {
                            hero.activePet.facing = "e";
                            breadcrumbFound = true;
                            break;
                        }
                    } else if ((hero.activePet.tileX) == heroBreadcrumb[i][0]) {
                        if ((hero.activePet.tileY + 1) == heroBreadcrumb[i][1]) {
                            hero.activePet.facing = "s";
                            breadcrumbFound = true;
                            break;
                        } else if ((hero.activePet.tileY - 1) == heroBreadcrumb[i][1]) {
                            hero.activePet.facing = "n";
                            breadcrumbFound = true;
                            break;
                        }
                    }
                }
                if (breadcrumbFound) {
                    hero.activePet.state = "moving";
                    hero.activePet.foundPath = '';
                } else {
                    if (hero.activePet.foundPath != '') {
                        // try for breadcrumbs first, but use path if not
                        hero.activePet.facing = hero.activePet.foundPath[hero.activePet.pathIndex];
                        hero.activePet.pathIndex++;
                        if (hero.activePet.pathIndex >= hero.activePet.foundPath.length) {
                            console.log("path ran out");
                            // come to end of the path, try and find a new one:
                            pathfindingWorker.postMessage(['petToHero', hero.activePet, thisMapData, hero.tileX, hero.tileY]);
                            hero.activePet.state = "findingPath";
                            hero.activePet.foundPath = '';
                        }
                    } else {
                        if (hero.activePet.state != 'findingPath') {
                            // pathfind to hero
                            pathfindingWorker.postMessage(['petToHero', hero.activePet, thisMapData, hero.tileX, hero.tileY]);
                            hero.activePet.state = "findingPath";
                        }
                    }
                }
            }
        }
    }
}

function pushPetAway() {
    // hero has collided with the pet, move the pet away so they don't block the hero in:
    hero.activePet.state = "moving";
    hero.activePet.facing = hero.facing;
}
