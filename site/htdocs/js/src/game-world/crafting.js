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
    craftingSelectComponentsPanel.classList.add("active");
    var recipeId = whichRecipe.substring(6);
    var foundItemGroups;
    var specificsAlreadyFound = [];
    var thisRecipe = hero.crafting[currentRecipePanelProfession].recipes[recipeId];
    var beingCreatedMarkup = '<h4>Requires:</h4>';
    // find all components that the player has that are usable for this recipe as well:
    var availableComponentMarkup = '<h4>Available:</h4><ul>';

    var componentsFound = 0;
    var displayItemMarkup = '<img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p>';
    beingCreatedMarkup += '<ul>';
    for (var i in thisRecipe.components) {
        if (!(isNaN(thisRecipe.components[i].type))) {
            // specific item - make sure not already added this (if more than 1 quantity required):
            if (specificsAlreadyFound.indexOf(thisRecipe.components[i].type) === -1) {
                beingCreatedMarkup += '<li><img class="previewSlot" src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" alt="' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + '">' + currentActiveInventoryItems[thisRecipe.components[i].type].shortname + ' (' + thisRecipe.components[i].quantity + ')</li>';
                foundItemGroups = findSlotItemIdInInventory(thisRecipe.components[i].type);
                if (foundItemGroups.length > 0) {
                    for (var j = 0; j < foundItemGroups.length; j++) {
                        availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateSlotMarkup(foundItemGroups[j]) + '</li>';
                        componentsFound++;
                    }
                }
                specificsAlreadyFound.push(thisRecipe.components[i].type);
            }
        } else {
            // item group:
            
            beingCreatedMarkup += '<li><img class="previewSlot" src="/images/game-world/inventory-items/' + thisRecipe.components[i].type + '.png" alt="">' + currentItemGroupFilters[(thisRecipe.components[i].type)] + ' (' + thisRecipe.components[i].quantity + ')</li>';
            foundItemGroups = hasItemTypeInInventory(thisRecipe.components[i].type);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot' + foundItemGroups[j] + '">' + generateSlotMarkup(foundItemGroups[j]) + '</li>';
                    componentsFound++;
                }
            }
        }
    }
    if (componentsFound == 0) {
        availableComponentMarkup += "<li><p>You don't have any of the required components for this recipe.</p></li>";
    }
    // add the dye slot, only if the created item can be dyed:
    if (currentActiveInventoryItems[thisRecipe.creates].dyeable > 0) {
        beingCreatedMarkup += '<li><img class="previewSlot" src="/images/game-world/inventory-items/dye.png" alt="">Dye (optional)</li>';
    }
    // add the enchant slot:
    beingCreatedMarkup += '<li><img class="previewSlot" src="/images/game-world/inventory-items/enchant.png" alt="">Imbue item (optional)</li>';
    beingCreatedMarkup += '</ul>';
    availableComponentMarkup += '</ul>';
    selectComponentsItemBeingCreated.innerHTML = beingCreatedMarkup;
    componentsAvailableForThisRecipe.innerHTML = availableComponentMarkup;
    displayItemBeingCreated.innerHTML = displayItemMarkup;
}

function findRecipeTierLevel(toolQuality) {
    return toolQuality;
}