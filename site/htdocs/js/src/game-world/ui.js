// global vars:
const recipeSearch = document.getElementById('recipeSearch');
const clearRecipeSearch = document.getElementById('clearRecipeSearch');
const recipeFilter = document.getElementById('recipeFilter');
const splitStackInput = document.getElementById('splitStackInput');
const splitStackPanel = document.getElementById('splitStackPanel');
const shopSplitStackInput = document.getElementById('shopSplitStackInput');
const shopSplitStackPanel = document.getElementById('shopSplitStackPanel');
const craftingRecipeCreateButton = document.getElementById('craftingRecipeCreateButton');
const craftingPanel = document.getElementById('craftingPanel');
const craftingSelectComponentsPanel = document.getElementById('craftingSelectComponentsPanel');
const selectComponentsItemBeingCreated = document.getElementById('selectComponentsItemBeingCreated');
const componentsAvailableForThisRecipe = document.getElementById('componentsAvailableForThisRecipe');
const booksAndParchments = document.getElementById('booksAndParchments');
const gameWrapper = document.getElementById('gameWrapper');
const inventoryPanels = document.getElementById('inventoryPanels');
const shopPanel = document.getElementById('shopPanel');
const inscriptionPanel = document.getElementById('inscriptionPanel');
const inscriptionTextArea = document.getElementById('inscriptionTextArea');
const sourceSelection = document.getElementById('sourceSelection');
const materialsSelection = document.getElementById('materialsSelection');
const inkSelection = document.getElementById('inkSelection');
const originalText = document.getElementById('originalText');
const scribeCopyText = document.getElementById('scribeCopyText');
const scribeOriginalText = document.getElementById('scribeOriginalText');
const scribeStartInscription = document.getElementById('scribeStartInscription');
const inscriptionTitle = document.getElementById('inscriptionTitle');
const soundVolume = document.getElementById('soundVolume');
const musicVolume = document.getElementById('musicVolume');
const gameSettingsPanel = document.getElementById('gameSettings');
const toggleActiveCards = document.getElementById('toggleActiveCards');
const toggleFullscreenSwitch = document.getElementById('toggleFullScreen');
const collectionQuestPanels = document.getElementById('collectionQuestPanels');
const chestPanel = document.getElementById('chestPanel');
const chestTitle = document.getElementById('chestTitle');
const chestSlotContents = document.getElementById('chest');
const interfaceWrapper = document.getElementById('interface');
const actionBar = document.getElementById('actionBar');
const gatheringPanel = document.getElementById('gatheringPanel');
const gatheringBarQuality = document.querySelector('#gatheringQualityBar .progressBar');
const gatheringBarPurity = document.querySelector('#gatheringPurityBar .progressBar');
const gatheringBarQuantity = document.querySelector('#gatheringQuantityBar .progressBar');
const gatheringBarStability = document.querySelector('#gatheringBarStability .progressBar');
const surveyingTimeBar = document.querySelector('#surveyingTimeBar .progressBar');
const gatheringOutputSlot = document.getElementById('gatheringOutputSlot');
const surveyingPanel = document.getElementById('surveyingPanel');
const questJournalEntries = document.getElementById('questJournalEntries');
const questJournalRegionFilter = document.getElementById('questJournalRegionFilter');
const acceptQuestChoice = document.getElementById('acceptQuestChoice');
const questDecline = document.getElementById('questDecline');
const questAccept = document.getElementById('questAccept');
const postPanel = document.getElementById('postPanel');
const sendPostTab = document.getElementById('sendPostTab');
const sendPostPanel = document.getElementById('sendPostPanel');
const receivedPostTab = document.getElementById('receivedPostTab');
const receivedPostPanel = document.getElementById('receivedPostPanel');
const sendPostSubject = document.getElementById('sendPostSubject');
const sendPostMessage = document.getElementById('sendPostMessage');
const newPost = document.getElementById('newPost');

var notificationQueue = [];
var notificationIsShowing = false;

var UI = {
    init: function() {
        // cache all local references to UI elements:
        const displayZoneName = document.getElementById('displayZoneName');
        const activeCartographicMap = document.getElementById('activeCartographicMap');
        const cartographicTitle = document.getElementById('cartographicTitle');
        const dialogue = document.getElementById('dialogue');
        const notification = document.getElementById('notification');
        const cardGameWrapper = document.getElementById('cardGameWrapper');
        const cardAlbumList = document.getElementById('cardAlbumList');
        const boosterPack = document.getElementById('boosterPack');
        const createRecipeList = document.getElementById('createRecipeList');
        const recipeTitleBar = document.getElementById('recipeTitleBar');
        const currencies = document.getElementById('currencies');

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
        var thisAction, thisBagNumberOfSlots, thisSlotsID, thisPanelName, thisPet, activeClass;

        for (var i = 0; i < hero.bags.length; i++) {
            thisPanelName = currentActiveInventoryItems[hero.bags[i].type].shortname;
            thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
            inventoryMarkup += '<div class="inventoryBag active" id="inventoryBag' + i + '"><div class="draggableBar">' + thisPanelName + '</div><ol id="bag' + i + '">';
            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                thisSlotsID = i + '-' + j;
                inventoryMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {
                    inventoryMarkup += generateSlotMarkup(thisSlotsID);
                    thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;
                    // check for cooldown attribute, and add a timer if so:
                    if (typeof hero.inventory[thisSlotsID].cooldown !== "undefined") {
                        hero.inventory[thisSlotsID].cooldownTimer = 0;
                    }
                } else {
                    inventoryMarkup += '';
                }
                // add item there
                inventoryMarkup += '</li>';

            }
            inventoryMarkup += '</ol></div></div>';
        }
        // add pet inventory panels:
        for (var i = 0; i < hero.allPets.length; i++) {
            thisPet = hero.allPets[i];
            if (thisPet.inventorySize > 0) {
                activeClass = '';
                if (hero.activePets.indexOf(i) != -1) {
                    activeClass = ' active';
                }
                inventoryMarkup += '<div class="inventoryBag' + activeClass + '" id="petInventoryBag' + i + '"><div class="draggableBar">' + thisPet.name + '</div><ol id="bag' + i + '">';
                // loop through slots for each bag:
                for (var j = 0; j < thisPet.inventorySize; j++) {
                    thisSlotsID = 'p' + i + '-' + j;
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
        }

        inventoryPanels.innerHTML = inventoryMarkup;
        gameWrapper.ondblclick = UI.doubleClick;
        gameWrapper.addEventListener("contextmenu", UI.handleRightClick, false);
        createRecipeList.onclick = UI.craftingPanelSingleClick;
        postPanel.onclick = UI.postPanelSingleClick;
        document.getElementById('craftingRecipeCreateButton').onclick = UI.craftingRecipeCreate;
        splitStackPanel.onsubmit = inventorySplitStackSubmit;
        shopSplitStackPanel.onsubmit = UI.shopSplitStackSubmit;
        toggleActiveCards.onclick = UI.toggleCardsDisplayed;
        document.getElementById('splitStackCancel').onclick = UI.inventorySplitStackCancel;
        document.getElementById('shopSplitStackCancel').onclick = UI.shopSplitStackCancel;
        toggleFullscreenSwitch.onchange = UI.toggleFullScreen;
        document.onfullscreenchange = UI.fullScreenChangeDetected;
        document.onmozfullscreenchange = UI.fullScreenChangeDetected;
        document.onwebkitfullscreenchange = UI.fullScreenChangeDetected;
        soundVolume.onchange = audio.adjustEffectsVolume;
        musicVolume.onchange = audio.adjustMusicVolume;
        UI.initInventoryDrag('.inventoryBag ol');
        document.getElementById('openSettings').onclick = UI.openSettings;
        actionBar.onclick = UI.actionBarClick;
        questDecline.onclick = declineQuest;
        questAccept.onclick = acceptQuest;
        UI.initShopDrag();
        UI.updateCardAlbum();
        UI.updateCurrencies();
        UI.buildRecipePanel();
        UI.updateInscriptionPanel();
        UI.getGameSettings();
        UI.buildCollectionPanel();
        UI.buildActionBar();

        if (hero.professionsKnown.length > 0) {
            // load and cache the first profession's recipe assets:
            UI.populateRecipeList(hero.professionsKnown[0]);
            // but hide the panel initially:
            craftingPanel.classList.remove("active");
        }

        gameWrapper.onmousedown = UI.globalMouseDown;
        gameWrapper.onclick = UI.globalClick;

        inventoryInterfaceIsBuilt = true;
    },

    toggleFullScreen: function() {
        if (toggleFullscreenSwitch.checked) {
            launchFullScreen(document.documentElement);
        } else {
            exitFullScreen();
        }
    },

    fullScreenChangeDetected: function() {
        // change the Settings toggle acordingly (in case the user used another means to come out of full screen mode):
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
            toggleFullscreenSwitch.checked = true;
        } else {
            toggleFullscreenSwitch.checked = false;
        }
    },

    addNewBag: function(newBagObject) {
        // add to object:
        hero.bags.push(newBagObject);
        var thisSlotsID;
        i = hero.bags.length - 1;
        var inventoryMarkup = '<div class="inventoryBag active" id="inventoryBag' + i + '"><div class="draggableBar">' + currentActiveInventoryItems[hero.bags[i].type].shortname + '</div><ol class="active" id="bag' + i + '">';
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
        var thisSlotsId, slotMarkup, thisSlotElem;
        // add a transition end detector to just the first element that will be changed:
        document.getElementById("slot" + whichSlotsToUpdate[0]).addEventListener(whichTransitionEvent, function removeSlotStatus(e) {
            var elementList = document.querySelectorAll('#inventoryPanels .changed');
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
        UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(" + (e.pageX - dragStartX) + "px, " + (e.pageY - dragStartY) + "px);";
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
                for (var j = 0; j < dragTargetsInner.length; j++) {
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
            } else if (thisNode.id.substring(0, 5) == "chest") {
                UI.addFromChest(thisNode.id);
            } else if (thisNode.id.substring(0, 9) == "gathering") {
                UI.addFromGathering();
            } else if (thisNode.id.substring(0, 11) == "postMessage") {
                UI.takePostAttachments(thisNode.id);
            } else if (thisNode.id.substring(0, 4) == "post") {

                UI.readPostMessage(thisNode.id);
            }
        }
    },

    showDialogue: function(thisObjectSpeaking, text) {

        // check for random variation in text:
        var textToShow = getRandomElementFromArray(text.split("/"));
        if (activeObjectForDialogue != '') {
            dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        }
        dialogue.innerHTML = textToShow;
        dialogue.classList.remove("slowerFade");
        dialogue.classList.add("active");
        activeObjectForDialogue = thisObjectSpeaking;
        UI.updateDialogue(activeObjectForDialogue);

    },

    updateDialogue: function(thisObjectSpeaking) {



        // maybe store these values if NPCs are never going to move while a speech balloon is attached to them? #####
        var thisX = findIsoCoordsX(thisObjectSpeaking.x, thisObjectSpeaking.y);
        var thisY = findIsoCoordsY(thisObjectSpeaking.x, thisObjectSpeaking.y);
        var thisTransform;
        // check if it's an NPC or not
        if (typeof thisObjectSpeaking.speech !== "undefined") {
            // -40 x so the balloon tip is at '0' x
            thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 40) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - thisObjectSpeaking.centreY + (canvasHeight / 2))) - thisObjectSpeaking.z) + "px)";
        } else {
            // the -20 and the -34 are arbitary numbers to get the position working better for the Notice item - will need adjusting to suit different notice graphics
            // (although, if the notice graphics themselves are invisible, and the poster is part of the terrain wall, then the centreX and centreY could be used to get this just right for each individual poster)
            // ###############
            thisTransform = "translate(" + Math.floor(thisX - hero.isox + (canvasWidth / 2) - 20) + "px," + Math.floor(0 - (canvasHeight - (thisY - hero.isoy - thisObjectSpeaking.centreY + (canvasHeight / 2))) - thisObjectSpeaking.z - 34) + "px)";
        }





        dialogue.style.transform = thisTransform;
    },

    removeActiveDialogue: function() {
        activeObjectForDialogue = '';
        dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        //thisObjectSpeaking = {};
    },

    showNotification: function(markup) {
        if (!notificationIsShowing) {
            // don't push it to the queue if it's already there:
            if (notificationQueue.indexOf(markup) === -1) {
                notificationQueue.push(markup);
            }
            notificationIsShowing = true;
            notification.classList.remove("active");
            notification.innerHTML = markup;
            // cause re-draw to reset the animation:
            notification.offsetHeight;
            notification.classList.add('active');
            notification.addEventListener(whichAnimationEvent, UI.notificationEnded, false);
        } else {
            if (notificationQueue.indexOf(markup) === -1) {
                notificationQueue.push(markup);
            }
        }
    },

    notificationEnded: function() {
        //  console.log(notificationQueue);
        // remove the one that's just been shown:
        notificationQueue.shift();
        notificationIsShowing = false;
        dialogue.removeEventListener(whichAnimationEvent, UI.notificationEnded, false);
        // see if any more need showing now:
        if (notificationQueue.length > 0) {
            UI.showNotification(notificationQueue[0]);
        }
    },

    updateCardAlbum: function() {
        var cardAlbumMarkup = '<ul>';
        var thisCardsClass, thisCardsQuantityOutput, foundThisType, parentClass, typesFound = 0;

        // count quantities for each card:
        // http://stackoverflow.com/questions/5667888/counting-the-occurrences-of-javascript-array-elements#answer-5668029
        var counts = {};
        for (var i = 0; i < hero.cards.length; i++) {
            var num = hero.cards[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        // first element in allCardData is null
        for (var i = 1; i < cardGameNameSpace.allCardData.length; i++) {
            foundThisType = false;
            thisCardsClass = 'card players';
            thisCardsQuantityOutput = '';
            parentClass = '';
            if (!(counts[i])) {
                parentClass = ' class="inactive"';
            } else {
                thisCardsQuantityOutput = '<span class="quantity">' + counts[i] + '</span>';
                foundThisType = true;
            }
            cardAlbumMarkup += '<li' + parentClass + '><img src="/images/card-game/cards/' + i + '.png" class="' + thisCardsClass + '" alt="' + cardGameNameSpace.allCardData[i][2] + ' card">' + thisCardsQuantityOutput + '</li>';

            // check for rares - these are the negative of the standard card type:
            if ((counts[(0 - i)])) {
                foundThisType = true;
                cardAlbumMarkup += '<li class="rare"><div class="card players" style="background-image:url(/images/card-game/cards/' + (0 - i) + '.png)"></div><span class="quantity">' + counts[(0 - i)] + '</span></li>';
            }
            if (foundThisType) {
                typesFound++;
            }
        }
        cardAlbumMarkup += '</ul>';
        cardAlbumMarkup += '<p>' + typesFound + ' types out of ' + (cardGameNameSpace.allCardData.length - 1) + '. Total individual cards: ' + hero.cards.length + '</p>';
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
            if (thisDevicesScrollBarWidth > 0) {
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
        var thisNode = getNearestParentId(e.target);
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
                            audio.playSound(soundEffects['coins'], 0);
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
                                audio.playSound(soundEffects['coins'], 0);
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
                            inventorySplitStackCancel();
                            UI.slideDraggedSlotBack();
                        }
                    } else {
                        // otherwise slide it back
                        UI.slideDraggedSlotBack();
                    }
                }
            }
        } else if (droppedSlot.substring(0, 12) == "inventoryBag") {
            var thisInventoryPanelId = droppedSlot.substring(12);
            var sourceSlotHyphenPos = UI.sourceSlot.indexOf("-");
            var thisSourceInventoryPanelId = UI.sourceSlot.substring(0, sourceSlotHyphenPos);
            var thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[thisInventoryPanelId].type].actionValue;
            var emptySlotFound = -1;
            if (isFromAShop) {
                if (hero.currency[thisCurrency] >= buyPriceForOne) {
                    // find an empty slot and drop it in:
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
                        audio.playSound(soundEffects['coins'], 0);
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
                if (thisInventoryPanelId == thisSourceInventoryPanelId) {
                    UI.slideDraggedSlotBack();
                } else {
                    // otherwise find an empty slot and drop it in:
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
            if (isFromAShop) {

                UI.slideDraggedSlotBack();
            } else {

                UI.sellToShop(thisNode.parentNode.parentNode);
            }

        } else if (thisNode.classList.contains('shop')) {
            // shop panel:
            if (isFromAShop) {
                UI.slideDraggedSlotBack();
            } else {
                UI.sellToShop(thisNode);
            }
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
        if (thisItemsCategories.indexOf(thisShopsSpecialism) != -1) {
            sellPrice = Math.ceil(UI.draggedInventoryObject.quantity * sellPriceSpecialismModifier * inflationModifier * currentActiveInventoryItems[UI.draggedInventoryObject.type].priceCode, 0);
        } else {
            sellPrice = Math.ceil(UI.draggedInventoryObject.quantity * sellPriceModifier * inflationModifier * currentActiveInventoryItems[UI.draggedInventoryObject.type].priceCode, 0);
        }
        hero.currency[thisCurrency] += sellPrice;
        UI.updateCurrencies();
        audio.playSound(soundEffects['coins'], 0);
        document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
        document.getElementById("slot" + UI.sourceSlot).innerHTML = '';
        UI.droppedSuccessfully();
    },

    droppedSuccessfully: function() {
        // this can get fired twice for double click, so just make sure it needs tidying up:
        if (UI.activeDragObject != "") {
            // hide the clone:
            UI.activeDragObject.style.cssText = "z-index:2;";
            UI.activeDragObject = '';
            if (isSplitStackBeingDragged) {
                isSplitStackBeingDragged = false;
            }
            inventorySplitStackCancel();
            UI.updatePanelsAfterInventoryChange();
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
                        splitStackPanel.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
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
                            UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
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
        UI.activeDragObject.style.cssText = "z-index:4;left: " + (objInitLeft) + "px; top: " + (objInitTop) + "px;transition: transform 0.4s ease;";
        UI.activeDragObject.addEventListener(whichTransitionEvent, function snapDraggedSlotBack(e) {
            // it's now back, so restore to the inventory:
            if (UI.sourceSlot.substring(0, 8) != 'shopSlot') {
                // not dragged from a shop
                if (!isSplitStackBeingDragged) {
                    hero.inventory[UI.sourceSlot] = JSON.parse(JSON.stringify(UI.draggedInventoryObject));
                    document.getElementById("slot" + UI.sourceSlot).classList.remove("hidden");
                } else {
                    // update quantity on the original slot
                    hero.inventory[UI.sourceSlot].quantity += UI.draggedInventoryObject.quantity;
                    var thisSlotElem = document.getElementById("slot" + UI.sourceSlot);
                    if (thisSlotElem) {
                        for (var i = 0; i < thisSlotElem.childNodes.length; i++) {
                            if (thisSlotElem.childNodes[i].className == "qty") {
                                thisSlotElem.childNodes[i].innerHTML = hero.inventory[UI.sourceSlot].quantity;
                                break;
                            }
                        }
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

    buildBook: function(whichBookObject, thisBooksHash) {
        var markupToAdd = '';
        // var parsedDoc, numberOfPages;


        var thisBooksContent = whichBookObject.inscription.content;

        // check if the book already has been created:
        if (!document.getElementById('book' + thisBooksHash)) {
            markupToAdd += '<div class="book inkColour' + whichBookObject.colour + '" id="book' + thisBooksHash + '">';
            markupToAdd += '<div class="draggableBar">&quot;' + whichBookObject.inscription.title + '&quot;</div>';
            markupToAdd += '<button class="closePanel">close</button>';
            /*
                        // determine the number of pages (identified by the <section> elements):
                        parsedDoc = new DOMParser().parseFromString(whichBookObject.inscription.content, "text/html");
                        numberOfPages = parsedDoc.getElementsByTagName("SECTION").length;
                        if(numberOfPages>1) {

                        } else {
                             markupToAdd += whichBookObject.inscription.content;
                        }
                       */
            markupToAdd += whichBookObject.inscription.content;
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
                    if (activeObjectForDialogue != '') {
                        //  dialogue.classList.add("slowerFade");
                        dialogue.classList.remove("active");
                        activeObjectForDialogue.speechIndex = 0;
                        UI.removeActiveDialogue();

                    }

                } else if (e.target.parentNode.id == "gatheringPanel") {
                    if (activeAction == "gather") {
                        gatheringStopped();
                    }
                } else if (e.target.parentNode.id == "surveyingPanel") {
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                } else if (e.target.parentNode.id == "inscriptionPanel") {

                    UI.resetInscriptionPanel();
                } else if (e.target.parentNode.id == "chestPanel") {
                    UI.closeChest();
                }
            }
        }
        var thisNode = getNearestParentId(e.target);
        if (thisNode.id.substring(0, 6) == "scribe") {
            UI.processInscriptionClick(thisNode);



        }




    },


    updateCurrencies: function() {
        currencies.innerHTML = '<p>' + parseMoney(hero.currency.money) + '</p><p>' + hero.currency.cardDust + '<span class="card"><span></p><p>' + hero.currency.keys.length + '<span class="keys"><span></p>';

    },

    buildShop: function(markup) {
        shopPanel.innerHTML = markup;
    },

    openShop: function(shopHash) {
        shopCurrentlyOpen = shopHash;
        document.getElementById("shop" + shopHash).classList.add("active");
        inventoryPanels.classList.add("shopSpecialism" + document.getElementById("shop" + shopHash).getAttribute('data-specialism'));
    },

    closeShop: function() {
        document.getElementById("shop" + shopCurrentlyOpen).classList.remove("active");
        shopCurrentlyOpen = -1;
        inventoryPanels.removeAttribute('class');

    },

    shopSplitStackCancel: function() {
        shopSplitStackPanel.classList.remove("active");
        document.activeElement.blur();
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
                audio.playSound(soundEffects['coins'], 0);
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
            if (!isSplitStackBeingDragged) {
                var thisNode = getNearestParentId(e.target);
                // check it's a slot and not the close or draggable bar:
                if (thisNode.id.substring(0, 8) == "shopSlot") {
                    e.preventDefault();
                    // make sure it's not a right click:
                    if (e.button != 2) {
                        UI.sourceSlot = thisNode;
                        // check if the shift key is pressed as well:
                        if (key[5]) {

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
                            shopSplitStackPanel.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px;";
                            shopSplitStackPanel.classList.add("active");
                            key[5] = 0;
                        } else {
                            // this will fire for double click as well


                            UI.sourceSlot = thisNode.id;
                            UI.draggedInventoryObject = {
                                "type": parseInt(thisNode.getAttribute('data-type')),
                                "quantity": 1,
                                "quality": 100,
                                "durability": 100,
                                "currentWear": 0,
                                "effectiveness": 100,
                                "colour": parseInt(thisNode.getAttribute('data-colour')),
                                "enchanted": 0,
                                "hallmark": 0,
                                "inscription": ""
                            }
                            if (thisNode.hasAttribute('data-inscription')) {
                                UI.draggedInventoryObject.inscription = thisNode.getAttribute('data-inscription');
                            }
                            if (thisNode.hasAttribute('data-contains')) {
                                UI.draggedInventoryObject.contains = thisNode.getAttribute('data-contains');
                            }




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
                            UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
                            document.addEventListener("mousemove", UI.handleDrag, false);
                            document.addEventListener("mouseup", UI.endInventoryDrag, false);

                        }
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
                audio.playSound(soundEffects['coins'], 0);
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
            }
        }
        shopSplitStackPanel.classList.remove("active");
        document.activeElement.blur();
    },


    openInscriptionPanel: function() {
        audio.playSound(soundEffects['bookOpen'], 0);
        // clear previous content:
        inscriptionTextArea.innerHTML = '';
        inscriptionPanel.classList.add("active");
    },

    resetInscriptionPanel: function() {
        // remove all highlighted elements
        var itemList = document.querySelectorAll('#inscriptionPanel li'),
            i;
        // hide all:
        for (i = 0; i < itemList.length; ++i) {
            itemList[i].classList.remove('selected');
        }

    },

    updateInscriptionPanel: function() {
        var allInksMarkup = '<h3>Inks available:</h3><ol>';
        var allSourceMarkup = '<h3>Documents available:</h3><ol>';
        var allMaterialsMarkup = '<h3>Materials available:</h3><ol>';
        var thisFileColourSuffix, thisColourName, theColourPrefix;
        for (var i in hero.inventory) {
            if (hero.inventory[i].type == 40) {
                thisFileColourSuffix = '';
                theColourPrefix = "";
                thisColourName = getColourName(hero.inventory[i].colour, hero.inventory[i].type);
                if (thisColourName != "") {
                    theColourPrefix = thisColourName + " ";
                    thisFileColourSuffix = "-" + thisColourName.toLowerCase();
                }
                allInksMarkup += '<li class="scribeInk" id="scribeInkFromSlot' + i + '"><img src="/images/game-world/inventory-items/40' + thisFileColourSuffix + '.png" alt="' + theColourPrefix + currentActiveInventoryItems[40].shortname + '">' + hero.inventory[i].quantity + '<h3>' + theColourPrefix + currentActiveInventoryItems[40].shortname + '</h3><p>' + currentActiveInventoryItems[40].description + '</p></li>';
            } else {
                var thisAction = currentActiveInventoryItems[hero.inventory[i].type].action;
                var isABook = false;
                if (thisAction) {
                    if (thisAction == "book") {
                        isABook = true;
                    }
                }
                if (isABook) {
                    if (hero.inventory[i].inscription.content) {
                        // has content, so add it to the source list:
                        allSourceMarkup += '<li class="scribeSource" id="scribeSourceFromSlot' + i + '"><img src="/images/game-world/inventory-items/' + hero.inventory[i].type + '.png" alt="' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '">' + hero.inventory[i].quantity + '<h3>' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '</h3><p>' + hero.inventory[i].inscription.title + '</p></li>';
                    } else {
                        // no content, add it to the materials list:
                        allMaterialsMarkup += '<li class="scribeMaterial" id="scribeMaterialFromSlot' + i + '"><img src="/images/game-world/inventory-items/' + hero.inventory[i].type + '.png" alt="' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '">' + hero.inventory[i].quantity + '<h3>' + currentActiveInventoryItems[hero.inventory[i].type].shortname + '</h3><p>' + currentActiveInventoryItems[hero.inventory[i].type].description + '</p></li>';
                    }
                }
            }
        }
        allInksMarkup += '</ol>';
        allSourceMarkup += '</ol>';
        allMaterialsMarkup += '</ol>';
        sourceSelection.innerHTML = allSourceMarkup;
        materialsSelection.innerHTML = allMaterialsMarkup;
        inkSelection.innerHTML = allInksMarkup;
        UI.inscription = {
            mode: 'original',
            selected: {
                source: '',
                material: '',
                ink: ''
            }

        };
        scribeStartInscription.setAttribute('disabled', 'disabled');
        inscriptionTitle.value = '';
        inscriptionTextArea.innerHTML = '';
    },

    processInscriptionClick: function(thisNode) {
        switch (thisNode.className) {
            case 'scribeSource':
                UI.inscription.selected.source = thisNode.id.substring(20);
                var itemList = document.querySelectorAll('#sourceSelection li'),
                    i;
                // hide all:
                for (i = 0; i < itemList.length; ++i) {
                    itemList[i].classList.remove('selected');
                }
                thisNode.classList.add('selected');
                break;
            case 'scribeMaterial':

                UI.inscription.selected.material = thisNode.id.substring(22);
                var itemList = document.querySelectorAll('#materialsSelection li'),
                    i;
                // hide all:
                for (i = 0; i < itemList.length; ++i) {
                    itemList[i].classList.remove('selected');
                }
                thisNode.classList.add('selected');
                break;
            case 'scribeInk':
                UI.inscription.selected.ink = thisNode.id.substring(17);
                var itemList = document.querySelectorAll('#inkSelection li'),
                    i;
                // hide all:
                for (i = 0; i < itemList.length; ++i) {
                    itemList[i].classList.remove('selected');
                }
                thisNode.classList.add('selected');
                break;
        }
        if (UI.inscription.mode == 'copy') {
            if ((UI.inscription.selected.ink != '') && (UI.inscription.selected.material != '') && (UI.inscription.selected.source != '')) {
                scribeStartInscription.removeAttribute('disabled');
            } else {
                scribeStartInscription.setAttribute('disabled', 'disabled');
            }
        } else {
            // original:
            if ((UI.inscription.selected.ink != '') && (UI.inscription.selected.material != '')) {
                scribeStartInscription.removeAttribute('disabled');
            } else {
                scribeStartInscription.setAttribute('disabled', 'disabled');
            }
        }
        switch (thisNode.id) {
            case 'scribeCopyText':
                if (UI.inscription.mode != 'copy') {
                    UI.resetInscriptionPanel();
                }
                UI.inscription.mode = 'copy';
                originalText.classList.remove('active');
                sourceSelection.classList.add('active');
                thisNode.classList.add('active');
                scribeOriginalText.classList.remove('active');
                break;
            case 'scribeOriginalText':
                if (UI.inscription.mode != 'original') {
                    UI.resetInscriptionPanel();
                }
                UI.inscription.mode = 'original';
                originalText.classList.add('active');
                sourceSelection.classList.remove('active');
                thisNode.classList.add('active');
                scribeCopyText.classList.remove('active');
                break;
            case 'scribeStartInscription':

                var newInscribedObject = JSON.parse(JSON.stringify(hero.inventory[UI.inscription.selected.material]));
                newInscribedObject.quantity = 1;
                newInscribedObject.colour = hero.inventory[UI.inscription.selected.ink].colour;
                if (UI.inscription.mode == 'copy') {
                    newInscribedObject.inscription = {
                        'title': hero.inventory[UI.inscription.selected.source].inscription.title,
                        'content': hero.inventory[UI.inscription.selected.source].inscription.content,
                        'timeCreated': Date.now()
                    }
                } else {
                    // original:
                    newInscribedObject.inscription = {
                        'title': inscriptionTitle.value,
                        'content': '<p>' + inscriptionTextArea.innerHTML + '</p>',
                        'timeCreated': Date.now()
                    }
                }
                // store these as the UI.inscription object will be cleared if the item is successfully added
                var storedSelectedMaterialSlot = UI.inscription.selected.material;
                var storedSelectedInkSlot = UI.inscription.selected.ink;

                inventoryCheck = canAddItemToInventory([newInscribedObject]);
                if (inventoryCheck[0]) {
                    document.getElementById("slot" + inventoryCheck[1]).innerHTML = generateSlotMarkup(inventoryCheck[1]);
                    UI.showChangeInInventory(inventoryCheck[1]);
                    // remove the ink and material used:

                    removeFromInventory(storedSelectedMaterialSlot, 1);

                    removeFromInventory(storedSelectedInkSlot, 1);
                    UI.updateInscriptionPanel();
                } else {
                    UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                }
                break;
        }
    },

    updatePanelsAfterInventoryChange: function() {
        // called after any inventory add, remove or move so any panels can be updated to reflect the change
        UI.updateInscriptionPanel();
    },

    getGameSettings: function(e) {
        soundVolume.value = gameSettings.soundVolume;
        musicVolume.value = gameSettings.musicVolume;
        // apply these:
        audio.adjustEffectsVolume();
        audio.adjustMusicVolume();
    },

    openSettings: function(e) {
        if (e) {
            e.preventDefault();
        }
        gameSettingsPanel.classList.add('active');
    },

    toggleCardsDisplayed: function(e) {
        cardAlbumList.classList.toggle('showOnlyPlayers');
        toggleActiveCards.innerHTML = (toggleActiveCards.innerHTML == 'Show only collected cards' ? 'Show all cards' : 'Show only collected cards');
    },

    buildCollectionPanel: function() {
        var collectionPanels = document.querySelectorAll('#collectionQuestPanels section');
        var thisZoneName, panelMarkup, thisCollectionItem, thisItemCollectedClass, thisParagraphNode;
        for (var i = 0; i < collectionPanels.length; i++) {
            thisZoneName = collectionPanels[i].dataset.collection;

            if (hero.collections.hasOwnProperty(thisZoneName)) {


                if (hero.collections[thisZoneName].complete) {
                    // is complete, de-obfuscate the lore:
                    var thisParagraphNode = collectionPanels[i].getElementsByTagName("P")[0];
                    thisParagraphNode.textContent = window.atob(thisParagraphNode.textContent);
                    thisParagraphNode.classList.add('active');
                }
                // if exist in hero.collections, then write in items required as well:

                panelMarkup = '';
                for (var j in hero.collections[thisZoneName].required) {
                    thisCollectionItem = hero.collections[thisZoneName].required[j];
                    thisItemCollectedClass = "notCollected";
                    if (thisCollectionItem < 0) {
                        thisItemCollectedClass = "";
                    }
                    panelMarkup += '<li class="' + thisItemCollectedClass + '"><img src="/images/game-world/inventory-items/' + Math.abs(thisCollectionItem) + '.png"></li>';
                    collectionPanels[i].getElementsByTagName("OL")[0].innerHTML = panelMarkup;
                }
            }
        }
        collectionQuestPanels.classList.add('active');
    },

    initiateCollectionQuestPanel: function(whichZone) {
        // add objects needed for this collection:
        var thisCollectionItem, thisItemCollectedClass;
        var panelMarkup = '';
        for (var j in hero.collections[whichZone].required) {
            thisCollectionItem = hero.collections[whichZone].required[j];
            thisItemCollectedClass = "notCollected";
            if (thisCollectionItem < 0) {
                thisItemCollectedClass = "";
            }
            panelMarkup += '<li class="' + thisItemCollectedClass + '" id="' + whichZone + '-' + Math.abs(thisCollectionItem) + '"><img src="/images/game-world/inventory-items/' + Math.abs(thisCollectionItem) + '.png"></li>';
            document.querySelector('#collection-' + whichZone + ' ol').innerHTML = panelMarkup;
        }
    },

    completeCollectionQuestPanel: function(whichZone) {
        // reveal lore:
        var thisParagraphNode = document.querySelector('#collection-' + whichZone + ' p');
        thisParagraphNode.textContent = window.atob(thisParagraphNode.textContent);
        thisParagraphNode.classList.add('active');
    },

    openChest: function(itemReference) {
        var contents = thisMapData.items[itemReference].contains;
        audio.playSound(soundEffects['chestOpen'], 0);
        // open chest animation (thisMapData.items[itemReference]) ####

        // show container item name in the title:
        chestTitle.innerHTML = currentActiveInventoryItems[(thisMapData.items[itemReference].type)].shortname;

        // build contents:
        var chestContents = '';
        var thisChestObject;
        for (var i = 0; i < currentActiveInventoryItems[(thisMapData.items[itemReference].type)].actionValue; i++) {
            chestContents += '<li id="chestSlot-' + itemReference + '-' + i + '">';
            if (typeof contents[i] !== "undefined") {
                if (contents[i] != "") {
                    if (contents[i].type == "$") {
                        // just money
                        chestContents += '<img src="/images/game-world/inventory-items/coins.png" alt="' + contents[i].quantity + ' worth of coins">';
                        chestContents += '<p><em>' + parseMoney(contents[i].quantity) + ' worth of coins </em></p>';
                        chestContents += '<span class="qty">' + parseMoney(contents[i].quantity) + '</span>';
                    } else {
                        // create defaults:
                        thisChestObject = {
                            "quantity": 1,
                            "quality": 100,
                            "durability": 100,
                            "currentWear": 0,
                            "effectiveness": 100,
                            "colour": 0,
                            "enchanted": 0,
                            "hallmark": 0,
                            "inscription": ""
                        }
                        // add in any defined values:
                        for (var attrname in contents[i]) {
                            thisChestObject[attrname] = contents[i][attrname];
                        }
                        // save all these default values to the object for adding it to the inventory later:
                        contents[i] = thisChestObject;
                        chestContents += generateGenericSlotMarkup(thisChestObject);
                    }
                }
            }
            chestContents += '</li>';
        }
        chestSlotContents.innerHTML = chestContents;
        chestIdOpen = itemReference;
        chestPanel.classList.add('active');
    },

    closeChest: function() {
        // animate close ####
        chestPanel.classList.remove('active');
        audio.playSound(soundEffects['chestOpen'], 0);
        chestIdOpen = -1;
    },

    addFromChest: function(chestSlotId) {
        var itemDetails = chestSlotId.split("-");
        var chestItemContains = thisMapData.items[(itemDetails[1])].contains;
        var whichChestItem = chestItemContains[(itemDetails[2])];
        if (typeof whichChestItem !== "undefined") {
            if (whichChestItem.type == "$") {
                // money:
                hero.currency.money += whichChestItem.quantity;
                audio.playSound(soundEffects['coins'], 0);
                UI.updateCurrencies();
                thisMapData.items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                document.getElementById(chestSlotId).innerHTML = "";
            } else {
                inventoryCheck = canAddItemToInventory([whichChestItem]);
                if (inventoryCheck[0]) {
                    thisMapData.items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                    UI.showChangeInInventory(inventoryCheck[1]);
                    document.getElementById(chestSlotId).innerHTML = "";
                } else {
                    UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                }
            }
        }
    },

    toggleUI: function() {
        interfaceWrapper.classList.toggle('active');
        interfaceIsVisible = !interfaceIsVisible;
    },

    buildActionBar: function() {
        var actionBarMarkup = '<ol>';
        var imageSrc, toolTipText;
        for (var i = 0; i < hero.actions.length; i++) {
            if (hero.actions[i] == "-") {
                actionBarMarkup += '<li><img src="/images/game-world/interface/actions/blank.png" alt="Empty Action slot"></li>';
            } else {
                if (hero.actions[i][2] == null) {
                    imageSrc = hero.actions[i][1];
                    toolTipText = hero.actions[i][0];
                    if (typeof hero.actions[i][3]['pet-name'] !== "undefined") {
                        toolTipText += " " + hero.actions[i][3]['pet-name'];
                    }
                } else {
                    imageSrc = hero.actions[i][2] + '-' + hero.actions[i][1];
                    toolTipText = hero.actions[i][0] + ' (' + hero.actions[i][1] + ' type' + hero.actions[i][2] + ')';
                }

                actionBarMarkup += '<li class="active" data-index="' + i + '" data-category="' + hero.actions[i][2] + '" id="actionType' + hero.actions[i][1] + '"><img src="/images/game-world/interface/actions/' + imageSrc + '.png" alt="' + hero.actions[i][0] + ' action"><p>' + toolTipText + '</p></li>';
            }
        }
        actionBarMarkup += '</ol>';
        actionBar.innerHTML = actionBarMarkup;
    },

    actionBarClick: function(e) {
        var thisNode = getNearestParentId(e.target);
        if (thisNode.id.substring(0, 10) == "actionType") {
            var actionType = thisNode.id.substring(10);
            switch (actionType) {
                case "gather":
                    // make sure not already gathering:
                    if (activeAction != "gather") {
                        if (activeAction == "survey") {
                            surveyingStopped();
                        }
                        // check if there's a relevant item on the hero's tile, or at arm's length:
                        var armsLengthXTile = hero.tileX + relativeFacing[hero.facing]["x"];
                        var armsLengthYTile = hero.tileY + relativeFacing[hero.facing]["y"];
                        var foundItem = -1;
                        var thisItem;
                        for (var i = 0; i < thisMapData.items.length; i++) {
                            thisItem = thisMapData.items[i];

                            if (hero.tileX == thisItem.tileX) {
                                if (hero.tileY == thisItem.tileY) {
                                    foundItem = i;
                                    break;
                                }
                            }
                            if (armsLengthXTile == thisItem.tileX) {
                                if (armsLengthYTile == thisItem.tileY) {
                                    foundItem = i;
                                    break;
                                }
                            }
                        }
                        if (foundItem != -1) {
                            // found an item - check source node and the action match categories:
                            if (currentActiveInventoryItems[thisMapData.items[foundItem].type].category == thisNode.dataset.category) {
                                // check it's not still re-spawning:
                                if (thisMapData.items[foundItem].state != "inactive") {
                                    gathering.itemIndex = foundItem;
                                    gathering.quality = parseInt(thisMapData.items[foundItem].quality);

                                    gathering.quantity = 100;
                                    gathering.maxQuantity = parseInt(thisMapData.items[foundItem].quantity);
                                    gathering.purity = parseInt(thisMapData.items[foundItem].purity);
                                    gathering.stability = parseInt(thisMapData.items[foundItem].stability);
                                    gathering.node = thisMapData.items[foundItem];
                                    gathering.depletionTime = baseGatheringTime;
                                    // look for modifiers from the action:
                                    gathering.modifiers = hero.actions[thisNode.dataset.index][3];
                                    for (var modifier in gathering.modifiers) {
                                        switch (modifier) {
                                            case 'time':
                                                gathering.depletionTime += gathering.modifiers[modifier];
                                                break;
                                            case 'purity':
                                                gathering.purity += gathering.modifiers[modifier];
                                                break;
                                            case 'stability':
                                                gathering.stability += gathering.modifiers[modifier];
                                                break;
                                            case 'quality':
                                                gathering.quality += gathering.modifiers[modifier];
                                                break;
                                        }
                                    }

                                    // tool needs to modify values as well #####

                                    // make sure not too low, or negative
                                    gathering.quality = capValues(gathering.quality, 10, 100);
                                    gathering.purity = capValues(gathering.purity, 10, 100);
                                    gathering.stability = capValues(gathering.stability, 10, 100);
                                    gathering.quantity = capValues(gathering.quantity, 10, 100);


                                    // determine the stability decrease based on the quality being extracted - higher quality = more harmful, stabiity will drop faster
                                    gathering.stabilitySpeed = gathering.quality * gatheringStabilityModifier;
                                    // quantity remaining will continuously drop:
                                    gathering.depletionSpeed = gatheringDepletionModifier / gathering.depletionTime;

                                    // update the bar without the transitions, so it's all in place when the panel opens:
                                    UI.updateGatheringPanel();
                                    // trigger a reflow to push the update without the transition:
                                    gatheringPanel.offsetHeight;
                                    gatheringOutputSlot.innerHTML = '';
                                    gatheringPanel.classList.add('active');
                                    audio.playSound(soundEffects['gather' + thisNode.dataset.category], 0);
                                    activeAction = "gather";
                                }
                            } else {
                                UI.showNotification('<p>Wrong resource type for this action</p>');
                            }
                            if (activeAction == "dowse") {
                                activeAction = "";
                            }
                        }
                    }

                    break;
                case "dowse":
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                    if (activeAction != "gather") {
                        if (activeAction != "dowse") {
                            dowsing.range = baseDowsingRange;
                            dowsing.category = thisNode.dataset.category;
                            activeAction = "dowse";
                            dowsing.modifiers = hero.actions[thisNode.dataset.index][3];
                            for (var modifier in dowsing.modifiers) {
                                switch (modifier) {
                                    case 'range':
                                        dowsing.range += dowsing.modifiers[modifier];
                                        break;
                                }
                            }
                        } else {
                            activeAction = "";
                            dowsing = {};
                        }
                    }
                    break;
                case "survey":
                    // ok to switch to this from Dowsing
                    if (activeAction != "gather") {
                        if (activeAction != "survey") {
                            activeAction = "survey";
                            surveying.category = thisNode.dataset.category;
                            surveying.timeRequired = baseSurveyingTime;
                            surveying.modifiers = hero.actions[thisNode.dataset.index][3];
                            for (var modifier in surveying.modifiers) {
                                switch (modifier) {
                                    case 'time':
                                        surveying.timeRequired += surveying.modifiers[modifier];
                                        break;
                                }
                            }
                            surveying.timeRequired = capValues(surveying.timeRequired, 200, 2000);
                            surveying.timeRemaining = 100;
                            surveying.depletionSpeed = surveyingDepletionModifier / surveying.timeRequired;

                            UI.updateSurveyingPanel();
                            // trigger a reflow to push the update without the transition:
                            surveyingPanel.offsetHeight;
                            surveyingPanel.classList.add('active');
                        } else {
                            surveyingStopped();
                        }
                    }
                    break;
                case "mount":
                    // ###
                    break;
            }
        }
    },

    updateGatheringPanel: function() {
        gatheringBarQuality.style.width = gathering.quality + '%';
        gatheringBarQuantity.style.width = gathering.quantity + '%';
        gatheringBarPurity.style.width = gathering.purity + '%';
        gatheringBarStability.style.width = gathering.stability + '%';
    },

    updateSurveyingPanel: function() {
        surveyingTimeBar.style.width = surveying.timeRemaining + '%';
    },

    addFromGathering: function() {
        inventoryCheck = canAddItemToInventory([activeGatheredObject]);
        if (inventoryCheck[0]) {
            gatheringOutputSlot.innerHTML = "";
            UI.showChangeInInventory(inventoryCheck[1]);
            gatheringPanel.classList.remove('active');
        } else {
            UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
        }
    },

    updateCooldowns: function() {
        var thisValue;
        for (var thisSlotsID in hero.inventory) {
            if (typeof hero.inventory[thisSlotsID].cooldown !== "undefined") {
                if (hero.inventory[thisSlotsID].cooldownTimer > 0) {
                    hero.inventory[thisSlotsID].cooldownTimer--;
                    //console.log(hero.inventory[thisSlotsID].cooldownTimer);
                    //update visually (scaleY uses 0 - 1):
                    thisValue = (hero.inventory[thisSlotsID].cooldownTimer / hero.inventory[thisSlotsID].cooldown);
                    // does this need vendor prefixes?            
                    document.querySelector("#slot" + thisSlotsID + " .coolDown").style.transform = 'scaleY(' + thisValue + ')';
                }
            }
        }
    },
    handleRightClick: function(e) {
        // e.preventDefault();
        // ###############
        console.log("right click");
        console.log(e);
        var thisNode = getNearestParentId(e.target);
        console.log(thisNode.id);
    },
    buildQuestJournal: function(markup, regions) {
        questJournalEntries.innerHTML = markup;
        // build region filter:
        var regionMarkup = '<option value="all">Show all</option>'
        for (var region in regions) {
            regionMarkup += '<option value="' + regions[region] + '">' + regions[region] + '</option>';
        }
        questJournalRegionFilter.innerHTML = regionMarkup;
        questJournalRegionFilter.onchange = UI.filterJournal;
        questJournal.classList.add('active');
    },
    filterJournal: function(e) {
        var journalItems = document.querySelectorAll('#questJournalEntries li'),
            i;
        if (questJournalRegionFilter.value == "all") {
            for (i = 0; i < journalItems.length; ++i) {
                journalItems[i].classList.add('active');
            }
        } else {
            // hide all:
            for (i = 0; i < journalItems.length; ++i) {
                if (journalItems[i].dataset.region == questJournalRegionFilter.value) {
                    journalItems[i].classList.add('active');
                } else {
                    journalItems[i].classList.remove('active');
                }
            }
        }
    },
    toggleJournal: function() {
        questJournal.classList.toggle('active');
    },
    addToQuestJournal: function(data) {
        // add the entry:
        questJournalEntries.innerHTML = data.markup + questJournalEntries.innerHTML;
        // check to see if a new region needs adding to the filter:
        var foundThisRegion = false;
        var storedIndex = -1;
        for (var i = 0; i < questJournalRegionFilter.length; i++) {
            if (questJournalRegionFilter.options[i].value == data.regions) {
                foundThisRegion = true;
                break;
            }
            // find the position to insert it next too (ignore the 'Show all' option as that needs to stay at the top):
            if (questJournalRegionFilter.options[i].value != "all") {
                if (questJournalRegionFilter.options[i].value > data.regions) {
                    if (storedIndex == -1) {
                        storedIndex = i;
                    }
                }
            }
        }
        if (!foundThisRegion) {
            // add it alphabetically:   
            var newOption = document.createElement("OPTION");
            newOption.innerText = data.regions;
            newOption.value = data.regions;
            questJournalRegionFilter.options.add(newOption, storedIndex);

        }
    },
    movePlotPlacementOverlay: function(e) {
        cursorPositionX = e.pageX;
        cursorPositionY = e.pageY;
    },
    openPost: function() {
        postPanel.classList.add('active');
    },

    readPostMessage: function(whichElement) {
        var thisElement = document.getElementById(whichElement);
        if (thisElement.classList.contains('unread')) {
            thisElement.classList.remove('unread');
            // send this to the database to mark as read there:
            sendDataWithoutNeedingAResponse("/game-world/readPost.php?id=" + whichElement);
            // see if there are any unread messages left, if not, hide the 'new mail icon':
            if (document.querySelectorAll('#receivedPostPanel .unread').length == 0) {
                newPost.classList.remove('active');
            }
        }
        var correspondingPostMessage = "postMessage" + whichElement.substr(4);
        document.getElementById(correspondingPostMessage).classList.add("active");
    },
    takePostAttachments: function(whichElement) {
        getJSON("/game-world/getPostAttachment.php?id=" + whichElement, function(data) {
            if (data.item != "null") {
                // try and add to inventory:
                inventoryCheck = canAddItemToInventory(data.item);
                if (inventoryCheck[0]) {
                    UI.showChangeInInventory(inventoryCheck[1]);
                    // remove attachment(s) from message:
                    var attachmentSlots = document.querySelectorAll("#postMessage" + data.id + " .postSlot");
                    for (i = 0; i < attachmentSlots.length; ++i) {
                        attachmentSlots[i].outerHTML = '';
                    }
                    // remove all from message preview list:
                    document.querySelector("#post" + data.id + " .previewSlot").innerHTML = '';
                    // send notification that it's been added to database:
                    sendDataWithoutNeedingAResponse("/game-world/gotPostAttachment.php?id=" + data.id);
                } else {
                    UI.showNotification("<p>Oops - sorry, no room in your bags</p>");
                }
            }
        }, function(status) {
            // error - try again:
            UI.takePostAttachments(whichElement);
        });
    },
    postPanelSingleClick: function(e) {
        switch (e.target.id) {
            case 'sendPostTab':
                sendPostTab.classList.add('active');
                sendPostPanel.classList.add('active');
                receivedPostTab.classList.remove('active');
                receivedPostPanel.classList.remove('active');
                break;
            case 'receivedPostTab':
                sendPostTab.classList.remove('active');
                sendPostPanel.classList.remove('active');
                receivedPostTab.classList.add('active');
                receivedPostPanel.classList.add('active');
                break;
            case 'sendPost':
                sendUserPost('{"subject":"' + sendPostSubject.value + '","message":"' + sendPostMessage.value + '","senderID":"' + characterId + '"}');
                break;
            case 'cancelPost':
                // ####
                break;
        }
    }
}