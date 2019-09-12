function placePlotPlacement() {
    if (plotPlacement.numberOfBlockedTiles == 0) {
        document.removeEventListener("mousemove", UI.movePlotPlacementOverlay, false);
        document.removeEventListener("click", placePlotPlacement, false);
        activeAction = "";
        // copied from plotPlacementOverlay in draw function:
        var xDiff = cursorPositionX - (canvasWidth / 2);
        var yDiff = cursorPositionY - (canvasHeight / 2);
        var nonIsoCoordX = find2DCoordsX(hero.isox + xDiff, hero.isoy + yDiff);
        var nonIsoCoordY = find2DCoordsY(hero.isox + xDiff, hero.isoy + yDiff);
        // get the top left corner:
        nonIsoCoordX -= (plotPlacement.width / 2) * tileW;
        nonIsoCoordY -= (plotPlacement.length / 2) * tileW;
        // post to server to create files for this character
        getJSON('/game-world/addPlot.php?width=' + plotPlacement.width + '&height=' + plotPlacement.length + '&tileX=' + getTileX(nonIsoCoordX) + '&tileY=' + getTileY(nonIsoCoordY) + '&chr=' + characterId + '&debug=true', function(data) {
            if (data) {
                // remove plot item from inventory:
                removeItemTypeFromInventory(plotPlacement.whichType, 1);
                hero.housing.hasAPlayerHouse = true;
                hero.housing.northWestCornerTileX = getTileX(nonIsoCoordX);
                hero.housing.northWestCornerTileY = getTileY(nonIsoCoordY);
                hero.housing.southEastCornerTileX = getTileX(nonIsoCoordX + (plotPlacement.width * tileW));
                hero.housing.southEastCornerTileY = getTileY(nonIsoCoordY + (plotPlacement.length * tileW));
                // set the empty tile data for the ground floor:
                hero.housing.draft = [];
                hero.housing.draft[0] = [];
                for (var i = 0; i < plotPlacement.length; i++) {
                    hero.housing.draft[0][i] = [];
                    for (var j = 0; j < plotPlacement.width; j++) {
                        hero.housing.draft[0][i].push("*");
                    }
                }


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
    'whichElevationActive': 0,
    'whichDyeColourActive': 0,
    update: function() {
        if (key[12]) {
            // escape - cancel
            // confirm exit, save state or not? ######
            if (gameMode == 'housing') {
                gameMode = "play";
            }
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

                            // place tile:

                            hero.housing.draft[housingNameSpace.whichElevationActive][(clickWorldTileY - hero.housing.northWestCornerTileY)][(clickWorldTileX - hero.housing.northWestCornerTileX)] = housingNameSpace.whichTileActive;




                        }
                    }
                }
            }
        }
    },

    toggleShowPlotFootprint: function(e) {
        if (e.target.checked) {
            hero.housing.showFootprintInEditMode = true;
        } else {
            hero.housing.showFootprintInEditMode = false;
        }

    },

    housingTileColourChange: function(e) {

            housingNameSpace.whichDyeColourActive = housingTileColour.value;
        // change colour of available tiles
        // ########

    },

    selectNewTile: function(e) {
        if (housingNameSpace.whichTileActive != '') {
            document.getElementById('housingTile' + housingNameSpace.whichTileActive).classList.remove('active');
        }
        var whichTile = getNearestParentId(e.target);
        whichTile.classList.add('active');
        housingNameSpace.whichTileActive = whichTile.getAttribute("data-id");
        // load world tile asset if it's not already loaded:
        // check if the wall is being dyed:
        var thisFileColourSuffix = '';
        if (housingNameSpace.whichDyeColourActive != 0) {
            var thisColourName = getColourName(whichItem.colour, housingNameSpace.whichTileActive);
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
        }
        var itemID = "item" + housingNameSpace.whichTileActive + thisFileColourSuffix;
        if (typeof itemImages[itemID] === "undefined") {
            Loader.preload([{ name: itemID, src: '/images/game-world/items/' + whichTile.getAttribute("data-cleanurl") + '.png' }], function() { itemImages[itemID] = Loader.getImage(itemID); }, function() {});
        }
    }
}