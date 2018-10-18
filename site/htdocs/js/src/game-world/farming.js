function successfullyTilledEarth(tileX, tileY) {
    if (typeof thisMapData.properties[tileY][tileX].tilled !== "undefined") {
        if (thisMapData.properties[tileY][tileX].tilled == 1) {
            // remove anything planted there #####
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
    if (thisMapData.properties[tileY][tileX].tilled == 1) {
        console.log("plant seed");
        // reduce seed quantity in slot ###
        audio.playSound(soundEffects['gather1'], 0);
        return true;
    } else {
        // needs an explanation maybe? ##
        return false;
    }
}

function checkCrop(itemObject) {

    // check if scythe equipped ###
    switch (itemObject.state) {
        case 4:
            // gather pollen
            
            if(typeof itemObject.contains.pollen !== "undefined") {
            // receive pollen - use plant's quality, durability, effectiveness, and if dyeable, its colour

var thisPollenObject = {
    "type": itemObject.contains.pollen.type,
    "quantity": itemObject.contains.pollen.quantity,
    "quality": itemObject.quality,
    "durability": itemObject.durability,
    "effectiveness": itemObject.effectiveness
};
 if (currentActiveInventoryItems[itemObject.type].dyeable > 0) {
thisPollenObject.colour = itemObject.colour;
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