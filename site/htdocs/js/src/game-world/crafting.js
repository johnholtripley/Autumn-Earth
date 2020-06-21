function recipeSearchAndFilter() {
    // Convert to lowercase for search. Search name and if not, then description too

    // default to showing all:
    var foundKeys = hero.crafting[currentRecipePanelProfession].sortOrder;
    if (recipeSearch.value != '') {
        var searchTerm = recipeSearch.value.toLowerCase();
        foundKeys = [];
        for (var key in hero.crafting[currentRecipePanelProfession].recipes) {
            if (hero.crafting[currentRecipePanelProfession].recipes[key]['recipeName'].toLowerCase().indexOf(searchTerm) != -1) {
                foundKeys.push(key);
            } else if (hero.crafting[currentRecipePanelProfession].recipes[key]['recipeDescription'].toLowerCase().indexOf(searchTerm) != -1) {
                foundKeys.push(key);
            }
        }
    }
    var recipeListItems = document.querySelectorAll('#createRecipeList li'),
        i;
    // hide all:
    for (i = 0; i < recipeListItems.length; ++i) {
        recipeListItems[i].classList.remove('active');
    }
    // show those that are relevant:
    var numberBeingShown = 0;
    var recipeFilterSplit = recipeFilter.value.split(",");
    for (i = 0; i < foundKeys.length; i++) {
        // only show those keys that are in this filter set:
        if (recipeFilterSplit.indexOf(foundKeys[i].toString()) != -1) {
            document.getElementById("recipe" + foundKeys[i]).classList.add('active');
            numberBeingShown++;
        }
    }
    if (numberBeingShown == 0) {
        document.getElementById("noRecipesFound").classList.add('active');
    }
    if (UI.highlightedRecipe != "") {
        // check if the highlighted one is visible or not:
        if (!(document.getElementById(UI.highlightedRecipe).classList.contains('active'))) {
            document.getElementById(UI.highlightedRecipe).classList.remove('highlighted');
            craftingRecipeCreateButton.disabled = true;
            UI.highlightedRecipe = "";
        }
    }
    // resize the scroll bar (if it's used):
    if (thisDevicesScrollBarWidth > 0) {
        recipeCustomScrollBar.init();
    }
}

function recipeSearchInput() {
    if (recipeSearch.value != '') {
        clearRecipeSearch.classList.add("active");
    } else {
        clearRecipeSearch.classList.remove("active");
    }
    recipeSearchAndFilter();
}

function recipeSearchClear() {
    recipeSearch.value = '';
    clearRecipeSearch.classList.remove("active");
    recipeSearchAndFilter();
}

function recipeSelectComponents(whichRecipe, isInAWorkshop) {

    // if isInAWorkshop is true, then it's a recipe being created at a workshop, otherwise, the player is crafting directly themselves
    releaseLockedSlots();
    craftingTimeBarOuter.style.display = 'none';
    startCrafting.style.display = 'block';
    startCrafting.disabled = true;
    craftingSelectComponentsPanel.classList.add("active");
    var recipeId;

    if (isInAWorkshop) {
        // these recipes have a hyphen and the workshop hash to make them unique, so that needs removing:
        recipeId = whichRecipe.split("-")[0].substring(6);

    } else {
        recipeId = whichRecipe.substring(6);
    }

    var recipeRequiresADye = false;
    var previousRecipeType = "-";
    var foundItemGroups;
    
    if (isInAWorkshop) {
        // need to get recipe components ####
        // john
        /*​
            components: Array(3) [ {…}, {…}, {…} ]  ​
            creates: "12"
            defaultColour: "4"
            hiddenCreates: ""
            imageId: "12-blue"
            prerequisite: "0"
            recipeDescription: "A standard pigment dye."
            recipeName: "Blue Dye"
            tier: "10"
        */
    } else {
        // make a copy so that influences don't get stored for next time:
        var thisRecipe = JSON.parse(JSON.stringify(hero.crafting[currentRecipePanelProfession].recipes[recipeId]));
    }


    craftingObject = {
        'componentsAdded': [],
        'whichRecipe': whichRecipe,
        'thisRecipe': thisRecipe,
        'required': [],
        'componentInfluences': [],
        'craftedItem': {
            'type': parseInt(thisRecipe.creates),
            'quantity': 1,
            'quality': 0,
            'durability': 0,
            'effectiveness': 0,
            'currentWear': 0,
            'wrapped': 0,
            'colour': 0,
            'enchanted': 0,
            'hallmark': 0 - characterId,
            'inscription': ""
        },
        'finalItemName': thisRecipe.recipeName,
        'isCreating': false,
        'optionalDyeAdded': 0
    }

    var componentsRequiredMarkup = '<h4>Requires:</h4><ul>';
    // find all components that the player has that are usable for this recipe as well:
    var availableComponentMarkup = '<h4>Available:</h4><ul>';
    var thisItemAttributes, thisItemInfluences;
    var componentsFound = 0;
    var displayItemMarkup = '<div id="craftingOutput"><div id="craftingOutputAttributes"></div><img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"></div><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p>';
    // complete any undefined influences:
    var influencesWithDefinedValues = {
        "durability": 0,
        "effectiveness": 0,
        "quality": 0
    };

    var totalInfluences = {
        "durability": 0,
        "effectiveness": 0,
        "quality": 0
    };


    var thisComponentDurability, thisComponentEffectiveness, thisComponentQuality, thisComponentFound;


    var thisNumberOfComponents = thisRecipe.components.length;
    for (var i in thisRecipe.components) {
        if (thisRecipe.components[i].influence != null) {
            for (var j in thisRecipe.components[i].influence) {
                totalInfluences[j] += thisRecipe.components[i].influence[j];
                influencesWithDefinedValues[j]++;
            }
        } else {
            // create the individual keys to be tested for later:
            thisRecipe.components[i].influence = {
                "durability": undefined,
                "effectiveness": undefined,
                "quality": undefined
            }
        }
    }
    //console.log(thisRecipe.components);
    for (var i in thisRecipe.components) {
        thisComponentFound = false;
        thisItemInfluences = '';
        if (typeof thisRecipe.components[i].influence["effectiveness"] !== "undefined") {
            thisComponentEffectiveness = thisRecipe.components[i].influence["effectiveness"];
        } else {
            thisComponentEffectiveness = (100 - totalInfluences["effectiveness"]) / (thisNumberOfComponents - influencesWithDefinedValues["effectiveness"]);
        }
        if (typeof thisRecipe.components[i].influence["durability"] !== "undefined") {
            thisComponentDurability = thisRecipe.components[i].influence["durability"];
        } else {
            thisComponentDurability = (100 - totalInfluences["durability"]) / (thisNumberOfComponents - influencesWithDefinedValues["durability"]);
        }
        if (typeof thisRecipe.components[i].influence["quality"] !== "undefined") {
            thisComponentQuality = thisRecipe.components[i].influence["quality"];
        } else {
            thisComponentQuality = (100 - totalInfluences["quality"]) / (thisNumberOfComponents - influencesWithDefinedValues["quality"]);
        }

        // store these values:
        craftingObject.componentInfluences[thisRecipe.components[i].type] = {
            'effectiveness': thisComponentEffectiveness,
            'durability': thisComponentDurability,
            'quality': thisComponentQuality
        };
        if (!(isNaN(thisRecipe.components[i].type))) {
            // specific item - make sure not already added this (if more than 1 quantity required):
            componentsRequiredMarkup += '<li id="componentType' + thisRecipe.components[i].type + '">' + generateAttributeGraphicMarkup(thisComponentQuality, thisComponentDurability, thisComponentEffectiveness) + '<img src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" class="planImage" alt="' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + '"><p>' + thisRecipe.components[i].quantity + 'x ' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + '</p></li>';
            foundItemGroups = findSlotItemIdInInventory(thisRecipe.components[i].type);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                    componentsFound++;
                    thisComponentFound = true;
                }
            }
        } else {
            // item group:
            componentsRequiredMarkup += '<li id="componentType' + thisRecipe.components[i].type + '">' + generateAttributeGraphicMarkup(thisComponentQuality, thisComponentDurability, thisComponentEffectiveness) + '<img class="previewSlot" src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" class="planImage" alt=""><p>' + thisRecipe.components[i].quantity + 'x ' + currentItemGroupFilters[(thisRecipe.components[i].type)] + '</p></li>';
            foundItemGroups = hasItemTypeInInventory(thisRecipe.components[i].type);

            if (thisRecipe.components[i].type == "dye") {
                recipeRequiresADye = true;
            }
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                    componentsFound++;
                    thisComponentFound = true;
                }
            }
        }
        craftingObject.required.push({ 'type': thisRecipe.components[i].type, 'quantity': thisRecipe.components[i].quantity });
        if (!thisComponentFound) {
            availableComponentMarkup += '<li class="componentMissing">You\'re missing a component type</li>';
        }
        if (thisRecipe.components[i].type != previousRecipeType) {
            availableComponentMarkup += '</ul><ul>';
        }
        previousRecipeType = thisRecipe.components[i].type;

    }

    if (componentsFound == 0) {
        availableComponentMarkup += '<li id="noComponentsAvailable"><p>You don\'t have any of the required components for this recipe.</p></li></ul><ul>';
    }
    // add the dye slot, only if the created item can be dyed:
    if (currentActiveInventoryItems[thisRecipe.creates].dyeable > 0) {
        componentsRequiredMarkup += '<li id="componentTypeAdditionalDye"><img src="/images/game-world/inventory-items/dye.png" alt=""><p>Dye (optional)</p></li>';
        // try and find any dyes that could be added to the recipe:

        // don't duplicate them if the recipe has a dye in it
        if (!recipeRequiresADye) {
            foundItemGroups = hasItemTypeInInventory('dye');
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                }
            }
        }
    }
    // add the enchant slot:
    componentsRequiredMarkup += '<li id="componentTypeAdditionalImbue"><img src="/images/game-world/inventory-items/enchant.png" alt=""><p>Imbue item (optional)</p></li>';

    componentsRequiredMarkup += '</ul>';
    availableComponentMarkup += '</ul>';
    selectComponentsItemBeingCreated.innerHTML = componentsRequiredMarkup;
    componentsAvailableForThisRecipe.innerHTML = availableComponentMarkup;
    displayItemBeingCreated.innerHTML = displayItemMarkup;
}

function releaseLockedSlots() {
    // clear any locked elements:
    var allLockedSlots = document.querySelectorAll('#inventoryPanels .locked');
    for (var i = 0; i < allLockedSlots.length; i++) {
        allLockedSlots[i].classList.remove("locked");
    }
}

function addCraftingComponents(fromSlotId, isADoubleClick) {

    var slotId = fromSlotId.substring(8);
    var amountUsed, thisQuantityDisplay, addedToSlot, thisTempAddedObject, okToAddThisComponent;
    var justAddedADye = false;
    // see how many of this type are still required:
    for (var i = 0; i < craftingObject.required.length; i++) {
        // check by type and group:
        okToAddThisComponent = false;
        if ((craftingObject.required[i].type == hero.inventory[slotId].type) || (craftingObject.required[i].type == currentActiveInventoryItems[hero.inventory[slotId].type].group)) {
            if (craftingObject.required[i].quantity > 0) {
                okToAddThisComponent = true;
            } else if (isADoubleClick) {
                // see if there's just one of this type already added:
                var variantsOfThisTypeAlreadyAdded = 0;
                var indexOfLastFound = -1;
                for (var j = 0; j < craftingObject.componentsAdded.length; j++) {
                    if (craftingObject.componentsAdded[j].type == craftingObject.required[i].type) {
                        variantsOfThisTypeAlreadyAdded++;
                        indexOfLastFound = j;
                    }
                }
                // if it's just 1, then it's easy to replace with a double click:
                if (variantsOfThisTypeAlreadyAdded == 1) {
                    // make sure it's not from the same slot:
                    if (craftingObject.componentsAdded[indexOfLastFound].fromSlot != slotId) {
                        // remove visually from added component list:
                        document.querySelector('#componentType' + craftingObject.required[i].type + ' .addedItemToRecipe').remove();
                        // restore quantity visually:
                        thisQuantityDisplay = document.querySelector('#fromSlot' + craftingObject.componentsAdded[indexOfLastFound].fromSlot + ' .qty');
                        thisQuantityDisplay.classList.remove('modified');
                        thisQuantityDisplay.textContent = hero.inventory[craftingObject.componentsAdded[indexOfLastFound].fromSlot].quantity;
                        // restore the amount needed:
                        craftingObject.required[i].quantity = craftingObject.componentsAdded[indexOfLastFound].quantity;
                        // remove from added object:
                        craftingObject.componentsAdded.splice(indexOfLastFound, 1);
                        // add new: 
                        okToAddThisComponent = true;
                    }
                }
            }
            if (okToAddThisComponent) {
                if (currentActiveInventoryItems[hero.inventory[slotId].type].group == "dye") {
                    justAddedADye = true;
                }
                amountUsed = craftingObject.required[i].quantity;
                if (craftingObject.required[i].quantity > hero.inventory[slotId].quantity) {
                    amountUsed = hero.inventory[slotId].quantity;
                }
                craftingObject.required[i].quantity -= amountUsed;
                craftingObject.componentsAdded.push({ 'fromSlot': slotId, 'quantity': amountUsed, 'type': craftingObject.required[i].type });
                thisQuantityDisplay = document.querySelector('#' + fromSlotId + ' .qty');
                thisQuantityDisplay.classList.add('modified');
                thisQuantityDisplay.textContent = hero.inventory[slotId].quantity - amountUsed;
                addedToSlot = document.getElementById('componentType' + hero.inventory[slotId].type);
                if (!addedToSlot) {
                    addedToSlot = document.getElementById('componentType' + currentActiveInventoryItems[hero.inventory[slotId].type].group);
                }
                if (addedToSlot) {
                    thisTempAddedObject = JSON.parse(JSON.stringify(hero.inventory[slotId]));
                    thisTempAddedObject.quantity = amountUsed;
                    addedToSlot.innerHTML += '<div class="addedItemToRecipe">' + generateCraftingSlotMarkup(thisTempAddedObject) + '</div>';
                }
            }
        }
    }
    // see if it's an optional dye:
    if (currentActiveInventoryItems[hero.inventory[slotId].type].group == 'dye') {
        // make sure the dye wasn't just added as part of the recipe:
        if (!justAddedADye) {
            craftingObject.componentsAdded.push({ 'fromSlot': slotId, 'quantity': 1, 'type': 'dye' });
            thisQuantityDisplay = document.querySelector('#' + fromSlotId + ' .qty');
            thisQuantityDisplay.classList.add('modified');
            thisQuantityDisplay.textContent = hero.inventory[slotId].quantity - 1;
            thisTempAddedObject = JSON.parse(JSON.stringify(hero.inventory[slotId]));
            thisTempAddedObject.quantity = 1;
            document.getElementById('componentTypeAdditionalDye').innerHTML += '<div class="addedItemToRecipe">' + generateCraftingSlotMarkup(thisTempAddedObject) + '</div>';
            craftingObject.optionalDyeAdded++;
        }
    }

    var allComponentsAdded = true;
    // check if that's all of the crafting components added now:
    for (var i = 0; i < craftingObject.required.length; i++) {
        if (craftingObject.required[i].quantity > 0) {
            allComponentsAdded = false;
        }
    }

    if (allComponentsAdded) {

        // any optional dyes will only account for 10% of the attributes:   
        if (craftingObject.optionalDyeAdded > 0) {
            // adjust the already determined influences to add up to 90% to allow 10% for the dyes:
            for (var i in craftingObject.componentInfluences) {
                craftingObject.componentInfluences[i].durability *= 0.9;
                craftingObject.componentInfluences[i].effectiveness *= 0.9;
                craftingObject.componentInfluences[i].quality *= 0.9;
            }
            // add up all dye attributes, average and then * by 0.1:
            var numberOfDyesAdded = 0;
            var dyeQuality = 0;
            var dyeDurability = 0;
            var dyeEffectiveness = 0;
            for (var i in craftingObject.componentsAdded) {
                if (craftingObject.componentsAdded[i].type == "dye") {
                    numberOfDyesAdded++;
                    dyeQuality += hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].quality;
                    dyeDurability += hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].durability;
                    dyeEffectiveness += hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].effectiveness;
                }
            }
            dyeQuality *= 0.1 / numberOfDyesAdded;
            dyeDurability *= 0.1 / numberOfDyesAdded;
            dyeEffectiveness *= 0.1 / numberOfDyesAdded;
            craftingObject.componentInfluences['dye'] = {
                'effectiveness': dyeEffectiveness,
                'durability': dyeDurability,
                'quality': dyeQuality
            };
        }

        // display attributes of what will be crafted:
        var thisType;
        var coloursAdded = [];

        for (var i = 0; i < craftingObject.componentsAdded.length; i++) {
            thisType = craftingObject.componentsAdded[i].type;

            craftingObject.craftedItem.quality += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].quality, craftingObject.componentInfluences[thisType].quality);
            craftingObject.craftedItem.durability += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].durability, craftingObject.componentInfluences[thisType].durability);
            craftingObject.craftedItem.effectiveness += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].effectiveness, craftingObject.componentInfluences[thisType].effectiveness);
            if (hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].colour != 0) {
                coloursAdded.push(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].colour);
            }
        }

        craftingObject.craftedItem.quality = Math.floor(craftingObject.craftedItem.quality);
        craftingObject.craftedItem.durability = Math.floor(craftingObject.craftedItem.durability);
        craftingObject.craftedItem.effectiveness = Math.floor(craftingObject.craftedItem.effectiveness);

        document.getElementById('craftingOutputAttributes').innerHTML = generateAttributeGraphicMarkup(craftingObject.craftedItem.quality, craftingObject.craftedItem.durability, craftingObject.craftedItem.effectiveness);
        // determine colour:
        craftingObject.craftedItem.colour = mixColours(coloursAdded);
        if (craftingObject.craftedItem.colour != craftingObject.thisRecipe.defaultColour) {
            // change image and name prefix:
            var newColourImageSuffix = getColourName(craftingObject.craftedItem.colour, craftingObject.craftedItem.type);
            document.querySelector('#craftingOutput img').src = '/images/game-world/inventory-items/' + craftingObject.craftedItem.type + '-' + newColourImageSuffix.toLowerCase() + '.png';
            craftingObject.finalItemName = newColourImageSuffix + ' ' + currentActiveInventoryItems[craftingObject.craftedItem.type].shortname;
            document.querySelector('#displayItemBeingCreated h3').innerText = craftingObject.finalItemName;
        } else {
            document.querySelector('#displayItemBeingCreated h3').innerText = craftingObject.thisRecipe.recipeName;
            document.querySelector('#craftingOutput img').src = '/images/game-world/inventory-items/' + craftingObject.thisRecipe.imageId + '.png';
        }
        startCrafting.disabled = false;
    } else {
        startCrafting.disabled = true;
        // restore defaults:
        document.getElementById('craftingOutputAttributes').innerHTML = '';
        document.querySelector('#displayItemBeingCreated h3').innerText = craftingObject.thisRecipe.recipeName;
        document.querySelector('#craftingOutput img').src = '/images/game-world/inventory-items/' + craftingObject.thisRecipe.imageId + '.png';
    }
}

function startCraftingTimer() {
    // show short progress timer:
    craftingObject.timeRemaining = 100;
    craftingObject.depletionSpeed = 0.5;
    craftingObject.isCreating = true;
    UI.updateCraftingPanel();
    craftingTimeBarOuter.style.display = 'block';
    // hide Create button:
    startCrafting.style.display = 'none';
    // play sound for the active profession:
    audio.playSound(soundEffects[hero.crafting[currentRecipePanelProfession].name.toLowerCase()], 0);
}

function processCrafting() {
    craftingObject.timeRemaining -= craftingObject.depletionSpeed;
    if (craftingObject.timeRemaining <= 0) {
        craftingObject.isCreating = false;
        startCraftingProcess();
    }
    UI.updateCraftingPanel();
}

function startCraftingProcess() {
    hero.stats.itemsCrafted++;
    // unlock slots so new items can be stacked:
    releaseLockedSlots();
    // add to inventory (or post if full):
    inventoryCheck = canAddItemToInventory([craftingObject.craftedItem]);
    if (inventoryCheck[0]) {
        UI.showChangeInInventory(inventoryCheck[1]);
    } else {
        // send the item by post:
        var subjectLine = "Your crafted " + craftingObject.finalItemName;
        var message = "This is fine work";
        var whichNPC = "Artisan crafter";
        sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [craftingObject.craftedItem]);
        UI.showNotification("<p>My crafted item is in the post</p>");
    }

    // check for hiddenResults to see if any empty containers (for example) need giving back to the player:
    if (craftingObject.thisRecipe.hiddenCreates) {
        var thisReturnedObject;
        var returnedItems = craftingObject.thisRecipe.hiddenCreates.split(",");
        for (var i = 0; i < returnedItems.length; i++) {
            thisReturnedObject = {
                "type": parseInt(returnedItems[i]),
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
        }
        inventoryCheck = canAddItemToInventory([thisReturnedObject]);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            // send the item by post:
            var subjectLine = "Your returned crafting items";
            var message = "Returned items";
            var whichNPC = "Artisan crafter";
            sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [thisReturnedObject]);
            UI.showNotification("<p>My crafted item is in the post</p>");
        }




    }

    // also check for any optional dyes and return the glass bottles for those:
    if (craftingObject.optionalDyeAdded > 0) {
        var thisReturnedObject = {
            "type": 11,
            "quantity": craftingObject.optionalDyeAdded,
            "quality": 100,
            "durability": 100,
            "currentWear": 0,
            "effectiveness": 100,
            "colour": 0,
            "enchanted": 0,
            "hallmark": 0,
            "inscription": ""
        }
        inventoryCheck = canAddItemToInventory([thisReturnedObject]);
        if (inventoryCheck[0]) {
            UI.showChangeInInventory(inventoryCheck[1]);
        } else {
            // send the item by post:
            var subjectLine = "Your returned crafting items";
            var message = "Returned items";
            var whichNPC = "Artisan crafter";
            sendNPCPost('{"subject":"' + subjectLine + '","message":"' + message + '","senderID":"-1","recipientID":"' + characterId + '","fromName":"' + whichNPC + '"}', [thisReturnedObject]);
            UI.showNotification("<p>My crafted item is in the post</p>");
        }




    }



    // remove used components:
    for (var i = 0; i < craftingObject.componentsAdded.length; i++) {
        removeFromInventory(craftingObject.componentsAdded[i].fromSlot, craftingObject.componentsAdded[i].quantity);
    }
    // update the available items:
    recipeSelectComponents(craftingObject.whichRecipe, false);
    // restore Create button:
    startCrafting.style.display = 'block';
    craftingTimeBarOuter.style.display = 'none';

}

function determineAttributeValue(itemValue, influenceAmount) {
    return Math.sqrt((itemValue * influenceAmount * influenceAmount) / 100);
}

function findRecipeTierLevel(toolQuality) {
    // example quality -> tier output:
    // 0->0.0, 5->0.0, 10->0.1, 15->0.1, 20->0.2, 25->0.3, 30->0.5, 35->0.6, 40->0.8, 45->1.1, 50->1.3, 55->1.6, 60->2.0, 65->2.4, 70->2.9, 75->3.4, 80->4.0, 85->4.7, 90->5.6, 95->6.9, 100->10.0
    var diff = (toolQuality / 10);
    var tierLevel = 10 - (Math.sqrt(100 - diff * diff));
    return tierLevel;
}

function gradeAttribute(attributeValue) {
    /*
    Very poor 1-10
    Poor 11-35
    Average 36-65
    Good 66-90
    Exceptional 91-100
    */
    var map = [
        { max: 91, grade: "#04752c" },
        { max: 66, grade: "#82b11e" },
        { max: 36, grade: "#b98c45" },
        { max: 11, grade: "#ab471d" }
    ];
    for (var loop = 0; loop < map.length; loop++) {
        var data = map[loop];
        if (attributeValue >= data.max) return data.grade;
    }
    return "#b41119";
}

function generateCraftingSlotMarkup(thisItemObject) {
    var slotMarkup = '<div class="attributeSlot">';
    var theColourPrefix = "";
    var thisFileColourSuffix = "";
    var imageClassName = "";
    var thisColourName = getColourName(thisItemObject.colour, thisItemObject.type);
    if (thisColourName != "") {
        theColourPrefix = thisColourName + " ";
        thisFileColourSuffix = "-" + thisColourName.toLowerCase();
    }
    // check if it's a card:
    if (currentActiveInventoryItems[thisItemObject.type].action == "card") {
        imageClassName += 'players card';
    }
    slotMarkup += generateAttributeGraphicMarkup(thisItemObject.quality, thisItemObject.durability, thisItemObject.effectiveness);
    slotMarkup += '<img src="/images/game-world/inventory-items/' + thisItemObject.type + thisFileColourSuffix + '.png" ' + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';

    slotMarkup += '<span class="qty">' + thisItemObject.quantity + '</span></div>';
    slotMarkup += '<p>' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '</p>';
    return slotMarkup;
}

function generateAttributeGraphicMarkup(thisQuality, thisDurability, thisEffectiveness) {
    return '<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' + gradeAttribute(thisEffectiveness) + '"/><path d="M6.699 75a50 50 0 0 1 0-50A50 50 0 0 1 50 0v50z" fill="' + gradeAttribute(thisQuality) + '"/><path d="M50 0a50 50 0 0 1 43.301 25 50 50 0 0 1 0 50l-43.3-25z" fill="' + gradeAttribute(thisDurability) + '"/></svg>'
}