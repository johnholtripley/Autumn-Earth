function successfullyTilledEarth(tileX, tileY) {
        var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    var localTileX = getLocalCoordinatesX(tileX);
    var localTileY = getLocalCoordinatesX(tileY);
    if (typeof thisMapData[thisMap].properties[localTileY][localTileX].tilled !== "undefined") {
        if (thisMapData[thisMap].properties[localTileY][localTileX].tilled == 1) {
            // remove anything planted there
            var itemAtLocation = findItemAtTile(tileX, tileY);
            if (itemAtLocation != -1) {
                thisMapData[thisMap].items.splice(itemAtLocation, 1);
            }
        }
        if (thisMapData[thisMap].properties[localTileY][localTileX].tilled == 0) {
            thisMapData[thisMap].properties[localTileY][localTileX].tilled = 1;
        }
        audio.playSound(soundEffects['digging'], 0);
        return true;
    } else {
        return false;
    }
}

function getTileWaterAmount(tileX, tileY) {
    var waterAmount = 0;
      var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    var tileX = getLocalCoordinatesX(tileX);
    var tileY = getLocalCoordinatesX(tileY);
    if (typeof thisMapData[thisMap].properties[tileY][tileX].water !== "undefined") {
        waterAmount = thisMapData[thisMap].properties[tileY][tileX].water.amount;
    }
    return waterAmount;
}

function pourLiquid(tileX, tileY) {
    var holdingItemsSlot = findSlotByHash(hero.holding.hash);
    var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    var tileX = getLocalCoordinatesX(tileX);
    var tileY = getLocalCoordinatesX(tileY);
    console.log(thisMap);
    // check how much liquid in this item's contains:
    if (hero.inventory[holdingItemsSlot].contains[0].quantity > 0) {
        audio.playSound(soundEffects['pouring'], 0);
      
        console.log(thisMapData[thisMap].properties[tileY][tileX]);
        if (typeof thisMapData[thisMap].properties[tileY][tileX].water === "undefined") {
            // create object:
            thisMapData[thisMap].properties[tileY][tileX].water = {};
            thisMapData[thisMap].properties[tileY][tileX].water.amount = 1;
        } else {
            thisMapData[thisMap].properties[tileY][tileX].water.amount++;
            checkWaterRunOff();
        }
        thisMapData[thisMap].properties[tileY][tileX].water.time = hero.totalGameTimePlayed;
        hero.inventory[holdingItemsSlot].contains[0].quantity--;
        updateGauge(holdingItemsSlot);
        UI.updateHeldItemGauge();
         console.log(thisMapData[thisMap].properties[tileY][tileX]);
    } else {
        UI.showNotification("<p>I need to refill this</p>");
    }

}

function checkWaterRunOff() {
    // see if any tiles are saturated and run the water into a neighbouring tile:
    // check elevation so water runs downwards
    // do this recursively
    // do this in a worker?
    // ########
}

function successfullyPlantSeed(tileX, tileY) {
    var wasSuccessful = false;
    if (thisMapData.properties[tileY][tileX].tilled == 1) {
        if (findItemWithinArmsLength() == -1) {
            var whichSlot = findSlotByHash(hero.holding.hash);
            // create object from the seed's actionValue
            var seedObject = JSON.parse(JSON.stringify(currentActiveInventoryItems[hero.inventory[whichSlot].type].actionValue));
            seedObject.tileX = tileX;
            seedObject.tileY = tileY;
            seedObject.timeLastHarvested = hero.totalGameTimePlayed;
            if (currentActiveInventoryItems[hero.inventory[whichSlot].type].dyeable > 0) {
                seedObject.colour = hero.inventory[whichSlot].colour;
            }
            // plant will have seed's attributes:
            seedObject.quality = hero.inventory[whichSlot].quality;
            seedObject.effectiveness = hero.inventory[whichSlot].effectiveness;
            seedObject.durability = hero.inventory[whichSlot].durability;

            thisMapData.items.push(seedObject);
            initialiseItem(thisMapData.items.length - 1);
            // reduce seed quantity in slot:
            reducedHeldQuantity(whichSlot);
            updateQuantity(whichSlot);
            UI.updateHeldItems();
            audio.playSound(soundEffects['gather1'], 0);
            wasSuccessful = true;
        } else {
            wasSuccessful = false;
        }
    } else {
        // needs an explanation maybe? ##
        wasSuccessful = false;
    }
    return wasSuccessful;
}

function checkCrop(itemObject) {
    var plantActedUpon = false;
    // check if scythe equipped ###

    // check if pollen equipped:
    if (hero.holding.type != '') {
        if (currentActiveInventoryItems[(hero.holding.type)].action == "pollen") {
            console.log("pollinate " + itemObject.state + ":4");
            if (itemObject.state == 4) {
                // cross fertilise - check this plant hasn't already got a seed:
                if (typeof itemObject.contains.seed === "undefined") {
                    plantActedUpon = true;
                    var whichSlot = findSlotByHash(hero.holding.hash);
                    // need to find the plant for this pollen (held in actionValue):
                    var pollenSpecies = currentActiveInventoryItems[hero.inventory[whichSlot].type].actionValue;
                    var plantSpecies = itemObject.type;
                    // find resultant plant:
                    var resultantPlantSpecies = plantSpecies;
                    var resultantPlantKey = plantSpecies;
                    if (pollenSpecies != plantSpecies) {
                        console.log(pollenSpecies, plantSpecies);

                        if (pollenSpecies < plantSpecies) {
                            resultantPlantKey = pollenSpecies + '-' + plantSpecies;
                        } else {
                            resultantPlantKey = plantSpecies + '-' + pollenSpecies;
                        }
                        resultantPlantSpecies = hero.plantBreeding[resultantPlantKey];
                    }
                    console.log("result", resultantPlantSpecies);
                    // if the resultant plant can be coloured, mix pollen and parent plant colours:
                    if (currentActiveInventoryItems[resultantPlantSpecies].dyeable > 0) {
                        var pollenColour = hero.inventory[whichSlot].colour;
                        var plantColour = itemObject.colour;
                        var resultantColour;

                        if ((typeof plantColour === "undefined") && (typeof pollenColour === "undefined")) {
                            // default to white:
                            resultantColour = 9;
                        } else {
                            // if either is null, then just use the other:
                            if (typeof plantColour === "undefined") {
                                resultantColour = pollenColour;
                            } else if (typeof pollenColour === "undefined") {
                                resultantColour = plantColour;
                            } else {
                                resultantColour = mixColours([plantColour, pollenColour]);
                            }
                        }


                    }
                    // needs to be the seed type, not the plant type:
                    var seedType = currentActiveInventoryItems[resultantPlantSpecies].actionValue;
                    // need to combine quality etc of the seed and plant:
                    var pollinatedSeedObject = {
                        "type": parseInt(seedType),
                        "colour": resultantColour,
                        "quality": Math.ceil((itemObject.quality + hero.inventory[whichSlot].quality) / 2),
                        "durability": Math.ceil((itemObject.durability + hero.inventory[whichSlot].durability) / 2),
                        "effectiveness": Math.ceil((itemObject.effectiveness + hero.inventory[whichSlot].effectiveness) / 2)
                    }


                    var maxSeeds = 6;
                    // the number of seeds is an exponential amount based on the plant and pollen's quality and effectiveness:
                    pollinatedSeedObject.quantity = Math.ceil(maxSeeds * ((itemObject.quality * hero.inventory[whichSlot].quality / 20000) + (itemObject.effectiveness * hero.inventory[whichSlot].effectiveness / 20000)));

                    pollinatedSeedObject = prepareInventoryObject(pollinatedSeedObject);
                    // add this to the parent plant's contains attribute:
                    itemObject.contains.seed = JSON.parse(JSON.stringify(pollinatedSeedObject));

                    // store the parent types so when harvested, that cross can be added to known crosses:
                    itemObject.contains.seed.crossBreedParents = resultantPlantKey;

                    UI.showNotification("<p>I've successfully pollinated that</p>");
                    // remove the used pollen:
                    reducedHeldQuantity(whichSlot);
                    updateQuantity(whichSlot);
                    UI.updateHeldItems();
                } else {
                    UI.showNotification("<p>I've already pollinated that</p>");
                }
            }
        }
    }

    if (!plantActedUpon) {
        switch (itemObject.state) {
            case 4:
                // gather pollen
                if (typeof itemObject.contains.pollen !== "undefined") {
                    // receive pollen - use plant's quality, durability, effectiveness, and if dyeable, its colour
                    var thisPollenObject = {
                        "type": itemObject.contains.pollen.type,
                        "quantity": itemObject.contains.pollen.quantity,
                        "quality": itemObject.quality,
                        "durability": itemObject.durability,
                        "effectiveness": itemObject.effectiveness
                    };
                    if (currentActiveInventoryItems[itemObject.type].dyeable > 0) {
                        if (typeof itemObject.colour !== "undefined") {
                            thisPollenObject.colour = itemObject.colour;
                        }
                    }
                    thisPollenObject = prepareInventoryObject(thisPollenObject);
                    inventoryCheck = canAddItemToInventory([thisPollenObject]);
                    if (inventoryCheck[0]) {
                        UI.showChangeInInventory(inventoryCheck[1]);
                        delete itemObject.contains.pollen;
                    } else {
                        UI.showNotification("<p>I don't have room in my bags for that</p>");
                    }
                }
                break;
            case 5:
                console.log("gathering seeds/fruit", itemObject.contains.seed, itemObject.contains.fruit);
                // gather any seeds:
                if (typeof itemObject.contains.seed !== "undefined") {
                    inventoryCheck = canAddItemToInventory([itemObject.contains.seed]);
                    if (inventoryCheck[0]) {
                        UI.showChangeInInventory(inventoryCheck[1]);

                        var thisParentKey = itemObject.contains.seed.crossBreedParents;
                        // load in the world graphic for this plant so the hero can plant it straight away:
                        var thisFileColourSuffix = "";




                        var resultingPlantType;
                        if (itemObject.contains.seed.crossBreedParents.toString().indexOf("-") == -1) {
                            resultingPlantType = itemObject.contains.seed.crossBreedParents;
                        } else {
                            resultingPlantType = hero.plantBreeding[thisParentKey];
                        }

                        var thisColourName = getColourName(itemObject.contains.seed.colour, resultingPlantType);
                        if (thisColourName != "") {
                            thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                        }
                        var thisItemIdentifier = "item" + resultingPlantType + thisFileColourSuffix;
                        if (typeof itemImages[thisItemIdentifier] === "undefined") {
                            var fileSource = '/images/game-world/items/' + currentActiveInventoryItems[(resultingPlantType)].worldSrc + thisFileColourSuffix + '.png';
                            Loader.preload([{ name: thisItemIdentifier, src: fileSource }], function() { itemImages[thisItemIdentifier] = Loader.getImage(thisItemIdentifier) }, function() {});
                            // (no progress indicator needed)
                        }
                        // check if it's a new cross breed and add it to the known crosses:
                        if (typeof itemObject.contains.seed.crossBreedParents !== "undefined") {
                            // checking for this twice now - could be tidied up ############## :
                            if (itemObject.contains.seed.crossBreedParents.toString().indexOf("-") != -1) {
                                if (hero.plantCrossesKnown.indexOf(thisParentKey) === -1) {
                                    hero.plantCrossesKnown.push(thisParentKey);
                                    UI.showNotification("<p>I learnt a new cross breed&hellip;</p>");
                                    // update the horticulture panel:
                                    var horticulturePanelSlotsToUpdate = document.getElementsByClassName('parent' + thisParentKey);
                                    // there will only be 2 slots:
                                    horticulturePanelSlotsToUpdate[0].innerHTML = '<img src="/images/game-world/inventory-items/' + resultingPlantType + '.png"><p>' + currentActiveInventoryItems[hero.plantBreeding[thisParentKey]].shortname + '</p>';
                                    horticulturePanelSlotsToUpdate[1].innerHTML = '<img src="/images/game-world/inventory-items/' + resultingPlantType + '.png"><p>' + currentActiveInventoryItems[hero.plantBreeding[thisParentKey]].shortname + '</p>';
                                }
                            }

                        }

                        console.log("harvested seed");
                        itemObject.contains.seed = {};
                    } else {
                        UI.showNotification("<p>I don't have room in my bags for that</p>");
                    }
                }
                // gather fruit ###
                break;
        }
    }
}