function checkForRespawns() {
    for(var map in thisMapData) {
    for (var i = 0; i < thisMapData[map].items.length; i++) {
        switch (currentActiveInventoryItems[thisMapData[map].items[i].type].action) {
            case "node":
                if (thisMapData[map].items[i].state != "active") {
                    //console.log("check re-spawn: " + hero.totalGameTimePlayed + "-" + thisMapData[map].items[i].timeLastHarvested + " (" + (hero.totalGameTimePlayed - thisMapData[map].items[i].timeLastHarvested) + ") >= " + currentActiveInventoryItems[thisMapData[map].items[i].type].respawnRate);
                    if (hero.totalGameTimePlayed - thisMapData[map].items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData[map].items[i].type].respawnRate) {
                        thisMapData[map].items[i].state = "active";
                    }
                }
                break;
            case "crop":

                if (parseInt(thisMapData[map].items[i].state) < 5) {
                    // check water level:
                    var thisPlantPreferredWaterAmount = 0;
                    if (typeof thisMapData[map].items[i].additional !== "undefined") {
                        thisPlantPreferredWaterAmount = thisMapData[map].items[i].additional;
                    }
                    var waterDifference = Math.abs(getTileWaterAmount(thisMapData[map].items[i].tileX, thisMapData[map].items[i].tileY) - thisPlantPreferredWaterAmount);
                    if (hero.totalGameTimePlayed - thisMapData[map].items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData[map].items[i].type].respawnRate) {
                        // deteriorate the plant if not at its optimum water level:
                        thisMapData[map].items[i].quality -= 4 * waterDifference;
                        thisMapData[map].items[i].effectiveness -= 4 * waterDifference;
                        thisMapData[map].items[i].durability -= 4 * waterDifference;
                        thisMapData[map].items[i].quality = capValues(thisMapData[map].items[i].quality, 1, 100);
                        thisMapData[map].items[i].effectiveness = capValues(thisMapData[map].items[i].effectiveness, 1, 100);
                        thisMapData[map].items[i].durability = capValues(thisMapData[map].items[i].durability, 1, 100);
                        thisMapData[map].items[i].state++;
                        thisMapData[map].items[i].timeLastHarvested = hero.totalGameTimePlayed;
                    }
                } else {
                    // check if pollinated and self-pollinate if not:

                    if (typeof thisMapData[map].items[i].contains.seed === "undefined") {
                       

                        var seedType = currentActiveInventoryItems[(thisMapData[map].items[i].type)].actionValue;
                        // not as efficient than if pollinated manually:
                        var pollinatedSeedObject = {
                            "type": parseInt(seedType),
                            "quality": Math.ceil(thisMapData[map].items[i].quality * 0.8),
                            "durability": Math.ceil(thisMapData[map].items[i].durability * 0.8),
                            "effectiveness": Math.ceil(thisMapData[map].items[i].effectiveness * 0.8)
                        }
                      
                        if (typeof thisMapData[map].items[i].colour !== "undefined") {
                            pollinatedSeedObject.colour = thisMapData[map].items[i].colour;
                        }

                        var maxSeeds = 6;
                        // the number of seeds is an exponential amount based on the plant's quality and effectiveness:
                        pollinatedSeedObject.quantity = Math.ceil(maxSeeds * ((thisMapData[map].items[i].quality * thisMapData[map].items[i].quality / 20000) + (thisMapData[map].items[i].effectiveness * thisMapData[map].items[i].effectiveness / 20000)));

                   

                        pollinatedSeedObject = prepareInventoryObject(pollinatedSeedObject);
                        // add this to the parent plant's contains attribute:
                        thisMapData[map].items[i].contains.seed = JSON.parse(JSON.stringify(pollinatedSeedObject));
                        thisMapData[map].items[i].contains.seed.crossBreedParents = thisMapData[map].items[i].type;

                    }
                }
                break;
        }
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
        UI.showNotification("<p>I couldn't gather anything from that</p>");
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
        for (var i = 0; i < thisMapData[gathering.itemMap].items.length; i++) {
            if (thisMapData[gathering.itemMap].items[i] === gathering.node) {
                thisMapData[gathering.itemMap].items.splice(i, 1);
                break;
            }
        }
    }
    gathering = {};
}