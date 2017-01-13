// global vars:
var recipeSearch = document.getElementById('recipeSearch');
var clearRecipeSearch = document.getElementById('clearRecipeSearch');
var recipeFilter = document.getElementById('recipeFilter');
var splitStackInput = document.getElementById('splitStackInput');
var splitStackPanel = document.getElementById('splitStackPanel');
var craftingRecipeCreateButton = document.getElementById('craftingRecipeCreateButton');
var selectComponentsItemBeingCreated = document.getElementById('selectComponentsItemBeingCreated');
var componentsAvailableForThisRecipe = document.getElementById('componentsAvailableForThisRecipe');
var UI = {
    init: function() {
        // cache all local references to UI elements:
        var displayZoneName = document.getElementById('displayZoneName');
        var activeCartographicMap = document.getElementById('activeCartographicMap');
        var cartographicTitle = document.getElementById('cartographicTitle');
        var dialogue = document.getElementById('dialogue');
        var notification = document.getElementById('notification');
        var cardGameWrapper = document.getElementById('cardGameWrapper');
        var cardAlbumList = document.getElementById('cardAlbumList');
        var boosterPack = document.getElementById('boosterPack');
        var createRecipeList = document.getElementById('createRecipeList');
        var recipeTitleBar = document.getElementById('recipeTitleBar');

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
            inventoryMarkup += '<div class="inventoryBag" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
            //console.log(hero.bags[i].type);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                var thisSlotsID = i + '-' + j
                inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {

                    inventoryMarkup += generateSlotMarkup(thisSlotsID);


                } else {
                    inventoryMarkup += '';
                }
                // add item there
                inventoryMarkup += '</li>';
            }
            inventoryMarkup += '</ol></div></div>';
        }
        document.getElementById('inventoryPanels').innerHTML = inventoryMarkup;
        document.getElementById('inventoryPanels').ondblclick = UI.inventoryItemDoubleClick;
        
        document.getElementById('createRecipeList').ondblclick = UI.craftingPanelDoubleClick;
        document.getElementById('createRecipeList').onclick = UI.craftingPanelSingleClick;
        document.getElementById('craftingRecipeCreateButton').onclick = UI.craftingRecipeCreate;
        splitStackPanel.onsubmit = inventorySplitStackSubmit;
        document.getElementById('splitStackCancel').onclick = inventorySplitStackCancel;
        UI.initDrag(".draggableBar");
        UI.initInventoryDrag();
        UI.updateCardAlbum();

        UI.buildRecipePanel();
        if (hero.professionsKnown.length > 0) {
            // load and cache the first profession's recipe assets:
            UI.populateRecipeList(hero.professionsKnown[0]);
        }

        inventoryInterfaceIsBuilt = true;
    },



    showChangeInInventory: function(whichSlotsToUpdate) {


        // add a transition end detector to just the first element that will be changed:
        document.getElementById("slot" + whichSlotsToUpdate[0]).addEventListener(whichTransitionEvent, function removeSlotStatus(e) {
            elementList = document.querySelectorAll('#inventoryPanels .changed');
            for (var i = 0; i < elementList.length; i++) {
                
                elementList[i].classList.remove("changed");
            }
            // remove the event listener now:
            return e.currentTarget.removeEventListener(whichTransitionEvent, removeSlotStatus, false);
        }, false);
        // loop through the slots that have changed and update their markup:
        for (var j = 0; j < whichSlotsToUpdate.length; j++) {
            thisSlotsId = whichSlotsToUpdate[j];

            slotMarkup = generateSlotMarkup(thisSlotsId);

            thisSlotElem = document.getElementById("slot" + thisSlotsId);
            thisSlotElem.innerHTML = slotMarkup;
thisSlotElem.classList.add("changed")
            
        }
    },


    handleDrag: function(e) {
     
            // don't access the element multiple times - do it all in one go:
            UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(" + (e.pageX - dragStartX) + "px, " + (e.pageY - dragStartY) + "px);";
       
    },

    endDrag: function(e) {
       
        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endDrag, false);
        UI.activeDragObject = '';
    },

    initDrag: function(whichElement) {

        var dragTargets = document.querySelectorAll(whichElement);
        for (var i = 0; i < dragTargets.length; i++) {
            dragTargets[i].addEventListener("mousedown", function(e) {
                // make sure it's not a right click:
                if (e.button != 2) {
                    UI.activeDragObject = this.parentElement;
                    

                    var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);

                    var clickedSlotRect = this.getBoundingClientRect();
                    objInitLeft = clickedSlotRect.left;
                    objInitTop = clickedSlotRect.top + pageScrollTopY;
                    dragStartX = e.pageX;
                    dragStartY = e.pageY;

                    document.addEventListener("mousemove", UI.handleDrag, false);
                    document.addEventListener("mouseup", UI.endDrag, false);
                    // remove z-index of other draggable elements:
                    var dragTargetsInner = document.querySelectorAll(whichElement);
                    for (j = 0; j < dragTargetsInner.length; j++) {
                        dragTargets[j].parentElement.style.zIndex = 1;
                    }
                }
            }, false);
        }
    },

    inventoryItemDoubleClick: function(e) {

        var thisItemsAction = e.target.getAttribute('data-action');

        if (thisItemsAction) {

            inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        }
    },

    showDialogue: function(whichNPC, text) {
        // check for random variation in text:

var textToShow = getRandomElementFromArray(text.split("/"));

        if (activeNPCForDialogue != '') {

            dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        }
        dialogue.innerHTML = textToShow;
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
        for (var i = 0; i < 30; i++) {
            if (hero.cards[i]) {
                cardAlbumMarkup += '<li><img src="/images/card-game/cards/' + hero.cards[i] + '.png" class="card players" alt="' + cardGameNameSpace.allCardData[(hero.cards[i])][2] + ' card"></li>';
            } else {
                cardAlbumMarkup += '<li></li>';
            }
        }
        cardAlbumList.innerHTML = cardAlbumMarkup;
    },

    populateRecipeList: function(whichProfession) {
        if (currentRecipePanelProfession != whichProfession) {
            // clear previous searches:
            recipeSearch.value = '';
            clearRecipeSearch.classList.remove("active");
            var recipeMarkup = '<li id="noRecipesFound"><p>No recipes found.</p></li>';
            var thisRecipe;
            var filterMarkup = '';
            var thisFilter;

            for (var i = 0; i < hero.crafting[whichProfession].sortOrder.length; i++) {
                thisRecipe = hero.crafting[whichProfession].recipes[(hero.crafting[whichProfession].sortOrder[i])];
                recipeMarkup += '<li class="active" id="recipe' + hero.crafting[whichProfession].sortOrder[i] + '"><img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p></li>';
            }

            createRecipeList.innerHTML = recipeMarkup;

            for (var i = 0; i < hero.crafting[whichProfession].filterOrder.length; i++) {
                thisFilter = hero.crafting[whichProfession].filters[(hero.crafting[whichProfession].filterOrder[i])];
                filterMarkup += '<option value="' + thisFilter + '"';
                if (i == 0) {
                    filterMarkup += ' selected="selected"';
                }
                filterMarkup += '>' + hero.crafting[whichProfession].filterOrder[i] + '</option>';
            }
            recipeFilter.innerHTML = filterMarkup;
            currentRecipePanelProfession = whichProfession;
            UI.highlightedRecipe = "";
            craftingRecipeCreateButton.disabled = true;
            recipeTitleBar.innerHTML = hero.crafting[whichProfession].name + ' Recipes';
            // resize the scroll bar:
     
            recipeCustomScrollBar.init();
        }
    },

    buildRecipePanel: function() {
        recipeSearch.onkeyup = recipeSearchInput;
        recipeFilter.onchange = recipeSearchAndFilter;
        clearRecipeSearch.onclick = recipeSearchClear;
    },

    endInventoryDrag: function(e) {
      
        var thisNode = e.target;
        // find the id of the parent if actual dropped target doesn't have one:
        while (!thisNode.id) {
            thisNode = thisNode.parentNode;
        }
        var droppedSlot = thisNode.id;
        if (droppedSlot.substring(0, 4) == "slot") {
            // check it's empty:
            var droppedSlotId = droppedSlot.substring(4);
            if (hero.inventory[droppedSlotId] == undefined) {
                if (isSplitStackBeingDragged) {
                    // document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                    addToInventory(droppedSlotId, UI.draggedInventoryObject);
                } else {

                    if (UI.sourceSlot != droppedSlotId) {
                        document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                        addToInventory(droppedSlotId, UI.draggedInventoryObject);
                    } else {
                        hero.inventory[droppedSlotId] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
                    }
                    document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                }
                UI.droppedSuccessfully();
            } else {

                if (itemAttributesMatch(UI.draggedInventoryObject, hero.inventory[droppedSlotId])) {

                    if (parseInt(UI.draggedInventoryObject.quantity) + parseInt(hero.inventory[droppedSlotId].quantity) <= maxNumberOfItemsPerSlot) {

                        hero.inventory[droppedSlotId].quantity += parseInt(UI.draggedInventoryObject.quantity);
                        // update visually:
                        var thisSlotElem = document.getElementById("slot" + droppedSlotId);
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = hero.inventory[droppedSlotId].quantity;
                                break;
                            }
                        }
                        if (!isSplitStackBeingDragged) {
                            document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                            document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                        }
                        UI.droppedSuccessfully();
                    } else {
                        // add in the max, and slide the remainder back:
                        var amountAddedToThisSlot = maxNumberOfItemsPerSlot - parseInt(hero.inventory[droppedSlotId].quantity);
                        hero.inventory[droppedSlotId].quantity = maxNumberOfItemsPerSlot;
                        // update visually:
                        var thisSlotElem = document.getElementById("slot" + droppedSlotId);
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = hero.inventory[droppedSlotId].quantity;
                                break;
                            }
                        }
                        // update dragged item quantity and then slide back:
                        UI.draggedInventoryObject.quantity -= amountAddedToThisSlot;
                        // update visually to drop slot:
                        var thisSlotElem = document.getElementById("slot" + UI.sourceSlot);
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = UI.draggedInventoryObject.quantity;
                                break;
                            }
                        }
                        // update visually to dragged clone:
                        var thisSlotElem = document.getElementById('draggableInventorySlot');
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = UI.draggedInventoryObject.quantity;
                                break;
                            }
                        }
                        UI.slideDraggedSlotBack();
                    }
                } else {
                    // otherwise slide it back
                    UI.slideDraggedSlotBack();
                }
            }
        } else if (droppedSlot.substring(0, 12) == "inventoryBag") {
            // if it's the same panel is the slot came from, just slide back:
            var thisInventoryPanelId = droppedSlot.substring(12);
            var sourceSlotHyphenPos = UI.sourceSlot.indexOf("-");
            var thisSourceInventoryPanelId = UI.sourceSlot.substring(0, sourceSlotHyphenPos);
            if (thisInventoryPanelId == thisSourceInventoryPanelId) {
                UI.slideDraggedSlotBack();
            } else {
                // otherwise find an empty slot and drop it in:
                var emptySlotFound = -1;
                var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[thisInventoryPanelId].type].actionValue;
                // loop through slots for this bag:
                for (var j = 0; j < thisBagNumberOfSlots; j++) {
                    var thisSlotsID = thisInventoryPanelId + '-' + j;
                    if (!(thisSlotsID in hero.inventory)) {
                        emptySlotFound = j;
                        break;
                    }
                }
                if (emptySlotFound != -1) {
                    document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                    addToInventory(thisInventoryPanelId + "-" + emptySlotFound, UI.draggedInventoryObject);
                    document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                    UI.droppedSuccessfully();
                } else {
                    UI.slideDraggedSlotBack();
                }
            }
        } else {
            UI.slideDraggedSlotBack();
        }

        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endInventoryDrag, false);
    },

    droppedSuccessfully: function() {
        // hide the clone:
        UI.activeDragObject.style.cssText = "z-index:2;";
        UI.activeDragObject = '';
        if (isSplitStackBeingDragged) {
            isSplitStackBeingDragged = false;
        }
    },

    initInventoryDrag: function() {
        var dragTargets = document.querySelectorAll('.inventoryBag ol');
        for (var i = 0; i < dragTargets.length; i++) {
            dragTargets[i].addEventListener("mousedown", function(e) {
                e.preventDefault();
                // make sure it's not a right click:
                if (e.button != 2) {
                    var thisNode = getNearestParentId(e.target);
                    // check if the shift key is pressed as well:
                    if (key[5]) {
                        UI.sourceSlot = thisNode.id.substring(4);
                        // make a copy of the object, not a reference:
                        UI.draggedInventoryObject = JSON.parse(JSON.stringify(hero.inventory[UI.sourceSlot]));
                        splitStackInput.setAttribute("max", hero.inventory[UI.sourceSlot].quantity);
                        // set default value to half the current slot:
                        var defaultSplitValue = Math.floor(hero.inventory[UI.sourceSlot].quantity / 2);
                        splitStackInput.value = defaultSplitValue;
                        splitStackInput.focus();
                        splitStackInput.setSelectionRange(0, defaultSplitValue.toString().length);
                        var clickedSlotRect = thisNode.getBoundingClientRect();
                        var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                        // 3px padding on the slots:
                        // -44 for the slot height:
                        objInitLeft = clickedSlotRect.left + 3;
                        objInitTop = clickedSlotRect.top + 3 + pageScrollTopY - 44;
                        splitStackPanel.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
                        splitStackPanel.classList.add("active");
                        key[5] = 0;
                    } else {
                        if (!isSplitStackBeingDragged) {
                            UI.sourceSlot = thisNode.id.substring(4);
                            UI.draggedInventoryObject = hero.inventory[UI.sourceSlot];

                            // clone this slot to draggableInventorySlot:
                            UI.activeDragObject = document.getElementById('draggableInventorySlot');
                            UI.activeDragObject.innerHTML = thisNode.innerHTML;
                            // remove from inventory data:
                            delete hero.inventory[UI.sourceSlot];
                            thisNode.classList.add("hidden");
                            
                            var clickedSlotRect = thisNode.getBoundingClientRect();
                            var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                            // 3px padding on the slots:
                            objInitLeft = clickedSlotRect.left + 3;
                            objInitTop = clickedSlotRect.top + 3 + pageScrollTopY;
                            dragStartX = e.pageX;
                            dragStartY = e.pageY;
                            UI.activeDragObject.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
                            document.addEventListener("mousemove", UI.handleDrag, false);
                            document.addEventListener("mouseup", UI.endInventoryDrag, false);
                        }
                    }
                }
            }, false);
        }
    },

    slideDraggedSlotBack: function() {
        // slide it back visually - add a transition:
        UI.activeDragObject.style.cssText = "z-index:2;left: " + (objInitLeft) + "px; top: " + (objInitTop) + "px;transition: transform 0.4s ease;";
        UI.activeDragObject.addEventListener(whichTransitionEvent, function snapDraggedSlotBack(e) {
            // it's now back, so restore to the inventory:
            if (!isSplitStackBeingDragged) {
                hero.inventory[UI.sourceSlot] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
                document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
            } else {
                // update quantity on the original slot
                hero.inventory[UI.sourceSlot].quantity += UI.draggedInventoryObject.quantity;
                var thisSlotElem = document.getElementById("slot" + UI.sourceSlot);
                for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                    if (thisSlotElem.childNodes[i].className == "qty") {
                        thisSlotElem.childNodes[i].innerHTML = hero.inventory[UI.sourceSlot].quantity;
                        break;
                    }
                }
            }
            // hide the clone:
            UI.droppedSuccessfully();
            // remove this event listener now:
            return e.currentTarget.removeEventListener(whichTransitionEvent, snapDraggedSlotBack, false);
        }, false);
    },

    removeActiveDialogue: function() {
        activeNPCForDialogue = '';
        dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
    },

    craftingPanelDoubleClick: function(e) {
     var thisNode = getNearestParentId(e.target);
        if (thisNode.id.substring(0, 6) == "recipe") {
            recipeSelectComponents(thisNode.id);
        }
    },

    craftingPanelSingleClick: function(e) {


      
    

var thisNode = getNearestParentId(e.target);

        if (thisNode.id.substring(0, 6) == "recipe") {
            if (UI.highlightedRecipe != "") {
                document.getElementById(UI.highlightedRecipe).classList.remove('highlighted');
            }
            UI.highlightedRecipe = thisNode.id;
            document.getElementById(UI.highlightedRecipe).classList.add('highlighted');
            craftingRecipeCreateButton.disabled = false;
        }

    },

    craftingRecipeCreate: function() {
        if (UI.highlightedRecipe != "") {
            recipeSelectComponents(UI.highlightedRecipe);
        }
    }
}
