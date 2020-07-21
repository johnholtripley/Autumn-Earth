function generateTreasureChest() {
    //  (another treasure map (#82), a quest starting letter (#55), eggs (#111), quests that reward followers (#55), card crafting recipes if they’re added, follower slot unlocks if they’re added etc.)
    // test with:
    /*
    thisChest = generateTreasureChest();
    thisChest.tileX = hero.tileX;
    thisChest.tileY = hero.tileY+1;
    thisMapData[currentMap].items.push(thisChest);
    initialiseItem(thisMapData[currentMap].items[thisMapData[currentMap].items.length - 1]);
    */
    var newTreasureChest = {
        "type": 115,
        "contains": [
            {
                // house deed:
                "type": 58
            },
            {
                // house deed:
                "type": 57
            },
            {
                // bag:
                "type": 17
            },
            {
                // bag:
                "type": 20
            },
            {
                // instrument:
                "type": 113
            },
            {
                // random recipe:
                "type": 29,
                "contains": getRandomKeyFromObject(allRecipes)
            },
            {
                // gold:
                "type": "$",
                "quantity": getRandomIntegerInclusive(3500, 7500)
            },
            {
                // card dust:
                "type": "*",
                "quantity": getRandomIntegerInclusive(30, 70)
            },
            {
                // card:
                // give a chance it's a rare with a negative number ###
                "type": 34,
                "contains": getRandomIntegerInclusive(1, (cardGameNameSpace.allCardData.length-1))
            },
            {
                // card pack:
                "type": 21
            },
        ]
    };
    return newTreasureChest;
}