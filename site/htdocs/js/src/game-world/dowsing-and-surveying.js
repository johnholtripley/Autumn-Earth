function processDowsing() {
    var closestDistance = Infinity;
    var thisDistance = -1;
    for (var m = 0; m < visibleMaps.length; m++) {
        whichVisibleMap = visibleMaps[m];
        if (thisMapData[whichVisibleMap].hiddenResources[dowsing.category]) {
            // find the nearest node - of the correct type and react to that:
            for (var i = 0; i < thisMapData[whichVisibleMap].hiddenResources[dowsing.category].length; i++) {
                thisDistance = getPythagorasDistance(hero.tileX, hero.tileY, thisMapData[whichVisibleMap].hiddenResources[dowsing.category][i].tileX, thisMapData[whichVisibleMap].hiddenResources[dowsing.category][i].tileY);
                if (thisDistance < closestDistance) {
                    closestDistance = thisDistance;

                }
            }

        }
    }
    if (thisDistance != -1) {
        dowsing.proximity = 100 - (100 * ((closestDistance) / dowsing.range));
        dowsing.proximity = capValues(dowsing.proximity, 0, 100);
    } else {
        dowsing.proximity = 0;
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
    for (var m = 0; m < visibleMaps.length; m++) {
        whichVisibleMap = visibleMaps[m];
        if (thisMapData[whichVisibleMap].hiddenResources[surveying.category]) {
            for (var i = 0; i < thisMapData[whichVisibleMap].hiddenResources[surveying.category].length; i++) {
                thisResource = thisMapData[whichVisibleMap].hiddenResources[surveying.category][i];
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
                        thisMapData[whichVisibleMap].items.push(thisResource);
                        initialiseItem(thisMapData[whichVisibleMap].items[thisMapData[whichVisibleMap].items.length - 1]);
                        resourceFound = true;
                        // remove it from the list now the node has been generated:

                        thisMapData[whichVisibleMap].hiddenResources[surveying.category].splice(i, 1);
                    } else {
                        console.log("Error - Couldn't place resource node");
                    }
                    break;
                }
            }
        }
    }
    if (!resourceFound) {
        UI.showNotification("<p>I couldn't find any resources</p>");
    }
    surveyingStopped();
}

function surveyingStopped() {
    activeAction = "";
    surveying = {};
    surveyingPanel.classList.remove('active');
}