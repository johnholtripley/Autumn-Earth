function checkForRespawns() {
    for (var i = 0; i < thisMapData.items.length; i++) {
        if (currentActiveInventoryItems[thisMapData.items[i].type].action == "node") {
            if (thisMapData.items[i].state != "active") {
                console.log("check re-spawn: " + hero.totalGameTimePlayed + "-" + thisMapData.items[i].timeLastHarvested + " (" + (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested) + ") >= " + currentActiveInventoryItems[thisMapData.items[i].type].respawnRate);

                if (hero.totalGameTimePlayed - thisMapData.items[i].timeLastHarvested >= currentActiveInventoryItems[thisMapData.items[i].type].respawnRate) {
                    thisMapData.items[i].state = "active";
                }
            }
        }
    }
}


function processGathering() {
    UI.gathering.quality -= 0.25;



    UI.gathering.quality = capValues(UI.gathering.quality, 0, 100);
    UI.gathering.purity = capValues(UI.gathering.purity, 0, 100);
    UI.gathering.stability = capValues(UI.gathering.stability, 0, 100);

    // if any of the values are 0:
    if (UI.gathering.quality * UI.gathering.purity * UI.gathering.stability * UI.gathering.quantity == 0) {
        gatheringComplete();
    }

    UI.updateGatheringPanel();
}

function gatheringComplete() {
    if (UI.gathering.stability == 0) {
        // get nothing
    } else {
        //  var generatedObject = currentActiveInventoryItems[UI.gathering.node.type];
        var generatedObject = UI.gathering.node.contains[0];
        console.log("gathered " + UI.gathering.quantity + "x " + currentActiveInventoryItems[generatedObject.type].shortname);
    }
    gatheringStopped();
}

function gatheringStopped() {
    isGathering = false;
    // save any changes to the node (even if gathering was aborted by closing the panel):
    UI.gathering.node.stability = UI.gathering.stability;
    UI.gathering.node.quantity = UI.gathering.quantity;
    if ((UI.gathering.node.quantity == 0) || (UI.gathering.node.stability == 0)) {
        // reset the node, and its respawn timer:
        UI.gathering.node.timeLastHarvested = hero.totalGameTimePlayed;
        UI.gathering.node.state = "inactive";
        // reset quantity and stability
        UI.gathering.node.stability = UI.gathering.node.maxStability;
        UI.gathering.node.quantity = UI.gathering.node.maxQuantity;
    }
}