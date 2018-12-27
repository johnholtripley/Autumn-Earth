function checkForRespawns() {
    for (var i = 0; i < thisMapData.items.length; i++) {
        switch (currentActiveInventoryItems[thisMapData.items[i].type].action) {
            case "node":
                if (thisMapData.items[i].state != "active") {
                    //console.log("check re-spawn: " + hero.totalGameTimePlayed + "-" + thisMapData.items[i].timeLastHarvested + " (" + (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested) + ") >= " + currentActiveInventoryItems[thisMapData.items[i].type].respawnRate);
                    if (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData.items[i].type].respawnRate) {
                        thisMapData.items[i].state = "active";
                    }
                }
                break;
            case "crop":

                if (parseInt(thisMapData.items[i].state) < 5) {
                    // check water level:
                    var thisPlantPreferredWaterAmount = 0;
                    if (typeof thisMapData.items[i].additional !== "undefined") {
                        thisPlantPreferredWaterAmount = thisMapData.items[i].additional;
                    }
                    var waterDifference = Math.abs(getTileWaterAmount(thisMapData.items[i].tileX, thisMapData.items[i].tileY) - thisPlantPreferredWaterAmount);
                    if (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData.items[i].type].respawnRate) {
                        // deteriorate the plant if not at its optimum water level:
                        thisMapData.items[i].quality -= 4 * waterDifference;
                        thisMapData.items[i].effectiveness -= 4 * waterDifference;
                        thisMapData.items[i].durability -= 4 * waterDifference;
                        thisMapData.items[i].quality = capValues(thisMapData.items[i].quality, 1, 100);
                        thisMapData.items[i].effectiveness = capValues(thisMapData.items[i].effectiveness, 1, 100);
                        thisMapData.items[i].durability = capValues(thisMapData.items[i].durability, 1, 100);
                        thisMapData.items[i].state++;
                        thisMapData.items[i].timeLastHarvested = hero.totalGameTimePlayed;
                    }
                } else {
                    // check if pollinated and self-pollinate if not:

                    if (typeof thisMapData.items[i].contains.seed === "undefined") {
                       

                        var seedType = currentActiveInventoryItems[(thisMapData.items[i].type)].actionValue;
                        // not as efficient than if pollinated manually:
                        var pollinatedSeedObject = {
                            "type": parseInt(seedType),
                            "quality": Math.ceil(thisMapData.items[i].quality * 0.8),
                            "durability": Math.ceil(thisMapData.items[i].durability * 0.8),
                            "effectiveness": Math.ceil(thisMapData.items[i].effectiveness * 0.8)
                        }
                      
                        if (typeof thisMapData.items[i].colour !== "undefined") {
                            pollinatedSeedObject.colour = thisMapData.items[i].colour;
                        }

                        var maxSeeds = 6;
                        // the number of seeds is an exponential amount based on the plant's quality and effectiveness:
                        pollinatedSeedObject.quantity = Math.ceil(maxSeeds * ((thisMapData.items[i].quality * thisMapData.items[i].quality / 20000) + (thisMapData.items[i].effectiveness * thisMapData.items[i].effectiveness / 20000)));

                   

                        pollinatedSeedObject = prepareInventoryObject(pollinatedSeedObject);
                        // add this to the parent plant's contains attribute:
                        thisMapData.items[i].contains.seed = JSON.parse(JSON.stringify(pollinatedSeedObject));
                        thisMapData.items[i].contains.seed.crossBreedParents = thisMapData.items[i].type;

                    }
                }
                break;
        }
    }
}


function processGathering() {
    // tool and action need to govern the rate of extraction
    gathering.quantity -= gathering.depletionSpeed;
    gathering.stability -= gathering.stabilitySpeed;

    gathering.quality = capValues(gathering.quality, 0, 100);
    gathering.purity = capValues(gathering.purity, 0, 100);
    gathering.stability = capValues(gathering.stability, 0, 100);
    gathering.quantity = capValues(gathering.quantity, 0, 100);

    // if any of the values are 0:
    if (gathering.quality * gathering.purity * gathering.stability * gathering.quantity == 0) {
        gatheringComplete();
    }
    UI.updateGatheringPanel();
}

function gatheringComplete() {
    if (gathering.stability == 0) {
        UI.showNotification('<p>Resource failed - nothing was gathered</p>');
        gatheringPanel.classList.remove('active');
    } else {
        var generatedObject = gathering.node.contains[0];
        var quantityOfItem = Math.floor((gathering.purity / 100) * (gathering.node.maxQuantity - gathering.quantity));
        // console.log("gathered " + quantityOfItem + "x " + currentActiveInventoryItems[generatedObject.type].shortname + " of " + gathering.quality + " quality");
        var createdMarkup = 'Yielded: <ol><li>';
        // used in case the type or colour have any random choices:
        var possibleGatheredTypes = generatedObject.type.toString().split("/");
        var possibleGatheredColours = generatedObject.colour.toString().split("/");
        activeGatheredObject = {
            "type": parseInt(getRandomElementFromArray(possibleGatheredTypes)),
            "quantity": quantityOfItem,
            "quality": gathering.quality,
            "durability": 100,
            "currentWear": 0,
            "effectiveness": 100,
            "colour": parseInt(getRandomElementFromArray(possibleGatheredColours)),
            "enchanted": 0,
            "hallmark": 0,
            "inscription": ""
        }
        createdMarkup += '<div>';
        createdMarkup += generateCraftingSlotMarkup(activeGatheredObject);
        createdMarkup += '</div></li></ol>';
        gatheringOutputSlot.innerHTML = createdMarkup;
    }
    gatheringStopped();
}

function gatheringStopped() {
    activeAction = "";
    // save any changes to the node (even if gathering was aborted by closing the panel):
    gathering.node.stability = gathering.stability;
    gathering.node.quantity = gathering.quantity;
    if ((gathering.node.quantity == 0) || (gathering.node.stability == 0)) {
        // reset the node, and its respawn timer:
        gathering.node.stability = gathering.node.maxStability;
        gathering.node.timeLastHarvested = hero.totalGameTimePlayed;
        gathering.node.state = "inactive";
    }
    if (gathering.node.isTemporary) {
        // loop through items and remove it:
        for (var i = 0; i < thisMapData.items.length; i++) {
            if (thisMapData.items[i] === gathering.node) {
                thisMapData.items.splice(i, 1);
                break;
            }
        }
    }
    gathering = {};
}