// service worker:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/game-world/serviceWorker.min.js', {
        scope: '/game-world/'
    });
}

function sizeCanvasSize() {
    // size it to the screen:
    gameContext.canvas.width = window.innerWidth;
    gameContext.canvas.height = window.innerHeight;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}

var debouncedResize = debounce(function() {
    sizeCanvasSize();
}, 250);
window.addEventListener('resize', debouncedResize);


function init() {
    gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        sizeCanvasSize();
        whichTransitionEvent = determineWhichTransitionEvent();
        whichAnimationEvent = determineWhichAnimationEvent();
        gameMode = "mapLoading";
        cartographyCanvas = document.getElementById("cartographyCanvas");
        cartographyContext = cartographyCanvas.getContext('2d');
        offScreenCartographyCanvas = document.getElementById("offScreenCartographyCanvas");
        offScreenCartographyContext = offScreenCartographyCanvas.getContext('2d');
        canvasMapImage = document.createElement('img');
        canvasMapMaskImage = document.createElement('img');
        UI.init();
        audio.init();
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
        gameSettings = data.settings;
        hero.currency = data.currency;
        hero.titlesEarned = data.titlesEarned;
        hero.activeTitle = data.activeTitle;
        hero.recipesKnown = data.recipesKnown;
        hero.professionsKnown = data.professionsKnown;
        hero.totalGameTimePlayed = data.totalGameTimePlayed;
        timeSinceLastAmbientSoundWasPlayed = hero.totalGameTimePlayed + (minTimeBetweenAmbientSounds * 1.25);
        if (data.allPets) {
            if (data.activePets.length > 0) {
                hasActivePet = true;
            }
            hero.activePets = data.activePets;
            hero.allPets = data.allPets;
        }
        // copy the fae properties that will change into the main fae object:
        for (var attrname in data.fae) {
            fae[attrname] = data.fae[attrname];
        }
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
    var coreImagesToLoad = [];
    coreImagesToLoad.push({
        name: "heroImg",
        src: '/images/game-world/core/hero.png'
    });
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            coreImagesToLoad.push({
                name: "activePet" + hero.activePets[i],
                src: '/images/game-world/npcs/' + hero.allPets[hero.activePets[i]].src
            });
        }
    }
    Loader.preload(coreImagesToLoad, prepareCoreAssets, loadingProgress);
}


function prepareCoreAssets() {
    heroImg = Loader.getImage("heroImg");
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            activePetImages[i] = Loader.getImage("activePet" + hero.activePets[i]);
        }
    }
    getColours();
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
    getJSON(mapFilePath, function(data) {
        thisMapData = data.map;
        mapTilesY = thisMapData.terrain.length;
        mapTilesX = thisMapData.terrain[0].length;
        if (previousZoneName != thisMapData.zoneName) {
            UI.showZoneName(thisMapData.zoneName);
            document.title = titleTagPrefix + ' - ' + thisMapData.zoneName;
            cartographicTitle.innerHTML = thisMapData.zoneName;
        }
        initCartographicMap();
        findProfessionsAndRecipes();
        if (thisMapData.ambientSounds) {
            audio.loadAmbientSounds(thisMapData.ambientSounds);
        }
        fae.recentHotspots = [];
    }, function(status) {
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
        //mapFilePath = '/data/chr' + characterId + '/map' + newMap + '.json';
        mapFilePath = '/game-world/getMap.php?chr=' + characterId + '&map=' + newMap;
    }
    if (newMap < 0) {
        // find door centre:
        var targetDoorX = 0;
        var targetDoorY = 0;
        var doorData = thisMapData.doors;
        for (var i in doorData) {
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
            name: "npc" + npcGraphicsToLoad[i].name,
            src: "/images/game-world/npcs/" + npcGraphicsToLoad[i].src
        });
    }
    itemGraphicsToLoad = [];
    var thisItemIdentifier = '';
    for (var i = 0; i < thisMapData.items.length; i++) {
        // get colour name 
        thisFileColourSuffix = "";
        if (thisMapData.items[i].colour) {
            thisColourName = getColourName(thisMapData.items[i].colour, thisMapData.items[i].type);
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
        }
        thisItemIdentifier = "item" + thisMapData.items[i].type + thisFileColourSuffix;
        // only add unique images:
        if (itemGraphicsToLoad.indexOf(thisItemIdentifier) == -1) {
            imagesToLoad.push({
                name: thisItemIdentifier,
                src: "/images/game-world/items/" + currentActiveInventoryItems[thisMapData.items[i].type].worldSrc + thisFileColourSuffix + ".png"
            });
            itemGraphicsToLoad.push(thisItemIdentifier);
        }
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

function getColours() {
    getJSON("/game-world/getColours.php", function(data) {
        colourNames = data.colourNames;
        getQuestDetails();
    }, function(status) {
        // try again:
        getColours();
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


function findProfessionsAndRecipes() {
    var recipeIdsToGet = "";
    for (var i = 0; i < hero.recipesKnown.length; i++) {
        recipeIdsToGet += hero.recipesKnown[i][0] + "|";
    }
    // remove final pipe:
    recipeIdsToGet = recipeIdsToGet.slice(0, -1);
    loadProfessionsAndRecipes(recipeIdsToGet);
}



function loadProfessionsAndRecipes(recipeIdsToLoad) {
    getJSON("/game-world/getProfessionsAndRecipes.php?whichIds=" + recipeIdsToLoad, function(data) {
        hero.crafting = data.professions;
        currentItemGroupFilters = data.itemGroups;
        getShopData();
    }, function(status) {
        // try again:
        loadProfessionsAndRecipes(recipeIdsToLoad);
    });
}



function getShopData() {
    thisMapShopItemIds = '';
    if (thisMapData.shops.length == 0) {
        findInventoryItemData();
    } else {
        var shopData = JSON.parse('{"mapNumber": ' + currentMap + ',"shops": ' + JSON.stringify(thisMapData.shops) + '}');
        // loop through shops and create hashes 
        for (var i = 0; i < shopData.shops.length; i++) {
            shopData.shops[i].hash = generateHash(shopData.shops[i].name);
        }
        loadShopData('shopData=' + JSON.stringify(shopData));
    }
}



function loadShopData(shopJSONData) {
    // post data with getJSONWithParams function ####
    getJSONWithParams("/game-world/getShopItems.php", shopJSONData, function(data) {
        thisMapShopItemIds = data.allItemIds;
        UI.buildShop(data.markup);
        findInventoryItemData();
    }, function(status) {
        // try again:
        loadShopData(shopJSONData);
    });
}



function findInventoryItemData() {
    var itemIdsToGet = [];
    var theseRecipeComponents;
    // find out all items in the hero's inventory:
    for (var arrkey in hero.inventory) {
        itemIdsToGet.push(hero.inventory[arrkey].type);
        // check if any are containers:
        if (typeof hero.inventory[arrkey].contains !== "undefined") {
            for (var i = 0; i < hero.inventory[arrkey].contains.length; i++) {
                itemIdsToGet.push(hero.inventory[arrkey].contains[i].type);
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
    // find items in recipes:
    for (var i in hero.crafting) {
        for (var j in hero.crafting[i].filters['All']) {
            // get what's created:
            itemIdsToGet.push(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].creates);
            // get components:
            theseRecipeComponents = hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components.split(",");
            for (var k = 0; k < theseRecipeComponents.length; k++) {
                if (!(isNaN(theseRecipeComponents[k]))) {
                    itemIdsToGet.push(theseRecipeComponents[k]);
                }
            }
        }
    }


    // add item available in any shops:
    if (thisMapShopItemIds != '') {
        itemIdsToGet.push(thisMapShopItemIds);
    }

    // remove duplicates:
    itemIdsToGet = uniqueValues(itemIdsToGet);
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
        npcImages[npcGraphicsToLoad[i].name] = Loader.getImage("npc" + npcGraphicsToLoad[i].name);
    }
    itemImages = [];
    for (var i = 0; i < itemGraphicsToLoad.length; i++) {

        itemImages[itemGraphicsToLoad[i]] = Loader.getImage(itemGraphicsToLoad[i]);
    }
    backgroundImg = Loader.getImage("backgroundImg");
    // initialise and position NPCs:
    for (var i = 0; i < thisMapData.npcs.length; i++) {
        thisMapData.npcs[i].x = getTileCentreCoordX(thisMapData.npcs[i].tileX);
        thisMapData.npcs[i].y = getTileCentreCoordY(thisMapData.npcs[i].tileY);
        thisMapData.npcs[i].z = getElevation(thisMapData.npcs[i].tileX, thisMapData.npcs[i].tileY);   
        thisMapData.npcs[i].drawnFacing = thisMapData.npcs[i].facing;
        thisMapData.npcs[i].dx = 0;
        thisMapData.npcs[i].dy = 0;
        // set index to -1 so when it increases, it'll pick up the first (0) element:
        thisMapData.npcs[i].movementIndex = -1;
        // allow NPCs to pick up their facing without moving to that first tile:
        thisMapData.npcs[i].forceNewMovementCheck = true;
        // used for making sure that pathfinding NPCs don't head straight back to the last place they visited:
        thisMapData.npcs[i].lastTargetDestination = "";
    }
    // initialise pet:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            hero.allPets[hero.activePets[i]].x = getTileCentreCoordX(hero.allPets[hero.activePets[i]].tileX);
            hero.allPets[hero.activePets[i]].y = getTileCentreCoordY(hero.allPets[hero.activePets[i]].tileY);


// check these tiles are within the normal grid - if not use the pet in front's z depth:


if ((hero.allPets[hero.activePets[i]].tileX < 0) || (hero.allPets[hero.activePets[i]].tileY < 0) || (hero.allPets[hero.activePets[i]].tileX >= mapTilesX) || (hero.allPets[hero.activePets[i]].tileY >= mapTilesY)) {
    hero.allPets[hero.activePets[i]].z = hero.allPets[hero.activePets[i-1]].z;
    
} else {
    hero.allPets[hero.activePets[i]].z = getElevation(hero.allPets[hero.activePets[i]].tileX, hero.allPets[hero.activePets[i]].tileY);
}


            
            hero.allPets[hero.activePets[i]].dx = 0;
            hero.allPets[hero.activePets[i]].dy = 0;
            hero.allPets[hero.activePets[i]].foundPath = '';
            if(hero.allPets[hero.activePets[i]].state != "queuing") {
            hero.allPets[hero.activePets[i]].state = "wait";
        }
            if (i == 0) {
                // first pet follows the hero:
                hero.allPets[hero.activePets[i]].following = hero;
            } else {
                // subsequent pets follow the one in front:
                hero.allPets[hero.activePets[i]].following = hero.allPets[hero.activePets[i - 1]];
            }
            if (i != (hero.activePets.length - 1)) {
                // it's not the last one, so drop a breadcrumb trail:
                hero.allPets[hero.activePets[i]].breadcrumb = [];
                for (var j = 0; j < breadCrumbLength; j++) {
                    hero.allPets[hero.activePets[i]].breadcrumb[j] = [hero.allPets[hero.activePets[i]].tileX, hero.allPets[hero.activePets[i]].tileY];
                }
            }
        }
    }
    // fill hero breadcrumb array with herox and heroy:
    for (var i = 0; i < breadCrumbLength; i++) {
        hero.breadcrumb[i] = [hero.tileX, hero.tileY];
    }

    // initialise items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        thisMapData.items[i].x = getTileCentreCoordX(thisMapData.items[i].tileX);
        thisMapData.items[i].y = getTileCentreCoordY(thisMapData.items[i].tileY);
        thisMapData.items[i].z = getElevation(thisMapData.items[i].tileX, thisMapData.items[i].tileY);
        thisMapData.items[i].width = currentActiveInventoryItems[thisMapData.items[i].type].width;
        thisMapData.items[i].height = currentActiveInventoryItems[thisMapData.items[i].type].height;
        thisMapData.items[i].centreX = currentActiveInventoryItems[thisMapData.items[i].type].centreX;
        thisMapData.items[i].centreY = currentActiveInventoryItems[thisMapData.items[i].type].centreY;

        // check for node resources:
        if (currentActiveInventoryItems[thisMapData.items[i].type].action == "node") {
            // use the saved value if it has one:
            if (!thisMapData.items[i].timeLastHarvested) {
                // otherwise, set it so it can be instantly harvested:
                thisMapData.items[i].timeLastHarvested = hero.totalGameTimePlayed - currentActiveInventoryItems[thisMapData.items[i].type].respawnRate;
            }
        }
    }
    activeNPCForDialogue = '';
    // determine tile offset to centre the hero in the centre
    hero.x = getTileCentreCoordX(hero.tileX);
    hero.y = getTileCentreCoordY(hero.tileY);
    hero.z = getElevation(hero.tileX, hero.tileY);

    // initialise fae:
    fae.x = hero.x + tileW * 2;
    fae.y = hero.y + tileH * 2;
    fae.currentState = "hero";
    fae.z = hero.z;
    fae.dz = 1;
    // fae.pulse = 0;



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
        npcImages[thisMapData.npcs[i].name].src = '';
        npcImages[thisMapData.npcs[i].name] = null;
    }
    for (var i in itemGraphicsToLoad) {
        itemImages[itemGraphicsToLoad[i]].src = '';
        itemImages[itemGraphicsToLoad[i]] = null;
    }
    backgroundImg.src = '';
    backgroundImg = null;
}


function loadingProgress() {
    // make this graphical where appropriate ####
    //  console.log("loading - " + Loader.getProgress());
}


function changeMaps(doorX, doorY) {
    previousZoneName = thisMapData.zoneName;
    gameMode = "mapLoading";
    removeMapAssets();
    var doorData = thisMapData.doors;
    var whichDoor = doorX + "," + doorY;
    hero.tileX = doorData[whichDoor].startX;
    hero.tileY = doorData[whichDoor].startY;
    if (hasActivePet) {
        var tileOffsetX = 0;
        var tileOffsetY = 0;
        switch (hero.facing) {
            case "n":
                tileOffsetY = 1;
                break
            case "s":
                tileOffsetY = -1;
                break
            case "e":
                tileOffsetX = -1;
                break
            case "w":
                tileOffsetX = 1;
                break
        }
        for (var i = 0; i < hero.activePets.length; i++) {
            hero.allPets[hero.activePets[i]].tileX = doorData[whichDoor].startX + (tileOffsetX * (i + 1));
            hero.allPets[hero.activePets[i]].tileY = doorData[whichDoor].startY + (tileOffsetY * (i + 1));
            if (i == 0) {
                hero.allPets[hero.activePets[i]].state = "moving";
            } else {
                // will be placed out of the normal map grid:
                console.log("pet "+i+" is queuing");
                hero.allPets[hero.activePets[i]].state = "queuing";
            }
            hero.allPets[hero.activePets[i]].facing = hero.facing;
        }
    }
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
}




function startDoorTransition() {
    if (mapTransition == "") {
        mapTransitionCurrentFrames = 1;
        mapTransition = "out";
        if (activeNPCForDialogue != '') {

            //  dialogue.classList.add("slowerFade");
            dialogue.classList.remove("active");
            UI.removeActiveDialogue();
        }
        /*
        // drop breadcrumb for the door, as the tile centre check won't be reached while map transitioning:
        hero.breadcrumb.pop();
        hero.breadcrumb.unshift([getTileCentreCoordX(activeDoorX), getTileCentreCoordY(activeDoorY)]);
        */
    }
    if (currentMap < 0) {
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
    

    // tile collisions:
    if (key[2]) {
        // up
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            // find the tile's bottom edge
            var tileCollidedWith = getTileY(hero.y - hero.height / 2);
            var tileBottomEdge = (tileCollidedWith + 1) * tileW;
            // use the +1 to make sure it's just clear of the collision tile
            hero.y = tileBottomEdge + hero.height / 2 + 1;
        } 
    }
    if (key[3]) {
        // down
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2))) {
            var tileCollidedWith = getTileY(hero.y + hero.height / 2);
            var tileTopEdge = (tileCollidedWith) * tileW;
            hero.y = tileTopEdge - hero.height / 2 - 1;
        } 
    }
    if (key[0]) {
        // left/west
        if ((isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x - hero.width / 2);
            var tileRightEdge = (tileCollidedWith + 1) * tileW;
            hero.x = tileRightEdge + hero.width / 2 + 1;
        } 
    }
    if (key[1]) {
        //right/east
        if ((isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.height / 2)) || (isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.height / 2))) {
            var tileCollidedWith = getTileX(hero.x + hero.width / 2);
            var tileLeftEdge = (tileCollidedWith) * tileW;
            hero.x = tileLeftEdge - hero.width / 2 - 1;
        } 
    }

    var thisNPC, thisItem;
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

    // check against pets:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
        if (isAnObjectCollision(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].width, hero.allPets[hero.activePets[i]].height, hero.x, hero.y, hero.width, hero.height)) {
            getHeroAsCloseAsPossibleToObject(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].width, hero.allPets[hero.activePets[i]].height);
            pushPetAway(i);

        }
    }
    }
}



function gameLoop() {
    switch (gameMode) {
        case "mapLoading":
            //    console.log("loading map assets...");
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
    hero.totalGameTimePlayed++;
    var elapsed = (now - lastTime);
    lastTime = now;
    hero.isMoving = false;
    //oldHeroX = hero.x;
    //oldHeroY = hero.y;
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
        if ((hero.tileX != heroOldX) || (hero.tileY != heroOldY)) {
            heroIsInNewTile();
        }
        // check to see if a dialogue balloon is open, and if the hero has moved far from the NPC:
        if (activeNPCForDialogue != '') {
            if (!(isInRange(hero.x, hero.y, activeNPCForDialogue.x, activeNPCForDialogue.y, closeDialogueDistance))) {
                dialogue.classList.add("slowerFade");
                dialogue.classList.remove("active");
                // close the shop
                if (shopCurrentlyOpen != -1) {
                    activeNPCForDialogue.speechIndex = 0;
                    UI.closeShop();
                }
                // only remove this after dialogue has faded out completely:
                dialogue.addEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
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
            console.log("changing");
            console.log(activeDoorX+", "+activeDoorY);
            changeMaps(activeDoorX, activeDoorY);
        }
    }
    if (mapTransition == "in") {
        // make it transition in faster:
        mapTransitionCurrentFrames += 2;
        if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
            mapTransition = "";
              activeDoorX = -1;
    activeDoorY = -1;
        }
    }
    timeSinceLastFrameSwap += elapsed;
    if (timeSinceLastFrameSwap > animationUpdateTime) {
        currentAnimationFrame++;
        timeSinceLastFrameSwap = 0;
        animateFae();
    }
    moveFae();
    moveNPCs();
    movePet();
    audio.checkForAmbientSounds();
}



function heroIsInNewTile() {
    hero.z = getElevation(getCurrentTileX(hero.x), getCurrentTileY(hero.y));
    if (currentMap < 0) {
        updateCartographicMiniMap();
    }
    var thisHotspot, thisTileCentreX, thisTileCentreY;
    // check for hotspots:
    for (var i = 0; i < thisMapData.hotspots.length; i++) {
        thisHotspot = thisMapData.hotspots[i];
        thisTileCentreX = getTileCentreCoordX(thisHotspot.centreX);
        thisTileCentreY = getTileCentreCoordY(thisHotspot.centreY);
        if (isInRange(hero.x, hero.y, thisTileCentreX, thisTileCentreY, thisHotspot.radius * tileW)) {
            if (typeof thisHotspot.quest !== "undefined") {
                if (questData[thisHotspot.quest].hasBeenActivated < 1) {
                    UI.showNotification("<p>" + thisHotspot.message + "</p>");
                }
                questData[thisHotspot.quest].hasBeenActivated = 1;
            }
            if (typeof thisHotspot.music !== "undefined") {
                audio.playMusic(thisHotspot.music);
            }
        }
        if (fae.currentState == "hero") {
            // check it's not recently visited this hotspot:
            if (fae.recentHotspots.indexOf(i) === -1) {
                if (isInRange(fae.x, fae.y, thisTileCentreX, thisTileCentreY, fae.range)) {
                    if (hasLineOfSight(getTileX(fae.x), getTileX(fae.y), thisHotspot.centreX, thisHotspot.centreY)) {
                        fae.targetX = thisTileCentreX;
                        fae.targetY = thisTileCentreY;
                        // add this to the list of hotspots so it doesn't return to it again and again:
                        fae.recentHotspots.push(i);
                        fae.currentState = "away";
                    }
                }
            }
        }
    }
    if (fae.currentState == "wait") {
        // check if hero has moved far away, and return if so:
        if (!(isInRange(fae.x, fae.y, hero.x, hero.y, fae.abandonRadius))) {
            if (hasLineOfSight(getTileX(fae.x), getTileX(fae.y), hero.tileX, hero.tileY)) {
                fae.currentState = "hero";
            }
        }
    }
    // update the hero's breadcrub trail:
    hero.breadcrumb.pop();
    hero.breadcrumb.unshift([hero.tileX, hero.tileY]);

if(thisMapData.collisions[hero.tileY][hero.tileX] == "d") {
     activeDoorX = hero.tileX;
 activeDoorY = hero.tileY;
startDoorTransition();
}
}






function checkForActions() {
    var inventoryCheck = [];

    var slotMarkup, thisSlotsId, thisSlotElem, thisNPC;
    // loop through items:
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (isInRange(hero.x, hero.y, thisMapData.items[i].x, thisMapData.items[i].y, (thisMapData.items[i].width / 2 + hero.width / 2 + 6))) {
            if (isFacing(hero, thisMapData.items[i])) {
                var actionValue = currentActiveInventoryItems[thisMapData.items[i].type].actionValue;

                switch (currentActiveInventoryItems[thisMapData.items[i].type].action) {
                    case "static":
                        // can't interact with it - do nothing
                        break;
                    case "sound":
                        audio.playSound(soundEffects[actionValue], 0);
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
                    case "node":
                        // check it's not still re-spawning:
                        console.log(hero.totalGameTimePlayed + " " + thisMapData.items[i].timeLastHarvested + " > " + currentActiveInventoryItems[thisMapData.items[i].type].respawnRate);
                        if (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData.items[i].type].respawnRate) {
                            // pick a random item from the possible items:
                            var whichItem = getRandomIntegerInclusive(1, thisMapData.items[i].contains.length);

                            // try and add it:
                            inventoryCheck = canAddItemToInventory([thisMapData.items[i].contains[whichItem - 1]]);
                            if (inventoryCheck[0]) {
                                // reset timer:
                                thisMapData.items[i].timeLastHarvested = hero.totalGameTimePlayed;
                                UI.showChangeInInventory(inventoryCheck[1]);
                            } else {
                                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                            }
                        }
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

                        if (shopCurrentlyOpen != -1) {
                            UI.closeShop();
                        }

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


function processSpeech(thisNPC, thisSpeechPassedIn, thisSpeechCode, isPartOfNPCsNormalSpeech) {
    // thisSpeech is global so it can be edited in the close quest functions:
    thisSpeech = thisSpeechPassedIn;
    // isPartOfNPCsNormalSpeech is false if not set:
    isPartOfNPCsNormalSpeech = typeof isPartOfNPCsNormalSpeech !== 'undefined' ? isPartOfNPCsNormalSpeech : false;
    var individualSpeechCodes = thisSpeechCode.split(",");
    for (var i = 0; i < individualSpeechCodes.length; i++) {
        switch (individualSpeechCodes[i]) {
            case "once":
                thisNPC.speech.splice(thisNPC.speechIndex, 1);
                // knock this back one so to keep it in step with the removed item:
                thisNPC.speechIndex--;
                break;
            case "shop":
                UI.openShop(generateHash(thisNPC.speech[thisNPC.speechIndex][2]));
                //thisNPC.speechIndex--;

                break;
            case "sound":
                audio.playSound(soundEffects[thisNPC.speech[thisNPC.speechIndex][2]], 0);
                break;
            case "profession":
                var professionId = thisNPC.speech[thisNPC.speechIndex][2];
                if (hero.professionsKnown.indexOf(professionId) == -1) {
                    hero.professionsKnown.push(professionId);
                    showNotification('<p>You learned a new profession</p>');
                }
                break;
            case "follower":
                var followerId = thisNPC.speech[thisNPC.speechIndex][2];

                if (hero.professionsKnown.indexOf(followerId) == -1) {
                    hero.professionsKnown.push(followerId);
                    showNotification('<p>You gained a new follower</p>');
                }

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
                                            console.log(currentThresholdValue + " < " + questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1));
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
    if (thisSpeech != "") {
        // don't show the balloon if there's no speech (which might happen if the NPC is just plays a sound instead)
        UI.showDialogue(thisNPC, thisSpeech);
    } else {
        thisNPC.speechIndex--;
    }
    canCloseDialogueBalloonNextClick = false;
    if (!isPartOfNPCsNormalSpeech) {
        // set a flag so that pressing action near the NPC will close the balloon:
        canCloseDialogueBalloonNextClick = true;
    }
}




function closeQuest(whichNPC, whichQuestId) {
    if (giveQuestRewards(whichQuestId)) {
        if (questData[whichQuestId].isRepeatable > 0) {
            questData[whichQuestId].hasBeenCompleted = false;
            questData[whichQuestId].isUnderway = false;
        } else {
            questData[whichQuestId].hasBeenCompleted = true;
            // remove quest text now:
            whichNPC.speech.splice(whichNPC.speechIndex, 1);
            // knock this back one so to keep it in step with the removed item:
            whichNPC.speechIndex--;
        }
        checkForTitlesAwarded(whichQuestId);
    } else {
        // keep the NPC on the quest dialogue:
        whichNPC.speechIndex--;
    }
}





function giveQuestRewards(whichQuestId) {
    // give any reward to the player:
    if (questData[whichQuestId].itemsReceivedOnCompletion) {
        var allRewardItems = [];
        var questRewards = questData[whichQuestId].itemsReceivedOnCompletion.split(",");
        for (var i = 0; i < questRewards.length; i++) {
            // check for variation:
            var questPossibilities = questRewards[i].split("/");
            var questRewardToUse = getRandomElementFromArray(questPossibilities);
            // check for any quantities:
            var thisQuestReward = questRewardToUse.split("x");
            var thisQuantity, thisItem;
            if (thisQuestReward.length > 1) {
                thisQuantity = thisQuestReward[0];
                thisItem = thisQuestReward[1];
            } else {
                thisQuantity = 1;
                thisItem = questRewards[i];
            }

            if (questPossibilities.length > 1) {
                // might need to show the name of the item in the speech:           
                thisSpeech = thisSpeech.replace(/##itemName##/i, currentActiveInventoryItems[parseInt(thisItem)].shortname);
            }
            // build item object:
            var thisRewardObject = {
                "type": parseInt(thisItem),
                "quantity": parseInt(thisQuantity),
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
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

            return true;
        } else {
            UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
            // don't close quest
            return false;
        }
    } else {
        return true;
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
        thisChallengeNPC = thisMapData.npcs[i];
        if (isInRange(hero.x, hero.y, thisChallengeNPC.x, thisChallengeNPC.y, (thisChallengeNPC.width + hero.width))) {
            if (isFacing(hero, thisChallengeNPC)) {
                if (thisChallengeNPC.cardGameSpeech) {
                    thisChallengeNPC.drawnFacing = turntoFace(thisChallengeNPC, hero);
                    processSpeech(thisChallengeNPC, thisChallengeNPC.cardGameSpeech.challenge[0], thisChallengeNPC.cardGameSpeech.challenge[1]);
                }
            }
        }
    }
    // challenge processed, so cancel the key event:
    key[6] = 0;
}


function moveNPCs() {
    var thisNPC, newTile, thisNextMovement, oldNPCx, oldNPCy, thisOtherNPC, thisItem, thisNextMovement, thisNextMovementCode;
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

            // check for collision against pet:
            if (hasActivePet) {
                for (var j = 0; j < hero.activePets.length; j++) {
                if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.height, hero.allPets[hero.activePets[j]].x, hero.allPets[hero.activePets[j]].y, hero.allPets[hero.activePets[j]].width, hero.allPets[hero.activePets[j]].height)) {
                    thisNPC.x = oldNPCx;
                    thisNPC.y = oldNPCy;
                }
            }
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
            for (var j = 0; j < thisMapData.items.length; j++) {
                thisItem = thisMapData.items[j];
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
        }

        if (newTile || thisNPC.forceNewMovementCheck) {
            thisNPC.tileX = getTileX(thisNPC.x);
            thisNPC.tileY = getTileY(thisNPC.y);
            thisNPC.movementIndex++;
            if (thisNPC.movementIndex >= thisNPC.movement.length) {
                thisNPC.movementIndex = 0;
            }
            thisNextMovement = thisNPC.movement[thisNPC.movementIndex];
            if (typeof thisNextMovement !== 'string') {
                // it's an array, get the first element as the code:
                thisNextMovementCode = thisNextMovement[0];
            } else {
                thisNextMovementCode = thisNextMovement;
            }
            switch (thisNextMovementCode) {

                case '-':
                    // stand still:
                    thisNPC.isMoving = false;
                    thisNPC.forceNewMovementCheck = false;

                case '?':
                    do {
                        // pick a random facing:
                        thisNPC.facing = facingsPossible[Math.floor(Math.random() * facingsPossible.length)];
                        // check that the target tile is walkable:
                    } while (isATerrainCollision(thisNPC.x + (relativeFacing[thisNPC.facing]["x"] * tileW), thisNPC.y + (relativeFacing[thisNPC.facing]["y"] * tileW)));
                    thisNPC.forceNewMovementCheck = false;
                    break;

                case 'find':
                    thisNPC.forceNewMovementCheck = true;
                    if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {
                        pathfindingWorker.postMessage([thisNextMovement[1], thisNPC, thisMapData]);
                        // make sure to only request this once:
                        thisNPC.isMoving = false;
                        thisNPC.waitingForAPath = true;
                        thisNPC.waitingTimer = 0;

                        // play animation while waiting
                        // thisNextMovement[2]
                        // #######

                        // keep the NPC waiting:
                        thisNPC.movementIndex--;
                    } else {
                        // check timer:
                        thisNPC.waitingTimer++;
                        if (thisNPC.waitingTimer > thisNextMovement[3]) {
                            thisNPC.isMoving = true;
                        } else {
                            // keep waiting until got a path, and the timer has expired
                            thisNPC.movementIndex--;
                            thisNPC.isMoving = false;
                        }
                    }
                    break;

                case 'proximity':
                    // wait for the hero to be nearby
                    thisNPC.forceNewMovementCheck = true;
                    var tileRadius = thisNextMovement[1];
                    if ((isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, tileRadius * tileW))) {
                        // pick up the next movement code on the next loop round:
                        thisNPC.isMoving = true;
                    } else {
                        thisNPC.isMoving = false;
                        // keep it on the waiting item to keep checking:
                        thisNPC.movementIndex--;
                    }
                    break;

                case 'remove':
                    // remove the element before, as well as this "remove" instruction (so 2 elements to be removed):
                    thisNPC.movement.splice((thisNPC.movementIndex - 1), 2);
                    break;

                case 'pathEnd':
                    var targetDestination = thisNPC.lastTargetDestination.split("-");
                    thisNPC.drawnFacing = turntoFaceTile(thisNPC, targetDestination[0], targetDestination[1]);

                    var thisPreviousMovement;
                    // find the "find" before this and remove all elements after that to this index:
                    for (j = thisNPC.movementIndex; j >= 0; j--) {
                        thisPreviousMovement = thisNPC.movement[j];
                        if (typeof thisPreviousMovement !== 'string') {
                            if (thisPreviousMovement[0] == 'find') {
                                var numberOfElementsRemoved = thisNPC.movementIndex - (j);
                                thisNPC.movement.splice(j + 1, numberOfElementsRemoved);
                                thisNPC.movementIndex -= numberOfElementsRemoved;
                                thisNPC.isMoving = false;
                                thisNPC.forceNewMovementCheck = true;
                                thisNPC.waitingTimer = undefined;
                                break;
                            }
                        }
                    }
                    break;

                case 'talkToNeighbour':
                    // find an adjacent NPC and get them to turn to face this NPC
                    for (var j = 0; j < thisMapData.npcs.length; j++) {
                        if (i != j) {
                            thisOtherNPC = thisMapData.npcs[j];
                            if (Math.abs(thisOtherNPC.tileX - thisNPC.tileX) <= 1) {
                                if (Math.abs(thisOtherNPC.tileY - thisNPC.tileY) <= 1) {
                                    thisOtherNPC.drawnFacing = turntoFace(thisOtherNPC, thisNPC);
                                }
                            }
                        }
                    }
                    break;

                default:
                    thisNPC.facing = thisNextMovement;
                    thisNPC.forceNewMovementCheck = false;
                    break;
            }
        }
    }
}




function canLearnRecipe(recipeIndex) {
    var wasSuccessful = false;
    if (hero.recipesKnown.indexOf(recipeIndex) === -1) {
        // check for pre-requisites
        // #####
        hero.recipesKnown.push([parseInt(recipeIndex), 0]);
        // need to show a notification
        // reload the recipe data
        // ###
    }
    return wasSuccessful;
}






function draw() {
    if (gameMode == "mapLoading") {
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fillStyle = "#000000";
        gameContext.fill();
    } else {
        // get all assets to be drawn in a list - start with the hero:

        var thisGraphicCentreX, thisGraphicCentreY, thisX, thisY, thisNPC, thisItem;

        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
      /*
        var assetsToDraw = [
            [findIsoDepth(hero.x, hero.y, hero.z), "img", heroImg, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY - hero.z)]
        ];
        */
            var heroOffsetCol = currentAnimationFrame % hero["animation"]["walk"]["length"];
            var heroOffsetRow = hero["animation"]["walk"][hero.facing];
    var assetsToDraw = [
            [findIsoDepth(hero.x, hero.y, hero.z), "sprite", heroImg, heroOffsetCol * hero.spriteWidth, heroOffsetRow * hero.spriteHeight, hero.spriteWidth, hero.spriteHeight, Math.floor(canvasWidth / 2 - hero.feetOffsetX), Math.floor(canvasHeight / 2 - hero.feetOffsetY - hero.z), hero.spriteWidth, hero.spriteHeight]
        ];

        // draw fae:
        thisX = findIsoCoordsX(fae.x, fae.y);
        thisY = findIsoCoordsY(fae.x, fae.y);
        fae.oscillateOffset = ((Math.sin(fae.dz) + 1) * 8) + fae.z + fae.zOffset;
        assetsToDraw.push([findIsoDepth(fae.x, fae.y, fae.z), "faeCentre", Math.floor(thisX - hero.isox + (canvasWidth / 2)), Math.floor(thisY - hero.isoy + (canvasHeight / 2) - fae.oscillateOffset)]);

        // draw fae particles:
        for (var i = 0; i < fae.particles.length; i++) {
            assetsToDraw.push([fae.particles[i].depth, "faeParticle", Math.floor(fae.particles[i].isoX - hero.isox + (canvasWidth / 2)), Math.floor(fae.particles[i].isoY - hero.isoy + (canvasHeight / 2)), fae.particles[i].alpha]);
        }

        var map = thisMapData.terrain;

        var thisNPCOffsetCol = 0;
        var thisNPCOffsetRow = 0;

        var thisFileColourSuffix = '';
        var thisColourName;
        var thisItemIdentifier;

        for (var i = 0; i < mapTilesX; i++) {
            for (var j = 0; j < mapTilesY; j++) {
                // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                // this makes the map array more readable when editing
                if (map[j][i] != "*") {
                    thisX = getTileIsoCentreCoordX(i, j);
                    thisY = getTileIsoCentreCoordY(i, j);
                    thisGraphicCentreX = thisMapData.graphics[(map[j][i])].centreX;
                    thisGraphicCentreY = thisMapData.graphics[(map[j][i])].centreY;
                    assetsToDraw.push([findIsoDepth(getTileCentreCoordX(i), getTileCentreCoordY(j), 0), "img", tileImages[(map[j][i])], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                }
            }
        }

        if (hasActivePet) {
             for (var i = 0; i < hero.activePets.length; i++) {
            thisNPCOffsetCol = currentAnimationFrame % hero.allPets[hero.activePets[i]]["animation"]["walk"]["length"];
            thisNPCOffsetRow = hero.allPets[hero.activePets[i]]["animation"]["walk"][hero.allPets[hero.activePets[i]].facing];
            thisX = findIsoCoordsX(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
            thisY = findIsoCoordsY(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
            assetsToDraw.push([findIsoDepth(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].z), "sprite", activePetImages[i], thisNPCOffsetCol * hero.allPets[hero.activePets[i]].spriteWidth, thisNPCOffsetRow * hero.allPets[hero.activePets[i]].spriteHeight, hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight, Math.floor(thisX - hero.isox - hero.allPets[hero.activePets[i]].centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - hero.allPets[hero.activePets[i]].centreY + (canvasHeight / 2) - hero.allPets[hero.activePets[i]].z), hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight]);
        }
    }

        for (var i = 0; i < thisMapData.npcs.length; i++) {
            thisNPC = thisMapData.npcs[i];
            thisNPCOffsetCol = currentAnimationFrame % thisNPC["animation"]["walk"]["length"];
            thisNPCOffsetRow = thisNPC["animation"]["walk"][thisNPC.drawnFacing];
            thisX = findIsoCoordsX(thisNPC.x, thisNPC.y);
            thisY = findIsoCoordsY(thisNPC.x, thisNPC.y);

            //assetsToDraw.push([findIsoDepth(thisX, thisY), npcImages[i], Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2))]);


            assetsToDraw.push([findIsoDepth(thisNPC.x, thisNPC.y, thisNPC.z), "sprite", npcImages[thisMapData.npcs[i].name], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2) - thisNPC.z), thisNPC.spriteWidth, thisNPC.spriteHeight]);
        }


        for (var i = 0; i < thisMapData.items.length; i++) {
            thisItem = thisMapData.items[i];
            thisX = findIsoCoordsX(thisItem.x, thisItem.y);
            thisY = findIsoCoordsY(thisItem.x, thisItem.y);


            thisFileColourSuffix = "";
            if (thisMapData.items[i].colour) {
                thisColourName = getColourName(thisMapData.items[i].colour, thisMapData.items[i].type);
                if (thisColourName != "") {
                    thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                }
            }
            thisItemIdentifier = "item" + thisMapData.items[i].type + thisFileColourSuffix;

            assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z)]);
        }

        assetsToDraw.sort(sortByLowestValue);
        // don't need to clear, as the background will overwrite anyway - this means there's less to process.
        // scroll background to match the top tip and left tip of the tile grid:
        // the 400px and 300px are "padding" the edges of the background graphics:
        gameContext.drawImage(backgroundImg, Math.floor(getTileIsoCentreCoordX(0, mapTilesX - 1) - hero.isox - tileW / 2 - 400 + canvasWidth / 2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - tileH / 2 - 300 + canvasHeight / 2));
        // draw the sorted assets:
        for (var i = 0; i < assetsToDraw.length; i++) {
            switch (assetsToDraw[i][1]) {
                case "faeCentre":
                    // draw fae:
                    drawCircle("#ffdc0c", assetsToDraw[i][2], assetsToDraw[i][3], 2);
                    drawCircle("rgba(255,220,255,0.3)", assetsToDraw[i][2], assetsToDraw[i][3], 4);
                    // draw fae's shadow - make it respond to the fae's height:
                    gameContext.fillStyle = "rgba(0,0,0," + (65 - fae.oscillateOffset) * 0.01 + ")";
                    gameContext.beginPath();
                    gameContext.ellipse(assetsToDraw[i][2] - getXOffsetFromHeight(fae.oscillateOffset), assetsToDraw[i][3] + fae.oscillateOffset, 3, 1, 0, 0, 2 * Math.PI);
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

        if (activeNPCForDialogue != '') {
            UI.updateDialogue(activeNPCForDialogue);
        }

        // draw the map transition if it's needed:
        if (mapTransition == "out") {
            var gradientSize = (1 - (mapTransitionCurrentFrames / mapTransitionMaxFrames));

            if (gradientSize < 0.02) {
                // draw a rectangle, otherwise a pixel hole is still visible:
                gameContext.fillStyle = "#000000";
                gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
            } else {
                var gradient = gameContext.createRadialGradient(canvasWidth / 2, canvasHeight / 2, gradientSize * canvasWidth / 2, canvasWidth / 2, canvasHeight / 2, 0);
                gradient.addColorStop(0, "rgba(0,0,0,1)");
                gradient.addColorStop(1, "rgba(0,0,0,0)");
                gameContext.fillStyle = gradient;
                gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
            }
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
