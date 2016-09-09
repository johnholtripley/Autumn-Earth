var UI = {
    init: function() {
        // cache all references to UI elements:
        var displayZoneName = document.getElementById('displayZoneName');
        var inventoryPanels = document.getElementById('inventoryPanels');
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
        var inventoryMarkup = '';
        // loop through number of bags
        for (var i = 0; i < hero.bags.length; i++) {
            inventoryMarkup += '<ul id="bag'+i+'">';
            //console.log(hero.bags[i].type);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                var thisSlotsID = i+'-'+j
                inventoryMarkup += '<li class="'+thisSlotsID+'">';
                // check if that key exists in inventory:
                if(thisSlotsID in hero.inventory) {

     
      

inventoryMarkup += '<p>'+currentActiveInventoryItems[(hero.inventory[thisSlotsID].type)].shortname+'</p>';
inventoryMarkup += '<img src="/images/game-world/inventory-items/'+hero.inventory[thisSlotsID].type+'.png">';
                }
                // add item there
                inventoryMarkup += '</li>';
            }
            inventoryMarkup += '</ul>';
        }
         inventoryPanels.innerHTML = inventoryMarkup;
        inventoryInterfaceIsBuilt = true;
    }
}
