var cartography = {
    innerRadius: 0,
    outerRadius: 35,
    isLoading: false,

    init: function() {
        // cartography canvas is 246px wide:
        cartography.cartographyUnits = 246 / (mapTilesX * tileW);
        cartography.newCartographicMap();
         if (isOverWorldMap) {
        cartography.updateCoordinates();
    }
    },

    newCartographicMap: function() {
        cartography.isLoading = true;
        canvasMapImage.src = "/game-world/generateCartographicMap.php?playerId=" + characterId + "&dungeonName=" + randomDungeonName + "&plotChests=true&requestedMap=" + currentMap;
        canvasMapImage.onload = function() {
            // load the mask (if any) so that previously uncovered areas are revealed:
            //console.log('getting mask - /game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + newMap);   
            canvasMapMaskImage.src = '/game-world/getCartographicMapMask.php?chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + currentMap + '&cache=' + Date.now();
            // live server needs this to avoid the "Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported" error:
            canvasMapMaskImage.setAttribute('crossorigin', 'anonymous');
            canvasMapMaskImage.onload = function() {
                offScreenCartographyContext.clearRect(0, 0, 246, 246);
                offScreenCartographyContext.drawImage(canvasMapMaskImage, 0, 0);
                cartography.isLoading = false;
                cartography.updateCartographicMiniMap();
            }
        }
    },

    updateCartographicMiniMap: function() {
        if (!cartography.isLoading) {
            if (isOverWorldMap) {
                var x = (hero.x % worldMapWidthPx) * cartography.cartographyUnits;
                var y = (hero.y % worldMapWidthPx) * cartography.cartographyUnits;
            } else {
                var x = hero.x * cartography.cartographyUnits;
                var y = hero.y * cartography.cartographyUnits;
            }

            var gradient = offScreenCartographyContext.createRadialGradient(x, y, cartography.innerRadius, x, y, cartography.outerRadius);
            gradient.addColorStop(0, 'rgb(255,255,255)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            offScreenCartographyContext.arc(x, y, cartography.outerRadius, 0, 2 * Math.PI);
            offScreenCartographyContext.fillStyle = gradient;
            offScreenCartographyContext.fill();

            cartographyContext.clearRect(0, 0, 246, 246);
            cartographyContext.globalCompositeOperation = 'copy';
            cartographyContext.drawImage(offScreenCartographyCanvas, 0, 0);
            cartographyContext.globalCompositeOperation = 'source-atop';
            cartographyContext.drawImage(canvasMapImage, 0, 0);
        }
    },

    saveCartographyMask: function() {
        var dataURL = offScreenCartographyCanvas.toDataURL();
        postData('/game-world/saveCartographicMapMask.php', 'chr=' + characterId + '&dungeonName=' + randomDungeonName + '&currentMap=' + currentMap + '&data=' + dataURL);
    },

    updateCoordinates: function() {
        cartographyCoordinates.innerHTML = (hero.tileX/worldMapTileLength).toFixed(2)+"E, "+(hero.tileY/worldMapTileLength).toFixed(2)+"S";
    }
}