var UI = {
    init: function() {
        // cache all references to UI elements:
        var displayZoneName = document.getElementById('displayZoneName');
    },

    showZoneName: function(zoneName) {
        displayZoneName.classList.remove("active");
        displayZoneName.textContent = zoneName;
        // https://css-tricks.com/restart-css-animation/
        // -> triggering reflow:
        void displayZoneName.offsetWidth;
        displayZoneName.classList.add("active");
    },

    buildInventoryInterface: function() {
        console.log("building inventory panels...");
        // loop through number of bags
        for (var i = 0; i < hero.bags.length; i++) {
            //console.log(hero.bags[i].type);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                // check if that key exists in inventory
                // add item there
            }
        }
        inventoryInterfaceIsBuilt = true;
    }
}
