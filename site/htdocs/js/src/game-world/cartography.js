function updateCartographicMiniMap() {

    // cartography canvas is 246px wide
    var cartographyUnits = 246 / (mapTilesX * tileW);

    var x = hero.x * cartographyUnits;
    var y = hero.y * cartographyUnits;
    var innerRadius = 0;
    var outerRadius = 35;

    var gradient = offScreenCartographyContext.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    gradient.addColorStop(0, 'rgb(255,255,255)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    offScreenCartographyContext.arc(x, y, outerRadius, 0, 2 * Math.PI);
    offScreenCartographyContext.fillStyle = gradient;
    offScreenCartographyContext.fill();

    cartographyContext.clearRect(0, 0, 246, 246);
    cartographyContext.globalCompositeOperation = 'copy';
    cartographyContext.drawImage(offScreenCartographyCanvas, 0, 0);
    cartographyContext.globalCompositeOperation = 'source-atop';
    cartographyContext.drawImage(canvasMapImage, 0, 0);
}

function initCartographicMap() {
  
    canvasMapImage.src = "/game-world/generateCartographicMap.php?playerId=" + characterId + "&dungeonName=" + randomDungeonName + "&plotChests=true&requestedMap=" + newMap;

    canvasMapImage.onload = function() {
        // load the mask (if any) so that previously uncovered areas are revealed:
        //console.log('getting mask - /game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + newMap);
     
        canvasMapMaskImage.src = '/game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + newMap + '&cache=' + Date.now();
    
        canvasMapMaskImage.onload = function() {        
            offScreenCartographyContext.clearRect(0, 0, 246, 246);
            offScreenCartographyContext.drawImage(canvasMapMaskImage, 0, 0);
            updateCartographicMiniMap();
        }
    }
}

function saveCartographyMask() {
    var dataURL = offScreenCartographyCanvas.toDataURL();
    
    postData('/game-world/saveCartographicMapMask.php', 'chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + currentMap + '&data=' + dataURL);

}
