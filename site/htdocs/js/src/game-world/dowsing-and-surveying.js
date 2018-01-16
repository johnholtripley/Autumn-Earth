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
        }
    }
}

function processSurveying() {
    var thisDistance, thisResource;
    if (thisMapData.hiddenResources[surveying.category]) {
        for (var i = 0; i < thisMapData.hiddenResources[surveying.category].length; i++) {
            thisResource = thisMapData.hiddenResources[surveying.category][i];
            thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisResource.tileX, thisResource.tileY);
            if (thisDistance < 2) {
                // found resource ####
                console.log("found it! Type: "+thisResource.type);

                // need to determine type, and contains - hiddenResources should have this
                // render node to screen
                // remove the node once gathered

                activeAction = "";
                surveying = {};
                break;
            }
        }
    }
}