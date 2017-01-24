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
if(recipeCustomScrollBar) {
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
    var recipeId = whichRecipe.substring(6);
    var foundItemGroups;
    var thisRecipe = hero.crafting[currentRecipePanelProfession].recipes[recipeId];
    var beingCreatedMarkup = '<img src="/images/game-world/inventory-items/' + thisRecipe.imageId + '.png" alt="' + thisRecipe.recipeName + '"><h3>' + thisRecipe.recipeName + '</h3><p>' + thisRecipe.recipeDescription + '</p><h4>Requires:</h4>';
    // find all components that the player as that are usable for this recipe as well:
    var availableComponentMarkup = '<h4>Available:</h4><ul>';
    var componentsRequired = thisRecipe.components.split(",");
    var componentsFound = 0;
    beingCreatedMarkup += '<ul>';
    for (var i = 0; i < componentsRequired.length; i++) {
        if (!(isNaN(componentsRequired[i]))) {
            // specific item:
            beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/' + componentsRequired[i] + '.png" alt="' + currentActiveInventoryItems[componentsRequired[i]].shortname + '">' + currentActiveInventoryItems[componentsRequired[i]].shortname + '</li>';
            foundItemGroups = findSlotItemIdInInventory(componentsRequired[i]);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot'+foundItemGroups[j]+'">' + generateSlotMarkup(foundItemGroups[j]) + '</li>';
                    componentsFound++;
                }
            }
        } else {
            // item group:
            beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/' + componentsRequired[i] + '.png" alt="">' + currentItemGroupFilters[(componentsRequired[i])] + '</li>';
            foundItemGroups = hasItemTypeInInventory(componentsRequired[i]);
            if (foundItemGroups.length > 0) {
                for (var j = 0; j < foundItemGroups.length; j++) {
                    availableComponentMarkup += '<li id="fromSlot'+foundItemGroups[j]+'">' + generateSlotMarkup(foundItemGroups[j]) + '</li>';
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
        beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/dye.png" alt="">Optional dye</li>';
    }
    // add the enchant slot:
    beingCreatedMarkup += '<li><img src="/images/game-world/inventory-items/enchant.png" alt="">Optional enchanted item</li>';
    beingCreatedMarkup += '</ul>';
    availableComponentMarkup += '</ul>';
    selectComponentsItemBeingCreated.innerHTML = beingCreatedMarkup;
    componentsAvailableForThisRecipe.innerHTML = availableComponentMarkup;
}
