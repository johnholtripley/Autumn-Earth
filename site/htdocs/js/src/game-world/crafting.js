function recipeSearchAndFilter() {
 // Convert to lowercase for search. Search name and if not, then description too ######
}

function recipeSearchInput() {
    if(UI.recipeSearch.value != '') {
UI.clearRecipeSearch.classList.add("active");
    } else {
        UI.clearRecipeSearch.classList.remove("active");
    }
    recipeSearchAndFilter();
}

function recipeSearchClear() {
    UI.recipeSearch.value = '';
    UI.clearRecipeSearch.classList.remove("active");
    recipeSearchAndFilter();
}