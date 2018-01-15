function processDowsing() {
    // find the nearest node and react to that:
    // #######
    dowsing.proximity = 100-(100*((getPythagorasDistance(hero.tileX, hero.tileY, 12, 14))/dowsing.range));
    dowsing.proximity = capValues(dowsing.proximity, 0, 100);
}