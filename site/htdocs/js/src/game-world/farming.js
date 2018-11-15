function successfullyTilledEarth(tileX, tileY) {
    if (typeof thisMapData.properties[tileY][tileX].tilled !== "undefined") {
        if (thisMapData.properties[tileY][tileX].tilled == 1) {
            // remove anything planted there
            var itemAtLocation = findItemAtTile(tileX, tileY);
            if (itemAtLocation != -1) {
                thisMapData.items.splice(itemAtLocation, 1);
            }
        }
        if (thisMapData.properties[tileY][tileX].tilled == 0) {
            thisMapData.properties[tileY][tileX].tilled = 1;
        }
        audio.playSound(soundEffects['digging'], 0);
        return true;
    } else {
        return false;
    }
}

function pourLiquid(tileX, tileY) {
    var holdingItemsSlot = findSlotByHash(hero.holding.hash);
    // check how much liquid in this item's contains:
    if (hero.inventory[holdingItemsSlot].contains[0].quantity > 0) {
        audio.playSound(soundEffects['pouring'], 0);
        if (typeof thisMapData.properties[tileY][tileX].water === "undefined") {
            // create object:
            thisMapData.properties[tileY][tileX].water = {};
            thisMapData.properties[tileY][tileX].water.amount = 1;
        } else {
            thisMapData.properties[tileY][tileX].water.amount++;
            checkWaterRunOff();
        }
        thisMapData.properties[tileY][tileX].water.time = hero.totalGameTimePlayed;
        hero.inventory[holdingItemsSlot].contains[0].quantity--;
        updateGauge(holdingItemsSlot);
        UI.updateHeldItemGauge();
    } else {
        UI.showNotification("<p>that's empty</p>");
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
            if (itemObject.state == 4) {
                // cross fertilise:

                plantActedUpon = true;

                var whichSlot = findSlotByHash(hero.holding.hash);
                // find resultant plant:
                var pollenSpecies = hero.inventory[whichSlot].type;
                var plantSpecies = itemObject.type;

                var resultantPlantSpecies = plantSpecies;

                if (pollenSpecies != plantSpecies) {
                    console.log(pollenSpecies, plantSpecies);
                    var resultantPlantKey;
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
                            resultantColour = mixColours(plantColour, pollenColour);
                        }
                    }



                    console.log(pollenColour, plantColour, resultantColour);
                }





                // remove the used pollen:
                reducedHeldQuantity(whichSlot);
                updateQuantity(whichSlot);
                UI.updateHeldItems();

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
            
                        if(typeof itemObject.colour !== "undefined") {
                        thisPollenObject.colour = itemObject.colour;
                    } 
                }




                    thisPollenObject = prepareInventoryObject(thisPollenObject);


                    inventoryCheck = canAddItemToInventory([thisPollenObject]);
                    if (inventoryCheck[0]) {
                        UI.showChangeInInventory(inventoryCheck[1]);
                        delete itemObject.contains.pollen;
                    } else {
                        UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                    }



                }
                break;
            case 5:
                console.log(itemObject.contains.seeds);
                console.log(itemObject.contains.fruit);
                // gather seeds
                // gather fruit
                // ###
                break;
        }
    }
}