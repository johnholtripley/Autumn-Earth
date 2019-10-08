// service worker:
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/game-world/serviceWorker.min.js', {
        updateViaCache: 'imports',
        scope: '/game-world/'
    });
}

function sizeCanvasSize() {
    // size it to the screen (check to see if actual screen size is smaller for high resolution mobile)
    availableScreenWidth = window.innerWidth;
    availableScreenHeight = window.innerHeight;
    if (screen.width < window.innerWidth) {
        availableScreenWidth = screen.width;
    }
    if (screen.height < window.innerHeight) {
        availableScreenHeight = screen.height;
    }
    gameContext.canvas.width = availableScreenWidth;
    gameContext.canvas.height = availableScreenHeight;
    lightMapContext.canvas.width = availableScreenWidth / 4;
    lightMapContext.canvas.height = availableScreenHeight / 4;
    canvasWidth = availableScreenWidth;
    canvasHeight = availableScreenHeight;
}

var debouncedResize = debounce(function() {
    sizeCanvasSize();
}, 250);
window.addEventListener('resize', debouncedResize);


function loadGlobalMapData() {

    getJSON("/data/world-map.json", function(data) {

        worldMap = data.worldMap;
        init();
    }, function(status) {
        // error - try again:
        loadGlobalMapData();
    });
}


function init() {
    gameCanvas = document.getElementById("gameWorld");
    if (gameCanvas.getContext) {
        gameContext = gameCanvas.getContext('2d');
        lightMapOverlay = document.getElementById("lightMapOverlay");
        lightMapContext = lightMapOverlay.getContext('2d');
        sizeCanvasSize();
        whichTransitionEvent = determineWhichTransitionEvent();
        whichAnimationEvent = determineWhichAnimationEvent();
        gameMode = "mapLoading";
        cartographyCanvas = document.getElementById("cartographyCanvas");
        cartographyContext = cartographyCanvas.getContext('2d');
        offScreenCartographyCanvas = document.getElementById('offScreenCartographyCanvas');
        offScreenCartographyContext = offScreenCartographyCanvas.getContext('2d');
        canvasMapImage = new Image();
        canvasMapMaskImage = new Image();
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
    getJSON("/game-world/getCoreData.php?chr=" + characterId, function(data) {
        //  thisMapData = data.map;
        // copy the data to the hero object:
        for (var attribute in data.gameState) {
            hero[attribute] = data.gameState[attribute];
        }
        newMap = findMapNumberFromGlobalCoordinates(data.gameState.tileX, data.gameState.tileY);
        //   visibleMaps.push(newMap);


        //visibleMapsLoading = [newMap];

        gameSettings = data.gameState.settings;

        timeSinceLastAmbientSoundWasPlayed = hero.totalGameTimePlayed + (minTimeBetweenAmbientSounds * 1.25);
        if (data.gameState.allPets) {
            if (data.gameState.activePets.length > 0) {
                hasActivePet = true;
            }
            //   hero.activePets = data.activePets;
            //   hero.allPets = data.allPets;
        }
        // copy the fae properties that will change into the main fae object:
        for (var attrname in data.gameState.fae) {
            fae[attrname] = data.gameState.fae[attrname];
        }


        // determine current map:
        currentMap = newMap;


        //  hero.inventory = data.inventory;
        if (currentMap > 0) {
            //clean old procedural maps: (don't need a response here)
            sendDataWithoutNeedingAResponse('/game-world/generateCircularDungeonMap.php?playerId=' + characterId + '&clearMaps=true');
        }

        hero.x = getTileCentreCoordX(hero.tileX);
        hero.y = getTileCentreCoordY(hero.tileY);
        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
        //updateVisibleMaps();




        colourNames = data.colours.colourNames;
        UI.buildHorticulturePanel(data.horticulture.markup);
        hero.plantBreeding = data.horticulture.data;
        questData = data.quests;
        possibleTitles = data.titles;

        housingData = data.housingItems;


        cardGameNameSpace.allCardData = data.cards.cards;
        hero.cardBacks = data.cards.backs;
        hero.activeCardBack = data.cards.activeBack;
        UI.changeActiveCardBack();

        hero.crafting = data.recipes.professions;
        allRecipes = data.recipes.all;
        currentItemGroupFilters = data.recipes.itemGroups;

        UI.buildQuestJournal(data.journal.markup, data.journal.regions);

housingNameSpace.init();

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
    coreImagesToLoad.push({
        name: "shadowImg",
        src: '/images/game-world/core/shadow-quarter.png'
    });
    coreImagesToLoad.push({
        name: "tilledEarth",
        src: '/images/game-world/core/tilled.png'
    });
    coreImagesToLoad.push({
        name: "addedWater",
        src: '/images/game-world/core/added-water.png'
    });
    coreImagesToLoad.push({
        name: "ocean",
        src: '/images/game-world/core/ocean.png'
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
    shadowImg = Loader.getImage("shadowImg");
    tilledEarth = Loader.getImage("tilledEarth");
    addedWater = Loader.getImage("addedWater");
    ocean = Loader.getImage("ocean");
    oceanPattern = gameContext.createPattern(ocean, "repeat");
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            activePetImages[i] = Loader.getImage("activePet" + hero.activePets[i]);
        }
    }



    loadMap();
}


function processInitialMap() {
    var startTileOffsetX, startTileOffsetY;
    var startTileOffsetXNum = 0;
    var startTileOffsetYNum = 0;


    // check for any "?" in the target door (for procedural levels):
    if (hero.tileX.toString().indexOf("?") != -1) {
        // check for +1 or -1 modifiers:
        startTileOffsetX = hero.tileX.toString().substring(1);
        if (startTileOffsetX.length > 0) {
            startTileOffsetXNum = parseInt(startTileOffsetX);
        }
        hero.tileX = thisMapData[currentMap].entrance[0] + startTileOffsetXNum;
    }
    if (hero.tileY.toString().indexOf("?") != -1) {
        startTileOffsetY = hero.tileY.toString().substring(1);
        if (startTileOffsetY.length > 0) {
            startTileOffsetYNum = parseInt(startTileOffsetY);
        }
        hero.tileY = thisMapData[currentMap].entrance[1] + startTileOffsetYNum;
    }



    // set up pet positions:
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

            hero.allPets[hero.activePets[i]].tileX = hero.tileX + (tileOffsetX * (i + 1));
            hero.allPets[hero.activePets[i]].tileY = hero.tileY + (tileOffsetY * (i + 1));

            if (!isOverWorldMap) {
                // needed for Internal maps:
                if (i == 0) {
                    hero.allPets[hero.activePets[i]].state = "moving";
                } else {
                    // will be placed out of the normal map grid:
                    hero.allPets[hero.activePets[i]].state = "queuing";
                }
            }
            hero.allPets[hero.activePets[i]].state = "moving";
            hero.allPets[hero.activePets[i]].facing = hero.facing;

        }





    }


    mapTilesY = thisMapData[currentMap].terrain.length;
    mapTilesX = thisMapData[currentMap].terrain[0].length;
    if (previousZoneName != thisMapData[currentMap].zoneName) {
        UI.showZoneName(thisMapData[currentMap].zoneName);
        document.title = titleTagPrefix + ' - ' + thisMapData[currentMap].zoneName;
        cartographicTitle.innerHTML = thisMapData[currentMap].zoneName;
    }

    initCartographicMap();

    if (thisMapData[currentMap].showOnlyLineOfSight) {
        // initialise the lightmap with default values:
        lightMap = [];
        for (var row = mapTilesY - 1; row >= 0; row--) {
            var defaultRow = [];
            for (var col = mapTilesX - 1; col >= 0; col--) {
                defaultRow[col] = 0;
            }
            lightMap[row] = defaultRow;
        }
        updateLightMap();
    }
    if (thisMapData[currentMap].ambientSounds) {
        audio.loadAmbientSounds(thisMapData[currentMap].ambientSounds);
    }
    if (thisMapData[currentMap].hourChime) {
        audio.loadAmbientSounds({ "hourChime": thisMapData[currentMap].hourChime });
    }
    fae.recentHotspots = [];
    findInventoryItemData();
}

function loadNewVisibleMapAssets(whichMap) {
    if (whichMap < 0) {
        whichMap = 'dungeon/' + randomDungeonName;
    }
    // doesn't need full loader - don't need progress etc.:
    var newBackground = new Image();
    newBackground.onload = function() {
        backgroundImgs[whichMap] = newBackground;
    };
    newBackground.onerror = function() {
        // error handling? ####

    };
    newBackground.src = '/images/game-world/backgrounds/' + whichMap + '.png';


    // load items:
    var thisPathAndIdentifer;
    var newItemImagesToLoad = [];
    for (var i = 0; i < thisMapData[whichMap].items.length; i++) {

        thisPathAndIdentifer = getItemPathAndIdentifier(thisMapData[whichMap].items[i]);

        // only add unique images:
        if (typeof itemImages[(thisPathAndIdentifer[1])] === "undefined") {
            newItemImagesToLoad[(thisPathAndIdentifer[1])] = new Image();
            newItemImagesToLoad[(thisPathAndIdentifer[1])].identifier = thisPathAndIdentifer[1];
            newItemImagesToLoad[(thisPathAndIdentifer[1])].onload = function() {
                itemImages[this.identifier] = newItemImagesToLoad[this.identifier];
            };
            newItemImagesToLoad[(thisPathAndIdentifer[1])].onerror = function() {
                // error handling? ####
            };
            newItemImagesToLoad[(thisPathAndIdentifer[1])].src = thisPathAndIdentifer[0];
        }
    }


    // load terrain:
    var thisTerrainIdentifer;
    var newTerrainImagesToLoad = [];
    for (var i = 0; i < thisMapData[whichMap].graphics.length; i++) {
        thisTerrainIdentifer = thisMapData[whichMap].graphics[i].src;
        if (typeof tileImages[thisTerrainIdentifer] === "undefined") {
            newTerrainImagesToLoad[(thisTerrainIdentifer)] = new Image();
            newTerrainImagesToLoad[(thisTerrainIdentifer)].identifier = thisTerrainIdentifer;
            newTerrainImagesToLoad[(thisTerrainIdentifer)].onload = function() {
                tileImages[this.identifier] = newTerrainImagesToLoad[this.identifier];
            };
            newTerrainImagesToLoad[(thisTerrainIdentifer)].onerror = function() {
                // error handling? ####
            };
            //   if (thisTerrainIdentifer.indexOf('housing') !== -1) {
            //       newTerrainImagesToLoad[(thisTerrainIdentifer)].src = "/images/game-world/" + thisMapData[whichMap].graphics[i].src;
            //   } else {
            newTerrainImagesToLoad[(thisTerrainIdentifer)].src = "/images/game-world/terrain/" + thisMapData[whichMap].graphics[i].src;
            //   }

        }
    }


    // load NPCs
    var thisNPCIdentifier;
    var newNPCImagesToLoad = [];
    for (var i = 0; i < thisMapData[whichMap].npcs.length; i++) {
        thisNPCIdentifier = "npc" + thisMapData[whichMap].npcs[i].src;

        if (typeof npcImages[thisNPCIdentifier] === "undefined") {

            newNPCImagesToLoad[thisNPCIdentifier] = new Image();
            newNPCImagesToLoad[thisNPCIdentifier].identifier = thisNPCIdentifier;
            newNPCImagesToLoad[thisNPCIdentifier].onload = function() {
                npcImages[this.identifier] = newNPCImagesToLoad[this.identifier];

            };
            newNPCImagesToLoad[thisNPCIdentifier].onerror = function() {
                // error handling? ####
            };
            newNPCImagesToLoad[thisNPCIdentifier].src = "/images/game-world/npcs/" + thisMapData[whichMap].npcs[i].src;

        }
    }



    // check for nests, and get the graphics for any creatures they will spawn:
    for (var i = 0; i < thisMapData[whichMap].items.length; i++) {
        if (currentActiveInventoryItems[thisMapData[whichMap].items[i].type].action == "nest") {
            for (var j = 0; j < thisMapData[whichMap].items[i].contains.length; j++) {
                thisNPCIdentifier = "npc" + thisMapData[whichMap].items[i].contains[j].src;
                if (typeof npcImages[thisNPCIdentifier] === "undefined") {
                    newNPCImagesToLoad[thisNPCIdentifier] = new Image();
                    newNPCImagesToLoad[thisNPCIdentifier].identifier = thisNPCIdentifier;
                    newNPCImagesToLoad[thisNPCIdentifier].onload = function() {
                        npcImages[this.identifier] = newNPCImagesToLoad[this.identifier];
                    };
                    newNPCImagesToLoad[thisNPCIdentifier].onerror = function() {
                        // error handling? ####
                    };
                    newNPCImagesToLoad[thisNPCIdentifier].src = "/images/game-world/npcs/" + thisMapData[whichMap].npcs[i].src;

                }
            }
        }
    }






}


function processNewVisibleMapData(whichNewMap) {
    visibleMaps.push(whichNewMap);
    removeElementFromArray(visibleMapsLoading, whichNewMap);
    for (var i = 0; i < thisMapData[whichNewMap].items.length; i++) {
        initialiseItem(thisMapData[whichNewMap].items[i]);
    }
    for (var i = 0; i < thisMapData[whichNewMap].npcs.length; i++) {

        initialiseNPC(thisMapData[whichNewMap].npcs[i]);
    }


    /*
    // look for shops:
    thisMapShopItemIds = '';
    var shopData = '{"chr": ' + characterId + ',"region":"' + thisMapData[whichNewMap].region + '","shops": [';
    var addedShopDataAlready = false;
    // loop through shops and create hashes 
    for (var i = 0; i < thisMapData[whichNewMap].shops.length; i++) {
        thisMapData[whichNewMap].shops[i].hash = generateHash(thisMapData[whichNewMap].shops[i].name);
        if (addedShopDataAlready) {
            shopData += ",";
        }
        shopData += JSON.stringify(thisMapData[whichNewMap].shops[i]);
        addedShopDataAlready = true;
    }
    shopData += ']}';

    */
    updatePossibleWeather();
    loadNewVisibleMapAssets(whichNewMap);
}

function loadNewVisibleInventoryItemData(itemIdsToLoad, whichNewMap) {

    //  console.log("loading new inv data for map#"+whichNewMap+": " + itemIdsToLoad);
    if (itemIdsToLoad.length > 0) {
        getJSON("/game-world/getInventoryItems.php?isAnUpdate=true&whichIds=" + itemIdsToLoad, function(data) {
            // currentActiveInventoryItems = data;
            // append this new data in: 
            //  console.log("inv data returned ########### "+whichNewMap);
            for (var attrname in data) {
                //     console.log(attrname, data[attrname]);
                currentActiveInventoryItems[attrname] = data[attrname];
            }
            processNewVisibleMapData(whichNewMap);
        }, function(status) {
            // try again:
            loadNewVisibleInventoryItemData(itemIdsToLoad, whichNewMap);
        });
    } else {
        processNewVisibleMapData(whichNewMap)
    }
}




function loadNewVisibleJSON(mapFilePath, whichNewMap) {
    //   console.log("loading JSON for " + whichNewMap);
    getJSON(mapFilePath, function(data) {
            thisMapData[whichNewMap] = data.mapData.map;
            //   thisMapShopItemIds = data.shops.allItemIds;
            UI.buildShop(data.shops.markup);
            // find new items that require data:
            //console.log("loadNewVisibleJSON raw "+getItemIdsForMap(whichNewMap).join("."));
            var thisMapsItemIds = uniqueValues(getItemIdsForMap(whichNewMap));
            // var newItemIds = [];
            var newItemIds = data.shops.allItemIds;
            for (var i = 0; i < thisMapsItemIds.length; i++) {
                if (!(thisMapsItemIds[i] in currentActiveInventoryItems)) {
                    newItemIds.push(thisMapsItemIds[i]);
                }
            }
            //console.log("loadNewVisibleJSON "+newItemIds.join("."));
            loadNewVisibleInventoryItemData(newItemIds.join("|"), whichNewMap)
        },
        function(status) {
            loadNewVisibleJSON(mapFilePath, whichNewMap);
        });
}

function loadNewVisibleMap(whichNewMap) {
    if (visibleMapsLoading.indexOf(whichNewMap) === -1) {
        visibleMapsLoading.push(whichNewMap);
        var mapFilePath = '/game-world/getMap.php?chr=' + characterId + '&map=' + whichNewMap;
        loadNewVisibleJSON(mapFilePath, whichNewMap);
    }
}


function loadMapJSON(mapFilePath) {
    getJSON(mapFilePath, function(data) {
            thisMapData[data.mapData.map.mapId] = data.mapData.map;

            currentMap = data.mapData.map.mapId;


            var thisCurrentMap = currentMap;
            if (thisCurrentMap.indexOf('housing') === -1) {
                thisCurrentMap = parseInt(currentMap);
            }

            visibleMaps.push(thisCurrentMap);
            thisMapShopItemIds = data.shops.allItemIds;
            UI.buildShop(data.shops.markup);
            processInitialMap();
            isOverWorldMap = !data.mapData.map.isInside;
            if (isOverWorldMap) {
                updateVisibleMaps();
            }
        },
        function(status) {
            // try again:
            console.log("retrying..." + mapFilePath);
            loadMapJSON(mapFilePath);
        });
}

function loadMap() {
    var dungeonAppend = '';
    // check for newly entering a random dungeon:
    if ((newMap < 0) && (currentMap > 0)) {
        randomDungeonName = randomDungeons[Math.abs(newMap)];
        newMap = -1;
    }
    if (randomDungeonName != "") {
        dungeonAppend = '&dungeonName=' + randomDungeonName;
        //   dungeonAppend += '&seed=1552609714';
    }

    loadMapJSON('/game-world/getMap.php?chr=' + characterId + '&map=' + newMap + dungeonAppend);
}


function getItemPathAndIdentifier(whichItem) {
    // get colour name 
    var thisItemIdentifier, thisImagePath;
    var thisFileColourSuffix = "";
    if (whichItem.colour) {
        var thisColourName = getColourName(whichItem.colour, whichItem.type);
        if (thisColourName != "") {
            thisFileColourSuffix = "-" + thisColourName.toLowerCase();
        }
    }
    thisItemIdentifier = "item" + whichItem.type + thisFileColourSuffix;
    thisImagePath = "/images/game-world/items/" + currentActiveInventoryItems[whichItem.type].worldSrc + thisFileColourSuffix + ".png";

    // check for User Generated Content:
    if (typeof whichItem.contains !== "undefined") {
        if (typeof whichItem.contains['ugc-id'] !== "undefined") {
            thisItemIdentifier = "item" + whichItem.type + '_' + whichItem.contains['ugc-id'];
            thisImagePath = "/images/user-generated/" + whichItem.contains['ugc-id'] + "-world.png";
        }
    }
    return [thisImagePath, thisItemIdentifier];
}

function loadMapAssets() {
    imagesToLoad = [];
    var thisFileColourSuffix, thisColourName;
    var assetPath = currentMap;
    npcGraphicsToLoad = [];
    var thisNPCIdentifier, thisTerrainIdentifer;
    itemGraphicsToLoad = [];
    var thisItemIdentifier = '';
    var thisImagePath = '';
    var resultantPlantType;
    tileGraphicsToLoad = [];


    for (var m = 0; m < visibleMaps.length; m++) {
        assetPath = visibleMaps[m];

        if (visibleMaps[m] < 0) {
            assetPath = randomDungeonName;
        }
        if (newMap.toString().indexOf('housing') !== -1) {

            imagesToLoad.push({
                name: "backgroundImg" + currentMap,
                src: '/images/game-world/maps/housing/bg-' + mapTilesX + 'x' + mapTilesY + '.png'
            });
        } else {
            imagesToLoad.push({
                name: "backgroundImg" + visibleMaps[m],
                src: '/images/game-world/backgrounds/' + assetPath + '.png'
            });



        }
        //  tileGraphicsToLoad = thisMapData[visibleMaps[m]].graphics;
        for (var i = 0; i < thisMapData[visibleMaps[m]].graphics.length; i++) {
            thisTerrainIdentifer = thisMapData[visibleMaps[m]].graphics[i].src;
            //   if (thisTerrainIdentifer.indexOf('housing') !== -1) {
            //       imagesToLoad.push({
            //           name: thisTerrainIdentifer,
            //            src: "/images/game-world/" + thisMapData[visibleMaps[m]].graphics[i].src
            //       });
            //    } else {

            if (tileGraphicsToLoad.indexOf(thisTerrainIdentifer) == -1) {
                imagesToLoad.push({
                    //  name: "tile" + i,
                    name: thisTerrainIdentifer,
                    src: "/images/game-world/terrain/" + thisMapData[visibleMaps[m]].graphics[i].src
                });
                tileGraphicsToLoad.push(thisTerrainIdentifer);
            }
            //    }

        }

        for (var i = 0; i < thisMapData[visibleMaps[m]].npcs.length; i++) {
            thisNPCIdentifier = "npc" + thisMapData[visibleMaps[m]].npcs[i].src;
            if (npcGraphicsToLoad.indexOf(thisNPCIdentifier) == -1) {
                imagesToLoad.push({
                    name: thisNPCIdentifier,
                    src: "/images/game-world/npcs/" + thisMapData[visibleMaps[m]].npcs[i].src
                });
                npcGraphicsToLoad.push(thisNPCIdentifier);
            }
        }

        // check for nests, and get the graphics for any creatures they will spawn:
        for (var i = 0; i < thisMapData[visibleMaps[m]].items.length; i++) {
            if (currentActiveInventoryItems[thisMapData[visibleMaps[m]].items[i].type].action == "nest") {
                for (var j = 0; j < thisMapData[visibleMaps[m]].items[i].contains.length; j++) {
                    thisNPCIdentifier = "npc" + thisMapData[visibleMaps[m]].items[i].contains[j].src;
                    if (npcGraphicsToLoad.indexOf(thisNPCIdentifier) == -1) {
                        imagesToLoad.push({
                            name: thisNPCIdentifier,
                            src: "/images/game-world/npcs/" + thisMapData[visibleMaps[m]].items[i].contains[j].src
                        });
                        npcGraphicsToLoad.push(thisNPCIdentifier);
                    }
                }
            }
        }


        var thisPathAndIdentifer;

        for (var i = 0; i < thisMapData[visibleMaps[m]].items.length; i++) {
            thisPathAndIdentifer = getItemPathAndIdentifier(thisMapData[visibleMaps[m]].items[i]);


            // only add unique images:
            if (itemGraphicsToLoad.indexOf(thisPathAndIdentifer[1]) == -1) {
                imagesToLoad.push({
                    name: thisPathAndIdentifer[1],
                    src: thisPathAndIdentifer[0]
                });
                itemGraphicsToLoad.push(thisPathAndIdentifer[1]);
            }
        }

        // check for hidden resources:
        for (var i in thisMapData[visibleMaps[m]].hiddenResources) {
            for (var j in thisMapData[visibleMaps[m]].hiddenResources[i]) {
                thisItemIdentifier = "item" + thisMapData[visibleMaps[m]].hiddenResources[i][j].type;
                if (itemGraphicsToLoad.indexOf(thisItemIdentifier) == -1) {
                    imagesToLoad.push({
                        name: thisItemIdentifier,
                        src: "/images/game-world/items/" + currentActiveInventoryItems[thisMapData[visibleMaps[m]].hiddenResources[i][j].type].worldSrc + ".png"
                    });
                    itemGraphicsToLoad.push(thisItemIdentifier);
                }
            }
        }

        // check for seeds in inventory, and load the resultant plants:

        for (var key in hero.inventory) {
            if (currentActiveInventoryItems[(hero.inventory[key].type)].action == "seed") {
                // resultant plant is held in the actionValue:
                resultantPlantType = currentActiveInventoryItems[(hero.inventory[key].type)].actionValue.type;
                // get colour name 
                thisFileColourSuffix = "";
                thisColourName = getColourName(hero.inventory[key].colour, resultantPlantType);
                if (thisColourName != "") {
                    thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                }
                thisItemIdentifier = "item" + resultantPlantType + thisFileColourSuffix;

                // only add unique images:
                if (itemGraphicsToLoad.indexOf(thisItemIdentifier) == -1) {
                    imagesToLoad.push({
                        name: thisItemIdentifier,
                        src: "/images/game-world/items/" + currentActiveInventoryItems[resultantPlantType].worldSrc + thisFileColourSuffix + ".png"
                    });
                    itemGraphicsToLoad.push(thisItemIdentifier);
                }
            }
        }

    }


    Loader.preload(imagesToLoad, prepareGame, loadingProgress);
}

function getItemIdsForMap(whichMap) {
    // find items placed on this map:
    var itemChoices;
    var itemIdsToGet = [];
    for (var i = 0; i < thisMapData[whichMap].items.length; i++) {
        itemIdsToGet.push(thisMapData[whichMap].items[i].type);
        // check if any are containers or chests:
        if (typeof thisMapData[whichMap].items[i].contains !== "undefined") {

            if (Array.isArray(thisMapData[whichMap].items[i].contains)) {
                for (var j = 0; j < thisMapData[whichMap].items[i].contains.length; j++) {
                    if (typeof thisMapData[whichMap].items[i].contains[j].type !== "undefined") {
                        itemChoices = thisMapData[whichMap].items[i].contains[j].type.toString().split("/");

                        for (var k = 0; k < itemChoices.length; k++) {
                            if (itemChoices[k] != "$") {
                                // make sure it's not money in a chest:
                                itemIdsToGet.push(parseInt(itemChoices[k]));
                            }
                        }
                    }
                }
            } else {
                // make sure it's not UGC:
                if (typeof thisMapData[whichMap].items[i].contains['ugc-id'] === "undefined") {
                    // eg crop object, so get pollen, seed and fruit ids if specified:

                    for (var j in thisMapData[whichMap].items[i].contains) {
                        itemIdsToGet.push(thisMapData[whichMap].items[i].contains[j].type);
                    }
                }
            }
        }
    }

    // find items in hidden resources (and their contents):
    var containsSplit;
    for (var i in thisMapData[whichMap].hiddenResources) {
        for (var j in thisMapData[whichMap].hiddenResources[i]) {
            itemIdsToGet.push(thisMapData[whichMap].hiddenResources[i][j].type);
            if (thisMapData[whichMap].hiddenResources[i][j].contains) {
                for (var k in thisMapData[whichMap].hiddenResources[i][j].contains) {
                    containsSplit = thisMapData[whichMap].hiddenResources[i][j].contains[k].type.split("/");
                    for (var l = 0; l < containsSplit.length; l++) {
                        itemIdsToGet.push(parseInt(containsSplit[l]));
                    }

                }

            }
        }
    }
    return itemIdsToGet;
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



    for (var m = 0; m < visibleMaps.length; m++) {
        itemIdsToGet = itemIdsToGet.concat(getItemIdsForMap(visibleMaps[m]));
    }


    // find items in recipes:
    for (var i in hero.crafting) {
        for (var j in hero.crafting[i].filters['All']) {
            // get what's created:
            itemIdsToGet.push(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].creates);
            // get components:

            for (var k in hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components) {
                if (!(isNaN(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components[k].type))) {
                    itemIdsToGet.push(hero.crafting[i].recipes[(hero.crafting[i].filters['All'][j])].components[k].type);
                }
            }
        }
    }


    // add item available in any shops:
    if (thisMapShopItemIds != '') {
        itemIdsToGet.push(thisMapShopItemIds);
    }


    // check quest rewards ############

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


function initialiseNPC(whichNPC) {
    whichNPC.x = getTileCentreCoordX(whichNPC.tileX);
    whichNPC.y = getTileCentreCoordY(whichNPC.tileY);
    whichNPC.z = getElevation(whichNPC.tileX, whichNPC.tileY);
    whichNPC.drawnFacing = whichNPC.facing;
    whichNPC.dx = 0;
    whichNPC.dy = 0;
    if (typeof whichNPC.speechIndex === "undefined") {
        whichNPC.speechIndex = 0;
    }
    whichNPC.currentAnimation = 'walk';
    // set index to -1 so when it increases, it'll pick up the first (0) element:
    whichNPC.movementIndex = -1;
    // allow NPCs to pick up their facing without moving to that first tile:
    whichNPC.forceNewMovementCheck = true;
    // used for making sure that pathfinding NPCs don't head straight back to the last place they visited:
    whichNPC.lastTargetDestination = "";
    // whichNPC.index = whichNPC;

    whichNPC.uniqueIndex = generateHash("npc" + whichNPC.x + "*" + whichNPC.y);

    if (typeof whichNPC.reactionRange === "undefined") {
        whichNPC.reactionRange = 1;
    }
}

function initialiseItem(whichItem) {
    whichItem.x = getTileCentreCoordX(whichItem.tileX);
    whichItem.y = getTileCentreCoordY(whichItem.tileY);
    if (typeof whichItem.tileZ === "undefined") {
        whichItem.z = getElevation(whichItem.tileX, whichItem.tileY);
    } else {
        whichItem.z = whichItem.tileZ * tileW;
    }
    whichItem.width = currentActiveInventoryItems[whichItem.type].width;
    whichItem.length = currentActiveInventoryItems[whichItem.type].length;
    whichItem.centreX = currentActiveInventoryItems[whichItem.type].centreX;
    whichItem.centreY = currentActiveInventoryItems[whichItem.type].centreY;
    whichItem.spriteWidth = currentActiveInventoryItems[whichItem.type].spriteWidth;
    whichItem.spriteHeight = currentActiveInventoryItems[whichItem.type].spriteHeight;
    whichItem.isCollidable = true;
    if (currentActiveInventoryItems[whichItem.type].action == "gate") {
        if (whichItem.state == "open") {
            whichItem.isCollidable = false;
        }
    }
    // check for node resources:
    if (currentActiveInventoryItems[whichItem.type].action == "node") {
        // use the saved value if it has one:
        if (!whichItem.timeLastHarvested) {
            // otherwise, set it so it can be instantly harvested:
            whichItem.timeLastHarvested = hero.totalGameTimePlayed - currentActiveInventoryItems[whichItem.type].respawnRate;
        }

        // add stability and quantity values if it doesn't have them
        if (typeof whichItem.stability === "undefined") {
            whichItem.stability = whichItem.maxStability;
        }
        if (typeof whichItem.quantity === "undefined") {
            whichItem.quantity = whichItem.maxQuantity;
        }

    }
    if (currentActiveInventoryItems[whichItem.type].action == "nest") {
        whichItem.timeLastSpawned = hero.totalGameTimePlayed;
        whichItem.spawnsRemaining = whichItem.additional;
    }
}


function prepareGame() {




    // get map image references:

    for (var i = 0; i < tileGraphicsToLoad.length; i++) {
        tileImages[tileGraphicsToLoad[i]] = Loader.getImage(tileGraphicsToLoad[i]);
    }


    for (var i = 0; i < npcGraphicsToLoad.length; i++) {
        npcImages[npcGraphicsToLoad[i]] = Loader.getImage(npcGraphicsToLoad[i]);

    }

    for (var i = 0; i < itemGraphicsToLoad.length; i++) {

        itemImages[itemGraphicsToLoad[i]] = Loader.getImage(itemGraphicsToLoad[i]);
        // ####
        //  itemImages[itemGraphicsToLoad[i]].spriteWidth = Loader.getImage(itemGraphicsToLoad[i]).width;
        //  itemImages[itemGraphicsToLoad[i]].spriteHeight = Loader.getImage(itemGraphicsToLoad[i]).length;
    }
    //backgroundImg = Loader.getImage("backgroundImg");

    backgroundImgs[currentMap] = Loader.getImage("backgroundImg" + currentMap);
    for (var i = 0; i < visibleMaps.length; i++) {
        backgroundImgs[(visibleMaps[i])] = Loader.getImage("backgroundImg" + visibleMaps[i]);
    }
    // initialise and position NPCs:
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
            initialiseNPC(thisMapData[(visibleMaps[m])].npcs[i]);
        }
    }
    // initialise pet:
    var defaultElevation = hero.z;
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {

            hero.allPets[hero.activePets[i]].x = getTileCentreCoordX(hero.allPets[hero.activePets[i]].tileX);
            hero.allPets[hero.activePets[i]].y = getTileCentreCoordY(hero.allPets[hero.activePets[i]].tileY);

            if (!isOverWorldMap) {
                // check if it's not actual on the map:
                if ((hero.allPets[hero.activePets[i]].tileX < 0) || (hero.allPets[hero.activePets[i]].tileY < 0) || (hero.allPets[hero.activePets[i]].tileX >= mapTilesX) || (hero.allPets[hero.activePets[i]].tileY >= mapTilesY)) {
                    hero.allPets[hero.activePets[i]].z = defaultElevation;
                } else {
                    hero.allPets[hero.activePets[i]].z = getElevation(hero.allPets[hero.activePets[i]].tileX, hero.allPets[hero.activePets[i]].tileY);
                }
            } else {
                hero.allPets[hero.activePets[i]].z = getElevation(hero.allPets[hero.activePets[i]].tileX, hero.allPets[hero.activePets[i]].tileY);
            }

            hero.allPets[hero.activePets[i]].dx = 0;
            hero.allPets[hero.activePets[i]].dy = 0;
            hero.allPets[hero.activePets[i]].foundPath = '';
            if (hero.allPets[hero.activePets[i]].state != "queuing") {
                hero.allPets[hero.activePets[i]].state = "wait";
            }
            if (i == 0) {
                // first pet follows the hero:
                hero.allPets[hero.activePets[i]].following = hero;
            } else {
                // subsequent pets follow the one in front:
                hero.allPets[hero.activePets[i]].following = hero.allPets[hero.activePets[i - 1]];
            }
            // if (i != (hero.activePets.length - 1)) {
            // even the last one should drop a breadcrumb in case an escort quest NPC needs it
            hero.allPets[hero.activePets[i]].breadcrumb = [];
            for (var j = 0; j < breadCrumbLength; j++) {
                hero.allPets[hero.activePets[i]].breadcrumb[j] = [hero.allPets[hero.activePets[i]].tileX, hero.allPets[hero.activePets[i]].tileY];
            }
            //  }
        }
    }

    if (thisMapData[currentMap].movingPlatforms) {
        // initialise moving platforms:
        var thisPlatform, thisPlatformMovements;
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisPlatform = thisMapData[currentMap].movingPlatforms[i];
            thisPlatform.x = getTileCentreCoordX(thisPlatform.startTileX);
            thisPlatform.y = getTileCentreCoordY(thisPlatform.startTileY);
            thisPlatform.z = thisPlatform.startZ;
            thisPlatform.movementIndex = 0;
            thisPlatform.waitingTimer = 0;
            // this will be set to false if any character is moving over an edge, so the platform will stop until they're clear:
            thisPlatform.canMove = true;
            /*
            // determine offsets from platform's x and y coords (as these won't change):
            thisPlatform.xMinEdge = -tileW / 2;
            thisPlatform.xMaxEdge = tileW / 2 + ((thisPlatform.width - 1) * tileW);
            thisPlatform.yMinEdge = -tileW / 2;
            thisPlatform.yMaxEdge = tileW / 2 + ((thisPlatform.length - 1) * tileW);
            */



            // temp:


            thisPlatformMovements = determinePlatformIncrements(thisPlatform);

            thisPlatform.dx = thisPlatformMovements[0];
            thisPlatform.dy = thisPlatformMovements[1];
            thisPlatform.dz = thisPlatformMovements[2];


        }
    }




    // fill hero breadcrumb array with herox and heroy:
    for (var i = 0; i < breadCrumbLength; i++) {
        hero.breadcrumb[i] = [hero.tileX, hero.tileY];
    }

    for (var m = 0; m < visibleMaps.length; m++) {
        // initialise items:
        for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
            initialiseItem(thisMapData[(visibleMaps[m])].items[i]);
        }
    }
    activeObjectForDialogue = '';




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
    setupWeather();

    timeSinceLastFrameSwap = 0;
    currentAnimationFrame = 0;
    mapTransition = "in";
    mapTransitionCurrentFrames = 1;
    gameMode = "play";


    if (thisMapData[currentMap].musicOnEnter != '') {
        audio.playMusic(thisMapData[currentMap].musicOnEnter);
    } else {
        //  if music playing - fade out
        if (typeof audio.activeTrack !== "undefined") {
            audio.fadeOutMusic(audio.activeTrack, 6);
        }
    }

    checkForHotspots();
    //  UI.showNotification("<p>I'm just thinking about what a notification looks like&hellip;</p>");

}


function removeMapAssets() {


    for (var i in tileGraphicsToLoad) {
        // remove the on error handler so it doesn't fire when the image is removed:
        tileImages[tileGraphicsToLoad[i]].onerror = '';
        tileImages[tileGraphicsToLoad[i]].src = '';
        delete tileImages[tileGraphicsToLoad[i]];
    }

    for (var i in npcGraphicsToLoad) {
        npcImages[npcGraphicsToLoad[i]].onerror = '';
        npcImages[npcGraphicsToLoad[i]].src = '';
        delete npcImages[npcGraphicsToLoad[i]];
    }
    for (var i in itemGraphicsToLoad) {
        itemImages[itemGraphicsToLoad[i]].onerror = '';
        itemImages[itemGraphicsToLoad[i]].src = '';
        delete itemImages[itemGraphicsToLoad[i]];
    }

    for (var i in backgroundImgs) {
        backgroundImgs[i].onerror = '';
        backgroundImgs[i].src = '';
        // backgroundImgs[i] = null;
        delete backgroundImgs[i];
    }



}


function loadingProgress() {
    // make this graphical where appropriate ####
    //  console.log("loading - " + Loader.getProgress());
}


function changeMaps(doorX, doorY) {
    previousZoneName = thisMapData[currentMap].zoneName;
    gameMode = "mapLoading";
    removeMapAssets();
    if (jumpMapId == null) {
        var doorData = thisMapData[currentMap].doors;
        var whichDoor = doorX + "," + doorY;
        hero.tileX = doorData[whichDoor].startX;
        hero.tileY = doorData[whichDoor].startY;

        newMap = doorData[whichDoor].map;
    } else {
        newMap = jumpMapId;
        jumpMapId = null;
        hero.tileX = doorX;
        hero.tileY = doorY;
    }
    if (hero.tileX != "?") {
        hero.tileX = parseInt(hero.tileX);
    }
    if (hero.tileY != "?") {
        hero.tileY = parseInt(hero.tileY);
    }
    visibleMaps = [];
    loadMap();
}



function tileIsClear(globalTileX, globalTileY) {
    //    var globalTileX = getTileX(x);
    //    var globalTileY = getTileY(y);
    var tileX = getLocalCoordinatesX(globalTileX);
    var tileY = getLocalCoordinatesY(globalTileY);
    if (isOverWorldMap) {
        if ((globalTileX < 0) || (globalTileY < 0) || (globalTileX >= (worldMapTileLength * worldMap[0].length)) || (globalTileY >= (worldMapTileLength * worldMap.length))) {
            return false;
        }
    } else {
        if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
            return false;
        }
    }
    var thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);


    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
        case 1:
            // is a collision:
            return false;
            break;
        case "<":
        case ">":
        case "^":
        case "v":
            // stairs
            return false;
            break;
        case "d":
            // is a door:
            return false;
            break;
        default:
            //
    }

    // check against hero:
    if (globalTileX == hero.tileX) {
        if (globalTileY == hero.tileY) {
            return false;
        }
    }

    // against items:
    for (var i = 0; i < thisMapData[thisMap].items.length; i++) {
        if (globalTileX == thisMapData[thisMap].items[i].tileX) {
            if (globalTileY == thisMapData[thisMap].items[i].tileY) {
                if (thisMapData[thisMap].items[i].isCollidable) {
                    return false;
                }
            }
        }
    }
    // against NPCs:
    for (var i = 0; i < thisMapData[thisMap].npcs.length; i++) {
        if (thisMapData[thisMap].npcs[i].isCollidable) {
            if (globalTileX == thisMapData[thisMap].npcs[i].tileX) {
                if (globalTileY == thisMapData[thisMap].npcs[i].tileY) {
                    return false;
                }
            }
        }
    }

    // against pets:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            if (globalTileX == hero.allPets[hero.activePets[i]].tileX) {
                if (globalTileY == hero.allPets[hero.activePets[i]].tileY) {
                    return false;
                }
            }
        }
    }

    return true;
}



function startDoorTransition() {
    if (mapTransition == "") {
        mapTransitionCurrentFrames = 1;
        mapTransition = "out";
        if (activeObjectForDialogue != '') {
            //  dialogue.classList.add("slowerFade");
            dialogue.classList.remove("active");
            UI.removeActiveDialogue();
        }
        if (chestIdOpen != -1) {
            UI.closeChest();
        }
    }
    // if (currentMap < 0) {
    saveCartographyMask();
    // }
    // delete shops so just the new ones can load in
    shopPanel.innerHTML = '';
}



function getHeroAsCloseAsPossibleToObject(objx, objy, objw, objh) {
    switch (hero.facing) {
        case "n":
            hero.y = objy + objh / 2 + hero.length / 2 + 1;
            break;
        case "s":
            hero.y = objy - objh / 2 - hero.length / 2 - 1;
            break;
        case "w":
            hero.x = objx + objw / 2 + hero.width / 2 + 1;
            break;
        case "e":
            hero.x = objx - objw / 2 - hero.width / 2 - 1;
            break;
    }
}

function isOnAPlatform(x, y) {
    var thisPlatform;
    var whichPlatform = -1;
    if (thisMapData[currentMap].movingPlatforms) {
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisPlatform = thisMapData[currentMap].movingPlatforms[i];
            if (y >= (thisPlatform.y - tileW / 2)) {
                if (y <= (thisPlatform.y + tileW / 2 + (thisPlatform.length - 1) * tileW)) {
                    if (x >= (thisPlatform.x - tileW / 2)) {
                        if (x <= (thisPlatform.x + tileW / 2 + (thisPlatform.width - 1) * tileW)) {
                            whichPlatform = i;
                            break;
                        }
                    }
                }
            }
        }
    }
    return whichPlatform;
}



function checkHeroCollisions() {
    var topLeftIsOnAPlatform, topRightIsOnAPlatform, bottomLeftIsOnAPlatform, bottomRightIsOnAPlatform, platformIsClear, leadingEdge1OnAPlatform, leadingEdge2OnAPlatform;

    if (key[2]) {
        // up
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2)
        // make sure both leading edge corners are EITHER on a platform or not colliding with terrain:
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform (and leading isn't), and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2) > -1) && (isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.y = thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2)].y - (tileW / 2) + (hero.length / 2) + 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileY(hero.y - hero.length / 2);

                var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                // use the +1 to make sure it's just clear of the collision tile
                hero.y = tileBottomEdge + hero.length / 2 + 1;
            }
        }
    }

    if (key[3]) {
        // down
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2);
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform, and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2) > -1) && (isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.y = (thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].y + tileW / 2 + (thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].length - 1) * tileW) - (hero.length / 2) - 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileY(hero.y + hero.length / 2);
                var tileTopEdge = (tileCollidedWith) * tileW;
                hero.y = tileTopEdge - hero.length / 2 - 1;
            }
        }
    }

    if (key[0]) {
        // left/west
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2);
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y + hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x - hero.width / 2, hero.y - hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform, and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2) > -1) && (isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.x = thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2)].x - tileW / 2 + (hero.length / 2) + 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileX(hero.x - hero.width / 2);
                var tileRightEdge = (tileCollidedWith + 1) * tileW;
                hero.x = tileRightEdge + hero.width / 2 + 1;
            }
        }
    }

    if (key[1]) {
        //right/east
        leadingEdge1OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2);
        leadingEdge2OnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2);
        if (((leadingEdge1OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y + hero.length / 2))) && ((leadingEdge2OnAPlatform > -1) || (!isATerrainCollision(hero.x + hero.width / 2, hero.y - hero.length / 2)))) {} else {
            // leading edge is a collision - check if trailing edge is on a platform, and nudge hero back onto the platform if so:
            if ((isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2) > -1) && (isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2) > -1)) {
                if ((leadingEdge1OnAPlatform == -1) && (leadingEdge2OnAPlatform == -1)) {
                    hero.x = thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].x + tileW / 2 + ((thisMapData[currentMap].movingPlatforms[isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2)].width - 1) * tileW) - (hero.length / 2) - 1;
                }
            } else {
                // platform not involved - find the tile's bottom edge
                var tileCollidedWith = getTileX(hero.x + hero.width / 2);
                var tileLeftEdge = (tileCollidedWith) * tileW;
                hero.x = tileLeftEdge - hero.width / 2 - 1;
            }
        }
    }

    // determine if platforms are free to move:
    if (thisMapData[currentMap].movingPlatforms) {
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisMapData[currentMap].movingPlatforms[i].canMove = true;
        }
    }
    topLeftIsOnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y - hero.length / 2);
    topRightIsOnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y - hero.length / 2);
    bottomLeftIsOnAPlatform = isOnAPlatform(hero.x - hero.width / 2, hero.y + hero.length / 2);
    bottomRightIsOnAPlatform = isOnAPlatform(hero.x + hero.width / 2, hero.y + hero.length / 2);

    if (topLeftIsOnAPlatform >= 0) {
        platformIsClear = (topLeftIsOnAPlatform == bottomLeftIsOnAPlatform && bottomLeftIsOnAPlatform == topRightIsOnAPlatform && topRightIsOnAPlatform == bottomRightIsOnAPlatform);
    }

    if (platformIsClear) {
        if (topLeftIsOnAPlatform >= 0) {
            hero.x += thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].dx;
            hero.y += thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].dy;
            hero.z += thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].dz;
        }
    } else {
        if (topLeftIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[topLeftIsOnAPlatform].canMove = false;
        }
        if (topRightIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[topRightIsOnAPlatform].canMove = false;
        }
        if (bottomLeftIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[bottomLeftIsOnAPlatform].canMove = false;
        }
        if (bottomRightIsOnAPlatform >= 0) {
            thisMapData[currentMap].movingPlatforms[bottomRightIsOnAPlatform].canMove = false;
        }
    }


    var thisNPC, thisItem;

    for (var m = 0; m < visibleMaps.length; m++) {
        whichVisibleMap = visibleMaps[m];


        // check for collisions against NPCs:
        for (var i = 0; i < thisMapData[whichVisibleMap].npcs.length; i++) {
            thisNPC = thisMapData[whichVisibleMap].npcs[i];
            if (thisNPC.isCollidable) {
                if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, hero.x, hero.y, hero.width, hero.length)) {
                    getHeroAsCloseAsPossibleToObject(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length);
                }
            }
        }

        // check for collisions against items:
        for (var i = 0; i < thisMapData[whichVisibleMap].items.length; i++) {
            thisItem = thisMapData[whichVisibleMap].items[i];
            if (thisItem.isCollidable) {
                if (isAnObjectCollision(thisItem.x, thisItem.y, thisItem.width, thisItem.length, hero.x, hero.y, hero.width, hero.length)) {
                    getHeroAsCloseAsPossibleToObject(thisItem.x, thisItem.y, thisItem.width, thisItem.length);
                }
            }
        }


    }

    // check against pets:
    if (hasActivePet) {
        for (var i = 0; i < hero.activePets.length; i++) {
            if (isAnObjectCollision(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].width, hero.allPets[hero.activePets[i]].length, hero.x, hero.y, hero.width, hero.length)) {
                getHeroAsCloseAsPossibleToObject(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].width, hero.allPets[hero.activePets[i]].length);
                pushPetAway(i);

            }
        }
    }

    // check for inner doors:
    if (typeof thisMapData[currentMap].innerDoors !== "undefined") {
        var thisInnerDoor;
        for (var i in thisMapData[currentMap].innerDoors) {
            thisInnerDoor = thisMapData[currentMap].innerDoors[i];
            if (!thisInnerDoor.isOpen) {
                if (isAnObjectCollision(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW, hero.x, hero.y, hero.width, hero.length)) {
                    if (thisInnerDoor.isLocked) {
                        // check for key
                        var hasInnerDoorKey = hero.currency.keys.indexOf(i);
                        if (hasInnerDoorKey != -1) {
                            unlockInnerDoor(i);
                            openInnerDoor(i);
                            hero.currency.keys.splice(hasInnerDoorKey, 1);
                            UI.updateCurrencies();
                        }
                    } else {
                        openInnerDoor(i);
                    }
                    getHeroAsCloseAsPossibleToObject(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW);
                }
            }
        }
    }
}

function updateSurroundingGameWorld() {
    // keep the surrounding game world running:
    var now = window.performance.now();
    hero.totalGameTimePlayed++;
    var elapsed = (now - lastTime);
    lastTime = now;
    timeSinceLastFrameSwap += elapsed;
    if (timeSinceLastFrameSwap > animationUpdateTime) {
        currentAnimationFrame++;
        timeSinceLastFrameSwap = 0;
        animateFae();
    }
    moveFae();
    moveNPCs();
    movePet();
    movePlatforms();
    updateItems();
    audio.checkForAmbientSounds();
    checkForRespawns();
    UI.updateCooldowns();
    // only need to draw if the game board doesn't cover the screen: ####
    draw();
}

function gameLoop() {
    switch (gameMode) {
        case "mapLoading":
            // console.log("loading map assets...");
            break;
        case "cardGame":
            cardGameNameSpace.update();
            cardGameNameSpace.draw();
            updateSurroundingGameWorld();
            break;
        case "hnefataflGame":
            hnefataflNameSpace.update();
            hnefataflNameSpace.draw();
            updateSurroundingGameWorld();
            break;
        case "housing":
            housingNameSpace.update();
            updateSurroundingGameWorld();
            break;
        case "play":
            update();
            draw();
            break;
    }
    window.requestAnimationFrame(gameLoop);
}

function moveHeroTowards(xCoord, yCoord) {
    // eg. from drag on mobile 
    var xDiff = xCoord - (availableScreenWidth / 2);
    var yDiff = yCoord - (availableScreenHeight / 2);
    // run if the dragged distance is further from the hero:
    key[5] = false;
    if ((Math.abs(xDiff) > (availableScreenWidth / 4)) || (Math.abs(yDiff) > (availableScreenHeight / 4))) {
        key[5] = true;
    }
    key[0] = false;
    key[1] = false;
    key[2] = false;
    key[3] = false;
    if (xDiff < 0) {
        if (yDiff < 0) {

            key[0] = 1;
        } else {

            key[3] = 1;
        }
    } else {
        if (yDiff < 0) {

            key[2] = 1;
        } else {

            key[1] = 1;
        }
    }
}

function update() {
    checkForGamePadInput();
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
        if (key[7]) {
            UI.toggleUI();
            key[7] = false;
        }
        if (key[8]) {
            UI.toggleJournal();
            key[8] = false;
        }
        if (key[9]) {
            UI.moveQuickHold(-1);
            key[9] = false;
        }
        if (key[10]) {
            UI.moveQuickHold(1);
            key[10] = false;
        }

        if (key[11]) {
            printScreen();
            key[11] = false;
        }
        if (key[12]) {
            // escape - cancel any active actions:
            switch (activeAction) {
                case "plotPlacement":
                    document.removeEventListener("mousemove", UI.movePlotPlacementOverlay, false);
                    document.removeEventListener("click", placePlotPlacement, false);
                    break;
                case "survey":
                    surveyingStopped();
                    break;
                case "gather":
                    gatheringPanel.classList.remove("active");
                    gatheringStopped();
                    break;
            }
            activeAction = "";

            key[12] = false;
        }

        //  checkForWorldWrap(hero);
        checkHeroCollisions();

        var heroOldX = hero.tileX;
        var heroOldY = hero.tileY;
        var chestIdSplit;
        hero.tileX = getTileX(hero.x);
        hero.tileY = getTileY(hero.y);
        checkForSlopes(hero);
        if ((hero.tileX != heroOldX) || (hero.tileY != heroOldY)) {
            heroIsInNewTile();
        }
        // check to see if a dialogue balloon is open, and if the hero has moved far from the NPC:
        if (activeObjectForDialogue != '') {
            if (activeObjectForDialogue != null) {
                if (!(isInRange(hero.x, hero.y, activeObjectForDialogue.x, activeObjectForDialogue.y, closeDialogueDistance))) {
                    dialogue.classList.add("slowerFade");
                    dialogue.classList.remove("active");
                    // close the shop
                    if (shopCurrentlyOpen != -1) {
                        activeObjectForDialogue.speechIndex = 0;
                        UI.closeShop();
                    }
                    // close the accept/decline buttons as well in case they're open:
                    acceptQuestChoice.classList.remove('active');
                    // only remove this after dialogue has faded out completely:
                    dialogue.addEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
                }
            }
        }
        // check if a chest is open and close it if so:
        if (chestIdOpen != -1) {
            chestIdSplit = chestIdOpen.split("-");
            if (!(isInRange(hero.x, hero.y, thisMapData[chestIdSplit[1]].items[chestIdSplit[0]].x, thisMapData[chestIdSplit[1]].items[chestIdSplit[0]].y, closeDialogueDistance / 2))) {
                UI.closeChest();
            }
        }
        if (activeAction == "gather") {

            if (!(isInRange(hero.x, hero.y, gathering.itemObject.x, gathering.itemObject.y, closeDialogueDistance / 2))) {
                gatheringPanel.classList.remove("active");
                gatheringStopped();
            }
        }
        if (postObject.active) {
            if (!(isInRange(hero.x, hero.y, postObject.x, postObject.y, closeDialogueDistance / 2))) {

                UI.closePost();
            }
        }
        if (retinueObject.active) {
            if (!(isInRange(hero.x, hero.y, retinueObject.x, retinueObject.y, closeDialogueDistance / 2))) {

                UI.closeRetinuePanel();

            }
        }





    } else {
        if (jumpMapId == null) {
            // if jumping maps (eg with a home stone, then don't walk forwards)
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
        }
        mapTransitionCurrentFrames += 2;
        if (mapTransitionCurrentFrames >= mapTransitionMaxFrames) {
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
    if (hero.isMoving) {
        if (key[5]) {
            hero.currentAnimation = 'run';
        } else {
            hero.currentAnimation = 'walk';
        }
    } else {
        hero.currentAnimation = 'idle';
    }
    moveFae();
    moveNPCs();
    movePet();
    movePlatforms();
    updateItems();
    checkForWeatherChange();
    audio.checkForAmbientSounds();
    checkForRespawns();
    UI.updateCooldowns();
    if (activeAction == "gather") {
        processGathering();
    }
    if (activeAction == "dowse") {
        processDowsing();
    }
    if (activeAction == "survey") {
        processSurveying();
    }
    if (retinueObject.active) {
        UI.updateRetinueTimers();
    }
    if (craftingObject.isCreating) {
        processCrafting();
    }
}





function updateVisibleMaps() {

    // left screen edge would be hero.isox - (canvasWidth/2) but use full screen width to allow for padding and loading in before visible
    var leftEdgeIso = hero.isox - canvasWidth;
    var topEdgeIso = hero.isoy - canvasHeight;
    var rightEdgeIso = hero.isox + canvasWidth;
    var bottomEdgeIso = hero.isoy + canvasHeight;

    var leftEdge2D = find2DCoordsX(leftEdgeIso, hero.isoy);
    var topEdge2D = find2DCoordsY(hero.isox, topEdgeIso);
    var rightEdge2D = find2DCoordsX(rightEdgeIso, hero.isoy);
    var bottomEdge2D = find2DCoordsY(hero.isox, bottomEdgeIso);

    var mapDimension2D = worldMapTileLength * tileW;

    var leftEdgeMapPos = Math.floor(leftEdge2D / mapDimension2D);
    var topEdgeMapPos = Math.floor(topEdge2D / mapDimension2D);
    var rightEdgeMapPos = Math.floor(rightEdge2D / mapDimension2D);
    var bottomEdgeMapPos = Math.floor(bottomEdge2D / mapDimension2D);

    var newVisibleMaps = [];

    var isValid;
    for (var i = leftEdgeMapPos; i <= rightEdgeMapPos; i++) {
        for (var j = topEdgeMapPos; j <= bottomEdgeMapPos; j++) {
            isValid = false;
            if (typeof worldMap[j] !== "undefined") {
                if (typeof worldMap[j][i] !== "undefined") {
                    isValid = true;
                }
            }

            if (isValid) {
                newVisibleMaps.push(worldMap[j][i]);
            }

        }
    }

    // check for differences in visibleMaps array and load any new




    // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
    var newMapsToLoad = newVisibleMaps.filter(function(i) { return visibleMaps.indexOf(i) < 0; });



    //console.log("new maps:",newMapsToLoad);
    for (var i = 0; i < newMapsToLoad.length; i++) {
        // console.log("loading in new map #"+newMapsToLoad[i]);
        loadNewVisibleMap(newMapsToLoad[i]);

    }

    // and unload any not required now
    // ####

}

function checkForHotspots() {
    var thisHotspot, thisTileCentreX, thisTileCentreY;
    // check for hotspots:
    for (var i = 0; i < thisMapData[currentMap].hotspots.length; i++) {
        thisHotspot = thisMapData[currentMap].hotspots[i];
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
            if (typeof thisHotspot.weather !== "undefined") {
                changeWeather(thisHotspot.weather);
            }
            if (typeof thisHotspot.openInnerDoor !== "undefined") {
                unlockInnerDoor(thisHotspot.openInnerDoor);
                openInnerDoor(thisHotspot.openInnerDoor);
            }
            if (typeof thisHotspot.closeInnerDoor !== "undefined") {
                closeInnerDoor(thisHotspot.closeInnerDoor);
            }
            if (typeof thisHotspot.toggleInnerDoor !== "undefined") {
                toggleInnerDoor(thisHotspot.toggleInnerDoor);
            }
            if (typeof thisHotspot.remove !== "undefined") {
                // remove this hotspot now it's been triggered:
                thisMapData[currentMap].hotspots.splice(i, 1);
                i--;
            }
        }

        if (fae.currentState == "hero") {
            // check if the fae should react to this one:
            if (typeof thisHotspot.faeIgnore === "undefined") {
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
    }
}




function heroIsInNewTile() {
    //  hero.z = getElevation(hero.tileX, hero.tileY);

    //  updateCartographicMiniMap();
    if (isOverWorldMap) {
        currentMap = findMapNumberFromGlobalCoordinates(hero.tileX, hero.tileY);

        updateVisibleMaps();
    }


    checkForHotspots();

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
    if (thisMapData[currentMap].showOnlyLineOfSight) {
        updateLightMap();
    }

    if (thisMapData[currentMap].collisions[getLocalCoordinatesY(hero.tileY)][getLocalCoordinatesX(hero.tileX)] == "d") {
        activeDoorX = hero.tileX;
        activeDoorY = hero.tileY;
        startDoorTransition();
    }
    if (activeAction == "survey") {
        surveyingStopped();
    }
}


function openInnerDoor(whichInnerDoor) {
    // animation ######
    thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen'] = true;
    if (thisMapData[currentMap].showOnlyLineOfSight) {
        updateLightMap();
    }
}

function closeInnerDoor(whichInnerDoor) {
    // make sure nothing's blocking the door (as it would become stuck):
    if (tileIsClear(thisMapData[currentMap].innerDoors[whichInnerDoor]['tileX'], thisMapData[currentMap].innerDoors[whichInnerDoor]['tileY'])) {
        thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen'] = false;
        if (thisMapData[currentMap].showOnlyLineOfSight) {
            updateLightMap();
        }
    }
}

function toggleInnerDoor(whichInnerDoor) {
    // make sure nothing's blocking the door (as it would become stuck):
    if (tileIsClear(thisMapData[currentMap].innerDoors[whichInnerDoor]['tileX'], thisMapData[currentMap].innerDoors[whichInnerDoor]['tileY'])) {
        thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen'] = !(thisMapData[currentMap].innerDoors[whichInnerDoor]['isOpen']);
        if (thisMapData[currentMap].showOnlyLineOfSight) {
            updateLightMap();
        }
    }
}

function unlockInnerDoor(whichInnerDoor) {
    audio.playSound(soundEffects['unlock'], 0);
    thisMapData[currentMap].innerDoors[whichInnerDoor]['isLocked'] = false;
    if (thisMapData[currentMap].showOnlyLineOfSight) {
        updateLightMap();
    }
    // play sound ####
}


function getCatalogueMarkup(itemIds, catalogueName) {
    getJSON('http://develop.ae/game-world/getCatalogueContents.php?itemIds=' + itemIds + '&name=' + catalogueName, function(data) {
        catalogueQuestPanels.insertAdjacentHTML('beforeend', data.markup);
        audio.playSound(soundEffects['bookOpen'], 0);
    }, function(status) {
        // try again:
        getCatalogueMarkup(itemIds, catalogueName);
    });
}

function usedActiveTool() {
    var usedToolSuccessfully = false;
    if (hero.holding.type != "") {
        var armsReachTileX = hero.tileX + relativeFacing[hero.facing]["x"]
        var armsReachTileY = hero.tileY + relativeFacing[hero.facing]["y"]
        switch (currentActiveInventoryItems[hero.holding.type].action) {
            case "till":
                // check for any treasure:
                var treasureCoordinates, treasureCentreX, treasureCentreY, tryFacing, facingsRemaining, sourceTileX, sourceTileY, thisChest, thisChestsMap;
                var foundTreasure = false;
                for (var i = 0; i < hero.activeTreasureMaps.length; i++) {
                    treasureCoordinates = hero.activeTreasureMaps[i].split("_");
                    if (getPythagorasDistance(hero.tileX, hero.tileY, treasureCoordinates[0], treasureCoordinates[1]) < 2) {
                        // add chest:
                        thisChest = {
                            "type": 48,
                            "contains": [{
                                    "type": 6
                                },
                                {
                                    "type": 2
                                },
                                {
                                    "type": "$",
                                    "quantity": 5000
                                }
                            ]
                        };

                        tryFacing = hero.facing;
                        switch (tryFacing) {
                            case 'n':
                                facingsRemaining = ['e', 'w', 's'];
                                break;
                            case 'e':
                                facingsRemaining = ['n', 's', 'w'];
                                break;
                            case 's':
                                facingsRemaining = ['n', 's', 'e'];
                                break;
                            case 'w':
                                facingsRemaining = ['e', 'w', 'n'];
                                break;
                        }
                        do {
                            sourceTileX = hero.tileX + relativeFacing[tryFacing]["x"];
                            sourceTileY = hero.tileY + relativeFacing[tryFacing]["y"];
                            tryFacing = facingsRemaining.shift();
                        } while (!tileIsClear(sourceTileX, sourceTileY) && (facingsRemaining.length > 0));
                        if (facingsRemaining.length > 0) {
                            // build chest:
                            thisChest.tileX = sourceTileX;
                            thisChest.tileY = sourceTileY;
                            thisChestsMap = findMapNumberFromGlobalCoordinates(sourceTileX, sourceTileY);
                            thisMapData[thisChestsMap].items.push(thisChest);
                            initialiseItem(thisMapData[thisChestsMap].items[thisMapData[thisChestsMap].items.length - 1]);
                            // find the map item in the inventory and remove that as well:
                            for (var key in hero.inventory) {
                                console.log(hero.inventory[key].contains + " == " + hero.activeTreasureMaps[i]);
                                if (hero.inventory[key].contains == hero.activeTreasureMaps[i]) {
                                    delete hero.inventory[key];
                                    document.getElementById("slot" + key).innerHTML = '';
                                }
                            }
                            // hide the treasure map panel:
                            document.getElementById('treasureMap' + hero.activeTreasureMaps[i]).classList.remove("active");
                            hero.activeTreasureMaps.splice(i, 1);
                            audio.playSound(soundEffects['foundChest'], 0);
                            foundTreasure = true;
                            usedToolSuccessfully = true;
                        } else {
                            console.log("couldn't place chest");
                        }
                    }

                }
                if (!foundTreasure) {
                    if (successfullyTilledEarth(armsReachTileX, armsReachTileY)) {
                        usedToolSuccessfully = true;
                    }
                }
                break;
            case "seed":
                if (successfullyPlantSeed(armsReachTileX, armsReachTileY)) {
                    usedToolSuccessfully = true;
                }
                break;
            case "holds-liquid":
                // check if next to a water source first: 
                var foundSource = false;
                var holdingItemsSlot = findSlotByHash(hero.holding.hash);
                var itemInFront = findItemWithinArmsLength();
                if (itemInFront != null) {

                    if (currentActiveInventoryItems[itemInFront.type].action == "source") {
                        foundSource = true;
                        // fill it (make the actionValue maximum value) with the thing that this contains (defined by actionValue):
                        hero.inventory[holdingItemsSlot].contains[0].type = currentActiveInventoryItems[itemInFront.type].actionValue;
                        hero.inventory[holdingItemsSlot].contains[0].quantity = currentActiveInventoryItems[(hero.inventory[holdingItemsSlot].type)].actionValue;
                        audio.playSound(soundEffects['pouring'], 0);
                        updateGauge(holdingItemsSlot);
                        UI.updateHeldItemGauge();
                    }
                }
                if (!foundSource) {
                    pourLiquid(armsReachTileX, armsReachTileY);
                }
                usedToolSuccessfully = true;
                break;
        }
    }
    return usedToolSuccessfully;
}


function checkForActions() {
    // check to see if a tool is equipped, and can be used:
    if (!usedActiveTool()) {
        var inventoryCheck = [];
        var slotMarkup, thisSlotsId, thisSlotElem, thisNPC;
        for (var m = 0; m < visibleMaps.length; m++) {
            for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
                if (isInRange(hero.x, hero.y, thisMapData[(visibleMaps[m])].items[i].x, thisMapData[(visibleMaps[m])].items[i].y, (thisMapData[(visibleMaps[m])].items[i].width / 2 + hero.width / 2 + 6))) {
                    if (isFacing(hero, thisMapData[(visibleMaps[m])].items[i])) {
                        var actionValue = currentActiveInventoryItems[thisMapData[(visibleMaps[m])].items[i].type].actionValue;

                        switch (currentActiveInventoryItems[thisMapData[(visibleMaps[m])].items[i].type].action) {
                            case "static":
                                // can't interact with it - do nothing
                                break;
                            case "nest":
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
                                // handled by Action Bar - no effect here
                                break;
                            case "toggleInnerDoor":
                                toggleInnerDoor(thisMapData[(visibleMaps[m])].items[i].additional);
                                audio.playSound(soundEffects['lever'], 0);
                                // toggle the visual state:
                                thisMapData[(visibleMaps[m])].items[i].state = thisMapData[(visibleMaps[m])].items[i].state == "on" ? 'off' : 'on';
                                break;
                            case "openInnerDoor":
                                openInnerDoor(thisMapData[(visibleMaps[m])].items[i].additional);
                                break;
                            case "closeInnerDoor":
                                closeInnerDoor(thisMapData[(visibleMaps[m])].items[i].additional);
                                break;
                            case "key":
                                hero.currency.keys.push(thisMapData[(visibleMaps[m])].items[i].additional);
                                UI.updateCurrencies();
                                audio.playSound(soundEffects['keys'], 0);
                                // remove from map:
                                thisMapData[(visibleMaps[m])].items.splice(i, 1);
                                break;
                            case "gate":
                                // toggle the visual state:
                                thisMapData[(visibleMaps[m])].items[i].state = thisMapData[(visibleMaps[m])].items[i].state == "open" ? 'closed' : 'open';
                                // toggle whether it will have collision done against it:
                                thisMapData[(visibleMaps[m])].items[i].isCollidable = thisMapData[(visibleMaps[m])].items[i].isCollidable == true ? false : true;
                                break;
                            case "notice":
                                processSpeech(thisMapData[(visibleMaps[m])].items[i], thisMapData[(visibleMaps[m])].items[i].contains[0][0], thisMapData[(visibleMaps[m])].items[i].contains[0][1], false, thisMapData[(visibleMaps[m])].items[i].contains[0][2]);
                                break;
                            case "sit":
                                hero.facing = thisMapData[(visibleMaps[m])].items[i].facing;
                                console.log("switch to sit animation");
                                break;
                            case "chest":
                                // open chest and show contents:
                                UI.openChest(visibleMaps[m], i);
                                break;
                            case "post":
                                // open the Post panel:
                                UI.openPost(thisMapData[(visibleMaps[m])].items[i].x, thisMapData[(visibleMaps[m])].items[i].y);
                                break;
                            case "retinue":
                                // open the Retinue panel:
                                UI.openRetinuePanel(thisMapData[(visibleMaps[m])].items[i]);
                                break;
                            case "source":
                                // don't do anything - the equipped item will check for this item
                                break;
                            case "crop":
                                checkCrop(thisMapData[(visibleMaps[m])].items[i]);
                                break;
                            default:
                                // try and pick it up:
                                var canBePickedUp = true;
                                if (thisMapData[(visibleMaps[m])].items[i].lockedToPlayerId) {
                                    if (thisMapData[(visibleMaps[m])].items[i].lockedToPlayerId != characterId) {
                                        canBePickedUp = false;
                                    }
                                }
                                if (canBePickedUp) {
                                    inventoryCheck = canAddItemToInventory([prepareInventoryObject(thisMapData[(visibleMaps[m])].items[i])]);
                                    if (inventoryCheck[0]) {
                                        // remove from map:
                                        thisMapData[(visibleMaps[m])].items.splice(i, 1);
                                        UI.showChangeInInventory(inventoryCheck[1]);
                                    } else {
                                        UI.showNotification("<p>I don't have room in my bags for that</p>");
                                    }
                                } else {
                                    UI.showNotification("<p>I can't pick that up</p>");
                                }
                        }
                    }
                }
            }

            // loop through NPCs:
            for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
                thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
                if (thisNPC.speech) {
                    //     if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
                    if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.reactionRange * tileW))) {
                        if (isFacing(hero, thisNPC)) {
                            // if at the end of the NPC's speech list, or the dialogue isn't part of the NPC's normal speech list, then close the balloon with an action click:
                            if ((thisNPC.speechIndex >= thisNPC.speech.length) || (canCloseDialogueBalloonNextClick && activeObjectForDialogue == thisNPC)) {
                                thisNPC.speechIndex = 0;
                                dialogue.classList.remove("active");
                                activeObjectForDialogue = '';
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
        }
    }
    // action processed, so cancel the key event:
    key[4] = 0;
}

function processSpeech(thisObjectSpeaking, thisSpeechPassedIn, thisSpeechCode, isPartOfNPCsNormalSpeech, speechCodeExtraParameter) {
    // thisObjectSpeaking could be an NPC, or could be an item object (if from a Notice for example)
    // thisSpeech is global so it can be edited in the close quest functions:
    thisSpeech = thisSpeechPassedIn;

    // isPartOfNPCsNormalSpeech is false if not set:
    isPartOfNPCsNormalSpeech = typeof isPartOfNPCsNormalSpeech !== 'undefined' ? isPartOfNPCsNormalSpeech : false;
    var individualSpeechCodes = thisSpeechCode.split(",");
    for (var i = 0; i < individualSpeechCodes.length; i++) {
        switch (individualSpeechCodes[i]) {
            case "once":
                thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);
                // knock this back one so to keep it in step with the removed item:
                thisObjectSpeaking.speechIndex--;
                break;
            case "move":
                thisObjectSpeaking.forceNewMovementCheck = true;
                thisObjectSpeaking.isMoving = true;
                break;
            case "shop":
                // check if the shop is empty:
                if (UI.openedShopSuccessfully(generateHash(thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2]))) {
                    //
                } else {
                    // shop is empty:
                    if (typeof thisObjectSpeaking.shopEmptySpeech !== "undefined") {
                        thisSpeech = thisObjectSpeaking.shopEmptySpeech;
                    }
                }
                //thisObjectSpeaking.speechIndex--;
                break;
            case "post":
                UI.openPost(thisObjectSpeaking.x, thisObjectSpeaking.y);
                break;
            case "retinue":
                UI.openRetinuePanel(thisObjectSpeaking);
                break;
            case "sound":
                audio.playSound(soundEffects[thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2]], 0);
                break;
            case "profession":
                var professionId = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                if (hero.professionsKnown.indexOf(professionId) == -1) {
                    hero.professionsKnown.push(professionId);
                    UI.showNewProfession(professionId);
                }
                break;
            case "follower":
                var followerId = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                /*
                if (hero.professionsKnown.indexOf(followerId) == -1) {
                    hero.professionsKnown.push(followerId);
                    showNotification('<p>You gained a new follower</p>');
                }
                */
                break;
            case "hire":
                UI.openHireFollowerPanel(thisObjectSpeaking);
                thisObjectSpeaking.speechIndex--;
                break;
            case "collection-quest":
            case "collection-quest-no-open":
                var collectionQuestSpeech = thisSpeech.split("|");
                var collectionQuestZoneName = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                // check if this zone key exists in the hero.collections object
                if (hero.collections.hasOwnProperty(collectionQuestZoneName)) {
                    // key exists - collection is underway.
                    // check if all are negative (if they are, collection is complete):
                    var foundAPositive = false;
                    for (var j in hero.collections[collectionQuestZoneName].required) {
                        if (hero.collections[collectionQuestZoneName].required[j] > 0) {
                            foundAPositive = true;
                            break;
                        }
                    }
                    if (foundAPositive) {
                        // not complete yet:
                        thisSpeech = collectionQuestSpeech[1];
                    } else {
                        var thisFullSpeech = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex];
                        // complete:
                        if (typeof thisFullSpeech[4] !== "undefined") {

                            awardQuestRewards(thisObjectSpeaking, thisFullSpeech[4], true);
                        }
                        thisSpeech = collectionQuestSpeech[2];
                        hero.collections[collectionQuestZoneName].complete = true;
                        UI.completeCollectionQuestPanel(collectionQuestZoneName);
                        thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);

                    }
                } else {
                    if (individualSpeechCodes[i] != 'collection-quest-no-open') {
                        // collection not started yet:
                        thisSpeech = collectionQuestSpeech[0];
                        hero.collections[collectionQuestZoneName] = {};
                        hero.collections[collectionQuestZoneName].required = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][3];
                        hero.collections[collectionQuestZoneName].complete = false;
                        UI.initiateCollectionQuestPanel(collectionQuestZoneName);
                    } else {
                        thisSpeech = collectionQuestSpeech[1];
                    }
                }
                thisObjectSpeaking.speechIndex--;
                break;
            case "give":
                var thisGiveSpeech = thisSpeech.split("|");
                var itemsToAdd = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                var allItemsToGive = [];
                for (var l = 0; l < itemsToAdd.length; l++) {
                    var thisRewardObject = prepareInventoryObject(itemsToAdd[l]);
                    allItemsToGive.push(thisRewardObject);
                }
                inventoryCheck = canAddItemToInventory(allItemsToGive);
                if (inventoryCheck[0]) {
                    thisSpeech = thisGiveSpeech[0];
                    UI.showChangeInInventory(inventoryCheck[1]);
                    thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);
                    // knock this back one so to keep it in step with the removed item:
                    thisObjectSpeaking.speechIndex--;
                } else {
                    thisSpeech = thisGiveSpeech[1];
                    // keep the NPC trying to give the item:
                    thisObjectSpeaking.speechIndex--;
                }
                break;

            case "catalogue":
                var catalogueQuestSpeech = thisSpeech.split("|");
                var catalogueQuestName = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                // check if this zone key exists in the hero object
                if (hero.catalogues.hasOwnProperty(catalogueQuestName)) {
                    var foundAPositive = false;
                    for (var j in hero.catalogues[catalogueQuestName].ids) {
                        if (hero.catalogues[catalogueQuestName].ids[j] > 0) {
                            foundAPositive = true;
                            break;
                        }
                    }
                    if (foundAPositive) {
                        // not complete yet:
                        thisSpeech = catalogueQuestSpeech[1];
                    } else {
                        // is complete
                        thisSpeech = catalogueQuestSpeech[2];
                        var thisFullSpeech = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex];
                        if (typeof thisFullSpeech[3] !== "undefined") {
                            awardQuestRewards(thisObjectSpeaking, thisFullSpeech[3], false);
                        }
                        hero.catalogues[catalogueQuestName].complete = true;
                        thisObjectSpeaking.speech.splice(thisObjectSpeaking.speechIndex, 1);
                        // find the catalogue item in the inventory and remove it:
                        for (var key in hero.inventory) {
                            if (hero.inventory[key].type == 84) {
                                if (hero.inventory[key].contains.catalogueName == catalogueQuestName) {
                                    removeFromInventory(key, 1);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    thisSpeech = catalogueQuestSpeech[0];
                }
                thisObjectSpeaking.speechIndex--;
                break;

            case "quest":
            case "quest-no-open":
            case "quest-no-close":
            case "quest-no-open-no-close":
            case "quest-optional":
                var questSpeech = thisSpeech.split("|");
                var questId;
                if (typeof thisObjectSpeaking.speech !== "undefined") {
                    questId = thisObjectSpeaking.speech[thisObjectSpeaking.speechIndex][2];
                } else {
                    // something like a notice:
                    questId = speechCodeExtraParameter;
                }


                //   console.log(questData[questId].isUnderway);

                if (questData[questId].isUnderway) {
                    // quest has been opened - check if it's complete:
                    if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-open") || (individualSpeechCodes[i] == "quest-optional")) {
                        // ie. it's not a '-no-close' speech

                        switch (questData[questId].whatIsRequiredForCompletion) {
                            case "possess":
                            case "give":
                            case "":
                                if (hasItemsInInventory(questData[questId].itemsNeededForCompletion)) {
                                    if (questData[questId].whatIsRequiredForCompletion == "give") {
                                        // remove items:
                                        for (var i = 0; i < questData[questId].itemsNeededForCompletion.length; i++) {
                                            removeItemTypeFromInventory(questData[questId].itemsNeededForCompletion[i].type, questData[questId].itemsNeededForCompletion[i].quantity);
                                        }
                                    }
                                    // close quest:
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }

                                break;
                            case "craft":
                                // build object required:
                                var theseCraftedObjects = [];
                                var thisCraftedObject;
                                for (var i = 0; i < questData[questId].itemsNeededForCompletion.length; i++) {
                                    thisCraftedObject = JSON.parse(JSON.stringify(questData[questId].itemsNeededForCompletion[i]));
                                    // make sure the player has crafted it:
                                    thisCraftedObject.hallmark = 0 - characterId;
                                    theseCraftedObjects.push(thisCraftedObject);
                                }
                                if (hasItemsInInventory(theseCraftedObjects)) {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            case "multi":
                                var allSubQuestsRequired = questData[questId].subQuestsRequiredForCompletion.split(",");
                                var allSubQuestsComplete = true;
                                for (var k = 0; k < allSubQuestsRequired.length; k++) {
                                    // check conditions for this sub-quest and set if it's complete
                                    switch (questData[allSubQuestsRequired[k]].whatIsRequiredForCompletion) {
                                        case "possess":
                                        case "give":
                                        case "":
                                            /*
                                            var theseItemsNeededForCompletion = questData[allSubQuestsRequired[k]].itemsNeededForCompletion;
                                            var itemsToGive = questData[allSubQuestsRequired[k]].startItemsReceived.split(",");
                                            var allItemsToGive = [];
                                            for (var j = 0; j < itemsToGive.length; j++) {

                                                if (!hasItemInInventory(itemsToGive[i].type, itemsToGive[i].quantity)) {
                                                    allSubQuestsComplete = false;
                                                }
                                            }
*/

                                            if (!(hasItemsInInventory(questData[allSubQuestsRequired[k]].itemsNeededForCompletion))) {
                                                allSubQuestsComplete = false;
                                            }
                                            break;
                                        case "craft":
                                            var theseCraftedObjects = [];
                                            var thisCraftedObject;
                                            for (var i = 0; i < questData[questId].itemsNeededForCompletion.length; i++) {
                                                thisCraftedObject = JSON.parse(JSON.stringify(questData[questId].itemsNeededForCompletion[i]));
                                                // make sure the player has crafted it:
                                                thisCraftedObject.hallmark = 0 - characterId;
                                                theseCraftedObjects.push(thisCraftedObject);
                                            }
                                            if (!(hasItemsInInventory(theseCraftedObjects))) {
                                                allSubQuestsComplete = false;
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
                                                //console.log(currentThresholdValue + " < " + questData[allSubQuestsRequired[k]].thresholdNeededForCompletion.substring(1));
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
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            case "escort":
                                if (typeof thisObjectSpeaking.hasCompletedEscortQuest !== "undefined") {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                    delete thisObjectSpeaking.hasCompletedEscortQuest;
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            case "world":
                                if (questData[questId].hasBeenActivated > 0) {
                                    thisSpeech = questSpeech[2];
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                            default:
                                // threshold quest:
                                var thresholdValueAtStart = questData[questId].valueAtQuestStart;
                                var currentThresholdValue = accessDynamicVariable(questData[questId].whatIsRequiredForCompletion);
                                var thisQuestIsComplete = false;
                                // check if it's an array of values:
                                if (questData[questId].thresholdNeededForCompletion.charAt(0) == "[") {
                                    // convert all entries in current Value array to string so they can be checked against the required array elements (which will be all strings)
                                    var currentThresholdValueString = currentThresholdValue.map(String);
                                    var requiredArray = questData[questId].thresholdNeededForCompletion.replace('[', '').replace(']', '').split(",");
                                    thisQuestIsComplete = true;
                                    for (var r = 0; r < requiredArray.length; r++) {
                                        if (currentThresholdValueString.indexOf(requiredArray[r]) === -1) {
                                            thisQuestIsComplete = false;
                                        }
                                    }
                                } else if (questData[questId].thresholdNeededForCompletion.charAt(0) == "+") {
                                    // check if it's an absolute value to check for, or an increment (whether there is a '+' at the start):
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
                                    closeQuest(thisObjectSpeaking, questId);
                                } else {
                                    // show 'underway' text:
                                    thisSpeech = questSpeech[1];
                                    // keep the NPC on this quest speech:
                                    thisObjectSpeaking.speechIndex--;
                                }
                                break;
                        }


                    } else {
                        // check if it's been closed elsewhere:

                        if (questData[questId].hasBeenCompleted > 0) {

                            thisSpeech = questSpeech[2];
                            //closeQuest(thisObjectSpeaking, questId);
                        } else {
                            // show 'underway' text:

                            thisSpeech = questSpeech[1];
                            // keep the NPC on this quest speech:
                            thisObjectSpeaking.speechIndex--;
                        }
                    }


                } else if (individualSpeechCodes[i] == "quest-optional") {
                    // the player has a choice whether to accept this or not:
                    questResponseNPC = thisObjectSpeaking;
                    acceptQuestChoice.classList.add('active');
                    thisSpeech = questSpeech[0];
                    if (thisObjectSpeaking != null) {
                        // keep the NPC on this quest speech:
                        thisObjectSpeaking.speechIndex--;
                    }
                } else {



                    if ((individualSpeechCodes[i] == "quest") || (individualSpeechCodes[i] == "quest-no-close")) {
                        // ie. don't open the quest if it's "-no-open":
                        openQuest(questId);
                    }
                    thisSpeech = questSpeech[0];
                    if (thisObjectSpeaking != null) {
                        // keep the NPC on this quest speech:
                        thisObjectSpeaking.speechIndex--;

                    }

                }
                break;
            case "play":

                startCardGame(thisObjectSpeaking);
                break;

            case "hnefatafl":
                thisChallengeNPC = thisObjectSpeaking;
                startHnefataflGame(thisObjectSpeaking);
                break;

            default:
                // nothing
        }
    }
    if (thisSpeech != "") {
        // don't show the balloon if there's no speech (which might happen if the NPC just plays a sound instead)
        // check that it's not undefined (eg. a Notice with an opened quest, but the text won't change)
        if (typeof thisSpeech === "undefined") {
            thisSpeech = questSpeech[0];
        }
        UI.showDialogue(thisObjectSpeaking, thisSpeech);
    } else {
        thisObjectSpeaking.speechIndex--;
    }
    canCloseDialogueBalloonNextClick = false;
    if (!isPartOfNPCsNormalSpeech) {
        // set a flag so that pressing action near the NPC will close the balloon:
        canCloseDialogueBalloonNextClick = true;
    }
}




function updateItems() {
    var thisItem, whichCreature, whichStartPoint;
    var startPointsPossible = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ];
    // check for any items that do anything based on time (eg. nests):
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
            thisItem = thisMapData[(visibleMaps[m])].items[i];

            if (currentActiveInventoryItems[thisItem.type].action == "nest") {
                if (thisItem.spawnsRemaining > 0) {
                    if (hero.totalGameTimePlayed - thisItem.timeLastSpawned >= currentActiveInventoryItems[thisItem.type].respawnRate) {
                        // pick a random creature from all possible:
                        whichCreature = thisItem.contains[(getRandomIntegerInclusive(1, thisItem.contains.length) - 1)];
                        // find a clear space around the item:
                        whichStartPoint = getRandomElementFromArray(startPointsPossible);
                        whichCreature.tileX = thisItem.tileX + whichStartPoint[0];
                        whichCreature.tileY = thisItem.tileY + whichStartPoint[1];
                        if (tileIsClear(whichCreature.tileX, whichCreature.tileY)) {
                            // create a copy so they are distinct:
                            thisMapData[(visibleMaps[m])].npcs.push(JSON.parse(JSON.stringify(whichCreature)));
                            initialiseNPC(thisMapData[(visibleMaps[m])].npcs[(thisMapData[(visibleMaps[m])].npcs.length - 1)]);
                            thisItem.spawnsRemaining--;
                            // reset timer:
                            thisItem.timeLastSpawned = hero.totalGameTimePlayed;
                        }
                    }
                }
            }
        }
    }
}

function checkForTitlesAwarded(whichQuestId) {
    // check for any titles:
    if (questData[whichQuestId].titleGainedAfterCompletion) {
        var thisTitle = questData[whichQuestId].titleGainedAfterCompletion;
        if (hero.titlesEarned.indexOf(thisTitle) == -1) {
            hero.titlesEarned.push(thisTitle);
            UI.showNotification('<p>I earned the &quot;' + possibleTitles[thisTitle] + '&quot; title</p>');
        }
    }
}


function checkForChallenges() {
    var thisNPC;
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
            thisNPC = thisMapData[(visibleMaps[m])].npcs[i];
            if (isInRange(hero.x, hero.y, thisNPC.x, thisNPC.y, (thisNPC.width + hero.width))) {
                if (isFacing(hero, thisNPC)) {
                    if (thisNPC.cardGameSpeech) {
                        thisNPC.drawnFacing = turntoFace(thisNPC, hero);
                        thisChallengeNPC = thisNPC;
                        processSpeech(thisNPC, thisNPC.cardGameSpeech.challenge[0], thisNPC.cardGameSpeech.challenge[1]);
                        break;
                    }
                }
            }
        }
    }
    // challenge processed, so cancel the key event:
    key[6] = 0;
}

function jumpToLocation(mapId, tileX, tileY) {
    activeDoorX = tileX;
    activeDoorY = tileY;
    jumpMapId = mapId;
    startDoorTransition();
}

function moveNPCs() {
    var thisNPC, thisUniqueIdentifier, thisInnerUniqueIdentifier, newTile, thisNextMovement, oldNPCx, oldNPCy, thisOtherNPC, thisItem, thisNextMovement, thisNextMovementCode, thisInnerDoor;
    for (var m = 0; m < visibleMaps.length; m++) {
        for (var i = 0; i < thisMapData[(visibleMaps[m])].npcs.length; i++) {
            //   thisUniqueIdentifier = m+"-"+i;
            thisNPC = thisMapData[(visibleMaps[m])].npcs[i];

            thisNPC.hasJustGotNewPath = false;

            if (thisNPC.name == "Warden") {
                // console.log(thisNPC.isMoving, thisNPC.forceNewMovementCheck, thisNPC.movement[thisNPC.movementIndex]);
            }


            // check if this NPC is playing cards with the hero:
            if (typeof thisNPC.isPlayingCards === "undefined") {
                newTile = false;
                if (thisNPC.isMoving) {
                    oldNPCx = thisNPC.x;
                    oldNPCy = thisNPC.y;
                    thisNPC.drawnFacing = thisNPC.facing;
                    switch (thisNPC.facing) {
                        case 'n':
                            thisNPC.y -= thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.length / 2))) {
                                // find the tile's bottom edge
                                var tileCollidedWith = getTileY(thisNPC.y - thisNPC.length / 2);
                                var tileBottomEdge = (tileCollidedWith + 1) * tileW;
                                // use the +1 to make sure it's just clear of the collision tile
                                thisNPC.y = tileBottomEdge + thisNPC.length / 2 + 1;
                            }
                            break;
                        case 's':
                            thisNPC.y += thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.length / 2))) {
                                var tileCollidedWith = getTileY(thisNPC.y + thisNPC.length / 2);
                                var tileTopEdge = (tileCollidedWith) * tileW;
                                thisNPC.y = tileTopEdge - thisNPC.length / 2 - 1;
                            }
                            break;
                        case 'w':
                            thisNPC.x -= thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y + thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x - thisNPC.width / 2, thisNPC.y - thisNPC.length / 2))) {
                                var tileCollidedWith = getTileX(thisNPC.x - thisNPC.width / 2);
                                var tileRightEdge = (tileCollidedWith + 1) * tileW;
                                thisNPC.x = tileRightEdge + thisNPC.width / 2 + 1;
                            }
                            break;
                        case 'e':
                            thisNPC.x += thisNPC.speed;
                            // check for collisions:
                            if ((isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y + thisNPC.length / 2)) || (isATerrainCollision(thisNPC.x + thisNPC.width / 2, thisNPC.y - thisNPC.length / 2))) {
                                var tileCollidedWith = getTileX(thisNPC.x + thisNPC.width / 2);
                                var tileLeftEdge = (tileCollidedWith) * tileW;
                                thisNPC.x = tileLeftEdge - thisNPC.width / 2 - 1;
                            }
                            break;
                    }

                    // check for collision against hero:
                    if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, hero.x, hero.y, hero.width, hero.length)) {
                        thisNPC.x = oldNPCx;
                        thisNPC.y = oldNPCy;
                    }

                    // check for collision against pet:
                    if (hasActivePet) {
                        for (var j = 0; j < hero.activePets.length; j++) {
                            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, hero.allPets[hero.activePets[j]].x, hero.allPets[hero.activePets[j]].y, hero.allPets[hero.activePets[j]].width, hero.allPets[hero.activePets[j]].length)) {
                                thisNPC.x = oldNPCx;
                                thisNPC.y = oldNPCy;
                            }
                        }
                    }

                    // check for collisions against other NPCs:
                    var whichNPCShouldMoveOutOfTheWay;
                    for (var n = 0; n < visibleMaps.length; n++) {
                        for (var j = 0; j < thisMapData[(visibleMaps[n])].npcs.length; j++) {
                            thisOtherNPC = thisMapData[(visibleMaps[n])].npcs[j];
                            //  thisInnerUniqueIdentifier = n+"-"+j;
                            if (thisNPC.uniqueIndex != thisOtherNPC.uniqueIndex) {

                                if (thisOtherNPC.isCollidable) {
                                    if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, thisOtherNPC.x, thisOtherNPC.y, thisOtherNPC.width, thisOtherNPC.length)) {
                                        thisNPC.x = oldNPCx;
                                        thisNPC.y = oldNPCy;




                                        /*
                                        // work out which one should get out of the way (see if one of them is static and move the other if so)
                                        if (!thisNPC.isMoving) {
                                            whichNPCShouldMoveOutOfTheWay = thisOtherNPC;
                                        } else if (!thisOtherNPC.isMoving) {
                                            whichNPCShouldMoveOutOfTheWay = thisNPC;
                                        } else {
                                            // give the one added to the map earlier precedence:
                                            if (thisNPC.index < thisOtherNPC.index) {
                                                whichNPCShouldMoveOutOfTheWay = thisOtherNPC;
                                            } else {
                                                whichNPCShouldMoveOutOfTheWay = thisNPC;
                                            }
                                        }
                                        console.log(thisNPC.name + ' collided with ' + thisOtherNPC.name+" - "+whichNPCShouldMoveOutOfTheWay.name+" will move out of the way");
                                        */

                                    }
                                }
                            }
                        }
                    }

                    // check for collisions against items:
                    for (var j = 0; j < thisMapData[currentMap].items.length; j++) {
                        thisItem = thisMapData[currentMap].items[j];
                        if (thisItem.isCollidable) {
                            if (isAnObjectCollision(thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length, thisItem.x, thisItem.y, thisItem.width, thisItem.length)) {
                                thisNPC.x = oldNPCx;
                                thisNPC.y = oldNPCy;
                            }
                        }
                    }


                    // check for inner doors:
                    if (typeof thisMapData[currentMap].innerDoors !== "undefined") {
                        for (var i in thisMapData[currentMap].innerDoors) {
                            thisInnerDoor = thisMapData[currentMap].innerDoors[i];
                            if (!thisInnerDoor.isOpen) {
                                if (isAnObjectCollision(getTileCentreCoordX(thisInnerDoor.tileX), getTileCentreCoordY(thisInnerDoor.tileY), tileW, tileW, thisNPC.x, thisNPC.y, thisNPC.width, thisNPC.length)) {
                                    thisNPC.x = oldNPCx;
                                    thisNPC.y = oldNPCy;
                                }
                            }
                        }
                    }

                    // find the difference for this movement:
                    thisNPC.dx += (thisNPC.x - oldNPCx);
                    thisNPC.dy += (thisNPC.y - oldNPCy);
                    // see if it's at a new tile centre:

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
                    if (typeof thisNPC.following !== "undefined") {
                        if (!thisNPC.forceNewMovementCheck) {




                            checkForEscortQuestEnd(thisNPC);

                        }
                    }
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
                            break;
                        case '?':

                            // this code must be able to be optimsed: ########

                            // see if it should turn (randomly, or if destination tile is blocked):



                            if ((getRandomIntegerInclusive(1, 3) == 1) || (!tileIsClear(thisNPC.tileX + relativeFacing[thisNPC.facing]["x"], thisNPC.tileY + relativeFacing[thisNPC.facing]["y"]))) {
                                // try turning left or right, otherwise back the way it came
                                var facingsToPickFrom;
                                if ((thisNPC.facing == "n") || (thisNPC.facing == "s")) {
                                    if (getRandomIntegerInclusive(1, 2) == 1) {
                                        facingsToPickFrom = ["e", "w"];
                                    } else {
                                        facingsToPickFrom = ["w", "e"];
                                    }
                                } else {
                                    if (getRandomIntegerInclusive(1, 2) == 1) {
                                        facingsToPickFrom = ["n", "s"];
                                    } else {
                                        facingsToPickFrom = ["s", "n"];
                                    }
                                }
                                switch (thisNPC.facing) {
                                    case "n":
                                        facingsToPickFrom.push("s");
                                        facingsToPickFrom.push("n");
                                        break;
                                    case "s":
                                        facingsToPickFrom.push("n");
                                        facingsToPickFrom.push("s");
                                        break;
                                    case "e":
                                        facingsToPickFrom.push("w");
                                        facingsToPickFrom.push("e");
                                        break;
                                    case "w":
                                        facingsToPickFrom.push("e");
                                        facingsToPickFrom.push("w");
                                        break;

                                }

                                do {
                                    thisNPC.facing = facingsToPickFrom.shift();
                                } while (!tileIsClear(thisNPC.tileX + relativeFacing[thisNPC.facing]["x"], thisNPC.tileY + relativeFacing[thisNPC.facing]["y"]))
                            }


                            /*
                                                    do {
                                                        // pick a totally random facing:
                                                        thisNPC.facing = facingsPossible[Math.floor(Math.random() * facingsPossible.length)];
                                                        // check that the target tile is walkable:
                                                    } while (isATerrainCollision(thisNPC.x + (relativeFacing[thisNPC.facing]["x"] * tileW), thisNPC.y + (relativeFacing[thisNPC.facing]["y"] * tileW)));
                                                    */
                            thisNPC.forceNewMovementCheck = false;
                            break;

                        case 'find':
                            thisNPC.forceNewMovementCheck = true;
                            if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {
                                pathfindingWorker.postMessage([thisNextMovement[1], thisNPC, thisMapData, visibleMaps, isOverWorldMap]);
                                // make sure to only request this once:
                                thisNPC.isMoving = false;
                                thisNPC.waitingForAPath = true;
                                thisNPC.waitingTimer = 0;

                                // play animation while waiting
                                thisNPC.currentAnimation = 'wait';
                                // thisNextMovement[2]
                                // #######

                                // keep the NPC waiting:
                                thisNPC.movementIndex--;
                            } else {
                                // check timer:
                                thisNPC.waitingTimer++;
                                if (thisNPC.waitingTimer > thisNextMovement[3]) {
                                    thisNPC.isMoving = true;
                                    // set this so it doesn't do the check for a tile being blocked before it's turned to its new facing:
                                    thisNPC.hasJustGotNewPath = true;
                                    thisNPC.currentAnimation = 'walk';
                                    delete thisNPC.waitingTimer;
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
                            var thisPreviousMovement;
                            // check if it's a escort quest NPC that's come to the end of their pathfinding path:
                            if (typeof thisNPC.following !== "undefined") {
                                for (j = thisNPC.movementIndex; j >= 0; j--) {
                                    thisPreviousMovement = thisNPC.movement[j];
                                    if (typeof thisPreviousMovement === 'string') {
                                        if (thisPreviousMovement == 'following') {
                                            var numberOfElementsRemoved = thisNPC.movementIndex - (j);
                                            thisNPC.movement.splice(j + 1, numberOfElementsRemoved);
                                            // this needs to be one more than the equivilient for 'find' types:
                                            thisNPC.movementIndex -= (numberOfElementsRemoved + 1);
                                            thisNPC.isMoving = true;
                                            thisNPC.forceNewMovementCheck = true;
                                            delete thisNPC.waitingTimer;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                // it's a 'find' type movement that's just ended:
                                var targetDestination = thisNPC.lastTargetDestination.split("-");
                                thisNPC.drawnFacing = turntoFaceTile(thisNPC, targetDestination[0], targetDestination[1]);
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
                                            delete thisNPC.waitingTimer;
                                            break;
                                        }
                                    }
                                }
                            }
                            break;

                        case 'talkToNeighbour':
                            // find an adjacent NPC and get them to turn to face this NPC
                            for (var j = 0; j < thisMapData[currentMap].npcs.length; j++) {
                                if (i != j) {
                                    thisOtherNPC = thisMapData[currentMap].npcs[j];
                                    if (Math.abs(thisOtherNPC.tileX - thisNPC.tileX) <= 1) {
                                        if (Math.abs(thisOtherNPC.tileY - thisNPC.tileY) <= 1) {
                                            thisOtherNPC.drawnFacing = turntoFace(thisOtherNPC, thisNPC);
                                        }
                                    }
                                }
                            }
                            break;

                        case 'follow':
                            // initialise following another object:

                            switch (thisNextMovement[1]) {
                                case 'hero':
                                    if (hero.npcsFollowing.length > 0) {
                                        // already has an NPC following, so follow that:
                                        thisNPC.following = hero.npcsFollowing[hero.npcsFollowing[(hero.npcsFollowing.length - 1)]];
                                    } else if (hero.activePets.length > 0) {
                                        // follow the last pet:
                                        thisNPC.following = hero.allPets[hero.activePets[(hero.activePets.length - 1)]];
                                    } else {
                                        // follow the hero:
                                        thisNPC.following = hero;
                                    }
                                    hero.npcsFollowing.push(thisNPC);
                                    thisNPC.movement[thisNPC.movementIndex] = "following";
                                    // keep it on the waiting item to keep checking:
                                    thisNPC.movementIndex--;
                                    thisNPC.forceNewMovementCheck = false;
                                    thisNPC.isMoving = true;
                                    break;
                                default:
                                    //
                            }
                            break;
                        case 'following':

                            // is already following, need to process that movement - check proximity to target to see if pet should stop moving: 
                            if ((isInRange(thisNPC.following.x, thisNPC.following.y, thisNPC.x, thisNPC.y, tileW * 2))) {
                                thisNPC.isMoving = false;
                                // keep it on the waiting item to keep checking:
                                thisNPC.movementIndex--;
                                thisNPC.forceNewMovementCheck = true;
                            } else {
                                thisNPC.isMoving = true;
                                // check the breadcrumb for next direction:
                                var breadcrumbFound = false;
                                for (var k = 0; k < thisNPC.following.breadcrumb.length; k++) {
                                    if ((thisNPC.tileY) == thisNPC.following.breadcrumb[k][1]) {
                                        if ((thisNPC.tileX - 1) == thisNPC.following.breadcrumb[k][0]) {
                                            thisNPC.facing = "w";
                                            breadcrumbFound = true;
                                            break;
                                        } else if ((thisNPC.tileX + 1) == thisNPC.following.breadcrumb[k][0]) {
                                            thisNPC.facing = "e";
                                            breadcrumbFound = true;
                                            break;
                                        }
                                    } else if ((thisNPC.tileX) == thisNPC.following.breadcrumb[k][0]) {
                                        if ((thisNPC.tileY + 1) == thisNPC.following.breadcrumb[k][1]) {
                                            thisNPC.facing = "s";
                                            breadcrumbFound = true;
                                            break;
                                        } else if ((thisNPC.tileY - 1) == thisNPC.following.breadcrumb[k][1]) {
                                            thisNPC.facing = "n";
                                            breadcrumbFound = true;
                                            break;
                                        }
                                    }
                                }

                                if (!breadcrumbFound) {
                                    thisNPC.forceNewMovementCheck = true;
                                    if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {

                                        pathfindingWorker.postMessage(["npcFindFollowing", thisNPC, thisMapData, visibleMaps, isOverWorldMap]);
                                        // make sure to only request this once:
                                        thisNPC.isMoving = false;
                                        thisNPC.waitingForAPath = true;
                                        // play animation while waiting
                                        // thisNPC.currentAnimation = 'wait';
                                        thisNPC.waitingTimer = 0;
                                        // keep it on the waiting item to keep checking:
                                        thisNPC.movementIndex--;
                                    } else {

                                        thisNPC.isMoving = true;
                                        //delete thisNPC.waitingTimer;
                                        // thisNPC.currentAnimation = 'walk';
                                    }
                                } else {
                                    // keep it on the waiting item to keep checking:
                                    thisNPC.movementIndex--;
                                    thisNPC.forceNewMovementCheck = false;
                                }
                            }
                            break;

                        case 'animate':
                            if (typeof thisNPC.animationWaitingTimer === "undefined") {
                                thisNPC.currentAnimation = thisNextMovement[1];
                                // needs to stay like this for the number of animation frames multiplied by the number of times the animation is required:
                                // (also need the animation to start from its frame 0, not use the global frame so that it plays from the first frame of the animation)
                                thisNPC.animationWaitingTimer = currentAnimationFrame;
                                thisNPC.movementIndex--;
                                thisNPC.isMoving = false;
                                thisNPC.forceNewMovementCheck = true;
                            } else {
                                // the +1 is because the drawn frame needs +1 so that the first frame is 1 and not 0:
                                if (currentAnimationFrame + 1 < (thisNPC.animation[thisNPC.currentAnimation].length * thisNextMovement[2]) + thisNPC.animationWaitingTimer) {
                                    // keep it on the waiting item to keep checking:
                                    thisNPC.movementIndex--;
                                    thisNPC.forceNewMovementCheck = true;
                                } else {
                                    thisNPC.isMoving = true;
                                    thisNPC.forceNewMovementCheck = true;
                                    thisNPC.currentAnimation = "walk";
                                    delete thisNPC.animationWaitingTimer;
                                }
                            }
                            break;

                        default:
                            thisNPC.facing = thisNextMovement;
                            thisNPC.forceNewMovementCheck = false;
                            break;
                    }
                    if (thisNPC.isMoving && !thisNPC.hasJustGotNewPath) {
                        // check destination tile is clear:
                        var thisNPCsNextTile = relativeFacing[thisNPC.facing];
                        var newTileX = thisNPC.tileX + thisNPCsNextTile['x'];
                        var newTileY = thisNPC.tileY + thisNPCsNextTile['y'];
                        if (!(tileIsClear(newTileX, newTileY))) {
                            // if it's got a destination, add this blocked tile to the map, and re-path to that destination:
                            if (thisNPC.lastTargetDestination != "") {
                                // remove previous path:
                                var targetDestination = thisNPC.lastTargetDestination.split("-");
                                var pathEndIndex;
                                // find the 'pathEnd' index:
                                for (j = thisNPC.movement.length; j >= 0; j--) {
                                    //    console.log("checking:"+thisNPC.movement[j]);
                                    if (thisNPC.movement[j] == "pathEnd") {
                                        pathEndIndex = j;
                                        break;
                                    }
                                }
                                for (j = pathEndIndex; j >= 0; j--) {
                                    thisPreviousMovement = thisNPC.movement[j];
                                    // might not be a 'find', so check if reached the start of the array:
                                    // is there a neater way to remove the previous path? ###############
                                    if ((typeof thisPreviousMovement !== 'string') || (j == 0)) {
                                        if ((thisPreviousMovement[0] == 'find') || (j == 0)) {
                                            var numberOfElementsRemoved = pathEndIndex - (j);
                                            // console.log("numberOfElementsRemoved"+numberOfElementsRemoved);
                                            thisNPC.movement.splice(j + 1, numberOfElementsRemoved);
                                            thisNPC.movementIndex = j;
                                            //   console.log("end"+j);
                                            thisNPC.isMoving = false;
                                            thisNPC.forceNewMovementCheck = true;
                                            delete thisNPC.waitingTimer;
                                            break;
                                        }
                                    }
                                }
                                if ((!thisNPC.waitingForAPath) && (typeof thisNPC.waitingTimer === "undefined")) {
                                    // make a copy of the map with that blocked tile and any surrounding tiles marked, so it doesn't move off and immediately collide at the next tile:
                                    var tempMapData = JSON.parse(JSON.stringify(thisMapData));
                                    var testTileX, testTileY, localTestTileX, localTestTileY, whichTestMap;
                                    for (var k = -3; k <= 3; k++) {
                                        for (var l = -3; l <= 3; l++) {

                                            testTileX = newTileX + k;
                                            testTileY = newTileY + l;





                                            if (!(tileIsClear(testTileX, testTileY))) {

                                                localTestTileX = getLocalCoordinatesX(testTileX);
                                                localTestTileY = getLocalCoordinatesY(testTileY);
                                                whichTestMap = findMapNumberFromGlobalCoordinates(testTileX, testTileY);

                                                tempMapData[whichTestMap].collisions[localTestTileX][localTestTileY] = 1;
                                            }


                                        }
                                    }
                                    pathfindingWorker.postMessage(['tile', targetDestination[0], targetDestination[1], thisNPC, tempMapData, visibleMaps, isOverWorldMap]);
                                    // make sure to only request this once:
                                    thisNPC.isMoving = false;
                                    thisNPC.waitingForAPath = true;
                                    thisNPC.waitingTimer = 0;
                                    // play animation while waiting
                                    thisNPC.currentAnimation = 'wait';
                                    // #####
                                    // keep the NPC waiting:
                                    thisNPC.movementIndex--;
                                }
                                // end duplicated code
                            }
                        }
                    }
                }
                checkForSlopes(thisNPC);
            }
        }
    }
}


function movePlatforms() {
    if (thisMapData[currentMap].movingPlatforms) {
        // check for any items on platforms:
        for (var i = 0; i < thisMapData[currentMap].items.length; i++) {
            if (thisMapData[currentMap].items[i].isOnPlatform != undefined) {
                if (thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].canMove) {
                    thisMapData[currentMap].items[i].x += thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].dx;
                    thisMapData[currentMap].items[i].y += thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].dy;
                    thisMapData[currentMap].items[i].z += thisMapData[currentMap].movingPlatforms[thisMapData[currentMap].items[i].isOnPlatform].dz;
                }
            }
        }
        var thisPlatform, thisPlatformMovements;
        for (var i = 0; i < thisMapData[currentMap].movingPlatforms.length; i++) {
            thisPlatform = thisMapData[currentMap].movingPlatforms[i];
            if (thisPlatform.canMove) {
                thisPlatform.x += thisPlatform.dx;
                thisPlatform.y += thisPlatform.dy;
                thisPlatform.z += thisPlatform.dz;
                // check to see if it's reached it's next target (within in a tolerance):
                //console.log(thisPlatform.targetX, thisPlatform.x,thisPlatform.targetY, thisPlatform.y);
                if (Math.abs(thisPlatform.targetX - thisPlatform.x) < 0.5) {
                    if (Math.abs(thisPlatform.targetY - thisPlatform.y) < 0.5) {
                        if (Math.abs(thisPlatform.targetZ - thisPlatform.z) < 0.5) {
                            // snap to target:
                            thisPlatform.x = thisPlatform.targetX;
                            thisPlatform.y = thisPlatform.targetY;
                            thisPlatform.z = thisPlatform.targetZ;
                            // find next movement:
                            thisPlatformMovements = determinePlatformIncrements(thisPlatform);
                            thisPlatform.dx = thisPlatformMovements[0];
                            thisPlatform.dy = thisPlatformMovements[1];
                            thisPlatform.dz = thisPlatformMovements[2];
                        }
                    }
                }
            }
        }
    }
}

function determinePlatformIncrements(whichPlatform) {
    var nextMovement = whichPlatform.movement[whichPlatform.movementIndex];
    var targetX = getTileCentreCoordX(nextMovement[0]);
    var targetY = getTileCentreCoordY(nextMovement[1]);
    var targetZ = nextMovement[2];
    var dx, dy, dz;
    var totalDistance = getPythagorasDistance(whichPlatform.x, whichPlatform.y, targetX, targetY);
    var numberOfTurns = totalDistance / whichPlatform.speed;
    // determine differences:
    var xDiff = whichPlatform.x - targetX;
    var yDiff = whichPlatform.y - targetY;
    var zDiff = whichPlatform.z - targetZ;
    dx = 0 - xDiff / (numberOfTurns);
    dy = 0 - yDiff / (numberOfTurns);
    dz = 0 - zDiff / (numberOfTurns);
    /*
    if (typeof nextMovement[3] !== "undefined") {
        switch (nextMovement[3]) {
            case 'jump':
                // don't ease to the new location, jump straight to it:
                whichPlatform.x = targetX;
                whichPlatform.y = targetY;
                whichPlatform.z = targetZ;
                dx = dy = dz = 0;
                break;
        }
    }
    */
    whichPlatform.targetX = targetX;
    whichPlatform.targetY = targetY;
    whichPlatform.targetZ = targetZ;
    whichPlatform.movementIndex++;
    if (whichPlatform.movementIndex >= whichPlatform.movement.length) {
        whichPlatform.movementIndex = 0;
    }
    return [dx, dy, dz];
}

function canLearnRecipe(recipeIndex) {
    var wasSuccessful = false;


    console.log(hero.crafting);

    if (hero.recipesKnown.indexOf(recipeIndex) === -1) {
        // check for pre-requisites
        // #####
        hero.recipesKnown.push(parseInt(recipeIndex));

        // reload the recipe data
        // #####
        wasSuccessful = true;
    }
    return wasSuccessful;
}

function sendUserPost(postData) {
    var postDataToSend = JSON.parse(postData);
    getJSONWithParams("/game-world/sendPost.php", 'postData=' + JSON.stringify(postDataToSend), function(data) {
        if (data.success) {
            console.log("user post sent");
        } else {
            console.log("user post failed #1");
            // let user try again ########
        }
    }, function(status) {
        console.log("user post failed #2");
        // let user try again ########
    });
}

function sendNPCPost(postData, attachments) {
    console.log(postData);
    var postDataToSend = JSON.parse(postData);

    if (attachments) {
        postDataToSend['attachments'] = attachments;
    }
    // console.log(JSON.stringify(postDataToSend));
    getJSONWithParams("/game-world/sendPost.php", 'postData=' + JSON.stringify(postDataToSend), function(data) {
        if (data.success) {
            // show new post notification:
            newPost.classList.add('active');
            // get new post ######
        } else {
            console.log("npc post failed #1");
            // try again? ####
        }
    }, function(status) {
        console.log("npc post failed #2");
        // try again ? #######
    });
}

function saveGame() {
    // save game state:

    // avoid circular references in the Hero object:
    // https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json/11616993#answer-11616993
    var cache = [];
    var heroJSONWithoutCircularReference = JSON.stringify(hero, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null;
    getJSONWithParams("/game-world/saveGameState.php", 'chr=' + characterId + '+&postData=' + heroJSONWithoutCircularReference, function(data) {
        if (data.success == 'true') {
            // all ok - no action ?
        } else {

            // try again? 
        }
    }, function(status) {
        // try again ? 
    });
    // save map state:
    // ##########
    // save UI state:
    // ##########

}

function isVisibleOnScreen(isoX, isoY) {
    // canvasWidth
    var horizontalDistance = Math.abs(hero.isox - isoX);
    var verticalDistance = Math.abs(hero.isoy - isoY);
    // needs to take into account the item's width and height ######
    if (horizontalDistance > (canvasWidth / 2) + tileW) {
        return false;
    }
    if (verticalDistance > (canvasHeight / 2) + tileW) {
        return false;
    }
    return true;
}

function printScreen() {
    var fullQualityJpeg = gameCanvas.toDataURL('image/jpeg', 1.0);
    // Chrome currently has a 2Mb maximum, so convert to a blob:
    var objecturl = URL.createObjectURL(dataURItoBlob(fullQualityJpeg));
    var printScreenAnchor = document.getElementById('printScreenAnchor');
    printScreenAnchor.href = objecturl;
    printScreenAnchor.setAttribute("download", "screenshot_" + getCurrentDateTimeFormatted() + ".jpg");
    printScreenAnchor.click();
}

function draw() {

    if (gameMode == "mapLoading") {
        gameContext.fillStyle = "#000000";
        gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
        gameContext.fill();
    } else {
        // get all assets to be drawn in a list
        var thisGraphicCentreX, thisGraphicCentreY, thisX, thisY, thisNPC, thisItem, shouldFadeThisObject;
        hero.isox = findIsoCoordsX(hero.x, hero.y);
        hero.isoy = findIsoCoordsY(hero.x, hero.y);
        var heroOffsetCol = currentAnimationFrame % hero["animation"][hero.currentAnimation]["length"];
        var heroOffsetRow = (hero["animation"][hero.currentAnimation][hero.facing]) + (hero["animation"][hero.currentAnimation]["start-row"]);
        var assetsToDraw = [
            [findIsoDepth(hero.x, hero.y, hero.z), "sprite", heroImg, heroOffsetCol * hero.spriteWidth, heroOffsetRow * hero.spriteHeight, hero.spriteWidth, hero.spriteHeight, Math.floor(canvasWidth / 2 - hero.centreX), Math.floor(canvasHeight / 2 - hero.centreY - hero.z), hero.spriteWidth, hero.spriteHeight]
        ];
        if (interfaceIsVisible) {
            switch (activeAction) {
                case 'dowse':
                    assetsToDraw.push([0, "dowsingRing", Math.floor(canvasWidth / 2 - dowsingRingSize / 2), Math.floor(canvasHeight / 2 - dowsingRingSize / 4)]);
                    break;
                case 'plotPlacement':
                    assetsToDraw.push([0, "plotPlacementOverlay"]);
                    break;
            }
            if (gameMode == 'housing') {
                if (hero.settings.showFootprintInEditMode) {
                    assetsToDraw.push([0, "houseGroundPlan"]);
                }
                // check if over the plot footprint:
                if (housingNameSpace.mousePosition[0] >= hero.housing.northWestCornerTileX) {
                    if (housingNameSpace.mousePosition[0] < hero.housing.southEastCornerTileX) {
                        if (housingNameSpace.mousePosition[1] >= hero.housing.northWestCornerTileY) {
                            if (housingNameSpace.mousePosition[1] < hero.housing.southEastCornerTileY) {
                                switch (housingNameSpace.activeTool) {


                                    case 'paint':
                                        if (housingNameSpace.whichTileActive != '') {
                                            // draw ghost of the selected tile graphic 
                                            assetsToDraw.push([findIsoDepth(getTileCentreCoordX(housingNameSpace.mousePosition[0]), getTileCentreCoordY(housingNameSpace.mousePosition[1]), 0), "ghostSelectedHousingTile"]);

                                        }
                                        break;
                                    case 'remove':
                                        // draw a tile outline over the base footprint:
                                        assetsToDraw.push([0, "ghostRemoveHousingTile"]);
                                        // identify which tile item that is and ghost that slightly
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (gameMode == 'housing') {
            // draw any draft housing tiles:
            var whichHousingItem;
            //    for (var i = 0; i < hero.housing.draft.length; i++) {
            var i = housingNameSpace.whichElevationActive;
            for (var j = 0; j < hero.housing.draft[i].length; j++) {
                whichHousingItem = hero.housing.draft[i][j].type;
                // add the half for the tile's centre:
                var thisItemX = (hero.housing.northWestCornerTileX + hero.housing.draft[i][j].tileX + 0.5) * tileW;
                var thisItemY = (hero.housing.northWestCornerTileY + hero.housing.draft[i][j].tileY + 0.5) * tileW;
                var thisItemZ = getElevation(hero.housing.northWestCornerTileX + hero.housing.draft[i][j].tileX, hero.housing.northWestCornerTileY + hero.housing.draft[i][j].tileY);
                thisFileColourSuffix = "";
                if (hero.housing.draft[i][j].colour) {
                    // bypass hasInherent colour checks as won't be in inventory items
                    var thisColourName = colourNames[hero.housing.draft[i][j].colour];
                    if (thisColourName != "") {
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                }
                thisItemIdentifier = "item" + whichHousingItem + thisFileColourSuffix;
                thisX = findIsoCoordsX(thisItemX, thisItemY);
                thisY = findIsoCoordsY(thisItemX, thisItemY);
                shouldFadeThisObject = false;
                // if the remove tool is active, check if this item is on the tile for removal:
                if (housingNameSpace.activeTool == "remove") {
                    if ((hero.housing.northWestCornerTileX + hero.housing.draft[i][j].tileX) == housingNameSpace.mousePosition[0]) {
                        if ((hero.housing.northWestCornerTileY + hero.housing.draft[i][j].tileY) == housingNameSpace.mousePosition[1]) {
                            shouldFadeThisObject = true;
                        }
                    }
                }
                if (shouldFadeThisObject) {
                    assetsToDraw.push([findIsoDepth(thisItemX, thisItemY, thisItemZ), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - housingData[whichHousingItem].centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - housingData[whichHousingItem].centreY + (canvasHeight / 2) - thisItemZ), 0.3]);
                } else {
                    assetsToDraw.push([findIsoDepth(thisItemX, thisItemY, thisItemZ), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - housingData[whichHousingItem].centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - housingData[whichHousingItem].centreY + (canvasHeight / 2) - thisItemZ)]);
                }
            }
            //  }
        }


        // draw fae:
        thisX = findIsoCoordsX(fae.x, fae.y);
        thisY = findIsoCoordsY(fae.x, fae.y);
        fae.oscillateOffset = ((Math.sin(fae.dz) + 1) * 8) + fae.z + fae.zOffset;
        if (isVisibleOnScreen(thisX, thisY)) {
            assetsToDraw.push([findIsoDepth(fae.x, fae.y, fae.z), "faeCentre", Math.floor(thisX - hero.isox + (canvasWidth / 2)), Math.floor(thisY - hero.isoy + (canvasHeight / 2) - fae.oscillateOffset)]);
        }

        // draw fae particles:
        for (var i = 0; i < fae.particles.length; i++) {
            assetsToDraw.push([fae.particles[i].depth, "faeParticle", Math.floor(fae.particles[i].isoX - hero.isox + (canvasWidth / 2)), Math.floor(fae.particles[i].isoY - hero.isoy + (canvasHeight / 2)), fae.particles[i].alpha]);
        }

        var map, thisMapsGlobalOffsetX, thisMapsGlobalOffsetY;
        var thisNPCOffsetCol = 0;
        var thisNPCOffsetRow = 0;
        var thisFileColourSuffix = '';
        var thisColourName, thisItemIdentifier, thisPlatform, thisNPCIdentifier, thisTerrainIdentifer;
        var thisItemOffsetCol = 0;
        var thisItemOffsetRow = 0;

        for (var m = 0; m < visibleMaps.length; m++) {

            map = thisMapData[visibleMaps[m]].terrain;

            if (isOverWorldMap) {
                thisMapsGlobalOffsetX = thisMapData[(visibleMaps[m])].globalCoordinateTile0X * worldMapTileLength;
                thisMapsGlobalOffsetY = thisMapData[(visibleMaps[m])].globalCoordinateTile0Y * worldMapTileLength;
            } else {
                thisMapsGlobalOffsetX = 0;
                thisMapsGlobalOffsetY = 0;
            }
            for (var i = 0; i < mapTilesX; i++) {
                for (var j = 0; j < mapTilesY; j++) {
                    // the tile coordinates should be positioned by i,j but the way the map is drawn, the reference in the array is j,i
                    // this makes the map array more readable when editing
                    if (map[j][i] != "*") {
                        thisX = getTileIsoCentreCoordX(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        thisY = getTileIsoCentreCoordY(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        if (isVisibleOnScreen(thisX, thisY)) {
                            thisGraphicCentreX = thisMapData[visibleMaps[m]].graphics[(map[j][i])].centreX;
                            thisGraphicCentreY = thisMapData[visibleMaps[m]].graphics[(map[j][i])].centreY;
                            thisTerrainIdentifer = thisMapData[visibleMaps[m]].graphics[(map[j][i])].src;
                            assetsToDraw.push([findIsoDepth(getTileCentreCoordX(i + thisMapsGlobalOffsetX), getTileCentreCoordY(j + thisMapsGlobalOffsetY), 0), "img", tileImages[thisTerrainIdentifer], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                        }
                    }
                    // look for tilled tiles:

                    if (thisMapData[visibleMaps[m]].properties[j][i].tilled == 1) {
                        thisX = getTileIsoCentreCoordX(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        thisY = getTileIsoCentreCoordY(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                        if (isVisibleOnScreen(thisX, thisY)) {
                            thisGraphicCentreX = tileW / 2;
                            thisGraphicCentreY = tileH / 2;
                            assetsToDraw.push([0, "img", tilledEarth, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                        }
                    }
                    // look for watered tiles:
                    if (typeof thisMapData[visibleMaps[m]].properties[j][i].water !== "undefined") {
                        if (thisMapData[visibleMaps[m]].properties[j][i].water.amount > 0) {
                            thisX = getTileIsoCentreCoordX(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                            thisY = getTileIsoCentreCoordY(i + thisMapsGlobalOffsetX, j + thisMapsGlobalOffsetY);
                            if (isVisibleOnScreen(thisX, thisY)) {
                                thisGraphicCentreX = tileW / 2;
                                thisGraphicCentreY = tileH / 2;
                                for (var k = 0; k < thisMapData[visibleMaps[m]].properties[j][i].water.amount; k++) {
                                    assetsToDraw.push([k + 1, "img", addedWater, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                                }
                            }
                        }
                    }
                }
            }


            if (typeof thisMapData[visibleMaps[m]].innerDoors !== "undefined") {
                var thisDoorImage;
                for (var i in thisMapData[visibleMaps[m]].innerDoors) {
                    // check for open status to get the right graphic ###########
                    if (!thisMapData[visibleMaps[m]].innerDoors[i]['isOpen']) {
                        thisX = getTileIsoCentreCoordX(thisMapData[visibleMaps[m]].innerDoors[i]['tileX'], thisMapData[visibleMaps[m]].innerDoors[i]['tileY']);
                        thisY = getTileIsoCentreCoordY(thisMapData[visibleMaps[m]].innerDoors[i]['tileX'], thisMapData[visibleMaps[m]].innerDoors[i]['tileY']);
                        if (isVisibleOnScreen(thisX, thisY)) {
                            thisDoorImage = thisMapData[visibleMaps[m]].innerDoors[i]['graphic'];
                            thisDoorImage = thisMapData[visibleMaps[m]].graphics[(thisDoorImage)].src;
                            thisGraphicCentreX = thisMapData[visibleMaps[m]].graphics[(thisMapData[visibleMaps[m]].innerDoors[i]['graphic'])].centreX;
                            thisGraphicCentreY = thisMapData[visibleMaps[m]].graphics[(thisMapData[visibleMaps[m]].innerDoors[i]['graphic'])].centreY;
                            assetsToDraw.push([findIsoDepth(getTileCentreCoordX(thisMapData[visibleMaps[m]].innerDoors[i]['tileX']), getTileCentreCoordY(thisMapData[visibleMaps[m]].innerDoors[i]['tileY']), 0), "img", tileImages[thisDoorImage], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                        }
                    }
                }
            }
        }
        if (hasActivePet) {
            for (var i = 0; i < hero.activePets.length; i++) {
                thisNPCOffsetCol = currentAnimationFrame % hero.allPets[hero.activePets[i]]["animation"]["walk"]["length"];
                thisNPCOffsetRow = hero.allPets[hero.activePets[i]]["animation"]["walk"][hero.allPets[hero.activePets[i]].facing];
                thisX = findIsoCoordsX(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
                thisY = findIsoCoordsY(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y);
                if (isVisibleOnScreen(thisX, thisY)) {
                    assetsToDraw.push([findIsoDepth(hero.allPets[hero.activePets[i]].x, hero.allPets[hero.activePets[i]].y, hero.allPets[hero.activePets[i]].z), "sprite", activePetImages[i], thisNPCOffsetCol * hero.allPets[hero.activePets[i]].spriteWidth, thisNPCOffsetRow * hero.allPets[hero.activePets[i]].spriteHeight, hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight, Math.floor(thisX - hero.isox - hero.allPets[hero.activePets[i]].centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - hero.allPets[hero.activePets[i]].centreY + (canvasHeight / 2) - hero.allPets[hero.activePets[i]].z), hero.allPets[hero.activePets[i]].spriteWidth, hero.allPets[hero.activePets[i]].spriteHeight]);
                }
            }
        }


        var shouldDrawThisItem;
        for (var m = 0; m < visibleMaps.length; m++) {
            whichVisibleMap = visibleMaps[m];

            for (var i = 0; i < thisMapData[whichVisibleMap].npcs.length; i++) {
                thisNPC = thisMapData[whichVisibleMap].npcs[i];

                if (typeof thisNPC.animationWaitingTimer === "undefined") {
                    thisNPCOffsetCol = currentAnimationFrame % thisNPC["animation"][thisNPC.currentAnimation]["length"];
                } else {
                    // don't use the global animation timer, so that this animation plays from its own first frame through to its end:
                    // (need modulo in case the animation is being played several times)
                    thisNPCOffsetCol = (currentAnimationFrame + 1 - thisNPC.animationWaitingTimer) % thisNPC["animation"][thisNPC.currentAnimation]["length"];
                }

                thisNPCOffsetRow = thisNPC["animation"][thisNPC.currentAnimation][thisNPC.drawnFacing];
                thisX = findIsoCoordsX(thisNPC.x, thisNPC.y);
                thisY = findIsoCoordsY(thisNPC.x, thisNPC.y);
                if (isVisibleOnScreen(thisX, thisY)) {
                    //assetsToDraw.push([findIsoDepth(thisX, thisY), npcImages[i], Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2))]);
                    thisNPCIdentifier = "npc" + thisMapData[whichVisibleMap].npcs[i].src;
                    assetsToDraw.push([findIsoDepth(thisNPC.x, thisNPC.y, thisNPC.z), "sprite", npcImages[thisNPCIdentifier], thisNPCOffsetCol * thisNPC.spriteWidth, thisNPCOffsetRow * thisNPC.spriteHeight, thisNPC.spriteWidth, thisNPC.spriteHeight, Math.floor(thisX - hero.isox - thisNPC.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisNPC.centreY + (canvasHeight / 2) - thisNPC.z), thisNPC.spriteWidth, thisNPC.spriteHeight]);
                }
            }



            for (var i = 0; i < thisMapData[whichVisibleMap].items.length; i++) {
                thisItem = thisMapData[whichVisibleMap].items[i];


                shouldDrawThisItem = true;
                if (gameMode == 'housing') {
                    // if this item is part of the current player's plot, don't draw it here - it'll be drawn as part of the draft (and might be deleted) 
                    if (thisItem.lockedToPlayerId) {
                        if (thisItem.lockedToPlayerId == characterId) {
                            shouldDrawThisItem = false;
                        }
                    }
                }


                if (shouldDrawThisItem) {
                    thisX = findIsoCoordsX(thisItem.x, thisItem.y);
                    thisY = findIsoCoordsY(thisItem.x, thisItem.y);
                    if (isVisibleOnScreen(thisX, thisY)) {
                        //    console.log(whichVisibleMap+" - "+thisItem.type+" : "+thisX+", "+thisY+" : "+thisItem.x+", "+thisItem.y);
                        thisFileColourSuffix = "";
                        if (thisMapData[whichVisibleMap].items[i].colour) {
                            thisColourName = getColourName(thisItem.colour, thisItem.type);
                            if (thisColourName != "") {
                                thisFileColourSuffix = "-" + thisColourName.toLowerCase();

                            }
                        }
                        thisItemIdentifier = "item" + thisMapData[whichVisibleMap].items[i].type + thisFileColourSuffix;





                        // check for User Generated Content:
                        if (typeof thisMapData[whichVisibleMap].items[i].contains !== "undefined") {
                            if (typeof thisMapData[whichVisibleMap].items[i].contains['ugc-id'] !== "undefined") {
                                thisItemIdentifier = "item" + thisMapData[whichVisibleMap].items[i].type + '_' + thisMapData[whichVisibleMap].items[i].contains['ugc-id'];
                            }
                        }
                        if (typeof thisItem.animation !== "undefined") {
                            if (typeof thisItem.state !== "undefined") {
                                thisItemOffsetCol = (thisItem["animation"][thisItem.state]["length"]) - 1;
                                thisItemOffsetRow = thisItem["animation"][thisItem.state]["row"];
                            } else {
                                // use facing:
                                thisItemOffsetCol = (thisItem["animation"]['facing']["length"]) - 1;
                                thisItemOffsetRow = thisItem["animation"]['facing'][thisItem.facing];
                            }
                            assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "sprite", itemImages[thisItemIdentifier], thisItemOffsetCol * thisItem.spriteWidth, thisItemOffsetRow * thisItem.spriteHeight, thisItem.spriteWidth, thisItem.spriteHeight, Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z), thisItem.spriteWidth, thisItem.spriteHeight]);
                        } else {
                            assetsToDraw.push([findIsoDepth(thisItem.x, thisItem.y, thisItem.z), "img", itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - thisItem.centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisItem.centreY + (canvasHeight / 2) - thisItem.z)]);
                        }
                    }
                }
            }

            if (thisMapData[whichVisibleMap].movingPlatforms) {
                for (var i = 0; i < thisMapData[whichVisibleMap].movingPlatforms.length; i++) {
                    thisPlatform = thisMapData[whichVisibleMap].movingPlatforms[i];
                    thisX = findIsoCoordsX(thisPlatform.x, thisPlatform.y);
                    thisY = findIsoCoordsY(thisPlatform.x, thisPlatform.y);
                    if (isVisibleOnScreen(thisX, thisY)) {
                        thisGraphicCentreX = thisMapData[whichVisibleMap].graphics[thisPlatform.graphic].centreX;
                        thisGraphicCentreY = thisMapData[whichVisibleMap].graphics[thisPlatform.graphic].centreY;
                        assetsToDraw.push([findIsoDepth(thisPlatform.x, thisPlatform.y, thisPlatform.z), "img", tileImages[thisPlatform.graphic], Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2))]);
                    }
                }
            }



        }

        assetsToDraw.sort(sortByLowestValue);







        if (isOverWorldMap) {

            // draw the sea:
            gameContext.rect(0, 0, canvasWidth, canvasHeight);
            gameContext.fillStyle = oceanPattern;
            gameContext.fill();


            var thisMapsGlobalOffsetX, thisMapsGlobalOffsetY, currentWorldMapPosX, currentWorldMapPosY;
            // find and draw any visible maps:
            for (var i = 0; i < visibleMaps.length; i++) {

                thisMapsGlobalOffsetX = thisMapData[(visibleMaps[i])].globalCoordinateTile0X * worldMapTileLength;
                thisMapsGlobalOffsetY = thisMapData[(visibleMaps[i])].globalCoordinateTile0Y * worldMapTileLength;
                currentWorldMapPosX = Math.floor((canvasWidth / 2) + getTileIsoCentreCoordX(0 + thisMapsGlobalOffsetX, 0 + thisMapsGlobalOffsetY) - hero.isox - (worldMapWidthPx / 2));
                currentWorldMapPosY = Math.floor((canvasHeight / 2) + getTileIsoCentreCoordY(0 + thisMapsGlobalOffsetX, 0 + thisMapsGlobalOffsetY) - hero.isoy - (tileH / 2));
                // draw the current map background in place:
                if (typeof backgroundImgs[(visibleMaps[i])] !== "undefined") {
                    gameContext.drawImage(backgroundImgs[(visibleMaps[i])], currentWorldMapPosX, currentWorldMapPosY);
                }
            }
        } else {
            // draw a black background:
            gameContext.fillStyle = "#000000";
            gameContext.fillRect(0, 0, canvasWidth, canvasHeight);
            gameContext.fill();


            // need to determine the offset for the top left corner of the map from the top left corner of the image #######

            if (typeof backgroundImgs[currentMap] !== "undefined") {
                gameContext.drawImage(backgroundImgs[currentMap], Math.floor(getTileIsoCentreCoordX(0, mapTilesY - 1) - thisMapData[currentMap].backgroundOffsetX - hero.isox - tileW / 2 + canvasWidth / 2), Math.floor(getTileIsoCentreCoordY(0, 0) - hero.isoy - thisMapData[currentMap].backgroundOffsetY - (tileH / 2) + canvasHeight / 2));
            }
        }



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
                    if (typeof assetsToDraw[i][2] !== "undefined") {
                        // image has been loaded

                        gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4], assetsToDraw[i][5], assetsToDraw[i][6], assetsToDraw[i][7], assetsToDraw[i][8], assetsToDraw[i][9], assetsToDraw[i][10]);
                    }
                    break;
                case "dowsingRing":
                    gameContext.globalCompositeOperation = 'lighten';
                    // draw the dowsing ring:
                    drawEllipse(gameContext, assetsToDraw[i][2] + (100 - dowsing.proximity) / 2, assetsToDraw[i][3] + (100 - dowsing.proximity) / 4, dowsingRingSize * dowsing.proximity / 100, (dowsingRingSize * dowsing.proximity / 100) / 2, true, 'rgba(255,255,0,0.3)');
                    // draw the outline:
                    drawEllipse(gameContext, assetsToDraw[i][2], assetsToDraw[i][3], dowsingRingSize, dowsingRingSize / 2, false, 'rgba(255,255,0,0.3)');
                    // restore the composite mode to the default:
                    gameContext.globalCompositeOperation = 'source-over';
                    break;
                case "ghostRemoveHousingTile":
                    drawIsoRectangle(housingNameSpace.mousePosition[0] * tileW, housingNameSpace.mousePosition[1] * tileW, ((housingNameSpace.mousePosition[0]) + 1) * tileW, ((housingNameSpace.mousePosition[1] + 1) * tileW), true, 'rgba(255,0,0,0.3)');
                    break;
                case "ghostSelectedHousingTile":
                    gameContext.globalAlpha = 0.5;
                    // draw ghost tile:
                    thisFileColourSuffix = "";
                    if (housingNameSpace.whichDyeColourActive != "0") {
                        var thisColourName = colourNames[housingNameSpace.whichDyeColourActive];
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                    thisItemIdentifier = "item" + housingNameSpace.whichTileActive + thisFileColourSuffix;
                    if (typeof itemImages[thisItemIdentifier] !== "undefined") {
                        thisX = getTileIsoCentreCoordX(housingNameSpace.mousePosition[0], housingNameSpace.mousePosition[1]);
                        thisY = getTileIsoCentreCoordY(housingNameSpace.mousePosition[0], housingNameSpace.mousePosition[1]);
                        gameContext.drawImage(itemImages[thisItemIdentifier], Math.floor(thisX - hero.isox - housingData[housingNameSpace.whichTileActive].centreX + (canvasWidth / 2)), Math.floor(thisY - hero.isoy - housingData[housingNameSpace.whichTileActive].centreY + (canvasHeight / 2)));
                    }
                    gameContext.globalAlpha = 1.0;
                    break;
                case "houseGroundPlan":
                    // draw house foot print:
                    drawIsoRectangle(hero.housing.northWestCornerTileX * tileW, hero.housing.northWestCornerTileY * tileW, (hero.housing.southEastCornerTileX) * tileW, (hero.housing.southEastCornerTileY) * tileW, true, 'rgba(255,255,0,0.2)');
                    break;
                case "plotPlacementOverlay":
                    gameContext.globalCompositeOperation = 'soft-light';
                    var mouseTilePosition = getTileCoordsFromScreenPosition(cursorPositionX, cursorPositionY);
                    // undefined first time:
                    if (cursorPositionX) {
                        var thisOverlayX, thisOverlayY, thisOverlayFill;
                        plotPlacement.numberOfBlockedTiles = 0;
                        for (var j = 0 - plotPlacement.width / 2; j < plotPlacement.width / 2; j++) {
                            for (var k = 0 - plotPlacement.length / 2; k < plotPlacement.length / 2; k++) {
                                thisOverlayX = mouseTilePosition[0] + j;
                                thisOverlayY = mouseTilePosition[1] + k;
                                thisOverlayFill = 'rgba(0,255,0,0.8)';
                                if (!tileIsClear(thisOverlayX, thisOverlayY)) {
                                    thisOverlayFill = 'rgba(255,0,0,0.8)';
                                    plotPlacement.numberOfBlockedTiles++;
                                }
                                drawIsoRectangle(thisOverlayX * tileW, thisOverlayY * tileW, (thisOverlayX + 1) * tileW, (thisOverlayY + 1) * tileW, true, thisOverlayFill);
                            }
                        }
                        //  console.log("number of blocked tiles: " + plotPlacement.numberOfBlockedTiles);
                    }
                    gameContext.globalCompositeOperation = 'source-over';
                    break;
                case "img":
                    // standard image:
                    if (typeof assetsToDraw[i][5] !== "undefined") {
                        gameContext.globalAlpha = assetsToDraw[i][5];
                    }
                    if (typeof assetsToDraw[i][2] !== "undefined") {
                        gameContext.drawImage(assetsToDraw[i][2], assetsToDraw[i][3], assetsToDraw[i][4]);
                    }
                    if (typeof assetsToDraw[i][5] !== "undefined") {
                        gameContext.globalAlpha = 1;
                    }
            }
        }

        if (activeObjectForDialogue != '') {
            UI.updateDialogue(activeObjectForDialogue);
        }

        if (thisMapData[currentMap].showOnlyLineOfSight) {
            // draw light map:
            lightMapContext.clearRect(0, 0, canvasWidth, canvasHeight);
            var thisLightMapValue;
            // start at -1 to cover the back edge tiles:
            for (var i = -1; i < mapTilesX; i++) {
                for (var j = -1; j < mapTilesY; j++) {
                    thisX = getTileIsoCentreCoordX(i, j);
                    thisY = getTileIsoCentreCoordY(i, j);
                    thisGraphicCentreX = 28;
                    thisGraphicCentreY = 17;
                    thisLightMapValue = 1;
                    if ((i > -1) && (j > -1)) {
                        thisLightMapValue = 1.01 - lightMap[j][i];
                    }
                    if (thisLightMapValue > 0) {
                        lightMapContext.save();
                        lightMapContext.globalAlpha = thisLightMapValue;
                        lightMapContext.drawImage(shadowImg, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)) / 4, Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2)) / 4);
                        lightMapContext.restore();
                    } else {
                        // no need to shade:
                        lightMapContext.drawImage(shadowImg, Math.floor(thisX - hero.isox - thisGraphicCentreX + (canvasWidth / 2)) / 4, Math.floor(thisY - hero.isoy - thisGraphicCentreY + (canvasHeight / 2)) / 4);
                    }
                }
            }
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
    loadGlobalMapData();
} else {
    // sorry message / fallback? #####
}