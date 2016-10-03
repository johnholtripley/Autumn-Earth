function updateCartographicMiniMap() {

    // cartography canvas is 246px wide
    cartographyUnits = mapTilesX * tileW / 246;
    x = hero.x * cartographyUnits;
    y = hero.y * cartographyUnits;
    innerRadius = 0;
    outerRadius = 25;

    var gradient = cartographyContext.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
    gradient.addColorStop(0, 'rgb(255,255,255)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    cartographyContext.arc(x, y, outerRadius, 0, 2 * Math.PI);

    cartographyContext.fillStyle = gradient;
    cartographyContext.fill();

}
