function tillEarth(tileX, tileY) {
    if (typeof thisMapData.properties[tileY][tileX].tilled !== "undefined") {
        if (thisMapData.properties[tileY][tileX].tilled == 1) {
            // remove anything planted there #####
        }
        if (thisMapData.properties[tileY][tileX].tilled == 0) {
            thisMapData.properties[tileY][tileX].tilled = 1;
        }
        audio.playSound(soundEffects['digging'], 0);
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