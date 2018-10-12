function tillEarth(tileX, tileY) {
    if (typeof thisMapData.properties[tileY][tileX].tilled !== "undefined") {
        if (thisMapData.properties[tileY][tileX].tilled == 1) {
            // remove anything planted there ##
            // play sound ##
        }
        if (thisMapData.properties[tileY][tileX].tilled == 0) {
            thisMapData.properties[tileY][tileX].tilled = 1;
            // play sound ##
        }
    }

}

function pourLiquid(tileX, tileY) {
    // check how much liquid in this item's contains ####
    if (typeof thisMapData.properties[tileY][tileX].water === "undefined") {
        // create object:
        thisMapData.properties[tileY][tileX].water = {};
            thisMapData.properties[tileY][tileX].water.amount = 1;
            thisMapData.properties[tileY][tileX].water.time = hero.totalGameTimePlayed;
        
    } else {
        thisMapData.properties[tileY][tileX].water.amount++;
        checkWaterRunOff();
    }

}

function checkWaterRunOff() {
    // see if any tiles are saturated and run the water into a neighbouring tile:
    // ########
}