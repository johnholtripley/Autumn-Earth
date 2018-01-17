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
    surveying.timeRemaining -= surveying.depletionSpeed;
    if (surveying.timeRemaining <= 0) {
        activeAction = "";
        surveyingComplete();
    }
    UI.updateSurveyingPanel();
}

function surveyingComplete() {
    var thisDistance, thisResource, sourceTileX, sourceTileY, tryFacing, facingsRemaining;
    var resourceFound = false;
    if (thisMapData.hiddenResources[surveying.category]) {
        for (var i = 0; i < thisMapData.hiddenResources[surveying.category].length; i++) {
            thisResource = thisMapData.hiddenResources[surveying.category][i];
            thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisResource.tileX, thisResource.tileY);
            if (thisDistance < 2) {
                tryFacing = hero.facing;
                switch (tryFacing) {
                    case 'n':
                        facingsRemaining = ['e', 'w', 's'];
                        break;
                    case 'e':
                        facingsRemaining = ['n', 's', 'w'];
                        break;
                    case 's':
                        facingsRemaining = ['n', 's', 'e'];
                        break;
                    case 'w':
                        facingsRemaining = ['e', 'w', 'n'];
                        break;
                }
                do {
                    sourceTileX = hero.tileX + relativeFacing[tryFacing]["x"];
                    sourceTileY = hero.tileY + relativeFacing[tryFacing]["y"];
                    tryFacing = facingsRemaining.shift();
                } while (!tileIsClear(sourceTileX, sourceTileY) && (facingsRemaining.length > 0));
                if (facingsRemaining.length > 0) {
                    thisResource.tileX = sourceTileX;
                    thisResource.tileY = sourceTileY;
                    thisResource.isTemporary = true;
                    thisMapData.items.push(thisResource);
                    initialiseItem(thisMapData.items.length - 1);
                    resourceFound = true;
                } else {
                    console.log("Error - Couldn't place resource node");
                }
                break;
            }
        }
    }
    if (!resourceFound) {
        UI.showNotification('<p>No resources found</p>');
    }
    surveyingStopped();
}

function surveyingStopped() {
    activeAction = "";
    surveying = {};
    surveyingPanel.classList.remove('active');
}