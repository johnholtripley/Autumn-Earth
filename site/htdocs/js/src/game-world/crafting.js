function recipeSearchAndFilter() {
    // Convert to lowercase for search. Search name and if not, then description too ######

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

    
var recipeListItems = document.querySelectorAll('#createRecipeList li'), i;
// hide all:
for (i = 0; i < recipeListItems.length; ++i) {
  recipeListItems[i].classList.remove('active');
}
// show those that are relevant:
for (i = 0; i < foundKeys.length; ++i) {
	document.getElementById("recipe"+foundKeys[i]).classList.add('active');
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
