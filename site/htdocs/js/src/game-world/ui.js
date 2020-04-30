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
const displayItemBeingCreated = document.getElementById('displayItemBeingCreated');
const booksAndParchments = document.getElementById('booksAndParchments');
const gameWrapper = document.getElementById('gameWrapper');
const inventoryPanels = document.getElementById('inventoryPanels');
const inventoryBank = document.getElementById('inventoryBank');
const inventoryBankTitle = document.getElementById('inventoryBankTitle');
const bankCurrency = document.getElementById('bankCurrency');
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
const cardAlbum = document.getElementById('cardAlbum');
const cardAlbumTabs = document.querySelectorAll('#cardAlbum .tabs');
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
const surveyingTimeBar = document.getElementById('surveyingTimeBar');
const craftingTimeBarOuter = document.getElementById('craftingTimeBar');
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
const sendPostCharacter = document.getElementById('sendPostCharacter');
const newPost = document.getElementById('newPost');
const retinuePanel = document.getElementById('retinuePanel');
const retinueAvailableQuestMap = document.getElementById('retinueAvailableQuestMap');
const retinueDetailWrapper = document.getElementById('retinueDetailWrapper');
const draggableFollower = document.getElementById('draggableFollower');
const retinueQuestStart = document.getElementById('retinueQuestStart');
const retinueQuestTimeRequired = document.getElementById('retinueQuestTimeRequired');
const retinueList = document.getElementById('retinueList');
const retinueExplorePanel = document.getElementById('retinueExplorePanel');
const startCrafting = document.getElementById('startCrafting');
const horticulturePanel = document.getElementById('horticulturePanel');
const characterPanel = document.getElementById('characterPanel');
const holdingIcon = document.getElementById('holdingIcon');
const quickHold = document.getElementById('quickHold');
const holdingGauge = document.getElementById('holdingGauge');
const cardGameConcede = document.getElementById('cardGameConcede');
const hnefataflConcede = document.getElementById('hnefataflConcede');
const treasureMapPanels = document.getElementById('treasureMapPanels');
const hireRetinueFollowerPanel = document.getElementById('hireRetinueFollowerPanel');
const hireRetinueFollowerPanelContent = document.getElementById('hireRetinueFollowerPanelContent');
const catalogueQuestPanels = document.getElementById('catalogueQuestPanels');
const housingPanel = document.getElementById('housingPanel');
const housingConstructionPanel = document.getElementById('housingConstructionPanel');
const housingTileColour = document.getElementById('housingTileColour');
const housingTileSelectionListItems = document.querySelectorAll('#housingTileSelection ul:not(#housing-items) li');
const housingConstructionToolButtons = document.querySelectorAll('#housingConstructionTools li');
const housingRunningTotal = document.getElementById('housingRunningTotal');
const housingTileGroups = document.querySelectorAll('.housingTileGroup');
const yesNoDialoguePanel = document.getElementById('yesNoDialoguePanel');
const yesNoDialogueHeading = document.getElementById('yesNoDialogueHeading');
const yesNoDialogueButton1 = document.getElementById('yesNoDialogueButton1');
const yesNoDialogueButton2 = document.getElementById('yesNoDialogueButton2');
const housingToggleButtons = document.querySelectorAll("#housingGroupTabs button");

var notificationQueue = [];
var notificationIsShowing = false;
var retinueQuestTimers = [];


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
        var characterNameAndTitle = hero.characterName;
        if (hero.activeTitle != 0) {
            characterNameAndTitle += " - " + possibleTitles[hero.activeTitle];
        }
        document.getElementById('characterName').innerHTML = characterNameAndTitle;
        characterPanel.classList.add('active');
        var inventoryMarkup = '';
        var bankMarkup = '';
        var thisBagsMarkup;
        var thisAction, thisBagNumberOfSlots, thisSlotsID, thisPanelName, thisPet, activeClass;

        for (var i = 0; i < hero.bags.length; i++) {
            thisBagsMarkup = '';
            if (hero.bags[i].type == "bank") {
                thisBagNumberOfSlots = hero.bags[i].bankSlots;
                UI.whichInvenotryPanelIsTheBank = i;
                if (hero.bags[i].bankSlots == maximumBankSlotsPossible) {
                    // hide the add more slots button:
                    document.getElementById('bankBuyMoreSlots').style.display = 'none';
                }
            } else {
                thisPanelName = currentActiveInventoryItems[hero.bags[i].type].shortname;
                thisBagNumberOfSlots = currentActiveInventoryItems[hero.bags[i].type].actionValue;
                thisBagsMarkup += '<div class="inventoryBag active" id="inventoryBag' + i + '"><div class="draggableBar">' + thisPanelName + '</div>';
            }
            thisBagsMarkup += '<ol id="bag' + i + '">';

            // loop through slots for each bag:
            for (var j = 0; j < thisBagNumberOfSlots; j++) {
                thisSlotsID = i + '-' + j;
                thisBagsMarkup += '<li id="slot' + thisSlotsID + '">';
                // check if that key exists in inventory:
                if (thisSlotsID in hero.inventory) {

                    thisBagsMarkup += generateSlotMarkup(thisSlotsID);
                    thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;
                    // check for cooldown attribute, and add a timer if so:
                    if (typeof hero.inventory[thisSlotsID].cooldown !== "undefined") {
                        hero.inventory[thisSlotsID].cooldownTimer = 0;
                    }
                    if (thisAction == "treasureMap") {
                        UI.createTreasureMap(hero.inventory[thisSlotsID].contains);
                    }
                } else {
                    thisBagsMarkup += '';
                }
                thisBagsMarkup += '</li>';
            }
            thisBagsMarkup += '</ol>';

            if (hero.bags[i].type == "bank") {
                bankMarkup += thisBagsMarkup;
            } else {
                inventoryMarkup += thisBagsMarkup + '</div>';
            }


        }
        // add pet inventory panels:
        for (var i = 0; i < hero.allPets.length; i++) {
            if (hero.allPets[i].inventorySize > 0) {
                inventoryMarkup += UI.generatePetInventorySlot(i);
            }
        }

        // inventoryPanels.innerHTML = inventoryMarkup;
        inventoryPanels.insertAdjacentHTML('beforeend', inventoryMarkup);
        bankCurrency.insertAdjacentHTML('beforebegin', bankMarkup);
        gameWrapper.ondblclick = UI.doubleClick;
        gameWrapper.addEventListener("contextmenu", UI.handleRightClick, false);
        createRecipeList.onclick = UI.craftingPanelSingleClick;
        postPanel.onclick = UI.postPanelSingleClick;
        retinueAvailableQuestMap.onclick = UI.openRetinueDetailPanel;
        retinueQuestStart.onclick = UI.addFollowersToQuest;
        retinuePanel.onclick = UI.retinueSingleClick;
        document.getElementById('craftingRecipeCreateButton').onclick = UI.craftingRecipeCreate;
        splitStackPanel.onsubmit = inventorySplitStackSubmit;
        shopSplitStackPanel.onsubmit = UI.shopSplitStackSubmit;
        //  toggleActiveCards.onclick = UI.toggleCardsDisplayed;
        cardAlbum.onclick = UI.cardAlbumClick;
        startCrafting.onclick = startCraftingTimer;
        cardGameConcede.onclick = cardGamePlayer2Concedes;
        hnefataflConcede.onclick = hnefataflPlayer2Concedes;
        document.getElementById('showHousingFootprintCheckbox').onchange = housingNameSpace.toggleShowPlotFootprint;
        housingTileColour.onchange = housingNameSpace.housingTileColourChange;
        document.getElementById('splitStackCancel').onclick = inventorySplitStackCancel;
        document.getElementById('shopSplitStackCancel').onclick = UI.shopSplitStackCancel;
        document.getElementById('hireRetinueFollowerNo').onclick = UI.closeHireFollowerPanel;
        document.getElementById('hireRetinueFollowerYes').onclick = hireNewFollower;
        document.getElementById('touchTapAction').onclick = UI.touchTapAction;
        document.getElementById('bankBuyMoreSlots').onclick = UI.buyMoreBankSlots;
        document.getElementById('openHousingConstructButton').onclick = UI.openHousingConstructionPanel;
        document.getElementById('housingTileSelection').onclick = housingNameSpace.selectNewTile;
        document.getElementById('housingConstructionSaveButton').onclick = housingNameSpace.commitDesign;
        document.getElementById('housingConstructionTools').onclick = housingNameSpace.changeActiveTool;
        //document.getElementById('hasEnoughConfirm').onclick = housingNameSpace.publishCommittedDesign;
        document.getElementById('housingConstructionCancelButton').onclick = housingNameSpace.checkAbandonDesign;
        document.querySelector('#housingConstructionPanel .closePanel').onclick = housingNameSpace.checkSaveDraftDesign;



        for (i = 0; i < housingToggleButtons.length; i++) {
            housingToggleButtons[i].onclick = housingNameSpace.toggleTileGroup;
        }


        toggleFullscreenSwitch.onchange = UI.toggleFullScreen;
        document.onfullscreenchange = UI.fullScreenChangeDetected;
        //        document.onmozfullscreenchange = UI.fullScreenChangeDetected;
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
        UI.initRetinueTimers();
        UI.updateHeldItems();
        UI.updateQuickHold();
        /*
                if (hero.professionsKnown.length > 0) {
                    // load and cache the first profession's recipe assets:
                    UI.populateRecipeList(hero.professionsKnown[0],100);
                    // but hide the panel initially:
                    craftingPanel.classList.remove("active");
                }
        */
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
        // check it wasn't a follower, money or profession added:
        if (whichSlotsToUpdate.length > 0) {
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
        // check for starting a drag:

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
        } else {
            var thisNode = getNearestParentId(e.target);
            if (thisNode.id.indexOf("retinueFollower") !== -1) {
                e.preventDefault();
                // make sure it's not a right click:
                if (e.button != 2) {
                    if (thisNode.classList.contains("available")) {
                        // can be dragged:
                        thisNode.classList.add("hasDragCopy");
                        // draggableFollower.innerHTML = thisNode.innerHTML;
                        var thisFollowersId = thisNode.id.substring(15);
                        retinueObject.draggedFollower = thisFollowersId;
                        draggableFollower.innerHTML = '<div class="portrait"><img src="/images/retinue/' + thisFollowersId + '.png" alt=""></div>';
                        UI.activeDragObject = draggableFollower;
                        UI.draggedOriginal = thisNode;
                        var pageScrollTopY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
                        var clickedFollowerRect = thisNode.getBoundingClientRect();
                        objInitLeft = clickedFollowerRect.left;
                        objInitTop = clickedFollowerRect.top + pageScrollTopY;
                        dragStartX = e.pageX;
                        dragStartY = e.pageY;
                        UI.activeDragObject.style.cssText = "z-index:4;top: " + objInitTop + "px; left: " + objInitLeft + "px; transform: translate(0px, 0px);";
                        document.addEventListener("mousemove", UI.handleDrag, false);
                        document.addEventListener("mouseup", UI.endFollowerDrag, false);
                        // remove z-index of other draggable elements:
                        var dragTargetsInner = document.querySelectorAll('.draggableBar');
                        for (var j = 0; j < dragTargetsInner.length; j++) {
                            dragTargetsInner[j].parentElement.style.zIndex = 1;
                        }
                    }
                }
            }
        }
    },

    doubleClick: function(e) {
        var thisItemsAction = e.target.getAttribute('data-action');
        //    if (thisItemsAction) {
        //        inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        //    } else {

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
        } else if (thisNode.id.substring(0, 8) == "fromSlot") {
            addCraftingComponents(thisNode.id, true);
        }


        if (thisItemsAction) {
            inventoryItemAction(e.target, thisItemsAction, e.target.getAttribute('data-action-value'));
        }

        //   }
    },

    showDialogue: function(thisObjectSpeaking, text) {
        UI.showUI();
        // check for random variation in text:
        var textToShow = getRandomElementFromArray(text.split("/"));
        if (activeObjectForDialogue != '') {
            dialogue.removeEventListener(whichTransitionEvent, UI.removeActiveDialogue, false);
        }
        /*
        if(typeof thisObjectSpeaking.name !== "undefined") {
            // add NPC's name:
textToShow = '<span>'+thisObjectSpeaking.name+'</span>'+textToShow;
        }
        */
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

    cardAlbumClick: function(e) {
        var thisNode = getNearestParentId(e.target);
        if (thisNode.classList.contains('craftCard')) {
            // craft new card:
            // animation ############
            var cardType = thisNode.id.substring(8);
            // create card object:
            var craftedCardObject = {
                "type": 34,
                "contains": cardType
            }
            craftedCardObject = prepareInventoryObject(craftedCardObject);
            inventoryCheck = canAddItemToInventory([craftedCardObject]);
            if (inventoryCheck[0]) {
                hero.currency.cardDust -= cardGameNameSpace.allCardData[cardType][3];
                UI.updateCurrencies();
                UI.updateCardAlbum();
                UI.showChangeInInventory(inventoryCheck[1]);
                audio.playSound(soundEffects['cardCraft'], 0);
            } else {
                UI.showNotification("<p>I've don't have room in my bags for that</p>");
            }
        } else if (thisNode.classList.contains('cardBack')) {
            // set this back to be the active one:
            hero.activeCardBack = thisNode.id.substring(8);
            UI.changeActiveCardBack()
            UI.updateCardAlbum();
        } else if (thisNode.classList.contains('tabs')) {
            for (var i = 0; i < cardAlbumTabs.length; i++) {
                cardAlbumTabs[i].classList.remove('active');
            }
            thisNode.classList.add('active');
            switch (thisNode.id) {
                case 'tabShowAlbum':
                    cardAlbumList.className = 'showAlbum';
                    break;
                case 'tabShowBacks':
                    cardAlbumList.className = 'showBacks';
                    break;
                case 'tabShowCrafting':
                    cardAlbumList.className = 'showCrafting';
                    break;
            }
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
                parentClass = 'inactive';
            } else {
                thisCardsQuantityOutput = '<span class="quantity">' + counts[i] + '</span>';
                foundThisType = true;
            }

            // check for rares - these are the negative of the standard card type:
            if ((counts[(0 - i)])) {
                foundThisType = true;
                cardAlbumMarkup += '<li class="rare card players"><div style="background-image:url(/images/card-game/cards/' + (0 - i) + '.png)"></div><span class="quantity">' + counts[(0 - i)] + '</span></li>';
                parentClass += ' hasRare';
            }

            cardAlbumMarkup += '<li class="' + parentClass + '"><img src="/images/card-game/cards/' + i + '.png" class="' + thisCardsClass + '" alt="' + cardGameNameSpace.allCardData[i][2] + ' card">' + thisCardsQuantityOutput;

            if (hero.currency.cardDust >= cardGameNameSpace.allCardData[i][3]) {
                cardAlbumMarkup += '<button class="craftCard" id="cardCard' + i + '">Craft ' + cardGameNameSpace.allCardData[i][2] + ' (' + cardGameNameSpace.allCardData[i][3] + ')</button>';
            } else {
                cardAlbumMarkup += '<span class="craftingCost">Needs ' + cardGameNameSpace.allCardData[i][3] + '</span>';
            }
            cardAlbumMarkup += '</li>';


            if (foundThisType) {
                typesFound++;
            }
        }
        for (var i = 0; i < hero.cardBacks.length; i++) {
            cardAlbumMarkup += '<li id="cardBack' + hero.cardBacks[i] + '" class="cardBack';
            if (hero.cardBacks[i] == hero.activeCardBack) {
                cardAlbumMarkup += ' active';
            }
            if (hero.cardBacks[i] < 0) {
                // player generated content back:
                cardAlbumMarkup += '"><img src="/images/user-generated/' + Math.abs(hero.cardBacks[i]) + '-world.jpg"></li>';
            } else {
                cardAlbumMarkup += '"><img src="/images/card-game/card-backs/' + hero.cardBacks[i] + '.jpg"></li>';
            }
        }
        cardAlbumMarkup += '</ul>';

        cardAlbumMarkup += '<p id="dustCurrency">' + hero.currency.cardDust + ' dust</p>';

        cardAlbumMarkup += '<p>' + typesFound + ' types out of ' + (cardGameNameSpace.allCardData.length - 1) + '. Total individual cards: ' + hero.cards.length + '. Total backs: ' + hero.cardBacks.length + '</p>';
        cardAlbumList.innerHTML = cardAlbumMarkup;
    },

    changeActiveCardBack: function() {
        // change the CSS:
        if (hero.activeCardBack < 0) {
            document.getElementById('playersCardBack').innerHTML = '.card.players {background-image: url(/images/user-generated/' + Math.abs(hero.activeCardBack) + '-world.jpg);}';
        } else {
            document.getElementById('playersCardBack').innerHTML = '.card.players {background-image: url(/images/card-game/card-backs/' + hero.activeCardBack + '.jpg);}';
        }
    },

    populateRecipeList: function(whichProfession, toolsQuality) {
        if (currentRecipePanelProfession != whichProfession) {
            // close the main crafting panel (in case it's open):
            releaseLockedSlots();
            craftingSelectComponentsPanel.classList.remove('active');
            // clear previous searches:
            recipeSearch.value = '';
            clearRecipeSearch.classList.remove("active");
            var recipeTiersPossibleForThisTool = findRecipeTierLevel(toolsQuality);
            var recipeMarkup = '<li id="noRecipesFound"><p>No recipes found.</p></li>';
            var thisRecipe;
            var filterMarkup = '';
            var thisFilter;

            for (var i = 0; i < hero.crafting[whichProfession].sortOrder.length; i++) {
                thisRecipe = hero.crafting[whichProfession].recipes[(hero.crafting[whichProfession].sortOrder[i])];

                // check this tool's quality is sufficent for this tier of recipe:
                if (recipeTiersPossibleForThisTool >= thisRecipe.tier) {
                    recipeMarkup += '<li class="active" id="recipe' + hero.crafting[whichProfession].sortOrder[i] + '"><img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p></li>';
                }
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
            // check for User Generated Content attributes and build the contains object from those if they exist:
            if (thisSlotImageElement.hasAttribute('data-ugcid')) {
                thisBoughtObject.contains = {};
                thisBoughtObject.contains['ugc-id'] = thisSlotImageElement.getAttribute('data-ugcid');
                if (thisSlotImageElement.hasAttribute('data-ugctitle')) {
                    thisBoughtObject.contains['ugc-title'] = thisSlotImageElement.getAttribute('data-ugctitle');
                }
            } else if (thisSlotImageElement.hasAttribute('data-contains')) {
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
                    addToInventory(droppedSlotId, UI.draggedInventoryObject, true);
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
                            UI.showNotification("<p>I don't have have enough money</p>");
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
                                UI.showNotification("<p>I don't have have enough money</p>");
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
                    UI.showNotification("<p>I don't have have enough money</p>");
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

                } else {
                    switch (e.target.parentNode.id) {
                        case 'gatheringPanel':
                            if (activeAction == "gather") {
                                gatheringStopped();
                            }
                            break;
                        case 'surveyingPanel':
                            if (activeAction == "survey") {
                                surveyingStopped();
                            }
                            break;
                        case 'inscriptionPanel':
                            UI.resetInscriptionPanel();
                            break;
                        case 'chestPanel':
                            UI.closeChest();
                            break;
                        case 'postPanel':
                            UI.closePost();
                            break;
                        case 'retinuePanel':
                            UI.closeRetinuePanel();
                            break;
                        case 'craftingSelectComponentsPanel':
                            releaseLockedSlots();
                            break;
                    }
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
        bankCurrency.innerHTML = '<p>' + parseMoney(hero.currency.money) + '</p>';

    },

    buildShop: function(markup) {
        //   shopPanel.innerHTML = markup;
        shopPanel.insertAdjacentHTML('beforeend', markup);
    },

    openedShopSuccessfully: function(shopHash) {
        if (document.getElementById("shop" + shopHash)) {
            UI.showUI();
            shopCurrentlyOpen = shopHash;
            document.getElementById("shop" + shopHash).classList.add("active");
            inventoryPanels.classList.add("shopSpecialism" + document.getElementById("shop" + shopHash).getAttribute('data-specialism'));
            return true;
        } else {
            return false;
        }
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

            // check for User Generated Content attributes and build the contains object from those if they exist:
            if (thisSlotImageElement.hasAttribute('data-ugcid')) {
                thisBoughtObject.contains = {};
                thisBoughtObject.contains['ugc-id'] = thisSlotImageElement.getAttribute('data-ugcid');
                if (thisSlotImageElement.hasAttribute('data-ugctitle')) {
                    thisBoughtObject.contains['ugc-title'] = thisSlotImageElement.getAttribute('data-ugctitle');
                }
            } else if (thisSlotImageElement.hasAttribute('data-contains')) {
                console.log("has Contains", thisSlotImageElement.getAttribute('data-contains'));
                thisBoughtObject.contains = thisSlotImageElement.getAttribute('data-contains');
            }
            // console.log(thisSlotImageElement.hasAttribute('data-contains'));
            // console.log(thisSlotImageElement);
            inventoryCheck = canAddItemToInventory([thisBoughtObject]);
            // console.log(thisBoughtObject);
            if (inventoryCheck[0]) {
                hero.currency[thisCurrency] -= buyPriceForOne;
                UI.updateCurrencies();
                audio.playSound(soundEffects['coins'], 0);
                UI.showChangeInInventory(inventoryCheck[1]);
            } else {
                UI.showNotification("<p>I don't have room in my bags for that</p>");
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
                UI.showNotification("<p>I don't have room in my bags for that</p>");
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
                    UI.showNotification("<p>I don't have room in my bags for that</p>");
                }
                break;
        }
    },

    updatePanelsAfterInventoryChange: function() {
        // called after any inventory add, remove or move so any panels can be updated to reflect the change
        UI.updateInscriptionPanel();
        UI.checkHeldItem();
        UI.updateQuickHold();
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

    openChest: function(itemsMap, itemReference) {
        UI.showUI();
        var contents = thisMapData[itemsMap].items[itemReference].contains;
        audio.playSound(soundEffects['chestOpen'], 0);
        // open chest animation (thisMapData.items[itemReference]) ####

        // show container item name in the title:
        chestTitle.innerHTML = currentActiveInventoryItems[(thisMapData[itemsMap].items[itemReference].type)].shortname;

        // build contents:
        var chestContents = '';
        var thisChestObject;
        for (var i = 0; i < currentActiveInventoryItems[(thisMapData[itemsMap].items[itemReference].type)].actionValue; i++) {
            chestContents += '<li id="chestSlot-' + itemReference + '-' + i + '-' + itemsMap + '">';
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
        chestIdOpen = itemReference + "-" + itemsMap;
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
        var whichMap = itemDetails[3];
        var chestItemContains = thisMapData[whichMap].items[(itemDetails[1])].contains;
        var whichChestItem = chestItemContains[(itemDetails[2])];
        if (typeof whichChestItem !== "undefined") {
            if (whichChestItem.type == "$") {
                // money:
                hero.currency.money += whichChestItem.quantity;
                audio.playSound(soundEffects['coins'], 0);
                UI.updateCurrencies();
                thisMapData[whichMap].items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                document.getElementById(chestSlotId).innerHTML = "";
            } else {
                inventoryCheck = canAddItemToInventory([whichChestItem]);
                if (inventoryCheck[0]) {
                    thisMapData[whichMap].items[(itemDetails[1])].contains[(itemDetails[2])] = "";
                    UI.showChangeInInventory(inventoryCheck[1]);
                    document.getElementById(chestSlotId).innerHTML = "";
                } else {
                    UI.showNotification("<p>I don't have room in my bags for that</p>");
                }
            }
        }
    },

    toggleUI: function() {
        interfaceWrapper.classList.toggle('active');
        interfaceIsVisible = !interfaceIsVisible;
    },

    showUI: function() {
        interfaceWrapper.classList.add('active');
        interfaceIsVisible = true;
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
                        var foundItem = findItemWithinArmsLength();
                        if (foundItem != null) {
                            // found an item - check source node and the action match categories:
                            if (currentActiveInventoryItems[foundItem.type].category == thisNode.dataset.category) {
                                // check it's not still re-spawning:
                                if (foundItem.state != "inactive") {
                                    gathering.itemObject = foundItem;
                                    gathering.itemMap = findMapNumberFromGlobalCoordinates(foundItem.tileX, foundItem.tileY)
                                    gathering.quality = parseInt(foundItem.quality);
                                    gathering.quantity = 100;
                                    gathering.maxQuantity = parseInt(foundItem.quantity);
                                    gathering.purity = parseInt(foundItem.purity);
                                    gathering.stability = parseInt(foundItem.stability);
                                    gathering.node = foundItem;
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
                                UI.showNotification('<p>I don\'t think that\'s the right resource type for this action</p>');
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

                case "plant-breeding":
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                    activeAction = "pollinating";
                    var foundItem = findItemWithinArmsLength();
                    if (foundItem != -1) {
                        // found an item - check source node and the action match categories:
                        console.log(currentActiveInventoryItems[thisMapData.items[foundItem].type].category);
                        console.log(currentActiveInventoryItems[thisMapData.items[foundItem].type].action);
                        // change the cursor to show it's targetting a plant:
                        gameWrapper.classList.add('targetingPollen');
                        // cat == 1 and action == ""
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
                            //  surveyingPanel.offsetHeight;
                            surveyingPanel.classList.add('active');
                        } else {
                            surveyingStopped();
                        }
                    }
                    break;
                case "mount":
                    // ###
                    break;
                case "identify":
                    if (activeAction == "survey") {
                        surveyingStopped();
                    }
                    var foundItem = findItemWithinArmsLength();
                    if (foundItem != null) {
                        var additionalText = '';
                        // check if it's required for a catalogue quest:
                        for (var i in hero.catalogues) {
                            if (!hero.catalogues[i].completed) {
                                var indexPosition = hero.catalogues[i].ids.indexOf(foundItem.type);
                                if (indexPosition !== -1) {
                                    // strike off the list visually:
                                    document.querySelector("#catalogue" + i + " li[data-id='" + foundItem.type + "']").classList.add('complete');
                                    additionalText = '&mdash;I needed that for a catalogue';
                                    hero.catalogues[i].ids[indexPosition] = 0 - foundItem.type;
                                }
                            }
                        }
                        UI.showNotification("<p>That's a " + currentActiveInventoryItems[foundItem.type].shortname + additionalText + ".</p>");
                    }
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
        // surveyingTimeBar.style.width = (100 - surveying.timeRemaining) + '%';


        // has 30 frames:
        var frameRequired = ((surveying.timeRemaining) / 3.3333);
        // hour glass background width is 92px for each frame:
        frameRequired = (Math.floor(frameRequired)) * 92;
        surveyingTimeBar.style.backgroundPosition = "-" + frameRequired + "px 0";
    },

    updateCraftingPanel: function() {
        // has 30 frames:
        var frameRequired = ((craftingObject.timeRemaining) / 3.3333);
        // hour glass background width is 92px for each frame:
        frameRequired = (Math.floor(frameRequired)) * 92;
        craftingTimeBar.style.backgroundPosition = "-" + frameRequired + "px 0";
    },

    addFromGathering: function() {
        inventoryCheck = canAddItemToInventory([activeGatheredObject]);
        if (inventoryCheck[0]) {
            gatheringOutputSlot.innerHTML = "";
            UI.showChangeInInventory(inventoryCheck[1]);
            hero.stats.itemsGathered++;
            gatheringPanel.classList.remove('active');
        } else {
            UI.showNotification("<p>I don't have room in my bags for that</p>");
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
    openPost: function(postObjectX, postObjectY) {
        UI.showUI();
        // store the coordinates of the NPC or item that triggered this opening:
        postObject.x = postObjectX;
        postObject.y = postObjectY;
        postObject.active = true;
        postPanel.classList.add('active');
        audio.playSound(soundEffects['bookOpen'], 0);
    },
    closePost: function() {
        postObject.active = false;
        postPanel.classList.remove('active');
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
        if (thisElement.hasAttribute('data-quest')) {
            var whichQuest = thisElement.getAttribute('data-quest');
            if (canOpenQuest(whichQuest)) {
                openQuest(whichQuest);
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
                    UI.showNotification("<p>I don't have room in my bags for that</p>");
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
                // escape new lines in the textarea:
                sendUserPost('{"subject":"' + sendPostSubject.value + '","message":"' + sendPostMessage.value.replace(/\n/g, "\\\\n") + '","senderID":"' + characterId + '","attachments":0,"recipientCharacterName":"' + sendPostCharacter.value + '","fromName":"Eleaddai"}');
                break;
            case 'cancelPost':
                // ####
                break;
        }
    },
    initRetinueTimers: function() {
        // retinueQuestTimers
        var allRetinueQuestTimers = document.getElementsByClassName('retinueQuestTimer');
        for (var i = 0; i < allRetinueQuestTimers.length; i++) {
            retinueQuestTimers.push([allRetinueQuestTimers[i], new Date().getTime() + (allRetinueQuestTimers[i].dataset.minutes) * 60 * 1000, ""]);
        }
    },

    updateRetinueTimers: function() {
        var remainingTime, seconds, minutes, hours, days;
        var currentTime = new Date().getTime();
        var thisTimerText;
        for (var i = 0; i < retinueQuestTimers.length; i++) {
            remainingTime = retinueQuestTimers[i][1] - currentTime;

            var seconds = Math.floor((remainingTime / 1000) % 60);
            var minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
            var hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
            var days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));

            if (days > 1) {
                thisTimerText = days + " days remaining";
            } else if (days == 1) {
                thisTimerText = "1 day remaining";
            } else if (hours > 1) {
                thisTimerText = hours + " hours remaining";
            } else if (hours == 1) {
                thisTimerText = "1 hour remaining";
            } else if (minutes > 1) {
                thisTimerText = minutes + " minutes remaining";
            } else if (minutes == 1) {
                thisTimerText = "1 minute remaining";
            } else if (seconds > 1) {
                thisTimerText = seconds + " seconds remaining";
            } else if (seconds == 1) {
                thisTimerText = "1 second remaining";
            } else {
                thisTimerText = "complete";
            }
            if (thisTimerText != retinueQuestTimers[i][2]) {
                // only access the DOM if the text has changed:
                retinueQuestTimers[i][0].innerHTML = thisTimerText;
                retinueQuestTimers[i][2] = thisTimerText;
            }
            if (thisTimerText == "complete") {
                UI.retinueQuestComplete(retinueQuestTimers[i][0]);
                // remove this timer
                retinueQuestTimers.splice(i, 1);
                i--;
            }
        }
    },
    openRetinuePanel: function(passedRetinueObject) {
        UI.showUI();
        retinuePanel.classList.add("active");
        audio.playSound(soundEffects['bookOpen'], 0);
        retinueObject.active = true;
        retinueObject.x = passedRetinueObject.x;
        retinueObject.y = passedRetinueObject.y;
        retinueObject.passedObject = passedRetinueObject;
    },
    closeRetinuePanel: function() {
        retinuePanel.classList.remove("active");
        // if it's an NPC then keep them on this speech:
        if (typeof retinueObject.passedObject !== "undefined") {
            if (typeof retinueObject.passedObject.speechIndex !== "undefined") {
                retinueObject.passedObject.speechIndex--;
            }
        }
        // remove all other retinueObject content:
        retinueObject = {
            "active": false
        };
    },
    resetRetinuePanels: function() {
        var siblingPanels = document.getElementsByClassName('retinueQuestLocationDetailPanel');
        for (i = 0; i < siblingPanels.length; i++) {
            siblingPanels[i].classList.remove("active");
        }
        // reset submit and time output:
        retinueQuestStart.disabled = true;
        retinueQuestTimeRequired.innerHTML = "Time required:";
        // remove portraits from closed templates:
        var allFollowerSlots = document.getElementsByClassName('followerSlot');
        for (i = 0; i < allFollowerSlots.length; i++) {
            allFollowerSlots[i].innerHTML = '';
        }
        if (retinueObject.followersAdded) {
            // make any dragged NPCs available again:
            for (i = 0; i < retinueObject.followersAdded.length; i++) {
                if (retinueObject.followersAdded[i] != "null") {
                    document.getElementById("retinueFollower" + retinueObject.followersAdded[i]).classList.add("available");
                }
            }
        }
    },
    openRetinueDetailPanel: function(e) {


        if (e.target.classList.contains('undiscovered')) {
            if (e.target.classList.contains('explorable')) {
                UI.resetRetinuePanels();
                retinueExplorePanel.classList.add('active');
                retinueObject.openQuestDetail = 'Exploring';
                retinueObject.destinationLocationX = e.target.getAttribute('data-locationx');
                retinueObject.destinationLocationY = e.target.getAttribute('data-locationy');
                // determine distance to see how long and how many followers are required:

                // 277 is about a third of the max distance from corner to corner of the map:
                retinueObject.followersRequired = Math.ceil(getPythagorasDistance(retinueBaseLocationX, retinueBaseLocationY, retinueObject.destinationLocationX, retinueObject.destinationLocationY) / 277);

                // show the relevant follower slots:
                var followerSlots = document.querySelectorAll('#retinueExplorePanel .followerSlot');

                for (i = 0; i < followerSlots.length; ++i) {
                    followerSlots[i].style.display = 'none';
                }

                for (var i = 0; i < retinueObject.followersRequired; i++) {
                    document.getElementById('dropFollowersPanelExplore-' + i).style.display = 'block';
                }

                retinueObject.hasToReturnToBase = 1;
                retinueObject.questName = 'Exploring'
                retinueObject.followersAdded = [];
                for (var i = 0; i < retinueObject.followersRequired; i++) {
                    retinueObject.followersAdded.push("null");
                }
                var hexCoordinates = e.target.id.split("_");
                retinueObject.hexCoordX = hexCoordinates[1];
                retinueObject.hexCoordY = hexCoordinates[2];

            }
        } else {
            // get the corresponding Quest panel:
            var whichPanelId = e.target.id.substring(20);
            UI.resetRetinuePanels();
            retinueExplorePanel.classList.remove('active');
            retinueObject.openQuestDetail = whichPanelId;
            var thisPanelElement = document.getElementById("retinueQuestLocationDetail" + whichPanelId);
            retinueObject.followersRequired = thisPanelElement.getAttribute('data-requires');
            retinueObject.destinationLocationX = thisPanelElement.getAttribute('data-locationx');
            retinueObject.destinationLocationY = thisPanelElement.getAttribute('data-locationy');
            retinueObject.hasToReturnToBase = thisPanelElement.getAttribute('data-requiresreturn');
            retinueObject.questName = thisPanelElement.getAttribute('data-questname');
            retinueObject.followersAdded = [];
            for (var i = 0; i < retinueObject.followersRequired; i++) {
                retinueObject.followersAdded.push("null");
            }
            thisPanelElement.classList.add("active");
        }
    },
    endFollowerDrag: function(e) {
        var dropTargetNode = getNearestParentId(e.target);
        if (dropTargetNode.id.indexOf("dropFollowersPanel") !== -1) {
            var thisDropTargetSplit = dropTargetNode.id.split("-");
            var whichFollowerSlot = thisDropTargetSplit[1];
            // check if a follower has already been added to this slot:
            if (retinueObject.followersAdded[whichFollowerSlot] != "null") {
                // return previous
                document.getElementById("retinueFollower" + retinueObject.followersAdded[whichFollowerSlot]).classList.add("available");
            }
            retinueObject.followersAdded[whichFollowerSlot] = retinueObject.draggedFollower;
            // check if that's all follower slots filled:
            if (retinueObject.followersAdded.indexOf("null") === -1) {
                retinueQuestStart.disabled = false;
            }
            // determine the time required:
            var thisFollower, thisTimeRequired;
            var longestTimeRequired = 0;
            var longestTimeOutput = "";
            for (i = 0; i < retinueObject.followersAdded.length; i++) {
                if (retinueObject.followersAdded[i] != "null") {
                    thisFollower = document.getElementById("retinueFollower" + retinueObject.followersAdded[i]);

                    thisTimeRequired = getRetinueQuestTime(thisFollower.getAttribute('data-locationx'), thisFollower.getAttribute('data-locationy'), retinueObject.destinationLocationX, retinueObject.destinationLocationY, retinueObject.hasToReturnToBase);
                    // find the slowest time (if multiple followers) and use that:

                    if (thisTimeRequired[0] > longestTimeRequired) {
                        longestTimeRequired = thisTimeRequired[0];
                        longestTimeOutput = thisTimeRequired[1];
                    }
                }
            }
            retinueObject.timeRequired = longestTimeRequired;
            retinueQuestTimeRequired.innerHTML = "Time required: " + longestTimeOutput;
            UI.draggedOriginal.classList.remove("hasDragCopy");
            UI.activeDragObject.style.cssText = "left: -100px; top: -100px;";
            // add portrait to this slot
            dropTargetNode.innerHTML = '<img src="/images/retinue/' + retinueObject.draggedFollower + '.png">';
            // make this unavailable in the list:
            document.getElementById("retinueFollower" + retinueObject.draggedFollower).classList.remove("available");
        } else {
            // snap back:
            UI.activeDragObject.style.cssText = "z-index:4;left: " + (objInitLeft) + "px; top: " + (objInitTop) + "px;transition: transform 0.4s ease;";
            UI.activeDragObject.addEventListener(whichTransitionEvent, function snapDraggedSlotBack(e) {
                UI.draggedOriginal.classList.remove("hasDragCopy");
                e.currentTarget.style.cssText = "left: -100px; top: -100px;";
                // remove this event listener now:
                return e.currentTarget.removeEventListener(whichTransitionEvent, snapDraggedSlotBack, false);
            }, false);
        }
        // tidy up and remove event listeners:
        document.removeEventListener("mousemove", UI.handleDrag, false);
        document.removeEventListener("mouseup", UI.endFollowerDrag, false);
        UI.activeDragObject = '';
    },
    addFollowersToQuest: function() {
        var followersAssigned = [];
        for (i = 0; i < retinueObject.followersAdded.length; i++) {
            // show status in follower panel:
            document.querySelector('#retinueFollower' + retinueObject.followersAdded[i] + ' p').innerHTML = 'active on "' + retinueObject.questName + '" <span class="retinueQuestTimer" data-minutes="' + retinueObject.timeRequired + '"></span>';
            // add to timers:
            retinueQuestTimers.push([document.querySelector('#retinueFollower' + retinueObject.followersAdded[i] + ' .retinueQuestTimer'), new Date().getTime() + (retinueObject.timeRequired) * 60 * 1000, ""]);
            followersAssigned.push(retinueObject.followersAdded[i]);
            document.getElementById('retinueFollower' + retinueObject.followersAdded[i]).setAttribute('data-activeonquest', retinueObject.openQuestDetail);
        }

        if (retinueObject.openQuestDetail == "Exploring") {
            var thisHex = document.getElementById('undiscovered_' + retinueObject.hexCoordX + '_' + retinueObject.hexCoordY);
            thisHex.classList.remove('explorable');
            thisHex.classList.add('beingExplored');
            getJSON("/game-world/generateExplorationRetinueQuest.php?chr=" + characterId + "&followers=" + followersAssigned.join("|") + "&hexCoordX=" + retinueObject.hexCoordX + "&hexCoordY=" + retinueObject.hexCoordY, function(data) {
                if (data.markup) {
                    retinuePanel.insertAdjacentHTML('beforeend', data.markup);
                    // update the follower's panels with the correct quest id:
                    var thisQuestFollowers = data.followers.split(",");
                    console.log(data.followers);
                    for (i = 0; i < thisQuestFollowers.length; i++) {
                        document.getElementById('retinueFollower' + thisQuestFollowers[i]).setAttribute('data-activeonquest', data.questId);
                    }
                }
            }, function(status) {
                // error ####
            });

            retinueExplorePanel.classList.remove("active");

            delete retinueObject.hexCoordX;
            delete retinueObject.hexCoordY;
        } else {

            sendDataWithoutNeedingAResponse("/game-world/updateRetinueQuest.php?questID=" + retinueObject.openQuestDetail + "&chr=" + characterId + "&followers=" + followersAssigned.join("|"));
            document.getElementById("retinueQuestLocationDetail" + retinueObject.openQuestDetail).classList.remove("active");
            // remove from the map:
            document.getElementById("retinueQuestLocation" + retinueObject.openQuestDetail).classList.remove("active");
        }
        retinueQuestStart.disabled = true;
        retinueQuestTimeRequired.innerHTML = "Time required:";
        // clean up:
        delete retinueObject.draggedFollower;
        delete retinueObject.openQuestDetail;
        delete retinueObject.followersAdded;
        delete retinueObject.followersRequired;
        delete retinueObject.destinationLocationX;
        delete retinueObject.destinationLocationY;
        delete retinueObject.hasToReturnToBase;
        delete retinueObject.timeRequired;
        delete retinueObject.questName;
    },
    retinueSingleClick: function(e) {
        var parentPanel = getNearestParentId(e.target);
        switch (e.target.className) {
            case 'takeRewards':
                e.preventDefault();
                retinueMissionCompleted(parentPanel.id.substring(15), false);
                break;
            case 'finishExploration':
                e.preventDefault();
                retinueMissionCompleted(parentPanel.id.substring(15), true);
                break;
            case 'reHireFollowerNo':
                e.preventDefault();
                // remove follower:
                var whichFollower = e.target.getAttribute('data-follower');
                retinueList.removeChild(document.getElementById('retinueFollower' + whichFollower));
                sendDataWithoutNeedingAResponse("/game-world/removeHiredFollower.php?id=" + questId);
                // close panel:       
                parentPanel.classList.remove('active');
                break;
            case 'reHireFollowerYes':
                e.preventDefault();
                // remove money:
                if (hero.currency.money >= costToRehireFollower) {
                    hero.currency.money -= costToRehireFollower;
                    UI.updateCurrencies();
                    audio.playSound(soundEffects['coins'], 0);
                } else {
                    UI.showNotification('<p>I haven\'t got enough money</p>');
                }
                // close panel:       
                parentPanel.classList.remove('active');
                break;
        }
    },
    retinueQuestComplete: function(whichTimer) {
        var thisNode = getNearestParentId(whichTimer);
        var whichPanel = thisNode.getAttribute('data-activeonquest');
        document.getElementById("retinueComplete" + whichPanel).classList.add("active");
    },
    showNewFollower: function(id, name) {
        UI.showNotification('<p>I\'ve gained a new follower called &quot;' + name + '&quot;</p>');
    },
    showNewProfession: function(id) {
        UI.showNotification('<p>I learned a new profession - #' + id + '</p>');
    },
    buildHorticulturePanel: function(panelMarkup) {
        horticulturePanel.insertAdjacentHTML('beforeend', panelMarkup);
        horticulturePanel.classList.add('active');
    },
    holdItem: function(whichSlot) {
        hero.holding.hash = hero.inventory[whichSlot].hash;
        hero.holding.type = hero.inventory[whichSlot].type;
        UI.updateHeldItems();

        // update the quick held index:
        var allQuickHoldElements = quickHold.querySelectorAll('li');
        for (var i = 0; i < allQuickHoldElements.length; i++) {
            if (allQuickHoldElements[i].dataset.hash == hero.holding.hash) {
                hero.holding.quickHoldIndex = i;
                break;
            }
        }
        UI.updateQuickHold();

    },
    updateHeldItems: function() {
        if (hero.holding.hash != '') {
            var thisFileColourSuffix = "";
            var thisColourName = getColourName(hero.inventory[findSlotByHash(hero.holding.hash)].colour, hero.holding.type);
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }
            holdingIcon.innerHTML = '<img src="/images/game-world/inventory-items/' + hero.holding.type + thisFileColourSuffix + '.png" alt="' + currentActiveInventoryItems[hero.holding.type].shortname + '">';
            // check if a gauge is needed:
            UI.updateHeldItemGauge();
        } else {
            holdingIcon.innerHTML = '';
            holdingGauge.classList.remove('active');

        }
    },
    updateHeldItemGauge: function() {
        // check if it contains anything, and show a gauge if so:
        var thisItemObject = hero.inventory[findSlotByHash(hero.holding.hash)];
        if (typeof thisItemObject.contains !== "undefined") {
            var gaugePercent = thisItemObject.contains[0].quantity / currentActiveInventoryItems[thisItemObject.type].actionValue * 100;
            holdingGauge.className = 'gauge' + currentActiveInventoryItems[thisItemObject.contains[0].type].shortname;
            holdingGauge.querySelector('span').style.width = gaugePercent + '%';
            holdingGauge.classList.add('active');
        } else {
            holdingGauge.classList.remove('active');
        }
    },
    checkHeldItem: function() {
        if (hero.holding.hash != '') {
            // check that the currently held item still exists:
            if (findSlotByHash(hero.holding.hash) == -1) {
                // lost the hash - try and find by type instead:
                var possibleSlots = findSlotItemIdInInventory(hero.holding.type);
                if (possibleSlots.length > 0) {
                    // update to this slot's hash:
                    hero.holding.hash = hero.inventory[(possibleSlots[0])].hash;
                    hero.holding.type = '';
                } else {
                    // unequip:
                    hero.holding.hash = '';
                    hero.holding.type = '';
                    UI.updateHeldItems();
                }
            }
        }
    },
    updateQuickHold: function() {
        // find all holdable items and build the selectable interface:
        var quickHoldMarkup = '<ul>';
        var counter = 1;
        // highlight the first if none selected:
        // if (hero.holding.quickHoldIndex == "") {
        //    hero.holding.quickHoldIndex = 0;
        //}
        var keysFound = [];
        for (var key in hero.inventory) {
            if (currentActiveInventoryItems[hero.inventory[key].type].holdable == 1) {
                keysFound.push(key);
            }
        }
        // sort this array so that the order is always preserved: (for ... in don't keep order)
        keysFound = keysFound.sort();

        // add unequip slot:
        quickHoldMarkup += '<li id="quickHold0" data-type="empty" data-hash=""><img src="/images/game-world/inventory-items/empty.png" alt="Empty"></li>';
        var thisFileColourSuffix, thisColourName;
        for (var i = 0; i < keysFound.length; i++) {
            key = keysFound[i];

            quickHoldMarkup += '<li id="quickHold' + counter + '" ';

            if (counter === hero.holding.quickHoldIndex) {
                quickHoldMarkup += 'class="active" ';
            }
            quickHoldMarkup += 'data-type="' + hero.inventory[key].type + '" data-hash="' + hero.inventory[key].hash + '">';

            thisFileColourSuffix = "";
            thisColourName = getColourName(hero.inventory[key].colour, hero.inventory[key].type);
            if (thisColourName != "") {
                thisFileColourSuffix = "-" + thisColourName.toLowerCase();
            }

            quickHoldMarkup += '<img src="/images/game-world/inventory-items/' + hero.inventory[key].type + thisFileColourSuffix + '.png" alt="' + currentActiveInventoryItems[hero.inventory[key].type].shortname + '"></li>';
            counter++;
        }

        quickHoldMarkup += '</ul>';
        quickHold.innerHTML = quickHoldMarkup;
        hero.quickHoldLength = counter;
    },
    moveQuickHold: function(whichDirection) {
        document.getElementById('quickHold' + hero.holding.quickHoldIndex).classList.remove('active');
        hero.holding.quickHoldIndex += whichDirection;
        if (hero.holding.quickHoldIndex < 0) {
            hero.holding.quickHoldIndex = hero.quickHoldLength - 1;
        } else if (hero.holding.quickHoldIndex >= hero.quickHoldLength) {
            hero.holding.quickHoldIndex = 0;
        }
        var newActiveElement = document.getElementById('quickHold' + hero.holding.quickHoldIndex);
        newActiveElement.classList.add('active');
        if (hero.holding.quickHoldIndex == 0) {
            // unequip:
            hero.holding.hash = "";
            hero.holding.type = "";
        } else {
            hero.holding.hash = newActiveElement.dataset.hash;
            hero.holding.type = newActiveElement.dataset.type;
        }

        UI.updateHeldItems();
        quickHold.classList.add('active');
        // remove this class as soon as it's fully faded in:
        quickHold.addEventListener(
            whichTransitionEvent,
            function uiFadeInComplete(e) {
                quickHold.classList.remove("active");
                return e.currentTarget.removeEventListener(
                    whichTransitionEvent,
                    uiFadeInComplete,
                    false
                );
            },
            false
        );
    },
    createTreasureMap: function(mapId) {
        if (hero.activeTreasureMaps.indexOf(mapId) === -1) {
            var markupToAdd = '<div class="treasureMap" id="treasureMap' + mapId + '"><div class="draggableBar">X marks the spot...</div><button class="closePanel">close</button>';
            var mapIdTiles = mapId.split("_");
            markupToAdd += '<img src="/game-world/generateMapImage.php?playerId=' + characterId + '&sepia=true&tileX=' + mapIdTiles[0] + '&tileY=' + mapIdTiles[1] + '&radius=12&scale=0.3&overlay=true">';
            markupToAdd += '</div>';
            treasureMapPanels.insertAdjacentHTML('beforeend', markupToAdd);
            hero.activeTreasureMaps.push(mapId);
        }
    },
    showTreasureMap: function(mapId) {
        document.getElementById('treasureMap' + mapId).classList.add("active");
    },
    openHireFollowerPanel: function(whichNPC) {
        hireRetinueFollowerPanelContent.innerHTML = '<img src="/images/retinue/' + whichNPC.followerId + '.png" alt="">Would you like to hire ' + whichNPC.name + '?';
        hireRetinueFollowerPanel.classList.add('active');
        hireRetinueFollowerPanel.setAttribute('data-NPC', whichNPC.uniqueIndex);
    },
    closeHireFollowerPanel: function() {
        hireRetinueFollowerPanel.classList.remove('active');
        dialogue.classList.add("slowerFade");
        dialogue.classList.remove("active");
    },
    touchTapAction: function() {
        // simulate the Action key being pressed:
        key[4] = 1;
    },
    openHousingPanel: function() {
        housingPanel.classList.add('active');
    },
    openHousingConstructionPanel: function() {
        housingConstructionPanel.classList.add('active');
        document.addEventListener("click", housingNameSpace.worldClickHandler, false);
        document.addEventListener("mousemove", housingNameSpace.mouseMove, false);
        if (hero.housing.draftCost) {
            if (hero.housing.draftCost != 0) {
                // get the cost for the stored draft version:
                housingNameSpace.runningCostTotal = hero.housing.draftCost;
            }
        }
        housingNameSpace.restoreDraft = JSON.parse(JSON.stringify(hero.housing.draft));
        // disable weather effects while in building mode:
        changeWeather("");
        gameMode = 'housing';
    },
    closeHousingConstructionPanel: function() {
        // not called anywhere yet
        housingConstructionPanel.classList.remove('active');
        document.removeEventListener("click", housingNameSpace.worldClickHandler, false);
        document.removeEventListener("mousemove", housingNameSpace.mouseMove, false);
        gameMode = 'play';
    },
    showYesNoDialogueBox: function(heading, button1Text, button2Text, button1Function, button2Function) {
        yesNoDialogueButton1.innerText = button1Text;
        var button1FunctionSplit = button1Function.split(".");
        if (button1FunctionSplit.length > 1) {
            yesNoDialogueButton1.onclick = window[button1FunctionSplit[0]][button1FunctionSplit[1]];
        } else {
            yesNoDialogueButton1.onclick = window[button1Function];
        }
        yesNoDialogueButton2.innerText = button2Text;
        var button2FunctionSplit = button2Function.split(".");
        if (button2FunctionSplit.length > 1) {
            yesNoDialogueButton2.onclick = window[button2FunctionSplit[0]][button2FunctionSplit[1]];
        } else {
            yesNoDialogueButton2.onclick = window[button2Function];
        }
        yesNoDialogueHeading.innerHTML = heading;
        yesNoDialoguePanel.classList.add('active');
    },
    hideYesNoDialogueBox: function() {
        yesNoDialoguePanel.classList.remove('active');
    },

    generatePetInventorySlot: function(petIndex) {
        var petInventoryMarkup = '';
        var thisSlotsID, thisAction;
        var thisPet = hero.allPets[petIndex];
        var activeClass = '';
        if (hero.activePets.indexOf(petIndex) != -1) {
            activeClass = ' active';
        }
        petInventoryMarkup += '<div class="inventoryBag' + activeClass + '" id="petInventoryBag' + petIndex + '"><div class="draggableBar">' + thisPet.name + '</div><ol id="bag' + petIndex + '">';
        // loop through slots for each bag:
        for (var j = 0; j < thisPet.inventorySize; j++) {
            thisSlotsID = 'p' + petIndex + '-' + j;
            petInventoryMarkup += '<li id="slot' + thisSlotsID + '">';
            // check if that key exists in inventory:
            if (thisSlotsID in hero.inventory) {
                petInventoryMarkup += generateSlotMarkup(thisSlotsID);
                thisAction = currentActiveInventoryItems[hero.inventory[thisSlotsID].type].action;
            } else {
                petInventoryMarkup += '';
            }
            // add item there
            petInventoryMarkup += '</li>';
        }
        petInventoryMarkup += '</ol></div></div>';
        return petInventoryMarkup;
    },
    openBank: function(bankObjectX, bankObjectY, passedBankObject) {
        UI.showUI();
        // store the coordinates of the NPC or item that triggered this opening:
        bankObject.x = bankObjectX;
        bankObject.y = bankObjectY;
        bankObject.active = true;
        if (typeof passedBankObject !== "undefined") {
            bankObject.passedObject = passedBankObject;
        }
        inventoryBankTitle.innerHTML = thisMapData[currentMap].zoneName + " bank";
        inventoryBank.classList.add('active');
        audio.playSound(soundEffects['bagOpen'], 0);
    },
    closeBank: function() {
        // if it's an NPC then keep them on this speech:
        if (typeof bankObject.passedObject !== "undefined") {
            if (typeof bankObject.passedObject.speechIndex !== "undefined") {
                bankObject.passedObject.speechIndex--;
            }
        }
        bankObject.active = false;
        delete bankObject.passedObject;
        inventoryBank.classList.remove('active');
    },
    addBankSlots: function() {
        UI.hideYesNoDialogueBox();
        var howManyToAdd = 2;
        var inventoryMarkup = '';
        hero.currency.money -= amountForTheNextBankSlot;
        amountForTheNextBankSlot *= 2.8;
        UI.updateCurrencies();
        audio.playSound(soundEffects['coins'], 0);
        var numberOfBankSlots = hero.bags[(UI.whichInvenotryPanelIsTheBank)].bankSlots;
        for (var i = 1; i <= howManyToAdd; i++) {
            inventoryMarkup += '<li id="slot' + UI.whichInvenotryPanelIsTheBank + '-' + (numberOfBankSlots + i) + '"></li>'
        }
        document.getElementById('bag' + UI.whichInvenotryPanelIsTheBank).insertAdjacentHTML('beforeend', inventoryMarkup);
        hero.bags[(UI.whichInvenotryPanelIsTheBank)].bankSlots += howManyToAdd;
        if (hero.bags[(UI.whichInvenotryPanelIsTheBank)].bankSlots == maximumBankSlotsPossible) {
            document.getElementById('bankBuyMoreSlots').style.display = 'none';
        }
    },
    buyMoreBankSlots: function() {
        if (hero.bags[(UI.whichInvenotryPanelIsTheBank)].bankSlots < maximumBankSlotsPossible) {
            if (hero.currency.money >= amountForTheNextBankSlot) {
                UI.showYesNoDialogueBox("Purchase 3 more bank slots for " + parseMoney(amountForTheNextBankSlot) + "?", "Yes", "No", "UI.addBankSlots", "UI.hideYesNoDialogueBox");
            } else {
                UI.showNotification("<p>I don't have enough money&hellip;</p>");
            }
        } else {
            UI.showNotification("<p>I've already got as many as I can have.</p>");
        }

    }


}