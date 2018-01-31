function checkForRespawns() {
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (currentActiveInventoryItems[thisMapData.items[i].type].action == "node") {
            if (thisMapData.items[i].state != "active") {
                //console.log("check re-spawn: " + hero.totalGameTimePlayed + "-" + thisMapData.items[i].timeLastHarvested + " (" + (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested) + ") >= " + currentActiveInventoryItems[thisMapData.items[i].type].respawnRate);
                if (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData.items[i].type].respawnRate) {
                    thisMapData.items[i].state = "active";
                }
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
        UI.showNotification('<p>Resource failed - nothing was gathered</p>');
        gatheringPanel.classList.remove('active');
    } else {
        var generatedObject = gathering.node.contains[0];
        var quantityOfItem = Math.floor((gathering.purity / 100) * (gathering.node.maxQuantity - gathering.quantity));
        // console.log("gathered " + quantityOfItem + "x " + currentActiveInventoryItems[generatedObject.type].shortname + " of " + gathering.quality + " quality");
        var createdMarkup = '<ol><li>';
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
        createdMarkup += generateGenericSlotMarkup(activeGatheredObject);
        createdMarkup += '</li></ol>';
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
        // loop through hidden resources (of this type) and remove it:
        for (var i = 0; i < thisMapData.hiddenResources[(currentActiveInventoryItems[gathering.node.type].category)].length; i++) {
            if (thisMapData.hiddenResources[(currentActiveInventoryItems[gathering.node.type].category)][i] === gathering.node) {
                thisMapData.hiddenResources[(currentActiveInventoryItems[gathering.node.type].category)].splice(i, 1);
                break;
            }
        }
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