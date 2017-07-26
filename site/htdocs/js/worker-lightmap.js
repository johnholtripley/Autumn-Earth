'use strict';

// http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting_-_improved
// http://www.roguebasin.com/index.php?title=Improved_Shadowcasting_in_Java

var thisMapData, mapTilesY, mapTilesX, herosTileX, herosTileY, herosLineOfSightRange, lightMap;
const directionDiagonals = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1]
];

function getRadiusFromHero(xTile, yTile) {
    var a = herosTileX - xTile;
    var b = herosTileY - yTile;
    return Math.sqrt(a * a + b * b);
}

function castLight(row, start, end, xx, xy, yx, yy) {
    var newStart = 0.0;
    var blocked = false;
    var distance, deltaX, deltaY, currentX, currentY, leftSlope, rightSlope, bright;
    if (start < end) {
        return;
    }
    for (distance = row; distance <= herosLineOfSightRange; distance++) {
        if (!blocked) {
            deltaY = -distance;
            for (deltaX = -distance; deltaX <= 0; deltaX++) {
                currentX = herosTileX + deltaX * xx + deltaY * xy;
                currentY = herosTileY + deltaX * yx + deltaY * yy;
                leftSlope = (deltaX - 0.5) / (deltaY + 0.5);
                rightSlope = (deltaX + 0.5) / (deltaY - 0.5);
                if (!(currentX >= 0 && currentY >= 0 && currentX < mapTilesX && currentY < mapTilesY) || start < rightSlope) {
                    continue;
                } else if (end > leftSlope) {
                    break;
                }
                //check if it's within the lightable area and light if needed
                if (getRadiusFromHero(deltaX, deltaY) <= herosLineOfSightRange) {
                    bright = (1 - (getRadiusFromHero(deltaX, deltaY) / herosLineOfSightRange));

                    lightMap[currentX][currentY] = bright;
                }
                if (blocked) {
                    // previous cell was a blocking one
                    if (thisMapData.collisions[currentX][currentY] >= 1) {
                        // hit a wall
                        newStart = rightSlope;
                        continue;
                    } else {
                        blocked = false;
                        start = newStart;
                    }
                } else {
                    if (thisMapData.collisions[currentX][currentY] >= 1 && distance < herosLineOfSightRange) {
                        // hit a wall within sight line
                        blocked = true;
                        castLight(distance + 1, start, leftSlope, xx, xy, yx, yy);
                        newStart = rightSlope;
                    }
                }
            }
        }
    }
}

onmessage = function(e) {
    thisMapData = e.data[0];
    herosTileX = e.data[1];
    herosTileY = e.data[2];
    herosLineOfSightRange = e.data[3];
    mapTilesY = thisMapData.terrain.length;
    mapTilesX = thisMapData.terrain[0].length;

    lightMap = [];
    for (var row = mapTilesY - 1; row >= 0; row--) {
        var defaultRow = [];
        for (var col = mapTilesX - 1; col >= 0; col--) {
            defaultRow[col] = 0;
        }
        lightMap[row] = defaultRow;
    }

    //light the starting cell:
    lightMap[herosTileX][herosTileY] = 1;
    for (var d in directionDiagonals) {
        castLight(1, 1.0, 0.0, 0, directionDiagonals[d][0], directionDiagonals[d][1], 0);
        castLight(1, 1.0, 0.0, directionDiagonals[d][0], 0, 0, directionDiagonals[d][1]);
    }
    postMessage(lightMap);
}