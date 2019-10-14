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



var housingNameSpace = {
    'whichTileActive': '',
    'whichWorldTileActive': '',
    'whichElevationActive': 0,
    'whichDyeColourActive': 0,
    'runningCostTotal': 0,
    'costForActiveTile': 0,
    'activeTool': 'paint',
    'mousePosition': [],
    'draftHousingTilesToLoad': [],
    'whichItemIdsLoading': [],

    init: function() {
        // load in any graphics used in the draft but not already loaded into memory:
        // ####### 


        if (hero.housing.hasAPlayerHouse) {
            if (hero.housing.draft) {
                var whichColour, whichWorldTile, thisFileColourSuffix, thisColourName;
                for (var i = 0; i < hero.housing.draft.length; i++) {
                    for (var j = 0; j < hero.housing.draft[i].length; j++) {
                        whichColour = 0;
                        if (typeof hero.housing.draft[i][j].colour !== "undefined") {
                            whichColour = hero.housing.draft[i][j].colour;
                        }
                        //whichWorldTile = item src #################
                        // whichTile.getAttribute("data-cleanurl")
                        whichWorldTile = document.querySelector('#housingTileSelection li[data-id="' + hero.housing.draft[i][j].type + '"]').getAttribute('data-cleanurl');
                        //console.log(whichWorldTile);

                        //   housingNameSpace.loadNewTile(hero.housing.draft[i][j].type, whichWorldTile, whichColour);
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
                        switch (housingNameSpace.activeTool) {
                            case 'paint':
                                if (housingNameSpace.whichTileActive != '') {
                                    var newWallTile = {
                                        "type": parseInt(housingNameSpace.whichTileActive),
                                        "tileX": (clickWorldTileX - hero.housing.northWestCornerTileX),
                                        "tileY": (clickWorldTileY - hero.housing.northWestCornerTileY),
                                        "lockedToPlayerId": characterId
                                    }
                                    if (housingNameSpace.whichDyeColourActive != 0) {
                                        newWallTile.colour = parseInt(housingNameSpace.whichDyeColourActive);
                                    }
                                    // place tile:
                                    hero.housing.draft[housingNameSpace.whichElevationActive].push(newWallTile);
                                    housingNameSpace.runningCostTotal += housingNameSpace.costForActiveTile;
                                    housingNameSpace.updateRunningTotal();
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
                                break
                        }
                    }
                }
            }
        }
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
                colourSuffix = '-' + colourNames[housingNameSpace.whichDyeColourActive];
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

        // check money and confirm #####
        // john

        if (housingNameSpace.runningCostTotal > hero.currency.money) {



            UI.showYesNoDialogueBox("Not enough money&hellip;", "Save design", "Cancel design", "housingNameSpace.saveDraftDesign", "housingNameSpace.abandonLatestChanges");

        } else {
            var titleText;
            if (housingNameSpace.runningCostTotal < 0) {
                titleText = "Commit this design and be refunded " + parseMoney((0 - housingNameSpace.runningCostTotal)) + "?";
            } else {
                titleText = "Commit this design at a cost of " + parseMoney(housingNameSpace.runningCostTotal) + "?";
            }
            //  housingHasEnoughMoney.firstElementChild.innerHTML = titleText;
            //  housingHasEnoughMoney.classList.add('active');

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

    }
}