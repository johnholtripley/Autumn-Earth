var UI = {
    init: function() {
        // cache all references to UI elements:
        var displayZoneName = document.getElementById('displayZoneName');
        var inventoryPanels = document.getElementById('inventoryPanels');
        //

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
            inventoryMarkup += '<div class="dragParent"><div class="draggableBar">Bag #' + i + '</div><ul class="active" id="bag' + i + '">';
            //console.log(hero.bags[i].type);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                var thisSlotsID = i + '-' + j
                inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {

                    inventoryMarkup += '<img src="/images/game-world/inventory-items/' + hero.inventory[thisSlotsID].type + '.png" alt="">';
                    inventoryMarkup += '<span class="qty">' + hero.inventory[thisSlotsID].quantity + '</span>';
                    inventoryMarkup += '<p><em>' + currentActiveInventoryItems[hero.inventory[thisSlotsID].type].shortname + ' </em>' + currentActiveInventoryItems[hero.inventory[thisSlotsID].type].description + ' <span class="price">Sell price: ' + parseMoney(hero.inventory[thisSlotsID].quantity * currentActiveInventoryItems[hero.inventory[thisSlotsID].type].priceCode, 0) + '</span></p>';
                } else {
                    inventoryMarkup += '<img alt="Empty slot" src="/images/game-world/inventory-items/blank.png">';
                }
                // add item there
                inventoryMarkup += '</li>';
            }
            inventoryMarkup += '</ul></div></div>';
        }
        inventoryPanels.innerHTML = inventoryMarkup;
        UI.initDrag(".draggableBar");
        inventoryInterfaceIsBuilt = true;
    },



    handleDrag: function(e) {
        if (UI.inDrag) {
            // don't access the element multiple times - do it all in one go:
            UI.activeDragObject.style.cssText = "z-index:2;left: " + (objInitLeft + e.pageX - dragStartX) + "px; top: " + (objInitTop + e.pageY - dragStartY) + "px";
        }
    },

    endDrag: function(e) {
        UI.inDrag = false;
        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endDrag, false);
        UI.activeDragObject = '';
    },

    initDrag: function(whichElement) {

        var dragTargets = document.querySelectorAll(whichElement);
        for (i = 0; i < dragTargets.length; i++) {
            dragTargets[i].addEventListener("mousedown", function(e) {
                UI.activeDragObject = this.parentElement;
                UI.inDrag = true;
                objInitLeft = UI.activeDragObject.offsetLeft;
                objInitTop = UI.activeDragObject.offsetTop;
                dragStartX = e.pageX;
                dragStartY = e.pageY;
                document.addEventListener("mousemove", UI.handleDrag, false);
                document.addEventListener("mouseup", UI.endDrag, false);
                // remove z-index of other draggable elements:
                var dragTargetsInner = document.querySelectorAll(whichElement);
                for (j = 0; j < dragTargetsInner.length; j++) {
                    dragTargets[j].parentElement.style.zIndex = 1;
                }
            }, false);
        }
    }
}
