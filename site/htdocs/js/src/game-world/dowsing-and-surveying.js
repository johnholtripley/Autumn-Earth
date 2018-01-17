function processDowsing() {
    if (thisMapData.hiddenResources[dowsing.category]) {
        var closestDistance = Infinity;
        var thisDistance;
        var whichIndex = -1;
        // find the nearest node - of the correct type and react to that:
        for (var i = 0; i < thisMapData.hiddenResources[dowsing.category].length; i++) {
            thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisMapData.hiddenResources[dowsing.category][i].tileX, thisMapData.hiddenResources[dowsing.category][i].tileY);
            if (thisDistance < closestDistance) {
                closestDistance = thisDistance;
                whichIndex = i;
            }
        }
        if (whichIndex != -1) {
            dowsing.proximity = 100 - (100 * ((closestDistance) / dowsing.range));
            dowsing.proximity = capValues(dowsing.proximity, 0, 100);
        } else {
            dowsing.proximity = 0;
        }
    }
}

function processSurveying() {
    var thisDistance, thisResource, sourceTileX, sourceTileY;
    if (thisMapData.hiddenResources[surveying.category]) {
        for (var i = 0; i < thisMapData.hiddenResources[surveying.category].length; i++) {
            thisResource = thisMapData.hiddenResources[surveying.category][i];
            thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisResource.tileX, thisResource.tileY);
            if (thisDistance < 2) {
                sourceTileX = hero.tileX + relativeFacing[hero.facing]["x"];
                sourceTileY = hero.tileY + relativeFacing[hero.facing]["y"];
                // make sure this is clear ###########
                thisResource.tileX = sourceTileX;
                thisResource.tileY = sourceTileY;
                thisResource.isTemporary = true;
                thisMapData.items.push(thisResource);
                initialiseItem(thisMapData.items.length - 1);
                activeAction = "";
                surveying = {};
                break;
            }
        }
    }
}