// service worker:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/game-world/serviceWorker.min.js', {
        scope: '/game-world/'
    });
}

function init() {
    gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        canvasWidth = gameCanvas.width;
        canvasHeight = gameCanvas.height;
    }
    whichTransitionEvent = determineWhichTransitionEvent();
    gameMode = "mapLoading";
    UI.init();
    // detect and set up input methods:
    Input.init();
    // show loading screen while getting assets:
    gameLoop();

    getHeroGameState();

}

function getHeroGameState() {
    getJSON("/data/chr" + characterId + "/gameState.json", function(data) {
        //  thisMapData = data.map;
        hero.tileX = data.tileX;
        hero.tileY = data.tileY;
        currentMap = data.currentMap;
        newMap = currentMap;
        hero.bags = data.bags;
        hero.inventory = data.inventory;
        loadCoreAssets();
    }, function(status) {
        // error - try again:
        getHeroGameState();
    });
}

function loadCoreAssets() {
    coreImagesToLoad = [];
    coreImagesToLoad.push({
        name: "heroImg",
        src: '/images/game-world/core/test-iso-hero.png'
    });
    Loader.preload(coreImagesToLoad, prepareCoreAssets, loadingProgress);
}

function prepareCoreAssets() {
    heroImg = Loader.getImage("heroImg");
    loadMap();
}

function loadMapJSON(mapFilePath) {
    console.log("mapFilePath: " + mapFilePath);
    getJSON(mapFilePath, function(data) {
        thisMapData = data.map;
        mapTilesY = thisMapData.terrain.length;
        mapTilesX = thisMapData.terrain[0].length;
        if (previousZoneName != thisMapData.zoneName) {
            UI.showZoneName(thisMapData.zoneName);
            document.title = titleTagPrefix+' - '+thisMapData.zoneName;
        }
        findInventoryItemData();

    }, function(status) {
        // alert('Error loading data for map #' + currentMap+" --- "+mapFilePath);
        // try again:
        loadMapJSON(mapFilePath);
    });
}

function loadMap() {
    var mapFilePath;
    console.log("going from " + currentMap + " to " + newMap);
    // check for newly entering a random dungeon:
    if ((newMap < 0) && (currentMap > 0)) {
        randomDungeonName = randomDungeons[Math.abs(newMap)];
        newMap = -1;
    } else {
        mapFilePath = '/data/chr' + characterId + '/map' + newMap + '.json';
    }
    if (newMap < 0) {
        // find door centre:
        var targetDoorX = 0;
        var targetDoorY = 0;
        var doorData = thisMapData.doors;
        for (var i = 0 in doorData) {
            if (doorData[i].map == newMap) {
                targetDoorX += doorData[i].startX;
                targetDoorY += doorData[i].startY;
            }
        }
        // this assumes random maps always have a 3x1 doorway (the average of the doors will be the centre door)
        var centreDoorX = targetDoorX / 3;
        var centreDoorY = targetDoorY / 3;
        mapFilePath = '/generateDungeonMap.php?playerId=' + characterId + '&originatingMapId=' + currentMap + '&requestedMap=' + newMap + '&dungeonName=' + randomDungeonName + '&connectingDoorX=' + centreDoorX + '&connectingDoorY=' + centreDoorY;
    }
    currentMap = newMap;
    loadMapJSON(mapFilePath);
}






function loadMapAssets() {
    imagesToLoad = [];
    var assetPath = currentMap;
    if (currentMap < 0) {
        assetPath = 'dungeon/' + randomDungeonName;
    }
    imagesToLoad.push({
        name: "backgroundImg",
        src: '/images/game-world/maps/' + assetPath + '/bg.png'
    });
    tileGraphicsToLoad = thisMapData.graphics;
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        imagesToLoad.push({
            name: "tile" + i,
            src: "/images/game-world/maps/" + assetPath + "/" + tileGraphicsToLoad[i].src
        });
    }
    npcGraphicsToLoad = thisMapData.npcs;
    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        imagesToLoad.push({
            name: "npc" + i,
            src: "/images/game-world/npcs/" + npcGraphicsToLoad[i].src
        });
    }

    itemGraphicsToLoad = thisMapData.items;
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {
        imagesToLoad.push({
            name: "item" + i,
            src: "/images/game-world/items/" + currentActiveInventoryItems[itemGraphicsToLoad[i].type].worldSrc
        });
    }

    Loader.preload(imagesToLoad, prepareGame, loadingProgress);
}





function findInventoryItemData() {
    var itemIdsToGet = [];
    // find out all items in the hero's inventory:
    for (var arrkey in hero.inventory) {
        if (hero.inventory.hasOwnProperty(arrkey)) {
            //console.log(key + " -> " + hero.inventory[arrkey].type);
            // make sure it's not already added:
            if (itemIdsToGet.indexOf(hero.inventory[arrkey].type) == -1) {
                itemIdsToGet.push(hero.inventory[arrkey].type);
            }
        }
    }
    // find bag items:
    for (var i = 0; i < hero.bags.length; i++) {
        itemIdsToGet.push(hero.bags[i].type);
    }
    // find items placed on this map:
    for (var i = 0; i < thisMapData.items.length; i++) {
        itemIdsToGet.push(thisMapData.items[i].type);
    }




    // find item available in any shops:
    // ####
    loadInventoryItemData(itemIdsToGet.join("|"));
}



function loadInventoryItemData(itemIdsToLoad) {
    getJSON("/game-world/getInventoryItems.php?whichIds=" + itemIdsToLoad, function(data) {
        currentActiveInventoryItems = data;


        if (!inventoryInterfaceIsBuilt) {
            UI.buildInventoryInterface();
        }
        loadMapAssets();
    }, function(status) {
        // try again:
        loadInventoryItemData(itemIdsToLoad);
    });
}





function prepareGame() {
    // get map image references:
    tileImages = [];
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[i] = Loader.getImage("tile" + i);
    }
    npcImages = [];
    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        npcImages[i] = Loader.getImage("npc" + i);
    }
    itemImages = [];
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {
        itemImages[i] = Loader.getImage("item" + i);
    }
    backgroundImg = Loader.getImage("backgroundImg");
    // initialise and position NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisMapData.npcs[i].x = getTileCentreCoordX(thisMapData.npcs[i].tileX);
        thisMapData.npcs[i].y = getTileCentreCoordY(thisMapData.npcs[i].tileY);

        thisMapData.npcs[i].dx = 0;
        thisMapData.npcs[i].dy = 0;
        // set index to -1 so when it increases, it'll pick up the first (0) element:
        thisMapData.npcs[i].movementIndex = -1;
    }
    // initialise items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        thisMapData.items[i].x = getTileCentreCoordX(thisMapData.items[i].tileX);
        thisMapData.items[i].y = getTileCentreCoordY(thisMapData.items[i].tileY);

        thisMapData.items[i].width = currentActiveInventoryItems[thisMapData.items[i].type].width;
        thisMapData.items[i].height = currentActiveInventoryItems[thisMapData.items[i].type].height;

        thisMapData.items[i].centreX = currentActiveInventoryItems[thisMapData.items[i].type].centreX;
        thisMapData.items[i].centreY = currentActiveInventoryItems[thisMapData.items[i].type].centreY;
    }

    // determine tile offset to centre the hero in the centre
    hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);
    timeSinceLastFrameSwap = 0;
    currentAnimationFrame = 0;
    mapTransition = "in";
    mapTransitionCurrentFrames = 1;
    gameMode = "play";
}


function removeMapAssets() {
    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[i].src = '';
        tileImages[i] = null;
    }
    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        npcImages[i].src = '';
        npcImages[i] = null;
    }
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {
        itemImages[i].src = '';
        itemImages[i] = null;
    }
    backgroundImg.src = '';
    backgroundImg = null;
}

function loadingProgress() {
    // make this graphical ####
    console.log("loading - " + Loader.getProgress());
}

function changeMaps(doorX, doorY) {
    previousZoneName = thisMapData.zoneName;
    gameMode = "mapLoading";
    removeMapAssets();
    var doorData = thisMapData.doors;
    var whichDoor = getTileX(doorX) + "," + getTileX(doorY);
    hero.tileX = doorData[whichDoor].startX;
    hero.tileY = doorData[whichDoor].startY;
    newMap = doorData[whichDoor].map;
    loadMap();
}

function isATerrainCollision(x, y) {
    // check map bounds first:
    var tileX = getTileX(x);
    var tileY = getTileY(y);
    if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
        // is out of the bounds of the current map:
        return 1;
    } else {
        switch (thisMapData.collisions[tileY][tileX]) {
            case 1:
                // is a collision:
                return 1;
                break;
            case "d":
                // is a door:

                activeDoorX = x;
                activeDoorY = y;
                return 0;
                break;
            default:
                // not a collsiion:
                return 0;
        }
    }
}


function startDoorTransition() {
    if (mapTransition == "") {
        mapTransitionCurrentFrames = 1;
        mapTransition = "out";
    }
}

function getHeroAsCloseAsPossibleToObject(objx, objy, objw, objh) {

    switch (hero.facing) {
        case "n":
            hero.y = objy + objh / 2 + hero.height / 2 + 1;
            break;
        case "s":
            hero.y = objy - objh / 2 - hero.height / 2 - 1;
            break;
        case "w":
            hero.x = objx + objw / 2 + hero.width / 2 + 1;
            break;
        case "e":
            hero.x = objx - objw / 2 - hero.width / 2 - 1;
            break;

    }

}

function checkHeroCollisions() {
    activeDoorX = -1;
    activeDoorY = -1;

    // tile collisions:
    if (key[2]) {
        // up
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            // find the tile's bottom edge
            var tileCollidedWith = getTileY(hero.y - hero.height / 2);
            var tileBottomEdge = (tileCollidedWith + 1) * tileW;
            // use the +1 to make sure it's just clear of the collision tile
            hero.y = tileBottomEdge + hero.height / 2 + 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }
    if (key[3]) {
        // down
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2))) {
            var tileCollidedWith = getTileY(hero.y + hero.height / 2);
            var tileTopEdge = (tileCollidedWith) * tileW;
            hero.y = tileTopEdge - hero.height / 2 - 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }
    if (key[0]) {
        // left/west
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x - hero.width / 2);
            var tileRightEdge = (tileCollidedWith + 1) * tileW;
            hero.x = tileRightEdge + hero.width / 2 + 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }
    if (key[1]) {
        //right/east
        if ((isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x + hero.width / 2);
            var tileLeftEdge = (tileCollidedWith) * tileW;
            hero.x = tileLeftEdge - hero.width / 2 - 1;
        } else if (activeDoorX != -1) {
            startDoorTransition();
        }
    }


    // check for collisions against NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.isCollidable) {
            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, hero.x, hero.y, hero.width, hero.height)) {
                getHeroAsCloseAsPossibleToObject(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height);
            }
        }
    }
    // check for collisions against items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        thisItem = thisMapData.items[i];
        if (isAnObjectCollision(thisItem.x, thisItem.y, thisItem.width, thisItem.height, hero.x, hero.y, hero.width, hero.height)) {
            getHeroAsCloseAsPossibleToObject(thisItem.x, thisItem.y, thisItem.width, thisItem.height);
        }
    }
}



function gameLoop() {
    switch (gameMode) {
        case "mapLoading":
            console.log("loading map assets...");
            break;
        case "paused":
            //
            break;
        case "play":
            update();
            draw();
            break;
    }
    window.requestAnimationFrame(gameLoop);
}

function update() {
    var now = window.performance.now();
    var elapsed = (now - lastTime);
    lastTime = now;
    hero.isMoving = false;
    oldHeroX = hero.x;
    oldHeroY = hero.y;
    var thisSpeed = hero.speed;
    if (key[5]) {
        thisSpeed *= 2;
    }
    if (mapTransition != "out") {
        // Handle the Input
        if (key[2]) {
            hero.isMoving = true;
            hero.facing = 'n';
            hero.y -= thisSpeed;
        } else if (key[3]) {
            hero.isMoving = true;
            hero.facing = 's';
            hero.y += thisSpeed;
        } else if (key[1]) {
            hero.isMoving = true;
            hero.facing = 'e';
            hero.x += thisSpeed;
        } else if (key[0]) {
            hero.isMoving = true;
            hero.facing = 'w';
            hero.x -= thisSpeed;
        }
        if (key[4]) {
            checkForActions();
        }
        checkHeroCollisions();
        hero.tileX = getTileX(hero.x);
        hero.tileY = getTileY(hero.y);
    } else {
        hero.isMoving = true;
        // continue the hero moving:
        switch (hero.facing) {
            case 'n':
                hero.y -= thisSpeed;
                break;
            case 's':
                hero.y += thisSpeed;
                break;
            case 'e':
                hero.x += thisSpeed;
                break;
            case 'w':
                hero.x -= thisSpeed;
                break;
        }
        mapTransitionCurrentFrames++;
        if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
            changeMaps(activeDoorX, activeDoorY);
        }
    }
    if (mapTransition == "in") {
        // make it transition in twice as fast:
        mapTransitionCurrentFrames += 2;
        if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
            mapTransition = "";
        }
    }
    timeSinceLastFrameSwap += elapsed;
    if (timeSinceLastFrameSwap > animationUpdateTime) {
        currentAnimationFrame++;
        timeSinceLastFrameSwap = 0;
    }
    /*if (hero.timeSinceLastFrameSwap > hero.animationUpdateTime) {
        var seq = (hero.isMoving ? 'walk-' : 'stand-') + hero.facing;
        var currentSequence = hero.sequences[seq];
        if (hero.animationFrameIndex < currentSequence.length - 1) {
            hero.animationFrameIndex += 1;
        } else {
            hero.animationFrameIndex = 0;
        }
        var col = currentSequence[hero.animationFrameIndex] % 7;
        var row = Math.floor(currentSequence[hero.animationFrameIndex] / 7);
        hero.offsetX = col * hero.width;
        hero.offsetY = row * hero.height;
        hero.timeSinceLastFrameSwap = 0;
    }
    */

    moveNPCs();
}

function canAddItemToInventory(itemObj) {
    // make copy of inventory:
    var inventoryClone = JSON.parse(JSON.stringify(hero.inventory));
    var quantityAddedSoFar = 0;
    var slotsUpdated = [];
    // check if this type exist in the current inventory:
    var inventoryKeysFound = getObjectKeysForInnerValue(inventoryClone, itemObj.type, "type");
    if (inventoryKeysFound.length > 0) {
        // loop through keysFound and add to the slot maximum
        for (var i = 0; i < inventoryKeysFound.length; i++) {
            if (itemAttributesMatch(inventoryClone[inventoryKeysFound[i]], itemObj)) {
                console.log("attributes match");
                var quantityOnSlotAlready = inventoryClone[inventoryKeysFound[i]].quantity;
                var amountAddedToThisSlot = (maxNumberOfItemsPerSlot - quantityOnSlotAlready) > (itemObj.quantity - quantityAddedSoFar) ? (itemObj.quantity - quantityAddedSoFar) : maxNumberOfItemsPerSlot - quantityOnSlotAlready;
                quantityAddedSoFar += amountAddedToThisSlot;
                // add item to this slot:
                slotsUpdated.push((inventoryKeysFound[i]));
                inventoryClone[inventoryKeysFound[i]].quantity += amountAddedToThisSlot;
                if (quantityAddedSoFar >= itemObj.quantity) {
                    break;
                }
            }
        }
    }
    if (quantityAddedSoFar < itemObj.quantity) {
        // either filled all matching slots, or couldn't find any matching slots - find an empty slot
        outerLoop: for (var i = 0; i < hero.bags.length; i++) {
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                var thisSlotsID = i + '-' + j;
                if (!(thisSlotsID in inventoryClone)) {
                    // empty slot:
                    var amountAddedToThisSlot = maxNumberOfItemsPerSlot > (itemObj.quantity - quantityAddedSoFar) ? (itemObj.quantity - quantityAddedSoFar) : maxNumberOfItemsPerSlot;
                    quantityAddedSoFar += amountAddedToThisSlot;
                    // add item to this slot:
                    slotsUpdated.push(thisSlotsID);
                    inventoryClone[thisSlotsID] = new Object();
                    inventoryClone[thisSlotsID].type = itemObj.type;
                    inventoryClone[thisSlotsID].quantity = amountAddedToThisSlot;
                    inventoryClone[thisSlotsID].quality = itemObj.quality;
                    inventoryClone[thisSlotsID].durability = itemObj.durability;
                    inventoryClone[thisSlotsID].currentWear = itemObj.currentWear;
                    inventoryClone[thisSlotsID].effectiveness = itemObj.effectiveness;
                    inventoryClone[thisSlotsID].wrapped = itemObj.wrapped;
                    inventoryClone[thisSlotsID].colour = itemObj.colour;
                    inventoryClone[thisSlotsID].enchanted = itemObj.enchanted;
                    inventoryClone[thisSlotsID].hallmark = itemObj.hallmark;
                    inventoryClone[thisSlotsID].inscription = itemObj.inscription;
                    if (quantityAddedSoFar >= itemObj.quantity) {
                        // stop both loops:
                        break outerLoop;
                    }
                }
            }
        }
    }
    if (quantityAddedSoFar == itemObj.quantity) {
        // make the active inventory be the same as the amended one:
        hero.inventory = JSON.parse(JSON.stringify(inventoryClone));
        // return success, and the slots that were affected:
        return [true, slotsUpdated];
    } else {
        // don't change the current inventory - return false:
        return [false];
    }
}




function itemAttributesMatch(item1, item2) {
    // 'type' has already been checked
    if (item1.quality == item2.quality) {
        if (item1.durability == item2.durability) {
            if (item1.currentWear == item2.currentWear) {
                if (item1.effectiveness == item2.effectiveness) {
                    if (item1.wrapped == item2.wrapped) {
                        if (item1.colour == item2.colour) {
                            if (item1.enchanted == item2.enchanted) {
                                if (item1.hallmark == item2.hallmark) {
                                    if (item1.inscription == item2.inscription) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function removeSlotStatus() {
elementList = document.querySelectorAll('#inventoryPanels .changed');
for (var i=0;i<elementList.length;i++) {
    removeClass(elementList[i],'changed');
}
}

function checkForActions() {
    var inventoryCheck = [];
    var slotMarkup, thisSlotsId, thisSlotElem;
    // loop through items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (isInRange(hero.x, hero.y, thisMapData.items[i].x, thisMapData.items[i].y, (thisMapData.items[i].width / 2 + hero.width / 2 + 6))) {
            if (isFacing(hero, thisMapData.items[i])) {
                switch (currentActiveInventoryItems[itemGraphicsToLoad[i].type].action) {
                    case "static":
                        // can't interact with it - do nothing
                        break;
                    default:
                        // try and pick it up:
                        inventoryCheck = canAddItemToInventory(thisMapData.items[i]);
                        if (inventoryCheck[0]) {
                            // remove from map:
                            thisMapData.items.splice(i, 1);
                            // visually update inventory
                            // loop through the slots that have changed and update their markup:
                            for (var j = 0; j < inventoryCheck[1].length; j++) {
                                thisSlotsId = inventoryCheck[1][j];
                                slotMarkup = '<img src="/images/game-world/inventory-items/' + hero.inventory[thisSlotsId].type + '.png" alt="">';
                                slotMarkup += '<span class="qty">' + hero.inventory[thisSlotsId].quantity + '</span>';
                                slotMarkup += '<p><em>' + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].shortname + ' </em>' + currentActiveInventoryItems[hero.inventory[thisSlotsId].type].description + ' <span class="price">Sell price: ' + parseMoney(hero.inventory[thisSlotsId].quantity * currentActiveInventoryItems[hero.inventory[thisSlotsId].type].priceCode, 0) + '</span></p>';
                                thisSlotElem = document.getElementById("slot" + thisSlotsId);
                                thisSlotElem.innerHTML = slotMarkup;
                                thisSlotElem.addEventListener(whichTransitionEvent, removeSlotStatus, true);
                                addClass(thisSlotElem, "changed");
                            }
                        } else {
                            // ###
                            alert("no room in the inventory");
                        }
                }
            }
        }
    }

    // loop through NPCs:
    // #######

    // action processed, so cancel the key event:
    key[4] = 0;
}








function moveNPCs() {
    var thisNPC, newTile, thisNextMovement, oldNPCx, oldNPCy;
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.isMoving) {
            oldNPCx = thisNPC.x;
            oldNPCy = thisNPC.y;
            switch (thisNPC.facing) {
                case 'n':
                    thisNPC.y -= thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.height / 2))) {
                        // find the tile's bottom edge
                        var tileCollidedWith = getTileY(thisNPC.y - thisNPC.height / 2);
                        var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                        // use the +1 to make sure it's just clear of the collision tile
                        thisNPC.y = tileBottomEdge + thisNPC.height / 2 + 1;
                    }

                    break;
                case 's':
                    thisNPC.y += thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.height / 2))) {
                        var tileCollidedWith = getTileY(thisNPC.y + thisNPC.height / 2);
                        var tileTopEdge = (tileCollidedWith) * tileW;
                        thisNPC.y = tileTopEdge - thisNPC.height / 2 - 1;
                    }
                    break;
                case 'w':
                    thisNPC.x -= thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.height / 2))) {
                        var tileCollidedWith = getTileX(thisNPC.x - thisNPC.width / 2);
                        var tileRightEdge = (tileCollidedWith + 1) * tileW;
                        thisNPC.x = tileRightEdge + thisNPC.width / 2 + 1;
                    }
                    break;
                case 'e':
                    thisNPC.x += thisNPC.speed;
                    // check for collisions:
                    if ((isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.height / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.height / 2))) {
                        var tileCollidedWith = getTileX(thisNPC.x + thisNPC.width / 2);
                        var tileLeftEdge = (tileCollidedWith) * tileW;
                        thisNPC.x = tileLeftEdge - thisNPC.width / 2 - 1;
                    }
                    break;
            }


            // check for collision against hero:

            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, hero.x, hero.y, hero.width, hero.height)) {
                thisNPC.x = oldNPCx;
                thisNPC.y = oldNPCy;
            }

            // check for collisions against other NPCs:
            for (var j = 0; j < thisMapData.npcs.length; j++) {

                if (i != j) {
                    thisOtherNPC = thisMapData.npcs[j];
                    if (thisOtherNPC.isCollidable) {
                        if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, thisOtherNPC.x, thisOtherNPC.y, thisOtherNPC.width, thisOtherNPC.height)) {
                            thisNPC.x = oldNPCx;
                            thisNPC.y = oldNPCy;
                        }
                    }
                }
            }
            // check for collisions against items:
            for (var i = 0; i < thisMapData.items.length; i++) {
                thisItem = thisMapData.items[i];

                if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, thisItem.x, thisItem.y, thisItem.width, thisItem.height)) {
                    thisNPC.x = oldNPCx;
                    thisNPC.y = oldNPCy;

                }

            }



            // find the difference for this movement:
            thisNPC.dx += (thisNPC.x - oldNPCx);
            thisNPC.dy += (thisNPC.y - oldNPCy);
            // see if it's at a new tile centre:
            newTile = false;
            if (Math.abs(thisNPC.dx) >= tileW) {
                if (thisNPC.dx > 0) {
                    thisNPC.dx -= tileW;
                } else {
                    thisNPC.dx += tileW;
                }
                newTile = true;
            }
            if (Math.abs(thisNPC.dy) >= tileW) {
                if (thisNPC.dy > 0) {
                    thisNPC.dy -= tileW;
                } else {
                    thisNPC.dy += tileW;
                }
                newTile = true;
            }
            if (newTile) {
                thisNPC.movementIndex++;
                if (thisNPC.movementIndex >= thisNPC.movement.length) {
                    thisNPC.movementIndex = 0;
                }
                thisNextMovement = thisNPC.movement[thisNPC.movementIndex];

                switch (thisNextMovement) {
                    case '-':
                        // stand still:
                        thisNPC.isMoving = false;
                        console.log(getTileY(thisNPC.y));
                    case '?':
                        do {
                            // pick a random facing:
                            thisNPC.facing = facingsPossible[Math.floor(Math.random() * facingsPossible.length)];
                            // check that the target tile is walkable:
                        } while (isATerrainCollision(thisNPC.x + (relativeFacing[thisNPC.facing]["x"] * tileW), thisNPC.y + (relativeFacing[thisNPC.facing]["y"] * tileW)));


                        break;
                    default:
                        thisNPC.facing = thisNextMovement;
                        break;
                }
            }
        }
    }
}





function draw() {
    if (gameMode == "mapLoading") {
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fillStyle = "black";
        gameContext.fill();
    } else {
        // get all assets to be drawn in a list - start with the hero:

        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
        /*
          var assetsToDraw = [
              [hero.y, heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY), hero.width, hero.height]
          ];
          */
        var assetsToDraw = [
            [hero.isoy, heroImg, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY)]
        ];
        var map = thisMapData.terrain;
        var thisGraphicCentreX, thisGraphicCentreY, thisX, thisY, thisNPC, thisItem;
        var thisNPCOffsetCol = 0;
        var thisNPCOffsetRow = 0;

        for (var i = 0; i < mapTilesX; i++) {
            for (var j = 0; j < mapTilesY; j++) {
                // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                // this makes the map array more readable when editing
                if (map[j][i] != "*") {
                    thisX = getTileIsoCentreCoordX(i, j);
                    thisY = getTileIsoCentreCoordY(i, j);
                    thisGraphicCentreX = thisMapData.graphics[(map[j][i])].centreX;
                    thisGraphicCentreY = thisMapData.graphics[(map[j][i])].centreY;
                    assetsToDraw.push([thisY, tileImages[(map[j][i])], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                }
            }
        }



        for (var i = 0; i < thisMapData.npcs.length; i++) {
            thisNPC = thisMapData.npcs[i];
            thisNPCOffsetCol = currentAnimationFrame % thisNPC["animation"]["walk"]["length"];
            thisNPCOffsetRow = thisNPC["animation"]["walk"][thisNPC.facing];
            thisX = findIsoCoordsX(thisNPC.x, thisNPC.y);
            thisY = findIsoCoordsY(thisNPC.x, thisNPC.y);

            //assetsToDraw.push([findIsoDepth(thisX, thisY), npcImages[i], Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2))]);

            assetsToDraw.push([thisY, npcImages[i], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2)), thisNPC.spriteWidth, thisNPC.spriteHeight]);
        }


        for (var i = 0; i < thisMapData.items.length; i++) {
            thisItem = thisMapData.items[i];
            thisX = findIsoCoordsX(thisItem.x, thisItem.y);
            thisY = findIsoCoordsY(thisItem.x, thisItem.y);
            assetsToDraw.push([thisY, itemImages[i], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2))]);
        }

        assetsToDraw.sort(sortByIsoDepth);

        // don't need to clear, as the background will overwrite anyway - this means there's less to process:
        //  gameContext.clearRect(0, 0, canvasWidth, canvasHeight);



        // scroll background to match the top tip and left tip of the tile grid:
        gameContext.drawImage(backgroundImg, Math.floor(getTileIsoCentreCoordX(0, mapTilesX - 1) - hero.isox - tileW / 2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - tileH / 2));
        // draw the sorted assets:
        for (var i = 0; i < assetsToDraw.length; i++) {
            if (assetsToDraw[i].length == 10) {
                // sprite image (needs slicing parameters):
                gameContext.drawImage(assetsToDraw[i][1], assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4], assetsToDraw[i][5], assetsToDraw[i][6], assetsToDraw[i][7], assetsToDraw[i][8], assetsToDraw[i][9]);
            } else {
                // standard image:
                gameContext.drawImage(assetsToDraw[i][1], assetsToDraw[i][2], assetsToDraw[i][3]);
            }
        }

        // draw the map transition if it's needed:
        if (mapTransition == "out") {
            var gradientSize = (1 - (mapTransitionCurrentFrames / mapTransitionMaxFrames));
            var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
            gradient.addColorStop(0, "rgba(0,0,0,1)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            gameContext.fillStyle = gradient;
            gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        } else if (mapTransition == "in") {
            var gradientSize = ((mapTransitionCurrentFrames / mapTransitionMaxFrames));
            var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
            gradient.addColorStop(0, "rgba(0,0,0,1)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            gameContext.fillStyle = gradient;
            gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        }
    }
}

// check if it cuts the mustard and supports Canvas:
if (('querySelectorAll' in document && 'addEventListener' in window) && (!!window.HTMLCanvasElement)) {
    init();
} else {
    // sorry message / fallback? #####
}
