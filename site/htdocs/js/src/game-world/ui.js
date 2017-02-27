// global vars:
var recipeSearch = document.getElementById('recipeSearch');
var clearRecipeSearch = document.getElementById('clearRecipeSearch');
var recipeFilter = document.getElementById('recipeFilter');
var splitStackInput = document.getElementById('splitStackInput');
var splitStackPanel = document.getElementById('splitStackPanel');
var shopSplitStackInput = document.getElementById('shopSplitStackInput');
var shopSplitStackPanel = document.getElementById('shopSplitStackPanel');
var craftingRecipeCreateButton = document.getElementById('craftingRecipeCreateButton');
var craftingPanel = document.getElementById('craftingPanel');
var selectComponentsItemBeingCreated = document.getElementById('selectComponentsItemBeingCreated');
var componentsAvailableForThisRecipe = document.getElementById('componentsAvailableForThisRecipe');
var booksAndParchments = document.getElementById('booksAndParchments');
var gameWrapper = document.getElementById('gameWrapper');
var inventoryPanels = document.getElementById('inventoryPanels');
var shopPanel = document.getElementById('shopPanel');

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
        var currencies = document.getElementById('currencies');
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
        var thisAction, thisBagNumberOfSlots, thisSlotsID;

        // loop through number of bags
        for (var i = 0; i < hero.bags.length; i++) {
            inventoryMarkup += '<div class="inventoryBag" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
            thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                thisSlotsID = i + '-' + j;
                inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {
                    inventoryMarkup += generateSlotMarkup(thisSlotsID);
                    thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;
                } else {
                    inventoryMarkup += '';
                }
                // add item there
                inventoryMarkup += '</li>';
            }
            inventoryMarkup += '</ol></div></div>';
        }

        inventoryPanels.innerHTML = inventoryMarkup;
        gameWrapper.ondblclick = UI.doubleClick;
        document.getElementById('createRecipeList').onclick = UI.craftingPanelSingleClick;
        document.getElementById('craftingRecipeCreateButton').onclick = UI.craftingRecipeCreate;
        splitStackPanel.onsubmit = inventorySplitStackSubmit;
        shopSplitStackPanel.onsubmit = UI.shopSplitStackSubmit;
        document.getElementById('splitStackCancel').onclick = inventorySplitStackCancel;
        document.getElementById('shopSplitStackCancel').onclick = UI.shopSplitStackCancel;
        UI.initInventoryDrag('.inventoryBag ol');
        UI.initShopDrag();
        UI.updateCardAlbum();
        UI.updateCurrencies();
        UI.buildRecipePanel();
        if (hero.professionsKnown.length > 0) {
            // load and cache the first profession's recipe assets:
            UI.populateRecipeList(hero.professionsKnown[0]);
        }

        gameWrapper.onmousedown = UI.globalMouseDown;
        gameWrapper.onclick = UI.globalClick;

        inventoryInterfaceIsBuilt = true;
    },

    addNewBag: function(newBagObject) {
        // add to object:
        hero.bags.push(newBagObject);
        i = hero.bags.length - 1;
        inventoryMarkup = '<div class="inventoryBag" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
        var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
        for (var j = 0; j < thisBagNumberOfSlots; j++) {
            thisSlotsID = i + '-' + j;
            inventoryMarkup += '<li id="slot' + thisSlotsID + '"></li>';
        }
        inventoryMarkup += '</ol></div></div>';
        inventoryPanels.insertAdjacentHTML('beforeend', inventoryMarkup);
        UI.initInventoryDrag('#inventoryBag' + i + ' ol');
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

    globalMouseDown: function(e) {
        // check for startting a drag:
        if (e.target.className == "draggableBar") {
            // make sure it's not a right click:
            if (e.button != 2) {
                UI.activeDragObject = e.target.parentElement;
                var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                var clickedSlotRect = e.target.getBoundingClientRect();
                objInitLeft = clickedSlotRect.left;
                objInitTop = clickedSlotRect.top + pageScrollTopY;
                dragStartX = e.pageX;
                dragStartY = e.pageY;
                document.addEventListener("mousemove", UI.handleDrag, false);
                document.addEventListener("mouseup", UI.endDrag, false);
                // remove z-index of other draggable elements:
                var dragTargetsInner = document.querySelectorAll('.draggableBar');
                for (j = 0; j < dragTargetsInner.length; j++) {
                    dragTargetsInner[j].parentElement.style.zIndex = 1;
                }
            }
        }
    },

    doubleClick: function(e) {
        var thisItemsAction = e.target.getAttribute('data-action');
        if (thisItemsAction) {
            inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        } else {



            var thisNode = getNearestParentId(e.target);

            if (thisNode.id.substring(0, 6) == "recipe") {
                recipeSelectComponents(thisNode.id);
            } else if (thisNode.id.substring(0, 4) == "shop") {
                UI.buyFromShopSlot(thisNode.id);
            }
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
 
        // -40 x so the balloon tip is at '0' x
        var thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 40) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - whichNPC.centreY + (canvasHeight / 2))) - whichNPC.z) + "px)";
        dialogue.style.transform = thisTransform;
    },

    removeActiveDialogue: function() {
        activeNPCForDialogue = '';
        dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
    },


    showNotification: function(markup) {
        notification.classList.remove("active");
        notification.innerHTML = markup;
        void notification.offsetWidth;
        notification.classList.add('active');
    },

    updateCardAlbum: function() {
        var cardAlbumMarkup = '';
        var thisCardsClass, thisCardsQuantityOutput;

        // count quantities for each card:
        // http://stackoverflow.com/questions/5667888/counting-the-occurrences-of-javascript-array-elements#answer-5668029
        var counts = {};
        for (var i = 0; i < hero.cards.length; i++) {
            var num = hero.cards[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        // first element in allCardData is null
        for (var i = 1; i < cardGameNameSpace.allCardData.length; i++) {

            thisCardsClass = 'card players';
            thisCardsQuantityOutput = '';
            if (!(counts[i])) {
                thisCardsClass += ' inactive';
            } else {
                thisCardsQuantityOutput = '<span class="quantity">' + counts[i] + '</span>';
            }
            cardAlbumMarkup += '<li><img src="/images/card-game/cards/' + i + '.png" class="' + thisCardsClass + '" alt="' + cardGameNameSpace.allCardData[i][2] + ' card">' + thisCardsQuantityOutput + '</li>';

            // check for rares - these are the negative of the standard card type:
            if ((counts[(0 - i)])) {
                cardAlbumMarkup += '<li class="rare"><div class="card players" style="background-image:url(/images/card-game/cards/' + (0 - i) + '.png)"></div><span class="quantity">' + counts[(0 - i)] + '</span></li>';
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
            // resize the scroll bar (if it's used):
            if (recipeCustomScrollBar) {
                recipeCustomScrollBar.init();
            }
        }
        craftingPanel.classList.add("active");
    },

    buildRecipePanel: function() {
        recipeSearch.onkeyup = recipeSearchInput;
        recipeFilter.onchange = recipeSearchAndFilter;
        clearRecipeSearch.onclick = recipeSearchClear;
    },

    endInventoryDrag: function(e) {
        var isFromAShop = false;
        if (UI.sourceSlot.substring(0, 8) == "shopSlot") {
            isFromAShop = true;
            var thisSlotImageElement = document.getElementById(UI.sourceSlot).firstElementChild;
            var thisShopPanelElement = document.getElementById(UI.sourceSlot).parentNode.parentNode;
            var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
            var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
            var thisBoughtObject = {
                "type": parseInt(thisSlotImageElement.getAttribute('data-type')),
                "quantity": 1,
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": parseInt(thisSlotImageElement.getAttribute('data-colour')),
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
            if (thisSlotImageElement.hasAttribute('data-inscription')) {
                thisBoughtObject.inscription = thisSlotImageElement.getAttribute('data-inscription');
            }
            if (thisSlotImageElement.hasAttribute('data-contains')) {
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
        }

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
                    UI.droppedSuccessfully();
                } else {
                    if (isFromAShop) {
                        if (hero.currency[thisCurrency] >= buyPriceForOne) {
                            addToInventory(droppedSlotId, thisBoughtObject);
                            hero.currency[thisCurrency] -= buyPriceForOne;
                            UI.updateCurrencies();
                            UI.droppedSuccessfully();
                        } else {
                            UI.showNotification("<p>Not enough money</p>");
                            UI.slideDraggedSlotBack();
                        }
                    } else {
                        if (UI.sourceSlot != droppedSlotId) {
                            document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                            addToInventory(droppedSlotId, UI.draggedInventoryObject);
                        } else {
                            hero.inventory[droppedSlotId] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
                        }
                        document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                        UI.droppedSuccessfully();
                    }
                }
            } else {
                if (isFromAShop) {
                    if (itemAttributesMatch(thisBoughtObject, hero.inventory[droppedSlotId])) {
                        if (parseInt(hero.inventory[droppedSlotId].quantity) < maxNumberOfItemsPerSlot) {
                            // (is room for 1 more)
                            if (hero.currency[thisCurrency] >= buyPriceForOne) {
                                hero.inventory[droppedSlotId].quantity++;
                                updateQuantity(droppedSlotId);
                                hero.currency[thisCurrency] -= buyPriceForOne;
                                UI.updateCurrencies();
                                UI.droppedSuccessfully();
                            } else {
                                UI.showNotification("<p>Not enough money</p>");
                                UI.slideDraggedSlotBack();
                            }
                        } else {
                            UI.slideDraggedSlotBack();
                        }
                    } else {
                        // otherwise slide it back
                        UI.slideDraggedSlotBack();
                    }
                } else {
                    if (itemAttributesMatch(UI.draggedInventoryObject, hero.inventory[droppedSlotId])) {
                        if (parseInt(UI.draggedInventoryObject.quantity) + parseInt(hero.inventory[droppedSlotId].quantity) <= maxNumberOfItemsPerSlot) {
                            hero.inventory[droppedSlotId].quantity += parseInt(UI.draggedInventoryObject.quantity);
                            updateQuantity(droppedSlotId);
                            if (!isSplitStackBeingDragged) {
                                document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                                document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                            }
                            UI.droppedSuccessfully();
                        } else {
                            // add in the max, and slide the remainder back:
                            var amountAddedToThisSlot = maxNumberOfItemsPerSlot - parseInt(hero.inventory[droppedSlotId].quantity);
                            hero.inventory[droppedSlotId].quantity = maxNumberOfItemsPerSlot;
                            updateQuantity(droppedSlotId);
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
            }
        } else if (droppedSlot.substring(0, 12) == "inventoryBag") {
            if (isFromAShop) {
                if (hero.currency[thisCurrency] >= buyPriceForOne) {
                    // find an empty slot and drop it in:
                    var emptySlotFound = -1;
                    var thisInventoryPanelId = droppedSlot.substring(12);
                    var sourceSlotHyphenPos = UI.sourceSlot.indexOf("-");
                    var thisSourceInventoryPanelId = UI.sourceSlot.substring(0, sourceSlotHyphenPos);
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
                        hero.currency[thisCurrency] -= buyPriceForOne;
                        UI.updateCurrencies();
                        UI.droppedSuccessfully();
                        addToInventory(thisInventoryPanelId + "-" + emptySlotFound, thisBoughtObject);
                        UI.droppedSuccessfully();
                    } else {
                        UI.slideDraggedSlotBack();
                    }
                    UI.droppedSuccessfully();
                } else {
                    UI.showNotification("<p>Not enough money</p>");
                    UI.slideDraggedSlotBack();
                }
            } else {
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
                        if (!isSplitStackBeingDragged) {
                            document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
                        }

                        addToInventory(thisInventoryPanelId + "-" + emptySlotFound, UI.draggedInventoryObject);
                        document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                        UI.droppedSuccessfully();
                    } else {
                        UI.slideDraggedSlotBack();
                    }
                }
            }
        } else if (droppedSlot.substring(0, 8) == "shopSlot") {
            // shop slot:
UI.sellToShop(thisNode.parentNode.parentNode);
            
        } else if(thisNode.classList.contains('shop')) {
            // shop panel:
UI.sellToShop(thisNode);
        } else {
            UI.slideDraggedSlotBack();
        }

        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endInventoryDrag, false);
    },


sellToShop: function(thisShopPanelElement) {
// check to see if it's being sold to a relevant specialist shop:
            var thisItemsCategories = currentActiveInventoryItems[UI.draggedInventoryObject.type].category;
       
            var thisShopsSpecialism = thisShopPanelElement.getAttribute('data-specialism');
            var sellPrice;
            var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
            if (!isSplitStackBeingDragged) {
                if (thisItemsCategories.indexOf(thisShopsSpecialism) != -1) {
                    sellPrice = Math.ceil(UI.draggedInventoryObject.quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[UI.draggedInventoryObject.type].priceCode, 0);
                } else {
                    sellPrice = Math.ceil(UI.draggedInventoryObject.quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[UI.draggedInventoryObject.type].priceCode, 0);
                }
                hero.currency[thisCurrency] += sellPrice;
                UI.updateCurrencies();
                document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
            }
            UI.droppedSuccessfully();
},

    droppedSuccessfully: function() {
        // hide the clone:
        UI.activeDragObject.style.cssText = "z-index:2;";
        UI.activeDragObject = '';
        if (isSplitStackBeingDragged) {
            isSplitStackBeingDragged = false;
        }
    },

    initInventoryDrag: function(whichElements) {
        var dragTargets = document.querySelectorAll(whichElements);
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


                        // can't set selection for number type input:
                        // http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                        //   splitStackInput.setSelectionRange(0, defaultSplitValue.toString().length);
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
    },

    buildBook: function(whichBook) {
        var markupToAdd = '';
        // var parsedDoc, numberOfPages;
        // var parser = new DOMParser();
        console.log(hero.inventory[(whichBook)].inscription);
        var thisBooksContent = hero.inventory[(whichBook)].inscription.content;
        var thisBooksHash = generateHash(thisBooksContent);
        // check if the book already has been created:
        if (!document.getElementById('book' + thisBooksHash)) {
            markupToAdd += '<div class="book" id="book' + thisBooksHash + '">';
            markupToAdd += '<div class="draggableBar">&quot;' + hero.inventory[(whichBook)].inscription.title + '&quot;</div>';
            markupToAdd += '<button class="closePanel">close</button>';
            /*
                        // determine the number of pages (identified by the <section> elements):
                        parsedDoc = parser.parseFromString(hero.inventory[(whichBook)].inscription.content, "text/html");
                        numberOfPages = parsedDoc.getElementsByTagName("SECTION").length;
                        if(numberOfPages>1) {

                        } else {
                             markupToAdd += hero.inventory[(whichBook)].inscription.content;
                        }
                       */
            markupToAdd += hero.inventory[(whichBook)].inscription.content;
            markupToAdd += '</div>';
            booksAndParchments.innerHTML += markupToAdd;
            // UI.initDrag('book' + thisBooksHash + ' .draggableBar');
        }
    },

    globalClick: function(e) {
        if (e.target.className) {
            if (e.target.className == "closePanel") {
                e.target.parentNode.classList.remove("active");
                // check if it's a shop panel:
                if (e.target.parentNode.classList.contains("shop")) {
                    shopCurrentlyOpen = -1;
                    inventoryPanels.removeAttribute('class');
                    // close shop dialogue as well:
                    if (activeNPCForDialogue != '') {
                        //  dialogue.classList.add("slowerFade");
                        dialogue.classList.remove("active");
                        activeNPCForDialogue.speechIndex = 0;
                        UI.removeActiveDialogue();

                    }
                }
            }
        }
    },


    updateCurrencies: function() {
        currencies.innerHTML = '<p>' + parseMoney(hero.currency.money) + '</p><p>' + hero.currency.cardDust + '<span class="card"><span></p>';
    },

    buildShop: function(markup) {
        shopPanel.innerHTML = markup;
    },

    openShop: function(shopHash) {
        shopCurrentlyOpen = shopHash;
        document.getElementById("shop" + shopHash).classList.add("active");
        inventoryPanels.classList.add("shopSpecialism"+document.getElementById("shop" + shopHash).getAttribute('data-specialism'));
    },

    closeShop: function() {
        document.getElementById("shop" + shopCurrentlyOpen).classList.remove("active");
        shopCurrentlyOpen = -1;
        inventoryPanels.removeAttribute('class');

    },

    shopSplitStackCancel: function() {
        shopSplitStackPanel.classList.remove("active");
    },

    buyFromShopSlot: function(slotId) {
        var thisSlotElement = document.getElementById(slotId);
        var thisSlotImageElement = thisSlotElement.firstElementChild;
        var thisShopPanelElement = thisSlotElement.parentNode.parentNode;
        var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
        var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
        if (hero.currency[thisCurrency] >= buyPriceForOne) {
            var thisBoughtObject = {
                "type": parseInt(thisSlotImageElement.getAttribute('data-type')),
                "quantity": 1,
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": parseInt(thisSlotImageElement.getAttribute('data-colour')),
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
            if (thisSlotImageElement.hasAttribute('data-inscription')) {
                thisBoughtObject.inscription = thisSlotImageElement.getAttribute('data-inscription');
            }
            if (thisSlotImageElement.hasAttribute('data-contains')) {
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
            inventoryCheck = canAddItemToInventory([thisBoughtObject]);
            if (inventoryCheck[0]) {
                hero.currency[thisCurrency] -= buyPriceForOne;
                UI.updateCurrencies();
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
            }
        } else {
            UI.showNotification("<p>Oops - sorry, not enough money</p>");
        }
        // remove the drag slot that was created by the single click:
        UI.activeDragObject.innerHTML = '';
    },

    initShopDrag: function() {
        document.getElementById("shopPanel").addEventListener("mousedown", function(e) {
            var thisNode = getNearestParentId(e.target);
// check it's a slot and not the close or draggable bar:
            if(thisNode.id.substring(0,8) == "shopSlot") {
            e.preventDefault();
            // make sure it's not a right click:
            if (e.button != 2) {
                // check if the shift key is pressed as well:
                if (key[5]) {
                    UI.sourceSlot = thisNode;
                    var thisSlotImageElement = thisNode.firstElementChild;
                    var thisShopPanelElement = thisNode.parentNode.parentNode;
                    var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
                    var thisCurrency = thisShopPanelElement.getAttribute('data-currency');

                    // work out the max they can buy with the relevant currency:
                    var maxThatCanBeBought = Math.floor(hero.currency[thisCurrency] / buyPriceForOne);

                    if (maxThatCanBeBought > maxNumberOfItemsPerSlot) {
                        maxThatCanBeBought = maxNumberOfItemsPerSlot;
                    }
                    shopSplitStackInput.setAttribute("max", maxThatCanBeBought);
                    shopSplitStackInput.value = 1;
                    shopSplitStackInput.focus();
                    // can't set selection for number type input:
                    // http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                    //   splitStackInput.setSelectionRange(0, defaultSplitValue.toString().length);
                    var clickedSlotRect = thisNode.getBoundingClientRect();
                    var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                    // 3px padding on the slots:
                    // -44 for the slot height:
                    objInitLeft = clickedSlotRect.left + 3;
                    objInitTop = clickedSlotRect.top + 3 + pageScrollTopY - 44;
                    shopSplitStackPanel.style.cssText = "z-index:2;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
                    shopSplitStackPanel.classList.add("active");
                    key[5] = 0;
                } else {
                    // this will fire for double click as well


                      UI.sourceSlot = thisNode.id;
                            UI.draggedInventoryObject = hero.inventory[UI.sourceSlot];

                            // clone this slot to draggableInventorySlot:
                            UI.activeDragObject = document.getElementById('draggableShopSlot');
                            UI.activeDragObject.innerHTML = thisNode.innerHTML;
                

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
    },

    shopSplitStackSubmit: function(e) {
        if (e) {
            e.preventDefault();
        }
        var enteredValue = shopSplitStackInput.value;
        var isValid = true;
        enteredValue = parseInt(enteredValue);
        if (enteredValue < 1) {
            isValid = false;
        }
        if (!(Number.isInteger(enteredValue))) {
            isValid = false;
        }
        if (enteredValue > shopSplitStackInput.getAttribute("max")) {
            // this will check if they can afford it as well as not being over a single slot maximum:
            isValid = false;
        }
        if (isValid) {
            var thisSlotImageElement = UI.sourceSlot.firstElementChild;
            var thisShopPanelElement = UI.sourceSlot.parentNode.parentNode;
            var buyPriceForOne = thisSlotImageElement.getAttribute('data-price');
            var thisCurrency = thisShopPanelElement.getAttribute('data-currency');
            var thisBoughtObject = {
                "type": parseInt(thisSlotImageElement.getAttribute('data-type')),
                "quantity": enteredValue,
                "quality": 100,
                "durability": 100,
                "currentWear": 0,
                "effectiveness": 100,
                "colour": parseInt(thisSlotImageElement.getAttribute('data-colour')),
                "enchanted": 0,
                "hallmark": 0,
                "inscription": ""
            }
            if (thisSlotImageElement.hasAttribute('data-inscription')) {
                thisBoughtObject.inscription = thisSlotImageElement.getAttribute('data-inscription');
            }
            if (thisSlotImageElement.hasAttribute('data-contains')) {
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
            inventoryCheck = canAddItemToInventory([thisBoughtObject]);
            if (inventoryCheck[0]) {
                hero.currency[thisCurrency] -= (enteredValue * buyPriceForOne);
                UI.updateCurrencies();
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
            }
        }
        shopSplitStackPanel.classList.remove("active");
    },

}
