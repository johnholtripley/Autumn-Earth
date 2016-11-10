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
    
    whichTransitionEvent = determineWhichTransitionEvent();
    gameMode = "mapLoading";

    cartographyCanvas = document.getElementById("cartographyCanvas");
    cartographyContext = cartographyCanvas.getContext('2d');
    offScreenCartographyCanvas = document.getElementById("offScreenCartographyCanvas");
    offScreenCartographyContext = offScreenCartographyCanvas.getContext('2d');

    canvasMapImage = document.createElement('img');
canvasMapMaskImage = document.createElement('img');

    UI.init();
    // detect and set up input methods:
    Input.init();
    // show loading screen while getting assets:
    gameLoop();

    getHeroGameState();
}



}

function getHeroGameState() {
    getJSON("/data/chr" + characterId + "/gameState.json", function(data) {
        //  thisMapData = data.map;
        hero.tileX = data.tileX;
        hero.tileY = data.tileY;
        currentMap = data.currentMap;
        newMap = currentMap;
        hero.bags = data.bags;
        hero.cards = data.cards;
        hero.stats = data.stats;
        hero.titlesEarned = data.titlesEarned;
        hero.activeTitle = data.activeTitle;
       
        hero.inventory = data.inventory;
        if (currentMap > 0) {
            //clean old procedural maps: (don't need a response here)
            sendDataWithoutNeedingAResponse('/game-world/generateDungeonMap.php?playerId=' + characterId + '&clearMaps=true');
        }
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

    getQuestDetails();
    
}

function loadCardData() {
    getJSON("/game-world/getCardDetails.php", function(data) {
        cardGameNameSpace.allCardData = data.cards;
        loadMap();
    }, function(status) {
        // error - try again:
        loadCardData();
    });
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
             cartographicTitle.innerHTML = thisMapData.zoneName;
        }
       initCartographicMap();
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
        mapFilePath = '/game-world/generateDungeonMap.php?playerId=' + characterId + '&originatingMapId=' + currentMap + '&requestedMap=' + newMap + '&dungeonName=' + randomDungeonName + '&connectingDoorX=' + centreDoorX + '&connectingDoorY=' + centreDoorY;
         
    }
    currentMap = newMap;
    loadMapJSON(mapFilePath);
}






function loadMapAssets() {
    imagesToLoad = [];
    var thisFileColourSuffix, thisColourName;
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
        // get colour name 

thisFileColourSuffix = "";
if(itemGraphicsToLoad[i].colour) {
 thisColourName = getColourName(itemGraphicsToLoad[i].colour, itemGraphicsToLoad[i].type);

                    if (thisColourName != "") {
                       
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                }


        imagesToLoad.push({
            name: "item" + i,
            src: "/images/game-world/items/" + currentActiveInventoryItems[itemGraphicsToLoad[i].type].worldSrc + thisFileColourSuffix+".png"
        });
    }

    Loader.preload(imagesToLoad, prepareGame, loadingProgress);
}

function loadTitles() {
    var itemIdsToGet = hero.titlesEarned.join("|");
    getJSON("/game-world/getActiveTitles.php?whichIds=" + itemIdsToGet, function(data) {
        activeTitles = data;
       
        loadCardData();
    }, function(status) {
        // try again:
        loadTitles();
    });
}

function getQuestDetails() {
    
    getJSON("/game-world/getQuestDetails.php?chr=" + characterId, function(data) {
        questData = data.quests;
        loadTitles();
    }, function(status) {
        // try again:
        getQuestDetails();
    });
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

thisMapData.npcs[i].drawnFacing = thisMapData.npcs[i].facing;

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

activeNPCForDialogue = '';
    // determine tile offset to centre the hero in the centre
    hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);

    // initialise fae:
    fae.x = hero.x + tileW * 2;
    fae.y = hero.y + tileH * 2;
    fae.z = 40;
    fae.dz = 1;
    fae.pulse = 0;
    fae.state = 'idle';

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
    if(currentMap < 0) {
    saveCartographyMask();
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
            case "cardGame":
            
            cardGameNameSpace.update();
            cardGameNameSpace.draw();
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
              if (key[6]) {
            checkForChallenges();
        }
        checkHeroCollisions();
        var heroOldX = hero.tileX;
        var heroOldY = hero.tileY;
        hero.tileX = getTileX(hero.x);
        hero.tileY = getTileY(hero.y);
        if((hero.tileX != heroOldX) || (hero.tileY != heroOldY)) {
            heroIsInNewTile();
        }
// check to see if a dialogue balloon is open, and if the hero has moved far from the NPC:
if (activeNPCForDialogue != '') {
    if (!(isInRange(hero.x, hero.y, activeNPCForDialogue.x, activeNPCForDialogue.y, closeDialogueDistance))) {
        dialogue.classList.add("slowerFade");
        dialogue.classList.remove("active");
        // only remove this after dialogue has faded out completely:


    dialogue.addEventListener(whichTransitionEvent, function removeActiveDialogue(e) {
                               activeNPCForDialogue = '';
                                return e.currentTarget.removeEventListener(whichTransitionEvent, removeActiveDialogue, false);
                            }, false);


        
    }
}


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
        // make it transition in faster:
        mapTransitionCurrentFrames += 2;
        if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
            mapTransition = "";
        }
    }
    timeSinceLastFrameSwap += elapsed;
    if (timeSinceLastFrameSwap > animationUpdateTime) {
        currentAnimationFrame++;
        timeSinceLastFrameSwap = 0;
        animateFae();
    }

    moveNPCs();
}

function heroIsInNewTile() {
    if (currentMap < 0) {
        updateCartographicMiniMap();
    }
    var thisHotspot;
    // check for hotspots:
    for (var i=0; i<thisMapData.hotspots.length; i++) {
       thisHotspot = thisMapData.hotspots[i];
       if(isInRange(hero.x, hero.y, getTileCentreCoordX(thisHotspot.centreX), getTileCentreCoordY(thisHotspot.centreY), thisHotspot.radius * tileW)) {
        if(questData[thisHotspot.quest].hasBeenActivated < 1) {
UI.showNotification("<p>"+thisHotspot.message+"</p>");
        }
questData[thisHotspot.quest].hasBeenActivated = 1;
       }
    }
}








function checkForActions() {
    var inventoryCheck = [];
    var slotMarkup, thisSlotsId, thisSlotElem, thisNPC;
    // loop through items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (isInRange(hero.x, hero.y, thisMapData.items[i].x, thisMapData.items[i].y, (thisMapData.items[i].width / 2 + hero.width / 2 + 6))) {
            if (isFacing(hero, thisMapData.items[i])) {
                var actionValue = currentActiveInventoryItems[itemGraphicsToLoad[i].type].actionValue;
                switch (currentActiveInventoryItems[itemGraphicsToLoad[i].type].action) {
                    case "static":
                        // can't interact with it - do nothing
                        break;


                    case "questToggle":
                        // toggle value: (1 or 0)
                        questData[actionValue].hasBeenActivated = Math.abs(questData[actionValue].hasBeenActivated - 1);


                        break;
                    case "questSet":
                        questData[actionValue].hasBeenActivated = 1;
                        break;
                    case "questUnset":
                        questData[actionValue].hasBeenActivated = 0;
                        break;

                    default:
                        // try and pick it up:

                        inventoryCheck = canAddItemToInventory([thisMapData.items[i]]);

                        if (inventoryCheck[0]) {
                            // remove from map:
                            thisMapData.items.splice(i, 1);
                            UI.showChangeInInventory(inventoryCheck[1]);
                        } else {
                            UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                        }
                }
            }
        }
    }

    // loop through NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.speech) {
            if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
                if (isFacing(hero, thisNPC)) {
                    // if at the end of the NPC's speech list, or the dialogue isn't part of the NPC's normal speech list, then close the balloon with an action click:
                    if ((thisNPC.speechIndex >= thisNPC.speech.length) || (canCloseDialogueBalloonNextClick && activeNPCForDialogue == thisNPC)) {
                        thisNPC.speechIndex = 0;
                        dialogue.classList.remove("active");
                        activeNPCForDialogue = '';
                        canCloseDialogueBalloonNextClick = false;
                    } else {
                        var thisSpeech = thisNPC.speech[thisNPC.speechIndex][0];
                        var thisSpeechCode = thisNPC.speech[thisNPC.speechIndex][1];
                        thisNPC.drawnFacing = turntoFace(thisNPC, hero);
                        processSpeech(thisNPC, thisSpeech, thisSpeechCode, true);

                        thisNPC.speechIndex++;
                    }
                }
            }
        }
    }
    // action processed, so cancel the key event:
    key[4] = 0;
}

function processSpeech(thisNPC, thisSpeech, thisSpeechCode, isPartOfNPCsNormalSpeech) {
    // isPartOfNPCsNormalSpeech is false if not set:
    isPartOfNPCsNormalSpeech = typeof isPartOfNPCsNormalSpeech !== 'undefined' ? isPartOfNPCsNormalSpeech : false;
    individualSpeechCodes = thisSpeechCode.split(",");
    for (var i = 0; i < individualSpeechCodes.length; i++) {
        switch (individualSpeechCodes[i]) {
            case "once":
                thisNPC.speech.splice(thisNPC.speechIndex, 1);
                // knock this back one so to keep it in step with the removed item:
                thisNPC.speechIndex--;
                break;
            case "quest":
            case "quest-no-open":
            case "quest-no-close":
            case "quest-no-open-no-close":
                var questSpeech = thisSpeech.split("|");
                var questId = thisNPC.speech[thisNPC.speechIndex][2];
                if (questData[questId].isUnderway) {
                    // quest has been opened - check if it's complete:
                    switch (questData[questId].whatIsRequiredForCompletion) {
                        case "possess":
                        case "give":
                        case "":
                            if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-open")) {
                                // ie. it's not a '-no-close' speech
                                // check items:
                                var theseItemsNeededForCompletion = questData[questId].itemsNeededForCompletion;
                                var allItemsFound = true;
                                var itemsToGive = questData[questId].startItemsReceived.split(",");
                                var allItemsToGive = [];
                                for (var i = 0; i < itemsToGive.length; i++) {
                                    // check for any quantities:
                                    var thisQuestItem = itemsToGive[i].split("x");
                                    var thisQuantity, thisItem;
                                    if (thisQuestItem.length > 1) {
                                        thisQuantity = thisQuestItem[0];
                                        thisItem = thisQuestItem[1];
                                    } else {
                                        thisQuantity = 1;
                                        thisItem = itemsToGive[i];
                                    }
                                    if (!hasItemInInventory(thisItem, thisQuantity)) {
                                        allItemsFound = false;
                                    }
                                }
                                if (allItemsFound) {
                                    if (questData[questId].whatIsRequiredForCompletion == "give") {
                                        // remove items:
                                        for (var i = 0; i < itemsToGive.length; i++) {
                                            // check for any quantities:
                                            var thisQuestItem = itemsToGive[i].split("x");
                                            var thisQuantity, thisItem;
                                            if (thisQuestItem.length > 1) {
                                                thisQuantity = thisQuestItem[0];
                                                thisItem = thisQuestItem[1];
                                            } else {
                                                thisQuantity = 1;
                                                thisItem = itemsToGive[i];
                                            }
                                            removeItemTypeFromInventory(thisItem, thisQuantity);
                                        }
                                    }
                                    // close quest:
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisNPC, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisNPC.speechIndex--;
                                }
                            } else {
                                // check if it's been closed elsewhere:
                                if (questData[questId].hasBeenCompleted > 0) {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisNPC, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisNPC.speechIndex--;
                                }
                            }
                            break;
                        case "multi":
                            var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");
                      
                            var allSubQuestsComplete = true;
                            for (var k = 0; k < allSubQuestsRequired.length; k++) {
                                // check conditions for this sub-quest and set if it's complete ###############


                                switch (questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion) {
                                    case "possess":
                                    case "give":
                                    case "":



                                        var theseItemsNeededForCompletion = questData[allSubQuestsRequired[k]].itemsNeededForCompletion;

                                        var itemsToGive = questData[allSubQuestsRequired[k]].startItemsReceived.split(",");
                                        var allItemsToGive = [];
                                        for (var j = 0; j < itemsToGive.length; j++) {
                                            // check for any quantities:
                                            var thisQuestItem = itemsToGive[j].split("x");
                                            var thisQuantity, thisItem;
                                            if (thisQuestItem.length > 1) {
                                                thisQuantity = thisQuestItem[0];
                                                thisItem = thisQuestItem[1];
                                            } else {
                                                thisQuantity = 1;
                                                thisItem = itemsToGive[i];
                                            }
                                            if (!hasItemInInventory(thisItem, thisQuantity)) {
                                                allSubQuestsComplete = false;
                                            }
                                        }



                                        break;
                                    case "world":
                                        
                                        if (questData[allSubQuestsRequired[k]].hasBeenActivated < 1) {
                                            allSubQuestsComplete = false;

                                        }
                                        break;
                                    default:
                                        // threshold quest:
                                   
                                        var thresholdValueAtStart = questData[allSubQuestsRequired[k]].valueAtQuestStart;
                                        var currentThresholdValue = accessDynamicVariable(questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion);
  
                                        // check if it's an absolute value to check for, or an increment (whether there is a '+' at the start):
                                        if (questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.charAt(0) == "+") {
                                            console.log(currentThresholdValue + " < "+questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1));
                                           if (currentThresholdValue - thresholdValueAtStart < questData[allSubQuestsRequired[k]].thresholdNeededForCompletion) {
                                                allSubQuestsComplete = false;
                                            }
                                        } else {
                                           
                                            
                                             if (currentThresholdValue < questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1)) {
                                                allSubQuestsComplete = false;
                                            }
                                        }

                                        break;
                                }



                            }
                            console.log("allSubQuestsComplete: "+allSubQuestsComplete);
                            if (allSubQuestsComplete) {
                                thisSpeech = questSpeech[2];
                                closeQuest(thisNPC, questId);
                            } else {
                                // show 'underway' text:
                                thisSpeech = questSpeech[1];
                                // keep the NPC on this quest speech:
                                thisNPC.speechIndex--;
                            }
                            break;
                        case "world":
                            if (questData[questId].hasBeenActivated > 0) {
                                thisSpeech = questSpeech[2];
                                closeQuest(thisNPC, questId);
                            } else {
                                // show 'underway' text:
                                thisSpeech = questSpeech[1];
                                // keep the NPC on this quest speech:
                                thisNPC.speechIndex--;
                            }
                            break;
                        default:
                            // threshold quest:
                            var thresholdValueAtStart = questData[questId].valueAtQuestStart;
                            var currentThresholdValue = accessDynamicVariable(questData[questId].whatIsRequiredForCompletion);
                            var thisQuestIsComplete = false;
                            // check if it's an absolute value to check for, or an increment (whether there is a '+' at the start):
                            if (questData[questId].thresholdNeededForCompletion.charAt(0) == "+") {
                               
                                 if (currentThresholdValue - thresholdValueAtStart >= questData[questId].thresholdNeededForCompletion) {
                                    thisQuestIsComplete = true;
                                }
                            } else {
                                if (currentThresholdValue >= questData[questId].thresholdNeededForCompletion.substring(1)) {
                                    thisQuestIsComplete = true;
                                }
                            }
                            if (thisQuestIsComplete) {
                                // threshold quest is complete:
                                thisSpeech = questSpeech[2];
                                closeQuest(thisNPC, questId);
                            } else {
                                // show 'underway' text:
                                thisSpeech = questSpeech[1];
                                // keep the NPC on this quest speech:
                                thisNPC.speechIndex--;
                            }
                            break;
                    }
                } else {
                    if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-close")) {
                        // ie. don't open the quest if it's "-no-open":
                        var okToStartQuest = true;
                        // see if any items need to be given to start the quest:
                        if (questData[questId].startItemsReceived) {
                            var itemsToAdd = questData[questId].startItemsReceived.split(",");
                            var allItemsToGive = [];
                            for (var l = 0; l < itemsToAdd.length; l++) {
                                // check for any quantities:
                                var thisQuestItem = itemsToAdd[l].split("x");
                                var thisQuantity, thisItem;
                                if (thisQuestItem.length > 1) {
                                    thisQuantity = thisQuestItem[0];
                                    thisItem = thisQuestItem[1];
                                } else {
                                    thisQuantity = 1;
                                    thisItem = itemsToAdd[l];
                                }
                                // build item object:
                                var thisRewardObject = {
                                    "type": parseInt(thisItem),
                                    "quantity": parseInt(thisQuantity),
                                    "quality": 100,
                                    "durability": 100,
                                    "currentWear": 0,
                                    "effectiveness": 100,
                                    "wrapped": 0,
                                    "colour": currentActiveInventoryItems[parseInt(thisItem)].colour,
                                    "enchanted": 0,
                                    "hallmark": 0,
                                    "inscription": ""
                                }
                                allItemsToGive.push(thisRewardObject);
                            }
                            inventoryCheck = canAddItemToInventory(allItemsToGive);
                            if (inventoryCheck[0]) {
                                UI.showChangeInInventory(inventoryCheck[1]);
                            } else {
                                okToStartQuest = false;
                            }
                        }
                        if (okToStartQuest) {
                            // open quest:
                            switch (questData[questId].whatIsRequiredForCompletion) {
                                case "possess":
                                case "give":
                                case "":
                                    // ###
                                    break;
                                case "multi":
                                    // open all sub quests:
                                    var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");

                                    for (var k = 0; k < allSubQuestsRequired.length; k++) {
                                        questData[allSubQuestsRequired[k]].isUnderway = 1;
                                        switch (questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion) {
                                            case "possess":
                                            case "give":
                                            case "":
                                                //
                                                break;
                                            case "world":
                                                //
                                                break;
                                            default:
                                                // threshold quest:
                                                questData[allSubQuestsRequired[k]].valueAtQuestStart = accessDynamicVariable(questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion);
                                                break;
                                        }
                                        questData[allSubQuestsRequired[k]].isUnderway = true;
                                    }

                                    break;
                                case "world":
                                    // ###
                                    break;
                                default:
                                    // threshold quest:
                                    questData[questId].valueAtQuestStart = accessDynamicVariable(questData[questId].whatIsRequiredForCompletion);
                                    break;
                            }
                            questData[questId].isUnderway = true;
                        }
                    }
                    thisSpeech = questSpeech[0];
                    // keep the NPC on this quest speech:
                    thisNPC.speechIndex--;
                }
                break;
            case "play":
                startCardGame(thisNPC);
                break;
            default:
                // nothing
        }
    }

    UI.showDialogue(thisNPC, thisSpeech);
    canCloseDialogueBalloonNextClick = false;
    if (!isPartOfNPCsNormalSpeech) {
        // set a flag so that pressing action near the NPC will close the balloon:
        canCloseDialogueBalloonNextClick = true;
    }
}



function closeQuest(whichNPC, whichQestId) {
    if (questData[whichQestId].isRepeatable > 0) {
        questData[whichQestId].hasBeenCompleted = false;
        questData[whichQestId].isUnderway = false;
    } else {
        questData[whichQestId].hasBeenCompleted = true;
        // remove quest text now:
        whichNPC.speech.splice(whichNPC.speechIndex, 1);
        // knock this back one so to keep it in step with the removed item:
        whichNPC.speechIndex--;
    }
    checkForTitlesAwarded(whichQestId);
    giveQuestRewards(whichQestId);
}



function giveQuestRewards(whichQuestId) {

    // give any reward to the player:
    if (questData[whichQuestId].itemsReceivedOnCompletion) {

        var allRewardItems = [];

        var questRewards = questData[whichQuestId].itemsReceivedOnCompletion.split(",");
        for (var i = 0; i < questRewards.length; i++) {
            // check for any quantities:
            var thisQuestReward = questRewards[i].split("x");
            var thisQuantity, thisItem;
            if (thisQuestReward.length > 1) {
                thisQuantity = thisQuestReward[0];
                thisItem = thisQuestReward[1];
            } else {
                thisQuantity = 1;
                thisItem = questRewards[i];
            }

            // build item object:
            var thisRewardObject = {
                "type": parseInt(thisItem),
                "quantity": parseInt(thisQuantity),
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "wrapped": 0,
                "colour": currentActiveInventoryItems[parseInt(thisItem)].colour,
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
            allRewardItems.push(thisRewardObject);
        }

        inventoryCheck = canAddItemToInventory(allRewardItems);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
            // don't close quest? #########
        }
    }

}

function checkForTitlesAwarded(whichQuestId) {
    // check for any titles:
    if (questData[whichQuestId].titleGainedAfterCompletion) {
        var thisTitle = questData[whichQuestId].titleGainedAfterCompletion;
        if (hero.titlesEarned.indexOf(thisTitle) == -1) {
            hero.titlesEarned.push(thisTitle);
            UI.showNotification('<p>You earned the &quot;' + activeTitles[thisTitle] + '&quot; title</p>');
        }
    }
}


function checkForChallenges() {
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
            if (isFacing(hero, thisNPC)) {
                if(thisNPC.cardGameSpeech) {
                thisNPC.drawnFacing = turntoFace(thisNPC, hero);
                processSpeech(thisNPC, thisNPC.cardGameSpeech.challenge[0], thisNPC.cardGameSpeech.challenge[1]);
            }
            }
        }
    }
    // challenge processed, so cancel the key event:
    key[6] = 0;
}

function moveNPCs() {
    var thisNPC, newTile, thisNextMovement, oldNPCx, oldNPCy;
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisNPC = thisMapData.npcs[i];
        if (thisNPC.isMoving) {
            oldNPCx = thisNPC.x;
            oldNPCy = thisNPC.y;

thisNPC.drawnFacing = thisNPC.facing;
            
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


function animateFae() {
    fae.z = Math.floor((Math.sin(fae.dz) + 1) * 8 + 40);
    fae.dz += 0.2;
// fae.y+=8;
    for (var i = 0; i < fae.particles.length; i++) {
        fae.particles[i].alpha -= 0.1;
        if(fae.particles[i].alpha<=0) {
            fae.particles.splice(i, 1);
        }
    }

    // add particles:
    if (fae.particles.length < fae.maxParticles) {
        if (getRandomInteger(1, 4) == 1) {
            var faeIsoX = findIsoCoordsX(fae.x, fae.y);
            var faeIsoY = findIsoCoordsY(fae.x, fae.y) - fae.z;
            var particleIsoX = faeIsoX + getRandomInteger(0, 8) - 4;
            var particleIsoY = faeIsoY + getRandomInteger(0, 8) - 4;
            // check it's in a circle from the fae's centre:
            if (isInRange(faeIsoX, faeIsoY, particleIsoX, particleIsoY, 6)) {

                fae.particles.push({ 'depth': findIsoCoordsY(fae.x, fae.y),'isoX': particleIsoX, 'isoY': particleIsoY, 'alpha': 1 });
            
            }
        }
    }
}



function inventoryItemAction(whichSlot, whichAction) {
    switch (whichAction) {
        case "booster":
            openBoosterPack();
            // remove the 'slot' prefix with the substring(4):
            removeFromInventory(whichSlot.parentElement.id.substring(4), 1);
            break;
    }
}








function draw() {
    if (gameMode == "mapLoading") {
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fillStyle = "black";
        gameContext.fill();
    } else {
        // get all assets to be drawn in a list - start with the hero:

        var thisGraphicCentreX, thisGraphicCentreY, thisX, thisY, thisNPC, thisItem;

        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
        /*
          var assetsToDraw = [
              [hero.y, heroImg, hero.offsetX, hero.offsetY, hero.width, hero.height, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY), hero.width, hero.height]
          ];
          */
        var assetsToDraw = [
            [hero.isoy, "img", heroImg, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY)]
        ];


        // draw fae:
        thisX = findIsoCoordsX(fae.x, fae.y);
        thisY = findIsoCoordsY(fae.x, fae.y);

        assetsToDraw.push([thisY, "faeCentre", Math.floor(thisX - hero.isox + (canvasWidth / 2)), Math.floor(thisY - hero.isoy + (canvasHeight / 2) - fae.z)]);

        // draw fae particles:
        for (var i = 0; i < fae.particles.length; i++) {
            assetsToDraw.push([fae.particles[i].depth, "faeParticle", Math.floor(fae.particles[i].isoX - hero.isox + (canvasWidth / 2)), Math.floor(fae.particles[i].isoY - hero.isoy + (canvasHeight / 2)), fae.particles[i].alpha]);
        }

        var map = thisMapData.terrain;

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
                    assetsToDraw.push([thisY, "img", tileImages[(map[j][i])], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                }
            }
        }



        for (var i = 0; i < thisMapData.npcs.length; i++) {
            thisNPC = thisMapData.npcs[i];
            thisNPCOffsetCol = currentAnimationFrame % thisNPC["animation"]["walk"]["length"];
            thisNPCOffsetRow = thisNPC["animation"]["walk"][thisNPC.drawnFacing];
            thisX = findIsoCoordsX(thisNPC.x, thisNPC.y);
            thisY = findIsoCoordsY(thisNPC.x, thisNPC.y);

            //assetsToDraw.push([findIsoDepth(thisX, thisY), npcImages[i], Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2))]);
   

            assetsToDraw.push([thisY, "sprite", npcImages[i], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2)), thisNPC.spriteWidth, thisNPC.spriteHeight]);
        }


        for (var i = 0; i < thisMapData.items.length; i++) {
            thisItem = thisMapData.items[i];
            thisX = findIsoCoordsX(thisItem.x, thisItem.y);
            thisY = findIsoCoordsY(thisItem.x, thisItem.y);
            assetsToDraw.push([thisY, "img", itemImages[i], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2))]);
        }

        assetsToDraw.sort(sortByIsoDepth);

        // don't need to clear, as the background will overwrite anyway - this means there's less to process:
        //  gameContext.clearRect(0, 0, canvasWidth, canvasHeight);



        // scroll background to match the top tip and left tip of the tile grid:
        gameContext.drawImage(backgroundImg, Math.floor(getTileIsoCentreCoordX(0, mapTilesX - 1) - hero.isox - tileW / 2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - tileH / 2));
        // draw the sorted assets:
        for (var i = 0; i < assetsToDraw.length; i++) {


switch(assetsToDraw[i][1]) {
    case "faeCentre":
                // draw fae:
                drawCircle("#ffdc0c", assetsToDraw[i][2], assetsToDraw[i][3], 2);
                drawCircle("rgba(255,220,255,0.3)", assetsToDraw[i][2], assetsToDraw[i][3], 4);

                // draw fae's shadow - make it respond to the fae's height:
                gameContext.fillStyle = "rgba(0,0,0," + (65 - fae.z) * 0.01 + ")";
                gameContext.beginPath();
                gameContext.ellipse(assetsToDraw[i][2] - getXOffsetFromHeight(fae.z), assetsToDraw[i][3] + fae.z, 3, 1, 0, 0, 2 * Math.PI);
                gameContext.fill();
        break;
           case "faeParticle":
         gameContext.fillStyle = "rgba(255,220,255," + assetsToDraw[i][4] + ")";
                gameContext.fillRect(assetsToDraw[i][2], assetsToDraw[i][3], 1, 1);
        break;
    case "sprite":
         // sprite image (needs slicing parameters):
                gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4], assetsToDraw[i][5], assetsToDraw[i][6], assetsToDraw[i][7], assetsToDraw[i][8], assetsToDraw[i][9], assetsToDraw[i][10]);
        break;
    case "img":
          // standard image:
                gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4]);

} 


         
        }



if(activeNPCForDialogue != '') {
    UI.updateDialogue(activeNPCForDialogue);
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

