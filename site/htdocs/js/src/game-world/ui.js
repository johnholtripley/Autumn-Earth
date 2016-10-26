var UI = {
    init: function() {
        // cache all references to UI elements:
        var displayZoneName = document.getElementById('displayZoneName');
        var activeCartographicMap = document.getElementById('activeCartographicMap');
        var cartographicTitle = document.getElementById('cartographicTitle');
        var dialogue = document.getElementById('dialogue');
        var notification = document.getElementById('notification');
        var cardGameWrapper = document.getElementById('cardGameWrapper');
        var cardAlbumList = document.getElementById('cardAlbumList');
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
        var inventoryMarkup = '';
        var thisColourName, theColourPrefix, thisFileColourSuffix, thisAction, dataActionMarkup;
        // loop through number of bags
        for (var i = 0; i < hero.bags.length; i++) {
            inventoryMarkup += '<div class="inventoryBag"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
            //console.log(hero.bags[i].type);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                var thisSlotsID = i + '-' + j
                inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {
                    theColourPrefix = "";
                    thisFileColourSuffix = "";
                    thisColourName = getColourName(hero.inventory[thisSlotsID].colour, hero.inventory[thisSlotsID].type);
                    if (thisColourName != "") {
                        theColourPrefix = thisColourName + " ";
                        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                    }
                    thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;

                    dataActionMarkup = '';
                    if(thisAction) {
dataActionMarkup = 'data-action="'+thisAction+'" ';
                    }
                    inventoryMarkup += '<img src="/images/game-world/inventory-items/' + hero.inventory[thisSlotsID].type + thisFileColourSuffix + '.png" '+dataActionMarkup+'alt="">';
                    inventoryMarkup += '<span class="qty">' + hero.inventory[thisSlotsID].quantity + '</span>';
                    inventoryMarkup += '<p><em>' + theColourPrefix + currentActiveInventoryItems[hero.inventory[thisSlotsID].type].shortname + ' </em>' + currentActiveInventoryItems[hero.inventory[thisSlotsID].type].description + ' <span class="price">Sell price: ' + parseMoney(hero.inventory[thisSlotsID].quantity * currentActiveInventoryItems[hero.inventory[thisSlotsID].type].priceCode, 0) + '</span></p>';
                } else {
                    inventoryMarkup += '<img alt="Empty slot" src="/images/game-world/inventory-items/blank.png">';
                }
                // add item there
                inventoryMarkup += '</li>';
            }
            inventoryMarkup += '</ol></div></div>';
        }
        document.getElementById('inventoryPanels').innerHTML = inventoryMarkup;
        document.getElementById('inventoryPanels').ondblclick = UI.inventoryItemDoubleClick;
        UI.initDrag(".draggableBar");
        UI.updateCardAlbum();
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
    },

    inventoryItemDoubleClick: function(e) {
 
        var thisItemsAction = e.target.getAttribute('data-action');
        if(thisItemsAction) {
            
            inventoryItemAction(e.target,thisItemsAction);
        }
    },

    showDialogue: function(whichNPC, text) {
        dialogue.innerHTML = text;
        dialogue.classList.remove("slowerFade");
        dialogue.classList.add("active");
        activeNPCForDialogue = whichNPC;
        UI.updateDialogue(activeNPCForDialogue);
    },

    updateDialogue: function(whichNPC) {
        // maybe store these values if NPCs are never going to move while a speech balloon is attached to them? #####
        var thisX = findIsoCoordsX(whichNPC.x, whichNPC.y);
        var thisY = findIsoCoordsY(whichNPC.x, whichNPC.y);
        // +40 y for the toolbar height at the bottom of the canvas:
        // -40 x so the balloon tip is at '0' x
        var thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 40) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - whichNPC.centreY + (canvasHeight / 2)) + 40)) + "px)";
        dialogue.style.transform = thisTransform;
    },

    showNotification: function(markup) {
        notification.classList.remove("active");
        notification.innerHTML = markup;
        void notification.offsetWidth;
        notification.classList.add('active');
    },

    updateCardAlbum: function() {
        var cardAlbumMarkup = '';
        for (var i = 0; i < 20; i++) {
            if (hero.cards[i]) {
                cardAlbumMarkup += '<li><img src="/images/card-game/cards/' + hero.cards[i] + '.png" class="card players" alt="'+cardGameNameSpace.allCardData[(hero.cards[i])][2]+' card"></li>';
            } else {
                cardAlbumMarkup += '<li></li>';
            }
        }
        cardAlbumList.innerHTML = cardAlbumMarkup;
    }


}
