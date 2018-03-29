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
    for (i = 0; i < foundKeys.length; i++) {
        // only show those keys that are in this filter set:
        if (recipeFilter.value.indexOf(foundKeys[i]) != -1) {
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

function recipeSelectComponents(whichRecipe) {
    releaseLockedSlots();
    craftingSelectComponentsPanel.classList.add("active");
    var recipeId = whichRecipe.substring(6);
    var foundItemGroups;
    var thisRecipe = hero.crafting[currentRecipePanelProfession].recipes[recipeId];
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
        'finalItemName': thisRecipe.recipeName
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
    var tempInfluenceObject;

    var SVGoutput, requiredSVGoutput, thisComponentDurability, thisComponentEffectiveness, thisComponentQuality;
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

    for (var i in thisRecipe.components) {
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
        requiredSVGoutput = '<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' + gradeAttribute(thisComponentEffectiveness) + '"/><path d="M6.699 75a50 50 0 0 1 0-50A50 50 0 0 1 50 0v50z" fill="' + gradeAttribute(thisComponentQuality) + '"/><path d="M50 0a50 50 0 0 1 43.301 25 50 50 0 0 1 0 50l-43.3-25z" fill="' + gradeAttribute(thisComponentDurability) + '"/></svg>';
        if (!(isNaN(thisRecipe.components[i].type))) {
            // specific item - make sure not already added this (if more than 1 quantity required):
            componentsRequiredMarkup += '<li><div class="gradedItem">' + requiredSVGoutput + '<img src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" alt="' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + '"><span class="qty">' + thisRecipe.components[i].quantity + '</span></div><p>' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + '</p></li>';
            foundItemGroups = findSlotItemIdInInventory(thisRecipe.components[i].type);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    SVGoutput = '<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' + gradeAttribute(hero.inventory[foundItemGroups[j]].effectiveness) + '"/><path d="M6.699 75a50 50 0 0 1 0-50A50 50 0 0 1 50 0v50z" fill="' + gradeAttribute(hero.inventory[foundItemGroups[j]].quality) + '"/><path d="M50 0a50 50 0 0 1 43.301 25 50 50 0 0 1 0 50l-43.3-25z" fill="' + gradeAttribute(hero.inventory[foundItemGroups[j]].durability) + '"/></svg>';
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '"><div class="gradedItem">' + SVGoutput + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</div></li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                    componentsFound++;
                }
            }
        } else {
            // item group:
            componentsRequiredMarkup += '<li><div class="gradedItem">' + requiredSVGoutput + '<img class="previewSlot" src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" alt=""><span class="qty">' + thisRecipe.components[i].quantity + '</span></div><p>' + currentItemGroupFilters[(thisRecipe.components[i].type)] + '</p></li>';
            foundItemGroups = hasItemTypeInInventory(thisRecipe.components[i].type);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    SVGoutput = '<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' + gradeAttribute(hero.inventory[foundItemGroups[j]].effectiveness) + '"/><path d="M6.699 75a50 50 0 0 1 0-50A50 50 0 0 1 50 0v50z" fill="' + gradeAttribute(hero.inventory[foundItemGroups[j]].quality) + '"/><path d="M50 0a50 50 0 0 1 43.301 25 50 50 0 0 1 0 50l-43.3-25z" fill="' + gradeAttribute(hero.inventory[foundItemGroups[j]].durability) + '"/></svg>';
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '"><div class="gradedItem">' + SVGoutput + generateCraftingSlotMarkup(hero.inventory[foundItemGroups[j]]) + '</li>';
                    // 'lock' this slot:
                    document.getElementById('slot' + foundItemGroups[j]).classList.add('locked');
                    componentsFound++;
                    //craftingObject.groupsFound.push(foundItemGroups);
                }
            }
        }
        craftingObject.required.push({ 'type': thisRecipe.components[i].type, 'quantity': thisRecipe.components[i].quantity });
    }

    if (componentsFound == 0) {
        availableComponentMarkup += "<li><p>You don't have any of the required components for this recipe.</p></li>";
    }
    // add the dye slot, only if the created item can be dyed:
    if (currentActiveInventoryItems[thisRecipe.creates].dyeable > 0) {
        componentsRequiredMarkup += '<li><img src="/images/game-world/inventory-items/dye.png" alt=""><p>Dye (optional)</p></li>';
    }
    // add the enchant slot:
    componentsRequiredMarkup += '<li><img src="/images/game-world/inventory-items/enchant.png" alt=""><p>Imbue item (optional)</p></li>';
    componentsRequiredMarkup += '</ul>';
    availableComponentMarkup += '</ul>';
    selectComponentsItemBeingCreated.innerHTML = componentsRequiredMarkup;
    componentsAvailableForThisRecipe.innerHTML = availableComponentMarkup;
    displayItemBeingCreated.innerHTML = displayItemMarkup;
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
    var slotMarkup = '';
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
    slotMarkup += '<img src="/images/game-world/inventory-items/' + thisItemObject.type + thisFileColourSuffix + '.png" ' + 'alt="' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '" class="' + imageClassName + '">';

    slotMarkup += '<span class="qty">' + thisItemObject.quantity + '</span></div>';
    slotMarkup += '<p>' + theColourPrefix + currentActiveInventoryItems[thisItemObject.type].shortname + '</p>';
    return slotMarkup;
}

function releaseLockedSlots() {
    // clear any locked elements:
    var allLockedSlots = document.querySelectorAll('#inventoryPanels .locked');
    for (var i = 0; i < allLockedSlots.length; i++) {
        allLockedSlots[i].classList.remove("locked");
    }
}

function addCraftingComponents(fromSlotId) {
    //console.log(craftingObject);
    var slotId = fromSlotId.substring(8);
    var amountUsed, thisQuantityDisplay;
    // see how many of this type are still required:
    for (var i = 0; i < craftingObject.required.length; i++) {
        if (craftingObject.required[i].quantity > 0) {
            // check by type and group:
            if ((craftingObject.required[i].type == hero.inventory[slotId].type) || (craftingObject.required[i].type == currentActiveInventoryItems[hero.inventory[slotId].type].group)) {
                amountUsed = craftingObject.required[i].quantity;
                if (craftingObject.required[i].quantity > hero.inventory[slotId].quantity) {
                    amountUsed = hero.inventory[slotId].quantity;
                }
                craftingObject.required[i].quantity -= amountUsed;
                // keep track of what's been added (and from where) to remove it from the inventory if crafting goes ahead:
                craftingObject.componentsAdded.push({ 'fromSlot': slotId, 'quantity': amountUsed, 'type': craftingObject.required[i].type });
                // show the changed quantities in the Available panel:
                thisQuantityDisplay = document.querySelector('#' + fromSlotId + ' .qty');
                thisQuantityDisplay.classList.add('modified');
                thisQuantityDisplay.textContent = hero.inventory[slotId].quantity - amountUsed;
                // show the items added in the Required column:
                // ###################
            }
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
        startCrafting.disabled = false;
        // display attributes of what will be crafted:
        var thisType;
        var coloursAdded = [];
        for (var i = 0; i < craftingObject.componentsAdded.length; i++) {
            thisType = craftingObject.componentsAdded[i].type;
            craftingObject.craftedItem.quality += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].quantity, craftingObject.componentInfluences[thisType].quality);
            craftingObject.craftedItem.durability += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].durability, craftingObject.componentInfluences[thisType].durability);
            craftingObject.craftedItem.effectiveness += determineAttributeValue(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].effectiveness, craftingObject.componentInfluences[thisType].effectiveness);
            if (hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].colour != 0) {
                coloursAdded.push(hero.inventory[(craftingObject.componentsAdded[i].fromSlot)].colour);
            }
        }

        craftingObject.craftedItem.quality = Math.floor(craftingObject.craftedItem.quality);
        craftingObject.craftedItem.durability = Math.floor(craftingObject.craftedItem.durability);
        craftingObject.craftedItem.effectiveness = Math.floor(craftingObject.craftedItem.effectiveness);
        // build SVG:
        var SVGoutput = '<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' + gradeAttribute(craftingObject.craftedItem.effectiveness) + '"/><path d="M6.699 75a50 50 0 0 1 0-50A50 50 0 0 1 50 0v50z" fill="' + gradeAttribute(craftingObject.craftedItem.quality) + '"/><path d="M50 0a50 50 0 0 1 43.301 25 50 50 0 0 1 0 50l-43.3-25z" fill="' + gradeAttribute(craftingObject.craftedItem.durability) + '"/></svg>';
        document.getElementById('craftingOutputAttributes').innerHTML = SVGoutput;
        // determine colour:
        craftingObject.craftedItem.colour = mixColours(coloursAdded);
        if (craftingObject.craftedItem.colour != craftingObject.thisRecipe.defaultColour) {
            // change image and name prefix:
            var newColourImageSuffix = getColourName(craftingObject.craftedItem.colour, craftingObject.craftedItem.type);
            document.querySelector('#craftingOutput img').src = '/images/game-world/inventory-items/' + craftingObject.craftedItem.type + '-' + newColourImageSuffix.toLowerCase() + '.png';
            craftingObject.finalItemName = newColourImageSuffix + ' ' + currentActiveInventoryItems[craftingObject.craftedItem.type].shortname;
            document.querySelector('#displayItemBeingCreated h3').innerText = craftingObject.finalItemName;
        }
    }
}

function startCraftingProcess() {

    // show short progress timer:
    // ########



    // play sound for the active profession:
    audio.playSound(soundEffects[hero.crafting[currentRecipePanelProfession].name.toLowerCase()], 0);


    hero.stats.itemsCrafted++;
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
        UI.showNotification("<p>Crafted item sent by post to you</p>");
    }
    // remove used components:
    for (var i = 0; i < craftingObject.componentsAdded.length; i++) {
        removeFromInventory(craftingObject.componentsAdded[i].fromSlot, craftingObject.componentsAdded[i].quantity);
    }
    // update the available items:
    recipeSelectComponents(craftingObject.whichRecipe);
}

function determineAttributeValue(itemValue, influenceAmount) {
    return Math.sqrt((itemValue * influenceAmount * influenceAmount) / 100);
}