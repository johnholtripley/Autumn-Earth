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
                hero.housing.showFootprintInEditMode = true;
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
    'mousePosition': [],

    update: function() {
        if (key[12]) {
            // escape - cancel active tile
            document.getElementById('housingTile' + housingNameSpace.whichTileActive).classList.remove('active');
            housingNameSpace.whichTileActive = '';
            housingNameSpace.whichWorldTileActive = '';
            key[12] = false;
        }
        if (key[7]) {
            UI.toggleUI();
            key[7] = false;
        }
    },

    worldClickHandler: function(e) {
        if (housingNameSpace.whichTileActive != '') {
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
                            var newWallTile = {
                                "type": housingNameSpace.whichTileActive,
                                "tileX": (clickWorldTileX - hero.housing.northWestCornerTileX),
                                "tileY": (clickWorldTileY - hero.housing.northWestCornerTileY),
                                "lockedToPlayerId": characterId
                            }
                            
                            if (housingNameSpace.whichDyeColourActive != 0) {
                                newWallTile.colour = parseInt(housingNameSpace.whichDyeColourActive);
                            }
                          
                            // place tile:
                            hero.housing.draft[housingNameSpace.whichElevationActive].push(newWallTile);
                        
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
            hero.housing.showFootprintInEditMode = true;
        } else {
            hero.housing.showFootprintInEditMode = false;
        }

    },

    housingTileColourChange: function(e) {
        if (housingNameSpace.whichDyeColourActive != housingTileColour.value) {
            housingNameSpace.whichDyeColourActive = housingTileColour.value;
            housingNameSpace.loadNewTile();
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

        housingNameSpace.whichWorldTileActive = whichTile.getAttribute("data-cleanurl");

        housingNameSpace.whichTileActive = whichTile.getAttribute("data-id");
        housingNameSpace.loadNewTile();
    },

    loadNewTile: function() {
        // load world tile asset if it's not already loaded:
        // check if the wall is being dyed:
        var thisFileColourSuffix = '';
        if (housingNameSpace.whichDyeColourActive != 0) {
            // bypass hasInherent colour checks as won't be in inventory items

            var thisColourName = colourNames[housingNameSpace.whichDyeColourActive];
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
        }

        var itemID = "item" + housingNameSpace.whichTileActive + thisFileColourSuffix;

        if (typeof itemImages[itemID] === "undefined") {
            Loader.preload([{ name: itemID, src: '/images/game-world/items/' + housingNameSpace.whichWorldTileActive + thisFileColourSuffix + '.png' }], function() { itemImages[itemID] = Loader.getImage(itemID); }, function() {});
        }
    },

    commitDesign: function() {
        // check money and confirm
        // save json to file system - send hero.housing.draft to savePlot.php (that needs splitting to elevation files)

console.log(hero.housing.draft);
console.log(JSON.stringify(hero.housing.draft));
 getJSONWithParams("/game-world/savePlot.php", 'chr='+characterId+'&postData=' + JSON.stringify(hero.housing.draft)+'&northWestCornerTileX='+hero.housing.northWestCornerTileX+'&northWestCornerTileY='+hero.housing.northWestCornerTileY, function(data) {
        if (data.success) {
            console.log("user post sent");
        } else {
        
            // try again? ########
        }
    }, function(status) {
         // try again? ########
    });



        // check no pet, hero, NPC etc in the way - move if so
        // add data to local mapData
        UI.closeHousingConstructionPanel();

    }
}