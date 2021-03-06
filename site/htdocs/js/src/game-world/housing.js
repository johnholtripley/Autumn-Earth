function homeStoneToHouse() {
    // need to make sure this is clear (the assumption is that all plots will be placed with a clear 1 tile around them so they never block a path):
    jumpToLocation(hero.housing.southEastCornerTileX + 1, hero.housing.southEastCornerTileY + 1);
}

function placePlotPlacement() {
    if (plotPlacement.numberOfBlockedTiles == 0) {
        document.removeEventListener("mousemove", UI.movePlotPlacementOverlay, false);
        document.removeEventListener("click", placePlotPlacement, false);
        activeAction = "";
        var mouseTilePosition = getTileCoordsFromScreenPosition(cursorPositionX, cursorPositionY);
        // get the top left corner:
        mouseTilePosition[0] -= (plotPlacement.width / 2);
        mouseTilePosition[1] -= (plotPlacement.length / 2);
        // post to server to create files for this character
        getJSON('/game-world/addPlot.php?width=' + plotPlacement.width + '&height=' + plotPlacement.length + '&tileX=' + mouseTilePosition[0] + '&tileY=' + mouseTilePosition[1] + '&chr=' + characterId, function(data) {

            if (data.success) {
                // remove plot item from inventory:
                removeItemTypeFromInventory(plotPlacement.whichType, 1);
                hero.housing.hasAPlayerHouse = true;
                hero.housing.northWestCornerTileX = mouseTilePosition[0];
                hero.housing.northWestCornerTileY = mouseTilePosition[1];
                hero.housing.southEastCornerTileX = mouseTilePosition[0] + parseInt(plotPlacement.width);
                hero.housing.southEastCornerTileY = mouseTilePosition[1] + parseInt(plotPlacement.length);

                // set the empty tile data for the ground floor:
                hero.housing.draft = [];
                hero.housing.draft[0] = [];
                // show footprint so the player knows it's worked:
                hero.settings.showFootprintInEditMode = true;
                showHousingFootprintCheckbox.checked = true;
                UI.openHousingPanel();
                UI.openHousingConstructionPanel();
            }
        }, function(status) {
            // try again 
            // ######
        });
    } else {
        UI.showNotification("<p>I can't put a plot there</p>");
    }
}

const firstTileThatWouldBeActive = document.querySelector('.housingTileGroup.active li');

var housingNameSpace = {
    'whichTileActive': '',
    'whichWorldTileActive': '',
    'whichElevationActive': 0,
    'maxElevationsPossible': 3,
    'whichDyeColourActive': 0,
    'runningCostTotal': 0,
    'costForActiveTile': 0,
    'activeTool': 'paint',
    'mousePosition': [],
    'draftHousingTilesToLoad': [],
    'whichItemIdsLoading': [],
    'whichFacingActive': 'n',
    'whichZIndexActive': 0,
    'currentTileCanBeElevated': firstTileThatWouldBeActive.getAttribute("data-canbelevated"),
    'zIndexesPerElevation': tileW * 3,
    'activeTileCanBeRotated': firstTileThatWouldBeActive.getAttribute("data-canberotated"),
    'floodFillTilesChecked': [],

    init: function() {
        // load in any graphics used in the draft but not already loaded into memory:
        if (hero.housing.hasAPlayerHouse) {
            if (hero.housing.draft) {
                var whichColour, whichWorldTile, thisFileColourSuffix, thisColourName;
                for (var i = 0; i < hero.housing.draft.length; i++) {
                    for (var j = 0; j < hero.housing.draft[i].length; j++) {
                        whichColour = 0;
                        if (typeof hero.housing.draft[i][j].colour !== "undefined") {
                            whichColour = hero.housing.draft[i][j].colour;
                        }
                        whichWorldTile = document.querySelector('#housingTileSelection li[data-id="' + hero.housing.draft[i][j].type + '"]').getAttribute('data-cleanurl');
                        thisFileColourSuffix = '';
                        if (whichColour != 0) {
                            // bypass hasInherent colour checks as won't be in inventory items
                            thisColourName = colourNames[whichColour];
                            if (thisColourName != "") {
                                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                            }
                        }
                        var itemID = "item" + hero.housing.draft[i][j].type + thisFileColourSuffix;
                        if (housingNameSpace.whichItemIdsLoading.indexOf(itemID) === -1) {
                            housingNameSpace.draftHousingTilesToLoad.push({
                                name: itemID,
                                src: '/images/game-world/items/' + whichWorldTile + '.png'
                            });
                            housingNameSpace.whichItemIdsLoading.push(itemID);
                        }
                    }
                }
            }
            Loader.preload(housingNameSpace.draftHousingTilesToLoad, housingNameSpace.prepareDraftHousingAssets, loadingProgress);
        }
    },

    prepareDraftHousingAssets: function() {
        for (var i = 0; i < housingNameSpace.whichItemIdsLoading.length; i++) {
            itemImages[housingNameSpace.whichItemIdsLoading[i]] = Loader.getImage(housingNameSpace.whichItemIdsLoading[i]);
        }
    },

    update: function() {
        if (key[12]) {
            // escape - cancel active tile
            document.getElementById('housingTile' + housingNameSpace.whichTileActive).classList.remove('active');
            housingNameSpace.whichTileActive = '';
            housingNameSpace.whichWorldTileActive = '';
            housingNameSpace.costForActiveTile = 0;
            housingNameSpace.activeTool = '';
            for (var i = 0; i < housingConstructionToolButtons.length; i++) {
                housingConstructionToolButtons[i].classList.remove('active');
            }
            key[12] = false;
        }
        if (key[7]) {
            UI.toggleUI();
            key[7] = false;
        }
        if (key[15]) {
            // cursor left:
            housingNameSpace.adjustRotation(-1);
            key[15] = false;
        }
        if (key[16]) {
            // cursor right:
            housingNameSpace.adjustRotation(1);
            key[16] = false;
        }
        if (key[13]) {
            // cursor up:
            housingNameSpace.adjustZIndex(1);
            key[13] = false;
        }
        if (key[14]) {
            // cursor down:
            housingNameSpace.adjustZIndex(-1);
            key[14] = false;
        }
    },

    worldClickHandler: function(e) {
        // if in bounds of the plot footprint:
        var xDiff = e.pageX - (canvasWidth / 2);
        var yDiff = e.pageY - (canvasHeight / 2);
        var nonIsoCoordX = find2DCoordsX(hero.isox + xDiff, hero.isoy + yDiff);
        var nonIsoCoordY = find2DCoordsY(hero.isox + xDiff, hero.isoy + yDiff);
        var clickWorldTileX = getTileX(nonIsoCoordX);
        var clickWorldTileY = getTileY(nonIsoCoordY);
        if (clickWorldTileX >= hero.housing.northWestCornerTileX) {
            if (clickWorldTileX < hero.housing.southEastCornerTileX) {
                if (clickWorldTileY >= hero.housing.northWestCornerTileY) {
                    if (clickWorldTileY < hero.housing.southEastCornerTileY) {
                        // make sure it's not a button or another UI element:
                        if (e.target.nodeName == "CANVAS") {
                            switch (housingNameSpace.activeTool) {
                                case 'paint':
                                    if (housingNameSpace.whichTileActive != '') {
                                        housingNameSpace.addTileToLocation(clickWorldTileX - hero.housing.northWestCornerTileX, clickWorldTileY - hero.housing.northWestCornerTileY);
                                    }
                                    break;
                                case 'remove':
                                    var tilesBeingRemoved = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return ((currentItemObject.tileX == (clickWorldTileX - hero.housing.northWestCornerTileX)) && (currentItemObject.tileY == (clickWorldTileY - hero.housing.northWestCornerTileY)));
                                    });
                                    for (var i in tilesBeingRemoved) {
                                        // refund cost:
                                        housingNameSpace.runningCostTotal -= parseInt(document.getElementById("housingTile" + tilesBeingRemoved[i].type).getAttribute('data-price'));
                                    }
                                    housingNameSpace.updateRunningTotal();
                                    // find items at this tile and remove them:
                                    hero.housing.draft[housingNameSpace.whichElevationActive] = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return (!((currentItemObject.tileX == (clickWorldTileX - hero.housing.northWestCornerTileX)) && (currentItemObject.tileY == (clickWorldTileY - hero.housing.northWestCornerTileY))));
                                    });
                                    break;
                                case 'fill':
                                    if (housingNameSpace.whichTileActive != '') {
                                        housingNameSpace.floodFillFrom(clickWorldTileX - hero.housing.northWestCornerTileX, clickWorldTileY - hero.housing.northWestCornerTileY);
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
        }
    },

    addTileToLocation: function(tileX, tileY) {
        var newWallTile = {
            "type": parseInt(housingNameSpace.whichTileActive),
            "tileX": (tileX),
            "tileY": (tileY),
            "lockedToPlayerId": characterId
        }
        if (housingNameSpace.currentTileCanBeElevated) {
            newWallTile.tileZ = (housingNameSpace.whichZIndexActive / tileW);
        }
        if (housingNameSpace.whichDyeColourActive != 0) {
            newWallTile.colour = parseInt(housingNameSpace.whichDyeColourActive);
        }
        if (housingNameSpace.activeTileCanBeRotated) {
            newWallTile.facing = housingNameSpace.whichFacingActive;
        }
        // place tile:
        hero.housing.draft[housingNameSpace.whichElevationActive].push(newWallTile);
        housingNameSpace.runningCostTotal += housingNameSpace.costForActiveTile;
        housingNameSpace.updateRunningTotal();
    },

    mouseMove: function(e) {
        housingNameSpace.mousePosition = getTileCoordsFromScreenPosition(e.pageX, e.pageY);
    },

    toggleShowPlotFootprint: function(e) {
        if (e.target.checked) {
            hero.settings.showFootprintInEditMode = true;
        } else {
            hero.settings.showFootprintInEditMode = false;
        }
    },

    housingTileColourChange: function(e) {
        if (housingNameSpace.whichDyeColourActive != housingTileColour.value) {
            housingNameSpace.whichDyeColourActive = housingTileColour.value;
            housingNameSpace.loadNewTile(housingNameSpace.whichTileActive, housingNameSpace.whichWorldTileActive, housingNameSpace.whichDyeColourActive);
            // change colour of available tiles:
            var colourSuffix = "";
            if (housingTileColour.value != "0") {
                colourSuffix = '-' + colourNames[housingNameSpace.whichDyeColourActive].toLowerCase();
            }
            for (var i = 0; i < housingTileSelectionListItems.length; i++) {
                housingTileSelectionListItems[i].firstElementChild.src = '/images/game-world/items/' + housingTileSelectionListItems[i].getAttribute('data-cleanurl') + colourSuffix + '.png';
            }
        }
    },

    selectNewTile: function(e) {
        if (housingNameSpace.whichTileActive != '') {
            document.getElementById('housingTile' + housingNameSpace.whichTileActive).classList.remove('active');
        }
        var whichTile = getNearestParentId(e.target);
        whichTile.classList.add('active');
        housingNameSpace.costForActiveTile = parseInt(whichTile.getAttribute("data-price"));
        housingNameSpace.whichWorldTileActive = whichTile.getAttribute("data-cleanurl");
        if (housingNameSpace.activeTool == "remove") {
            housingNameSpace.activeTool = "paint";
        }
        housingNameSpace.activeTileCanBeRotated = whichTile.getAttribute("data-canberotated");
        housingNameSpace.currentTileCanBeElevated = whichTile.getAttribute("data-canbelevated");
        housingNameSpace.showActiveTool(document.getElementById('housingConstructToolPaint'));
        housingNameSpace.whichTileActive = whichTile.getAttribute("data-id");
        housingNameSpace.loadNewTile(housingNameSpace.whichTileActive, housingNameSpace.whichWorldTileActive, housingNameSpace.whichDyeColourActive);

    },

    loadNewTile: function(whichTile, whichWorldTile, whichColour) {
        // load world tile asset if it's not already loaded:
        // check if the wall is being dyed:
        var thisFileColourSuffix = '';
        if (whichColour != 0) {
            // bypass hasInherent colour checks as won't be in inventory items
            var thisColourName = colourNames[whichColour];
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
        }

        var itemID = "item" + whichTile + thisFileColourSuffix;
        if (typeof itemImages[itemID] === "undefined") {
            //   console.log(itemImages,itemImages[itemID],(typeof itemImages[itemID]),itemID,whichTile, whichWorldTile, whichColour);
            Loader.preload([{ name: itemID, src: '/images/game-world/items/' + whichWorldTile + thisFileColourSuffix + '.png' }], function() {
                itemImages[itemID] = Loader.getImage(itemID);
                console.log("completed laoding: " + itemID);
            }, function() {});
        }
    },

    commitDesign: function() {
        // check money and confirm 
        if (housingNameSpace.runningCostTotal > hero.currency.money) {
            UI.showYesNoDialogueBox("Not enough money&hellip;", "Save design", "Cancel design", "housingNameSpace.saveDraftDesign", "housingNameSpace.abandonLatestChanges");
        } else {
            var titleText;
            if (housingNameSpace.runningCostTotal < 0) {
                titleText = "Commit this design and be refunded " + parseMoney((0 - housingNameSpace.runningCostTotal)) + "?";
            } else {
                titleText = "Commit this design at a cost of " + parseMoney(housingNameSpace.runningCostTotal) + "?";
            }
            UI.showYesNoDialogueBox(titleText, "Commit design", "Save for later", "housingNameSpace.publishCommittedDesign", "housingNameSpace.saveDraftDesign");
        }
    },

    publishCommittedDesign: function() {
        // save json to file system:
        getJSONWithParams("/game-world/savePlot.php", 'chr=' + characterId + '&postData=' + JSON.stringify(hero.housing.draft) + '&northWestCornerTileX=' + hero.housing.northWestCornerTileX + '&northWestCornerTileY=' + hero.housing.northWestCornerTileY, function(data) {
            if (data.success) {
                // check no pet, hero, NPC etc in the way - move if so ####

                UI.hideYesNoDialogueBox();
                hero.currency.money -= housingNameSpace.runningCostTotal;
                UI.updateCurrencies();
                if (housingNameSpace.runningCostTotal != 0) {
                    audio.playSound(soundEffects['coins'], 0);
                    housingNameSpace.runningCostTotal = 0;
                }
                hero.housing.draftCost = 0;
                housingNameSpace.updateRunningTotal();
                // add data to local mapData - first, find which maps this plot is over:
                var whichMapsToUpdate = uniqueValues([findWhichWorldMap(hero.housing.northWestCornerTileX, hero.housing.northWestCornerTileY), findWhichWorldMap(hero.housing.southEastCornerTileX, hero.housing.southEastCornerTileY), findWhichWorldMap(hero.housing.southEastCornerTileX, hero.housing.northWestCornerTileY), findWhichWorldMap(hero.housing.northWestCornerTileX, hero.housing.southEastCornerTileY)]);
                // remove existing housing data for this player from these maps:
                for (var i = 0; i < whichMapsToUpdate.length; i++) {
                    // need to check if they're within the plot footprint to be safe?  ###
                    thisMapData[(whichMapsToUpdate[i])].items = thisMapData[(whichMapsToUpdate[i])].items.filter(function(currentItemObject) {
                        return currentItemObject.lockedToPlayerId !== characterId;
                    });
                }
                // loop through housing.draft[0] for the external tiles, and add those to the relevant map
                var clonedHousingItem, whichMap;
                for (var i = 0; i < hero.housing.draft[0].length; i++) {
                    clonedHousingItem = JSON.parse(JSON.stringify(hero.housing.draft[0][i]));
                    // adjust the tile coordinates:
                    clonedHousingItem.tileX += hero.housing.northWestCornerTileX;
                    clonedHousingItem.tileY += hero.housing.northWestCornerTileY;
                    // need to get inventory data for this as well #############
                    whichMap = findWhichWorldMap(clonedHousingItem.tileX, clonedHousingItem.tileY);
                    thisMapData[whichMap].items.push(clonedHousingItem);
                    initialiseItem(thisMapData[whichMap].items[thisMapData[whichMap].items.length - 1]);
                }
                UI.closeHousingConstructionPanel();
            } else {
                // try again? ########
            }
        }, function(status) {
            // try again? ########
        });
    },


    checkSaveDraftDesign: function() {
        UI.showYesNoDialogueBox("Save these latest changes to your draft version?", "Save to draft", "Abandon changes", "housingNameSpace.saveDraftDesign", "housingNameSpace.abandonLatestChanges");
    },

    abandonLatestChanges: function() {
        // revert draft object to the saved version:
        hero.housing.draft = JSON.parse(JSON.stringify(housingNameSpace.restoreDraft));
        housingNameSpace.runningCostTotal = 0;
        housingNameSpace.updateRunningTotal();
        UI.closeHousingConstructionPanel();
        UI.hideYesNoDialogueBox();
    },

    saveDraftDesign: function() {
        hero.housing.draftCost = housingNameSpace.runningCostTotal;
        getJSONWithParams("/game-world/savePlot.php", 'chr=' + characterId + '&postData=' + JSON.stringify(hero.housing.draft) + '&northWestCornerTileX=' + hero.housing.northWestCornerTileX + '&northWestCornerTileY=' + hero.housing.northWestCornerTileY + '&draft=true', function(data) {
            if (data.success) {
                UI.showNotification("<p>I've saved that design for later</p>");
                //  housingAbandonDesign.classList.remove("active");
                UI.hideYesNoDialogueBox();
                UI.closeHousingConstructionPanel();
            } else {
                // try again? ########
            }
        }, function(status) {
            // try again? ########
        });
    },

    checkAbandonDesign: function() {
        UI.showYesNoDialogueBox("Abandon this draft design entirely?", "Abandon draft", "Keep this changes for now", "housingNameSpace.abandonDesign", "UI.hideYesNoDialogueBox");
    },

    abandonDesign: function() {
        // remove all changes (make the draft like the committed) - on both the server and locally:
        getJSONWithParams("/game-world/removeDraftPlot.php", 'chr=' + characterId, function(data) {
            if (data.housing.success) {
                hero.housing.draft = JSON.parse(data.housing.draft);
                UI.showNotification("<p>I've abandoned that draft design</p>");
                UI.hideYesNoDialogueBox();
                UI.closeHousingConstructionPanel();
            } else {
                // try again? ########
            }
        }, function(status) {
            // try again? ########
        });
    },

    changeActiveTool: function(e) {
        var whichButton = getNearestParentId(e.target);
        housingNameSpace.activeTool = whichButton.getAttribute("data-action");
        housingNameSpace.showActiveTool(whichButton);
    },

    showActiveTool: function(whichButton) {
        for (var i = 0; i < housingConstructionToolButtons.length; i++) {
            housingConstructionToolButtons[i].classList.remove('active');
        }
        whichButton.classList.add('active');
    },

    updateRunningTotal: function() {
        if (housingNameSpace.runningCostTotal > hero.currency.money) {
            housingRunningTotal.classList.add('notEnough');
        } else {
            housingRunningTotal.classList.remove('notEnough');
        }
        housingRunningTotal.innerHTML = parseMoney(housingNameSpace.runningCostTotal);
    },

    toggleTileGroup: function(e) {
        for (i = 0; i < housingTileGroups.length; i++) {
            housingTileGroups[i].classList.remove('active');
        }
        document.getElementById(e.target.getAttribute("data-group")).classList.add('active');
        for (i = 0; i < housingToggleButtons.length; i++) {
            housingToggleButtons[i].classList.remove('active');
        }
        e.target.classList.add('active');
    },

    adjustRotation: function(whichDirection) {
        var currentRotationIndex = facingsPossible.indexOf(housingNameSpace.whichFacingActive);
        currentRotationIndex += whichDirection;
        if (currentRotationIndex < 0) {
            currentRotationIndex = facingsPossible.length - 1;
        }
        if (currentRotationIndex >= facingsPossible.length) {
            currentRotationIndex = 0;
        }
        housingNameSpace.whichFacingActive = facingsPossible[currentRotationIndex];
    },
    adjustZIndex: function(whichDirection) {
        housingNameSpace.whichZIndexActive += whichDirection;
        if (housingNameSpace.whichZIndexActive < 0) {
            housingNameSpace.whichZIndexActive = 0;
            if (housingNameSpace.whichElevationActive > 0) {
                housingNameSpace.whichElevationActive--;
                housingNameSpace.updateElevationDisplay();
            }
        }
        if (housingNameSpace.whichZIndexActive >= housingNameSpace.zIndexesPerElevation) {
            if (housingNameSpace.whichElevationActive < housingNameSpace.maxElevationsPossible) {
                housingNameSpace.whichZIndexActive = 0;
                housingNameSpace.whichElevationActive++;
                housingNameSpace.updateElevationDisplay();
            } else {
                housingNameSpace.whichZIndexActive = housingNameSpace.zIndexesPerElevation;
            }
        }
    },

    updateElevationDisplay: function() {
        // show which elevation
        // ghost other levels
    },

    findTileAtLocation: function(tileX, tileY) {
        var foundIndices = [];
        var indexToFillOn = '';
        for (var i = 0; i < hero.housing.draft[housingNameSpace.whichElevationActive].length; i++) {
            if (hero.housing.draft[housingNameSpace.whichElevationActive][i].tileX == tileX) {
                if (hero.housing.draft[housingNameSpace.whichElevationActive][i].tileY == tileY) {
                    foundIndices.push[i];
                    // save this in case only a single item is on this tile:
                    indexToFillOn = hero.housing.draft[housingNameSpace.whichElevationActive][i].type;
                }
            }
        }
        if (foundIndices.length > 1) {
            //find the lowest zdepth tile
            var thisZDepth;
            var lowestZDepthFound = 9999;
            for (i = 0; i < foundIndices.length; i++) {
                thisZDepth = 9999;
                if (hero.housing.draft[housingNameSpace.whichElevationActive][(foundIndices[i])].tileZ) {
                    thisZDepth = hero.housing.draft[housingNameSpace.whichElevationActive][(foundIndices[i])].tileZ;
                }
                if (thisZDepth < lowestZDepthFound) {
                    lowestZDepthFound = thisZDepth;
                    indexToFillOn = foundIndices[i];
                }
            }
        }
        return indexToFillOn;
    },

    floodFillFrom: function(startTileX, startTileY) {
        housingNameSpace.floodFillTilesChecked = [];
        housingNameSpace.floodFillTile(startTileX, startTileY, housingNameSpace.findTileAtLocation(startTileX, startTileY));
    },

    floodFillTile: function(tileX, tileY, typeToReplace) {
        // make sure it's not been checked already:
        if (housingNameSpace.floodFillTilesChecked.indexOf(tileX + "_" + tileY) == -1) {
            housingNameSpace.floodFillTilesChecked.push(tileX + "_" + tileY);
            // make sure it's valid:
            if (tileX >= 0) {
                if (tileX < (hero.housing.southEastCornerTileX - hero.housing.northWestCornerTileX)) {
                    if (tileY >= 0) {
                        if (tileY < (hero.housing.southEastCornerTileY - hero.housing.northWestCornerTileY)) {
                            if (housingNameSpace.findTileAtLocation(tileX, tileY) == typeToReplace) {
                                if (typeToReplace != '') {
                                    // remove tile of this type:
                                    var tilesBeingRemoved = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return ((currentItemObject.tileX == tileX) && (currentItemObject.tileY == tileY) && (currentItemObject.type == typeToReplace));
                                    });
                                    for (var i in tilesBeingRemoved) {
                                        // refund cost:
                                        housingNameSpace.runningCostTotal -= parseInt(document.getElementById("housingTile" + tilesBeingRemoved[i].type).getAttribute('data-price'));
                                    }
                                    housingNameSpace.updateRunningTotal();
                                    // find items at this tile and remove them:
                                    hero.housing.draft[housingNameSpace.whichElevationActive] = hero.housing.draft[housingNameSpace.whichElevationActive].filter(function(currentItemObject) {
                                        return (!((currentItemObject.tileX == tileX) && (currentItemObject.tileY == tileY) && (currentItemObject.type == typeToReplace)));
                                    });
                                }
                                housingNameSpace.addTileToLocation(tileX, tileY);
                                // fill neighbours:
                                housingNameSpace.floodFillTile(tileX + 1, tileY, typeToReplace);
                                housingNameSpace.floodFillTile(tileX - 1, tileY, typeToReplace);
                                housingNameSpace.floodFillTile(tileX, tileY + 1, typeToReplace);
                                housingNameSpace.floodFillTile(tileX, tileY - 1, typeToReplace);
                            }
                        }
                    }
                }
            }
        }
    }
}