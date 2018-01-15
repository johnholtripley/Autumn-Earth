function processDowsing() {
    dowsing.proximity = 100-(getPythagorasDistance(hero.tileX, hero.tileY, 12, 14)/dowsing.range*100);
    console.log(dowsing.proximity);
// need to use range as a max - if distance is greater than range, then proximity = 0;
// #######
    dowsing.proximity = capValues(dowsing.proximity, 0, 100);
}