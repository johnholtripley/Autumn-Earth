// find Iso coords from 2d coords:
function findIsoCoordsX(x, y) {
    // return Math.floor((mapTilesY * tileW/2) -y/2 + x/2);
    return Math.floor((mapTilesY * tileW - y + x) / 2);
}

function findIsoCoordsY(x, y) {
    // the -tileH/2 is because the tile centre was at 0,0, and so the tip would be off the top of the screen
    //return Math.floor((x/4) + (y/4) - tileH/2);
    return Math.floor((x + y - (tileH * 2)) / 4);
}



// find 2d coords from iso coords:
function find2DCoordsX(isoX, isoY) {
    return isoX + tileH + (2 * isoY) - (mapTilesY * tileW) / 2;
}

function find2DCoordsY(isoX, isoY) {
    return 2 * isoY + tileH - isoX + (mapTilesY * tileW) / 2;
}

function findIsoDepth(x, y, z) {
    // isoZ = 0.6 * z


    /*
    // METHOD #1 ------------------
    // works perfectly for non-z depths:
    return findIsoCoordsY(x,y);
    // ----------------------------
    */


    /*
    // METHOD #2 ------------------
    // works well with z apart from clipped around the edges of tiles
    var tilePosition = getCurrentTileX(x) + (mapTilesX * getCurrentTileY(y));
    // weight the tile heavily to allow vertical depth within that range
    var adjustedTile = (tilePosition) * 999;
    // find position across tile
    var positionWithinTileX = x%tileW;
    var positionWithinTileY = y%tileH;
    // adjust by using iso position across the tile - weighting z depth more heavily:
    return adjustedTile+findIsoCoordsX(positionWithinTileX,positionWithinTileY)+findIsoCoordsY(positionWithinTileX,positionWithinTileY)+(z*z);
    // ----------------------------
    */

    /*
    // METHOD #3 ------------------
    // works well except for the back half of raised tiles
    var depth = findIsoCoordsY(x,(y+z));
    depth += findIsoCoordsY(x,y);
    //depth *= tileH/2;
     //   depth += z;
    if(z>0) {
    // just do this if it's in the top half of the tile:
    // ###########
       // depth += tileH/2;
    }
    return depth;
    // ----------------------------
    */


    // METHOD #4 ------------------
    // works well, apart from back half of the tile
    return (findIsoCoordsY(x, y) * tileW / 2) + (z * 2);
    // ----------------------------



}


// find non-iso coords for a tile
function getTileCentreCoordX(tileX) {
    return tileX * tileW + tileW / 2;
}

function getTileCentreCoordY(tileY) {
    return tileY * tileW + tileW / 2;
}


// find iso coords for a tile
function getTileIsoCentreCoordX(tileX, tileY) {
    return tileW / 2 * (mapTilesY - tileY + tileX);
}

function getTileIsoCentreCoordY(tileX, tileY) {
    return tileH / 2 * (tileY + tileX);
}


function getTileCoordsFromScreenPosition(screenCoordinateX, screenCoordinateY) {
    // find the difference in position between the cursor and the hero (at the centre of the screen):
    var xDiff = screenCoordinateX - (canvasWidth / 2);
    var yDiff = screenCoordinateY - (canvasHeight / 2);
    var nonIsoCoordX = find2DCoordsX(hero.isox + xDiff, hero.isoy + yDiff);
    var nonIsoCoordY = find2DCoordsY(hero.isox + xDiff, hero.isoy + yDiff);
    return [getTileX(nonIsoCoordX), getTileY(nonIsoCoordY)];
}


/*
DUPLICATE
// find current tile based on non-iso coords
function getCurrentTileX(x) {
    return Math.floor(x/tileW);
}
function getCurrentTileY(y) {
    return Math.floor(y/tileW);
}
*/

// find current tile based on non-iso coords
function getTileX(x) {
    return Math.floor(x / tileW);
}

function getTileY(y) {
    return Math.floor(y / tileW);
}

function getElevation(tileX, tileY) {
    var localTileX, localTileY, thisMap;
    // it might be a platform map that is over an overworld map, so that would need local coordinates:
    if ((isOverWorldMap) && ((tileX >= worldMapTileLength) || (tileY >= worldMapTileLength))) {
        thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
        localTileX = getLocalCoordinatesX(tileX);
        localTileY = getLocalCoordinatesY(tileY);
    } else {
        thisMap = currentMap;
        localTileX = tileX;
        localTileY = tileY;
    }
    var elevation = 0;
    if (typeof thisMapData[thisMap].properties[localTileY][localTileX].elevation != 'undefined') {
        elevation = thisMapData[thisMap].properties[localTileY][localTileX].elevation;
    }

    return elevation;
}

function checkForSlopes(object) {

    var globalTileX = object.tileX;
    var globalTileY = object.tileY;
    var tileX, tileY;
    var thisMap;
    // it might be a platform map that is over an overworld map, so that would need local coordinates:
    if ((isOverWorldMap) && ((globalTileX >= worldMapTileLength) || (globalTileY >= worldMapTileLength))) {
        tileX = getLocalCoordinatesX(globalTileX);
        tileY = getLocalCoordinatesY(globalTileY);
        thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);
    } else {
        tileX = globalTileX;
        tileY = globalTileY;
        thisMap = currentMap;
    }
    // console.log("sslope"+tileX+","+tileY+","+thisMap+" = "+thisMapData[thisMap].collisions[tileY][tileX]);



    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
        case ">":

            // is a horizontal slope
            console.log(object.x % tileW);
            var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
            object.z = parseInt(minMax[0]) + (parseInt(minMax[1]) * (tileW - (object.x % tileW)) / tileW);
            break;
        case "<":
            console.log(object.x % tileW);
            var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
            object.z = parseInt(minMax[0]) + (parseInt(minMax[1]) * ((object.x % tileW)) / tileW);
            break;
        case "v":
            // is a vertical slope 
            var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
            console.log(object.y % tileW + " - " + minMax[0] + (parseInt(minMax[1]) * (tileW - (object.y % tileW)) / tileW));

            object.z = parseInt(minMax[0]) + (parseInt(minMax[1]) * (tileW - (object.y % tileW)) / tileW);
            break;
        case "^":
            var minMax = thisMapData[thisMap].properties[tileY][tileX].elevation.split(">");
            console.log(object.y % tileW + " - " + minMax[0] + (parseInt(minMax[1]) * (tileW - (object.y % tileW)) / tileW));

            object.z = parseInt(minMax[0]) + (parseInt(minMax[1]) * ((object.y % tileW)) / tileW);

            break;
        default:
            object.z = getElevation(object.tileX, object.tileY);
    }
}

function dataURItoBlob(dataURI) {
    // thanks https://stackoverflow.com/questions/9388412/data-uri-to-object-url-with-createobjecturl-in-chrome-ff#answer-43449212
    var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
}

function getCurrentDateTimeFormatted() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '-' + mm + '-' + today.getFullYear() + '_' + today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
}

function parseTime(time) {
    // https://stackoverflow.com/a/19700358/1054212
    var seconds = Math.floor((time / 1000) % 60);
    var minutes = Math.floor((time / (1000 * 60)) % 60);
    var hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    if (hours > 24) {
        return Math.floor(hours / 24) + " days";
    } else if (hours > 1) {
        return hours + " hours";
    } else if (hours == 1) {
        if (minutes > 1) {
            return "1 hour & " + minutes + " minutes";
        } else if (minutes == 1) {
            return "1 hour & 1 minute";
        } else {
            return "1 hour";
        }

    } else if (minutes > 1) {
        return minutes + " minutes";
    } else if (minutes == 1) {
        return "1 minute";
    } else if (seconds == 1) {
        return "1 second";
    } else {
        return seconds + " seconds";
    }
}

function isATerrainCollision(x, y) {
    var globalTileX = getTileX(x);
    var globalTileY = getTileY(y);
    var tileX, tileY;
    var thisMap;
    if (isOverWorldMap && !currentMapIsAGlobalPlatform) {
        tileX = getLocalCoordinatesX(globalTileX);
        tileY = getLocalCoordinatesY(globalTileY);
        if ((globalTileX < 0) || (globalTileY < 0) || (globalTileX >= (worldMapTileLength * worldMap[0].length)) || (globalTileY >= (worldMapTileLength * worldMap.length))) {
            return 1;
        }
        thisMap = findMapNumberFromGlobalCoordinates(globalTileX, globalTileY);
    } else {
        tileX = globalTileX;
        tileY = globalTileY;
        if ((tileX < 0) || (tileY < 0) || (tileX >= mapTilesX) || (tileY >= mapTilesY)) {
            return 1;
        }
        thisMap = currentMap;
    }

    switch (thisMapData[thisMap].collisions[tileY][tileX]) {
        case 1:
            // is a collision:
            return 1;
            break;
        case "<":
        case ">":
        case "^":
        case "v":
            // stairs
            // #####
            return 0;
            break;
        case "d":
            // is a door:
            return 0;
            break;
        default:
            // not a collsiion:
            return 0;
    }
}


function findWhichWorldMap(tileX, tileY) {
    return worldMap[Math.floor(tileY / worldMapTileLength)][Math.floor(tileX / worldMapTileLength)];
}


function findWorldMapPosition(requiredMapNumber) {
    var currentMapIndexX, currentMapIndexY;
    // find where the required map is in the array:
    for (var i = 0; i < worldMap[0].length; i++) {
        for (var j = 0; j < worldMap.length; j++) {
            if (worldMap[j][i] == requiredMapNumber) {
                currentMapIndexX = i;
                currentMapIndexY = j;
                break;
            }
        }
    }
    return [currentMapIndexX, currentMapIndexY];
}



/*
function findRelativeWorldMapPosition(mapNumber) {
    // find the relative position of the passed in map number to the current map in the worldMap array
    var currentMapPosition = findWorldMapPosition(currentMap);
    var targetMapPosition = findWorldMapPosition(mapNumber);
    var xDiff = targetMapPosition[0] - currentMapPosition[0];
    var yDiff = targetMapPosition[1] - currentMapPosition[1];
    var worldXLength = worldMap[0].length;
    var worldYLength = worldMap.length;
    // wrap around:
    if (xDiff >= worldXLength / 2) {
        xDiff -= worldXLength;
    }
    if (xDiff <= 0 - (worldXLength / 2)) {
        xDiff += worldXLength;
    }
    if (yDiff >= worldYLength / 2) {
        yDiff -= worldYLength;
    }
    if (yDiff <= 0 - (worldYLength / 2)) {
        yDiff += worldYLength;
    }
    return ([xDiff, yDiff]);
}


*/


function getXOffsetFromHeight(height) {
    // for determining a shadow's offset (for example).
    return (Math.sqrt(2) / 2 * height);
}


function findItemAtTile(tileX, tileY) {
    var foundItem = -1;
    var thisItem;
    var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    for (var i = 0; i < thisMapData[thisMap].items.length; i++) {
        thisItem = thisMapData[thisMap].items[i];
        if (tileX == thisItem.tileX) {
            if (tileY == thisItem.tileY) {
                foundItem = i;
                break;
            }
        }
    }
    return foundItem;
}

function findItemObjectAtTile(tileX, tileY) {
    var foundItem = null;
    var thisItem;
    var thisMap = findMapNumberFromGlobalCoordinates(tileX, tileY);
    for (var i = 0; i < thisMapData[thisMap].items.length; i++) {
        thisItem = thisMapData[thisMap].items[i];
        if (tileX == thisItem.tileX) {
            if (tileY == thisItem.tileY) {
                foundItem = thisMapData[thisMap].items[i];
                break;
            }
        }
    }
    return foundItem;
}


function findItemWithinArmsLength() {
    // check if there's a relevant item on the hero's tile, or at arm's length:
    var armsLengthXTile = hero.tileX + relativeFacing[hero.facing]["x"];
    var armsLengthYTile = hero.tileY + relativeFacing[hero.facing]["y"];
    var foundItem = null;
    var thisItem;
    for (var m = 0; m < visibleMaps.length; m++) {

        for (var i = 0; i < thisMapData[(visibleMaps[m])].items.length; i++) {
            thisItem = thisMapData[(visibleMaps[m])].items[i];

            if (hero.tileX == thisItem.tileX) {
                if (hero.tileY == thisItem.tileY) {
                    foundItem = thisItem;

                    break;
                }
            }
            if (armsLengthXTile == thisItem.tileX) {
                if (armsLengthYTile == thisItem.tileY) {
                    foundItem = thisItem;
                    break;
                }
            }
        }
    }
    return foundItem;
}

/*
 function getObjectKeysForValue( testObject, value ) {
    console.log("looking for "+value);
    // return an array of all keys in the object that have a value that match the one passed in
   var keysFound = [];
    for( var prop in testObject ) {
        if( testObject.hasOwnProperty( prop ) ) {
            console.log("checking:"+prop);
             if( testObject[ prop ] === value )
                 keysFound.push(prop);
        }
    }
   return keysFound;
}
*/




function capValues(value, min, max) {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
}

function keepWithinRange(value, min, max) {
    if (value < min) {
        value += max;
    }
    if (value > max) {
        value -= max;
    }
    return value;
}

function accessDynamicVariable(variableToUse) {
    var variableComponents = variableToUse.split(".");
    var currentElement = window;
    for (var i = 0; i < variableComponents.length; i++) {
        if (typeof currentElement[variableComponents[i]] !== "undefined") {
            currentElement = currentElement[variableComponents[i]];
        }
    }
    return currentElement;
}

function getNearestParentId(thisNode) {
    // find the id of the parent if the passed in element doesn't have one:
    while (!thisNode.id) {
        thisNode = thisNode.parentNode;
    }
    return thisNode;
}



function getObjectKeysForInnerValue(testObject, value, attribute) {
    // console.log("looking for "+value);
    // return an array of all keys in the object that have a value that match the one passed in
    var keysFound = [];
    for (var prop in testObject) {
        if (testObject.hasOwnProperty(prop)) {
            //     console.log("checking:"+testObject[prop][attribute]);
            if (testObject[prop][attribute] === value) {

                keysFound.push(prop);
            }
        }
    }
    return keysFound;
}


function launchFullScreen(element) {
    // https://davidwalsh.name/fullscreen
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}


function debounce(func, wait, immediate) {
    // https://davidwalsh.name/javascript-debounce-function
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


function isAnObjectCollision(obj1x, obj1y, obj1w, obj1h, obj2x, obj2y, obj2w, obj2h) {
    if (obj1x + obj1w / 2 > obj2x - obj2w / 2) {
        if (obj1x - obj1w / 2 < obj2x + obj2w / 2) {
            if (obj1y - obj1h / 2 < obj2y + obj2h / 2) {
                if (obj1y + obj1h / 2 > obj2y - obj2h / 2) {
                    return true;
                }
            }
        }
    }
    return false;
}




// useful for determining relative direction based on facing:
var relativeFacing = {
    "n": {
        "x": 0,
        "y": -1
    },
    "s": {
        "x": 0,
        "y": 1
    },
    "e": {
        "x": 1,
        "y": 0
    },
    "w": {
        "x": -1,
        "y": 0
    }
};


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntegerInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDice(quantity, sidedDice) {
    // eg to roll 3d6, use rollDice(3,6);
    var result = 0;
    for (var i = 0; i < quantity; i++) {
        result += getRandomIntegerInclusive(1, sidedDice);
    }
    return result;
}

function getRandomKeyFromObject(object) {
    var keys = Object.keys(object)
    return keys[keys.length * Math.random() << 0];
}

function isInRange(ax, ay, bx, by, ra) {
    // determines if one sprite is within range of another
    var range = getPythagorasDistance(ax, ay, bx, by);
    if (range <= ra) {
        return true;
    } else {
        return false;
    }
}

function turntoFace(obj1, obj2) {
    // obj1 is the one which will react and turn to face obj2
    var xDiff = obj1.x - obj2.x;
    var yDiff = obj1.y - obj2.y;
    // find the greatest difference:
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            return "w";
        } else {
            return "e";
        }
    } else {
        if (yDiff > 0) {
            return "n";
        } else {
            return "s";
        }
    }
}

function turntoFaceTile(obj, tile2x, tile2y) {
    var xDiff = obj.x - getTileCentreCoordX(tile2x);
    var yDiff = obj.y - getTileCentreCoordY(tile2y);
    // find the greatest difference:
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            return "w";
        } else {
            return "e";
        }
    } else {
        if (yDiff > 0) {
            return "n";
        } else {
            return "s";
        }
    }
}


function isFacing(obj1, obj2) {
    var isFacing = false;
    switch (obj1.facing) {
        case "n":
            if (obj1.y > obj2.y) {
                isFacing = true;
            }
            break;
        case "s":
            if (obj1.y < obj2.y) {
                isFacing = true;
            }
            break;
        case "w":
            if (obj1.x > obj2.x) {
                isFacing = true;
            }
            break;
        case "e":
            if (obj1.x < obj2.x) {
                isFacing = true;
            }
            break;

    }
    return isFacing;
}




function generateHash(sourceString) {
    // http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
    var hash = 0,
        i, chr, len;
    if (sourceString.length === 0) return hash;
    for (i = 0, len = sourceString.length; i < len; i++) {
        chr = sourceString.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}







function parseMoney(amount) {
    var isNegative = false;
    if (amount < 0) {
        amount = Math.abs(amount);
        isNegative = true;
    }
    var moneyOutput = "";
    var copper = amount % 100;
    var gold = Math.floor(amount / 10000);
    var silver = Math.floor((amount - gold * 10000) / 100);
    if (gold > 0) {
        moneyOutput = gold + '<span class="gold"></span>';
    }
    if ((silver > 0) || (gold > 0)) {
        moneyOutput += silver + '<span class="silver"></span>';
    }
    moneyOutput += copper + '<span class="copper"></span>';
    if (isNegative) {
        moneyOutput = "-" + moneyOutput;
    }
    return moneyOutput;
}



function hasLineOfSight(startX, startY, endX, endY) {

    var thisMap = findMapNumberFromGlobalCoordinates(startX, startY);




    var nextX = startX;
    var nextY = startY;
    var pathY = [];
    var pathX = [];
    var deltaY = endY - startY;
    var deltaX = endX - startX;
    var currentStep = 0;
    var fraction, previousX, previousY, stepX, stepY, thisInnerDoor;



    var needToCheckInnerDoors = false;
    if (typeof thisMapData[thisMap].innerDoors !== "undefined") {
        needToCheckInnerDoors = true;
    }

    var localTileX = getLocalCoordinatesX(startX);
    var localTileY = getLocalCoordinatesY(startY);
    // check the starting tile:
    if (thisMapData[thisMap].collisions[localTileY][localTileX] != 0) {
        // tile is non-walkable;
        return false;

    }
    if (needToCheckInnerDoors) {
        thisInnerDoor = thisMap + "-" + localTileX + "-" + localTileY;
        if (thisMapData[thisMap].innerDoors.hasOwnProperty(thisInnerDoor)) {
            // an Inner Door exists at this location:
            if (!thisMapData[thisMap].innerDoors[thisInnerDoor]['isOpen']) {
                return false;

            }
        }
    }

    // path direction calculation:
    if (deltaY < 0) {
        stepY = -1;
    } else {
        stepY = 1;
    }
    if (deltaX < 0) {
        stepX = -1;
    } else {
        stepX = 1;
    }

    deltaY = Math.abs(deltaY * 2);
    deltaX = Math.abs(deltaX * 2);
    previousX = startX;
    previousY = startY;
    // bresenham algorithm:
    if (deltaX > deltaY) {
        fraction = deltaY * 2 - deltaX;
        while (nextX != endX) {
            if (fraction >= 0) {
                nextY += stepY;
                fraction -= deltaX;
            }
            nextX += stepX;
            fraction += deltaY;
            thisMap = findMapNumberFromGlobalCoordinates(nextX, nextY);
            localTileX = getLocalCoordinatesX(nextX);
            localTileY = getLocalCoordinatesY(nextY);
            if (thisMapData[thisMap].collisions[localTileY][localTileX] != 0) {
                // tile is non-walkable:
                return false;
                break;
            }
            if (needToCheckInnerDoors) {
                thisInnerDoor = thisMap + "-" + localTileX + "-" + localTileY;
                if (thisMapData[thisMap].innerDoors.hasOwnProperty(thisInnerDoor)) {
                    // an Inner Door exists at this location:
                    if (!thisMapData[thisMap].innerDoors[thisInnerDoor]['isOpen']) {
                        return false;
                        break;
                    }
                }
            }
            // add relative movement to the array:                                                                                                                  
            pathY[currentStep] = nextY - previousY;
            pathX[currentStep] = nextX - previousX;
            previousY = nextY;
            previousX = nextX;
            currentStep++;
        }
    } else {
        fraction = deltaX * 2 - deltaY;
        while (nextY != endY) {
            if (fraction >= 0) {
                nextX += stepX;
                fraction -= deltaY;
            }
            nextY += stepY;
            fraction += deltaX;
            thisMap = findMapNumberFromGlobalCoordinates(nextX, nextY);
            localTileX = getLocalCoordinatesX(nextX);
            localTileY = getLocalCoordinatesY(nextY);
            if (thisMapData[thisMap].collisions[localTileY][localTileX] != 0) {
                // tile is non-walkable;
                return false;
                break;
            }
            if (needToCheckInnerDoors) {
                thisInnerDoor = thisMap + "-" + localTileX + "-" + localTileY;
                if (thisMapData[thisMap].innerDoors.hasOwnProperty(thisInnerDoor)) {
                    // an Inner Door exists at this location:
                    if (!thisMapData[thisMap].innerDoors[thisInnerDoor]['isOpen']) {
                        return false;
                        break;
                    }
                }
            }
            // add relative movement to the array:                                                                                                                  
            pathY[currentStep] = nextY - previousY;
            pathX[currentStep] = nextX - previousX;
            previousY = nextY;
            previousX = nextX;
            currentStep++;
        }
    }
    return true;
}



function determineWhichTransitionEvent() {
    // https://davidwalsh.name/css-animation-callback
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    }
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
    el = null;
}

function determineWhichAnimationEvent() {
    // https://davidwalsh.name/css-animation-callback
    var t;
    var el = document.createElement('fakeelement');
    var animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    }
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
    el = null;
}

// http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array#answer-9229821
function uniqueValues(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function sortByHighestValue(a, b) {
    // highest first
    if (a[0] < b[0])
        return 1;
    if (a[0] > b[0])
        return -1;
    return 0;
}

function sortByLowestValue(a, b) {
    // lowest first
    if (a[0] < b[0])
        return -1;
    if (a[0] > b[0])
        return 1;
    return 0;
}

/*
 function byPropertyLowestFirst(property) {
    // sortedObj = unsortedObj.sort(byPropertyLowestFirst("name"));
    return function(a,b) {
        if (typeof a[property] == "number") {
            return (a[property] - b[property]);
        } else {
            return ((a[property] < b[property]) ? -1 : ((a[property] > b[property]) ? 1 : 0));
        }
    };
};
*/

function removeElementFromArray(whichArray, whichElement) {
    var index = whichArray.indexOf(whichElement);
    if (index > -1) {
        whichArray.splice(index, 1);
    }
}

function getRandomElementFromArray(whichArray) {
    return whichArray[Math.floor(Math.random() * whichArray.length)];
}


function drawEllipse(ctx, x, y, w, h, filled, colour) {
    // https://stackoverflow.com/questions/14169234/the-relation-of-the-bezier-curve-and-ellipse
    var kappa = 0.5522848;
    var ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w, // x-end
        ye = y + h, // y-end
        xm = x + w / 2, // x-middle
        ym = y + h / 2; // y-middle
    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    if (filled) {
        ctx.fillStyle = colour;
        ctx.fill();
    } else {
        ctx.strokeStyle = colour;
        ctx.stroke();
    }
}



function drawCircle(fillStyle, x, y, radius, whichContext) {
    whichContext.fillStyle = fillStyle;
    whichContext.beginPath();
    whichContext.arc(x, y, radius, 0, 2 * Math.PI);
    whichContext.fill();
}



function drawIsoRectangle(topLeftX, topLeftY, bottomRightX, bottomRightY, filled, colour, whichContext) {
    var drawnOffsetX = (canvasWidth / 2) - hero.isox;
    var drawnOffsetY = (canvasHeight / 2) - hero.isoy;
    whichContext.fillStyle = colour;
    whichContext.beginPath();
    // find iso coordinates from non-iso values passed in:
    whichContext.moveTo(findIsoCoordsX(topLeftX, topLeftY) + drawnOffsetX, findIsoCoordsY(topLeftX, topLeftY) + drawnOffsetY);
    whichContext.lineTo(findIsoCoordsX(bottomRightX, topLeftY) + drawnOffsetX, findIsoCoordsY(bottomRightX, topLeftY) + drawnOffsetY);
    whichContext.lineTo(findIsoCoordsX(bottomRightX, bottomRightY) + drawnOffsetX, findIsoCoordsY(bottomRightX, bottomRightY) + drawnOffsetY);
    whichContext.lineTo(findIsoCoordsX(topLeftX, bottomRightY) + drawnOffsetX, findIsoCoordsY(topLeftX, bottomRightY) + drawnOffsetY);
    whichContext.lineTo(findIsoCoordsX(topLeftX, topLeftY) + drawnOffsetX, findIsoCoordsY(topLeftX, topLeftY) + drawnOffsetY);
    whichContext.closePath();
    if (filled) {
        whichContext.fillStyle = colour;
        whichContext.fill();
    } else {
        whichContext.strokeStyle = colour;
        whichContext.stroke();
    }
}



// -----------------------------------------------------------

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Moller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// -----------------------------------------------------------




var getJSONWithParams = function(url, params, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('POST', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            var wasParsedOk = true;
            if (status == 200) {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    // JSON parse error:
                    wasParsedOk = false;
                    errorHandler && errorHandler(status);
                }
                if (wasParsedOk) {
                    successHandler && successHandler(data);
                }
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
};




function sendGetData(url, successHandler, errorHandler) {
    // send data to the server, and get a response:
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            if (status == 200) {
                data = xhr.responseText;
                successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}


function sendDataWithoutNeedingAResponse(url) {
    // send data to the server, without needing to listen for a response:
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.send();
}

function postData(url, data) {
    // send data to the server, without needing to listen for a response:
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    xhr.send(data);
}






/*

function pseudoRandomNumberGenerator(seed) {
  // kudos https://gist.github.com/blixt/f17b47c62508be59987b
  // use:
  // const plantBreedingPRNG = new pseudoRandomNumberGenerator(1234);
  // console.log(plantBreedingPRNG.nextFloat());
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

pseudoRandomNumberGenerator.prototype.next = function () {
  // Returns a pseudo-random value between 1 and 2^32 - 2.
  return this._seed = this._seed * 16807 % 2147483647;
};

pseudoRandomNumberGenerator.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // Returns a pseudo-random floating point number in range [0, 1).
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};


*/










// -----------------------------------------------------------

// image loader 
// http://stackoverflow.com/questions/16560397/image-not-drawn-on-canvas-until-user-clicks
// http://jsfiddle.net/gfcarv/26AmY/
window.Loader = (function() {
    var imageCount = 0;
    var loading = false;
    var total = 0;

    // this object will hold all image references
    var images = {};

    function reset() {
        imageCount = 0;
        loading = false;
        total = 0;
        images = {};
    }

    // user defined callback, called each time an image is loaded (if it is not defined the empty function wil be called)
    function onProgressUpdate() {};
    // user defined callback, called when all images are loaded (if it is not defined the empty function wil be called)
    function onComplete() {};

    function onLoadImage(name) {
        ++imageCount;
        //  console.log(name + " loaded");

        // call the user defined callback when an image is loaded
        onProgressUpdate(getProgress());
        // check if all images are loaded
        if (imageCount == total) {
            loading = false;
            onComplete();
        }

    };

    function onImageError(e) {
        console.log("Error on loading the image: " + e.srcElement);
    }

    function loadImage(name, src) {
        try {
            images[name] = new Image();
            images[name].onload = function() {
                onLoadImage(name);
            };
            images[name].onerror = onImageError;
            images[name].src = src;
        } catch (e) {
            console.log(e.message);
        }
    }

    function getImage(name) {
        if (images[name]) {
            return (images[name]);
        } else {
            return undefined;
        }
    }

    // pre-load all the images and call the onComplete callback when all images are loaded
    // optionaly set the onProgressUpdate callback to be called each time an image is loaded (useful for loading screens) 
    function preload(_images, _onComplete, _onProgressUpdate) {
        reset();
        if (!loading) {

            //  console.log("Loading...");
            loading = true;

            try {
                total = _images.length;
                onProgressUpdate = _onProgressUpdate || (function() {});
                onComplete = _onComplete || (function() {});
                for (var i = 0; i < _images.length; ++i) {
                    loadImage(_images[i].name, _images[i].src);
                }
            } catch (e) {
                console.log(e.message);
            }
        } else {
            //  throw new Error("Acess denied: Cannot call the load function while there are remaining images to load.");
        }
    }

    // percentage of progress
    function getProgress() {
        return (imageCount / total) * 100;
    };

    // return only the public stuff to create our Loader object
    return {
        preload: preload,
        getProgress: getProgress,
        getImage: getImage,
        reset: reset,
        images: images
    };
})();

// -----------------------------------------------------------