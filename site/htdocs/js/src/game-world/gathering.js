function processGathering() {
    UI.gathering.quality -= 0.25;

    UI.gathering.quality = capValues(UI.gathering.quality, 0, 100);
    UI.gathering.purity = capValues(UI.gathering.purity, 0, 100);
    UI.gathering.stability = capValues(UI.gathering.stability, 0, 100);

    // if any of the values are 0:
    if (UI.gathering.quality * UI.gathering.purity * UI.gathering.stability * UI.gathering.quantity == 0) {
        endGathering();
    }

    UI.updateGatheringPanel();
}

function endGathering() {
    isGathering = false;
    if(UI.gathering.stability == 0) {
        // get nothing
    } else {
      //  var generatedObject = currentActiveInventoryItems[UI.gathering.node.type];
        var generatedObject = UI.gathering.node.contains[0];
        console.log("gathered "+UI.gathering.quantity+"x "+currentActiveInventoryItems[generatedObject.type].shortname);
    }
}