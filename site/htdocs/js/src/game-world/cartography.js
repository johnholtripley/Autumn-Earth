function updateCartographicMiniMap() {

    // cartography canvas is 246px wide
    cartographyUnits = 246 / (mapTilesX * tileW);

    x = hero.x * cartographyUnits;
    y = hero.y * cartographyUnits;

    innerRadius = 0;
    outerRadius = 35;

    var gradient = offScreenCartographyContext.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    gradient.addColorStop(0, 'rgb(0,255,255)');
    gradient.addColorStop(1, 'rgba(0,255,255,0)');

    offScreenCartographyContext.arc(x, y, outerRadius, 0, 2 * Math.PI);

    offScreenCartographyContext.fillStyle = gradient;
    offScreenCartographyContext.fill();


cartographyContext.clearRect(0, 0, 246, 246);

     cartographyContext.drawImage(offScreenCartographyCanvas, 0, 0);
    cartographyContext.globalCompositeOperation = 'source-in';
   
    cartographyContext.drawImage(canvasMapImage, 0, 0);



}



function initCartographicMap() {


    canvasMapImage = document.createElement('img');
    canvasMapImage.src = "/generateCartographicMap.php?playerId=" + characterId + "&dungeonName=" + randomDungeonName + "&plotChests=true&requestedMap=" + newMap;

    canvasMapImage.onload = function() {
        
        // new map:
        offScreenCartographyContext.clearRect(0, 0, 246, 246);
        updateCartographicMiniMap();
    }
}
